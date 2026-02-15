---
name: agentdb-master
description: >
  Comprehensive AgentDB guide covering vector search, memory patterns,
  QUIC synchronization, learning plugins, performance optimization,
  and ReasoningBank integration. Consolidates 12 AgentDB skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# AgentDB Master Guide

Complete reference for building AI agent systems with AgentDB — covering vector search, memory architectures, distributed synchronization, learning loops, and multi-agent coordination.

## 1. When to Use AgentDB

### Primary Use Cases

**Agent Memory Systems**
- Persistent conversation history across sessions
- Episodic memory for complex agent behaviors
- Context retrieval for long-running agents
- Knowledge accumulation over time

**Multi-Agent Coordination**
- Shared state management across agent teams
- Distributed task queues and work allocation
- Consensus mechanisms for collaborative decision-making
- Agent-to-agent knowledge sharing

**Vector-Based Knowledge Retrieval**
- Semantic search over large knowledge bases
- RAG (Retrieval-Augmented Generation) pipelines
- Similar experience lookup (case-based reasoning)
- Hybrid search combining vector similarity and metadata filtering

**Learning & Adaptation**
- Storing agent reasoning chains for reflection
- Feedback loops for continuous improvement
- Pattern recognition from past actions
- Knowledge graph construction and traversal

### When NOT to Use AgentDB

- Simple stateless agents (use in-memory context)
- Single-user applications without collaboration needs
- Systems with strict ACID transaction requirements (use PostgreSQL)
- High-frequency trading or real-time control systems (use Redis)

---

## 2. AgentDB Overview

### What is AgentDB?

AgentDB is a distributed database optimized for AI agent systems. It provides:
- **Vector storage** — embeddings with efficient similarity search
- **QUIC protocol** — low-latency synchronization across instances
- **Flexible schema** — JSON documents with optional type enforcement
- **Multi-tenancy** — namespace isolation for agent teams
- **Plugin architecture** — extensible learning and reasoning modules

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Agent Application                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Agent A   │  │  Agent B   │  │  Agent C   │        │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘        │
│         │                │                │               │
│         └────────────────┴────────────────┘               │
│                          │                                │
└──────────────────────────┼────────────────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   AgentDB Client    │
                │  (Vector + Metadata)│
                └──────────┬──────────┘
                           │
        ┏━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━┓
        ┃         QUIC Synchronization          ┃
        ┗━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━┛
                   │                 │
         ┌─────────▼────────┐ ┌─────▼──────────┐
         │  AgentDB Node 1  │ │ AgentDB Node 2 │
         │  (Vector Index)  │ │ (Vector Index) │
         └──────────────────┘ └────────────────┘
```

### Core Concepts

**Collections**: Logical groupings of documents (like tables)
**Documents**: JSON objects with optional vector embeddings
**Namespaces**: Isolated environments for multi-tenant deployments
**Indexes**: Vector (HNSW, IVF) and metadata (B-tree, hash)
**Plugins**: Modular extensions (learning, reasoning, security)

---

## 3. Vector Search

### Embedding Creation

```python
from agentdb import AgentDB, VectorConfig
from sentence_transformers import SentenceTransformer

db = AgentDB("https://agentdb.local:9090")
encoder = SentenceTransformer('all-MiniLM-L6-v2')

# Create collection with vector config
db.create_collection(
    "knowledge_base",
    vector_config=VectorConfig(
        dimension=384,  # all-MiniLM-L6-v2 dimension
        metric="cosine",  # cosine, euclidean, or dot_product
        index_type="hnsw",  # hnsw or ivf
        hnsw_m=16,  # HNSW graph connectivity
        hnsw_ef_construction=200  # Build-time accuracy
    )
)

# Insert documents with embeddings
documents = [
    {"text": "AgentDB supports vector search", "category": "features"},
    {"text": "QUIC provides low-latency sync", "category": "features"},
    {"text": "Plugins enable agent learning", "category": "architecture"}
]

for doc in documents:
    embedding = encoder.encode(doc["text"])
    db.insert("knowledge_base", {
        "content": doc["text"],
        "category": doc["category"],
        "vector": embedding.tolist()
    })
