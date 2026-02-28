---
name: pdf-master
description: >
  Comprehensive PDF processing guide covering text extraction, parsing,
  generation, OCR, and integration with AI/LLM workflows.
  Consolidates pdf-anthropic, PDF Processing, PDF Processing Pro, and data-export-pdf skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# PDF Master - Comprehensive PDF Processing

Complete guide for PDF operations including text extraction, generation, manipulation, OCR, form filling, table extraction, and Claude API integration.

## When to Use

- **Extract text/tables**: "Read this PDF", parse reports, extract data from documents
- **Generate PDFs**: Create reports, export analysis results, professional documentation
- **Manipulate PDFs**: Merge, split, rotate, watermark, password-protect documents
- **OCR processing**: Extract text from scanned PDFs or image-based documents
- **Form filling**: Programmatically fill PDF forms with validation
- **Claude integration**: Send PDFs to Claude API, handle large PDFs with page-by-page processing
- **Batch operations**: Process multiple PDFs efficiently with validation and error handling
- **RAG pipelines**: Extract and chunk PDF content for vector databases

## Quick Decision Matrix

| Task | Best Tool | Why |
|------|-----------|-----|
| Extract text (simple) | pdfplumber | Best layout preservation, simple API |
| Extract text (complex) | pypdf + pdfplumber | pypdf for structure, pdfplumber for content |
| Extract tables | pdfplumber | Automatic table detection, CSV export |
| Create PDFs (simple) | reportlab canvas | Direct drawing API, lightweight |
| Create PDFs (complex) | reportlab platypus | Multi-page layouts, flowables |
| HTML to PDF | Puppeteer (Node.js) or WeasyPrint (Python) | Full CSS support |
| Merge/split/rotate | pypdf | Fast, reliable, standard library |
| OCR scanned PDFs | pytesseract + pdf2image | Industry standard, multi-language |
| Form filling | pypdf | Native Python, no dependencies |
| Batch processing | Custom script with multiprocessing | Parallel execution |
| Send to Claude | Native Read tool or API with base64 | Built-in support for PDFs |

## 1. PDF Text Extraction

### Python Libraries

#### pdfplumber (Recommended for Text + Tables)

```python
import pdfplumber

# Extract all text
with pdfplumber.open("document.pdf") as pdf:
    full_text = ""
    for page in pdf.pages:
        full_text += page.extract_text() + "\n\n"
    print(full_text)

# Extract from specific page
with pdfplumber.open("document.pdf") as pdf:
    first_page = pdf.pages[0]
    text = first_page.extract_text()
    print(text)

# Extract with layout preservation
with pdfplumber.open("document.pdf") as pdf:
    page = pdf.pages[0]
    text = page.extract_text(layout=True)  # Preserves spacing
```

#### pypdf (Recommended for Manipulation + Basic Text)

```python
from pypdf import PdfReader

# Read and extract text
reader = PdfReader("document.pdf")
print(f"Total pages: {len(reader.pages)}")

# Extract all text
text = ""
for page in reader.pages:
    text += page.extract_text()

# Get metadata
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Creator: {meta.creator}")
print(f"Subject: {meta.subject}")
```

### Command-Line Tools

```bash
# pdftotext (poppler-utils)
pdftotext input.pdf output.txt

# Preserve layout
pdftotext -layout input.pdf output.txt

# Specific pages (1-5)
pdftotext -f 1 -l 5 input.pdf output.txt
```

### Error Handling for Extraction

```python
import pdfplumber

try:
    with pdfplumber.open("document.pdf") as pdf:
        if len(pdf.pages) == 0:
            print("PDF has no pages")
        else:
            text = pdf.pages[0].extract_text()
            if text is None or text.strip() == "":
                print("Page contains no extractable text (might be scanned - use OCR)")
            else:
                print(text)
except Exception as e:
    print(f"Error processing PDF: {e}")
```

## 2. Claude PDF Integration

### Using Claude Code Read Tool (Recommended)

Claude Code can read PDFs directly:

```python
# Claude will automatically read PDFs when you reference them
# Just use the Read tool with the PDF path
```

**Best practices for Read tool:**
- For PDFs over 10 pages, specify page ranges: `pages: "1-5"`
- Maximum 20 pages per request
- Line numbers are included in output
- Images in PDFs are presented visually (multimodal)

### Using Claude API (Programmatic)

