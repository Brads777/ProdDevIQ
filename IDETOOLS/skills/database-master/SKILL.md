---
name: database-master
description: >
  Comprehensive database guide covering schema design, PostgreSQL best practices,
  migrations, NoSQL patterns, query optimization, and cloud database services
  (Neon, Supabase). Consolidates 13 database skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Database Master Skill

Comprehensive database reference covering schema design, PostgreSQL best practices, migrations, NoSQL patterns, query optimization, and cloud database services. Consolidates expertise from 13 specialized database skills.

## When to Use This Skill

Use this skill when:
- Designing database schemas and data models
- Setting up PostgreSQL, SQLite, MongoDB, or Redis
- Writing and optimizing SQL queries
- Implementing database migrations (Prisma, Drizzle, raw SQL)
- Choosing between SQL and NoSQL databases
- Working with cloud database services (Neon, Supabase, PlanetScale)
- Debugging slow queries and performance issues
- Implementing full-text search, JSONB queries, or geospatial features
- Setting up multi-tenancy, audit trails, or soft deletes
- Configuring connection pooling and replication

## Database Selection Guide

### PostgreSQL (Default Choice)
**Best for:** Most web applications, SaaS platforms, e-commerce, CRM, analytics

**Strengths:**
- ACID transactions with strong consistency
- Rich data types (JSONB, arrays, ranges, full-text search)
- Advanced features (CTEs, window functions, materialized views)
- Mature ecosystem and extensive tooling
- Excellent performance with proper indexing
- JSON/JSONB for semi-structured data

**Use when:** You need relational integrity, complex queries, or aren't sure which to use

### SQLite
**Best for:** Prototyping, embedded applications, local-first apps, testing

**Strengths:**
- Zero configuration, single file
- Excellent for development and testing
- Fast reads, low latency
- Cross-platform, reliable

**Use when:** Building prototypes, small apps, or need embedded database

### MongoDB
**Best for:** Document stores, content management, catalogs, real-time analytics

**Strengths:**
- Flexible schema evolution
- Natural JSON document model
- Horizontal scaling via sharding
- High write throughput

**Use when:** Schema changes frequently, data is document-centric, need horizontal scaling

### Redis
**Best for:** Caching, sessions, pub/sub, rate limiting, leaderboards

**Strengths:**
- In-memory speed (microsecond latency)
- Rich data structures (strings, lists, sets, sorted sets, hashes)
- Persistence options
- Pub/sub messaging

**Use when:** Need caching layer, session storage, or real-time features

## Schema Design Principles

### Normalization

**First Normal Form (1NF):** Atomic values, no repeating groups
```sql
-- Bad: Repeating groups
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  phone1 TEXT,
  phone2 TEXT,
  phone3 TEXT
);

-- Good: Separate table for multi-valued attributes
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE user_phones (
  user_id BIGINT REFERENCES users(id),
  phone TEXT NOT NULL,
  type TEXT CHECK (type IN ('home', 'mobile', 'work')),
  PRIMARY KEY (user_id, phone)
);
CREATE INDEX ON user_phones(user_id);
```

**Second Normal Form (2NF):** No partial dependencies on composite keys
```sql
-- Bad: Partial dependency
CREATE TABLE order_items (
  order_id BIGINT,
  product_id BIGINT,
  product_name TEXT,  -- Depends only on product_id
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- Good: Separate product table
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE order_items (
  order_id BIGINT REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
```

**Third Normal Form (3NF):** No transitive dependencies
```sql
-- Bad: Transitive dependency
CREATE TABLE employees (
  id BIGINT PRIMARY KEY,
  name TEXT,
  department_id BIGINT,
  department_name TEXT  -- Depends on department_id, not directly on employee id
);

-- Good: Separate department table
CREATE TABLE departments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE employees (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  department_id BIGINT REFERENCES departments(id)
);
CREATE INDEX ON employees(department_id);
```

**When to Denormalize:**
- Proven performance bottleneck (measure first!)
- Read-heavy workload where joins are expensive
- Reporting/analytics queries that aggregate frequently
- Acceptable trade-off: faster reads for slower writes and maintenance burden