```

### Similarity Search

```python
# Basic vector search
query = "How does AgentDB handle synchronization?"
query_vector = encoder.encode(query)

results = db.search(
    collection="knowledge_base",
    vector=query_vector.tolist(),
    limit=5,
    min_score=0.7  # Cosine similarity threshold
)

for result in results:
    print(f"Score: {result.score:.3f} | {result.data['content']}")
```

### Custom Distance Metrics

```python
from agentdb import DistanceMetric

# L2 (Euclidean) distance
db.create_collection(
    "spatial_data",
    vector_config=VectorConfig(
        dimension=128,
        metric=DistanceMetric.EUCLIDEAN
    )
)

# Dot product (for normalized embeddings)
db.create_collection(
    "normalized_embeddings",
    vector_config=VectorConfig(
        dimension=768,
        metric=DistanceMetric.DOT_PRODUCT
    )
)
```

### Hybrid Search (Vector + Keyword)

```python
# Combine vector similarity with metadata filters
results = db.search(
    collection="knowledge_base",
    vector=query_vector.tolist(),
    filter={
        "category": "features",
        "created_at": {"$gte": "2026-01-01"}
    },
    limit=10,
    hybrid_mode="rrf"  # Reciprocal rank fusion
)

# Full-text search with vector re-ranking
results = db.hybrid_search(
    collection="knowledge_base",
    text_query="synchronization protocol",
    vector=query_vector.tolist(),
    alpha=0.7,  # 0.7 vector, 0.3 keyword
    limit=10
)
```

---

## 4. Memory Patterns

### Short-Term Memory (Context)

```python
class AgentContextManager:
    def __init__(self, db, agent_id):
        self.db = db
        self.agent_id = agent_id
        self.collection = "agent_context"

    def add_message(self, role, content):
        """Store conversation turn in working memory"""
        self.db.insert(self.collection, {
            "agent_id": self.agent_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "ttl": 3600  # Expire after 1 hour
        })

    def get_recent_context(self, limit=10):
        """Retrieve recent conversation history"""
        return self.db.query(
            collection=self.collection,
            filter={"agent_id": self.agent_id},
            sort=[("timestamp", "desc")],
            limit=limit
        )
```

### Long-Term Memory (Persistent)

```python
class AgentLongTermMemory:
    def __init__(self, db, agent_id, encoder):
        self.db = db
        self.agent_id = agent_id
        self.encoder = encoder
        self.collection = "agent_longterm_memory"

    def store_experience(self, experience_text, metadata):
        """Store important experiences with semantic indexing"""
        embedding = self.encoder.encode(experience_text)

        self.db.insert(self.collection, {
            "agent_id": self.agent_id,
            "experience": experience_text,
            "vector": embedding.tolist(),
            "metadata": metadata,
            "importance": metadata.get("importance", 0.5),
            "timestamp": datetime.utcnow().isoformat()
        })

    def recall_similar(self, query_text, limit=5):
        """Retrieve similar past experiences"""
        query_vector = self.encoder.encode(query_text)

        return self.db.search(
            collection=self.collection,
            vector=query_vector.tolist(),
            filter={"agent_id": self.agent_id},
            limit=limit
        )
