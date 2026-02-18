Research a topic using NotebookLM's deep research capability.

$ARGUMENTS

## Instructions

The user's research query is in $ARGUMENTS. If empty, ask what they want to research.

1. Create a dedicated research notebook:
   ```
   nlm notebook create "Research: <topic summary>"
   ```
   Capture the notebook ID.

2. Start deep research:
   ```
   nlm research start "$ARGUMENTS" -n <notebook-id> -m deep
   ```

3. Poll for completion (deep research takes ~5 minutes):
   ```
   nlm research status <notebook-id>
   ```
   Wait until research completes. Check every 30 seconds.

4. Import discovered sources:
   ```
   nlm research import -n <notebook-id>
   ```

5. If the user mentioned specific URLs or papers, add them as sources:
   ```
   nlm source add <notebook-id> --url "<url>" -w
   ```

6. Query the notebook with the original research question:
   ```
   nlm query notebook <notebook-id> "$ARGUMENTS"
   ```

7. Generate a briefing document:
   ```
   nlm report create <notebook-id> -f "Briefing Doc" -y
   ```

8. Wait for report generation, then download:
   ```
   nlm studio status <notebook-id>
   nlm download report <notebook-id> -o ./research-report.md
   ```

9. Present the key findings to the user. Include:
   - Summary of what was discovered
   - Number of sources found and imported
   - Key insights from the query
   - Location of the downloaded report (`./research-report.md`)
   - The notebook ID for follow-up queries
