Pack a codebase with repomix and create visual explanations via NotebookLM.

$ARGUMENTS

## Instructions

The target is in $ARGUMENTS. If empty, use the current working directory.

1. Determine the target directory:
   - If $ARGUMENTS is a GitHub URL, clone it to a temp directory first:
     ```
     git clone <url> /tmp/explain-codebase-repo
     ```
     Use `/tmp/explain-codebase-repo` as the target.
   - If $ARGUMENTS is a local path, use that.
   - If empty, use the current working directory.

2. Pack the codebase with repomix:
   ```
   repomix <target-dir> --output /tmp/repomix-codebase.md
   ```

3. Create a notebook:
   ```
   nlm notebook create "Codebase: <project-name>"
   ```
   Capture the notebook ID.

4. Add the packed codebase as a source:
   ```
   nlm source add <notebook-id> --file /tmp/repomix-codebase.md -w
   ```

5. Also add README.md if it exists in the target:
   ```
   nlm source add <notebook-id> --file <target-dir>/README.md -w
   ```

6. Create a mind map of the architecture:
   ```
   nlm mindmap create <notebook-id> -t "Architecture Overview" -y
   ```

7. Create an infographic:
   ```
   nlm infographic create <notebook-id> -y
   ```

8. Wait for artifacts to generate:
   ```
   nlm studio status <notebook-id>
   ```

9. Download the mind map:
   ```
   mkdir -p ./nlm-visualizations
   nlm download mind-map <notebook-id> -o ./nlm-visualizations/codebase-mindmap.json
   ```

10. Query the notebook for a high-level overview:
    ```
    nlm query notebook <notebook-id> "Give me a high-level overview of this codebase: architecture, key components, tech stack, and how data flows through the system."
    ```

11. Present to the user:
    - The architecture overview from the query
    - Location of the mind map JSON
    - The notebook ID for follow-up questions
    - Suggest follow-up queries they can run
