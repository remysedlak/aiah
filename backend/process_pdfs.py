"""
One-time PDF processing script
Run this to download PDFs and create enhanced embeddings
Location: backend/process_pdfs.py

Usage:
    python process_pdfs.py
"""

import sys
import os

# Add backend to path if running from root
if os.path.exists('backend'):
    sys.path.insert(0, 'backend')

from data.loader import process_and_save_pdfs


def main():
    print("=" * 60)
    print("IRS Form PDF Processor")
    print("=" * 60)
    print("\nThis script will:")
    print("  1. Download all IRS form PDFs (~10-20MB)")
    print("  2. Extract and chunk PDF content")
    print("  3. Create searchable index")
    print("  4. Save to data/irs_forms_enhanced.json")
    print("\nThis process takes 5-10 minutes but only needs to run once.")
    print("=" * 60)

    # Confirm
    response = input("\nContinue? (y/n): ")
    if response.lower() != 'y':
        print("Cancelled.")
        return

    print("\nStarting processing...\n")

    try:
        # Run the processor
        process_and_save_pdfs(
            input_json="backend/data/irs_forms_metadata.json",
            output_json="backend/data/irs_forms_enhanced.json"
        )

        print("\n" + "=" * 60)
        print("✓ SUCCESS!")
        print("=" * 60)
        print("\nEnhanced data created successfully!")
        print("\nNext steps:")
        print("  1. Set environment variable: export USE_ENHANCED_MODE=true")
        print("  2. Run the server: ./run.sh")
        print("\nOr run directly:")
        print("  USE_ENHANCED_MODE=true python -m uvicorn app:app --reload")
        print("=" * 60)

    except Exception as e:
        print("\n" + "=" * 60)
        print("✗ ERROR!")
        print("=" * 60)
        print(f"\nAn error occurred: {e}")
        print("\nTroubleshooting:")
        print("  1. Make sure you're in the backend/ directory")
        print("  2. Check that data/irs_forms_metadata.json exists")
        print("  3. Ensure you have internet connection for downloading PDFs")
        print("  4. Make sure PyPDF2 is installed: pip install PyPDF2")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()