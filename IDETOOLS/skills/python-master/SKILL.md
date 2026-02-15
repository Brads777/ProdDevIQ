---
name: python-master
description: >
  Comprehensive Python guide covering design patterns, async programming,
  type safety, project structure, error handling, performance optimization,
  and anti-patterns to avoid. Consolidates 11 Python skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---
# ©2026 Brad Scheller

# Python Master Skill

Comprehensive Python development guide covering modern best practices, design patterns, async programming, type safety, and performance optimization.

## When to Use This Skill

Invoke this skill when:
- Developing Python applications (APIs, scripts, data pipelines)
- Building FastAPI or Flask backends
- Writing data processing scripts
- Implementing async/concurrent Python code
- Setting up Python project structure
- Optimizing Python performance
- Reviewing Python code for best practices

Keywords: "write Python", "FastAPI", "Flask", "async Python", "Python script", "data pipeline"

## 1. Project Structure

### Src Layout (Recommended for Libraries/Apps)

```
project/
├── pyproject.toml
├── README.md
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── main.py
│       ├── api/
│       │   ├── __init__.py
│       │   └── routes.py
│       ├── models/
│       │   ├── __init__.py
│       │   └── user.py
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_main.py
└── scripts/
    └── run_migration.py
```

### Flat Layout (Simple Scripts)

```
project/
├── pyproject.toml
├── main.py
├── config.py
├── utils.py
└── tests/
    └── test_main.py
```

### Modern pyproject.toml

```toml
[project]
name = "mypackage"
version = "0.1.0"
description = "My Python package"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.109.0",
    "pydantic>=2.0.0",
    "uvicorn[standard]>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "ruff>=0.1.0",
    "mypy>=1.8.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "A", "C4", "SIM"]
ignore = ["E501"]

[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

### Virtual Environment Setup

```bash
# Using venv (built-in)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Using uv (modern, fast)
uv venv
uv pip install -e ".[dev]"

# Using conda
conda create -n myenv python=3.10
conda activate myenv
```

## 2. Code Style & Conventions

### PEP 8 Essentials

```python
# Good: descriptive names, proper spacing
def calculate_user_score(user_id: int, metrics: dict[str, float]) -> float:
    total_score = 0.0
    for metric_name, value in metrics.items():
        total_score += value * METRIC_WEIGHTS.get(metric_name, 1.0)
    return total_score

# Bad: unclear names, cramped
def calc(u,m):
    t=0.0
    for k,v in m.items():t+=v*W.get(k,1.0)
    return t
```

### Import Organization

```python
# Standard library
import asyncio
import logging
from datetime import datetime
from pathlib import Path

# Third-party
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Local
from mypackage.config import settings
from mypackage.models.user import User
from mypackage.utils.helpers import format_response
```

### Naming Conventions

```python
# Constants: UPPER_SNAKE_CASE
MAX_RETRY_ATTEMPTS = 3
DATABASE_URL = "postgresql://localhost/db"

# Classes: PascalCase
class UserRepository:
    pass

# Functions/variables: snake_case
def fetch_user_data(user_id: int) -> dict:
    pass

# Private (internal): leading underscore
def _internal_helper():
    pass

# Type variables: PascalCase with T prefix
from typing import TypeVar
T = TypeVar('T')
UserT = TypeVar('UserT', bound='User')
```

### Ruff Configuration

```bash
# Format code
ruff format .

# Lint and auto-fix
ruff check --fix .

# Check types
mypy src/
```

## 3. Type Safety

### Modern Type Hints (Python 3.10+)

```python
from typing import Protocol, TypeVar, Generic
from collections.abc import Sequence, Callable

# Basic types
def greet(name: str, age: int | None = None) -> str:
    if age is not None:
        return f"Hello {name}, age {age}"
    return f"Hello {name}"

# Collections (Python 3.9+: list, dict, set instead of List, Dict, Set)
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Union types (Python 3.10+: use | instead of Union)
def parse_value(value: str | int | float) -> float:
    return float(value)

# Generic classes
T = TypeVar('T')