### Primary Keys

**BIGINT GENERATED ALWAYS AS IDENTITY (Recommended Default):**
```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);
```

**UUID (Use for distributed systems, opaque IDs, or federation):**
```sql
-- PostgreSQL 18+ with uuid7 (time-ordered)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- or uuidv7() in PG18+
  user_id BIGINT REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL
);
```

**Natural Keys (Use for lookup/reference tables):**
```sql
CREATE TABLE countries (
  code TEXT PRIMARY KEY CHECK (LENGTH(code) = 2),  -- ISO 3166-1 alpha-2
  name TEXT NOT NULL
);
```

### Foreign Keys and Referential Integrity

Always specify `ON DELETE` and `ON UPDATE` actions:

```sql
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRITICAL: PostgreSQL does NOT auto-index FK columns
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(created_at);
```

**Cascade Options:**
- `CASCADE`: Delete/update child rows when parent is deleted/updated
- `RESTRICT`: Prevent deletion if children exist (default)
- `SET NULL`: Set child FK to NULL
- `SET DEFAULT`: Set child FK to default value

### Indexes

**B-tree Index (Default):**
Use for equality and range queries, sorting.

```sql
-- Single column
CREATE INDEX ON users(email);

-- Composite index (order matters!)
-- Supports: WHERE user_id = ? AND status = ?
-- Also supports: WHERE user_id = ?
-- Does NOT support: WHERE status = ? (only)
CREATE INDEX ON orders(user_id, status);

-- Covering index (index-only scan)
CREATE INDEX ON orders(user_id) INCLUDE (created_at, total);
```

**Partial Index:**
Index a subset of rows for hot queries.

```sql
-- Only index active users
CREATE INDEX ON users(email) WHERE status = 'active';

-- Only index recent orders
CREATE INDEX ON orders(user_id) WHERE created_at > NOW() - INTERVAL '90 days';
```

**Expression Index:**
Index computed values.

```sql
-- Case-insensitive email lookups
CREATE INDEX ON users(LOWER(email));

-- Then query with:
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

**GIN Index:**
For JSONB, arrays, full-text search.

```sql
-- JSONB containment queries
CREATE INDEX ON events USING GIN(metadata);

-- Array containment
CREATE INDEX ON posts USING GIN(tags);

-- Full-text search
CREATE INDEX ON articles USING GIN(to_tsvector('english', title || ' ' || body));
```

**GiST Index:**
For ranges, geometry, exclusion constraints.

```sql
-- Prevent overlapping room bookings
CREATE TABLE bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id BIGINT NOT NULL,
  booking_period TSTZRANGE NOT NULL,
  EXCLUDE USING gist (room_id WITH =, booking_period WITH &&)
);
```

**BRIN Index:**
For very large, naturally ordered tables (e.g., time-series).

```sql
-- Minimal storage for time-series data
CREATE INDEX ON logs USING BRIN(created_at);
```

## PostgreSQL Best Practices

### Data Types

**Recommended Types:**
```sql
CREATE TABLE best_practices_example (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Strings: use TEXT, not VARCHAR(n)
  name TEXT NOT NULL,
  bio TEXT,

  -- Constrain length with CHECK if needed
  username TEXT NOT NULL UNIQUE CHECK (LENGTH(username) BETWEEN 3 AND 30),

  -- Timestamps: use TIMESTAMPTZ (with timezone), not TIMESTAMP
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Money: use NUMERIC, never float
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),

  -- Booleans
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- JSON: use JSONB, not JSON (unless key order matters)
  metadata JSONB NOT NULL DEFAULT '{}',

  -- Arrays
  tags TEXT[] NOT NULL DEFAULT '{}',

  -- Enums (for stable, small sets)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX ON best_practices_example(created_at);
