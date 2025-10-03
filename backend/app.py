"""
Enhanced FastAPI server for RAG Accountant Bot
Supports both simple metadata and enhanced PDF chunk modes
Location: backend/app.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from contextlib import asynccontextmanager
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.rag_bot import RAGAccountantBot
from data.loader import (
    load_irs_forms,
    convert_to_bot_format,
    convert_enhanced_to_bot_format
)

# Configuration
USE_ENHANCED_MODE = os.environ.get("USE_ENHANCED_MODE", "false").lower() == "true"

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths relative to app.py location
ENHANCED_DATA_PATH = os.path.join(BASE_DIR, "data", "irs_forms_enhanced.json")
SIMPLE_DATA_PATH = os.path.join(BASE_DIR, "data", "irs_forms_metadata.json")

# Global bot instance
bot = None
mode = "simple"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    global bot, mode

    # Startup
    print("Starting IRS RAG Bot API...")

    try:
        # Check if enhanced data exists
        enhanced_exists = os.path.exists(ENHANCED_DATA_PATH)

        if USE_ENHANCED_MODE and enhanced_exists:
            print("Loading ENHANCED mode with PDF chunks...")
            with open(ENHANCED_DATA_PATH, 'r') as f:
                enhanced_forms = json.load(f)

            bot_documents = convert_enhanced_to_bot_format(enhanced_forms)
            bot = RAGAccountantBot(use_chunks=True)
            bot.add_documents(bot_documents)
            mode = "enhanced"

            total_chunks = sum(len(f.get('chunks', [])) for f in enhanced_forms)
            print(f"✓ Loaded {len(enhanced_forms)} forms with {total_chunks} chunks")
            print(f"✓ Total searchable documents: {len(bot_documents)}")

        else:
            print("Loading SIMPLE mode (metadata only)...")
            if USE_ENHANCED_MODE and not enhanced_exists:
                print(f"⚠ Enhanced data not found at {ENHANCED_DATA_PATH}")
                print("  Run: python -m data.loader to process PDFs")

            irs_forms_raw = load_irs_forms(SIMPLE_DATA_PATH)
            irs_forms = convert_to_bot_format(irs_forms_raw)
            bot = RAGAccountantBot(use_chunks=False)
            bot.add_documents(irs_forms)
            mode = "simple"
            print(f"✓ Loaded {len(irs_forms)} forms (metadata only)")

        print(f"✓ API ready at http://localhost:8000")
        print(f"  Mode: {mode}")
        print(f"  Docs: http://localhost:8000/docs")

    except Exception as e:
        print(f"✗ Error loading bot: {e}")
        raise

    yield

    # Shutdown
    print("Shutting down IRS RAG Bot API...")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="IRS RAG Bot API",
    description="Natural language search for IRS tax forms using RAG with optional PDF content",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    use_generation: bool = True
    top_k: int = 5


class RelevantFile(BaseModel):
    filename: str
    content: str
    similarity: float
    form_number: Optional[str] = None
    type: Optional[str] = None
    page: Optional[int] = None
    line_number: Optional[str] = None


class QueryResponse(BaseModel):
    query: str
    answer: str
    relevant_files: List[RelevantFile]
    total_documents: int
    mode: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    total_documents: int
    mode: str
    enhanced_available: bool


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check and status endpoint"""
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not loaded")

    enhanced_exists = os.path.exists(ENHANCED_DATA_PATH)

    return {
        "status": "healthy",
        "model_loaded": bot is not None,
        "total_documents": len(bot.documents) if bot else 0,
        "mode": mode,
        "enhanced_available": enhanced_exists
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Alias for root health check"""
    return await root()


@app.post("/api/query", response_model=QueryResponse)
async def query_bot(request: QueryRequest):
    """
    Query the RAG bot with natural language

    In enhanced mode, searches both form metadata and PDF content chunks.
    In simple mode, searches only form metadata.
    """
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not initialized")

    try:
        result = bot.query(
            user_query=request.query,
            use_generation=request.use_generation
        )

        # Limit to top_k results
        relevant_files = result['relevant_files'][:request.top_k]

        return {
            "query": request.query,
            "answer": result['answer'],
            "relevant_files": relevant_files,
            "total_documents": len(bot.documents),
            "mode": mode
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.get("/api/forms")
async def list_forms():
    """List all available forms"""
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not initialized")

    # Get unique form numbers
    unique_forms = {}
    for doc in bot.documents:
        form_num = doc.get('form_number')
        if form_num and form_num not in unique_forms:
            unique_forms[form_num] = {
                "form_number": form_num,
                "filename": doc['filename']
            }

    return {
        "total": len(bot.documents),
        "unique_forms": len(unique_forms),
        "mode": mode,
        "forms": list(unique_forms.values())
    }


@app.get("/api/forms/{form_number}")
async def get_form_details(form_number: str):
    """Get all documents related to a specific form"""
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not initialized")

    # Find all documents for this form
    form_docs = [
        doc for doc in bot.documents
        if doc.get('form_number') == form_number
    ]

    if not form_docs:
        raise HTTPException(status_code=404, detail=f"Form {form_number} not found")

    # Organize by type
    metadata_docs = [d for d in form_docs if d.get('type') == 'metadata']
    chunk_docs = [d for d in form_docs if d.get('type') != 'metadata']

    return {
        "form_number": form_number,
        "total_documents": len(form_docs),
        "has_chunks": len(chunk_docs) > 0,
        "metadata": metadata_docs[0] if metadata_docs else None,
        "chunks": {
            "total": len(chunk_docs),
            "by_type": {
                "line_items": len([d for d in chunk_docs if d.get('type') == 'line_item']),
                "sections": len([d for d in chunk_docs if d.get('type') == 'section_header']),
                "instructions": len([d for d in chunk_docs if d.get('type') == 'instruction'])
            },
            "preview": chunk_docs[:5] if chunk_docs else []
        }
    }


@app.post("/api/switch_mode")
async def switch_mode():
    """Switch between simple and enhanced mode (requires restart)"""
    enhanced_exists = os.path.exists(ENHANCED_DATA_PATH)

    return {
        "current_mode": mode,
        "can_switch_to_enhanced": enhanced_exists,
        "message": "Set USE_ENHANCED_MODE=true environment variable and restart to switch modes" if enhanced_exists else "Enhanced data not available. Run: python -m data.loader"
    }


# Allow running directly with python app.py
if __name__ == "__main__":
    import uvicorn
    print("Starting server with: python app.py")
    print("For development with auto-reload, use: python -m uvicorn app:app --reload")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)