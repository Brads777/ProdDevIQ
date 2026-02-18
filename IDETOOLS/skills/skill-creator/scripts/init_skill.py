#!/usr/bin/env python3
"""
Skill Initializer - Creates a new skill from template

Usage:
    init_skill.py <skill-name> --path <path>

Examples:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-api-helper --path ./output
"""

import sys
import re
from pathlib import Path


SKILL_TEMPLATE = """---
name: {skill_name}
description: >-
  [TODO: What this skill does and when to use it.
  Use when user asks to [specific trigger phrases].
  Do NOT use for [exclusions].]
---

# {skill_title}

## Instructions

[TODO: Write clear, actionable instructions. Include only what Claude
doesn't already know. Prefer concise examples over verbose explanations.]

## Resources

[TODO: Reference bundled scripts, references, or assets below.
Delete any directories not needed by this skill.]

- `scripts/` - Executable code for deterministic or repetitive operations
- `references/` - Documentation loaded into context as needed
- `assets/` - Templates, fonts, icons used in output
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}

Replace with actual implementation or delete if not needed.
"""

def main():
    print("Example script for {skill_name}")

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference for {skill_title}

[TODO: Replace with actual reference content or delete if not needed.

Reference files are ideal for:
- API documentation and schemas
- Detailed workflow guides
- Domain-specific knowledge
- Content too lengthy for SKILL.md]
"""


def title_case(name):
    return ' '.join(word.capitalize() for word in name.split('-'))


def validate_name(name):
    if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', name):
        return "Name must be kebab-case (lowercase letters, digits, hyphens only)"
    if len(name) > 64:
        return f"Name too long ({len(name)} chars, max 64)"
    lower = name.lower()
    if 'claude' in lower or 'anthropic' in lower:
        return "Names containing 'claude' or 'anthropic' are reserved"
    return None


def init_skill(skill_name, path):
    error = validate_name(skill_name)
    if error:
        print(f"Error: {error}")
        return None

    skill_dir = Path(path).resolve() / skill_name

    if skill_dir.exists():
        print(f"Error: Directory already exists: {skill_dir}")
        return None

    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
    except Exception as e:
        print(f"Error creating directory: {e}")
        return None

    skill_title = title_case(skill_name)

    # Create SKILL.md
    (skill_dir / 'SKILL.md').write_text(
        SKILL_TEMPLATE.format(skill_name=skill_name, skill_title=skill_title)
    )

    # Create scripts/ with example
    scripts_dir = skill_dir / 'scripts'
    scripts_dir.mkdir()
    example_script = scripts_dir / 'example.py'
    example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
    example_script.chmod(0o755)

    # Create references/ with example
    references_dir = skill_dir / 'references'
    references_dir.mkdir()
    (references_dir / 'example.md').write_text(
        EXAMPLE_REFERENCE.format(skill_title=skill_title)
    )

    # Create assets/ (empty)
    (skill_dir / 'assets').mkdir()

    print(f"Skill '{skill_name}' initialized at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md - complete TODO items, write description and instructions")
    print("2. Add/customize scripts, references, and assets (delete unused dirs)")
    print("3. Run quick_validate.py to check structure before packaging")

    return skill_dir


def main():
    if len(sys.argv) < 4 or sys.argv[2] != '--path':
        print("Usage: init_skill.py <skill-name> --path <path>")
        print("\nExamples:")
        print("  init_skill.py my-new-skill --path skills/public")
        print("  init_skill.py my-api-helper --path ./output")
        sys.exit(1)

    result = init_skill(sys.argv[1], sys.argv[3])
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