```python
import anthropic
import base64

# Method 1: Base64 encoding (for small PDFs)
def send_pdf_to_claude(pdf_path, prompt):
    client = anthropic.Anthropic()

    with open(pdf_path, "rb") as pdf_file:
        pdf_data = base64.standard_b64encode(pdf_file.read()).decode("utf-8")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ],
            }
        ],
    )

    return message.content[0].text

# Usage
result = send_pdf_to_claude("report.pdf", "Summarize this document")
```

### Large PDF Strategy (Page-by-Page)

```python
import pdfplumber
from pypdf import PdfReader, PdfWriter
import anthropic

def process_large_pdf(pdf_path, pages_per_batch=5):
    """Process large PDFs in batches"""
    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)
    results = []

    for start in range(0, total_pages, pages_per_batch):
        end = min(start + pages_per_batch, total_pages)

        # Extract page range to temporary PDF
        writer = PdfWriter()
        for i in range(start, end):
            writer.add_page(reader.pages[i])

        temp_path = f"temp_pages_{start}_{end}.pdf"
        with open(temp_path, "wb") as output:
            writer.write(output)

        # Process with Claude
        result = send_pdf_to_claude(temp_path, f"Analyze pages {start+1}-{end}")
        results.append(result)

        # Clean up
        import os
        os.remove(temp_path)

    return results
```

## 3. PDF Generation

### reportlab - Create PDFs from Scratch

#### Simple Canvas API

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Basic document
c = canvas.Canvas("simple.pdf", pagesize=letter)
width, height = letter

# Add text
c.drawString(100, height - 100, "Hello World!")
c.drawString(100, height - 120, "This is a PDF created with reportlab")

# Add line
c.line(100, height - 140, 400, height - 140)

# Add rectangle
c.rect(100, 300, 200, 100)

# Save
c.save()
```

#### Platypus for Complex Documents

```python
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from datetime import datetime

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

# Title
title = Paragraph("Analysis Report", styles['Title'])
story.append(title)
story.append(Spacer(1, 0.2*inch))

# Date
date_text = f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
story.append(Paragraph(date_text, styles['Normal']))
story.append(Spacer(1, 0.3*inch))

# Section
story.append(Paragraph("1. Overview", styles['Heading1']))
story.append(Spacer(1, 0.1*inch))

body = Paragraph("This is the body of the report. " * 20, styles['Normal'])
story.append(body)
story.append(PageBreak())

# Page 2
story.append(Paragraph("2. Results", styles['Heading1']))
story.append(Paragraph("Content for page 2", styles['Normal']))

# Build PDF
doc.build(story)
```

### Tables in PDFs

```python
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle

# Prepare data
table_data = [
    ['Metric', 'Value', 'Status'],  # Header
    ['Total Cells', '5,000', 'Pass'],
    ['Total Genes', '20,000', 'Pass'],
    ['Mean Genes/Cell', '2,500', 'Warning'],
]

# Create table
table = Table(table_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])

# Style table
table.setStyle(TableStyle([
    # Header
    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 12),

    # Body
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
]))

story.append(table)
```

### Embedding Images in PDFs

```python
from reportlab.platypus import Image
import matplotlib.pyplot as plt

# Create matplotlib plot
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot([1, 2, 3, 4], [1, 4, 2, 3])
ax.set_title('Sample Plot')
plot_filename = "temp_plot.png"
fig.savefig(plot_filename, dpi=150, bbox_inches='tight')
plt.close(fig)

# Add to PDF
img = Image(plot_filename, width=4*inch, height=3*inch)
story.append(img)

# Clean up temporary file
import os
os.remove(plot_filename)
```

### HTML to PDF Conversion

#### Node.js with Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function htmlToPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
  });

  await browser.close();
}

// Usage
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; }
    h1 { color: navy; }
  </style>
</head>
<body>
  <h1>Report Title</h1>
  <p>Report content goes here.</p>
</body>
</html>
`;

htmlToPdf(html, 'report.pdf');
```

#### Python with WeasyPrint

```python
from weasyprint import HTML

# From HTML string
html_content = """
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; margin: 2cm; }
    h1 { color: navy; }
  </style>
</head>
<body>
  <h1>Report Title</h1>
  <p>Report content.</p>
</body>
</html>
"""

HTML(string=html_content).write_pdf("report.pdf")

# From file
HTML(filename="report.html").write_pdf("report.pdf")

