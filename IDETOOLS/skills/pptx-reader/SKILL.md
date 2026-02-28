---
name: pptx-reader
description: >
  Extract and analyze content from PowerPoint presentations (.pptx files). Use this skill when
  a user uploads or references a .pptx file and needs to read slides, extract text, speaker notes,
  images, tables, charts, or understand the presentation structure. Triggers include requests to
  "read this PowerPoint", "extract slides", "analyze this presentation", "summarize this deck",
  "get the speaker notes", or any task that requires parsing .pptx content for downstream use
  (grading, summarizing, converting, or feeding into other skills).
---

# ©2026 Brad Scheller

# PowerPoint Presentation Reader

Extract structured content from .pptx files including slide text, speaker notes, tables, images,
and layout metadata for downstream analysis, grading, or conversion.

## Required Inputs

1. **PowerPoint File** — a .pptx file (path or upload)
2. **Extraction Mode** — one of: `full`, `text-only`, `notes-only`, `structure` (default: `full`)
3. **Output Format** — one of: `markdown`, `json`, `plain` (default: `markdown`)

If the file is missing, ask the user to provide it.

## How It Works

A .pptx file is a ZIP archive containing XML files. The key structure:

```
presentation.pptx (ZIP)
├── [Content_Types].xml
├── _rels/.rels
├── ppt/
│   ├── presentation.xml          ← slide order & metadata
│   ├── slides/
│   │   ├── slide1.xml            ← slide content (shapes, text, tables)
│   │   ├── slide2.xml
│   │   └── ...
│   ├── notesSlides/
│   │   ├── notesSlide1.xml       ← speaker notes per slide
│   │   └── ...
│   ├── slideMasters/             ← master layout definitions
│   ├── slideLayouts/             ← layout templates
│   ├── media/                    ← embedded images, audio, video
│   └── theme/                    ← color/font themes
└── docProps/
    ├── core.xml                  ← author, title, dates
    └── app.xml                   ← slide count, app metadata
```

## Extraction Workflow

### Step 1: Validate File
- Confirm the file exists and has `.pptx` extension
- Verify it's a valid ZIP archive

### Step 2: Extract Archive
```bash
# Create temp directory and extract
TEMP_DIR=$(mktemp -d)
unzip -q "<file_path>" -d "$TEMP_DIR"
```

### Step 3: Parse Presentation Metadata
Read `$TEMP_DIR/docProps/core.xml` for:
- **Title** — `dc:title`
- **Author** — `dc:creator`
- **Created** — `dcterms:created`
- **Modified** — `dcterms:modified`
- **Subject** — `dc:subject`

Read `$TEMP_DIR/docProps/app.xml` for:
- **Slide count** — `Slides`
- **Application** — `Application`

### Step 4: Determine Slide Order
Read `$TEMP_DIR/ppt/presentation.xml` to get the ordered list of slide relationships.
Then read `$TEMP_DIR/ppt/_rels/presentation.xml.rels` to map relationship IDs to slide filenames.

### Step 5: Extract Slide Content
For each slide XML file (`ppt/slides/slideN.xml`):

1. **Text content**: Find all `<a:t>` elements within `<p:sp>` (shape) elements. Group by
   `<a:p>` (paragraph) boundaries. Preserve bullet/numbering from `<a:buChar>` or `<a:buAutoNum>`.

2. **Slide title**: The shape with `type="title"` or `idx="0"` in the placeholder attributes
   (`<p:ph type="title"/>`) contains the slide title.

3. **Tables**: `<a:tbl>` elements contain rows (`<a:tr>`) and cells (`<a:tc>`). Extract as
   markdown tables or structured data.

4. **Images**: `<p:pic>` elements reference media via `<a:blip r:embed="rIdN"/>`. Map the
   relationship ID to the actual file in `ppt/media/`. Note the filename and dimensions.

5. **Charts**: `<c:chart>` references indicate embedded charts. Note their presence and
   extract the title if available.

