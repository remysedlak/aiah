"""
RAG Accountant Bot - Find IRS tax forms using natural language
"""

from sentence_transformers import SentenceTransformer
from transformers import pipeline
import numpy as np
from typing import List, Dict
import json

class RAGAccountantBot:
    def __init__(self):
        # Job 1: Embedding model (text -> numbers)
        print("Loading embedding model...")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')

        # Job 2: Generative model (optional - creates natural answers)
        print("Loading generative model...")
        self.generator = pipeline('text2text-generation',
                                 model='google/flan-t5-small',
                                 max_length=200)

        # Storage for documents and their embeddings
        self.documents = []
        self.doc_embeddings = None

    def add_documents(self, documents: List[Dict[str, str]]):
        """
        Add accounting documents to the system
        documents: List of dicts with 'filename' and 'content' keys
        """
        self.documents = documents

        # Create embeddings for all documents
        print(f"Creating embeddings for {len(documents)} documents...")
        doc_texts = [f"{doc['filename']} {doc['content']}" for doc in documents]
        self.doc_embeddings = self.embedder.encode(doc_texts)
        print("Documents indexed!")

    def find_relevant_files(self, query: str, top_k: int = 3) -> List[Dict]:
        """
        Find most relevant files based on natural language query
        Returns list of documents with similarity scores
        """
        if self.doc_embeddings is None:
            return []

        # Convert query to numbers
        query_embedding = self.embedder.encode(query)

        # Calculate similarity between query and all documents
        similarities = np.dot(self.doc_embeddings, query_embedding)

        # Get top matches
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
        """
        Generate natural language answer using found documents
        """
        if not relevant_docs:
            return "I couldn't find any relevant documents for your query."

        # Build context from relevant documents
        context = "\n".join([
            f"File: {doc['filename']}\nContent: {doc['content'][:300]}"
            for doc in relevant_docs
        ])

        # Create prompt for generative model
        prompt = f"""Answer the question based on these IRS tax forms:

{context}

Question: {query}
Answer:"""

        # Generate answer
        answer = self.generator(prompt)[0]['generated_text']
        return answer

    def query(self, user_query: str, use_generation: bool = True) -> Dict:
        """
        Main query function - complete RAG pipeline
        """
        # Step 1: Find relevant files
        relevant_docs = self.find_relevant_files(user_query, top_k=3)

        # Step 2: Generate natural answer (optional)
        if use_generation and relevant_docs:
            answer = self.generate_answer(user_query, relevant_docs)
        else:
            # Simple response without generation
            files = [doc['filename'] for doc in relevant_docs]
            answer = f"Found {len(files)} relevant files: {', '.join(files)}"

        return {
            'answer': answer,
            'relevant_files': relevant_docs
        }


