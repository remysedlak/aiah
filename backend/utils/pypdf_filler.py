"""
IRS Form 1120 PDF Filler using PyPDF
Install: pip install pypdf pandas openpyxl
"""

from pypdf import PdfReader, PdfWriter
import pandas as pd
import os

# Configuration
TEMPLATE_PDF = "data/f1120.pdf"
EXCEL_FILE = "data/1120_pdf_filing_examples.xlsx"
OUTPUT_DIR = "filled_f1120_pypdf"


def inspect_pdf_fields():
    """Show all field names in the PDF"""
    print("Reading PDF fields with PyPDF...")
    reader = PdfReader(TEMPLATE_PDF)

    if "/AcroForm" not in reader.trailer["/Root"]:
        print("❌ This PDF has no fillable form fields!")
        return None

    fields = reader.get_fields()

    if not fields:
        print("❌ No fields found in PDF!")
        return None

    print(f"\n✅ Found {len(fields)} fields\n")
    print("First 30 fields:")
    print("=" * 80)

    for i, (field_name, field_obj) in enumerate(list(fields.items())[:30]):
        field_type = field_obj.get('/FT', 'Unknown')
        field_value = field_obj.get('/V', '')
        print(f"{i+1:3d}. {field_name}")
        print(f"      Type: {field_type}, Current Value: '{field_value}'")

    return fields


def fill_pdf_simple_test():
    """Simple test to fill one field"""
    print("\n" + "=" * 80)
    print("SIMPLE TEST - Filling first text field")
    print("=" * 80)

    reader = PdfReader(TEMPLATE_PDF)
    writer = PdfWriter()

    # Clone the reader's form to writer
    writer.clone_document_from_reader(reader)

    # Get fields and find first /Tx (text) field
    fields = reader.get_fields()
    text_field = None
    for field_name, field_obj in fields.items():
        if field_obj.get('/FT') == '/Tx':
            text_field = field_name
            break

    if not text_field:
        print("❌ No text fields found!")
        return

    print(f"\nFilling field: {text_field}")
    print(f"With value: 'TEST COMPANY NAME'")

    # Fill the field
    writer.update_page_form_field_values(
        writer.pages[0],
        {text_field: "TEST COMPANY NAME"}
    )

    # Save
    output = "test_pypdf_simple.pdf"
    with open(output, "wb") as output_file:
        writer.write(output_file)

    print(f"✅ Created: {output}")
    print("Open this PDF and check if you see 'TEST COMPANY NAME' anywhere!")


def fill_from_excel():
    """Fill PDFs from Excel file"""

    # Check Excel file
    if not os.path.exists(EXCEL_FILE):
        print(f"❌ Excel file not found: {EXCEL_FILE}")
        return

    # Read Excel
    print(f"\n📊 Reading {EXCEL_FILE}...")
    df = pd.read_excel(EXCEL_FILE)
    print(f"✅ Found {len(df)} rows")
    print(f"Columns: {list(df.columns)}")

    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Field mapping - Using the FULL field paths from the IRS PDF
    # Based on the output above, the text fields start with topmostSubform[0].Page1[0]...
    field_mapping = {
        "CompanyName": "topmostSubform[0].Page1[0].TypeOrPrintBox[0].f1_4[0]",  # Name field
        "EIN": "topmostSubform[0].Page1[0].PgHeader[0].f1_2[0]",  # EIN at top
        "TaxYear": "topmostSubform[0].Page1[0].PgHeader[0].f1_1[0]",  # Tax year
        "AddressLine1": "topmostSubform[0].Page1[0].TypeOrPrintBox[0].f1_5[0]",  # Address
        "City": "topmostSubform[0].Page1[0].TypeOrPrintBox[0].f1_6[0]",  # City/State/ZIP line
        "State": "topmostSubform[0].Page1[0].f1_7[0]",
        "Zip": "topmostSubform[0].Page1[0].f1_8[0]",
        "TotalIncome": "topmostSubform[0].Page1[0].f1_10[0]",
        "TotalDeductions": "topmostSubform[0].Page1[0].f1_29[0]",
        "TaxableIncome": "topmostSubform[0].Page1[0].f1_30[0]",
        "Tax": "topmostSubform[0].Page1[0].f1_31[0]",
    }

    print("\nField Mapping:")
    for excel_col, pdf_field in field_mapping.items():
        print(f"  {excel_col} -> {pdf_field}")

    # Process each row
    print("\n" + "=" * 80)
    for idx, row in df.iterrows():
        print(f"\n📄 Processing row {idx + 1}...")

        # Create writer by cloning the reader
        reader = PdfReader(TEMPLATE_PDF)
        writer = PdfWriter()
        writer.clone_document_from_reader(reader)

        # Prepare field data
        field_data = {}
        for excel_col, pdf_field in field_mapping.items():
            if excel_col in row and pd.notna(row[excel_col]):
                field_data[pdf_field] = str(row[excel_col])
                print(f"  {excel_col}: {row[excel_col]}")

        # Update form fields
        if field_data:
            writer.update_page_form_field_values(writer.pages[0], field_data)

        # Save
        output_file = os.path.join(OUTPUT_DIR, f"f1120_filled_{idx+1}.pdf")
        with open(output_file, "wb") as f:
            writer.write(f)

        print(f"  ✅ Saved: {output_file}")

    print("\n" + "=" * 80)
    print(f"🎉 Done! Check {OUTPUT_DIR}/ folder")


if __name__ == "__main__":
    # Step 1: Inspect fields
    inspect_pdf_fields()

    # Step 2: Simple test
    fill_pdf_simple_test()

    # Step 3: Fill from Excel (uncomment when ready)
    fill_from_excel()

    print("\n💡 Next steps:")
    print("1. Open test_pypdf_simple.pdf and see if it has any text")
    print("2. If it works, uncomment fill_from_excel() above")