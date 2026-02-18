"""API route definitions for the GraphRAG service."""

from fastapi import APIRouter

from deviq_graphrag.api.models import (
    ComposeRequest,
    ComposeResponse,
    RelationshipRequest,
    RelationshipResponse,
    SearchRequest,
    SearchResponse,
)

router = APIRouter(prefix="/api/v1", tags=["graphrag"])


@router.post("/search", response_model=SearchResponse)
async def search_skills(request: SearchRequest) -> SearchResponse:
    """Semantic skill search.

    Accepts a natural language query and returns the most relevant skills
    from the catalog, ranked by semantic similarity.
    """
    # TODO: Wire up to qdrant_store.search_similar() and return real results
    return SearchResponse(results=[], query=request.query, total=0)


@router.post("/compose", response_model=ComposeResponse)
async def compose_workflow(request: ComposeRequest) -> ComposeResponse:
    """Multi-skill workflow composition.

    Given a task description, identifies the relevant skills and orders
    them into a coherent workflow with input/output chaining.
    """
    # TODO: Use graph_builder.query_graph() to find skill chains and
    # relationship_extractor edges to determine ordering
    return ComposeResponse(task=request.task, steps=[], rationale="")


@router.post("/relationships", response_model=RelationshipResponse)
async def get_relationships(request: RelationshipRequest) -> RelationshipResponse:
    """Skill relationship graph.

    Returns all relationship edges for a given skill, including
    dependencies, alternatives, and composition partners.
    """
    # TODO: Query qdrant_store.get_relationships() and graph for edges
    return RelationshipResponse(
        skill_name=request.skill_name, edges=[], total=0
    )