```

### Episodic Memory

```python
class EpisodicMemory:
    """Store complete interaction episodes for replay"""

    def __init__(self, db, agent_id):
        self.db = db
        self.agent_id = agent_id
        self.collection = "episodes"

    def create_episode(self, task_id):
        """Start a new episode"""
        return self.db.insert(self.collection, {
            "agent_id": self.agent_id,
            "task_id": task_id,
            "start_time": datetime.utcnow().isoformat(),
            "events": [],
            "outcome": None
        })

    def add_event(self, episode_id, event_type, data):
        """Append event to episode"""
        self.db.update(
            collection=self.collection,
            filter={"_id": episode_id},
            update={
                "$push": {
                    "events": {
                        "type": event_type,
                        "data": data,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
            }
        )

    def complete_episode(self, episode_id, outcome):
        """Mark episode complete with outcome"""
        self.db.update(
            collection=self.collection,
            filter={"_id": episode_id},
            update={
                "$set": {
                    "outcome": outcome,
                    "end_time": datetime.utcnow().isoformat()
                }
            }
        )
```

### Working Memory for Agents

```python
class WorkingMemory:
    """Temporary scratchpad for active reasoning"""

    def __init__(self, db, agent_id):
        self.db = db
        self.agent_id = agent_id
        self.collection = "working_memory"
        self.current_session = str(uuid.uuid4())

    def store(self, key, value, priority=0):
        """Store item in working memory with priority"""
        self.db.upsert(
            collection=self.collection,
            filter={
                "agent_id": self.agent_id,
                "session": self.current_session,
                "key": key
            },
            update={
                "value": value,
                "priority": priority,
                "updated_at": datetime.utcnow().isoformat()
            }
        )

    def retrieve(self, key):
        """Retrieve item from working memory"""
        result = self.db.query(
            collection=self.collection,
            filter={
                "agent_id": self.agent_id,
                "session": self.current_session,
                "key": key
            },
            limit=1
        )
        return result[0]["value"] if result else None

    def clear_low_priority(self, threshold=0.3):
        """Evict low-priority items (memory pressure)"""
        self.db.delete(
            collection=self.collection,
            filter={
                "agent_id": self.agent_id,
                "session": self.current_session,
                "priority": {"$lt": threshold}
            }
        )
```

---

## 5. QUIC Synchronization

### Multi-Database Management

```python
from agentdb import AgentDB, SyncConfig

# Primary database
primary = AgentDB("https://primary.agentdb.local:9090")

# Replica databases
replicas = [
    AgentDB("https://replica-1.agentdb.local:9090"),
    AgentDB("https://replica-2.agentdb.local:9090")
]

# Configure synchronization
sync_config = SyncConfig(
    mode="async",  # async, sync, or eventual
    conflict_resolution="last_write_wins",  # lww, custom, or merge
    batch_size=100,
    sync_interval_ms=50  # QUIC keeps latency low
)

# Enable replication
primary.enable_replication(
    replicas=[r.connection_string for r in replicas],
    config=sync_config
)
```

### Distributed Sync

```python
class DistributedAgentState:
    """Sync agent state across multiple nodes"""

    def __init__(self, nodes):
        self.nodes = nodes  # List of AgentDB instances
        self.primary = nodes[0]

    def write(self, collection, data):
        """Write to primary, sync to replicas via QUIC"""
        doc_id = self.primary.insert(collection, data)

        # QUIC automatically propagates to replicas
        # Wait for quorum (optional)
        self.primary.wait_for_sync(
            doc_id=doc_id,
            min_replicas=len(self.nodes) // 2,
            timeout_ms=100
        )

        return doc_id

    def read(self, collection, doc_id, consistency="eventual"):
        """Read with configurable consistency"""
        if consistency == "strong":
            # Read from primary
            return self.primary.get(collection, doc_id)
        else:
            # Read from any replica (lower latency)
            import random
            node = random.choice(self.nodes)
            return node.get(collection, doc_id)
```

### Conflict Resolution

```python
from agentdb import ConflictResolver

class CustomConflictResolver(ConflictResolver):
    """Priority-based conflict resolution"""

    def resolve(self, local_doc, remote_doc):
        """Higher priority agent wins"""
        local_priority = local_doc.get("agent_priority", 0)
        remote_priority = remote_doc.get("agent_priority", 0)

        if local_priority > remote_priority:
            return local_doc
        elif remote_priority > local_priority:
            return remote_doc
        else:
            # Same priority, merge fields
            merged = local_doc.copy()
            merged.update({
                k: v for k, v in remote_doc.items()
                if k not in local_doc or local_doc[k] < v
            })
            return merged

# Apply custom resolver
primary.set_conflict_resolver(
    collection="agent_state",
    resolver=CustomConflictResolver()
)
```

---

## 6. Learning Plugins

### Agent Learning Loops

```python
from agentdb.plugins import LearningPlugin

class FeedbackLearningPlugin(LearningPlugin):
    """Learn from user feedback on agent actions"""

    def __init__(self, db, encoder):
        self.db = db
        self.encoder = encoder
        self.collection = "learned_patterns"

    def record_action(self, context, action, outcome, feedback):
        """Store action with outcome and feedback"""
        context_vector = self.encoder.encode(context)

        self.db.insert(self.collection, {
            "context": context,
            "action": action,
            "outcome": outcome,
            "feedback": feedback,  # positive, negative, neutral
            "context_vector": context_vector.tolist(),
            "timestamp": datetime.utcnow().isoformat()
        })

    def suggest_action(self, current_context):
        """Retrieve successful actions from similar contexts"""
        context_vector = self.encoder.encode(current_context)

        similar_cases = self.db.search(
            collection=self.collection,
            vector=context_vector.tolist(),
            filter={"feedback": "positive"},
            limit=5
        )

        # Aggregate successful actions
        action_scores = {}
        for case in similar_cases:
            action = case.data["action"]
            action_scores[action] = action_scores.get(action, 0) + case.score

        # Return best action
        if action_scores:
            best_action = max(action_scores, key=action_scores.get)
            return best_action, action_scores[best_action]

        return None, 0.0

# Register plugin
db.register_plugin("feedback_learning", FeedbackLearningPlugin(db, encoder))
```

### Knowledge Accumulation

```python
class KnowledgeAccumulator:
    """Incrementally build knowledge base from agent experiences"""

    def __init__(self, db, encoder):
        self.db = db
        self.encoder = encoder
        self.knowledge_collection = "accumulated_knowledge"

    def extract_facts(self, text):
        """Extract facts using NER/relationship extraction"""
        # Placeholder for NLP pipeline
        facts = [
            {"subject": "AgentDB", "predicate": "supports", "object": "vector search"},
            {"subject": "QUIC", "predicate": "provides", "object": "low-latency sync"}
        ]
        return facts

    def accumulate(self, experience_text):
        """Extract and store facts from experience"""
        facts = self.extract_facts(experience_text)

        for fact in facts:
            fact_text = f"{fact['subject']} {fact['predicate']} {fact['object']}"
            embedding = self.encoder.encode(fact_text)

            # Check if fact already exists (deduplication)
            similar = self.db.search(
                collection=self.knowledge_collection,
                vector=embedding.tolist(),
                limit=1,
                min_score=0.95
            )

            if not similar:
                self.db.insert(self.knowledge_collection, {
                    "fact": fact,
                    "text": fact_text,
                    "vector": embedding.tolist(),
                    "source": "agent_experience",
                    "confidence": 0.8,
                    "timestamp": datetime.utcnow().isoformat()
                })
```

### Pattern Recognition

```python
class PatternRecognizer:
    """Identify recurring patterns in agent behavior"""

    def __init__(self, db):
        self.db = db
        self.collection = "behavior_patterns"

    def analyze_episode_sequence(self, agent_id, lookback_days=7):
        """Find common action sequences"""
        cutoff = (datetime.utcnow() - timedelta(days=lookback_days)).isoformat()

        episodes = self.db.query(
            collection="episodes",
            filter={
                "agent_id": agent_id,
                "end_time": {"$gte": cutoff}
            }
        )

        # Extract event sequences
        sequences = []
        for episode in episodes:
            event_types = [e["type"] for e in episode["events"]]
            sequences.append(event_types)

        # Find common subsequences (simplified)
        from collections import Counter
        pattern_counts = Counter()

        for seq in sequences:
            for length in range(2, 6):  # Patterns of 2-5 steps
                for i in range(len(seq) - length + 1):
                    pattern = tuple(seq[i:i+length])
                    pattern_counts[pattern] += 1

        # Store significant patterns
        threshold = len(sequences) * 0.3  # Occurs in 30% of episodes
        for pattern, count in pattern_counts.items():
            if count >= threshold:
                self.db.upsert(
                    collection=self.collection,
                    filter={
                        "agent_id": agent_id,
                        "pattern": list(pattern)
                    },
                    update={
                        "frequency": count,
                        "total_episodes": len(sequences),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                )
```

---

## 7. Performance Optimization

### Indexing Strategies

```python
# Vector indexes
db.create_vector_index(
    collection="embeddings",
    field="vector",
    config={
        "type": "hnsw",
        "m": 16,  # Higher = better recall, more memory
        "ef_construction": 200,  # Higher = better quality, slower build
        "ef_search": 50  # Higher = better recall, slower search
    }
)

# IVF for larger datasets (billions of vectors)
db.create_vector_index(
    collection="large_embeddings",
    field="vector",
    config={
        "type": "ivf",
        "nlist": 1024,  # Number of clusters
        "nprobe": 16  # Clusters to search (trade recall for speed)
    }
)

# Metadata indexes
db.create_index(
    collection="agent_state",
    fields=["agent_id", "timestamp"],
    index_type="compound"
)

db.create_index(
    collection="knowledge_base",
    fields=["category"],
    index_type="hash"
)
```

### Batch Operations

```python
# Batch inserts (much faster than individual)
documents = [
    {"text": f"Document {i}", "vector": encoder.encode(f"Document {i}").tolist()}
    for i in range(1000)
]

db.batch_insert(
    collection="knowledge_base",
    documents=documents,
    batch_size=100  # Commit every 100 docs
)

# Bulk updates
db.bulk_update(
    collection="agent_state",
    updates=[
        {
            "filter": {"agent_id": f"agent_{i}"},
            "update": {"$set": {"status": "active"}}
        }
        for i in range(100)
    ]
)

# Bulk vector search
queries = [encoder.encode(q).tolist() for q in ["query1", "query2", "query3"]]

results = db.batch_search(
    collection="knowledge_base",
    vectors=queries,
    limit=10
)
```

### Caching

```python
from functools import lru_cache
import hashlib

class CachedVectorSearch:
    def __init__(self, db, encoder, cache_size=1000):
        self.db = db
        self.encoder = encoder
        self.cache = {}
        self.cache_size = cache_size

    def search(self, collection, query_text, limit=5):
        # Cache key from query text
        cache_key = hashlib.md5(
            f"{collection}:{query_text}:{limit}".encode()
        ).hexdigest()

        if cache_key in self.cache:
            return self.cache[cache_key]

        # Perform search
        vector = self.encoder.encode(query_text)
        results = self.db.search(
            collection=collection,
            vector=vector.tolist(),
            limit=limit
        )

        # Cache results
        if len(self.cache) >= self.cache_size:
            # Evict oldest
            self.cache.pop(next(iter(self.cache)))

        self.cache[cache_key] = results
        return results
```

### Query Optimization

```python
# Projection (only fetch needed fields)
results = db.query(
    collection="knowledge_base",
    filter={"category": "features"},
    projection={"text": 1, "category": 1},  # Exclude large fields
    limit=100
)

# Query hints
results = db.query(
    collection="agent_state",
    filter={"agent_id": "agent_1"},
    hint="agent_id_index"  # Force specific index
)

# Limit + skip for pagination (use cursor for large datasets)
page_size = 20
page = 2

results = db.query(
    collection="episodes",
    filter={"agent_id": "agent_1"},
    sort=[("timestamp", "desc")],
    limit=page_size,
    skip=(page - 1) * page_size
)

# Better: cursor-based pagination
cursor = None
while True:
    results, next_cursor = db.query_paginated(
        collection="episodes",
        filter={"agent_id": "agent_1"},
        sort=[("timestamp", "desc")],
        limit=100,
        cursor=cursor
    )

    # Process results
    for doc in results:
        process(doc)

    if not next_cursor:
        break
    cursor = next_cursor
```

---

## 8. ReasoningBank Integration

### Storing Reasoning Chains

```python
class ReasoningBank:
    """Store and retrieve agent reasoning chains"""

    def __init__(self, db, encoder):
        self.db = db
        self.encoder = encoder
        self.collection = "reasoning_chains"

    def store_reasoning(self, problem, steps, conclusion, metadata=None):
        """Store complete reasoning chain"""
        # Create vector from problem + conclusion
        text = f"{problem} {conclusion}"
        embedding = self.encoder.encode(text)

        doc_id = self.db.insert(self.collection, {
            "problem": problem,
            "steps": steps,  # List of reasoning steps
            "conclusion": conclusion,
            "metadata": metadata or {},
            "vector": embedding.tolist(),
            "timestamp": datetime.utcnow().isoformat()
        })

        return doc_id

    def retrieve_similar_reasoning(self, problem, limit=5):
        """Find similar past reasoning chains"""
        problem_vector = self.encoder.encode(problem)

        results = self.db.search(
            collection=self.collection,
            vector=problem_vector.tolist(),
            limit=limit
        )

        return [
            {
                "problem": r.data["problem"],
                "steps": r.data["steps"],
                "conclusion": r.data["conclusion"],
                "similarity": r.score
            }
            for r in results
        ]

    def analyze_reasoning_patterns(self):
        """Identify common reasoning patterns"""
        all_chains = self.db.query(
            collection=self.collection,
            filter={},
            projection={"steps": 1}
        )

        # Extract step types
        step_patterns = []
        for chain in all_chains:
            pattern = [step.get("type", "unknown") for step in chain["steps"]]
            step_patterns.append(pattern)

        # Find frequent patterns
        from collections import Counter
        pattern_counts = Counter(tuple(p) for p in step_patterns)

        return pattern_counts.most_common(10)
```

### Knowledge Graphs

```python
class KnowledgeGraph:
    """Build and query knowledge graphs in AgentDB"""

    def __init__(self, db, encoder):
        self.db = db
        self.encoder = encoder
        self.nodes_collection = "kg_nodes"
        self.edges_collection = "kg_edges"

    def add_node(self, node_id, node_type, properties):
        """Add node to knowledge graph"""
        text = f"{node_type}: {properties.get('name', node_id)}"
        embedding = self.encoder.encode(text)

        self.db.upsert(
            collection=self.nodes_collection,
            filter={"node_id": node_id},
            update={
                "type": node_type,
                "properties": properties,
                "vector": embedding.tolist()
            }
        )

    def add_edge(self, source_id, target_id, relationship, properties=None):
        """Add edge between nodes"""
        self.db.insert(self.edges_collection, {
            "source": source_id,
            "target": target_id,
            "relationship": relationship,
            "properties": properties or {}
        })

    def traverse(self, start_node_id, max_depth=3):
        """Traverse graph from starting node"""
        visited = set()
        current_level = [start_node_id]
        result = {"nodes": [], "edges": []}

        for depth in range(max_depth):
            next_level = []

            for node_id in current_level:
                if node_id in visited:
                    continue

                visited.add(node_id)

                # Get node
                node = self.db.query(
                    collection=self.nodes_collection,
                    filter={"node_id": node_id},
                    limit=1
                )
                if node:
                    result["nodes"].append(node[0])

                # Get outgoing edges
                edges = self.db.query(
                    collection=self.edges_collection,
                    filter={"source": node_id}
                )

                for edge in edges:
                    result["edges"].append(edge)
                    next_level.append(edge["target"])

            current_level = next_level

        return result

    def semantic_search_nodes(self, query, limit=10):
        """Find nodes by semantic similarity"""
        query_vector = self.encoder.encode(query)

        return self.db.search(
            collection=self.nodes_collection,
            vector=query_vector.tolist(),
            limit=limit
        )
```

---

## 9. Multi-Agent Coordination

### Shared State Management

```python
class SharedState:
    """Thread-safe shared state for agent teams"""

    def __init__(self, db, team_id):
        self.db = db
        self.team_id = team_id
        self.collection = "team_state"

    def set(self, key, value, version=None):
        """Set value with optimistic locking"""
        filter_query = {
            "team_id": self.team_id,
            "key": key
        }

        if version is not None:
            filter_query["version"] = version

        result = self.db.update(
            collection=self.collection,
            filter=filter_query,
            update={
                "$set": {
                    "value": value,
                    "updated_at": datetime.utcnow().isoformat()
                },
                "$inc": {"version": 1}
            },
            upsert=True
        )

        if not result:
            raise ConcurrentModificationError("State changed by another agent")

        return result

    def get(self, key):
        """Get current value and version"""
        result = self.db.query(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "key": key
            },
            limit=1
        )

        if result:
            return result[0]["value"], result[0]["version"]
        return None, None

    def watch(self, key, callback):
        """Watch for changes (using QUIC change streams)"""
        self.db.watch(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "key": key
            },
            callback=callback
        )
```

### Consensus Mechanisms

```python
class ConsensusCoordinator:
    """Implement consensus protocols for multi-agent decisions"""

    def __init__(self, db, team_id):
        self.db = db
        self.team_id = team_id
        self.collection = "consensus_proposals"

    def propose(self, agent_id, proposal_id, proposal_data):
        """Submit a proposal"""
        self.db.insert(self.collection, {
            "team_id": self.team_id,
            "proposal_id": proposal_id,
            "proposer": agent_id,
            "data": proposal_data,
            "votes": {},
            "status": "pending",
            "created_at": datetime.utcnow().isoformat()
        })

    def vote(self, agent_id, proposal_id, vote):
        """Vote on a proposal (yes/no)"""
        self.db.update(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "proposal_id": proposal_id,
                "status": "pending"
            },
            update={
                "$set": {
                    f"votes.{agent_id}": vote
                }
            }
        )

    def check_consensus(self, proposal_id, required_votes):
        """Check if proposal reached consensus"""
        proposal = self.db.query(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "proposal_id": proposal_id
            },
            limit=1
        )[0]

        votes = proposal["votes"]
        yes_votes = sum(1 for v in votes.values() if v == "yes")

        if yes_votes >= required_votes:
            self.db.update(
                collection=self.collection,
                filter={"proposal_id": proposal_id},
                update={"$set": {"status": "approved"}}
            )
            return True

        return False