class Container(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value

    def get(self) -> T:
        return self.value

# Protocol (structural subtyping)
class Drawable(Protocol):
    def draw(self) -> str: ...

def render(obj: Drawable) -> None:
    print(obj.draw())
```

### Pydantic for Runtime Validation

```python
from pydantic import BaseModel, Field, validator
from datetime import datetime

class User(BaseModel):
    id: int
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    tags: list[str] = []

    @validator('email')
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()

# Usage
user = User(id=1, username="john", email="JOHN@EXAMPLE.COM")
print(user.email)  # "john@example.com"
print(user.model_dump())  # dict serialization
```

### Mypy Configuration

```ini
# mypy.ini or [tool.mypy] in pyproject.toml
[mypy]
python_version = 3.10
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_any_generics = true

# Per-module overrides
[mypy-tests.*]
disallow_untyped_defs = false
```

## 4. Design Patterns

### Factory Pattern

```python
from abc import ABC, abstractmethod

class DatabaseConnection(ABC):
    @abstractmethod
    def connect(self) -> None: ...

    @abstractmethod
    def query(self, sql: str) -> list[dict]: ...

class PostgresConnection(DatabaseConnection):
    def connect(self) -> None:
        print("Connecting to PostgreSQL")

    def query(self, sql: str) -> list[dict]:
        return [{"result": "postgres"}]

class MySQLConnection(DatabaseConnection):
    def connect(self) -> None:
        print("Connecting to MySQL")

    def query(self, sql: str) -> list[dict]:
        return [{"result": "mysql"}]

class DatabaseFactory:
    @staticmethod
    def create(db_type: str) -> DatabaseConnection:
        if db_type == "postgres":
            return PostgresConnection()
        elif db_type == "mysql":
            return MySQLConnection()
        raise ValueError(f"Unknown database type: {db_type}")

# Usage
db = DatabaseFactory.create("postgres")
db.connect()
```

### Strategy Pattern

```python
from typing import Protocol

class PaymentStrategy(Protocol):
    def pay(self, amount: float) -> str: ...

class CreditCardPayment:
    def __init__(self, card_number: str) -> None:
        self.card_number = card_number

    def pay(self, amount: float) -> str:
        return f"Paid ${amount} with card {self.card_number[-4:]}"

class PayPalPayment:
    def __init__(self, email: str) -> None:
        self.email = email

    def pay(self, amount: float) -> str:
        return f"Paid ${amount} via PayPal ({self.email})"

class PaymentProcessor:
    def __init__(self, strategy: PaymentStrategy) -> None:
        self.strategy = strategy

    def process(self, amount: float) -> str:
        return self.strategy.pay(amount)

# Usage
processor = PaymentProcessor(CreditCardPayment("1234-5678-9012-3456"))
print(processor.process(100.0))
```

### Repository Pattern

```python
from typing import Protocol
from dataclasses import dataclass

@dataclass
class User:
    id: int
    username: str
    email: str

class UserRepository(Protocol):
    def get_by_id(self, user_id: int) -> User | None: ...
    def save(self, user: User) -> None: ...
    def delete(self, user_id: int) -> None: ...

class InMemoryUserRepository:
    def __init__(self) -> None:
        self._users: dict[int, User] = {}

    def get_by_id(self, user_id: int) -> User | None:
        return self._users.get(user_id)

    def save(self, user: User) -> None:
        self._users[user.id] = user

    def delete(self, user_id: int) -> None:
        self._users.pop(user_id, None)

class PostgresUserRepository:
    def get_by_id(self, user_id: int) -> User | None:
        # Execute SQL query
        return User(id=user_id, username="john", email="john@example.com")

    def save(self, user: User) -> None:
        # Execute INSERT/UPDATE
        pass

    def delete(self, user_id: int) -> None:
        # Execute DELETE
        pass
```

### Dependency Injection (FastAPI Example)

```python
from fastapi import FastAPI, Depends
from typing import Annotated

app = FastAPI()

class Database:
    def query(self, sql: str) -> list[dict]:
        return [{"result": "data"}]

def get_database() -> Database:
    db = Database()
    try:
        yield db
    finally:
        # Cleanup
        pass

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    db: Annotated[Database, Depends(get_database)]
) -> dict:
    results = db.query(f"SELECT * FROM users WHERE id = {user_id}")
    return results[0]
```

### Context Managers

```python
from contextlib import contextmanager
from typing import Generator

