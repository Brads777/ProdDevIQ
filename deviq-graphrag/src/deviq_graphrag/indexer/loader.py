"""Catalog loader: parses index.yaml and reads SKILL.md files."""

from pathlib import Path
from dataclasses import dataclass, field

import yaml
import frontmatter


@dataclass
class SkillDocument:
    """Parsed skill with metadata and body text."""

    name: str
    category: str
    description: str
    source: str
    body: str = ""
    metadata: dict = field(default_factory=dict)


def load_index(catalog_path: str | Path) -> list[dict]:
    """Parse index.yaml and return the list of skill entries.

    Args:
        catalog_path: Root path of the catalog (contains index.yaml or
                      is a parent of skillpository/).

    Returns:
        List of raw skill dicts from the YAML index.
    """
    catalog_path = Path(catalog_path)

    # Try several known locations for the index
    candidates = [
        catalog_path / "index.yaml",
        catalog_path.parent / "skillpository" / "index.yaml",
    ]
    index_file = None
    for candidate in candidates:
        if candidate.exists():
            index_file = candidate
            break

    if index_file is None:
        raise FileNotFoundError(
            f"index.yaml not found in any of: {[str(c) for c in candidates]}"
        )

    with open(index_file, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    skills = data.get("skills", [])
    agents = data.get("agents", [])
    return skills + agents


def load_skill_md(source_path: str | Path) -> tuple[dict, str]:
    """Read a SKILL.md file and extract frontmatter + body.

    Args:
        source_path: Path to the .md file.

    Returns:
        Tuple of (frontmatter metadata dict, body text string).
    """
    source_path = Path(source_path)
    if not source_path.exists():
        return {}, ""

    post = frontmatter.load(str(source_path))
    return dict(post.metadata), post.content


def load_catalog(catalog_path: str | Path) -> list[SkillDocument]:
    """Load the full catalog: index + SKILL.md bodies.

    Args:
        catalog_path: Root path of the catalog directory.

    Returns:
        List of SkillDocument with metadata and body text populated.
    """
    catalog_path = Path(catalog_path)
    entries = load_index(catalog_path)
    documents: list[SkillDocument] = []

    for entry in entries:
        name = entry.get("name", "")
        category = entry.get("category", "")
        description = entry.get("description", "")
        source = entry.get("source", "")

        # Try to load the SKILL.md body
        skill_md_path = catalog_path / source
        if not skill_md_path.exists():
            # Try relative to catalog parent
            skill_md_path = catalog_path.parent / source

        fm_meta, body = load_skill_md(skill_md_path)

        doc = SkillDocument(
            name=name,
            category=category,
            description=description,
            source=source,
            body=body,
            metadata=fm_meta,
        )
        documents.append(doc)

    return documents
