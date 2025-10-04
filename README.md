# Setup Guide

## Requirements
- Python 3.12+
- Node.js 22.0.0+

## Backend Setup

1. **Navigate and create environment**
```bash
   cd backend
   python -m venv .venv
```

   2.  Activate environment

       - Windows (PowerShell): `.venv\Scripts\Activate.ps1`
       
       -  Windows (CMD): `.venv\Scripts\activate`
       
       -  Mac/Linux: `source .venv/bin/activate`
        
   3.  Install dependencies

```bash

   pip install -r requirements.txt
```
   4. Process PDFs (optional - enables enhanced search)

```bash

   python utils/process_pdfs.py
```
  5. Start server
```bash
   # Simple mode (metadata only)
   python app.py
   # Enhanced mode (with PDF content)
   USE_ENHANCED_MODE=true python app.py
```
   6. Test API: http://127.0.0.1:8000/docs

## Frontend Setup

  1.   Install and run (in new terminal)

```bash

   cd frontend
   npm install
   npm run dev
```
 2, Open app: http://localhost:5173

## Dataset

Comprehensive IRS forms covering:

    Individual & Small Business: 1040, W-4, W-9, W-7, 1099-NEC, 8829
    Payroll & Employers: 941, 944, 940, 1095-C, SS-8
    Partnerships & S-Corps: 1065, K-1, 1120-S
    Corporations: 1120, 1120-W, Schedule M-3
    Compliance: SS-4, 2848, 4562, 720

Total: 27 forms in extensible JSON format for easy scaling.


