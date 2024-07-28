import os
import requests

from dotenv import load_dotenv

from util import load_json, save_json
from courses import load_sections


load_dotenv()
API_URL = os.getenv('PROFESSORS_API')


def load_professors(sections: list, reload=False) -> list:
    '''
    Load list of all professors
    '''
    data = load_json('data.json')
    professors = data.get("professors")
    if professors and not reload:
        return professors

    data["professors"] = set()
    for section in sections:
        pass

    data["professors"] = list(data["professors"])
    save_json('data.json', data)
    print(f'Scraped {len(data["professors"])} professors')
    return data["professors"]


if __name__ == '__main__':
    sections = load_sections([])
    professor_names = list(set([f'{course["college"]}:{section["professor"]}' for course in sections for section in course["sections"]]))
    print(len(professor_names))
