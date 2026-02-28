---
name: pdf-content-extractor
description: >
  Extract structured content from PDF files including text, tables, images, and metadata.
  Use this skill when a user uploads or references a PDF and needs to read case studies,
  teacher notes, student submissions, academic papers, syllabi, or any other PDF document.
  Triggers include requests to "read this PDF", "extract text from PDF", "parse this case study",
  "get the tables from this document", "pull content from this file", or any task that requires
  reading PDF content for downstream processing. Also trigger when another skill (case-grader,
  best-practice-generator, lessons-learned-generator, teacher-notes-parser, student-submission-parser)
  needs to ingest a PDF as input. Handles multi-column layouts common in HBR/Ivey case studies,
  scanned PDFs via OCR fallback detection, page range extraction, and multiple output formats
  (markdown, JSON, plain text).
---

# ©2026 Brad Scheller

# PDF Content Extractor

Extract structured content from PDF files preserving paragraph structure, headings, tables,
image references, and metadata for downstream analysis, grading, or conversion.

## Required Inputs

1. **PDF File** — a .pdf file (absolute path or upload)
2. **Extraction Mode** — one of: `full`, `text-only`, `tables-only`, `metadata` (default: `full`)
3. **Output Format** — one of: `markdown`, `json`, `plain` (default: `markdown`)
4. **Page Range** — optional, e.g., `5-12`, `1,3,7-10` (default: all pages)

If the file is missing, ask the user to provide it before proceeding.

## Library Selection

Use **PyMuPDF (fitz)** as the primary extraction engine. Fall back to **pdfplumber** for
complex table extraction when PyMuPDF table detection is insufficient.

```
pip install pymupdf pdfplumber
```

**Why PyMuPDF first:**
- Fastest PDF parser in Python
- Excellent text extraction with position data
- Built-in table detection (v1.23+)
- Image extraction with metadata
- Handles most PDFs without additional dependencies

**When to use pdfplumber:**
- Tables with complex merging, spanning cells, or invisible borders
- PDFs where PyMuPDF's table detection misses structure
- Documents requiring precise bounding-box-based extraction

---

## Extraction Workflow

### Step 1: Validate and Open File

```python
import fitz  # PyMuPDF

def open_pdf(file_path: str, page_range: str = None) -> fitz.Document:
    """Open PDF and validate. Returns document object."""
    if not file_path.lower().endswith('.pdf'):
        raise ValueError("File must have .pdf extension")

    doc = fitz.open(file_path)

    if doc.is_encrypted:
        raise PermissionError(
            "PDF is encrypted/password-protected. "
            "Ask the user for the password or an unlocked version."
        )

    # Parse page range if provided
    if page_range:
        pages = parse_page_range(page_range, doc.page_count)
    else:
        pages = list(range(doc.page_count))

    return doc, pages

def parse_page_range(range_str: str, total_pages: int) -> list[int]:
    """Parse '1,3,5-12' into zero-indexed page list."""
    pages = set()
    for part in range_str.split(','):
        part = part.strip()
        if '-' in part:
            start, end = part.split('-', 1)
            start = max(0, int(start) - 1)
            end = min(total_pages - 1, int(end) - 1)
            pages.update(range(start, end + 1))
        else:
            idx = int(part) - 1
            if 0 <= idx < total_pages:
                pages.add(idx)
    return sorted(pages)
```

### Step 2: Extract Metadata

```python
def extract_metadata(doc: fitz.Document) -> dict:
    """Extract PDF metadata."""
    meta = doc.metadata
    return {
        "title": meta.get("title", "").strip() or None,
        "author": meta.get("author", "").strip() or None,
        "subject": meta.get("subject", "").strip() or None,
        "creator": meta.get("creator", "").strip() or None,
        "producer": meta.get("producer", "").strip() or None,
        "creation_date": meta.get("creationDate", "").strip() or None,
        "modification_date": meta.get("modDate", "").strip() or None,
        "page_count": doc.page_count,
        "file_size_bytes": doc.stream.__len__() if doc.stream else None,
    }
```

