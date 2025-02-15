import os

from datetime import datetime
from dotenv import load_dotenv
from pymongo import errors
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import UpdateOne
from collections import defaultdict

from assist import load_csu_ges
from courses import load_courses
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
    ge_areas.create_index("area", unique=True)

    transferrability = load_csu_ges([], year_id=75, current_term="F2024")

    area_info = {}
    for cc in transferrability:
        for course in transferrability[cc]:
            for area in course["areas"]:
                area_info[area["area"]] = area["title"]

    try:
        ge_areas.insert_many(
            [{"area": area, "title": area_info[area]} for area in area_info],
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass

    print(f"Saved GE areas ({len(area_info)})")

def save_courses():
    '''
    Collection cc-courses
    '''
    cc_sections = db["cc-courses"]
    cc_sections.create_index("identifier", unique=True)
    cc_sections.create_index("college")
    cc_sections.create_index("sections.professor")
    cc_sections.create_index("sections.crn")
    
    transfer_areas = {}
    transferrable_courses = {}
    transferrability = load_csu_ges([], year_id=75, current_term="F2024")
    for cc in transferrability:
        transferrable_courses[cc] = set()
        transfer_areas[cc] = defaultdict(set)
        for course in transferrability[cc]:
            course_code = f'{course["prefix"].upper()}{course["number"]}'.replace(' ', '').replace('/', '')
            transferrable_courses[cc].add(course_code)
            transfer_areas[cc][course_code].update([x["area"] for x in course["areas"]])

    offerings = []
    courses = load_courses([])
    for course in courses:
        course_code = course["course"].split(" - ")[0]
        if course_code in transferrable_courses[course["college"]]:
            for section in course["sections"]:
                section["seats"] = section["seats"].replace(' available seats', '')
                section["seats_updated"] = section["seats_updated"].replace('- ', '').replace('(about ', '').replace(')', '')
                section["format"].replace("Online - ", "")
            course["title"] = course["course"].split(" - ")[-1]
            course["course"] = course["course"].split(" - ")[0]
            course["areas"] = list(transfer_areas[course["college"]][course_code])
            offerings.append(course)

    try:
        cc_sections.insert_many(
            offerings,
            ordered=False
        )
    except errors.BulkWriteError as e:
        pass
    print(f"Saved courses ({len(offerings)})")

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
    cc_professors.create_index([("officialName", 1), ("college", 1)])

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
            #if avg_grade is not None:
                #avg_grade = min(grade_map.keys(), key=lambda x: abs(grade_map[x] - avg_grade))

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

    operations = [
        UpdateOne(
            {"id": professor["id"]},
            {
                "$set": {
                    "officialName": professor["officialName"],
                    "name": professor["name"],
                    "college": professor["college"],
                    "avgRating": professor["avgRating"],
                    "avgGrade": professor["avgGrade"],
                    "avgDifficulty": professor["avgDifficulty"],
                    "takeAgain": professor["takeAgain"],
                    "tags": professor["tags"]
                },
                "$addToSet": {
                    "reviews": {"$each": professor.get("reviews", [])}
                }
            },
            upsert=True
        )
        for professor in professors
    ]
        
    try:
        cc_professors.bulk_write(operations)
    except Exception as e:
        print(e)
    print(f"Saved professors ({len(professors)})")


#save_ges()
#save_courses()
save_professors()

client.close()