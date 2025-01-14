import requests
from concurrent.futures import ThreadPoolExecutor

from util import load_json, save_json


MAX_RETRIES = 3
MAX_THREADS = 10


def load_institutions(reload=False) -> list:
    '''
    Load list of all institutions from assist.org
    '''
    institutions = load_json('institutions')
    if institutions and not reload:
        return institutions

    institutions = []
    found_institutions = set()
    r = requests.get('https://assist.org/api/institutions')
    for institution in r.json():
        id = institution["id"] if 'alternateInstitutionId' not in institution["names"][-1] else institution["names"][-1]["alternateInstitutionId"]
        if id not in found_institutions:
            found_institutions.add(id)
            institutions.append({
                "id": id,
                "name": institution["names"][-1]["name"],
                "isCommunityCollege": institution["isCommunityCollege"]
            })

    save_json('institutions', institutions)
    print(f'Scraped {len(institutions)} institutions')
    return institutions

def isEnded(current_term: str, end_term: str) -> bool:
    if not end_term:
        return False

    current_year, end_year = int(current_term[-4:]), int(end_term[-4:])
    if current_year < end_year:
        return False
    if current_year > end_year:
        return True

    current_season, end_season = current_term[:-4], end_term[:-4]
    if any([
        current_season == 'F' and end_season in ['S', 'Su', 'F'],
        current_season == 'Su' and end_season in ['S', 'Su'],
        current_season == 'S' and end_season in ['S']
    ]):
        return True
    return end_term

def scrape_csu_ges(cc_id: int, year_id: int, current_term: str) -> dict:
    '''
    Scrape transferrable GE courses from a community college
    '''
    for _ in range(MAX_RETRIES):
        try:
            r = requests.get(f'https://assist.org/api/transferability/courses?institutionId={cc_id}&academicYearId={year_id}&listType=CSUGE')
            data = r.json()
            
            ges = []
            cc = data["institutionName"]
            for course in data["courseInformationList"]:
                ended = isEnded(current_term, course["endTermCode"])
                if ended is not True:
                    areas = []
                    for area in course["transferAreas"]:
                        ge_ended = isEnded(current_term, area["endTermCode"])
                        if ge_ended is not True:
                            areas.append({
                                "area": area["code"].strip(),
                                "title": area["codeDescription"].strip()
                            })
                    if areas:
                        course_info = {
                            "prefix": course["prefixCode"].strip(),
                            "number": course["courseNumber"].strip(),
                            "title": course["courseTitle"].strip(),
                            "areas": areas
                        }
                        #if type(ended) is str:
                        #    course_info["expiry"] = ended
                        #if type(ge_ended) is str:
                        #    course_info["expiry"] = course_info.setdefault("expiry", "") + ge_ended
                        ges.append(course_info)

            #print(f'{cc}: {len(ges)} CSU GEs')
            return {cc: ges}
        except Exception as e:
            print(f'Error scraping {cc_id}: {e}')
    
    return None

def load_csu_ges(cc_ids: list, year_id: int, current_term: str, reload=False):
    '''
    Load transferrable GE courses from each community college

    cc_ids: list of community college ids
    year_id: academic year id, from assist.org/api/academicYears
    current_term: current academic year, e.g. "F2024, Su2020, S2025"
    '''
    transferrability = load_json('transferrability')
    if transferrability and not reload:
        return transferrability

    transferrability = {}
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [executor.submit(scrape_csu_ges, cc_id, year_id, current_term) for cc_id in cc_ids]
        for future in futures:
            result = future.result()
            if result:
                transferrability.update(result)

    save_json('transferrability', transferrability)
    print(f'Scraped {sum(len(transferrability[k]) for k in transferrability)} CSU GEs')
    return transferrability


if __name__ == '__main__':
    institutions = load_institutions()
    cc_ids = [institution["id"] for institution in institutions if institution["isCommunityCollege"]]
    ges = load_csu_ges(cc_ids, year_id=75, current_term="S2025")
    # 75 = fall 2024 to fall 2025, 76 = fall 2025 to fall 2026
    # F, W, S, Su
