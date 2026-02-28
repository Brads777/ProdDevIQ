---
name: docx-generator
description: >
  Generate formatted Word documents (.docx) from structured content with proper styling,
  tables, headings, and branding. Use this skill when any other skill or workflow needs to
  produce a Word document as output. Triggers include requests to "create a Word doc",
  "generate a docx", "export as Word", "write this to a document", "format as docx", or
  any downstream skill that produces Word output (feedback-docx-writer, best-practice-generator,
  lessons-learned-generator, syllabus-generator, rubric-builder). Also trigger when the user
  asks to apply CasesIQ brand styling, create formatted tables, build a document from a template,
  or export structured content to .docx format. Supports heading hierarchy, styled tables with
  shading, bullet and numbered lists, headers/footers with page numbers, custom color schemes,
  and template-based document generation.
---

# ©2026 Brad Scheller

# Word Document Generator

Generate professionally formatted .docx files from structured content blocks using Python's
python-docx library. Supports headings, tables, lists, styled text, headers/footers, page
breaks, and CasesIQ brand theming.

## Required Inputs

1. **Content Blocks** — structured list of content to render (see Block Types below)
2. **Output Path** — absolute file path for the generated .docx file
3. **Style Preset** — one of: `casesiq`, `academic`, `plain` (default: `casesiq`)
4. **Template Path** — optional, absolute path to a .docx template to use as base

If the output path directory does not exist, create it. If a file already exists at the
output path, overwrite it unless the user specifies otherwise.

## Dependencies

```
pip install python-docx
```

---

## CasesIQ Brand Theme

| Element | Value |
|---------|-------|
| Primary (Navy) | `#1B365D` / RGB(27, 54, 93) |
| Accent (Gold) | `#C4A35A` / RGB(196, 163, 90) |
| Background (Cream) | `#F5F3EE` / RGB(245, 243, 238) |
| Info (Blue) | `#489FC8` / RGB(72, 159, 200) |
| Highlight (Purple) | `#9769C5` / RGB(151, 105, 197) |
| Heading Font | Calibri Bold |
| Body Font | Calibri |
| Body Font Size | 11pt |
| H1 Size | 18pt |
| H2 Size | 14pt |
| H3 Size | 12pt |
| Line Spacing | 1.15 |
| Paragraph After Spacing | 6pt |
| Page Margins | 1 inch all sides |

---

## Style Presets

### `casesiq` (default)
- Navy headings, Gold accent on table headers, Cream background hints
- Calibri font family throughout
- Professional academic look matching CasesIQ platform branding

### `academic`
- Black headings, no color accents
- Times New Roman body, Arial headings
- Double-spaced body text, 12pt font
- Standard APA/MLA-friendly formatting

### `plain`
- No color styling, default Word fonts
- Single-spaced, minimal formatting
- Suitable for content that will be further styled by the recipient

---

## Block Types

Content is passed as an ordered list of block objects. Each block has a `type` and
type-specific properties.

| Block Type | Description | Required Properties |
|------------|-------------|-------------------|
| `heading` | Section heading (H1-H3) | `level` (1-3), `text` |
| `paragraph` | Body text paragraph | `text`, optional `bold`, `italic` |
| `table` | Data table with headers | `headers`, `rows` |
| `bullet_list` | Unordered list | `items` (list of strings) |
| `numbered_list` | Ordered list | `items` (list of strings) |
| `divider` | Horizontal rule / visual separator | (no additional properties) |
| `page_break` | Force new page | (no additional properties) |
| `styled_text` | Mixed-format paragraph | `runs` (list of run objects) |
| `image` | Embedded image | `path`, optional `width_inches` |
| `spacer` | Vertical whitespace | optional `lines` (default: 1) |

### Block Examples

