Build a security knowledge base and run a codebase security audit via NotebookLM.

$ARGUMENTS

## Instructions

Determine the mode based on arguments:
- If arguments contain "init" or no security-handbook alias exists → **Init Mode**
- If arguments contain "audit" → **Audit Mode**
- Otherwise → **Query Mode**

### Init Mode

1. Detect the tech stack (same detection as debug-companion: package.json, pyproject.toml, etc.).

2. Create the notebook:
   ```
   nlm notebook create "Security Handbook - <project-name> (<stack>)"
   ```
   Capture the notebook ID.

3. Register the alias:
   ```
   nlm alias set security-handbook <notebook-id> -t notebook
   ```

4. Run deep research on security for the detected stack:
   ```
   nlm research start "OWASP top 10 <stack> security vulnerabilities best practices" -n <notebook-id> -m deep
   ```

5. Wait for research to complete:
   ```
   nlm research status <notebook-id>
   ```

6. Import discovered sources:
   ```
   nlm research import -n <notebook-id>
   ```

7. Add curated security URLs from `templates/security-sources.md`. Add the Universal sources plus the stack-specific ones:
   ```
   nlm source add security-handbook --url "https://owasp.org/www-project-top-ten/" -w
   nlm source add security-handbook --url "https://cheatsheetseries.owasp.org/" -w
   ```
   Add additional URLs matching the detected stack from the template file.

8. Update the Notebook Registry in CLAUDE.md with the real ID.

9. Test with a query:
   ```
   nlm query notebook security-handbook "What are the top security risks for a <stack> application?"
   ```

10. Report the setup and available security topics.

### Audit Mode

1. Pack the codebase with repomix:
   ```
   repomix . --output /tmp/repomix-security-audit.md
   ```

2. Add the packed codebase as a source to the security handbook:
   ```
   nlm source add security-handbook --file /tmp/repomix-security-audit.md -w
   ```

3. Query the security handbook for each major risk area:
   ```
   nlm query notebook security-handbook "Analyze this codebase for injection vulnerabilities (SQL injection, command injection, XSS)"
   nlm query notebook security-handbook "Analyze this codebase for authentication and session management vulnerabilities"
   nlm query notebook security-handbook "Analyze this codebase for sensitive data exposure risks"
   nlm query notebook security-handbook "Analyze this codebase for security misconfiguration"
   nlm query notebook security-handbook "Analyze this codebase for insecure dependencies and known vulnerabilities"
   ```

4. Generate a comprehensive security report:
   ```
   nlm report create security-handbook -f "Create Your Own" --prompt "Create a comprehensive security audit report for this codebase. Organize findings by OWASP Top 10 category. For each finding include: severity (Critical/High/Medium/Low), description, affected code areas, and recommended remediation." -y
   ```

5. Wait for report generation:
   ```
   nlm studio status security-handbook
   ```

6. Download the report:
   ```
   mkdir -p ./nlm-visualizations
   nlm download report security-handbook -o ./nlm-visualizations/security-audit-report.md
   ```

7. Present findings organized by severity:
   - **Critical**: Issues requiring immediate attention
   - **High**: Significant vulnerabilities
   - **Medium**: Moderate risks
   - **Low**: Minor concerns and best practice recommendations

### Query Mode

1. Query the security handbook with the user's question:
   ```
   nlm query notebook security-handbook "$ARGUMENTS"
   ```

2. Present the security guidance.
