Generate visual artifacts (mind maps, infographics, slides, reports) from a NotebookLM notebook.

$ARGUMENTS

## Instructions

Parse $ARGUMENTS for:
- **Notebook identifier**: alias or ID (required — if missing, ask the user)
- **Type**: mindmap, infographic, slides, data-table, report, or "all" (default: all)

### Steps

1. Resolve the notebook. If an alias is given, verify it exists:
   ```
   nlm alias get <alias>
   ```

2. Create the output directory:
   ```
   mkdir -p ./nlm-visualizations
   ```

3. Based on the requested type, create and download artifacts:

   **Mind Map** (type: mindmap or all):
   ```
   nlm mindmap create <notebook-id> -t "Knowledge Map" -y
   ```
   Wait for generation, then download:
   ```
   nlm download mind-map <notebook-id> -o ./nlm-visualizations/mindmap.json
   ```

   **Infographic** (type: infographic or all):
   ```
   nlm infographic create <notebook-id> -y
   ```
   Wait, then download:
   ```
   nlm download infographic <notebook-id> -o ./nlm-visualizations/infographic.png
   ```

   **Slides** (type: slides or all):
   ```
   nlm slides create <notebook-id> -y
   ```
   Wait, then download:
   ```
   nlm download slide-deck <notebook-id> -o ./nlm-visualizations/slides.pdf
   ```

   **Data Table** (type: data-table or all):
   ```
   nlm data-table create <notebook-id> -y
   ```
   Wait, then download:
   ```
   nlm download data-table <notebook-id> -o ./nlm-visualizations/data-table.csv
   ```

   **Report** (type: report or all):
   ```
   nlm report create <notebook-id> -f "Briefing Doc" -y
   ```
   Wait, then download:
   ```
   nlm download report <notebook-id> -o ./nlm-visualizations/report.md
   ```

4. Check artifact generation status between creates:
   ```
   nlm studio status <notebook-id>
   ```

5. If a mind map was generated, read the JSON to provide a text-based navigation overview of the key topics and their relationships.

6. Report all generated artifacts with their file paths:
   - `./nlm-visualizations/mindmap.json`
   - `./nlm-visualizations/infographic.png`
   - `./nlm-visualizations/slides.pdf`
   - `./nlm-visualizations/data-table.csv`
   - `./nlm-visualizations/report.md`
