# File Ownership Rules

> Drop this file into `.claude/rules/` to auto-load for all teammates.
> Skip this if your project's CLAUDE.md already includes agent teams rules.
> This is the **most important rule** for agent teams. File conflicts are the #1 cause of failures.

## The Rule

**One source file = one agent at a time. No exceptions.**

When two agents edit the same file, one agent's changes silently overwrite the other's. There is no merge mechanism — just data loss.

## Requirements

### Task Descriptions Must Declare Ownership

Every task description must include:

```
Files you own: [explicit list of files this agent may edit]
Files you may read but not edit: [list]
```

If a task description does not list file ownership, **ask the lead before editing any file**.

### Shared Configuration Files

Files like `package.json`, `tsconfig.json`, `.env`, `Cargo.toml`, and similar project-wide configs are edited by **the lead only** or by **one designated agent**.

Never edit a shared config without explicit ownership assignment.

### When You Need Another Agent's File

1. **Message the file owner by name** with what you need changed
2. Wait for them to make the change, or for the lead to reassign ownership
3. **Never edit a file you don't own**, even for a one-line fix

### Conflict Resolution

If you discover two agents have edited the same file:

1. Stop both agents from editing the contested file
2. Check `git diff` to see which changes to keep
3. Lead reassigns ownership explicitly
4. The owning agent reconciles the changes

## Example Ownership Declaration

```
Files you own: src/auth/login.ts, src/auth/login.test.ts
Files you may read but not edit: src/types/user.ts, src/api/client.ts
```
