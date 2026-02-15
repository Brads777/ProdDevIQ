---
name: rag-master
description: >
  Comprehensive RAG guide covering retrieval-augmented generation architecture,
  vector databases (Chroma, FAISS, Pinecone, Qdrant), embeddings,
  chunking strategies, and production patterns. Consolidates 7 RAG skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# RAG Master: Complete Guide to Retrieval-Augmented Generation

Master skill for building production-grade RAG systems with vector databases, embedding strategies, and retrieval patterns.

## When to Use

**Trigger RAG when:**
- "Add knowledge to my AI" — external data sources beyond training cutoff
- "Document Q&A system" — search + answer from corpus
- "Semantic search" — find similar content by meaning, not keywords
- "Chat with my data" — conversational interface over documents
- "Knowledge base AI" — domain-specific expertise injection
- "Context-aware answers" — ground responses in retrieved evidence

**RAG solves:**
- LLM knowledge staleness (training cutoff dates)
- Hallucination reduction (cite retrieved sources)
- Domain specialization without fine-tuning
- Dynamic knowledge updates (add documents without retraining)
- Verifiable answers (trace back to source chunks)

**Not for:**
- Simple keyword search (use Elasticsearch/Algolia)
- Structured data queries (use SQL)
- Real-time data streams (use event processing)
- Small static FAQs (embed directly in prompt)

## RAG Architecture

### Three-Stage Pipeline

```
┌──────────────────┐
│  INGEST STAGE    │
│                  │
│  Documents       │
│    ↓             │
│  Load & Split    │
│    ↓             │
│  Embed Chunks    │
│    ↓             │
│  Store Vectors   │
└──────────────────┘
        ↓
┌──────────────────┐
│ RETRIEVAL STAGE  │
│                  │
│  User Query      │
│    ↓             │
│  Embed Query     │
│    ↓             │
│  Vector Search   │
│    ↓             │
│  Rerank Results  │
└──────────────────┘
        ↓
┌──────────────────┐
│ GENERATION STAGE │
│                  │
│  Context =       │
│  Query + Chunks  │
│    ↓             │
│  LLM Generate    │
│    ↓             │
│  Cite Sources    │
└──────────────────┘
```

### Component Responsibilities

**Document Loader:**
- Supports PDF, DOCX, HTML, Markdown, CSV, JSON
- Extracts text + metadata (author, date, source URL)
- Handles OCR for images/scans

**Text Splitter:**
- Chunks documents into retrievable units
- Preserves semantic boundaries (paragraphs, sections)
- Adds overlap for context continuity

**Embedding Model:**
- Converts text → dense vector (384-1536 dimensions)
- Same model for documents AND queries (critical)
- Options: sentence-transformers, OpenAI, Cohere

**Vector Database:**
- Stores embeddings + metadata
- Supports similarity search (cosine, dot product, L2)
- Filters by metadata (date, author, category)

**Retriever:**
- Fetches top-k most similar chunks
- Applies reranking, MMR, or hybrid search
- Returns chunks + relevance scores

**Generator:**
- LLM (GPT-4, Claude) synthesizes answer
- Prompt includes: query + retrieved chunks + instructions
- Outputs answer + citations

## Document Processing

### Loaders (LangChain Examples)

```python
from langchain.document_loaders import (
    PyPDFLoader,
    UnstructuredHTMLLoader,
    TextLoader,
    CSVLoader,
    WebBaseLoader,
)

# PDF with page metadata
loader = PyPDFLoader("docs/manual.pdf")
docs = loader.load()  # Each page = one Document

# Web scraping
loader = WebBaseLoader("https://example.com/article")
docs = loader.load()

# Markdown
loader = TextLoader("README.md")
docs = loader.load()

# Directory of files
from langchain.document_loaders import DirectoryLoader
loader = DirectoryLoader("./docs", glob="**/*.md")
docs = loader.load()
```

### Chunking Strategies

**1. Fixed-Size Chunking**
```python
from langchain.text_splitter import CharacterTextSplitter

splitter = CharacterTextSplitter(
    chunk_size=1000,      # Characters per chunk
    chunk_overlap=200,    # Overlap to preserve context
    separator="\n\n",     # Split on paragraphs
)
chunks = splitter.split_documents(docs)
```