# From URL
HTML(url="https://example.com").write_pdf("report.pdf")
```

## 4. OCR - Optical Character Recognition

### When OCR is Needed

- Scanned documents (images embedded in PDF)
- Screenshots saved as PDF
- Photos of documents
- When `extract_text()` returns empty or garbled text

### When OCR is NOT Needed

- Digital PDFs created from Word/LaTeX/web pages
- PDFs with selectable text (test by trying to select text in a PDF viewer)

### pytesseract (Python)

```python
import pytesseract
from pdf2image import convert_from_path

# Convert PDF to images
images = convert_from_path('scanned.pdf', dpi=300)

# OCR each page
full_text = ""
for i, image in enumerate(images):
    text = pytesseract.image_to_string(image, lang='eng')
    full_text += f"\n--- Page {i+1} ---\n{text}\n"

print(full_text)
```

### Tesseract.js (Node.js/Browser)

```javascript
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;

async function ocrPdf(imagePath) {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}

ocrPdf('./page1.jpg').then(text => console.log(text));
```

### Multi-Language OCR

```python
# Install language data first:
# apt-get install tesseract-ocr-fra  # French
# apt-get install tesseract-ocr-spa  # Spanish

# OCR with multiple languages
text = pytesseract.image_to_string(image, lang='eng+fra+spa')
```

### OCR with Confidence Scores

```python
import pytesseract
from PIL import Image

# Get detailed data
data = pytesseract.image_to_data(Image.open('page.jpg'), output_type=pytesseract.Output.DICT)

# Filter by confidence
min_confidence = 60
filtered_text = []
for i, conf in enumerate(data['conf']):
    if int(conf) > min_confidence:
        filtered_text.append(data['text'][i])

print(' '.join(filtered_text))
```

## 5. Table Extraction

### pdfplumber Table Extraction

```python
import pdfplumber
import pandas as pd

with pdfplumber.open("tables.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()

        for j, table in enumerate(tables):
            print(f"\n--- Table {j+1} on Page {i+1} ---")
            for row in table:
                print(row)
```

### Export Tables to CSV

```python
import pdfplumber
import csv

with pdfplumber.open("report.pdf") as pdf:
    all_tables = []

    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:
                all_tables.extend(table)

    # Write to CSV
    with open("output.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(all_tables)
```

### Export Tables to Pandas

```python
import pdfplumber
import pandas as pd

with pdfplumber.open("tables.pdf") as pdf:
    all_tables = []

    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table and len(table) > 1:
                # Use first row as header
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

    # Combine all tables
    if all_tables:
        combined_df = pd.concat(all_tables, ignore_index=True)
        combined_df.to_excel("extracted_tables.xlsx", index=False)
```

## 6. PDF Manipulation

### Merge PDFs

```python
from pypdf import PdfWriter, PdfReader

# Method 1: Simple merge
writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)

# Method 2: Using PdfMerger
from pypdf import PdfMerger

merger = PdfMerger()
for pdf in ["file1.pdf", "file2.pdf", "file3.pdf"]:
    merger.append(pdf)

merger.write("merged.pdf")
merger.close()
```

### Split PDF

```python
from pypdf import PdfReader, PdfWriter

# Split into individual pages
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)

# Extract specific page range (pages 2-5)
reader = PdfReader("input.pdf")
writer = PdfWriter()
for page_num in range(1, 5):  # 0-indexed
    writer.add_page(reader.pages[page_num])

with open("pages_2_to_5.pdf", "wb") as output:
    writer.write(output)
```

### Rotate Pages

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

# Rotate first page 90 degrees clockwise
page = reader.pages[0]
page.rotate(90)
writer.add_page(page)

# Rotate all pages
for page in reader.pages:
    page.rotate(90)
    writer.add_page(page)

with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

### Add Watermark

```python
from pypdf import PdfReader, PdfWriter

# Load watermark (or create it with reportlab)
watermark = PdfReader("watermark.pdf").pages[0]

# Apply to all pages
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

### Password Protection

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

# Encrypt with password
writer.encrypt(user_password="userpass", owner_password="ownerpass")

with open("encrypted.pdf", "wb") as output:
    writer.write(output)

# Decrypt
reader = PdfReader("encrypted.pdf", password="userpass")
```

### Extract Images

```bash
# Using pdfimages (poppler-utils)
pdfimages -j input.pdf output_prefix

# Output: output_prefix-000.jpg, output_prefix-001.jpg, etc.

# PNG format
pdfimages -png input.pdf output_prefix
```

## 7. Production Patterns

### Batch Processing with Multiprocessing

```python
import glob
from pathlib import Path
from multiprocessing import Pool
import pdfplumber

