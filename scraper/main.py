import os

from datetime import datetime
from dotenv import load_dotenv
from pymongo import errors
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from assist import load_csu_ges
from courses import load_sections
from professors import load_professors


load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
db = client["ge-explorer"]

grade_map = {
    'A+': 4.3, 'A': 4.0, 'A-': 3.7, 
    'B+': 3.4, 'B': 3.1, 'B-': 2.8,
    'C+': 2.5, 'C': 2.2, 'C-': 1.9,
    'D+': 1.6, 'D': 1.3, 'D-': 1.0,
    'F': 0.7
}


def save_ges():
    '''
    Collection ge-areas stores documents { area, title }
    Collection ge-transfers stores documents { college, courses[{ course, areas[] }] }
    '''
    ge_areas = db["ge-areas"]
    ge_transfers = db["ge-transfers"]
    ge_areas.create_index("area", unique=True)
    ge_transfers.create_index("college", unique=True)

    csu_ges = load_csu_ges([], year_id=75, current_term="F2024")

    area_info = {}
    transfer_info = {}
    for cc in csu_ges:
        transfer_info[cc] = []
        for course in csu_ges[cc]:
            transfer_info[cc].append({
                "course": f'{course["prefix"].upper()} {course["number"]}',
                "areas": [area["area"] for area in course["areas"]]
            })
            for area in course["areas"]:
                area_info[area["area"]] = area["title"]

    try:
        ge_areas.insert_many(
            [{"area": area, "title": area_info[area]} for area in area_info],
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass
    try:
        ge_transfers.insert_many(
            [{"college": cc, "courses": transfer_info[cc]} for cc in transfer_info],
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass
    print("Saved GE areas and transfers")

def save_courses():
    '''
    Collection cc-courses
    '''
    cc_sections = db["cc-courses"]
    cc_sections.create_index("identifier", unique=True)
    cc_sections.create_index("college")
    cc_sections.create_index("sections.professor")
    
    csu_ges = load_csu_ges([], year_id=75, current_term="F2024")
    transferrable = {}
    for cc in csu_ges:
        transferrable[cc] = set()
        for course in csu_ges[cc]:
            transferrable[cc].add(f'{course["prefix"].upper()}{course["number"]}'.replace(' ', '').replace('/', ''))

    courses = []
    sections = load_sections([])
    for course in sections:
        course_code = course["course"].split(" - ")[0]
        if course_code in transferrable[course["college"]]:
            for section in course["sections"]:
                section["seats"] = section["seats"].replace(' available seats', '')
                section["seats_updated"] = section["seats_updated"].replace('- ', '').replace('(about ', '').replace(')', '')
                del section["format"]
            course["title"] = course["course"].split(" - ")[-1]
            course["course"] = course["course"].split(" - ")[0]
            courses.append(course)

    try:
        cc_sections.insert_many(
            courses,
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass
    print("Saved courses")

def save_professors():
    '''
    Collection cc_professors
    '''
    cc_professors = db["cc-professors"]
    cc_professors.create_index("id", unique=True)
    cc_professors.create_index("college")
    cc_professors.create_index("avgRating")
    cc_professors.create_index("avgGrade")
    cc_professors.create_index("avgDifficulty")
    cc_professors.create_index("takeAgain")
    cc_professors.create_index("officialName")

    professors = []
    professor_info = load_professors([], {})
    for college in professor_info:
        for professor in professor_info[college]:
            reviews = []
            grades = []
            takeAgain = [0, 0]
            rating = difficulty = 0
            tags = {}
            for review in professor["ratings"]:
                reviews.append({
                    "class": review["class"].upper().replace(' ', '').replace('/', '').replace('-', ''),
                    "comment": review["comment"].strip(),
                    "date": datetime.strptime(review["date"][:-4], "%Y-%m-%d %H:%M:%S %z"),
                    "difficulty": review["difficultyRating"],
                    "rating": review["helpfulRating"],
                    "tags": review["ratingTags"].split('--'),
                    "takeAgain": None if review["wouldTakeAgain"] == None else review["wouldTakeAgain"] == 1,
                    "grade": None if not review["grade"] else review["grade"].strip().replace("_", " ").title()
                })

                review = reviews[-1]
                if review["grade"] in grade_map:
                    grades.append(grade_map[review["grade"]])
                if review["takeAgain"] != None:
                    takeAgain[1] += 1
                    if review["takeAgain"]:
                        takeAgain[0] += 1
                rating += review["rating"]
                difficulty += review["difficulty"]
                for tag in review["tags"]:
                    if tag not in tags:
                        tags[tag] = 0
                    tags[tag] += 1
            
            avg_grade = sum(grades) / len(grades) if len(grades) > 0 else None
            if avg_grade is not None:
                avg_grade = min(grade_map.keys(), key=lambda x: abs(grade_map[x] - avg_grade))

            professors.append({
                "id": professor["legacyId"],
                "officialName": professor["name"],
                "name": professor["firstName"] + " " + professor["lastName"],
                "college": college,

                "avgRating": round(rating / len(reviews), 1) if len(reviews) > 0 else None,
                "avgGrade": avg_grade,
                "avgDifficulty": round(difficulty / len(reviews), 1) if len(reviews) > 0 else None,
                "takeAgain": round((takeAgain[0] / takeAgain[-1]) * 100) if takeAgain[-1] > 0 else None,
                "tags": dict(sorted(tags.items(), key=lambda item: item[1], reverse=True)),
                "reviews": reviews
            })

    try:
        cc_professors.insert_many(
            professors,
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass
    print("Saved professors")


#save_ges()
#save_courses()
#save_professors()

client.close()