```

### Distributed Task Management

```python
class TaskQueue:
    """Distributed task queue for agent teams"""

    def __init__(self, db, team_id):
        self.db = db
        self.team_id = team_id
        self.collection = "task_queue"

    def enqueue(self, task_data, priority=0):
        """Add task to queue"""
        return self.db.insert(self.collection, {
            "team_id": self.team_id,
            "task": task_data,
            "priority": priority,
            "status": "pending",
            "assigned_to": None,
            "created_at": datetime.utcnow().isoformat()
        })

    def claim_task(self, agent_id):
        """Claim next available task (atomic)"""
        # Find highest priority pending task
        result = self.db.update(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "status": "pending"
            },
            update={
                "$set": {
                    "status": "in_progress",
                    "assigned_to": agent_id,
                    "claimed_at": datetime.utcnow().isoformat()
                }
            },
            sort=[("priority", "desc"), ("created_at", "asc")],
            limit=1
        )

        return result

    def complete_task(self, task_id, result):
        """Mark task as complete"""
        self.db.update(
            collection=self.collection,
            filter={"_id": task_id},
            update={
                "$set": {
                    "status": "completed",
                    "result": result,
                    "completed_at": datetime.utcnow().isoformat()
                }
            }
        )

    def release_stale_tasks(self, timeout_seconds=300):
        """Release tasks claimed but not completed"""
        cutoff = (datetime.utcnow() - timedelta(seconds=timeout_seconds)).isoformat()

        self.db.update_many(
            collection=self.collection,
            filter={
                "team_id": self.team_id,
                "status": "in_progress",
                "claimed_at": {"$lt": cutoff}
            },
            update={
                "$set": {
                    "status": "pending",
                    "assigned_to": None
                }
            }
        )