**When:** Simple documents, uniform structure
**Pros:** Fast, predictable chunk sizes
**Cons:** May split mid-sentence, ignores semantics

**2. Recursive Splitting**
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""],  # Try in order
)
chunks = splitter.split_documents(docs)
```

**When:** Mixed content (markdown, code, prose)
**Pros:** Respects natural boundaries
**Cons:** Variable chunk sizes

**3. Semantic Chunking**
```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain.embeddings import OpenAIEmbeddings

splitter = SemanticChunker(OpenAIEmbeddings())
chunks = splitter.split_documents(docs)
```

**When:** High-quality answers critical, cost not issue
**Pros:** Preserves meaning, natural breakpoints
**Cons:** Slow (embeds every sentence), expensive

**4. Markdown-Aware**
```python
from langchain.text_splitter import MarkdownTextSplitter

splitter = MarkdownTextSplitter(
    chunk_size=1000,
    chunk_overlap=0,  # Headers provide context
)
chunks = splitter.split_documents(docs)
```

**When:** Markdown docs with headers
**Pros:** Respects section structure, includes headers
**Cons:** Only for markdown

### Chunking Best Practices

| Parameter | Small Chunks (256-512) | Medium (512-1024) | Large (1024-2048) |
|-----------|----------------------|------------------|-------------------|
| **Precision** | High | Medium | Low |
| **Context** | Low | Medium | High |
| **Speed** | Fast retrieval | Balanced | Slower |
| **Use When** | Code, FAQs | Articles, docs | Books, reports |

**Overlap guidelines:**
- 10-20% of chunk_size (e.g., 200 chars for 1000-char chunks)
- Ensures continuity across boundaries
- Too much overlap = duplicate content, higher costs

**Metadata enrichment:**
```python
for i, chunk in enumerate(chunks):
    chunk.metadata.update({
        "chunk_id": i,
        "source": doc.metadata["source"],
        "page": doc.metadata.get("page"),
        "timestamp": datetime.now().isoformat(),
    })
```

## Embeddings

### Model Selection

| Model | Dimensions | Speed | Quality | Cost | Use Case |
|-------|-----------|-------|---------|------|----------|
| `all-MiniLM-L6-v2` | 384 | Fast | Good | Free | Dev/testing |
| `all-mpnet-base-v2` | 768 | Medium | Better | Free | Production (local) |
| OpenAI `text-embedding-3-small` | 1536 | Fast | Excellent | $0.02/1M tokens | Production (API) |
| OpenAI `text-embedding-3-large` | 3072 | Medium | Best | $0.13/1M tokens | High-stakes apps |
| Cohere `embed-english-v3.0` | 1024 | Fast | Excellent | $0.10/1M tokens | Multilingual |

### Sentence-Transformers (Local)

```python
from sentence_transformers import SentenceTransformer

# Load model (downloads on first use)
model = SentenceTransformer("all-mpnet-base-v2")

# Embed documents
texts = [chunk.page_content for chunk in chunks]
embeddings = model.encode(texts, show_progress_bar=True)

# Embed query
query = "How do I reset my password?"
query_embedding = model.encode([query])[0]
```

**Pros:**
- No API costs, runs locally
- Fast inference (GPU optional)
- Privacy (no data leaves server)

**Cons:**
- Lower quality than OpenAI/Cohere
- Larger memory footprint
- Must host infrastructure

### OpenAI Embeddings (API)

```python
from openai import OpenAI

client = OpenAI()

# Embed documents (batch up to 2048 inputs)
def embed_batch(texts):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    return [item.embedding for item in response.data]

embeddings = embed_batch([chunk.page_content for chunk in chunks])

