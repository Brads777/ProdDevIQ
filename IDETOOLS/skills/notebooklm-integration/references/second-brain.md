Create or update the project's "Second Brain" knowledge base in NotebookLM.

$ARGUMENTS

## Instructions

Determine the mode based on arguments:
- If arguments contain "init" or no second-brain alias exists yet → **Init Mode**
- Otherwise → **Update Mode**

### Init Mode

1. Create the notebook:
   ```
   nlm notebook create "Second Brain - <project-name>"
   ```
   Capture the notebook ID from the output.

2. Register the alias:
   ```
   nlm alias set second-brain <notebook-id> -t notebook
   ```

3. Add project documentation as sources. Look for these files and add any that exist:
   ```
   nlm source add second-brain --file README.md -w
   nlm source add second-brain --file CLAUDE.md -w
   ```
   Also add any files in `docs/` directory:
   ```
   nlm source add second-brain --file <each-doc-file> -w
   ```

4. If a `package.json`, `pyproject.toml`, `Cargo.toml`, or similar manifest exists, add it:
   ```
   nlm source add second-brain --file <manifest> -w
   ```

5. Create an initial note with project context:
   ```
   nlm note create second-brain -c "Project initialized. Tech stack: <detected stack>. Key files: <list>." -t "Project Setup"
   ```

6. Update the Notebook Registry in CLAUDE.md — replace the `second-brain` placeholder ID with the real ID.

7. Verify by querying:
   ```
   nlm query notebook second-brain "What is this project about?"
   ```

8. Report the notebook ID and what sources were added.

### Update Mode

1. Check recent git activity:
   ```
   git log --oneline -5
   ```

2. If the user provided specific content in $ARGUMENTS, create a note with that content:
   ```
   nlm note create second-brain -c "<user content>" -t "<appropriate title>"
   ```

3. If no specific content, summarize recent changes from git log and create a note:
   ```
   nlm note create second-brain -c "<summary of recent changes>" -t "Update: <date>"
   ```

4. If any new documentation files were added since last update, add them as sources:
   ```
   nlm source add second-brain --file <new-doc> -w
   ```

5. Report what was added to the knowledge base.