```python
blocks = [
    {"type": "heading", "level": 1, "text": "Case Analysis: Acme Corp"},
    {"type": "paragraph", "text": "This analysis evaluates three strategic alternatives..."},
    {"type": "heading", "level": 2, "text": "Recommendations"},
    {"type": "bullet_list", "items": [
        "Pursue international expansion into Southeast Asian markets",
        "Divest the legacy hardware division within 18 months",
        "Invest $12M in digital transformation infrastructure",
    ]},
    {"type": "heading", "level": 2, "text": "Financial Overview"},
    {"type": "table", "headers": ["Metric", "2023", "2024", "Projected 2025"], "rows": [
        ["Revenue ($M)", "45.2", "52.8", "61.5"],
        ["Operating Margin", "12.1%", "9.8%", "14.2%"],
        ["ROIC", "8.5%", "7.2%", "11.0%"],
    ]},
    {"type": "page_break"},
    {"type": "heading", "level": 2, "text": "Exhibit A: SWOT Analysis"},
    {"type": "styled_text", "runs": [
        {"text": "Strengths: ", "bold": True},
        {"text": "Strong brand recognition, diversified revenue streams, experienced leadership."},
    ]},
    {"type": "divider"},
]
```

---

## Core Implementation

### Document Setup and Style Configuration

```python
from docx import Document
from docx.shared import Pt, Inches, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
import os

# CasesIQ brand colors
NAVY = RGBColor(27, 54, 93)
GOLD = RGBColor(196, 163, 90)
CREAM = RGBColor(245, 243, 238)
BLUE = RGBColor(72, 159, 200)
PURPLE = RGBColor(151, 105, 197)
WHITE = RGBColor(255, 255, 255)
BLACK = RGBColor(0, 0, 0)
LIGHT_GRAY = RGBColor(242, 242, 242)

def create_document(
    template_path: str = None,
    style_preset: str = "casesiq",
) -> Document:
    """Create a new document, optionally from a template."""
    if template_path and os.path.exists(template_path):
        doc = Document(template_path)
    else:
        doc = Document()

    configure_styles(doc, style_preset)
    configure_page_layout(doc)
    return doc

def configure_page_layout(doc: Document):
    """Set page margins to 1 inch all sides."""
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

def configure_styles(doc: Document, preset: str = "casesiq"):
    """Configure document styles based on preset."""
    style = doc.styles["Normal"]

    if preset == "casesiq":
        style.font.name = "Calibri"
        style.font.size = Pt(11)
        style.font.color.rgb = BLACK
        style.paragraph_format.line_spacing = 1.15
        style.paragraph_format.space_after = Pt(6)

        _configure_heading_style(doc, "Heading 1", "Calibri", 18, NAVY, True)
        _configure_heading_style(doc, "Heading 2", "Calibri", 14, NAVY, True)
        _configure_heading_style(doc, "Heading 3", "Calibri", 12, NAVY, True)

    elif preset == "academic":
        style.font.name = "Times New Roman"
        style.font.size = Pt(12)
        style.font.color.rgb = BLACK
        style.paragraph_format.line_spacing = 2.0
        style.paragraph_format.space_after = Pt(0)

        _configure_heading_style(doc, "Heading 1", "Arial", 16, BLACK, True)
        _configure_heading_style(doc, "Heading 2", "Arial", 14, BLACK, True)
        _configure_heading_style(doc, "Heading 3", "Arial", 12, BLACK, True)

    # 'plain' preset uses Word defaults — no changes needed

def _configure_heading_style(
    doc: Document,
    style_name: str,
    font_name: str,
    font_size: int,
    color: RGBColor,
    bold: bool,
):
    """Configure a heading style."""
    style = doc.styles[style_name]
    style.font.name = font_name
    style.font.size = Pt(font_size)
    style.font.color.rgb = color
    style.font.bold = bold
    style.paragraph_format.space_before = Pt(12)
    style.paragraph_format.space_after = Pt(6)
```

### Block Renderers