# Embed query
query_embedding = embed_batch([query])[0]
```

**Batch size limits:**
- Max 2048 inputs per request
- Max 8192 tokens per input
- Use batching for cost efficiency

### Dimension Reduction (OpenAI)

```python
# text-embedding-3-large supports custom dimensions
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=texts,
    dimensions=1024,  # Reduce from 3072 → 1024
)
```

**When to reduce:**
- Storage costs high (millions of vectors)
- Retrieval speed critical
- Quality drop acceptable (test first)

### Critical Rule: Same Model for Docs + Queries

**NEVER mix embedding models:**
```python
# ❌ WRONG
docs_embedded_with = SentenceTransformer("all-MiniLM-L6-v2")
query_embedded_with = OpenAIEmbeddings()  # Different model!

# ✅ CORRECT
model = SentenceTransformer("all-mpnet-base-v2")
doc_embeddings = model.encode(docs)
query_embedding = model.encode([query])
```

**Why:** Different models produce incomparable vector spaces. Similarity scores meaningless across models.

## Vector Databases Comparison

| Feature | Chroma | FAISS | Pinecone | Qdrant |
|---------|--------|-------|----------|--------|
| **Hosting** | Local | Local | Managed Cloud | Self-host or Cloud |
| **Language** | Python | C++/Python | N/A (API) | Rust |
| **Speed** | Medium | Fastest | Fast | Fast |
| **Scale** | <1M vectors | Billions | Billions | Billions |
| **Metadata** | Full filtering | Limited | Full filtering | Full filtering |
| **Cost** | Free | Free | $0.096/hr + storage | Free tier + paid |
| **Hybrid Search** | No | No | No | Yes (v1.7+) |
| **Best For** | Prototypes, local dev | High-perf research | Production SaaS | Self-hosted prod |

### Decision Tree

```
Start
  │
  ├─ Prototype / <100k vectors?
  │    → Chroma (easiest setup)
  │
  ├─ Research / max performance?
  │    → FAISS (fastest)
  │
  ├─ Production / don't want to manage infra?
  │    → Pinecone (fully managed)
  │
  └─ Production / need control + hybrid search?
       → Qdrant (Rust performance, flexible)
```

## Chroma: Simple Local Vector DB

### Setup

```bash
pip install chromadb
```

### Basic Usage

```python
import chromadb
from chromadb.config import Settings

# Persistent storage
client = chromadb.Client(Settings(
    persist_directory="./chroma_db",
    anonymized_telemetry=False,
))

# Create collection
collection = client.get_or_create_collection(
    name="docs",
    metadata={"hnsw:space": "cosine"},  # Distance metric
)

# Add documents
collection.add(
    documents=[chunk.page_content for chunk in chunks],
    metadatas=[chunk.metadata for chunk in chunks],
    ids=[f"chunk_{i}" for i in range(len(chunks))],
)

# Query (auto-embeds query string)
results = collection.query(
    query_texts=["How do I reset my password?"],
    n_results=5,
)

print(results["documents"])      # Retrieved chunks
print(results["metadatas"])      # Metadata
print(results["distances"])      # Similarity scores
```

### With Custom Embeddings

```python
from chromadb.utils import embedding_functions

# Use sentence-transformers
ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-mpnet-base-v2"
)

collection = client.get_or_create_collection(
    name="docs",
    embedding_function=ef,
)

# Or OpenAI
ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="sk-...",
    model_name="text-embedding-3-small",
)
```

### Metadata Filtering

```python
results = collection.query(
    query_texts=["password reset"],
    n_results=5,
    where={"source": "user_manual.pdf"},  # Filter by metadata
    where_document={"$contains": "admin"},  # Filter by content
)
```

**Operators:** `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$and`, `$or`, `$contains`

### Update/Delete

```python
# Update
collection.update(
    ids=["chunk_0"],
    documents=["Updated content"],
    metadatas=[{"source": "new.pdf"}],
)

# Delete
collection.delete(ids=["chunk_0"])

# Delete by filter
collection.delete(where={"source": "old.pdf"})
```

## Pinecone: Managed Vector DB

### Setup

```bash
pip install pinecone-client
```

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="YOUR_API_KEY")

# Create serverless index
pc.create_index(
    name="docs",
    dimension=1536,  # Must match embedding model
    metric="cosine",  # cosine, euclidean, dotproduct
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1",
    ),
)

index = pc.Index("docs")
```

