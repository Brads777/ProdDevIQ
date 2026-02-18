"""Tests for the GraphRAG API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from deviq_graphrag.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_search_endpoint():
    """Test POST /api/v1/search returns stub response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/search",
            json={"query": "react components", "limit": 5},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "react components"
    assert isinstance(data["results"], list)
    assert data["total"] == 0  # Stub returns empty


@pytest.mark.anyio
async def test_compose_endpoint():
    """Test POST /api/v1/compose returns stub response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/compose",
            json={"task": "build a fullstack app"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["task"] == "build a fullstack app"
    assert isinstance(data["steps"], list)


@pytest.mark.anyio
async def test_relationships_endpoint():
    """Test POST /api/v1/relationships returns stub response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/relationships",
            json={"skill_name": "react-component-library"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["skill_name"] == "react-component-library"
    assert isinstance(data["edges"], list)


@pytest.mark.anyio
async def test_search_validation():
    """Test search endpoint validates input."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/search", json={})
    assert response.status_code == 422  # Validation error, missing 'query'