### Step 3: Extract Text with Structure

For each page, extract text preserving paragraph boundaries, headings, and formatting hints.

```python
def extract_page_text(page: fitz.Page) -> dict:
    """Extract structured text from a single page."""
    blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]

    content = []
    for block in blocks:
        if block["type"] == 0:  # Text block
            for line in block["lines"]:
                spans = line["spans"]
                if not spans:
                    continue

                text = "".join(s["text"] for s in spans)
                font_size = max(s["size"] for s in spans)
                is_bold = any("bold" in s["font"].lower() for s in spans)
                is_italic = any("italic" in s["font"].lower() or
                               "oblique" in s["font"].lower() for s in spans)

                content.append({
                    "type": classify_text_type(text, font_size, is_bold),
                    "text": text.strip(),
                    "font_size": round(font_size, 1),
                    "bold": is_bold,
                    "italic": is_italic,
                })
        elif block["type"] == 1:  # Image block
            content.append({
                "type": "image",
                "bbox": block["bbox"],
                "width": block["width"],
                "height": block["height"],
            })

    return merge_paragraphs(content)

def classify_text_type(text: str, font_size: float, is_bold: bool) -> str:
    """Classify text as heading, subheading, or body based on font properties."""
    if font_size >= 16 and is_bold:
        return "heading_1"
    elif font_size >= 13 and is_bold:
        return "heading_2"
    elif font_size >= 11 and is_bold:
        return "heading_3"
    elif is_bold:
        return "bold_text"
    else:
        return "body"

def merge_paragraphs(content: list) -> list:
    """Merge consecutive body text lines into paragraphs."""
    merged = []
    current_para = None

    for item in content:
        if item["type"] == "body" and current_para and current_para["type"] == "body":
            # Same paragraph — merge with space
            current_para["text"] += " " + item["text"]
        else:
            if current_para:
                merged.append(current_para)
            current_para = dict(item)

    if current_para:
        merged.append(current_para)

    return merged
```

### Step 4: Detect and Handle Multi-Column Layouts

Multi-column layouts are common in HBR/Ivey case studies and academic papers. Detect columns
by analyzing text block x-positions.

```python
def detect_columns(page: fitz.Page) -> int:
    """Detect number of text columns on a page."""
    blocks = page.get_text("dict")["blocks"]
    text_blocks = [b for b in blocks if b["type"] == 0]

    if len(text_blocks) < 4:
        return 1

    # Analyze x-coordinates of block left edges
    x_positions = [b["bbox"][0] for b in text_blocks]
    page_width = page.rect.width

    # Cluster x-positions — if two distinct clusters exist, it's 2-column
    left_margin = min(x_positions)
    midpoint = page_width / 2

    left_count = sum(1 for x in x_positions if x < midpoint - 20)
    right_count = sum(1 for x in x_positions if x > midpoint + 20)

    if left_count > 2 and right_count > 2:
        return 2

    return 1

def extract_multicolumn_text(page: fitz.Page) -> str:
    """Extract text from multi-column page in reading order (left col then right col)."""
    columns = detect_columns(page)

    if columns == 1:
        return page.get_text("text")

    # Sort blocks: left column top-to-bottom, then right column top-to-bottom
    blocks = page.get_text("dict")["blocks"]
    text_blocks = [b for b in blocks if b["type"] == 0]

    midpoint = page.rect.width / 2
    left_blocks = sorted(
        [b for b in text_blocks if b["bbox"][0] < midpoint],
        key=lambda b: b["bbox"][1]
    )
    right_blocks = sorted(
        [b for b in text_blocks if b["bbox"][0] >= midpoint],
        key=lambda b: b["bbox"][1]
    )

    def blocks_to_text(blocks):
        lines = []
        for b in blocks:
            for line in b["lines"]:
                text = "".join(s["text"] for s in line["spans"]).strip()
                if text:
                    lines.append(text)
        return "\n".join(lines)

    return blocks_to_text(left_blocks) + "\n\n" + blocks_to_text(right_blocks)
```

