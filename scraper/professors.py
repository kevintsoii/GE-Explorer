import os
import re
import json
import requests

from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

from util import load_json, save_json
from courses import load_sections


load_dotenv()
API_URL = os.getenv('PROFESSORS_API')
AUTH = os.getenv('PROFESSORS_AUTH')

MAX_RETRIES = 3
MAX_THREADS = 10

headers = {
    'Authorization': f'Basic {AUTH}',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
}

query = '''
    query TeacherSearchResultsPageQuery($query: TeacherSearchQuery!) {
        search: newSearch {
            teachers(query: $query, first: 8, after: "") {
                resultCount
                edges {
                    node {
                        id
                        legacyId
                        firstName
                        lastName
                        numRatings
                        avgRating
                        avgDifficulty
                        wouldTakeAgainPercent
                        ratings(first: 9999) {
                            edges {
                                node {
                                    grade
                                    class
                                    isForOnlineClass
                                    helpfulRating
                                    difficultyRating
                                    wouldTakeAgain
                                    comment
                                    ratingTags
                                    date
                                }
                            }
                        }
                    }
                }
            }
        }
    }
'''


def scrape_college(college_name: str) -> str:
    '''
    Scrape college id by name
    '''
    # Special cases - have multiple campuses, false entries, or other issues
    if college_name.lower() == 'College of the Desert'.lower():
        return college_name, "U2Nob29sLTE4OTE="
    if college_name.lower() == 'Coastline College'.lower():
        return college_name, "U2Nob29sLTE4NzU="
    if college_name.lower() == 'Coalinga College'.lower():
        return college_name, "U2Nob29sLTE3OTIw"
    if college_name.lower() == 'Ohlone College'.lower():
        return college_name, "U2Nob29sLTE4ODU2"

    for _ in range(MAX_RETRIES):
        try:
            r = requests.get(f'https://{API_URL}/search/schools?q={college_name}', headers=headers)
            results = json.loads(re.search('window.__RELAY_STORE__ = (.*);', r.text).group(1))
            
            for college in results:
                if results[college]["__typename"] == 'School':
                    if results[college]["numRatings"] == 0:
                        continue
                    if results[college]["state"] and results[college]["state"] != 'CA':
                        continue
                    if college_name.lower() in results[college]["name"].lower():
                        
                        return college_name, results[college]["id"]
                    break
            
            print(f'College not found: {college_name}')
            break
        except Exception as e:
            print(f'Error: {e}')
    
    return None

def load_colleges(names: list, reload=False) -> list:
    '''
    Load college info for each college name
    '''
    data = load_json('data.json')
    colleges = data.get("colleges")
    if colleges and not reload:
        return colleges
    
    data["colleges"] = {}
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [executor.submit(scrape_college, name) for name in names]
        for future in futures:
            result = future.result()
            if result:
                name, id = result
                data["colleges"][name] = id
                data["colleges"][id] = name

    save_json('data.json', data)
    print(f'Scraped {len(data["colleges"])} colleges')
    return data["colleges"]

def clean_name(name: str) -> str:
    '''
    Formats the name for easier search functionality.
    Example: Jule L. Pattison, Ph.D. -> Jule Pattison
    '''
    # strip titles and suffixes
    cleaned_name = name.strip()
    for substring in  ['dr. ', 'mrs. ', 'mr. ', 'ms. ', 'dr ',  'mrs ', 'mr ', 'ms ']:
        if cleaned_name.lower().startswith(substring.lower()):
            cleaned_name = cleaned_name[len(substring):]
            break
    for substring in  [' Ph.D', ' jr.', 'jr', ', III', ', II', ' III', ' II']:
        if cleaned_name.lower().endswith(substring.lower()):
            cleaned_name = cleaned_name[:-len(substring)]
            break
    # remove trailing commas, periods, and spaces
    cleaned_name = cleaned_name.rstrip(',. ')
    # also handle some colleges only providing first initial
    if ', ' not in cleaned_name or len(cleaned_name.split(', ')[-1]) > 1:
        # handle possible middle intial or name
        if len(cleaned_name.split(' ')[-1]) == 1:
            cleaned_name = cleaned_name[:-2]
            cleaned_name = cleaned_name.split(' ')[-1] + ' ' + cleaned_name.split(',')[0]
        elif "," in cleaned_name:
            cleaned_name = cleaned_name.split(' ')[-1] + ' ' + cleaned_name.split(',')[0]
        else:
            cleaned_name = cleaned_name.split(' ')[0] + ' ' + cleaned_name.split(' ')[-1]
    else:
        cleaned_name = cleaned_name.split(',')[0] + cleaned_name[-3:]
    
    return cleaned_name.strip()

