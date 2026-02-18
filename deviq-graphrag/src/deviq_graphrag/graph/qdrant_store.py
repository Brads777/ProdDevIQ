"""Qdrant vector store client wrapper."""

from __future__ import annotations

import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from deviq_graphrag.config import settings
from deviq_graphrag.indexer.embedder import EMBEDDING_DIM

COLLECTION_NAME = "skills"


class QdrantStore:
    """Manages the Qdrant vector collection for skill embeddings."""

    def __init__(self) -> None:
        self._client: QdrantClient | None = None

    @property
    def client(self) -> QdrantClient:
        if self._client is None:
            self._client = QdrantClient(
                host=settings.qdrant_host, port=settings.qdrant_port
            )
        return self._client

    async def init_collection(self) -> None:
        """Create the skills collection if it does not exist."""
        collections = self.client.get_collections().collections
        names = [c.name for c in collections]
        if COLLECTION_NAME not in names:
            self.client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=EMBEDDING_DIM, distance=Distance.COSINE
                ),
            )

    def upsert_skills(
        self,
        names: list[str],
        categories: list[str],
        descriptions: list[str],
        sources: list[str],
        embeddings: list[list[float]],
    ) -> None:
        """Insert or update skill vectors in Qdrant.

        Args:
            names: Skill names (used as deterministic IDs).
            categories: Skill categories.
            descriptions: Skill descriptions.
            sources: Source file paths.
            embeddings: Embedding vectors.
        """
        points = []
        for name, cat, desc, src, emb in zip(
            names, categories, descriptions, sources, embeddings
        ):
            # Deterministic UUID from skill name for idempotent upserts
            point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, name))
            points.append(
                PointStruct(
                    id=point_id,
                    vector=emb,
                    payload={
                        "name": name,
                        "category": cat,
                        "description": desc,
                        "source": src,
                    },
                )
            )

        # Batch in groups of 100
        for i in range(0, len(points), 100):
            self.client.upsert(
                collection_name=COLLECTION_NAME,
                points=points[i : i + 100],
            )

    def search_similar(
        self, query_vector: list[float], limit: int = 10
    ) -> list[dict]:
        """Search for skills similar to the query vector.

        Args:
            query_vector: Embedding vector for the query.
            limit: Max number of results.

        Returns:
            List of dicts with 'name', 'category', 'description',
            'source', and 'score'.
        """
        results = self.client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=limit,
        )
        return [
            {
                "name": hit.payload["name"],
                "category": hit.payload["category"],
                "description": hit.payload["description"],
                "source": hit.payload["source"],
                "score": hit.score,
            }
            for hit in results.points
        ]

    def get_relationships(self, skill_name: str) -> list[dict]:
        """Get stored relationship edges for a skill.

        Args:
            skill_name: Name of the skill to query.

        Returns:
            List of relationship dicts from the skill's payload.
        """
        results = self.client.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter=Filter(
                must=[FieldCondition(key="name", match=MatchValue(value=skill_name))]
            ),
            limit=1,
        )
        points, _ = results
        if not points:
            return []
        return points[0].payload.get("relationships", [])

    def close(self) -> None:
        """Close the Qdrant client connection."""
        if self._client is not None:
            self._client.close()
            self._client = None


# Module-level singleton
qdrant_store = QdrantStore()