### Upsert Vectors

```python
# Prepare vectors
vectors = [
    {
        "id": f"chunk_{i}",
        "values": embedding,  # List of floats
        "metadata": chunk.metadata,
    }
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
]

# Batch upsert (max 100 vectors per request)
batch_size = 100
for i in range(0, len(vectors), batch_size):
    index.upsert(vectors=vectors[i:i+batch_size])
```

### Query

```python
results = index.query(
    vector=query_embedding,  # Must provide pre-embedded query
    top_k=5,
    include_metadata=True,
    include_values=False,  # Don't return vectors (saves bandwidth)
)

for match in results["matches"]:
    print(f"Score: {match['score']}")
    print(f"Text: {match['metadata']['text']}")
    print(f"Source: {match['metadata']['source']}")
```

### Metadata Filtering

```python
results = index.query(
    vector=query_embedding,
    top_k=5,
    filter={
        "source": {"$eq": "manual.pdf"},
        "page": {"$gte": 10},
    },
    include_metadata=True,
)
```

### Namespaces (Multi-Tenancy)

```python
# Upsert to namespace
index.upsert(vectors=vectors, namespace="user_123")

# Query namespace
results = index.query(
    vector=query_embedding,
    top_k=5,
    namespace="user_123",
)

# Delete namespace
index.delete(delete_all=True, namespace="user_123")
```

**Use namespaces for:**
- Per-user document collections
- Environment separation (dev/staging/prod)
- Multi-tenant SaaS

### Cost Optimization

**Serverless vs Pod:**
- **Serverless:** Pay per operation, auto-scales, no infra
  - Best for: Variable traffic, dev/test, <100M vectors
- **Pod:** Reserved capacity, predictable cost
  - Best for: High throughput, >100M vectors, consistent traffic

**Reduce costs:**
- Use smaller embeddings (e.g., 384 vs 1536 dims)
- Filter before querying (reduce top_k)
- Delete unused namespaces
- Use `include_values=False` in queries

## Qdrant: High-Performance Vector DB

### Setup (Docker)

```bash
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
```

```bash
pip install qdrant-client
```

### Create Collection

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(
        size=768,  # Embedding dimension
        distance=Distance.COSINE,
    ),
)
```

### Upsert Points

```python
from qdrant_client.models import PointStruct

points = [
    PointStruct(
        id=i,
        vector=embedding.tolist(),
        payload={
            "text": chunk.page_content,
            "source": chunk.metadata["source"],
            "page": chunk.metadata.get("page"),
        },
    )
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
]

client.upsert(collection_name="docs", points=points)
```

### Search

```python
results = client.search(
    collection_name="docs",
    query_vector=query_embedding.tolist(),
    limit=5,
)

for hit in results:
    print(f"Score: {hit.score}")
    print(f"Text: {hit.payload['text']}")
```

### Metadata Filtering

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

results = client.search(
    collection_name="docs",
    query_vector=query_embedding.tolist(),
    query_filter=Filter(
        must=[
            FieldCondition(
                key="source",
                match=MatchValue(value="manual.pdf"),
            ),
        ],
    ),
    limit=5,
)
```

**Filter types:**
- `must` — All conditions must match (AND)
- `should` — At least one must match (OR)
- `must_not` — Exclude matches

### Hybrid Search (Keyword + Vector)

```python
from qdrant_client.models import SearchRequest, Prefetch

# Requires sparse vectors (TF-IDF, BM25)
results = client.query_points(
    collection_name="docs",
    prefetch=Prefetch(
        query="password reset",  # Keyword search
        using="sparse",
        limit=20,
    ),
    query=query_embedding.tolist(),  # Vector search
    using="dense",
    limit=5,
)
```

**Setup sparse vectors:**
```python
from qdrant_client.models import SparseVectorParams

client.create_collection(
    collection_name="docs",
    vectors_config={
        "dense": VectorParams(size=768, distance=Distance.COSINE),
    },
    sparse_vectors_config={
        "sparse": SparseVectorParams(),
    },
)
```

## FAISS: High-Performance Local Search

