---
paths:
  - "scripts/**"
---

# Scripts Safety Rules

## Execution Safety

- Always read scripts before executing them
- No destructive operations without explicit user confirmation
- Capture and report all command output
- Stop on critical failure rather than continuing
- Never include secrets in output — redact API keys, tokens, passwords

## PowerShell Conventions

- Use `powershell -NoProfile -Command "..."` for Windows scripts
- Include `$ErrorActionPreference = 'Stop'` at the top of .ps1 files
- Use approved verbs for function names (Get-, Set-, New-, Remove-)
- Sign scripts or note unsigned status in comments

## Bash Conventions

- Use `set -euo pipefail` at the top of .sh files
- Quote all variable expansions
- Use forward slashes in paths for Git Bash compatibility
