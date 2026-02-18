# NLM CLI Complete Reference (v0.2.18)

Unified CLI for Google NotebookLM. Authentication is browser-cookie-based (not API keys).

---

## Global Flags

| Flag | Description |
|---|---|
| `--profile, -p <name>` | Use a specific authentication profile |
| `--help, -h` | Show help for any command |
| `--version` | Show CLI version |

---

## Authentication

### `nlm login`
Sign in to NotebookLM via browser.

| Flag | Description |
|---|---|
| `--check` | Verify current auth status (no browser) |
| `--file <path>` | Import cookies from file |
| `--profile, -p <name>` | Create/use named profile |

### `nlm doctor`
Run diagnostics to verify setup.

---

## Notebooks

### `nlm notebook create "<name>"`
Create a new notebook. Returns the notebook ID.

### `nlm notebook list`
List all notebooks.

| Flag | Description |
|---|---|
| `--limit, -l <n>` | Max results |

### `nlm notebook get <id>`
Get notebook details (title, source count, etc.).

### `nlm notebook describe <id>`
Generate an AI summary of the notebook contents.

### `nlm notebook rename <id> "<new-name>"`
Rename a notebook.

### `nlm notebook delete <id>`
Delete a notebook.

| Flag | Description |
|---|---|
| `--confirm, -y` | Skip confirmation prompt |

### `nlm notebook query <id> "<question>"`
Ask a question against notebook contents. Alias: `nlm query notebook`.

| Flag | Description |
|---|---|
| `--source-ids, -s <ids>` | Limit to specific sources (comma-separated) |
| `--conversation-id, -c <id>` | Continue an existing conversation |

---

## Sources

### `nlm source add <notebook-id> [options]`
Add a source to a notebook. Exactly one source type flag required.

| Flag | Description |
|---|---|
| `--url, -u <url>` | Add website or YouTube URL |
| `--file, -f <path>` | Upload local file (PDF, MD, TXT) |
| `--text, -t <content>` | Add inline text content |
| `--drive, -d <doc-id>` | Add Google Drive document |
| `--title <title>` | Set source title (required with `--text`) |
| `--type <type>` | Drive doc type: doc, slides, sheets, pdf |
| `--wait, -w` | Block until source processing completes |

### `nlm source list <notebook-id>`
List all sources in a notebook.

### `nlm source get <notebook-id> <source-id>`
Get source details.

### `nlm source describe <notebook-id> <source-id>`
AI-generated summary of a source.

### `nlm source content <notebook-id> <source-id>`
Retrieve raw source content.

### `nlm source delete <notebook-id> <source-id>`
Delete a source.

| Flag | Description |
|---|---|
| `--confirm, -y` | Skip confirmation |

### `nlm source stale <notebook-id>`
Check for stale Google Drive sources needing re-sync.

### `nlm source sync <notebook-id>`
Re-sync stale Drive sources.

---

## Notes

### `nlm note create <notebook-id>`
Create a note in a notebook.

| Flag | Description |
|---|---|
| `-c, --content <text>` | Note content (required) |
| `-t, --title <title>` | Note title |

### `nlm note list <notebook-id>`
List all notes.

### `nlm note update <notebook-id> <note-id>`
Update an existing note.

| Flag | Description |
|---|---|
| `-c, --content <text>` | New content |
| `-t, --title <title>` | New title |

### `nlm note delete <notebook-id> <note-id>`
Delete a note.

---

## Query

### `nlm query notebook <notebook-id> "<question>"`
Chat with a notebook. Responses are grounded in notebook sources.

| Flag | Description |
|---|---|
| `--source-ids, -s <ids>` | Limit to specific sources |
| `--conversation-id, -c <id>` | Continue previous conversation |

---

## Research

### `nlm research start "<query>"`
Start a research task. Discovers and evaluates web sources.

| Flag | Description |
|---|---|
| `--notebook-id, -n <id>` | Add results to existing notebook |
| `--mode, -m <mode>` | `fast` (~30s, ~10 sources) or `deep` (~5min, ~40 sources) |
| `--source, -s <source>` | Search location: `web` or `drive` |
| `--force, -f` | Override any pending research |

### `nlm research status <notebook-id>`
Check progress of an active research task.

