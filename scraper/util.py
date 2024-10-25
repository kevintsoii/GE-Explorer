import os
import json


def load_json(file_name: str) -> dict:
    file_path = f'./data/{file_name}.json'
    if not os.path.exists(file_path):
        return None
    
    with open(file_path, 'r') as f:
        return json.load(f)

def save_json(file_name: str, data: dict) -> None:
    file_path = f'./data/{file_name}.json'
    with open(file_path, 'w') as f:
        json.dump(data, f)