CREATE INDEX ON best_practices_example USING GIN(metadata);
CREATE INDEX ON best_practices_example USING GIN(tags);
```

**Avoid These Types:**
- `TIMESTAMP` (without timezone) → use `TIMESTAMPTZ`
- `VARCHAR(n)` → use `TEXT` with `CHECK` constraint if needed
- `CHAR(n)` → use `TEXT`
- `MONEY` → use `NUMERIC`
- `SERIAL` → use `GENERATED ALWAYS AS IDENTITY`

### JSONB Usage

JSONB is great for optional, semi-structured attributes. Keep relational data in columns.

```sql
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,  -- Core attribute: column

  -- Optional/variable attributes: JSONB
  specs JSONB NOT NULL DEFAULT '{}'
);

-- Index for containment queries
CREATE INDEX ON products USING GIN(specs);

-- Extract frequently queried fields
ALTER TABLE products ADD COLUMN brand TEXT GENERATED ALWAYS AS (specs->>'brand') STORED;
CREATE INDEX ON products(brand);

-- Query examples
SELECT * FROM products WHERE specs @> '{"color": "red"}';
SELECT * FROM products WHERE specs ? 'waterproof';
SELECT * FROM products WHERE brand = 'Sony';
```

### Full-Text Search

```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector TSVECTOR
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;

CREATE INDEX ON articles USING GIN(search_vector);

-- Search query
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgres & performance');

-- Rank results
SELECT *, ts_rank(search_vector, to_tsquery('english', 'postgres & performance')) AS rank
FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgres & performance')
ORDER BY rank DESC;
```

### Row-Level Security

Built-in user-based access control.

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own orders
CREATE POLICY user_orders ON orders
  FOR SELECT
  TO app_user
  USING (user_id = current_setting('app.user_id')::BIGINT);

-- Set user context in application
SET app.user_id = '42';
```

## Query Optimization

### EXPLAIN ANALYZE

Understand query execution plans.

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name;
```

**Key Metrics:**
- **Seq Scan**: Full table scan (slow for large tables)
- **Index Scan**: Using index (good)
- **Index Only Scan**: Using index without table lookup (best)
- **Nested Loop**: Join method (okay for small datasets)
- **Hash Join**: Join method (good for larger datasets)
- **Cost**: Estimated cost (lower is better)
- **Actual Time**: Real execution time

### N+1 Query Problem

```sql
-- Bad: N+1 queries (1 for users, N for orders)
-- SELECT * FROM users;
-- For each user: SELECT * FROM orders WHERE user_id = ?

-- Good: Single query with JOIN
SELECT u.*, o.id as order_id, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Or use batch loading
SELECT * FROM orders WHERE user_id IN (1, 2, 3, 4, 5);
```

### Pagination

```sql
-- Bad: OFFSET on large tables
SELECT * FROM users ORDER BY created_at DESC LIMIT 20 OFFSET 100000;  -- Very slow!

-- Good: Cursor-based pagination
SELECT * FROM users
WHERE created_at < '2024-01-15 10:30:00'  -- Last cursor
ORDER BY created_at DESC
LIMIT 20;

-- Index for cursor pagination
CREATE INDEX ON users(created_at DESC, id DESC);
```

### Common Anti-Patterns

```sql
-- Anti-pattern: Function in WHERE prevents index usage
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Solution: Expression index
CREATE INDEX ON users(LOWER(email));

-- Anti-pattern: LIKE with leading wildcard
SELECT * FROM users WHERE email LIKE '%@example.com';  -- Can't use index

-- Solution: Full-text search or trigram index
CREATE EXTENSION pg_trgm;
CREATE INDEX ON users USING GIN(email gin_trgm_ops);

-- Anti-pattern: OR conditions
SELECT * FROM users WHERE status = 'active' OR status = 'pending';

-- Solution: Use IN or UNION
SELECT * FROM users WHERE status IN ('active', 'pending');
```

## Migrations

### Prisma Migrations

```prisma
// schema.prisma
model User {
  id        BigInt   @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  orders    Order[]

  @@index([createdAt])
  @@map("users")
}

model Order {
  id        BigInt   @id @default(autoincrement())
  userId    BigInt   @map("user_id")
  total     Decimal  @db.Decimal(10, 2)
  status    String   @default("pending")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("orders")
}
```

```bash
# Generate migration
npx prisma migrate dev --name add_orders_table