@contextmanager
def file_transaction(filename: str) -> Generator[list[str], None, None]:
    # Setup
    with open(filename, 'r') as f:
        lines = f.readlines()

    temp_lines = lines.copy()

    try:
        yield temp_lines
        # Commit: write changes
        with open(filename, 'w') as f:
            f.writelines(temp_lines)
    except Exception:
        # Rollback: don't write
        raise

# Usage
with file_transaction('data.txt') as lines:
    lines.append('New line\n')
```

### Decorators

```python
import functools
import time
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec('P')
T = TypeVar('T')

def timing(func: Callable[P, T]) -> Callable[P, T]:
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def retry(max_attempts: int = 3):
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt + 1} failed: {e}")
            raise RuntimeError("Unreachable")
        return wrapper
    return decorator

@timing
@retry(max_attempts=3)
def fetch_data(url: str) -> dict:
    # Simulated API call
    return {"data": "value"}
```

## 5. Error Handling

### Exception Hierarchy

```python
class ApplicationError(Exception):
    """Base exception for application errors."""
    pass

class ValidationError(ApplicationError):
    """Raised when validation fails."""
    pass

class NotFoundError(ApplicationError):
    """Raised when a resource is not found."""
    def __init__(self, resource: str, identifier: str | int) -> None:
        self.resource = resource
        self.identifier = identifier
        super().__init__(f"{resource} not found: {identifier}")

class DatabaseError(ApplicationError):
    """Raised when database operations fail."""
    pass

# Usage
def get_user(user_id: int) -> dict:
    if user_id < 0:
        raise ValidationError("User ID must be positive")

    user = db.query(f"SELECT * FROM users WHERE id = {user_id}")
    if not user:
        raise NotFoundError("User", user_id)

    return user
```

### When to Catch vs Propagate

```python
# DON'T catch and ignore
def bad_example():
    try:
        risky_operation()
    except Exception:
        pass  # Silent failure!

# DO: Let it propagate if you can't handle it
def good_example():
    # No try/except — let caller decide
    risky_operation()

# DO: Catch specific exceptions and handle them
def handle_specific():
    try:
        user = fetch_user(user_id)
    except NotFoundError:
        return default_user()
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise

# DO: Catch at system boundaries (API endpoints)
from fastapi import HTTPException