### Setup

```bash
pip install faiss-cpu  # or faiss-gpu
```

### Basic Flat Index (Exact Search)

```python
import faiss
import numpy as np

# Convert embeddings to numpy array
embeddings_np = np.array(embeddings).astype("float32")
dimension = embeddings_np.shape[1]

# Create index
index = faiss.IndexFlatL2(dimension)  # L2 distance
# Or: faiss.IndexFlatIP(dimension)    # Inner product (cosine if normalized)

# Add vectors
index.add(embeddings_np)

# Search
k = 5  # Top-k results
query_np = np.array([query_embedding]).astype("float32")
distances, indices = index.search(query_np, k)

print(f"Top {k} results:")
for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
    print(f"{i+1}. Distance: {dist}, Chunk: {chunks[idx].page_content[:100]}")
```

### IVF Index (Faster Approximate Search)

```python
# For large datasets (>100k vectors)
nlist = 100  # Number of clusters

quantizer = faiss.IndexFlatL2(dimension)
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)

# Train on data
index.train(embeddings_np)
index.add(embeddings_np)

# Search (faster but approximate)
index.nprobe = 10  # Search 10 clusters (higher = more accurate, slower)
distances, indices = index.search(query_np, k)
```

### HNSW Index (Best Quality/Speed Trade-off)

```python
# Hierarchical Navigable Small World
M = 32  # Number of connections per layer (higher = better recall, more memory)
index = faiss.IndexHNSWFlat(dimension, M)

index.hnsw.efConstruction = 40  # Build-time accuracy (higher = better index)
index.add(embeddings_np)

index.hnsw.efSearch = 16  # Search-time accuracy (higher = better recall)
distances, indices = index.search(query_np, k)
```

### Save/Load Index

```python
# Save
faiss.write_index(index, "faiss_index.bin")

# Load
index = faiss.read_index("faiss_index.bin")
```

### With Metadata (Use ID Mapping)

```python
# FAISS only stores vectors, not metadata
# Store metadata separately

metadata_store = {i: chunk.metadata for i, chunk in enumerate(chunks)}

# After search
for idx in indices[0]:
    metadata = metadata_store[idx]
    print(f"Source: {metadata['source']}")
```

### Index Selection Guide

| Index Type | Build Time | Search Speed | Accuracy | Memory | Best For |
|-----------|-----------|--------------|----------|--------|----------|
| `IndexFlatL2` | Instant | Slow | 100% | Medium | <100k vectors |
| `IndexIVFFlat` | Fast | Fast | 95-99% | Medium | 100k-10M vectors |
| `IndexHNSWFlat` | Slow | Fastest | 99%+ | High | High-QPS apps |
| `IndexIVFPQ` | Medium | Fastest | 90-95% | Low | >10M vectors |

## Retrieval Strategies

### 1. Similarity Search (Basic)

```python
# Retrieve top-k most similar chunks
results = collection.query(query_texts=[query], n_results=5)
```

**Pros:** Simple, fast
**Cons:** May return redundant/similar chunks

### 2. Maximum Marginal Relevance (MMR)

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=OpenAIEmbeddings(),
)

# MMR retrieval
docs = vectorstore.max_marginal_relevance_search(
    query,
    k=5,              # Return 5 docs
    fetch_k=20,       # Fetch 20 candidates first
    lambda_mult=0.5,  # Diversity (0=max diversity, 1=max relevance)
)
```

**How it works:**
1. Fetch `fetch_k` most similar chunks
2. Iteratively select chunks that are:
   - Relevant to query
   - Diverse from already-selected chunks
3. Return top `k`

**When to use:** Questions requiring broad coverage, avoiding redundancy

### 3. Hybrid Search (Keyword + Vector)

```python
# Qdrant example
from qdrant_client.models import SearchRequest, Prefetch

results = client.query_points(
    collection_name="docs",
    prefetch=Prefetch(
        query="password reset",  # BM25 keyword search
        using="sparse",
        limit=50,
    ),
    query=query_embedding,  # Dense vector search
    using="dense",
    limit=5,
)
```

**Use cases:**
- Precise term matching ("error code 404")
- Fallback when semantic search fails
- Best-of-both-worlds retrieval

### 4. Reranking

```python
from sentence_transformers import CrossEncoder

