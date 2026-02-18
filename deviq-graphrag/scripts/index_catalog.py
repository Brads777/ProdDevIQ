#!/usr/bin/env python3
"""CLI script to index the skill catalog into Qdrant."""

import sys
from pathlib import Path

# Add src to path for direct script execution
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from deviq_graphrag.config import settings
from deviq_graphrag.indexer.loader import load_catalog
from deviq_graphrag.indexer.embedder import embed_batch
from deviq_graphrag.indexer.relationship_extractor import extract_relationships
from deviq_graphrag.graph.qdrant_store import QdrantStore


def main() -> None:
    catalog_path = Path(settings.catalog_path)
    print(f"Loading catalog from: {catalog_path}")

    documents = load_catalog(catalog_path)
    print(f"Loaded {len(documents)} skill documents")

    if not documents:
        print("No documents found. Check CATALOG_PATH.")
        sys.exit(1)

    # Build embedding texts: combine name + category + description + body snippet
    texts = []
    for doc in documents:
        text = f"{doc.name} [{doc.category}]: {doc.description}"
        if doc.body:
            # Use first 500 chars of body for embedding context
            text += f"\n{doc.body[:500]}"
        texts.append(text)

    print(f"Generating embeddings for {len(texts)} documents...")
    embeddings = embed_batch(texts)
    print(f"Generated {len(embeddings)} embeddings")

    # Extract relationships
    print("Extracting relationships...")
    edges = extract_relationships(documents)
    print(f"Found {len(edges)} relationship edges")

    # Store in Qdrant
    print("Upserting to Qdrant...")
    store = QdrantStore()

    import asyncio
    asyncio.run(store.init_collection())

    store.upsert_skills(
        names=[d.name for d in documents],
        categories=[d.category for d in documents],
        descriptions=[d.description for d in documents],
        sources=[d.source for d in documents],
        embeddings=embeddings,
    )
    print("Indexing complete!")

    store.close()


if __name__ == "__main__":
    main()