@app.get("/users/{user_id}")
async def get_user_endpoint(user_id: int) -> dict:
    try:
        return get_user(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Logging Errors

```python
import logging

logger = logging.getLogger(__name__)

def process_data(data: dict) -> dict:
    try:
        result = transform(data)
        logger.info(f"Processed data for key {data.get('id')}")
        return result
    except KeyError as e:
        logger.error(f"Missing required key: {e}", exc_info=True)
        raise ValidationError(f"Missing key: {e}")
    except Exception as e:
        logger.exception(f"Unexpected error processing data: {e}")
        raise
```

## 6. Async Programming

### Asyncio Fundamentals

```python
import asyncio
import httpx

async def fetch_url(url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.text

async def main():
    # Sequential
    result1 = await fetch_url("https://example.com")
    result2 = await fetch_url("https://example.org")

    # Parallel
    results = await asyncio.gather(
        fetch_url("https://example.com"),
        fetch_url("https://example.org"),
        fetch_url("https://example.net")
    )
    print(f"Fetched {len(results)} URLs")

# Run
asyncio.run(main())
```

### Async Context Managers

```python
class AsyncDatabaseConnection:
    async def __aenter__(self):
        print("Connecting to database")
        await asyncio.sleep(0.1)  # Simulate connection
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection")
        await asyncio.sleep(0.1)  # Simulate cleanup

    async def query(self, sql: str) -> list[dict]:
        await asyncio.sleep(0.05)
        return [{"result": "data"}]

async def get_data():
    async with AsyncDatabaseConnection() as db:
        results = await db.query("SELECT * FROM users")
        return results
```

### FastAPI Async Endpoints

```python
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/sync-endpoint")
def sync_endpoint() -> dict:
    # Blocks event loop — avoid for I/O
    time.sleep(1)
    return {"status": "done"}

@app.get("/async-endpoint")
async def async_endpoint() -> dict:
    # Non-blocking I/O
    await asyncio.sleep(1)
    return {"status": "done"}

@app.get("/parallel-fetch")
async def parallel_fetch() -> dict:
    results = await asyncio.gather(
        fetch_url("https://api1.example.com/data"),
        fetch_url("https://api2.example.com/data"),
        fetch_url("https://api3.example.com/data")
    )
    return {"results": results}
```

### Common Async Pitfalls

```python
# WRONG: Blocking call in async function
async def bad_async():
    time.sleep(1)  # Blocks entire event loop!
    return "done"

# RIGHT: Use async-compatible libraries
async def good_async():
    await asyncio.sleep(1)
    return "done"

# WRONG: Forgetting await
async def forgot_await():
    result = fetch_url("https://example.com")  # Returns coroutine, not result!
    return result

# RIGHT: Always await coroutines
async def proper_await():
    result = await fetch_url("https://example.com")
    return result
```

## 7. Resource Management

### File Handling with Context Managers

```python
# Always use context managers for files
with open('data.txt', 'r') as f:
    content = f.read()

# Multiple files
with open('input.txt', 'r') as infile, open('output.txt', 'w') as outfile:
    for line in infile:
        outfile.write(line.upper())
```

### Connection Pooling

```python
from contextlib import contextmanager
import threading

class ConnectionPool:
    def __init__(self, max_connections: int = 10) -> None:
        self._pool: list[Connection] = []
        self._max_connections = max_connections
        self._lock = threading.Lock()

    @contextmanager
    def get_connection(self):
        conn = self._acquire()
        try:
            yield conn
        finally:
            self._release(conn)

    def _acquire(self) -> Connection:
        with self._lock:
            if self._pool:
                return self._pool.pop()
            return Connection()

    def _release(self, conn: Connection) -> None:
        with self._lock:
            if len(self._pool) < self._max_connections:
                self._pool.append(conn)

# Usage
pool = ConnectionPool()
with pool.get_connection() as conn:
    conn.execute("SELECT * FROM users")
```

### Graceful Shutdown

```python
import signal
import sys

class Application:
    def __init__(self) -> None:
        self.running = True
        signal.signal(signal.SIGINT, self._shutdown)
        signal.signal(signal.SIGTERM, self._shutdown)

    def _shutdown(self, signum, frame) -> None:
        print("Shutting down gracefully...")
        self.running = False
        # Close connections, flush buffers, etc.
        sys.exit(0)

    def run(self) -> None:
        while self.running:
            self._process_batch()

    def _process_batch(self) -> None:
        pass

app = Application()
app.run()
```

## 8. Performance Optimization

### Profiling

```python
import cProfile
import pstats

def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()

    # Code to profile
    expensive_operation()

    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)

# Line-by-line profiling (requires line_profiler package)
# @profile decorator, then run: kernprof -l -v script.py
```

### Data Structure Selection

```python
# Good: O(1) lookup
user_ids = {1, 2, 3, 4, 5}
if user_id in user_ids:  # Fast
    pass

# Bad: O(n) lookup
user_ids_list = [1, 2, 3, 4, 5]
if user_id in user_ids_list:  # Slow for large lists
    pass

# Good: Dict for key-value lookups
user_cache = {user.id: user for user in users}
user = user_cache.get(user_id)

# Good: Use sets for deduplication
unique_tags = set(all_tags)
```

### Generator Expressions

```python
# Bad: Loads entire list into memory
sum([x * x for x in range(10_000_000)])

# Good: Generates values on-demand
sum(x * x for x in range(10_000_000))

# Generator function
def read_large_file(file_path: str):
    with open(file_path) as f:
        for line in f:
            yield line.strip()

for line in read_large_file('huge.txt'):
    process(line)
```

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# TTL cache (requires cachetools)
from cachetools import TTLCache, cached

cache = TTLCache(maxsize=100, ttl=300)

@cached(cache)
def fetch_user_data(user_id: int) -> dict:
    # Expensive API call
    return {"id": user_id, "name": "John"}
```

### Parallelism

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O-bound: Use threads
def fetch_all_urls(urls: list[str]) -> list[str]:
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(fetch_url_sync, urls))
    return results

# CPU-bound: Use processes
def process_images(images: list[str]) -> list[bytes]:
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(transform_image, images))
    return results
```

## 9. Background Jobs

### Threading vs Multiprocessing vs Async

```python
# Threading: I/O-bound tasks (network, file I/O)
import threading

def worker():
    while True:
        task = queue.get()
        process_task(task)
        queue.task_done()

threads = [threading.Thread(target=worker, daemon=True) for _ in range(5)]
for t in threads:
    t.start()

# Multiprocessing: CPU-bound tasks (image processing, ML)
from multiprocessing import Process, Queue

def cpu_worker(queue: Queue):
    while True:
        task = queue.get()
        if task is None:
            break
        result = expensive_computation(task)
        queue.put(result)

# Async: High-concurrency I/O (thousands of connections)
async def async_worker():
    while True:
        task = await task_queue.get()
        await process_task_async(task)
```

### Simple Job Queue

```python
import queue
import threading
from typing import Callable

class JobQueue:
    def __init__(self, num_workers: int = 3) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._workers = [
            threading.Thread(target=self._worker, daemon=True)
            for _ in range(num_workers)
        ]
        for w in self._workers:
            w.start()

    def _worker(self) -> None:
        while True:
            func, args, kwargs = self._queue.get()
            try:
                func(*args, **kwargs)
            finally:
                self._queue.task_done()

    def enqueue(self, func: Callable, *args, **kwargs) -> None:
        self._queue.put((func, args, kwargs))

    def wait(self) -> None:
        self._queue.join()

# Usage
jobs = JobQueue(num_workers=5)
jobs.enqueue(send_email, "user@example.com", "Hello")
jobs.wait()
```

## 10. Anti-Patterns to Avoid

### Mutable Default Arguments

```python
# WRONG: Default list is shared across calls
def bad_function(items=[]):
    items.append(1)
    return items

bad_function()  # [1]
bad_function()  # [1, 1] — BUG!

# RIGHT: Use None and create new list
def good_function(items=None):
    if items is None:
        items = []
    items.append(1)
    return items
```

### Bare Except Clauses

```python
# WRONG: Catches everything, including KeyboardInterrupt
try:
    risky_operation()
except:
    pass

# RIGHT: Catch specific exceptions
try:
    risky_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
except KeyError as e:
    logger.error(f"Missing key: {e}")
```

### God Classes

```python
# WRONG: Class does everything
class UserManager:
    def create_user(self): pass
    def delete_user(self): pass
    def send_email(self): pass
    def charge_payment(self): pass
    def generate_report(self): pass

# RIGHT: Single responsibility
class UserRepository:
    def create(self, user: User) -> None: pass
    def delete(self, user_id: int) -> None: pass

class EmailService:
    def send(self, to: str, subject: str, body: str) -> None: pass

class PaymentService:
    def charge(self, user_id: int, amount: float) -> None: pass
```

### String Concatenation in Loops

```python
# WRONG: Quadratic time complexity
result = ""
for item in items:
    result += str(item) + ","

# RIGHT: Use join
result = ",".join(str(item) for item in items)
```

### Ignoring Return Values

```python
# WRONG: Ignoring important return values
list.sort()  # Returns None, sorts in-place
new_list = my_list.sort()  # new_list is None!

# RIGHT: Understand in-place vs new object
my_list.sort()  # In-place
new_list = sorted(my_list)  # Returns new list
```

## Summary

This skill consolidates Python best practices into one reference:

1. **Project Structure** — Use src layout for apps, pyproject.toml for dependencies
2. **Code Style** — Follow PEP 8, use Ruff for linting/formatting
3. **Type Safety** — Use type hints everywhere, Pydantic for validation, mypy for checking
4. **Design Patterns** — Factory, Strategy, Repository, Dependency Injection
5. **Error Handling** — Custom exceptions, catch at boundaries, log properly
6. **Async Programming** — asyncio.gather for parallelism, avoid blocking calls
7. **Resource Management** — Context managers, connection pooling, graceful shutdown
8. **Performance** — Profile first, use appropriate data structures, cache when useful
9. **Background Jobs** — Choose threading/multiprocessing/async based on workload type
10. **Anti-Patterns** — Avoid mutable defaults, bare excepts, god classes, string concat in loops

Use this as a reference when writing or reviewing Python code.