### Step 5: Extract Tables

```python
def extract_tables_pymupdf(page: fitz.Page) -> list[dict]:
    """Extract tables using PyMuPDF's built-in table finder."""
    tables = page.find_tables()
    results = []

    for table in tables:
        data = table.extract()
        if not data or len(data) < 2:
            continue

        headers = [cell.strip() if cell else "" for cell in data[0]]
        rows = []
        for row in data[1:]:
            rows.append([cell.strip() if cell else "" for cell in row])

        results.append({
            "headers": headers,
            "rows": rows,
            "bbox": list(table.bbox),
        })

    return results

def extract_tables_pdfplumber(file_path: str, page_num: int) -> list[dict]:
    """Fallback: extract tables using pdfplumber for complex layouts."""
    import pdfplumber

    with pdfplumber.open(file_path) as pdf:
        page = pdf.pages[page_num]
        tables = page.extract_tables(
            table_settings={
                "vertical_strategy": "text",
                "horizontal_strategy": "text",
                "snap_y_tolerance": 5,
                "intersection_x_tolerance": 15,
            }
        )

        results = []
        for table in tables:
            if not table or len(table) < 2:
                continue
            headers = [cell.strip() if cell else "" for cell in table[0]]
            rows = [[cell.strip() if cell else "" for cell in row] for row in table[1:]]
            results.append({"headers": headers, "rows": rows})

        return results
```

### Step 6: Extract and Catalog Images

```python
def extract_image_catalog(page: fitz.Page, page_num: int) -> list[dict]:
    """Catalog all images on a page (filenames and positions, no binary data)."""
    images = page.get_images(full=True)
    catalog = []

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = page.parent.extract_image(xref)

        catalog.append({
            "page": page_num + 1,
            "index": img_index + 1,
            "xref": xref,
            "width": base_image["width"],
            "height": base_image["height"],
            "colorspace": base_image.get("colorspace", "unknown"),
            "bpc": base_image.get("bpc", 0),
            "size_bytes": len(base_image["image"]),
            "ext": base_image["ext"],  # png, jpeg, etc.
            "suggested_filename": f"page{page_num + 1}_img{img_index + 1}.{base_image['ext']}",
        })

    return catalog
```

### Step 7: OCR Fallback Detection

Detect scanned PDFs where text extraction yields minimal content relative to page count.

```python
def check_ocr_needed(doc: fitz.Document, pages: list[int]) -> dict:
    """Check if the PDF appears to be scanned (image-only) and may need OCR."""
    total_text_chars = 0
    total_images = 0

    for page_num in pages:
        page = doc[page_num]
        text = page.get_text("text").strip()
        total_text_chars += len(text)
        total_images += len(page.get_images())

    chars_per_page = total_text_chars / max(len(pages), 1)

    # Heuristic: a normal text page has 1500-3000 characters
    # If average is below 100 chars/page but images exist, likely scanned
    if chars_per_page < 100 and total_images > 0:
        return {
            "likely_scanned": True,
            "chars_per_page": round(chars_per_page, 1),
            "total_images": total_images,
            "recommendation": (
                "This PDF appears to be scanned (very little extractable text "
                f"with only ~{round(chars_per_page)} characters per page, but "
                f"{total_images} images detected). OCR processing is recommended. "
                "Consider using Tesseract OCR or a cloud OCR service to extract "
                "text from the page images."
            ),
        }

    return {
        "likely_scanned": False,
        "chars_per_page": round(chars_per_page, 1),
        "total_images": total_images,
    }
```

### Step 8: Handle Form Fields