```python
def render_heading(doc: Document, block: dict):
    """Render a heading block."""
    level = block.get("level", 1)
    style_map = {1: "Heading 1", 2: "Heading 2", 3: "Heading 3"}
    doc.add_heading(block["text"], level=level)

def render_paragraph(doc: Document, block: dict, preset: str = "casesiq"):
    """Render a body text paragraph."""
    para = doc.add_paragraph()
    run = para.add_run(block["text"])

    if block.get("bold"):
        run.bold = True
    if block.get("italic"):
        run.italic = True
    if block.get("underline"):
        run.underline = True

def render_styled_text(doc: Document, block: dict):
    """Render a paragraph with mixed formatting (multiple runs)."""
    para = doc.add_paragraph()

    for run_def in block["runs"]:
        run = para.add_run(run_def["text"])
        if run_def.get("bold"):
            run.bold = True
        if run_def.get("italic"):
            run.italic = True
        if run_def.get("underline"):
            run.underline = True
        if run_def.get("color"):
            run.font.color.rgb = RGBColor(*run_def["color"])
        if run_def.get("size"):
            run.font.size = Pt(run_def["size"])

def render_bullet_list(doc: Document, block: dict):
    """Render an unordered (bullet) list."""
    for item in block["items"]:
        doc.add_paragraph(item, style="List Bullet")

def render_numbered_list(doc: Document, block: dict):
    """Render an ordered (numbered) list."""
    for item in block["items"]:
        doc.add_paragraph(item, style="List Number")

def render_divider(doc: Document, block: dict):
    """Render a horizontal divider line."""
    para = doc.add_paragraph()
    para.paragraph_format.space_before = Pt(6)
    para.paragraph_format.space_after = Pt(6)
    # Add a bottom border to simulate a horizontal rule
    pPr = para._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        f'  <w:bottom w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/>'
        f'</w:pBdr>'
    )
    pPr.append(pBdr)

def render_page_break(doc: Document, block: dict):
    """Insert a page break."""
    doc.add_page_break()

def render_spacer(doc: Document, block: dict):
    """Insert vertical whitespace."""
    lines = block.get("lines", 1)
    for _ in range(lines):
        doc.add_paragraph()

def render_image(doc: Document, block: dict):
    """Insert an image into the document."""
    width = Inches(block.get("width_inches", 5))
    doc.add_picture(block["path"], width=width)
```

### Table Formatting

```python
def render_table(doc: Document, block: dict, preset: str = "casesiq"):
    """Render a formatted data table."""
    headers = block["headers"]
    rows = block["rows"]
    col_count = len(headers)

    table = doc.add_table(rows=1 + len(rows), cols=col_count)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = "Table Grid"

    # Header row
    header_row = table.rows[0]
    for i, header_text in enumerate(headers):
        cell = header_row.cells[i]
        cell.text = header_text
        _style_cell(cell, bold=True, preset=preset, is_header=True)

    # Data rows
    for row_idx, row_data in enumerate(rows):
        row = table.rows[row_idx + 1]
        for col_idx, cell_text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.text = str(cell_text)
            _style_cell(
                cell,
                preset=preset,
                is_header=False,
                is_alt_row=(row_idx % 2 == 1),
            )

    # Auto-fit column widths
    _autofit_table(table)

    # Add spacing after table
    doc.add_paragraph()

def _style_cell(
    cell,
    bold: bool = False,
    preset: str = "casesiq",
    is_header: bool = False,
    is_alt_row: bool = False,
):
    """Apply styling to a table cell."""
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            if preset == "casesiq":
                run.font.name = "Calibri"
                run.font.size = Pt(10)
                if is_header:
                    run.bold = True
                    run.font.color.rgb = WHITE
            elif preset == "academic":
                run.font.name = "Times New Roman"
                run.font.size = Pt(10)
                if is_header:
                    run.bold = True

            if bold:
                run.bold = True

    # Cell shading
    if preset == "casesiq":
        if is_header:
            _set_cell_shading(cell, "1B365D")  # Navy header
        elif is_alt_row:
            _set_cell_shading(cell, "F5F3EE")  # Cream alternating rows
    elif preset == "academic":
        if is_header:
            _set_cell_shading(cell, "D9D9D9")  # Light gray header
        elif is_alt_row:
            _set_cell_shading(cell, "F2F2F2")  # Lighter gray alternating

def _set_cell_shading(cell, hex_color: str):
    """Set background shading on a table cell."""
    shading_elm = parse_xml(
        f'<w:shd {nsdecls("w")} w:fill="{hex_color}" w:val="clear"/>'
    )
    cell._tc.get_or_add_tcPr().append(shading_elm)

def _autofit_table(table):
    """Enable table auto-fit to window width."""
    tbl = table._tbl
    tblPr = tbl.tblPr if tbl.tblPr is not None else parse_xml(
        f'<w:tblPr {nsdecls("w")}/>'
    )
    tblW = parse_xml(
        f'<w:tblW {nsdecls("w")} w:type="pct" w:w="5000"/>'
    )
    tblPr.append(tblW)
```