def scrape_professor(college_id: str, professor_name: str) -> tuple:
    '''
    Scrape id of a professor by their college
    '''
    cleaned_name = clean_name(professor_name)
    if ',' in cleaned_name:
        first = cleaned_name.split(',')[1].strip()
        last = cleaned_name.split(',')[0].strip()
    else:
        first = cleaned_name.split(' ')[0]
        last = cleaned_name.split(' ')[1]

    for _ in range(MAX_RETRIES):
        try:
            r = requests.post(
                f'https://{API_URL}/graphql',
                headers=headers,
                json={
                    "query": query,
                    "variables": {
                        "query": {
                            "text": cleaned_name,
                            "schoolID": college_id,
                            "fallback": True,
                            "departmentID": None
                        }
                    }
                }
            )
            results = r.json()["data"]["search"]["teachers"]["edges"]

            for professor in results:
                first_min_length = min(len(first), len(professor["node"]["firstName"]))
                last_min_length = min(len(last), len(professor["node"]["lastName"]))
                if first.lower()[:first_min_length] == professor["node"]["firstName"].lower()[:first_min_length] and last.lower()[:last_min_length] == professor["node"]["lastName"].lower()[:last_min_length]:
                    return college_id, {
                        "name": professor_name,
                        "id": professor["node"]["id"],
                        "legacyId": professor["node"]["legacyId"],
                        "firstName": professor["node"]["firstName"],
                        "lastName": professor["node"]["lastName"],
                        "numRatings": professor["node"]["numRatings"],
                        "avgRating": professor["node"]["avgRating"],
                        "avgDifficulty": professor["node"]["avgDifficulty"],
                        "wouldTakeAgainPercent": professor["node"]["wouldTakeAgainPercent"],
                        "ratings": [edge["node"] for edge in professor["node"]["ratings"]["edges"]]
                    }
    
            print(f'Professor not found: {professor_name}, {colleges[college_id]}')
            break
        except Exception as e:
            print(f'Error: {e}')
    
    return None

def load_professors(professor_data: list, college_dict: dict, reload=False) -> list:
    '''
    Load id of all professors

    professors: list of (college name, professor name) tuples
    '''
    data = load_json('data.json')
    professors = data.get("professors")
    if professors and not reload:
        return professors

    data["professors"] = {}
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [executor.submit(scrape_professor, college_dict[college_name], professor_name) for college_name, professor_name in professor_data]
        for future in futures:
            result = future.result()
            if result:
                college_id, professor_info = result
                college = college_dict[college_id]
                data["professors"].setdefault(college, []).append(professor_info)

    save_json('data.json', data)
    print(f'Scraped {sum(len(data["professors"][college]) for college in data["professors"])} / {len(professor_data)} professors')
    return data["professors"]


if __name__ == '__main__':
    '''
    1. Get College IDs from college names
    2. Get Professor info from collage id + professor name
    '''
    sections = load_sections([])    
    college_names = list(set(course["college"] for course in sections))
    colleges = load_colleges(college_names)

    professors = list(set((course["college"], section["professor"]) for course in sections for section in course["sections"]))
    professors_info = load_professors(professors, colleges)