def process_single_pdf(pdf_path):
    """Process one PDF file"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n\n".join(page.extract_text() for page in pdf.pages)

        output_path = Path("processed") / f"{Path(pdf_path).stem}.txt"
        output_path.parent.mkdir(exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)

        return {"status": "success", "file": pdf_path}
    except Exception as e:
        return {"status": "error", "file": pdf_path, "error": str(e)}

def batch_process_pdfs(input_dir, num_workers=4):
    """Process all PDFs in directory using multiprocessing"""
    pdf_files = glob.glob(f"{input_dir}/**/*.pdf", recursive=True)

    with Pool(num_workers) as pool:
        results = pool.map(process_single_pdf, pdf_files)

    # Summary
    successful = sum(1 for r in results if r["status"] == "success")
    failed = sum(1 for r in results if r["status"] == "error")

    print(f"Processed {len(results)} PDFs:")
    print(f"  ✓ Success: {successful}")
    print(f"  ✗ Failed: {failed}")

    # Print errors
    for r in results:
        if r["status"] == "error":
            print(f"  Error in {r['file']}: {r['error']}")

    return results

# Usage
batch_process_pdfs("./invoices", num_workers=4)
```

### Caching Extracted Text

```python
import hashlib
import json
from pathlib import Path
import pdfplumber

def get_file_hash(filepath):
    """Get MD5 hash of file"""
    with open(filepath, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def extract_with_cache(pdf_path, cache_dir=".pdf_cache"):
    """Extract text with filesystem cache"""
    cache_path = Path(cache_dir)
    cache_path.mkdir(exist_ok=True)

    # Generate cache key
    file_hash = get_file_hash(pdf_path)
    cache_file = cache_path / f"{file_hash}.json"

    # Check cache
    if cache_file.exists():
        with open(cache_file, "r") as f:
            cached_data = json.load(f)
        print(f"Using cached extraction for {pdf_path}")
        return cached_data["text"]

    # Extract text
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n\n".join(page.extract_text() for page in pdf.pages)

    # Save to cache
    with open(cache_file, "w") as f:
        json.dump({"file": str(pdf_path), "hash": file_hash, "text": text}, f)

    return text

# Usage
text = extract_with_cache("large_report.pdf")
```

### Chunking for RAG Pipelines

```python
import pdfplumber
from typing import List, Dict

def chunk_pdf_for_rag(
    pdf_path: str,
    chunk_size: int = 1000,
    overlap: int = 200
) -> List[Dict[str, any]]:
    """
    Extract PDF and chunk for vector database ingestion.

    Returns list of chunks with metadata.
    """
    chunks = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()

            if not text:
                continue

            # Chunk page text
            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk_text = text[start:end]

                chunks.append({
                    "text": chunk_text,
                    "metadata": {
                        "source": pdf_path,
                        "page": page_num,
                        "chunk_start": start,
                        "chunk_end": end
                    }
                })

                start += chunk_size - overlap

    return chunks

# Usage
chunks = chunk_pdf_for_rag("document.pdf", chunk_size=500, overlap=100)

# Ingest into vector database
for chunk in chunks:
    # your_vector_db.add(chunk["text"], metadata=chunk["metadata"])
    pass
```

### Validation and Error Handling

```python
import pdfplumber
from pathlib import Path

class PDFProcessor:
    def __init__(self, pdf_path):
        self.path = Path(pdf_path)
        self.validate()

    def validate(self):
        """Validate PDF before processing"""
        if not self.path.exists():
            raise FileNotFoundError(f"PDF not found: {self.path}")

        if not self.path.suffix.lower() == '.pdf':
            raise ValueError(f"Not a PDF file: {self.path}")

        try:
            with pdfplumber.open(self.path) as pdf:
                if len(pdf.pages) == 0:
                    raise ValueError("PDF has no pages")
        except Exception as e:
            raise ValueError(f"Cannot read PDF: {e}")

    def extract_text(self) -> str:
        """Extract text with error handling"""
        try:
            with pdfplumber.open(self.path) as pdf:
                text_parts = []

                for i, page in enumerate(pdf.pages, start=1):
                    page_text = page.extract_text()

                    if page_text is None or page_text.strip() == "":
                        print(f"Warning: Page {i} has no extractable text (may need OCR)")
                        continue

                    text_parts.append(page_text)

                if not text_parts:
                    raise ValueError("No extractable text found in PDF")

                return "\n\n".join(text_parts)

        except Exception as e:
            raise RuntimeError(f"Failed to extract text: {e}")

# Usage
try:
    processor = PDFProcessor("document.pdf")
    text = processor.extract_text()
    print(text)
except Exception as e:
    print(f"Error: {e}")
```

## 8. Form Filling

### Analyze Form Fields

```python
from pypdf import PdfReader

def analyze_pdf_form(pdf_path):
    """Extract all form field information"""
    reader = PdfReader(pdf_path)

    fields = reader.get_fields()
    if not fields:
        print("No form fields found in PDF")
        return

    print(f"Found {len(fields)} form fields:\n")

    for field_name, field_info in fields.items():
        print(f"Field: {field_name}")
        print(f"  Type: {field_info.get('/FT', 'Unknown')}")
        print(f"  Value: {field_info.get('/V', 'None')}")
        print(f"  Flags: {field_info.get('/Ff', 'None')}")
        print()

# Usage
analyze_pdf_form("form_template.pdf")
```

### Fill Form Programmatically

```python
from pypdf import PdfReader, PdfWriter

def fill_pdf_form(template_path, data, output_path):
    """Fill PDF form with data dictionary"""
    reader = PdfReader(template_path)
    writer = PdfWriter()

    # Add all pages
    for page in reader.pages:
        writer.add_page(page)

    # Fill form fields
    writer.update_page_form_field_values(
        writer.pages[0],
        data
    )

    # Write output
    with open(output_path, "wb") as output:
        writer.write(output)

# Usage
form_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St"
}

fill_pdf_form("application_form.pdf", form_data, "completed_form.pdf")
```

## Dependencies Installation

### Python

```bash
# Core PDF libraries
pip install pdfplumber pypdf pillow reportlab

# OCR support
pip install pytesseract pdf2image

# Data export
pip install pandas openpyxl

# HTML to PDF
pip install weasyprint

# System dependencies for OCR (Ubuntu/Debian)
apt-get install tesseract-ocr poppler-utils

# macOS
brew install tesseract poppler
```

### Node.js

```bash
# PDF manipulation
npm install pdf-lib

# OCR
npm install tesseract.js

# HTML to PDF
npm install puppeteer
```

## Best Practices

1. **Always validate inputs** before processing (file exists, is readable, has pages)
2. **Use try-except blocks** for robust error handling
3. **Cache extracted text** for repeated access to same PDFs
4. **Process large PDFs page-by-page** or in batches to manage memory
5. **Clean up temporary files** (images for OCR, intermediate PDFs)
6. **Check if OCR is needed** before attempting (test extract_text() first)
7. **Use multiprocessing** for batch operations on multiple PDFs
8. **Set timeouts** for long-running OCR operations
9. **Preserve metadata** when manipulating PDFs
10. **Test with sample PDFs** before production deployment

## Troubleshooting

### "No text extracted" → PDF might be scanned
**Solution:** Use OCR (pytesseract + pdf2image)

### "Module not found" errors
**Solution:** `pip install pdfplumber pypdf pytesseract pdf2image reportlab`

### "Tesseract not found"
**Solution:** Install tesseract system package (see Dependencies)

### Memory errors with large PDFs
**Solution:** Process page-by-page instead of loading entire PDF

```python
# Bad: Loads entire PDF into memory
with pdfplumber.open("huge.pdf") as pdf:
    all_text = [p.extract_text() for p in pdf.pages]

# Good: Process one page at a time
with pdfplumber.open("huge.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        # Process immediately, don't accumulate
```

### Permission/encryption errors
**Solution:** Decrypt PDF first with password using pypdf

### Table extraction returns malformed data
**Solution:** Manually adjust table settings in pdfplumber

```python
table_settings = {
    "vertical_strategy": "lines",
    "horizontal_strategy": "lines",
    "intersection_tolerance": 5
}
tables = page.extract_tables(table_settings=table_settings)
```

## Performance Tips

- **Batch processing**: Use multiprocessing for multiple PDFs (4-8 workers)
- **Caching**: Store extracted text with file hash as key
- **Streaming**: Process pages sequentially for large files
- **OCR optimization**: Reduce image DPI (300 is sufficient), use specific languages only
- **Parallel extraction**: Split large PDFs and process chunks in parallel

## Reference

- **pdfplumber docs**: https://github.com/jsvine/pdfplumber
- **pypdf docs**: https://pypdf.readthedocs.io/
- **reportlab user guide**: https://www.reportlab.com/docs/reportlab-userguide.pdf
- **Tesseract OCR**: https://github.com/tesseract-ocr/tesseract
- **Claude API PDF support**: https://docs.anthropic.com/en/docs/build-with-claude/pdf-support