### Headers, Footers, and Page Numbers

```python
def add_header_footer(
    doc: Document,
    header_text: str = None,
    footer_text: str = None,
    include_page_numbers: bool = True,
    preset: str = "casesiq",
):
    """Add headers and footers to all sections."""
    for section in doc.sections:
        # Header
        if header_text:
            header = section.header
            header.is_linked_to_previous = False
            para = header.paragraphs[0] if header.paragraphs else header.add_paragraph()
            para.text = header_text
            para.alignment = WD_ALIGN_PARAGRAPH.RIGHT

            for run in para.runs:
                run.font.size = Pt(9)
                run.font.italic = True
                if preset == "casesiq":
                    run.font.color.rgb = NAVY

        # Footer with page numbers
        footer = section.footer
        footer.is_linked_to_previous = False
        para = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER

        if footer_text:
            run = para.add_run(footer_text + "  |  ")
            run.font.size = Pt(9)
            if preset == "casesiq":
                run.font.color.rgb = NAVY

        if include_page_numbers:
            _add_page_number_field(para, preset)

def _add_page_number_field(paragraph, preset: str = "casesiq"):
    """Insert a PAGE field code for automatic page numbering."""
    run = paragraph.add_run()
    run.font.size = Pt(9)
    if preset == "casesiq":
        run.font.color.rgb = NAVY

    fldChar_begin = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    run._r.append(fldChar_begin)

    instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
    run._r.append(instrText)

    fldChar_end = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    run._r.append(fldChar_end)
```

---

## Template System

Load a base .docx template and inject content at defined positions.

```python
def generate_from_template(
    template_path: str,
    output_path: str,
    replacements: dict[str, str] = None,
    blocks: list[dict] = None,
    style_preset: str = "casesiq",
):
    """
    Generate a document from a template.

    Supports two modes:
    1. Placeholder replacement — find {{PLACEHOLDER}} strings and replace with values
    2. Block injection — append structured content blocks after template content

    Args:
        template_path: Path to the .docx template file
        output_path: Path for the generated output file
        replacements: Dict mapping placeholder names to replacement values
        blocks: List of content blocks to append after template content
        style_preset: Style preset to apply
    """
    doc = Document(template_path)
    configure_styles(doc, style_preset)

    # Mode 1: Placeholder replacement
    if replacements:
        for paragraph in doc.paragraphs:
            for key, value in replacements.items():
                placeholder = "{{" + key + "}}"
                if placeholder in paragraph.text:
                    _replace_in_paragraph(paragraph, placeholder, value)

        # Also replace in tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        for key, value in replacements.items():
                            placeholder = "{{" + key + "}}"
                            if placeholder in paragraph.text:
                                _replace_in_paragraph(paragraph, placeholder, value)

        # Also replace in headers and footers
        for section in doc.sections:
            for paragraph in section.header.paragraphs:
                for key, value in replacements.items():
                    placeholder = "{{" + key + "}}"
                    if placeholder in paragraph.text:
                        _replace_in_paragraph(paragraph, placeholder, value)
            for paragraph in section.footer.paragraphs:
                for key, value in replacements.items():
                    placeholder = "{{" + key + "}}"
                    if placeholder in paragraph.text:
                        _replace_in_paragraph(paragraph, placeholder, value)

    # Mode 2: Append content blocks
    if blocks:
        render_blocks(doc, blocks, style_preset)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc.save(output_path)
    return output_path

def _replace_in_paragraph(paragraph, placeholder: str, replacement: str):
    """Replace placeholder text while preserving paragraph formatting."""
    # Rebuild the full text from runs, find the placeholder, and replace
    full_text = "".join(run.text for run in paragraph.runs)
    if placeholder not in full_text:
        return

    new_text = full_text.replace(placeholder, replacement)

    # Clear all runs except the first, set text on the first
    for i, run in enumerate(paragraph.runs):
        if i == 0:
            run.text = new_text
        else:
            run.text = ""
```