# Initial retrieval
initial_results = vectorstore.similarity_search(query, k=20)

# Rerank with cross-encoder
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
pairs = [[query, doc.page_content] for doc in initial_results]
scores = reranker.predict(pairs)

# Sort by reranker scores
reranked = sorted(
    zip(scores, initial_results),
    key=lambda x: x[0],
    reverse=True,
)

top_5 = [doc for _, doc in reranked[:5]]
```

**Why rerank:**
- Bi-encoders (embedding models) are fast but less accurate
- Cross-encoders are slow but highly accurate
- Hybrid approach: bi-encoder retrieves candidates, cross-encoder reranks

**Popular rerankers:**
- `cross-encoder/ms-marco-MiniLM-L-6-v2` (fast, English)
- `cross-encoder/ms-marco-MiniLM-L-12-v2` (better quality)
- Cohere Rerank API (best quality, $1/1k searches)

### 5. Parent Document Retrieval

```python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

# Small chunks for retrieval
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)

# Large chunks for context
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)

store = InMemoryStore()
retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)

retriever.add_documents(docs)

# Retrieves small chunks, returns parent docs
results = retriever.get_relevant_documents(query)
```

**Benefit:** Precise retrieval, rich context for generation

## Production Patterns

### 1. Caching Retrieval Results

```python
from functools import lru_cache
import hashlib

def cache_key(query: str) -> str:
    return hashlib.md5(query.encode()).hexdigest()

@lru_cache(maxsize=1000)
def retrieve_cached(query: str) -> list:
    return vectorstore.similarity_search(query, k=5)

# Use
results = retrieve_cached("How do I reset my password?")
```

**Advanced:** Use Redis for shared cache across workers

```python
import redis
import json

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def retrieve_with_redis(query: str) -> list:
    key = f"rag:{cache_key(query)}"
    cached = r.get(key)

    if cached:
        return json.loads(cached)

    results = vectorstore.similarity_search(query, k=5)
    r.setex(key, 3600, json.dumps([doc.page_content for doc in results]))
    return results
```

### 2. Evaluation Metrics

**Faithfulness:** Is the answer grounded in retrieved context?

```python
from langchain.evaluation import load_evaluator

evaluator = load_evaluator("qa", llm=llm)

result = evaluator.evaluate_strings(
    prediction=answer,
    input=query,
    reference="\n\n".join([doc.page_content for doc in retrieved_docs]),
)

print(f"Faithfulness score: {result['score']}")
```

**Relevance:** Are retrieved chunks relevant to query?

```python
# Manual evaluation
def evaluate_relevance(query: str, docs: list) -> float:
    relevance_scores = []
    for doc in docs:
        # Ask LLM: "Is this chunk relevant to query?"
        score = llm_judge(query, doc.page_content)  # 0-1
        relevance_scores.append(score)
    return sum(relevance_scores) / len(relevance_scores)
```

**Answer Quality:** Human eval on sample queries

```python
# Golden dataset
test_cases = [
    {"query": "How to reset password?", "expected_answer": "..."},
    {"query": "What is pricing?", "expected_answer": "..."},
]

for case in test_cases:
    answer = rag_chain(case["query"])
    # Compare to expected_answer (cosine similarity, LLM-as-judge, human review)
```

### 3. Monitoring

```python
import logging
from datetime import datetime

def log_retrieval(query: str, results: list, user_id: str):
    logging.info({
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id,
        "query": query,
        "num_results": len(results),
        "top_score": results[0].score if results else None,
        "sources": [doc.metadata["source"] for doc in results],
    })

# Track metrics
from prometheus_client import Counter, Histogram

retrieval_latency = Histogram("rag_retrieval_seconds", "Retrieval latency")
queries_total = Counter("rag_queries_total", "Total queries")

with retrieval_latency.time():
    results = vectorstore.similarity_search(query)
