"""
Data loader for IRS forms
Location: backend/data/loader.py
"""

import json
from typing import List, Dict


def load_irs_forms(file_path: str = "data/irs_forms_metadata.json") -> List[Dict]:
    with open(file_path, 'r') as f:
        irs_forms_raw = json.load(f)
    return irs_forms_raw


def convert_to_bot_format(irs_forms_raw: List[Dict]) -> List[Dict]:
    irs_forms = []
    for form in irs_forms_raw:
        irs_forms.append({
            'filename': f"Form {form['form_number']} - {form['title']}",
            'content': f"{form['description']} Use cases: {', '.join(form['use_cases'])}. URL: {form['file_url']}"
        })
    return irs_forms
