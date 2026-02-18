# NotebookLM Integration — Drop-in CLAUDE.md Snippet

Copy everything below this line into your project's CLAUDE.md to enable NotebookLM integration.

---

## NotebookLM Integration

This project uses NotebookLM as an external knowledge base via the `nlm` CLI.

### Notebook Registry

| Alias | Notebook ID | Purpose |
|---|---|---|
| `second-brain` | `<id>` | Project knowledge base — features, decisions, context |
| `debug-companion` | `<id>` | Stack-specific debugging patterns and solutions |
| `security-handbook` | `<id>` | OWASP top 10, security best practices |
| `cross-tool-kb` | `<id>` | Shared context across AI tools |

### Setup

```bash
# Register aliases after creating notebooks
nlm alias set second-brain <notebook-id> -t notebook
nlm alias set debug-companion <notebook-id> -t notebook
nlm alias set security-handbook <notebook-id> -t notebook
nlm alias set cross-tool-kb <notebook-id> -t notebook
```

### Automatic Rules

1. **After feature completion** (build passes): create a note in `second-brain`
   ```
   nlm note create second-brain -c "<summary>" -t "Feature: <name>"
   ```

2. **When debugging**: query `debug-companion` BEFORE web search
   ```
   nlm query notebook debug-companion "<error message>"
   ```

3. **Before marking feature complete**: check `security-handbook`
   ```
   nlm query notebook security-handbook "security risks for <feature>"
   ```

4. **When docs change**: sync to `cross-tool-kb`
   ```
   nlm source add cross-tool-kb --file <changed-file> -w
   ```
