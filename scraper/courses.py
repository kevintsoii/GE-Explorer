import os
import requests

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

from util import load_json, save_json


load_dotenv()
API_URL = os.getenv('COURSES_API')

MAX_RETRIES = 3
MAX_THREADS = 10


headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
}

params = {
    'filter[display_home_school]': 'false',
    'filter[search_all_universities]': 'true',
    'filter[search_type]': 'subject_browsing',
    'filter[subject_id]': '', # modify subject id
    'filter[oei_phase_2_filter]': 'false',
    'filter[show_only_available]': 'false',
    'filter[delivery_methods][]': 'online',
    'filter[delivery_method_subtypes][]': 'online_async',
    'filter[prerequisites][]': ['', 'no_prereqs'],
    'filter[session_names][]': 'Fall 2024', # modify semesters
    'page': '', # modify page number
}

specific_url = '/courses/%s?filter[day_ids][]=1&filter[day_ids][]=2&filter[day_ids][]=3&filter[day_ids][]=4&filter[day_ids][]=5&filter[day_ids][]=6&filter[day_ids][]=7&filter[delivery_method_subtypes][]=online_async&filter[delivery_methods][]=online&filter[oei_phase_2_filter]=false&filter[prerequisites][]=&filter[prerequisites][]=no_prereqs&filter[residency_id]=5&filter[search_all_universities]=true&filter[search_type]=subject_browsing&filter[session_names][]=Fall+2024&filter[show_only_available]=false&filter[show_self_paced]=true&filter[show_untimed]=true&filter[sort]=oei&filter[subject_id]=%s&filter[transferability][]=articulation' # course id, subject id | Fall 2024 semester


def load_subjects(reload=False) -> list:
    '''
    Load list of all subjects ids from cvc.edu
    '''
    subjects = load_json("subjects")
    if subjects and not reload:
        return subjects
    
    r = requests.get(f'https://search.{API_URL}/search?filter[search_all_universities]=true&filter[search_type]=subject_browsing', headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    subjects = [element.get('value') for element in soup.select('.search-tab-requirement option') if element.get('value')]

    save_json('subjects', subjects)
    print(f'Scraped {len(subjects)} subjects')
    return subjects

def scrape_courses(subject_id: str) -> list:
    '''
    Scrape courses for a specific subject
    '''
    courses = []
    page = 1
    retry_count = 0
    local_params = params.copy()
    local_params['filter[subject_id]'] = subject_id

    while retry_count < MAX_RETRIES:
        local_params['page'] = page
        try:
            r = requests.get(f'https://search.{API_URL}/search', headers=headers, params=local_params)
            if "There are no classes available that match your search!" in r.text:
                break

            soup = BeautifulSoup(r.text, 'html.parser')
            found_courses = soup.select('#search-results .course')
            for course in found_courses:
                course_id = course.select_one('.course-details-link').get('href').split('?')[0].split('/')[-1]
                courses.append(f'{course_id}:{subject_id}')
            
            retry_count = 0
            page += 1
        except Exception as e:
            print(f'Error: {e}')
            retry_count += 1
 
    print(f'Scraped {len(courses)} courses for subject {subject_id}')
    return list(courses)

def load_courses(subjects: list, reload=False) -> list:
    '''
    Load list of all courses for a list of subjects

    subjects: list of subject ids
    '''
    data = load_json('data.json')
    courses = data.get("cc_courses")
    if courses and not reload:
        return courses
    
    data["cc_courses"] = set()
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [executor.submit(scrape_courses, subject) for subject in subjects]
        for future in futures:
            result = future.result()
            if result:
                data["cc_courses"].update(result)

    data["cc_courses"] = list(data["cc_courses"])
    save_json('data.json', data)
    print(f'Scraped {len(data["cc_courses"])} GE courses')
    return data["cc_courses"]

def scrape_sections(course: str, subject: str) -> list:
    result = {"sections": [], "identifier": f"{subject}:{course}"}
    for _ in range(MAX_RETRIES):
        try:
            r = requests.get(f'https://search.{API_URL}{specific_url % (course, subject)}', headers=headers)

            soup = BeautifulSoup(r.text, 'html.parser')
            information = soup.select_one('.course')

            result["college"] = information.select_one('.subtitle .font-semibold').get_text().strip()
            result["course"] = information.select_one('.text-2xl').get_text().strip()
            descriptions = information.select('.course-description p')
            while descriptions:
                description = descriptions.pop().get_text().strip()
                if description:
                    result["description"] = description
                    break
            result["price"] = float(information.select_one('.text-c_link.text-2xl').get_text().strip().replace(',', '').replace('Tuition:$', ''))
            result["units"] = str(information.select_one('.purchase-details')).split(' unit')[0].split('">')[-1].strip()
            print(result["units"])

            for section in information.select('[data-controller="linked-section-apply-check"]'):
                result["sections"].append({
                    "date": section.select_one('.section-details-date').get_text().strip(),
                    "crn": section.select_one('.section-details-crn').get_text().strip(),
                    "professor": section.select_one('.section-details-professor').get_text().strip(),
                    "seats": section.select_one('.seat-count-live.seat-count .seat-count-number').get_text().strip(),
                    "seats_updated": section.select_one('.seat-count-live.seat-count .text-xs').get_text().strip(),
                    "format": section.select_one('[data-tooltip-title-value="Asynchronous: Online classes that do not have designated scheduled meeting times or real-time online class sessions."]').get_text().strip(),
                })
            
            print(f'Scraped {course} ({subject}): {len(result["sections"])} sections')
        except Exception as e:
            print(f'Error scraping {course} | {subject}: {e}')
    
    return result

def load_sections(courses: list, reload=False) -> list:
    '''
    Load list of all sections for a list of courses

    courses: list of course ids with corresponding subject id
    '''
    data = load_json('data.json')
    sections = data.get("cc_sections")
    if sections and not reload:
        return sections
    
    data["cc_sections"] = []
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [executor.submit(scrape_sections, course.split(':')[0], course.split(':')[1]) for course in courses]
        for future in futures:
            result = future.result()
            if result:
                data["cc_sections"].append(result)

    save_json('data.json', data)
    print(f'Scraped {sum(len(course["sections"]) for course in data["cc_sections"])} CC class sections')
    return data["cc_sections"]


if __name__ == '__main__':
    subjects = load_subjects()
    cc_courses = load_courses(subjects)
    sections = load_sections(cc_courses)
