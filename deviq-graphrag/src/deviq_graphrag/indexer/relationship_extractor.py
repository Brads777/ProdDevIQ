"""Extract relationship edges between skills."""

from __future__ import annotations

from deviq_graphrag.graph.schemas import EdgeType, RelationshipEdge
from deviq_graphrag.indexer.loader import SkillDocument


def extract_relationships(
    documents: list[SkillDocument],
) -> list[RelationshipEdge]:
    """Extract typed edges between skills from their metadata and content.

    Detection methods:
    - DEPENDS_ON: Explicit dependency references in frontmatter or body text
      (e.g., "requires:", "depends_on:", or mentions of other skill names
      in prerequisite sections).
    - FEEDS_INTO: Output-to-input chaining — when one skill's outputs match
      another skill's expected inputs (detected via artifact/output sections).
    - ALTERNATIVE_TO: Skills in the same category with overlapping descriptions
      above a similarity threshold, or explicit "alternative" frontmatter tags.
    - COMPOSES_WITH: Skills that appear together in workflow definitions,
      or skills whose categories form known composition patterns
      (e.g., "data-pipeline" + "visualization").

    Args:
        documents: List of loaded SkillDocument objects.

    Returns:
        List of RelationshipEdge objects.
    """
    edges: list[RelationshipEdge] = []
    name_set = {doc.name for doc in documents}
    doc_by_name = {doc.name: doc for doc in documents}

    for doc in documents:
        # --- DEPENDS_ON: scan body and metadata for references to other skills ---
        deps = doc.metadata.get("depends_on", []) or doc.metadata.get("requires", [])
        if isinstance(deps, str):
            deps = [deps]
        for dep in deps:
            if dep in name_set:
                edges.append(
                    RelationshipEdge(
                        source=doc.name,
                        target=dep,
                        edge_type=EdgeType.DEPENDS_ON,
                        weight=1.0,
                    )
                )

        # --- FEEDS_INTO: check for output/input chaining via metadata ---
        outputs = doc.metadata.get("outputs", [])
        if isinstance(outputs, str):
            outputs = [outputs]
        for other in documents:
            if other.name == doc.name:
                continue
            inputs = other.metadata.get("inputs", [])
            if isinstance(inputs, str):
                inputs = [inputs]
            if outputs and inputs and set(outputs) & set(inputs):
                edges.append(
                    RelationshipEdge(
                        source=doc.name,
                        target=other.name,
                        edge_type=EdgeType.FEEDS_INTO,
                        weight=0.8,
                    )
                )

        # --- ALTERNATIVE_TO: same category + explicit tags ---
        alternatives = doc.metadata.get("alternatives", [])
        if isinstance(alternatives, str):
            alternatives = [alternatives]
        for alt in alternatives:
            if alt in name_set:
                edges.append(
                    RelationshipEdge(
                        source=doc.name,
                        target=alt,
                        edge_type=EdgeType.ALTERNATIVE_TO,
                        weight=0.7,
                    )
                )

        # --- COMPOSES_WITH: explicit composition tags ---
        composes = doc.metadata.get("composes_with", [])
        if isinstance(composes, str):
            composes = [composes]
        for comp in composes:
            if comp in name_set:
                edges.append(
                    RelationshipEdge(
                        source=doc.name,
                        target=comp,
                        edge_type=EdgeType.COMPOSES_WITH,
                        weight=0.6,
                    )
                )

    # TODO: Add semantic similarity-based ALTERNATIVE_TO detection
    # using embedding cosine distance within same category

    # TODO: Add body-text reference scanning for implicit DEPENDS_ON
    # (search for skill names mentioned in markdown body)

    # TODO: Add workflow co-occurrence analysis for COMPOSES_WITH
    # (parse known workflow definitions to find skill pairs)

    return edges
