## Requirements
Python 3.12
## API Setup
1. create pip environment
   -` python -m venv .venv`
2. enter environment
   - Powershell: `.venv\Scripts\Activate.ps1` 
   - Cmd: `.venv\Scripts\activate`
   - Mac: `source .venv/bin/activate`

3. install dependencies
   - `pip install requirements.txt `

4. start test server
   - `fastapi dev app/main.py`

5. test api
   - `http://127.0.0.1:8000/docs#/`
