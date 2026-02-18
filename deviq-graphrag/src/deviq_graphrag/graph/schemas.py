"""Graph data schemas for skill nodes and relationship edges."""

from enum import StrEnum
from dataclasses import dataclass, field


class EdgeType(StrEnum):
    """Types of relationships between skills."""

    DEPENDS_ON = "DEPENDS_ON"
    FEEDS_INTO = "FEEDS_INTO"
    ALTERNATIVE_TO = "ALTERNATIVE_TO"
    COMPOSES_WITH = "COMPOSES_WITH"


@dataclass
class SkillNode:
    """A skill node in the knowledge graph."""

    name: str
    category: str
    description: str
    source: str
    embedding: list[float] = field(default_factory=list)


@dataclass
class RelationshipEdge:
    """A typed edge between two skill nodes."""

    source: str
    target: str
    edge_type: EdgeType
    weight: float = 1.0
