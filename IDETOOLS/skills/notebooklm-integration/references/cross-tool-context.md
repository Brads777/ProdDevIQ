Create or sync a shared notebook for cross-tool AI context (Cursor, Copilot, Claude Code, etc.).

$ARGUMENTS

## Instructions

Determine the mode based on arguments:
- If arguments contain "init" or no cross-tool-kb alias exists → **Init Mode**
- If arguments contain "sync" → **Sync Mode**
- Otherwise → **Query Mode**

### Init Mode

1. Create the notebook:
   ```
   nlm notebook create "Cross-Tool KB - <project-name>"
   ```
   Capture the notebook ID.

2. Register the alias:
   ```
   nlm alias set cross-tool-kb <notebook-id> -t notebook
   ```

3. Add all documentation files as sources. Search for and add:
   - `README.md`
   - `CLAUDE.md`
   - All files in `docs/` directory
   - `CONTRIBUTING.md`, `ARCHITECTURE.md`, `CHANGELOG.md` if they exist
   ```
   nlm source add cross-tool-kb --file <each-file> -w
   ```

4. Pack the full codebase with repomix and add it:
   ```
   repomix . --output /tmp/repomix-cross-tool.md
   nlm source add cross-tool-kb --file /tmp/repomix-cross-tool.md -w
   ```

5. Make the notebook publicly accessible:
   ```
   nlm share public <notebook-id>
   ```

6. Update the Notebook Registry in CLAUDE.md with the real ID.

7. Get the sharing status to retrieve the public URL:
   ```
   nlm share status cross-tool-kb
   ```

8. Report:
   - The notebook ID
   - The public sharing URL
   - How other tools can reference this notebook
   - How many sources were added

### Sync Mode

1. Find files changed since last sync. Check git for recent changes to docs:
   ```
   git diff --name-only HEAD~5 -- "*.md" "docs/" "README*" "CLAUDE*"
   ```

2. For each changed documentation file, re-add it as a source:
   ```
   nlm source add cross-tool-kb --file <changed-file> -w
   ```

3. If significant code changes occurred, regenerate the repomix pack:
   ```
   repomix . --output /tmp/repomix-cross-tool.md
   nlm source add cross-tool-kb --file /tmp/repomix-cross-tool.md -w
   ```

4. Report what was synced.

### Query Mode

1. Query the cross-tool knowledge base:
   ```
   nlm query notebook cross-tool-kb "$ARGUMENTS"
   ```

2. Present the results.
