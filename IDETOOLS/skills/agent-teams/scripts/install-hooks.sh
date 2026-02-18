#!/usr/bin/env bash
# Install agent team hooks into a project.
#
# Usage: ./install-hooks.sh [project-path]
#   project-path defaults to current directory (.)
#
# Installs a PreToolUse hook on TaskUpdate that runs tests
# before allowing a task to be marked as completed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${1:-.}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
CLAUDE_DIR="$PROJECT_DIR/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "Installing agent team hooks into: $PROJECT_DIR"

# --- Step 1: Create .claude/ directory ---
mkdir -p "$CLAUDE_DIR"

# --- Step 2: Copy hook script ---
echo "Copying hook script..."
cp "$SCRIPT_DIR/task-completed.sh" "$CLAUDE_DIR/task-completed.sh"
chmod +x "$CLAUDE_DIR/task-completed.sh"
echo "  Installed: .claude/task-completed.sh"

# --- Step 3: Merge hook config into settings ---
echo "Configuring hooks in .claude/settings.json..."

HOOK_CONFIG='{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "TaskUpdate",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/task-completed.sh"
          }
        ]
      }
    ]
  }
}'

if [[ -f "$SETTINGS_FILE" ]]; then
  if command -v jq &>/dev/null; then
    # Check if PreToolUse hooks already exist to avoid clobbering
    if cat "$SETTINGS_FILE" | jq -e '.hooks.PreToolUse' &>/dev/null 2>&1; then
      echo "  WARNING: PreToolUse hooks already configured in $SETTINGS_FILE."
      echo "  Please manually add a TaskUpdate matcher. Example config:"
      echo ""
      echo "$HOOK_CONFIG" | jq '.hooks.PreToolUse[0]'
      echo ""
      echo "  Add this entry to your existing hooks.PreToolUse array."
    else
      # Safe to merge — no existing PreToolUse hooks
      cat "$SETTINGS_FILE" | jq --argjson hooks "$HOOK_CONFIG" '. * $hooks' > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"
      echo "  Merged hooks into .claude/settings.json"
    fi
  else
    echo "  WARNING: jq not installed. Cannot merge into existing settings."
    echo "  Please manually add to $SETTINGS_FILE:"
    echo ""
    echo "$HOOK_CONFIG"
  fi
else
  echo "$HOOK_CONFIG" > "$SETTINGS_FILE"
  echo "  Created .claude/settings.json with hook configuration"
fi

echo ""
echo "Hook installed. It will run tests before allowing TaskUpdate"
echo "to mark any task as completed."