---

## Main Orchestrator

```python
def render_blocks(doc: Document, blocks: list[dict], preset: str = "casesiq"):
    """Render a list of content blocks into the document."""
    renderers = {
        "heading": render_heading,
        "paragraph": lambda d, b: render_paragraph(d, b, preset),
        "styled_text": render_styled_text,
        "bullet_list": render_bullet_list,
        "numbered_list": render_numbered_list,
        "table": lambda d, b: render_table(d, b, preset),
        "divider": render_divider,
        "page_break": render_page_break,
        "spacer": render_spacer,
        "image": render_image,
    }

    for block in blocks:
        renderer = renderers.get(block["type"])
        if renderer:
            renderer(doc, block)
        else:
            # Unknown block type — render as plain paragraph with warning
            para = doc.add_paragraph(f"[Unknown block type: {block['type']}]")
            para.runs[0].font.color.rgb = RGBColor(255, 0, 0)

def generate_document(
    blocks: list[dict],
    output_path: str,
    style_preset: str = "casesiq",
    template_path: str = None,
    header_text: str = None,
    footer_text: str = None,
    include_page_numbers: bool = True,
) -> str:
    """
    Main entry point for document generation.

    Args:
        blocks: Ordered list of content block dicts
        output_path: Absolute path for the output .docx file
        style_preset: 'casesiq', 'academic', or 'plain'
        template_path: Optional path to a .docx template
        header_text: Optional text for page headers
        footer_text: Optional text for page footers
        include_page_numbers: Whether to add page numbers to footer

    Returns:
        The absolute path to the generated .docx file.
    """
    doc = create_document(template_path, style_preset)

    render_blocks(doc, blocks, style_preset)

    if header_text or footer_text or include_page_numbers:
        add_header_footer(doc, header_text, footer_text, include_page_numbers, style_preset)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc.save(output_path)

    return output_path
```

---

## Usage Example: CasesIQ Feedback Document

```python
# Example: generating a grading feedback document
blocks = [
    {"type": "heading", "level": 1, "text": "Case Analysis Feedback"},
    {"type": "styled_text", "runs": [
        {"text": "Student: ", "bold": True},
        {"text": "Jane Doe"},
        {"text": "  |  ", "color": (196, 163, 90)},
        {"text": "Case: ", "bold": True},
        {"text": "Acme Corp Strategic Crossroads"},
    ]},
    {"type": "styled_text", "runs": [
        {"text": "Overall Grade: ", "bold": True},
        {"text": "87/100 — Meets Expectations", "bold": True, "color": (27, 54, 93)},
    ]},
    {"type": "divider"},
    {"type": "heading", "level": 2, "text": "Score Breakdown"},
    {"type": "table", "headers": ["Criterion", "Points Possible", "Points Earned", "Notes"], "rows": [
        ["Memo Format", "2", "2", "Correct format"],
        ["Introduction / Key Issues", "8", "7", "Strong, minor omission"],
        ["Recommendations", "8", "6", "Include more specific actions"],
        ["Decision Criteria", "8", "8", "Excellent weighted criteria"],
        ["Analysis", "8", "7", "Good depth, needs more data"],
        ["SWOT Analysis", "8", "8", "Comprehensive"],
        ["Decision Matrix", "8", "7", "Missing one alternative"],
    ]},
    {"type": "page_break"},
    {"type": "heading", "level": 2, "text": "Detailed Feedback"},
    {"type": "paragraph", "text": "Your analysis demonstrates a solid understanding of the strategic issues facing Acme Corp..."},
    {"type": "heading", "level": 3, "text": "Areas for Improvement"},
    {"type": "bullet_list", "items": [
        "Recommendations should be concise action items without rationale (save that for Analysis)",
        "Include specific financial data to support your PESTEL analysis",
        "The Five Forces exhibit needs more depth on supplier bargaining power",
    ]},
]

output = generate_document(
    blocks=blocks,
    output_path="/mnt/user-data/outputs/JaneDoe_AcmeCorp_Feedback.docx",
    style_preset="casesiq",
    header_text="CasesIQ - Case Analysis Feedback",
    footer_text="Confidential",
    include_page_numbers=True,
)
```