```

---

## 10. Setup & Configuration

### Installation

```bash
# Python client
pip install agentdb

# Node.js client
npm install agentdb-client

# Docker deployment
docker pull agentdb/agentdb:latest
docker run -d \
  -p 9090:9090 \
  -v agentdb_data:/data \
  -e AGENTDB_LICENSE_KEY=your_key \
  agentdb/agentdb:latest
```

### Connection & Authentication

```python
from agentdb import AgentDB, AuthConfig

# Basic connection
db = AgentDB("https://localhost:9090")

# With authentication
auth = AuthConfig(
    method="api_key",
    api_key="your_api_key"
)

db = AgentDB(
    "https://agentdb.example.com:9090",
    auth=auth,
    tls_verify=True
)

# Connection pooling
db = AgentDB(
    "https://agentdb.example.com:9090",
    pool_size=10,
    pool_timeout=5000  # ms
)
```

### Basic CRUD Operations

```python
# Create collection
db.create_collection(
    "my_collection",
    schema={
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "age": {"type": "integer"}
        }
    }
)

# Insert
doc_id = db.insert("my_collection", {
    "name": "Alice",
    "age": 30
})

# Query
results = db.query(
    collection="my_collection",
    filter={"age": {"$gte": 25}},
    limit=10
)

# Update
db.update(
    collection="my_collection",
    filter={"name": "Alice"},
    update={"$set": {"age": 31}}
)

