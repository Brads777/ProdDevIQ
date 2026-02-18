"""Pytest fixtures for deviq-graphrag tests."""

from unittest.mock import MagicMock, AsyncMock

import pytest

from deviq_graphrag.indexer.loader import SkillDocument


@pytest.fixture
def sample_skills() -> list[SkillDocument]:
    """Sample skill documents for testing."""
    return [
        SkillDocument(
            name="react-component-library",
            category="frontend",
            description="Build reusable React component libraries with TypeScript",
            source="IDETOOLS/skills/react-component-library/SKILL.md",
            body="# React Component Library\n\nA skill for building...",
            metadata={"depends_on": ["typescript-setup"]},
        ),
        SkillDocument(
            name="typescript-setup",
            category="tooling",
            description="Configure TypeScript for any project",
            source="IDETOOLS/skills/typescript-setup/SKILL.md",
            body="# TypeScript Setup\n\nQuick TypeScript configuration...",
            metadata={"outputs": ["tsconfig.json"]},
        ),
        SkillDocument(
            name="vue-component-library",
            category="frontend",
            description="Build reusable Vue 3 component libraries",
            source="IDETOOLS/skills/vue-component-library/SKILL.md",
            body="# Vue Component Library\n\nA skill for building...",
            metadata={"alternatives": ["react-component-library"]},
        ),
    ]


@pytest.fixture
def mock_qdrant_client():
    """Mock Qdrant client for unit tests."""
    client = MagicMock()
    client.get_collections.return_value = MagicMock(collections=[])
    client.create_collection.return_value = None
    client.upsert.return_value = None

    mock_point = MagicMock()
    mock_point.payload = {
        "name": "react-component-library",
        "category": "frontend",
        "description": "Build reusable React component libraries",
        "source": "IDETOOLS/skills/react-component-library/SKILL.md",
    }
    mock_point.score = 0.95

    mock_result = MagicMock()
    mock_result.points = [mock_point]
    client.query_points.return_value = mock_result

    return client


@pytest.fixture
def sample_index_yaml(tmp_path):
    """Create a temporary index.yaml for testing."""
    index_content = """
catalog_version: "1.0"
total_skills: 2

skills:
  - name: test-skill-a
    type: skill
    category: testing
    description: "A test skill"
    source: "skills/test-skill-a/SKILL.md"

  - name: test-skill-b
    type: skill
    category: testing
    description: "Another test skill"
    source: "skills/test-skill-b/SKILL.md"
"""
    index_file = tmp_path / "index.yaml"
    index_file.write_text(index_content)

    # Create skill directories and SKILL.md files
    skill_a_dir = tmp_path / "skills" / "test-skill-a"
    skill_a_dir.mkdir(parents=True)
    (skill_a_dir / "SKILL.md").write_text(
        "---\ntrigger: /test-a\n---\n# Test Skill A\n\nBody content A."
    )

    skill_b_dir = tmp_path / "skills" / "test-skill-b"
    skill_b_dir.mkdir(parents=True)
    (skill_b_dir / "SKILL.md").write_text(
        "---\ntrigger: /test-b\n---\n# Test Skill B\n\nBody content B."
    )

    return tmp_path
