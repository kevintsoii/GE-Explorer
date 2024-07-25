import os
import json


def load_json(file_path: str) -> dict:
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            f.write('{}')
            return {}
    
    with open(file_path, 'r') as f:
        return json.load(f)

def save_json(file_path: str, data: dict) -> None:
    with open(file_path, 'w') as f:
        json.dump(data, f)
