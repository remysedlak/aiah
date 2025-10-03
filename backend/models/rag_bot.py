"""
Enhanced RAG Accountant Bot with PDF chunk support
Location: backend/models/rag_bot.py
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Optional


class RAGAccountantBot:
    def __init__(self, use_chunks: bool = False):
        """
        Initialize the RAG bot

        Args:
            use_chunks: If True, expects documents with PDF chunks.
                       If False, uses simple metadata format (backwards compatible)
        """
        print("Loading embedding model...")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.documents = []
        self.doc_embeddings = None
        self.use_chunks = use_chunks
        print("Bot ready!")

    def add_documents(self, documents: List[Dict[str, str]]):
        """Add documents and create embeddings"""
        self.documents = documents
        print(f"Creating embeddings for {len(documents)} documents...")

        # Create text for embedding - works for both simple and chunked formats
        doc_texts = []
        for doc in documents:
            # Combine filename and content for better context
            text = f"{doc['filename']} {doc['content']}"
            doc_texts.append(text)

        self.doc_embeddings = self.embedder.encode(doc_texts)
        print("Documents indexed!")

    def find_relevant_files(self, query: str, top_k: int = 3) -> List[Dict]:
        """Find most relevant documents using semantic search"""
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
                'similarity': float(similarities[idx]),
                'form_number': self.documents[idx].get('form_number'),
                'type': self.documents[idx].get('type'),
                'page': self.documents[idx].get('page'),
                'line_number': self.documents[idx].get('line_number')
            })

        return results

    def _parse_form_info(self, form_doc: Dict) -> Dict:
        """Extract form details from document"""
        filename = form_doc['filename']
        content = form_doc['content']

        # Parse form number and title from filename
        parts = filename.split(' - ')

        # Handle both "Form 1040 - Title" and "Form 1040 - Line 1" formats
        if 'Form ' in parts[0]:
            form_number = parts[0].replace('Form ', '').strip()
        else:
            form_number = form_doc.get('form_number', 'Unknown')

        form_title = parts[1] if len(parts) > 1 else "IRS Tax Form"

        # Parse description and use cases from content
        content_parts = content.split('Use cases:')
        description = content_parts[0].strip()

        use_cases = []
        if len(content_parts) > 1:
            use_case_text = content_parts[1].split('URL:')[0].strip()
            use_cases = [uc.strip() for uc in use_case_text.split(',')]

        return {
            'number': form_number,
            'title': form_title,
            'description': description,
            'use_cases': use_cases,
            'doc_type': form_doc.get('type', 'metadata'),
            'page': form_doc.get('page'),
            'line_number': form_doc.get('line_number')
        }

    def _group_results_by_form(self, relevant_docs: List[Dict]) -> Dict[str, List[Dict]]:
        """Group results by form number"""
        grouped = {}
        for doc in relevant_docs:
            form_num = doc.get('form_number', 'Unknown')
            if form_num not in grouped:
                grouped[form_num] = []
            grouped[form_num].append(doc)
        return grouped

    def generate_answer(self, query: str, relevant_docs: List[Dict]) -> str:
        """Generate friendly, helpful responses using templates"""
        if not relevant_docs:
            return "I couldn't find any forms matching your question. Could you try rephrasing it or adding more details about what you're trying to accomplish?"

        # Parse the top result
        top_doc = relevant_docs[0]
        info = self._parse_form_info(top_doc)

        # Detect query intent
        query_lower = query.lower()

        # Build response opener
        if any(word in query_lower for word in ['file', 'need', 'submit', 'fill out']):
            opener = f"You'll need **Form {info['number']}** ({info['title']})."
        elif any(word in query_lower for word in ['what', 'which', 'what form']):
            opener = f"That would be **Form {info['number']}** - {info['title']}."
        elif any(word in query_lower for word in ['how', 'help', 'explain']):
            opener = f"Let me help you with **Form {info['number']}** ({info['title']})."
        else:
            opener = f"I found **Form {info['number']}**: {info['title']}."

        # Add description or specific content
        if info['doc_type'] == 'metadata':
            # It's a form-level result
            explanation = f" {info['description']}"

            # Add use case context if relevant
            if info['use_cases']:
                primary_use = info['use_cases'][0]
                if len(primary_use) < 50:
                    explanation += f" This form is commonly used for {primary_use}."

        elif info['doc_type'] == 'line_item':
            # It's a specific line item
            explanation = f"\n\n**Line {info['line_number']}**: {top_doc['content']}"
            if info['page']:
                explanation += f" (Page {info['page']})"

        elif info['doc_type'] == 'section_header':
            # It's a section
            explanation = f"\n\nThis relates to the **{top_doc['content']}** section"
            if info['page']:
                explanation += f" on page {info['page']}"
            explanation += "."

        elif info['doc_type'] == 'instruction':
            # It's an instruction
            explanation = f"\n\n{top_doc['content'][:300]}"
            if len(top_doc['content']) > 300:
                explanation += "..."
            if info['page']:
                explanation += f"\n\n(From page {info['page']})"

        else:
            explanation = f" {info['description']}"

        # Check for related results from same form
        related_info = ""
        if self.use_chunks and len(relevant_docs) > 1:
            # Group by form to find related chunks
            grouped = self._group_results_by_form(relevant_docs)
            top_form = top_doc.get('form_number')

            if top_form in grouped and len(grouped[top_form]) > 1:
                other_chunks = [d for d in grouped[top_form] if d != top_doc][:2]
                if other_chunks:
                    related_info = "\n\n**Related sections:**"
                    for chunk in other_chunks:
                        chunk_info = self._parse_form_info(chunk)
                        if chunk_info['doc_type'] == 'line_item':
                            related_info += f"\n- Line {chunk_info['line_number']}"
                        elif chunk_info['page']:
                            related_info += f"\n- {chunk_info['doc_type']} on page {chunk_info['page']}"

        # Add helpful closing
        closing = ""
        if top_doc['similarity'] > 0.75:
            # High confidence - suggest related forms
            other_forms = [d for d in relevant_docs[1:] if d.get('type') == 'metadata']
            if other_forms:
                other_form = self._parse_form_info(other_forms[0])
                closing = f"\n\nYou might also want to check out **Form {other_form['number']}** if needed."
        else:
            # Lower confidence - encourage refinement
            closing = "\n\nIf this isn't quite what you're looking for, feel free to ask in a different way!"

        return opener + explanation + related_info + closing

    def query(self, user_query: str, use_generation: bool = True) -> Dict:
        """
        Main query interface

        Args:
            user_query: Natural language question
            use_generation: Whether to generate friendly response

        Returns:
            Dictionary with answer and relevant files
        """
        relevant_docs = self.find_relevant_files(user_query, top_k=5)

        if use_generation and relevant_docs:
            answer = self.generate_answer(user_query, relevant_docs)
        else:
            files = [doc['filename'] for doc in relevant_docs]
            answer = f"Found {len(files)} relevant forms: {', '.join(files)}"

        return {
            'answer': answer,
            'relevant_files': relevant_docs
        }