# Apply to production
npx prisma migrate deploy
```

### Drizzle Migrations

```typescript
// schema.ts
import { pgTable, bigint, text, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  createdAtIdx: index().on(table.createdAt),
}));

export const orders = pgTable('orders', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index().on(table.userId),
  createdAtIdx: index().on(table.createdAt),
}));
```

```bash
# Generate migration
npx drizzle-kit generate:pg

# Apply migration
npx drizzle-kit push:pg
```

### Raw SQL Migrations

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON users(created_at);
```

### Zero-Downtime Migration Strategies

**Adding a column with default:**
```sql
-- Step 1: Add column with default (fast in PG 11+)
ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Step 2: Backfill in batches (optional, if complex logic needed)
UPDATE users SET status = 'inactive' WHERE last_login < NOW() - INTERVAL '1 year';
```

**Renaming a column (zero downtime):**
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name TEXT;

-- Step 2: Backfill data
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Step 3: Deploy code that writes to both columns

-- Step 4: Make new column NOT NULL
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- Step 5: Deploy code that reads from new column

-- Step 6: Drop old column
ALTER TABLE users DROP COLUMN name;
```

## Cloud Database Services

### Neon (Serverless PostgreSQL)

**Features:**
- Serverless: automatic scaling, pay-per-use
- Database branching: instant copies for dev/staging
- Generous free tier: 0.5 GB storage, 3 GiB data transfer
- Point-in-time restore

**Connection:**
```bash
# Connection string format
postgresql://user:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require

# Environment variable
DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require"
```

**Best for:** SaaS apps, preview environments, prototyping

### Supabase (PostgreSQL + Auth + Realtime + Storage)

**Features:**
- Managed PostgreSQL with extensions
- Built-in authentication (JWT, OAuth providers)
- Realtime subscriptions (Postgres CDC)
- File storage (S3-compatible)
- Row-level security
- Auto-generated REST and GraphQL APIs

**Connection:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key'
);

// Query with RLS
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId);

// Realtime subscription
supabase
  .channel('orders')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
    console.log('New order:', payload.new);
  })
  .subscribe();
```

**Best for:** SaaS apps needing auth + database, real-time features, rapid prototyping

### PlanetScale (MySQL-Compatible)

**Features:**
- Branching workflow (like Git for databases)
- Non-blocking schema changes
- Horizontal sharding
- Query insights and analytics

**Best for:** MySQL users, apps needing horizontal scaling

## NoSQL Patterns

### MongoDB Document Modeling

**Embedding (1-to-Few):**
```javascript
// Good for small, bounded arrays
{
  _id: ObjectId("..."),
  name: "Alice",
  addresses: [
    { type: "home", street: "123 Main St", city: "Portland" },
    { type: "work", street: "456 Oak Ave", city: "Portland" }
  ]
}
```

**Referencing (1-to-Many, Many-to-Many):**
```javascript
// Users collection
{ _id: ObjectId("user1"), name: "Alice" }

// Orders collection (reference user)
{
  _id: ObjectId("order1"),
  user_id: ObjectId("user1"),
  total: 99.99,
  items: [...]
}
```

**When to Embed vs Reference:**
- Embed: Data accessed together, bounded size, infrequent updates
- Reference: Data accessed independently, unbounded growth, frequent updates

### Redis Patterns

**Caching:**
```bash
# Set with expiration
SET user:42:profile '{"name":"Alice","email":"alice@example.com"}' EX 3600

# Get
GET user:42:profile

# Delete
DEL user:42:profile
```

**Rate Limiting:**
```bash
# Sliding window rate limit (10 requests per minute)
INCR rate:user:42:2024-02-14:12:30
EXPIRE rate:user:42:2024-02-14:12:30 60
```

**Leaderboards:**
```bash
# Add score
ZADD leaderboard 1500 "user:42"

# Get top 10
ZREVRANGE leaderboard 0 9 WITHSCORES

# Get user rank
ZREVRANK leaderboard "user:42"
```

## ORM & Query Builders

### Prisma (Recommended for TypeScript)