6. **SmartArt**: `<dgm:relIds>` indicates SmartArt diagrams. Extract visible text content.

7. **Hyperlinks**: `<a:hlinkClick r:id="rIdN"/>` elements reference URLs in the slide's
   `.rels` file.

### Step 6: Extract Speaker Notes
For each slide, check for a corresponding notes file in `ppt/notesSlides/`:
- Read `$TEMP_DIR/ppt/slides/_rels/slideN.xml.rels` to find the notesSlide relationship
- Parse the notes XML for `<a:t>` elements within `<p:sp>` shapes that are NOT the slide
  image placeholder (skip shapes with `<p:ph type="sldImg"/>` or `idx="2"`)

### Step 7: Extract Embedded Media Inventory
List all files in `ppt/media/` with their types:
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` — images
- `.mp4`, `.wmv`, `.avi` — video
- `.mp3`, `.wav`, `.m4a` — audio
- `.emf`, `.wmf` — vector graphics

---

## Output Formats

### Markdown Output (default)
```markdown
# [Presentation Title]
**Author:** [Author] | **Slides:** [Count] | **Modified:** [Date]

---

## Slide 1: [Title]
[Body text, preserving paragraphs and bullets]

| Col 1 | Col 2 | Col 3 |
|-------|-------|-------|
| data  | data  | data  |

> **Speaker Notes:** [Notes text]

[Image: filename.png — embedded image description if alt-text available]

---

## Slide 2: [Title]
...
```

### JSON Output
```json
{
  "metadata": {
    "title": "...",
    "author": "...",
    "slideCount": 12,
    "created": "2026-01-15T...",
    "modified": "2026-02-10T..."
  },
  "slides": [
    {
      "number": 1,
      "title": "...",
      "content": [
        { "type": "text", "value": "..." },
        { "type": "bullet", "items": ["...", "..."] },
        { "type": "table", "headers": [...], "rows": [[...], [...]] },
        { "type": "image", "filename": "image1.png", "altText": "..." }
      ],
      "notes": "...",
      "hyperlinks": ["https://..."]
    }
  ],
  "media": [
    { "filename": "image1.png", "type": "image", "size": 45230 }
  ]
}
```

### Plain Text Output
Slide titles as headers, body text only, no formatting. Speaker notes appended per slide
in brackets.

---

## Extraction Modes

| Mode | What's Extracted |
|------|-----------------|
| `full` | Everything: text, notes, tables, images, metadata, hyperlinks |
| `text-only` | Slide text and titles only — no notes, images, or tables |
| `notes-only` | Speaker notes only, organized by slide number |
| `structure` | Slide titles + bullet point outline only (no body paragraphs) |

---

## Edge Cases

- **Password-protected files**: Cannot extract. Inform user the file is encrypted.
- **Macro-enabled (.pptm)**: Treat identically to .pptx — same ZIP/XML structure.
- **Older .ppt format**: NOT supported (binary format). Inform user to save as .pptx.
- **Empty slides**: Include in output with "[Empty slide]" placeholder.
- **Slides with only images**: Note the image filenames; provide alt-text if available.
- **Master slide content**: Do NOT extract master/layout slide content — only actual slides.
- **Hidden slides**: Include but mark as `[HIDDEN]` in output.
- **Grouped shapes**: Recurse into `<p:grpSp>` to extract nested text.
- **Very large presentations (100+ slides)**: Process in batches of 25 slides to avoid
  memory issues. Report progress.

---

## Integration with Other Skills

This skill produces structured output that feeds into:
- **case-grader**: When student submissions are PowerPoint presentations instead of Word docs
- **best-practice-generator**: When case materials or teacher notes are in .pptx format
- **lessons-learned-generator**: When course content is delivered as slide decks
- **rubric-builder**: When rubric criteria are defined in a presentation
- **Any summarization or analysis skill**: Provides clean text extraction for LLM processing

---

## Cleanup

After extraction, remove the temporary directory:
```bash
rm -rf "$TEMP_DIR"
```
