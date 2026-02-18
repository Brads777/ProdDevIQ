Build a stack-specific debugging knowledge base in NotebookLM.

$ARGUMENTS

## Instructions

Determine the mode based on arguments:
- If arguments contain "init" or no debug-companion alias exists → **Init Mode**
- Otherwise → **Query Mode** (query the debug companion with the argument as the question)

### Init Mode

1. Detect the project's tech stack by examining:
   - `package.json` → Node.js/JavaScript/TypeScript
   - `pyproject.toml` / `requirements.txt` → Python
   - `Cargo.toml` → Rust
   - `go.mod` → Go
   - `pom.xml` / `build.gradle` → Java
   - `Gemfile` → Ruby
   - Framework indicators (Next.js, Django, Rails, etc.)

2. Create the notebook:
   ```
   nlm notebook create "Debug Companion - <project-name> (<stack>)"
   ```
   Capture the notebook ID.

3. Register the alias:
   ```
   nlm alias set debug-companion <notebook-id> -t notebook
   ```

4. Run deep research on common debugging patterns for the detected stack:
   ```
   nlm research start "<stack> debugging common errors best practices troubleshooting" -n <notebook-id> -m deep
   ```

5. Wait for research to complete:
   ```
   nlm research status <notebook-id>
   ```

6. Import discovered sources:
   ```
   nlm research import -n <notebook-id>
   ```

7. Add official documentation URLs for the detected frameworks:
   - Node.js: `nlm source add <notebook-id> --url "https://nodejs.org/en/docs/guides" -w`
   - React: `nlm source add <notebook-id> --url "https://react.dev/reference/react" -w`
   - Python: `nlm source add <notebook-id> --url "https://docs.python.org/3/tutorial/errors.html" -w`
   - Add other relevant official docs based on the stack.

8. Update the Notebook Registry in CLAUDE.md with the real ID.

9. Test with a sample query:
   ```
   nlm query notebook debug-companion "What are the most common errors in <stack> and how to fix them?"
   ```

10. Report the setup results and how to use the debug companion.

### Query Mode

1. Query the debug companion with the user's question:
   ```
   nlm query notebook debug-companion "$ARGUMENTS"
   ```

2. If the answer is insufficient, suggest:
   - Adding more specific sources
   - Running targeted research
   - Falling back to web search

3. Present the debugging guidance from the notebook.