# Example usage with IRS forms data
if __name__ == "__main__":
    # Initialize bot
    bot = RAGAccountantBot()

    # Load IRS forms from your data
    irs_forms_raw = [
        {
            "form_number": "1040",
            "title": "U.S. Individual Income Tax Return",
            "description": "Standard individual income tax form used to report personal income, calculate taxes owed or refund due.",
            "use_cases": ["individual tax return", "income reporting", "deductions", "credits"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1040.pdf"
        },
        {
            "form_number": "1120",
            "title": "U.S. Corporation Income Tax Return",
            "description": "Form used by C corporations to report income, gains, losses, deductions, and credits, and to figure the income tax liability.",
            "use_cases": ["corporate income", "business tax return", "deductions"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1120.pdf"
        },
        {
            "form_number": "W-2",
            "title": "Wage and Tax Statement",
            "description": "Form that reports an employee's annual wages and the amount of taxes withheld from their paycheck.",
            "use_cases": ["employee wages", "withholding", "year-end tax reporting"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/fw2.pdf"
        },
        {
            "form_number": "W-4",
            "title": "Employee's Withholding Certificate",
            "description": "Form completed by employees and submitted to employers to determine the amount of federal income tax to withhold from each paycheck.",
            "use_cases": ["employee withholding", "payroll setup", "income tax withholding", "new hire paperwork"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/fw4.pdf"
        },
        {
            "form_number": "941",
            "title": "Employer's Quarterly Federal Tax Return",
            "description": "Form used by employers to report income taxes, Social Security tax, or Medicare tax withheld from employee's paychecks and to pay the employer's portion of Social Security or Medicare tax.",
            "use_cases": ["payroll tax", "employer tax return", "withholding"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f941.pdf"
        },
        {
            "form_number": "1099-NEC",
            "title": "Nonemployee Compensation",
            "description": "Form used to report payments of $600 or more to nonemployees such as independent contractors.",
            "use_cases": ["contractor payments", "freelancer", "nonemployee compensation"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1099nec.pdf"
        },
        {
            "form_number": "Schedule SE (Form 1040)",
            "title": "Self-Employment Tax",
            "description": "Schedule used to calculate the self-employment tax owed on net earnings from self-employment, which covers Social Security and Medicare taxes.",
            "use_cases": ["self-employment tax", "freelancers", "independent contractors", "small business owners"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1040sse.pdf"
        },
        {
            "form_number": "1065",
            "title": "U.S. Return of Partnership Income",
            "description": "Form used by partnerships to report income, gains, losses, deductions, and credits.",
            "use_cases": ["partnership income", "business filing", "deductions"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1065.pdf"
        },
        {
            "form_number": "1120-S",
            "title": "U.S. Income Tax Return for an S Corporation",
            "description": "Form used by S corporations to report income, deductions, and pass-through activity to shareholders.",
            "use_cases": ["S corporation income", "pass-through entity", "corporate tax filing"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1120s.pdf"
        },
        {
            "form_number": "Schedule 8812 (Form 1040)",
            "title": "Credits for Qualifying Children and Other Dependents",
            "description": "Schedule used to calculate and claim the Child Tax Credit, Additional Child Tax Credit, and Credit for Other Dependents.",
            "use_cases": ["child tax credit", "dependent credits", "individual and small business owners with families"],
            "file_url": "https://www.irs.gov/pub/irs-pdf/f1040s8.pdf"
        }
    ]

    # Convert to bot format
    irs_forms = []
    for form in irs_forms_raw:
        irs_forms.append({
            'filename': f"Form {form['form_number']} - {form['title']}",
            'content': f"{form['description']} Use cases: {', '.join(form['use_cases'])}. URL: {form['file_url']}"
        })

    bot.add_documents(irs_forms)

    # Test 1: Individual tax return
    print("\n" + "="*80)
    print("TEST 1: Individual wants to file taxes")
    print("="*80)
    result = bot.query("I need to file my personal income taxes", use_generation=True)
    print(f"Query: 'I need to file my personal income taxes'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 2: Employee withholding
    print("\n" + "="*80)
    print("TEST 2: New employee needs withholding form")
    print("="*80)
    result = bot.query("what form does a new hire fill out for tax withholding?", use_generation=True)
    print(f"Query: 'what form does a new hire fill out for tax withholding?'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 3: Contractor payments
    print("\n" + "="*80)
    print("TEST 3: Business paying contractors")
    print("="*80)
    result = bot.query("how do I report payments to freelancers and independent contractors?", use_generation=True)
    print(f"Query: 'how do I report payments to freelancers and independent contractors?'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 4: Self-employed person
    print("\n" + "="*80)
    print("TEST 4: Self-employed individual")
    print("="*80)
    result = bot.query("I'm self-employed, what extra taxes do I need to pay?", use_generation=True)
    print(f"Query: 'I'm self-employed, what extra taxes do I need to pay?'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 5: Corporate taxes
    print("\n" + "="*80)
    print("TEST 5: Corporation filing taxes")
    print("="*80)
    result = bot.query("my C corporation needs to file its annual return", use_generation=True)
    print(f"Query: 'my C corporation needs to file its annual return'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 6: Child tax credit
    print("\n" + "="*80)
    print("TEST 6: Parent claiming child tax credit")
    print("="*80)
    result = bot.query("how do I claim the child tax credit for my kids?", use_generation=True)
    print(f"Query: 'how do I claim the child tax credit for my kids?'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 7: Partnership
    print("\n" + "="*80)
    print("TEST 7: Partnership filing")
    print("="*80)
    result = bot.query("what form do business partners use to file?", use_generation=True)
    print(f"Query: 'what form do business partners use to file?'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    # Test 8: Quarterly payroll taxes
    print("\n" + "="*80)
    print("TEST 8: Employer payroll taxes")
    print("="*80)
    result = bot.query("I need to file quarterly payroll taxes for my employees", use_generation=False)
    print(f"Query: 'I need to file quarterly payroll taxes for my employees'")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nTop matches:")
    for i, doc in enumerate(result['relevant_files'], 1):
        print(f"  {i}. {doc['filename']} (similarity: {doc['similarity']:.3f})")

    print("\n" + "="*80)
    print("All tests complete!")
    print("="*80)