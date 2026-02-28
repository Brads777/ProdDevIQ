# ProdDevIQ / GODMODEDEV — Student Setup Guide

**Your AI-powered development environment.** This toolkit gives you a fully configured Claude Code workspace with 489 installable skills, 10 specialist AI agents, and project orchestration built in.

---

## What You Need Before Starting

| Tool | Windows | Mac |
|------|---------|-----|
| **Node.js v20+** | [nodejs.org](https://nodejs.org) — download the LTS installer | `brew install node` or [nodejs.org](https://nodejs.org) |
| **Git** | [git-scm.com](https://git-scm.com) — includes Git Bash | `brew install git` (or Xcode: `xcode-select --install`) |
| **GitHub CLI** | `winget install GitHub.cli` or [cli.github.com](https://cli.github.com) | `brew install gh` |
| **Claude Code** | `npm install -g @anthropic-ai/claude-code` | `npm install -g @anthropic-ai/claude-code` |
| **Anthropic API Key** | From [console.anthropic.com](https://console.anthropic.com) | Same |

**Optional but recommended:**
- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) (Windows requires WSL2)
- **VS Code** — helpful for browsing files alongside Claude Code

---

## Step-by-Step Installation

### Step 1: Install Node.js

**Windows:**
Download and run the installer from [nodejs.org](https://nodejs.org). Choose the LTS version. After install, open a **new** terminal and verify:
```
node --version
npm --version
```

**Mac:**
```bash
brew install node
node --version
npm --version
```

---

### Step 2: Install Git and GitHub CLI

**Windows:**
Download Git from [git-scm.com](https://git-scm.com). During installation, **accept all defaults** — this installs Git Bash, which you'll use as your terminal.

Then install GitHub CLI:
```
winget install GitHub.cli
```

**Mac:**
```bash
brew install git gh
```

**Both platforms — authenticate GitHub CLI:**
```bash
gh auth login
```
Follow the prompts. Choose **HTTPS** and authenticate via browser.

---

### Step 3: Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verify it installed:
```bash
claude --version
```

**If you get a "command not found" error:**

**Windows:** Close and reopen Git Bash, or add npm's global bin to your PATH:
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

**Mac:** You may need:
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

Add the line above to your `~/.zshrc` (Mac) or `~/.bashrc` (Windows Git Bash) to make it permanent.

---

### Step 4: Get Your API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** and create a new key
4. Copy the key (starts with `sk-ant-...`)

Set it in your terminal:

**Mac / Git Bash (temporary, current session only):**
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**To make it permanent:**

**Mac** — add to `~/.zshrc`:
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**Windows** — add to `~/.bashrc` (for Git Bash):
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (system-wide)** — or set via Settings:
1. Search "Environment Variables" in Windows Settings
2. Under User variables, click **New**
3. Variable name: `ANTHROPIC_API_KEY`
4. Variable value: your key

---

### Step 5: Clone the Repository

```bash
git clone https://github.com/Brads777/ProdDevIQ.git
cd ProdDevIQ
```

---

### Step 6: Install the Skills

This is the step that makes everything work. You need to copy skills into Claude Code's skills directory and create the right links.

**Create the directories:**

**Mac:**
```bash
mkdir -p ~/.claude/skills
mkdir -p ~/.agents/skills
```

**Windows (Git Bash):**
```bash
mkdir -p ~/.claude/skills
mkdir -p ~/.agents/skills
```

**Copy the core skills into place:**
```bash
# Copy the key skills you'll need
cp -r IDETOOLS/skills/start-new-project ~/.agents/skills/
```

**Link them so Claude Code can find them:**

**Mac:**
```bash
ln -s ~/.agents/skills/start-new-project ~/.claude/skills/start-new-project
```

**Windows (Git Bash — requires Developer Mode):**

First, enable Developer Mode:
1. Open **Settings > System > For Developers**
2. Toggle **Developer Mode** to **On**
3. Close and reopen Git Bash

Then create the link:
```bash
ln -s ~/.agents/skills/start-new-project ~/.claude/skills/start-new-project
```

**Windows alternative (if symlinks won't work):**
Just copy directly instead of linking:
```bash
cp -r IDETOOLS/skills/start-new-project ~/.claude/skills/
```

---

### Step 7: Launch Claude Code

From inside the ProdDevIQ directory:
```bash
claude
```

Claude Code will read the CLAUDE.md and load the project configuration automatically.

---

### Step 8: Verify Everything Works

Inside Claude Code, try these commands:
- Type: **"start new project"** — runs the project setup wizard
- Type: `/status` — shows orchestrator status
- Type: `/agents-deploy` — deploys the 10 specialist AI agents

You can also run the health check from a separate terminal:

**Windows:**
```
powershell -NoProfile -File scripts/health-check.ps1
```

**Mac:**
```bash
# Mac doesn't have PowerShell by default, but you can check manually:
ls CLAUDE.md .claude/settings.json .claude/agents/
```

---

## Quick Reference — What You Can Do

| Command | What It Does |
|---------|-------------|
| **"start new project"** | Guided wizard to create and configure a new app |
| `/init` | Initialize orchestrator tracking for current project |
| `/status` | See your current phase and next steps |
| `/delegate coder "build X"` | Send work to the coder agent |
| `/delegate architect "design Y"` | Send work to the architect agent |
| `/agents-deploy` | Deploy all 10 specialist agents |
| `/skills-advisor` | Get skill recommendations for your task |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `claude: command not found` | Close and reopen terminal. Check `npm list -g` for the package. |
| `ANTHROPIC_API_KEY not set` | Re-export the key or add it to your shell profile (see Step 4) |
| Symlinks fail on Windows | Enable Developer Mode (Settings > System > For Developers) or just use `cp -r` instead of `ln -s` |
| `gh: command not found` | Install GitHub CLI (see Step 2) |
| Permission denied on Mac | Run `chmod +x` on any scripts, or prefix commands with `sudo` |
| Skills not showing up | Restart Claude Code (`Ctrl+C` then `claude` again) |
| Docker won't start (Windows) | Make sure WSL2 is installed: `wsl --install` in PowerShell as Admin |

---

## Getting Help

- Inside Claude Code, type `/help` for built-in commands
- Ask Claude: "What skills do I have available?"
- Ask Claude: "start new project" to begin building
- Repository: https://github.com/Brads777/ProdDevIQ