queries_total.inc()
```

**Key metrics:**
- Retrieval latency (p50, p95, p99)
- Queries per second
- Cache hit rate
- Average retrieval score
- Failed retrievals (score < threshold)

### 4. Cost Optimization

**Reduce embedding costs:**
```python
# Batch embed documents
batch_size = 100
for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i+batch_size]
    embeddings = embed_batch([c.page_content for c in batch])
    vectorstore.add_documents(batch, embeddings=embeddings)
```

**Use smaller models:**
```python
# OpenAI text-embedding-3-small ($0.02/1M) vs 3-large ($0.13/1M)
# 7x cost savings, minimal quality loss for most use cases
```

**Deduplicate documents:**
```python
from hashlib import sha256

seen_hashes = set()
unique_chunks = []

for chunk in chunks:
    content_hash = sha256(chunk.page_content.encode()).hexdigest()
    if content_hash not in seen_hashes:
        seen_hashes.add(content_hash)
        unique_chunks.append(chunk)

print(f"Removed {len(chunks) - len(unique_chunks)} duplicates")
```

**Cache embeddings:**
```python
# Store embeddings in DB to avoid re-embedding on restart
import pickle

# Save
with open("embeddings.pkl", "wb") as f:
    pickle.dump(embeddings, f)

# Load
with open("embeddings.pkl", "rb") as f:
    embeddings = pickle.load(f)
```

### 5. Incremental Updates

```python
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class DocumentWatcher(FileSystemEventHandler):
    def on_created(self, event):
        if event.src_path.endswith(".pdf"):
            # Load new document
            loader = PyPDFLoader(event.src_path)
            docs = loader.load()

            # Chunk + embed + add to vectorstore
            chunks = text_splitter.split_documents(docs)
            vectorstore.add_documents(chunks)

            print(f"Added {event.src_path} to RAG system")

# Monitor directory
observer = Observer()
observer.schedule(DocumentWatcher(), path="./docs", recursive=True)
observer.start()
```

**Database-backed updates:**
```python
# Track document versions
import sqlite3

conn = sqlite3.connect("rag_metadata.db")
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY,
        filepath TEXT UNIQUE,
        hash TEXT,
        last_indexed TIMESTAMP
    )