```python
def extract_form_fields(doc: fitz.Document) -> list[dict]:
    """Extract form field data if present."""
    fields = []
    for page_num in range(doc.page_count):
        page = doc[page_num]
        widgets = page.widgets()
        if widgets:
            for widget in widgets:
                fields.append({
                    "page": page_num + 1,
                    "field_name": widget.field_name,
                    "field_type": widget.field_type_string,
                    "field_value": widget.field_value,
                    "rect": list(widget.rect),
                })
    return fields
```

---

## Output Formats

### Markdown Output (default)

```markdown
# [Document Title or Filename]
**Author:** [Author] | **Pages:** [Count] | **Created:** [Date]

---

## Page 1

### [Detected Heading]

[Body text preserving paragraph structure...]

| Column A | Column B | Column C |
|----------|----------|----------|
| data     | data     | data     |

[Image: page1_img1.png (640x480, jpeg)]

---

## Page 2
...
```

### JSON Output

```json
{
  "metadata": {
    "title": "Case Study: Strategic Decisions at Acme Corp",
    "author": "Professor Smith",
    "page_count": 14,
    "creation_date": "2025-09-15T10:30:00",
    "file_size_bytes": 2456789
  },
  "ocr_check": {
    "likely_scanned": false,
    "chars_per_page": 2150.3
  },
  "pages": [
    {
      "number": 1,
      "columns_detected": 2,
      "content": [
        { "type": "heading_1", "text": "Acme Corp: A Strategic Crossroads" },
        { "type": "body", "text": "In late 2024, the CEO of Acme Corp faced..." },
        {
          "type": "table",
          "headers": ["Metric", "2023", "2024"],
          "rows": [
            ["Revenue ($M)", "45.2", "52.8"],
            ["Margin (%)", "12.1", "9.8"]
          ]
        },
        {
          "type": "image",
          "filename": "page1_img1.jpeg",
          "width": 640,
          "height": 480,
          "size_bytes": 34521
        }
      ]
    }
  ],
  "form_fields": [],
  "images": [
    {
      "page": 1,
      "suggested_filename": "page1_img1.jpeg",
      "width": 640,
      "height": 480,
      "size_bytes": 34521
    }
  ]
}
```

### Plain Text Output

Document title as first line, then continuous text per page separated by page markers.
No formatting, no tables, no image references. Suitable for feeding directly into an LLM
context window.

```
[Document Title]
Page count: 14 | Author: Professor Smith

--- Page 1 ---
Acme Corp: A Strategic Crossroads
In late 2024, the CEO of Acme Corp faced a critical decision...

--- Page 2 ---
...
```

---

## Extraction Modes

| Mode | What's Extracted |
|------|-----------------|
| `full` | Everything: text with structure, tables, image catalog, metadata, form fields, OCR check |
| `text-only` | Page text only, preserving paragraphs and headings. No tables, images, or metadata |
| `tables-only` | Only tables extracted from each page, with page numbers |
| `metadata` | Document metadata only: title, author, dates, page count, file size, OCR check |

---

## Edge Cases

- **Encrypted/Password-protected PDFs**: Cannot extract. Inform the user the PDF is
  encrypted and ask for the password or an unlocked version. PyMuPDF supports password
  decryption via `fitz.open(path, password="...")` if the user provides one.

- **Scanned-only PDFs (no selectable text)**: The OCR check (Step 7) will detect this
  and warn the user. Recommend Tesseract OCR or a cloud OCR service. Do NOT silently
  return empty content.

- **PDFs with form fields**: Extract form field names and values (Step 8). Common in
  course evaluation forms and rubric templates. Include in output alongside regular content.

- **Very large PDFs (500+ pages)**: Process in batches of 50 pages to avoid memory issues.
  Report progress to the user after each batch. Consider suggesting page range extraction
  if the user doesn't need the full document.

- **Embedded fonts causing garbled text**: Detect by checking if extracted text contains
  high concentrations of replacement characters (U+FFFD) or non-printable characters.
  If more than 20% of characters are suspicious, warn the user:
  "Text extraction produced garbled output, likely due to embedded font encoding issues.
  Try opening the PDF in Adobe Acrobat and re-saving with 'Optimize for Fast Web View'
  to re-encode fonts."