# Delete
db.delete(
    collection="my_collection",
    filter={"name": "Alice"}
)

# Get by ID
doc = db.get("my_collection", doc_id)
```

### Configuration Best Practices

```python
# Development config
dev_db = AgentDB(
    "https://localhost:9090",
    pool_size=2,
    timeout=1000,
    retry_attempts=1
)

# Production config
prod_db = AgentDB(
    "https://agentdb-prod.example.com:9090",
    pool_size=20,
    timeout=5000,
    retry_attempts=3,
    tls_verify=True,
    compression=True,  # Enable QUIC compression
    keepalive_interval=10000  # ms
)

# Enable monitoring
prod_db.enable_metrics(
    endpoint="https://prometheus.example.com:9091",
    interval_seconds=10
)
```

---

## Common Patterns

### RAG Pipeline with AgentDB

```python
class RAGPipeline:
    def __init__(self, db, encoder, llm):
        self.db = db
        self.encoder = encoder
        self.llm = llm
        self.collection = "knowledge_base"

    def ingest(self, documents):
        """Index documents for retrieval"""
        for doc in documents:
            embedding = self.encoder.encode(doc["text"])
            self.db.insert(self.collection, {
                "text": doc["text"],
                "metadata": doc.get("metadata", {}),
                "vector": embedding.tolist()
            })

    def query(self, question, k=5):
        """Retrieve and generate answer"""
        # Retrieve relevant documents
        query_vector = self.encoder.encode(question)
        results = self.db.search(
            collection=self.collection,
            vector=query_vector.tolist(),
            limit=k
        )

        # Build context
        context = "\n\n".join([r.data["text"] for r in results])

        # Generate answer
        prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
        answer = self.llm.generate(prompt)

        return answer, results
