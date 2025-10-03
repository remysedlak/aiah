python3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install requirements.txt 
cd backend
python3 process_pdfs.py
python3 app.py