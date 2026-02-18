"""Pydantic request/response models for the GraphRAG API."""

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(..., description="Semantic search query for skills")
    limit: int = Field(default=10, ge=1, le=100, description="Max results to return")


class SkillResult(BaseModel):
    name: str
    category: str
    description: str
    score: float = Field(ge=0.0, le=1.0)
    source: str


class SearchResponse(BaseModel):
    results: list[SkillResult]
    query: str
    total: int


class WorkflowStep(BaseModel):
    order: int
    skill_name: str
    description: str
    inputs: list[str] = Field(default_factory=list)
    outputs: list[str] = Field(default_factory=list)


class ComposeRequest(BaseModel):
    task: str = Field(..., description="Task description for workflow composition")


class ComposeResponse(BaseModel):
    task: str
    steps: list[WorkflowStep]
    rationale: str


class RelationshipEdge(BaseModel):
    source: str
    target: str
    edge_type: str
    weight: float = Field(default=1.0, ge=0.0, le=1.0)


class RelationshipRequest(BaseModel):
    skill_name: str = Field(..., description="Skill name to find relationships for")


class RelationshipResponse(BaseModel):
    skill_name: str
    edges: list[RelationshipEdge]
    total: int
