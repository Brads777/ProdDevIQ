"""Tests for the catalog loader."""

from deviq_graphrag.indexer.loader import load_index, load_skill_md, load_catalog


def test_load_index(sample_index_yaml):
    """Test that index.yaml is parsed correctly."""
    entries = load_index(sample_index_yaml)
    assert len(entries) == 2
    assert entries[0]["name"] == "test-skill-a"
    assert entries[1]["name"] == "test-skill-b"
    assert entries[0]["category"] == "testing"


def test_load_skill_md(sample_index_yaml):
    """Test that SKILL.md frontmatter and body are parsed."""
    skill_path = sample_index_yaml / "skills" / "test-skill-a" / "SKILL.md"
    metadata, body = load_skill_md(skill_path)
    assert metadata["trigger"] == "/test-a"
    assert "Test Skill A" in body
    assert "Body content A" in body


def test_load_skill_md_missing():
    """Test that missing SKILL.md returns empty results."""
    metadata, body = load_skill_md("/nonexistent/path/SKILL.md")
    assert metadata == {}
    assert body == ""


def test_load_catalog(sample_index_yaml):
    """Test full catalog loading."""
    documents = load_catalog(sample_index_yaml)
    assert len(documents) == 2
    assert documents[0].name == "test-skill-a"
    assert documents[0].category == "testing"
    assert "Body content A" in documents[0].body
    assert documents[0].metadata.get("trigger") == "/test-a"
