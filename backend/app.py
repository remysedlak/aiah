"""
FastAPI server for RAG Accountant Bot
Location: backend/app.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.rag_bot import RAGAccountantBot
from data.loader import load_irs_forms, convert_to_bot_format

app = FastAPI(
    title="IRS RAG Bot API",
    description="Natural language search for IRS tax forms using RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bot = None


class QueryRequest(BaseModel):
    query: str
    use_generation: bool = True
    top_k: int = 3


class RelevantFile(BaseModel):
    filename: str
    content: str
    similarity: float


class QueryResponse(BaseModel):
    query: str
    answer: str
    relevant_files: List[RelevantFile]
    total_documents: int


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    total_documents: int


@app.on_event("startup")
async def startup_event():
    global bot
    print("Starting IRS RAG Bot API...")
    try:
        bot = RAGAccountantBot()
        irs_forms_raw = load_irs_forms("data/irs_forms_metadata.json")
        irs_forms = convert_to_bot_format(irs_forms_raw)
        bot.add_documents(irs_forms)
        print(f"Bot loaded with {len(irs_forms)} IRS forms!")
        print("API ready at http://localhost:8000")
    except Exception as e:
        print(f"Error loading bot: {e}")
        raise


@app.get("/", response_model=HealthResponse)
async def root():
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not loaded")
    return {
        "status": "healthy",
        "model_loaded": bot is not None,
        "total_documents": len(bot.documents) if bot else 0
    }


@app.post("/api/query", response_model=QueryResponse)
async def query_bot(request: QueryRequest):
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not initialized")
    try:
        relevant_docs = bot.find_relevant_files(request.query, top_k=request.top_k)
        if request.use_generation and relevant_docs:
            answer = bot.generate_answer(request.query, relevant_docs)
        else:
            files = [doc['filename'] for doc in relevant_docs]
            answer = f"Found {len(files)} relevant files: {', '.join(files)}"
        return {
            "query": request.query,
            "answer": answer,
            "relevant_files": relevant_docs,
            "total_documents": len(bot.documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.get("/api/forms")
async def list_forms():
    if bot is None:
        raise HTTPException(status_code=503, detail="Bot not initialized")
    return {
        "total": len(bot.documents),
        "forms": [{"filename": doc['filename']} for doc in bot.documents]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