- **Multi-column academic papers**: The column detection (Step 4) handles standard
  two-column layouts. For three-column layouts (rare), fall back to raw text extraction
  with a warning about potential reading-order issues.

- **PDFs with mixed orientations**: Some pages may be landscape while others are portrait.
  Detect via `page.rect.width > page.rect.height` and note orientation in output metadata
  per page.

- **Watermarked PDFs**: Watermark text often appears as a large, rotated, semi-transparent
  text block. Filter by checking for text blocks with rotation > 20 degrees and opacity < 0.5
  when available. If watermark text bleeds into extraction, note it in output.

- **PDFs with annotations/comments**: Extract annotation text separately from body content.
  Include as a supplementary section in output.

- **Zero-byte or corrupted PDFs**: Catch `fitz.FileDataError` and inform the user the file
  is corrupted or empty.

---

## Complete Extraction Orchestrator

```python
def extract_pdf(
    file_path: str,
    mode: str = "full",
    output_format: str = "markdown",
    page_range: str = None,
) -> dict | str:
    """
    Main entry point for PDF content extraction.

    Args:
        file_path: Absolute path to the PDF file
        mode: 'full', 'text-only', 'tables-only', or 'metadata'
        output_format: 'markdown', 'json', or 'plain'
        page_range: Optional page range string, e.g. '1-5,8,10-12'

    Returns:
        Extracted content in the requested format.
    """
    doc, pages = open_pdf(file_path, page_range)

    result = {"metadata": extract_metadata(doc)}

    if mode == "metadata":
        result["ocr_check"] = check_ocr_needed(doc, pages)
        return format_output(result, output_format)

    # OCR check for all non-metadata modes
    result["ocr_check"] = check_ocr_needed(doc, pages)
    if result["ocr_check"]["likely_scanned"]:
        print(f"WARNING: {result['ocr_check']['recommendation']}")

    # Process pages in batches for large documents
    batch_size = 50
    result["pages"] = []

    for batch_start in range(0, len(pages), batch_size):
        batch = pages[batch_start:batch_start + batch_size]

        for page_num in batch:
            page = doc[page_num]
            page_data = {"number": page_num + 1}

            if mode in ("full", "text-only"):
                page_data["columns_detected"] = detect_columns(page)
                if page_data["columns_detected"] > 1:
                    page_data["text"] = extract_multicolumn_text(page)
                else:
                    page_data["content"] = extract_page_text(page)

            if mode in ("full", "tables-only"):
                tables = extract_tables_pymupdf(page)
                if not tables:
                    # Fallback to pdfplumber for this page
                    tables = extract_tables_pdfplumber(file_path, page_num)
                page_data["tables"] = tables

            if mode == "full":
                page_data["images"] = extract_image_catalog(page, page_num)

            result["pages"].append(page_data)

    if mode == "full":
        result["form_fields"] = extract_form_fields(doc)

    doc.close()
    return format_output(result, output_format)
```

---

## Integration with Other Skills

This skill produces structured output that feeds into:

- **case-grader** — extracts student submission content and case study text for evaluation
- **best-practice-generator** — reads case PDFs and teacher notes as input material
- **lessons-learned-generator** — extracts content from course case materials
- **teacher-notes-parser** — specialized parsing of instructor guidance documents
- **student-submission-parser** — reads student-uploaded PDF submissions
- **rubric-builder** — extracts existing rubric content from PDF documents
- **docx-generator** — PDF content can be converted and re-formatted as Word output
- **Any summarization or analysis skill** — provides clean text extraction for LLM processing

This skill is a **foundational dependency**. Any skill in the CasesIQ pipeline that needs to
read a PDF should call this skill rather than implementing its own PDF parsing logic.

---

## Dependencies

```
pymupdf>=1.23.0
pdfplumber>=0.10.0
```
