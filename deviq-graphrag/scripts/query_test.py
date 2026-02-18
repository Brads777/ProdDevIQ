#!/usr/bin/env python3
"""Quick test script with sample queries against the GraphRAG API."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from deviq_graphrag.indexer.embedder import embed_text
from deviq_graphrag.graph.qdrant_store import QdrantStore


SAMPLE_QUERIES = [
    "build a React component library",
    "set up CI/CD pipeline with GitHub Actions",
    "create video content with AI",
    "automated code review and quality analysis",
    "design a REST API with authentication",
]


def main() -> None:
    store = QdrantStore()

    for query in SAMPLE_QUERIES:
        print(f"\n--- Query: {query} ---")
        vector = embed_text(query)
        results = store.search_similar(vector, limit=5)

        if not results:
            print("  (no results)")
            continue

        for i, r in enumerate(results, 1):
            print(f"  {i}. [{r['score']:.3f}] {r['name']} ({r['category']})")
            print(f"     {r['description'][:80]}...")

    store.close()


if __name__ == "__main__":
    main()