**Strengths:**
- Type-safe queries
- Schema-first approach
- Automatic migrations
- Excellent IDE support

```typescript
// Create
const user = await prisma.user.create({
  data: { email: 'alice@example.com', name: 'Alice' }
});

// Read with relations
const userWithOrders = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
  include: { orders: true }
});

// Update
await prisma.user.update({
  where: { id: 42 },
  data: { name: 'Alice Smith' }
});

// Delete
await prisma.user.delete({ where: { id: 42 } });
```

### Drizzle (Lightweight, SQL-like)

**Strengths:**
- SQL-like syntax
- Zero dependencies
- Excellent performance
- Type-safe

```typescript
import { db } from './db';
import { users, orders } from './schema';
import { eq } from 'drizzle-orm';

// Create
await db.insert(users).values({ email: 'alice@example.com', name: 'Alice' });

// Read with join
const result = await db
  .select()
  .from(users)
  .leftJoin(orders, eq(users.id, orders.userId))
  .where(eq(users.email, 'alice@example.com'));

// Update
await db.update(users).set({ name: 'Alice Smith' }).where(eq(users.id, 42));

// Delete
await db.delete(users).where(eq(users.id, 42));
```

## Common Patterns

### Soft Deletes

```sql
CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Partial index for active posts only
CREATE INDEX ON posts(created_at) WHERE deleted_at IS NULL;

-- Soft delete
UPDATE posts SET deleted_at = now() WHERE id = 42;

-- Query active posts
SELECT * FROM posts WHERE deleted_at IS NULL;
```

### Audit Trails

```sql
CREATE TABLE audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id BIGINT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by BIGINT REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON audit_log(table_name, record_id);
CREATE INDEX ON audit_log(changed_at);

-- Trigger function
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER users_audit AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_changes();
```

### Timestamps (created_at, updated_at)

```sql
CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### Multi-Tenancy

**Shared Database, Separate Schemas:**
```sql
-- Create tenant schema
CREATE SCHEMA tenant_acme;
CREATE SCHEMA tenant_globex;

-- Create tables in each schema
CREATE TABLE tenant_acme.users (id BIGINT PRIMARY KEY, ...);
CREATE TABLE tenant_globex.users (id BIGINT PRIMARY KEY, ...);

-- Set search path per connection
SET search_path TO tenant_acme;
SELECT * FROM users;  -- Queries tenant_acme.users
```

**Shared Database, Shared Schema with tenant_id:**
```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  UNIQUE (tenant_id, email)
);

CREATE INDEX ON users(tenant_id);

-- Row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id')::BIGINT);

-- Set tenant context in application
SET app.tenant_id = '42';
```

### Cursor Pagination

```sql
-- Schema
CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON posts(created_at DESC, id DESC);

-- First page
SELECT * FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page (cursor = last row's created_at and id)
SELECT * FROM posts
WHERE (created_at, id) < ('2024-02-10 12:00:00+00', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

## Connection Pooling

### PgBouncer

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

**Application connection string:**
```
postgresql://user:password@localhost:6432/mydb
```

**Pool Modes:**
- `session`: Connection held for entire session (most compatible)
- `transaction`: Connection released after transaction (recommended)
- `statement`: Connection released after statement (fast, limited compatibility)

## Resources

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Prisma Documentation**: https://www.prisma.io/docs
- **Drizzle Documentation**: https://orm.drizzle.team/
- **Neon Documentation**: https://neon.tech/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Use The Index, Luke**: https://use-the-index-luke.com/
- **PostgreSQL Wiki**: https://wiki.postgresql.org/

## Quick Reference

**Common psql Commands:**
```bash
\l                    # List databases
\c dbname             # Connect to database
\dt                   # List tables
\d tablename          # Describe table
\di                   # List indexes
\du                   # List users
\q                    # Quit
```

**Useful Queries:**
```sql
-- Table size
SELECT pg_size_pretty(pg_total_relation_size('tablename'));

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Find missing indexes (high seq_scan/seq_tup_read ratio)
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 10;

-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE '%pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```