### `nlm research import -n <notebook-id>`
Import discovered research sources into the notebook.

---

## Artifacts & Visualizations

### `nlm mindmap create <notebook-id>`
Create a mind map from notebook contents.

| Flag | Description |
|---|---|
| `-t, --title <title>` | Mind map title |
| `-y, --confirm` | Skip confirmation |
| `-s, --source-ids <ids>` | Limit to specific sources |

### `nlm infographic create <notebook-id>`
Create an infographic.

| Flag | Description |
|---|---|
| `-y, --confirm` | Skip confirmation |
| `-s, --source-ids <ids>` | Limit to specific sources |

### `nlm slides create <notebook-id>`
Create a slide deck.

| Flag | Description |
|---|---|
| `-y, --confirm` | Skip confirmation |
| `-s, --source-ids <ids>` | Limit to specific sources |

### `nlm data-table create <notebook-id>`
Create a data table.

| Flag | Description |
|---|---|
| `-y, --confirm` | Skip confirmation |
| `-s, --source-ids <ids>` | Limit to specific sources |

### `nlm report create <notebook-id>`
Create a text report.

| Flag | Description |
|---|---|
| `-f, --format <format>` | `Briefing Doc`, `Study Guide`, `Blog Post`, `Create Your Own` |
| `--prompt <text>` | Custom prompt (required for "Create Your Own") |
| `--language <code>` | BCP-47 language code |
| `-y, --confirm` | Skip confirmation |
| `-s, --source-ids <ids>` | Limit to specific sources |

### `nlm audio create <notebook-id>`
Create a podcast-style audio overview.

| Flag | Description |
|---|---|
| `-y, --confirm` | Skip confirmation |

### `nlm video create <notebook-id>`
Create a video overview.

| Flag | Description |
|---|---|
| `-y, --confirm` | Skip confirmation |

### `nlm quiz create <notebook-id>`
Create a quiz from notebook contents.

### `nlm flashcards create <notebook-id>`
Create flashcards from notebook contents.

### `nlm studio status <notebook-id>`
Check status of all artifact generation jobs.

### `nlm studio delete <notebook-id> <artifact-id>`
Delete a generated artifact.

---

## Downloads

### `nlm download mind-map <notebook-id>`
Download mind map as JSON.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |

### `nlm download report <notebook-id>`
Download report as Markdown.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |

### `nlm download infographic <notebook-id>`
Download infographic as PNG.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |

### `nlm download slide-deck <notebook-id>`
Download slide deck as PDF.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |

### `nlm download data-table <notebook-id>`
Download data table as CSV.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |

### `nlm download audio <notebook-id>`
Download audio as MP3.

| Flag | Description |
|---|---|
| `-o, --output <path>` | Output file path |
| `-f, --format <fmt>` | Audio format: `mp3` or `wav` |

---

## Sharing

### `nlm share public <notebook-id>`
Make a notebook publicly accessible via link.

### `nlm share private <notebook-id>`
Revoke public access.

### `nlm share invite <notebook-id>`
Invite a collaborator.

| Flag | Description |
|---|---|
| `--email <email>` | Collaborator's email |

### `nlm share status <notebook-id>`
Check current sharing settings.

---

## Aliases

### `nlm alias set <alias> <id>`
Create a friendly name for a notebook/source UUID.

| Flag | Description |
|---|---|
| `-t, --type <type>` | Resource type: `notebook` or `source` |

### `nlm alias get <alias>`
Resolve alias to UUID.

### `nlm alias list`
List all aliases.

### `nlm alias delete <alias>`
Remove an alias.

---

## Configuration

### `nlm config set <key> <value>`
Set a config value.

### `nlm config show`
Show current configuration.

### `nlm set default-profile <name>`
Set the default authentication profile.

---

## Best Practices

1. **Always use `--wait` (`-w`)** when adding sources before querying — sources need processing time
2. **Use aliases** instead of raw UUIDs for readability and portability
3. **Use `-y` (confirm)** in automated/scripted workflows to skip prompts
4. **Check `studio status`** after creating artifacts — generation takes minutes
5. **Use `--source-ids`** to scope queries/artifacts to relevant sources only
6. **Use `research import`** after research completes to bring sources into the notebook