""")

def update_if_changed(filepath: str):
    with open(filepath, "rb") as f:
        file_hash = sha256(f.read()).hexdigest()

    cursor.execute("SELECT hash FROM documents WHERE filepath = ?", (filepath,))
    row = cursor.fetchone()

    if row is None or row[0] != file_hash:
        # Document new or changed
        reindex_document(filepath)
        cursor.execute(
            "INSERT OR REPLACE INTO documents (filepath, hash, last_indexed) VALUES (?, ?, ?)",
            (filepath, file_hash, datetime.now()),
        )
        conn.commit()
```

## Anti-Patterns

### 1. Too-Large Chunks

**Problem:**
```python
# ❌ Chunks too large (>2000 chars)
splitter = CharacterTextSplitter(chunk_size=5000)
```

**Impact:**
- Poor retrieval precision (too much irrelevant context)
- Exceeds LLM context window
- Slower embedding

**Fix:**
```python
# ✅ Right-size chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
```

### 2. Ignoring Metadata

**Problem:**
```python
# ❌ No metadata
vectorstore.add_documents(chunks)
```

**Impact:**
- Can't filter by source, date, author
- No provenance for citations
- Hard to debug

**Fix:**
```python
# ✅ Enrich metadata
for chunk in chunks:
    chunk.metadata.update({
        "source": doc.metadata["source"],
        "page": doc.metadata.get("page"),
        "indexed_at": datetime.now().isoformat(),
        "doc_type": "user_manual",
    })

vectorstore.add_documents(chunks)
```

### 3. No Retrieval Quality Checks

**Problem:**
```python
# ❌ Blindly use top result
results = vectorstore.similarity_search(query, k=1)
answer = llm.generate(query, context=results[0].page_content)
```

**Impact:**
- Low-relevance chunks → hallucinated answers
- No fallback when retrieval fails

**Fix:**
```python
# ✅ Check relevance threshold
results = vectorstore.similarity_search_with_score(query, k=5)

relevant_docs = [doc for doc, score in results if score > 0.7]

if not relevant_docs:
    return "I couldn't find relevant information in the knowledge base."

answer = llm.generate(query, context=relevant_docs)
```

### 4. Skipping Evaluation

**Problem:**
- Ship RAG system without testing retrieval quality
- No baseline metrics

**Fix:**
```python
# ✅ Create test set
test_queries = [
    ("How to reset password?", ["user_manual.pdf"]),  # Expected sources
    ("What is pricing?", ["pricing.pdf"]),
]

for query, expected_sources in test_queries:
    results = vectorstore.similarity_search(query, k=5)
    retrieved_sources = {doc.metadata["source"] for doc in results}

    assert expected_sources[0] in retrieved_sources, f"Failed: {query}"

print("All tests passed!")
```

### 5. Embedding Model Mismatch

**Problem:**
```python
# ❌ Different models for indexing vs querying
# Indexed with sentence-transformers
vectorstore.add_documents(chunks, embeddings=st_embeddings)

# Queried with OpenAI
query_embedding = openai_embed(query)
results = vectorstore.similarity_search_by_vector(query_embedding)
```

**Impact:** Meaningless similarity scores, broken retrieval

**Fix:**
```python
# ✅ Single embedding model throughout
embedding_model = SentenceTransformer("all-mpnet-base-v2")

# Index
doc_embeddings = embedding_model.encode([c.page_content for c in chunks])
vectorstore.add_documents(chunks, embeddings=doc_embeddings)

# Query
query_embedding = embedding_model.encode([query])[0]
results = vectorstore.similarity_search_by_vector(query_embedding)
```

### 6. No Chunk Overlap

**Problem:**
```python
# ❌ Zero overlap
splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
```

**Impact:** Context lost at chunk boundaries (e.g., multi-sentence concepts split)

**Fix:**
```python
# ✅ 10-20% overlap
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
```

### 7. Ignoring Query Rewriting

**Problem:**
```python
# ❌ Use raw user query
user_query = "it doesnt work"
results = vectorstore.similarity_search(user_query)
```

**Impact:** Vague queries retrieve poor results

**Fix:**
```python
# ✅ Rewrite query for clarity
from langchain.chains import LLMChain

rewrite_prompt = """
Rewrite this vague query into a clear, specific question:
Query: {query}
Rewritten:
"""

rewritten = llm.predict(rewrite_prompt.format(query=user_query))
# "How do I troubleshoot login errors?"

results = vectorstore.similarity_search(rewritten)
```

## Quick Reference

### Chroma (Local Prototypes)
```python
import chromadb
client = chromadb.Client(Settings(persist_directory="./db"))
collection = client.get_or_create_collection("docs")
collection.add(documents=texts, ids=ids)
results = collection.query(query_texts=[query], n_results=5)
```

### Pinecone (Managed Cloud)
```python
from pinecone import Pinecone
pc = Pinecone(api_key="...")
index = pc.Index("docs")
index.upsert(vectors=[{"id": "1", "values": embedding, "metadata": {...}}])
results = index.query(vector=query_embedding, top_k=5)
```

### Qdrant (Self-Hosted)
```python
from qdrant_client import QdrantClient
client = QdrantClient(url="http://localhost:6333")
client.upsert(collection_name="docs", points=[...])
results = client.search(collection_name="docs", query_vector=embedding, limit=5)
```

### FAISS (High Performance)
```python
import faiss
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)
distances, indices = index.search(query_embedding, k=5)
```

### Embedding Models
```python
# Local (free)
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-mpnet-base-v2")
embeddings = model.encode(texts)

# OpenAI (paid)
from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(model="text-embedding-3-small", input=texts)
embeddings = [item.embedding for item in response.data]
```

### Chunking
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)
```

---

**Related skills:** `mcp-server-rag`, `ai-architectures`, `prompt-engineering`, `langchain-master`

**When to delegate:** For production RAG implementation, delegate to `coder` with this skill as context. For architecture decisions, consult `architect` with vector DB trade-offs.
