import requests
import os

# IRS Form 1120 URL
url = "https://www.irs.gov/pub/irs-pdf/f1120.pdf"
pdf_path = "f1120.pdf"

# Download the PDF if it doesn't exist locally
if not os.path.exists(pdf_path):
    print("📥 Downloading Form 1120...")
    response = requests.get(url)
    with open(pdf_path, "wb") as f:
        f.write(response.content)
    print("✅ Download complete:", pdf_path)
else:
    print("✅ Using existing file:", pdf_path)

# Now you can use fillpdfs
from fillpdf import fillpdfs
fields = fillpdfs.get_form_fields(pdf_path)

# Print some fields to confirm
for k, v in list(fields.items())[:10]:
    print(k, ":", v)

import pandas as pd
from fillpdf import fillpdfs
import os

# -------------------
# File Paths
# -------------------
TEMPLATE_PDF = "f1120.pdf"  # IRS Form 1120 (downloaded from IRS.gov)
EXCEL_FILE = "1120_pdf_filing_examples.xlsx"     # Example Excel sheet with company data
OUTPUT_DIR = "filled_f1120"        # Output folder for generated PDFs

# Create output folder if not exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------
# Step 1: Load Excel Data
# -------------------
df = pd.read_excel(EXCEL_FILE)

# -------------------
# Step 2: Map Excel Columns -> IRS PDF Field Names
# -------------------
# NOTE: These IRS field names (e.g., topmostSubform[0].Page1[0].f1_1[0]) 
# come from fillpdfs.get_form_fields("f1120.pdf").
# Adjust them once you’ve extracted the exact field names.

field_mapping = {
    "CompanyName": "topmostSubform[0].Page1[0].f1_1[0]",
    "EIN": "topmostSubform[0].Page1[0].f1_2[0]",
    "TaxYear": "topmostSubform[0].Page1[0].f1_3[0]",
    "AddressLine1": "topmostSubform[0].Page1[0].f1_4[0]",
    "City": "topmostSubform[0].Page1[0].f1_5[0]",
    "State": "topmostSubform[0].Page1[0].f1_6[0]",
    "Zip": "topmostSubform[0].Page1[0].f1_7[0]",
    "TotalIncome": "topmostSubform[0].Page1[0].f1_18[0]",
    "TotalDeductions": "topmostSubform[0].Page1[0].f1_29[0]",
    "TaxableIncome": "topmostSubform[0].Page1[0].f1_30[0]",
    "Tax": "topmostSubform[0].Page1[0].f1_31[0]",
    "OfficerName": "topmostSubform[0].Page1[0].f1_40[0]",
    "OfficerTitle": "topmostSubform[0].Page1[0].f1_41[0]",
    "Date": "topmostSubform[0].Page1[0].f1_42[0]",
    "Phone": "topmostSubform[0].Page1[0].f1_43[0]"
}

# -------------------
# Step 3: Fill the PDF for each row in Excel
# -------------------
for idx, row in df.iterrows():
    # Build dictionary of PDF field values
    field_data = {}
    for col, pdf_field in field_mapping.items():
        if col in row:
            field_data[pdf_field] = str(row[col])

    # Save filled form
    output_file = os.path.join(OUTPUT_DIR, f"f1120_filled_{idx+1}.pdf")
    fillpdfs.write_fillable_pdf(TEMPLATE_PDF, output_file, field_data)
    fillpdfs.write_fillable_pdf("f1120.pdf", "output.pdf", field_data, flatten=True)

    # Flatten so fields become static text (optional)
    flat_file = os.path.join(OUTPUT_DIR, f"f1120_filled_{idx+1}_flat.pdf")
    fillpdfs.flatten_pdf(output_file, flat_file)

    print(f"✅ Created {flat_file}")

from fillpdf import fillpdfs

fields = fillpdfs.get_form_fields("f1120.pdf")

decoded_fields = {}
for k, v in fields.items():
    try:
        decoded_key = bytes.fromhex(k).decode("utf-16")  # decode UTF-16
    except Exception:
        decoded_key = k
    decoded_fields[decoded_key] = v

# Show a few decoded keys
for i, (k, v) in enumerate(decoded_fields.items()):
    if i < 20:
        print(f"{i}: {k} -> {v}")
data_dict = {
    "f1_1[0]": "Test Value",
    "f1_2[0]": "123456789"
}

fillpdfs.write_fillable_pdf("f1120.pdf", "filled_f1120.pdf", data_dict)

# Optional: flatten to make the text permanent
fillpdfs.flatten_pdf("filled_f1120.pdf", "filled_f1120_flat.pdf")
