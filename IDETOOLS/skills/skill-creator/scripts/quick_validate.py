#!/usr/bin/env python3
"""
Quick validation script for skills

Checks:
- SKILL.md exists with valid YAML frontmatter
- Required fields (name, description) present and valid
- Naming conventions (kebab-case, no reserved words)
- No forbidden content (XML brackets, README.md)
- Description quality (trigger phrases, length, no TODOs)
"""

import sys
import re
import yaml
from pathlib import Path


ALLOWED_PROPERTIES = {
    'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility',
    'context', 'agent', 'disable-model-invocation', 'user-invocable', 'model',
    'argument-hint', 'hooks'
}

RESERVED_WORDS = ['claude', 'anthropic']


def validate_skill(skill_path):
    """Validate a skill directory. Returns (valid, message) tuple."""
    skill_path = Path(skill_path)
    errors = []
    warnings = []

    # Check SKILL.md exists
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md not found"

    # Check for forbidden files
    if (skill_path / 'README.md').exists():
        errors.append("README.md found in skill folder (not allowed - all docs go in SKILL.md or references/)")

    content = skill_md.read_text(encoding='utf-8')

    # Check frontmatter delimiters
    if not content.startswith('---'):
        return False, "No YAML frontmatter found (must start with ---)"

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format (missing closing ---)"

    # Parse YAML
    try:
        frontmatter = yaml.safe_load(match.group(1))
        if not isinstance(frontmatter, dict):
            return False, "Frontmatter must be a YAML dictionary"
    except yaml.YAMLError as e:
        return False, f"Invalid YAML: {e}"

    # Check for unexpected properties
    unexpected = set(frontmatter.keys()) - ALLOWED_PROPERTIES
    if unexpected:
        errors.append(
            f"Unexpected frontmatter key(s): {', '.join(sorted(unexpected))}. "
            f"Allowed: {', '.join(sorted(ALLOWED_PROPERTIES))}"
        )

    # Validate name
    name = frontmatter.get('name', '')
    if not name:
        errors.append("Missing 'name' in frontmatter")
    elif not isinstance(name, str):
        errors.append(f"Name must be a string, got {type(name).__name__}")
    else:
        name = name.strip()
        if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', name):
            errors.append(f"Name '{name}' must be kebab-case (lowercase, digits, hyphens, no leading/trailing/consecutive hyphens)")
        if len(name) > 64:
            errors.append(f"Name too long ({len(name)} chars, max 64)")
        for reserved in RESERVED_WORDS:
            if reserved in name.lower():
                errors.append(f"Name cannot contain reserved word '{reserved}'")
        # Check name matches folder
        if name != skill_path.name:
            warnings.append(f"Name '{name}' doesn't match folder name '{skill_path.name}'")

    # Validate description
    description = frontmatter.get('description', '')
    if not description:
        errors.append("Missing 'description' in frontmatter")
    elif not isinstance(description, str):
        errors.append(f"Description must be a string, got {type(description).__name__}")
    else:
        description = description.strip()
        if '<' in description or '>' in description:
            errors.append("Description cannot contain angle brackets (< or >)")
        if len(description) > 1024:
            errors.append(f"Description too long ({len(description)} chars, max 1024)")
        if len(description) < 20:
            warnings.append("Description is very short - include what it does AND when to use it")

        # Check for trigger phrases
        trigger_indicators = ['use when', 'use for', 'use if', 'trigger', 'when user']
        has_triggers = any(ind in description.lower() for ind in trigger_indicators)
        if not has_triggers:
            warnings.append("Description lacks trigger phrases (e.g., 'Use when user asks to...')")

        # Check for TODO placeholders
        if 'TODO' in description or '[TODO' in description:
            errors.append("Description contains TODO placeholder - must be completed")

    # Validate compatibility if present
    compat = frontmatter.get('compatibility', '')
    if compat:
        if not isinstance(compat, str):
            errors.append(f"Compatibility must be a string, got {type(compat).__name__}")
        elif len(compat) > 500:
            errors.append(f"Compatibility too long ({len(compat)} chars, max 500)")

    # Check body for TODOs
    body = content[match.end():]
    todo_count = body.count('[TODO')
    if todo_count > 0:
        warnings.append(f"SKILL.md body contains {todo_count} TODO placeholder(s)")

    # Check body length
    body_lines = [l for l in body.strip().splitlines() if l.strip()]
    if len(body_lines) > 500:
        warnings.append(f"SKILL.md body is {len(body_lines)} lines (recommended max: 500)")

    # Build result
    if errors:
        msg = "Validation failed:\n" + "\n".join(f"  - {e}" for e in errors)
        if warnings:
            msg += "\n\nWarnings:\n" + "\n".join(f"  - {w}" for w in warnings)
        return False, msg

    if warnings:
        msg = "Skill is valid with warnings:\n" + "\n".join(f"  - {w}" for w in warnings)
        return True, msg

    return True, "Skill is valid!"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python quick_validate.py <skill_directory>")
        sys.exit(1)

    valid, message = validate_skill(sys.argv[1])
    print(message)
    sys.exit(0 if valid else 1)
