"""
Enhanced data loader for IRS forms with PDF processing
Location: backend/data/loader.py
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict
import requests
import PyPDF2


def load_irs_forms(file_path: str = "data/irs_forms_metadata.json") -> List[Dict]:
    """Load raw IRS forms metadata from JSON"""
    with open(file_path, 'r') as f:
        irs_forms_raw = json.load(f)
    return irs_forms_raw


def convert_to_bot_format(irs_forms_raw: List[Dict]) -> List[Dict]:
    """Convert raw forms to simple bot format (backwards compatible)"""
    irs_forms = []
    for form in irs_forms_raw:
        irs_forms.append({
            'filename': f"Form {form['form_number']} - {form['title']}",
            'content': f"{form['description']} Use cases: {', '.join(form['use_cases'])}. URL: {form['file_url']}"
        })
    return irs_forms


# NEW ENHANCED FUNCTIONS

def download_pdf(url: str, form_number: str, pdf_dir: str = "data/pdfs") -> str:
    """Download PDF and return local path"""
    os.makedirs(pdf_dir, exist_ok=True)
    local_path = os.path.join(pdf_dir, f"{form_number}.pdf")

    if os.path.exists(local_path):
        return local_path

    try:
        print(f"  Downloading Form {form_number}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        with open(local_path, 'wb') as f:
            f.write(response.content)

        print(f"  ✓ Downloaded {form_number}.pdf")
        return local_path
    except Exception as e:
        print(f"  ✗ Error downloading {form_number}: {e}")
        return None


def extract_line_items(text: str, page_num: int) -> List[Dict]:
    """Extract line items from form text"""
    chunks = []

    # Pattern for line items like "1  Wages, salaries, tips..."
    pattern = r'^(\d+[a-z]?)\s+([A-Z].*?)(?=\n\d+[a-z]?\s|\n{2,}|$)'
    matches = re.finditer(pattern, text, re.MULTILINE)

    for match in matches:
        line_num = match.group(1)
        line_text = match.group(2).strip()

        if len(line_text) > 10:
            chunks.append({
                "type": "line_item",
                "line_number": line_num,
                "text": line_text,
                "page": page_num
            })

    return chunks


def extract_sections(text: str, page_num: int) -> List[Dict]:
    """Extract section headers"""
    chunks = []

    # Pattern for section headers: ALL CAPS text
    pattern = r'^([A-Z][A-Z\s]{9,})$'
    matches = re.finditer(pattern, text, re.MULTILINE)

    for match in matches:
        section_text = match.group(1).strip()

        # Filter out common false positives
        if section_text not in ['OMB NO', 'DEPARTMENT OF THE TREASURY']:
            chunks.append({
                "type": "section_header",
                "text": section_text,
                "page": page_num
            })

    return chunks


def extract_instructions(text: str, page_num: int) -> List[Dict]:
    """Extract instruction paragraphs"""
    chunks = []

    # Split by double newlines to get paragraphs
    paragraphs = re.split(r'\n{2,}', text)

    for para in paragraphs:
        para = para.strip()

        # Keep substantial paragraphs
        if len(para) > 50 and len(para.split()) > 8:
            # Check if it references a line number
            line_ref = re.search(r'[Ll]ine\s+(\d+[a-z]?)', para)

            chunks.append({
                "type": "instruction",
                "text": para,
                "page": page_num,
                "line_reference": line_ref.group(1) if line_ref else None
            })

    return chunks


def chunk_pdf(pdf_path: str, form_number: str) -> List[Dict]:
    """Extract and chunk PDF content"""
    if not PyPDF2:
        return []

    all_chunks = []

    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)

            for page_num, page in enumerate(reader.pages, start=1):
                text = page.extract_text()

                if not text.strip():
                    continue

                # Extract different types of content
                line_items = extract_line_items(text, page_num)
                sections = extract_sections(text, page_num)
                instructions = extract_instructions(text, page_num)

                all_chunks.extend(line_items)
                all_chunks.extend(sections)
                all_chunks.extend(instructions)

            # Add unique IDs to each chunk
            for idx, chunk in enumerate(all_chunks):
                chunk["chunk_id"] = f"{form_number}_chunk_{idx}"

    except Exception as e:
        print(f"    Error processing PDF: {e}")

    return all_chunks


def load_irs_forms_enhanced(
    file_path: str = "assets/irs_forms_metadata.json",
    download_pdfs: bool = False,
    pdf_dir: str = "data/pdfs"
) -> List[Dict]:
    """
    Load IRS forms with optional PDF downloading and chunking

    Args:
        file_path: Path to metadata JSON
        download_pdfs: Whether to download and process PDFs
        pdf_dir: Directory to store downloaded PDFs

    Returns:
        List of enhanced form dictionaries with chunks
    """
    # Load base metadata
    forms_raw = load_irs_forms(file_path)

    if not download_pdfs:
        # Return original format if not processing PDFs
        return forms_raw

    print(f"\nProcessing {len(forms_raw)} forms with PDF extraction...")
    enhanced_forms = []

    for idx, form in enumerate(forms_raw, 1):
        form_number = form['form_number']
        print(f"[{idx}/{len(forms_raw)}] Processing Form {form_number}...")

        # Download PDF
        pdf_path = download_pdf(form['file_url'], form_number, pdf_dir)

        if not pdf_path:
            # Keep original form without chunks
            enhanced_forms.append(form)
            continue

        # Extract chunks from PDF
        chunks = chunk_pdf(pdf_path, form_number)
        print(f"    Extracted {len(chunks)} chunks")

        # Create enhanced form entry
        enhanced_form = {
            **form,  # Keep all original fields
            "local_pdf_path": pdf_path,
            "chunks": chunks,
            "total_chunks": len(chunks)
        }

        enhanced_forms.append(enhanced_form)
        print(f"  ✓ Completed Form {form_number}\n")

    # Save enhanced data
    output_path = file_path.replace('.json', '_enhanced.json')
    with open(output_path, 'w') as f:
        json.dump(enhanced_forms, f, indent=2)

    print(f"✓ Enhanced forms saved to: {output_path}")

    return enhanced_forms


def convert_enhanced_to_bot_format(enhanced_forms: List[Dict]) -> List[Dict]:
    """
    Convert enhanced forms (with chunks) to bot-compatible format
    Creates separate document entries for each chunk
    """
    bot_documents = []

    for form in enhanced_forms:
        form_number = form['form_number']
        form_title = form['title']

        # Add the main form metadata as a document
        bot_documents.append({
            'filename': f"Form {form_number} - {form_title}",
            'content': f"{form['description']} Use cases: {', '.join(form['use_cases'])}.",
            'form_number': form_number,
            'type': 'metadata'
        })

        # Add each chunk as a separate searchable document
        for chunk in form.get('chunks', []):
            chunk_content = chunk['text']

            # Add context to chunk content
            if chunk['type'] == 'line_item' and chunk.get('line_number'):
                chunk_label = f"Line {chunk['line_number']}"
            elif chunk['type'] == 'section_header':
                chunk_label = "Section"
            elif chunk['type'] == 'instruction':
                chunk_label = f"Instructions (Page {chunk.get('page', '?')})"
            else:
                chunk_label = chunk['type']

            bot_documents.append({
                'filename': f"Form {form_number} - {chunk_label}",
                'content': chunk_content,
                'form_number': form_number,
                'type': chunk['type'],
                'chunk_id': chunk.get('chunk_id'),
                'page': chunk.get('page'),
                'line_number': chunk.get('line_number')
            })

    return bot_documents


# Utility function for one-time processing
def process_and_save_pdfs(
    input_json: str = "assets/irs_forms_metadata.json",
    output_json: str = "assets/irs_forms_enhanced.json"
):
    """
    One-time processing to download PDFs and create enhanced JSON
    Run this once, then use the enhanced JSON for faster loading
    """
    enhanced_forms = load_irs_forms_enhanced(
        file_path=input_json,
        download_pdfs=True
    )

    with open(output_json, 'w') as f:
        json.dump(enhanced_forms, f, indent=2)

    print(f"\n✓ Processing complete! Enhanced data saved to: {output_json}")
    print(f"  Total forms: {len(enhanced_forms)}")
    total_chunks = sum(f.get('total_chunks', 0) for f in enhanced_forms)
    print(f"  Total chunks: {total_chunks}")


if __name__ == "__main__":
    # Run this once to process all PDFs
    print("Starting PDF processing...")
    process_and_save_pdfs()