---

## Edge Cases

- **Very long documents (100+ pages)**: python-docx handles large documents well, but
  monitor memory usage. For documents with many tables (50+), consider flushing the document
  to disk periodically by saving and reopening. Warn the user if generation exceeds 30 seconds.

- **Documents with many tables**: Each table adds significant XML overhead. For documents
  with more than 30 tables, auto-fit may slow down. Consider disabling alternating row
  shading for very large tables (50+ rows) to reduce XML complexity.

- **Unicode characters**: python-docx handles Unicode natively. CJK characters, mathematical
  symbols, and emoji will render correctly if the font supports them. For CJK content,
  consider switching body font to "MS Mincho" or "SimSun" as Calibri has limited CJK coverage.

- **Right-to-left (RTL) text**: For Arabic or Hebrew content, set paragraph alignment to
  RIGHT and enable RTL on the paragraph format:
  ```python
  paragraph.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
  pPr = paragraph._p.get_or_add_pPr()
  bidi = parse_xml(f'<w:bidi {nsdecls("w")} w:val="1"/>')
  pPr.append(bidi)
  ```

- **Merging with existing templates**: When loading a template, existing styles may conflict
  with configured styles. The template's styles take precedence for elements already in the
  template. New content added via blocks uses the configured styles. If the template defines
  custom styles (e.g., "CasesIQ Heading"), reference them by name in the block definitions.

- **Missing fonts on target system**: Documents reference fonts by name. If the recipient's
  system lacks Calibri, Word will substitute. For maximum compatibility, embed fonts by
  setting `doc.settings.element.append(parse_xml(...))` with embed font XML — though this
  increases file size significantly.

- **Image paths that don't exist**: Validate image paths before rendering. If an image file
  is missing, insert a placeholder paragraph: "[Image not found: filename.png]" in red text
  and continue rendering the rest of the document.

- **Nested lists**: python-docx does not natively support nested bullet lists. For indented
  sub-items, use a custom style with increased left indent:
  ```python
  para = doc.add_paragraph(sub_item, style="List Bullet 2")
  ```

- **Table cells with long text**: python-docx wraps text automatically. For cells with
  very long content (500+ characters), the table may become hard to read. Consider
  truncating cell content and adding a footnote.

- **Concurrent generation**: python-docx is not thread-safe for a single Document object.
  If generating multiple documents in parallel, create separate Document instances for each.

---

## Integration with Other Skills

This skill is the **standard output layer** for any CasesIQ skill that produces Word documents:

- **feedback-docx-writer** — uses this skill to format grading feedback as branded .docx
- **best-practice-generator** — generates model answer documents with all exhibits
- **lessons-learned-generator** — produces lessons-learned reports from course case data
- **syllabus-generator** — creates formatted course syllabi with tables and schedules
- **rubric-builder** — outputs grading rubric documents with scoring tables
- **case-grader** — final feedback delivery as a professionally formatted Word document
- **Any export workflow** — when structured content needs to become a downloadable .docx

Other skills should pass structured content blocks to this skill rather than implementing
their own python-docx logic. This ensures consistent branding, formatting, and maintainability
across all CasesIQ document outputs.

---

## Dependencies

```
python-docx>=1.1.0
```
