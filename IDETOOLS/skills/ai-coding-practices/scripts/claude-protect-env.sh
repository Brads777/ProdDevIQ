#!/bin/bash
# =============================================================================
# Claude Code Hook: Protect Environment/Secret Files
# =============================================================================
# Blocks Claude Code from modifying files that may contain secrets.
# Add to .claude/settings.json as a PreToolUse hook for Edit and Write tools.
#
# Settings configuration:
#   {
#     "hooks": {
#       "PreToolUse": [
#         {
#           "matcher": "Edit|Write",
#           "hooks": [
#             { "type": "command", "command": "bash hooks/claude-protect-env.sh" }
#           ]
#         }
#       ]
#     }
#   }
#
# Exit codes:
#   0 = allowed (proceed)
#   2 = blocked (agent must correct itself)
# =============================================================================

INPUT=$(cat)

# Extract the file path from the tool input JSON
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check for environment and secret files
if echo "$FILE_PATH" | grep -qiE '(\.env|\.env\.|credentials|secrets|\.pem|\.key|\.crt|\.p12|\.pfx|id_rsa|id_ed25519)'; then
  echo "BLOCKED: Modifications to environment/secret files are not allowed." >&2
  echo "File: $FILE_PATH" >&2
  echo "These files may contain sensitive credentials. Manage them manually." >&2
  exit 2
fi

exit 0
