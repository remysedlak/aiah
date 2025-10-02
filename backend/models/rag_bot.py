"""
RAG Accountant Bot - Core model class
Location: backend/models/rag_bot.py
"""

from sentence_transformers import SentenceTransformer
from transformers import pipeline
import numpy as np
from typing import List, Dict


class RAGAccountantBot:
    def __init__(self):
        print("Loading embedding model...")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        print("Loading generative model...")
        self.generator = pipeline('text2text-generation',
                                 model='google/flan-t5-small',
                                 max_length=200)
        self.documents = []
        self.doc_embeddings = None

    def add_documents(self, documents: List[Dict[str, str]]):
        self.documents = documents
        print(f"Creating embeddings for {len(documents)} documents...")
        doc_texts = [f"{doc['filename']} {doc['content']}" for doc in documents]
        self.doc_embeddings = self.embedder.encode(doc_texts)
        print("Documents indexed!")

    def find_relevant_files(self, query: str, top_k: int = 3) -> List[Dict]:
        if self.doc_embeddings is None:
            return []
        query_embedding = self.embedder.encode(query)
        similarities = np.dot(self.doc_embeddings, query_embedding)
        top_indices = np.argsort(similarities)[::-1][:top_k]
        results = []
        for idx in top_indices:
            results.append({
                'filename': self.documents[idx]['filename'],
                'content': self.documents[idx]['content'],
                'similarity': float(similarities[idx])
            })
        return results

    def generate_answer(self, query: str, relevant_docs: List[Dict]) -> str:
        if not relevant_docs:
            return "I couldn't find any relevant documents for your query."
        context = "\n".join([
            f"File: {doc['filename']}\nContent: {doc['content'][:300]}"
            for doc in relevant_docs
        ])
        prompt = f"""Answer the question based on these IRS tax forms:

{context}

Question: {query}
Answer:"""
        answer = self.generator(prompt)[0]['generated_text']
        return answer

    def query(self, user_query: str, use_generation: bool = True) -> Dict:
        relevant_docs = self.find_relevant_files(user_query, top_k=3)
        if use_generation and relevant_docs:
            answer = self.generate_answer(user_query, relevant_docs)
        else:
            files = [doc['filename'] for doc in relevant_docs]
            answer = f"Found {len(files)} relevant files: {', '.join(files)}"
        return {
            'answer': answer,
            'relevant_files': relevant_docs
        }