```

### Agent Coordination Example

```python
# Initialize three agents sharing state
team_id = "team_alpha"
shared_state = SharedState(db, team_id)
task_queue = TaskQueue(db, team_id)

# Agent 1: Task creator
for i in range(10):
    task_queue.enqueue({"task_id": i, "work": f"Process item {i}"}, priority=i)

# Agent 2 & 3: Task workers
def agent_worker(agent_id):
    while True:
        task = task_queue.claim_task(agent_id)
        if not task:
            break

        # Do work
        result = process_task(task["task"])

        # Update shared state
        completed_count, version = shared_state.get("completed_count")
        shared_state.set("completed_count", (completed_count or 0) + 1, version)

        # Mark complete
        task_queue.complete_task(task["_id"], result)

# Run workers
import threading
threading.Thread(target=agent_worker, args=("agent_2",)).start()
threading.Thread(target=agent_worker, args=("agent_3",)).start()
```

---

## Troubleshooting

**Slow vector search**
- Check index type (HNSW for < 10M vectors, IVF for larger)
- Tune `ef_search` / `nprobe` parameters
- Enable compression for embeddings
- Use batch search for multiple queries

**High memory usage**
- Reduce HNSW `m` parameter
- Use quantization for vectors (int8 instead of float32)
- Clear working memory periodically
- Enable document TTL for short-term data

**Sync conflicts**
- Use optimistic locking (version field)
- Implement custom conflict resolver
- Increase `sync_interval_ms` for less critical data
- Use consensus for important decisions

**Connection timeouts**
- Increase `pool_size` for high concurrency
- Check network latency (QUIC requires UDP)
- Enable connection keepalive
- Use local replicas for read-heavy workloads

---

## Additional Resources

- AgentDB Documentation: https://docs.agentdb.io
- QUIC Protocol Spec: https://www.rfc-editor.org/rfc/rfc9000.html
- Vector Search Theory: https://arxiv.org/abs/1603.09320 (HNSW)
- Multi-Agent Systems: Wooldridge, "An Introduction to MultiAgent Systems"

