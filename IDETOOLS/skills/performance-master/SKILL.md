---
name: performance-master
description: >
  Comprehensive performance optimization guide covering web vitals, profiling,
  Python optimization, database tuning, and production monitoring.
  Consolidates 6 performance skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Performance Master

Comprehensive performance optimization guide covering web vitals, profiling, Python optimization, database tuning, and production monitoring.

## When to Use This Skill

### Trigger Scenarios
- User reports slow application performance
- Page load times exceed 3 seconds
- Core Web Vitals failing (LCP > 2.5s, FID > 100ms, CLS > 0.1)
- Database queries timing out
- API response times degrading
- High memory usage or CPU spikes
- User explicitly requests "optimize this" or "make it faster"
- Production performance monitoring alerts
- Performance audit before launch
- Scaling issues under load

### Context Detection
```
User: "The dashboard is loading slowly"
User: "Can you optimize the performance?"
User: "Lighthouse score is 45"
User: "Why is this Python script taking so long?"
User: "Database queries are slow"
User: "Users are experiencing lag"
```

### Pre-Flight Checks
1. **Establish baseline metrics** — measure before optimizing
2. **Identify bottleneck** — don't guess, profile and measure
3. **Set performance budget** — define acceptable thresholds
4. **Prioritize user impact** — optimize user-facing paths first

## Web Performance

### Core Web Vitals

**Largest Contentful Paint (LCP)** — main content render time
- **Good:** < 2.5s
- **Needs Improvement:** 2.5s - 4.0s
- **Poor:** > 4.0s

**Optimization strategies:**
```typescript
// 1. Preload critical resources
<link rel="preload" href="/hero-image.jpg" as="image">
<link rel="preload" href="/critical.css" as="style">

// 2. Optimize images
<img
  src="/image.jpg"
  srcset="/image-320w.jpg 320w, /image-640w.jpg 640w"
  sizes="(max-width: 600px) 320px, 640px"
  loading="eager"  // for above-fold images
  fetchpriority="high"
/>

// 3. Server-side render critical content
// Use Next.js SSR/SSG for hero sections
export async function getServerSideProps() {
  return { props: { heroData } }
}
```

**First Input Delay (FID)** — interactivity delay
- **Good:** < 100ms
- **Needs Improvement:** 100ms - 300ms
- **Poor:** > 300ms

**Optimization strategies:**
```typescript
// 1. Split long tasks
function processLargeArray(items) {
  const batchSize = 100
  let index = 0

  function processBatch() {
    const batch = items.slice(index, index + batchSize)
    batch.forEach(item => heavyOperation(item))
    index += batchSize

    if (index < items.length) {
      requestIdleCallback(processBatch)  // yield to browser
    }
  }
  processBatch()
}

// 2. Defer non-critical JavaScript
<script defer src="/analytics.js"></script>
<script type="module" src="/main.js"></script>

// 3. Use web workers for heavy computation
const worker = new Worker('/heavy-compute.worker.js')
worker.postMessage({ data: largeDataset })
```

**Cumulative Layout Shift (CLS)** — visual stability
- **Good:** < 0.1
- **Needs Improvement:** 0.1 - 0.25
- **Poor:** > 0.25

**Optimization strategies:**
```css
/* 1. Reserve space for images */
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

/* 2. Reserve space for ads/embeds */
.ad-container {
  min-height: 250px;
}

/* 3. Avoid injecting content above existing content */
/* Load skeletons instead of dynamic inserts */
```

### Lighthouse Auditing

```bash
# CLI audit
npx lighthouse https://example.com --view

# Performance budget
# lighthouse.config.js
module.exports = {
  ci: {
    collect: { numberOfRuns: 3 },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      }
    }
  }
}
```

### Bundle Analysis

```bash
# Next.js
npm install @next/bundle-analyzer
# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})

# Webpack
npm install webpack-bundle-analyzer
# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
plugins: [new BundleAnalyzerPlugin()]

# Vite
npm install rollup-plugin-visualizer
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [visualizer({ open: true })]
```

### Lazy Loading

```typescript
// React component lazy loading
import { lazy, Suspense } from 'react'
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  )
}

// Route-based code splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./Dashboard')),
  },
  {
    path: '/reports',
    component: lazy(() => import('./Reports')),
  },
]

// Image lazy loading
<img src="/image.jpg" loading="lazy" alt="Description" />

// Intersection Observer for custom lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
})
```

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  priority  // for LCP images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  alt="Hero image"
/>

// Modern formats with fallback
<picture>
  <source srcset="/image.avif" type="image/avif" />
  <source srcset="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" />
</picture>

// Responsive images
<img
  srcset="
    /small.jpg 400w,
    /medium.jpg 800w,
    /large.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  src="/medium.jpg"
  alt="Responsive"
/>
```

## JavaScript Performance

### Bundle Splitting

```javascript
// Dynamic imports
async function loadModule() {
  const module = await import('./heavy-module.js')
  module.doWork()
}

// Webpack magic comments
import(/* webpackChunkName: "charts" */ './charts')
import(/* webpackPrefetch: true */ './future-module')
import(/* webpackPreload: true */ './critical-module')

// Next.js automatic code splitting
// Each page is automatically a separate bundle
// pages/dashboard.js → dashboard.[hash].js
```

### Tree Shaking

```javascript
// Good - named imports enable tree shaking
import { debounce, throttle } from 'lodash-es'

// Bad - imports entire library
import _ from 'lodash'

// package.json sideEffects declaration
{
  "name": "my-library",
  "sideEffects": false,  // or ["*.css"]
}

// Webpack production mode enables tree shaking
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
  }
}
```

### Memoization

```typescript
// React.memo for component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id
})

// useMemo for expensive computations
function DataTable({ data }) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value)
  }, [data])

  return <Table data={sortedData} />
}

// useCallback for stable function references
function Parent() {
  const handleClick = useCallback(() => {
    doExpensiveThing()
  }, [])  // stable reference across renders

  return <Child onClick={handleClick} />
}

// JavaScript memoization pattern
function memoize(fn) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

const fibonacci = memoize((n) => {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})
```

### Web Workers

```javascript
// main.js
const worker = new Worker('/compute.worker.js')

worker.postMessage({ operation: 'process', data: largeArray })

worker.addEventListener('message', (event) => {
  console.log('Result:', event.data)
})

// compute.worker.js
self.addEventListener('message', (event) => {
  const { operation, data } = event.data

  if (operation === 'process') {
    const result = expensiveComputation(data)
    self.postMessage(result)
  }
})

function expensiveComputation(data) {
  // Heavy CPU work here
  return data.map(/* complex transform */)
}
```

### Debounce and Throttle

```typescript
// Debounce - call after inactivity period
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Usage: search input
const searchAPI = debounce((query: string) => {
  fetch(`/api/search?q=${query}`)
}, 300)

// Throttle - call at most once per interval
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Usage: scroll handler
const handleScroll = throttle(() => {
  updateScrollPosition()
}, 100)
window.addEventListener('scroll', handleScroll)
```

## Python Performance

### cProfile - Function-Level Profiling

```python
import cProfile
import pstats
from pstats import SortKey

# Basic profiling
cProfile.run('my_function()')

# Detailed analysis
profiler = cProfile.Profile()
profiler.enable()

# Your code here
result = expensive_operation()

profiler.disable()

# Print stats
stats = pstats.Stats(profiler)
stats.sort_stats(SortKey.CUMULATIVE)
stats.print_stats(20)  # top 20 functions

# Save to file for analysis
stats.dump_stats('profile_results.prof')

# Analyze with snakeviz
# pip install snakeviz
# snakeviz profile_results.prof
```

### line_profiler - Line-by-Line Profiling

```python
# Install: pip install line-profiler

# Add @profile decorator
@profile
def process_data(items):
    results = []
    for item in items:
        processed = expensive_transform(item)
        results.append(processed)
    return results

# Run with kernprof
# kernprof -l -v script.py

# Output shows time per line:
# Line #  Hits    Time     Per Hit   % Time  Line Contents
# ======  ====    ====     =======   ======  =============
#     45     1    1000.0   1000.0     50.0   processed = expensive_transform(item)
```

### Generators for Memory Efficiency

```python
# Bad - loads entire dataset into memory
def process_large_file(filename):
    with open(filename) as f:
        lines = f.readlines()  # loads all lines
        return [process_line(line) for line in lines]

# Good - streams data with generator
def process_large_file(filename):
    with open(filename) as f:
        for line in f:  # reads one line at a time
            yield process_line(line)

# Generator expressions
large_numbers = (x ** 2 for x in range(1_000_000))
sum(n for n in large_numbers if n % 2 == 0)

# Iterator chaining
from itertools import islice, chain

def chunk_iterator(iterable, size):
    iterator = iter(iterable)
    while chunk := list(islice(iterator, size)):
        yield chunk

for batch in chunk_iterator(huge_dataset, 1000):
    process_batch(batch)
```

### functools.lru_cache

```python
from functools import lru_cache

# Memoize expensive computations
@lru_cache(maxsize=128)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Cache API responses
@lru_cache(maxsize=256)
def fetch_user(user_id: int):
    response = requests.get(f'/api/users/{user_id}')
    return response.json()

# Clear cache when needed
fetch_user.cache_clear()

# Check cache stats
print(fibonacci.cache_info())
# CacheInfo(hits=48, misses=10, maxsize=128, currsize=10)
```

### Multiprocessing for CPU-Bound Tasks

```python
from multiprocessing import Pool, cpu_count
import concurrent.futures

# Process pool for parallel work
def heavy_computation(n):
    return sum(i ** 2 for i in range(n))

with Pool(processes=cpu_count()) as pool:
    results = pool.map(heavy_computation, range(1000))

# ProcessPoolExecutor for more control
with concurrent.futures.ProcessPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(process_item, item) for item in items]
    results = [f.result() for f in concurrent.futures.as_completed(futures)]

# Shared memory for large datasets (Python 3.8+)
from multiprocessing import shared_memory
import numpy as np

# Create shared array
shm = shared_memory.SharedMemory(create=True, size=1000000)
shared_array = np.ndarray((1000, 1000), dtype=np.float64, buffer=shm.buf)
```

### NumPy Vectorization

```python
import numpy as np

# Bad - Python loop
result = []
for i in range(len(array)):
    result.append(array[i] ** 2 + array[i] * 3)

# Good - NumPy vectorization (10-100x faster)
result = array ** 2 + array * 3

# Vectorized operations
data = np.random.rand(1_000_000)
mask = data > 0.5
filtered = data[mask]
normalized = (data - data.mean()) / data.std()

# Avoid Python loops with NumPy functions
# Bad
total = 0
for x in array:
    total += x

# Good
total = np.sum(array)
```

## Database Performance

### Slow Query Log Analysis

```sql
-- MySQL: Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- queries > 1 second
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow-query.log';

-- PostgreSQL: Enable slow query logging
-- postgresql.conf
log_min_duration_statement = 1000  -- milliseconds

-- Analyze slow query log
-- pt-query-digest slow-query.log  (Percona Toolkit)
```

### EXPLAIN ANALYZE

```sql
-- PostgreSQL
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;

-- Look for:
-- 1. Seq Scan → add index
-- 2. High actual time → bottleneck
-- 3. Rows estimate vs actual → update statistics

-- MySQL
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123;

-- Check for:
-- type: ALL (table scan) → add index
-- rows: high number → needs filtering
-- Extra: Using filesort → add index for ORDER BY
```

### Indexing Strategy

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Covering index (includes all query columns)
CREATE INDEX idx_orders_covering ON orders(user_id, created_at, total_amount);

-- Index maintenance
ANALYZE TABLE orders;  -- MySQL: update statistics
VACUUM ANALYZE orders; -- PostgreSQL: reclaim space + update stats

-- Check index usage
-- PostgreSQL
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY idx_tup_read DESC;

-- Find missing indexes
SELECT relname, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > 1000 AND idx_scan < seq_scan
ORDER BY seq_tup_read DESC;
```

### Connection Pooling

```python
# PostgreSQL with psycopg2
from psycopg2 import pool

connection_pool = pool.SimpleConnectionPool(
    minconn=5,
    maxconn=20,
    host='localhost',
    database='mydb',
    user='user',
    password='pass'
)

conn = connection_pool.getconn()
try:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
finally:
    connection_pool.putconn(conn)

# SQLAlchemy pool configuration
from sqlalchemy import create_engine

engine = create_engine(
    'postgresql://user:pass@localhost/mydb',
    pool_size=10,          # connections to keep open
    max_overflow=20,       # additional connections under load
    pool_timeout=30,       # seconds to wait for connection
    pool_recycle=3600,     # recycle connections after 1 hour
    pool_pre_ping=True     # verify connection before use
)
```

### Query Caching

```python
# Redis query cache
import redis
import json
import hashlib

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cached_query(query, params, ttl=300):
    # Generate cache key
    cache_key = hashlib.md5(
        f"{query}:{json.dumps(params)}".encode()
    ).hexdigest()

    # Check cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # Execute query
    result = execute_query(query, params)

    # Store in cache
    redis_client.setex(
        cache_key,
        ttl,
        json.dumps(result)
    )

    return result

# Django cache framework
from django.core.cache import cache

def get_user_orders(user_id):
    cache_key = f'user_orders_{user_id}'
    orders = cache.get(cache_key)

    if orders is None:
        orders = Order.objects.filter(user_id=user_id).values()
        cache.set(cache_key, orders, timeout=300)

    return orders
```

## Network Performance

### HTTP/2 Advantages

```nginx
# Enable HTTP/2 in Nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Server push
    location = /index.html {
        http2_push /style.css;
        http2_push /app.js;
    }
}

# Benefits:
# - Multiplexing: multiple requests over single connection
# - Server push: proactively send resources
# - Header compression: HPACK reduces overhead
# - Binary protocol: more efficient parsing
```

### Compression (gzip/brotli)

```nginx
# Nginx gzip configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/rss+xml
    image/svg+xml;

# Brotli (better compression than gzip)
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    application/json
    application/javascript;
```

```javascript
// Express.js compression middleware
const compression = require('compression')
app.use(compression({
  level: 6,
  threshold: 1024,  // only compress > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))
```

### CDN Configuration

```javascript
// Next.js CDN asset prefix
module.exports = {
  assetPrefix: 'https://cdn.example.com',
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
}

// image-loader.js
export default function cloudflareLoader({ src, width, quality }) {
  return `https://cdn.example.com/cdn-cgi/image/width=${width},quality=${quality || 75}/${src}`
}
```

```html
<!-- Cache-Control headers for static assets -->
<meta http-equiv="Cache-Control" content="public, max-age=31536000, immutable">

<!-- Nginx cache configuration -->
```

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Prefetching and Preloading

```html
<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//api.example.com">

<!-- Preconnect (DNS + TCP + TLS) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero.jpg" as="image">

<!-- Prefetch future navigation -->
<link rel="prefetch" href="/dashboard.html">
<link rel="prefetch" href="/api/user-data.json">

<!-- Module preload -->
<link rel="modulepreload" href="/app.js">
```

```typescript
// Next.js automatic prefetching
import Link from 'next/link'

// Links in viewport are automatically prefetched
<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>

// React Router prefetching
import { Link } from 'react-router-dom'
const Dashboard = lazy(() => import('./Dashboard'))

// Custom prefetch hook
function usePrefetch(url: string) {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }, [url])
}
```

### Service Workers

```javascript
// sw.js - Cache-first strategy
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/index.html',
        '/styles.css',
        '/app.js',
        '/offline.html',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    })
  )
})

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

## Profiling Tools

### Chrome DevTools Performance

```
1. Open DevTools (F12) → Performance tab
2. Click Record (or Cmd/Ctrl + E)
3. Interact with page
4. Stop recording

Analyze:
- Flame chart: identify long tasks (> 50ms)
- Main thread activity: scripting, rendering, painting
- Bottom-Up tab: sort by Self Time to find bottlenecks
- Call Tree: trace execution paths

Key metrics:
- FPS: should stay above 60 fps
- CPU usage: spikes indicate heavy computation
- Network waterfall: request timing and dependencies
```

### React DevTools Profiler

```javascript
import { Profiler } from 'react'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`)
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  )
}

// DevTools Profiler tab:
// 1. Click "Start profiling"
// 2. Interact with app
// 3. Click "Stop profiling"
// 4. Review flame graph
//    - Bar width = render duration
//    - Gray bars = component didn't render
//    - Yellow bars = rendered due to state/props change
```

### Python cProfile Analysis

```bash
# Run with profiling
python -m cProfile -o output.prof script.py

# Analyze with pstats
python -m pstats output.prof
% sort cumulative
% stats 20

# Visual analysis with snakeviz
pip install snakeviz
snakeviz output.prof

# kcachegrind visualization
pip install pyprof2calltree
pyprof2calltree -i output.prof -o callgrind.out
kcachegrind callgrind.out
```

### Node.js --inspect

```bash
# Start with inspector
node --inspect app.js

# Debug production (use --inspect-brk to break on start)
node --inspect=0.0.0.0:9229 app.js

# Chrome DevTools
# Open chrome://inspect
# Click "inspect" under Remote Target

# CPU profiling
node --cpu-prof app.js
# Generates CPU.*.cpuprofile → load in DevTools Performance tab

# Heap snapshot
node --heap-prof app.js
# Generates Heap.*.heapprofile

# Clinic.js suite
npm install -g clinic
clinic doctor -- node app.js
clinic flame -- node app.js
clinic bubbleprof -- node app.js
```

## Production Monitoring

### Key Metrics to Track

**Application Performance**
```yaml
Response Time (p50, p95, p99):
  - API endpoints: < 200ms (p95)
  - Database queries: < 50ms (p95)
  - Page load: < 3s (p95)

Throughput:
  - Requests per second
  - Transactions per second
  - Messages processed per second

Error Rate:
  - 4xx errors: < 1%
  - 5xx errors: < 0.1%
  - Failed jobs: < 0.5%
```

**System Resources**
```yaml
CPU:
  - Average: < 70%
  - Peak: < 90%

Memory:
  - Usage: < 80%
  - Heap size (Node.js): monitor growth

Disk:
  - I/O wait: < 10%
  - Queue depth: < 10

Network:
  - Bandwidth utilization: < 80%
  - Packet loss: < 0.01%
```

**Business Metrics**
```yaml
Core Web Vitals:
  - LCP: < 2.5s (75th percentile)
  - FID: < 100ms (75th percentile)
  - CLS: < 0.1 (75th percentile)

Availability:
  - Uptime: > 99.9%
  - SLO compliance: > 99.5%
```

### Alerting Thresholds

```yaml
Critical (PagerDuty):
  - Error rate > 5% for 5 minutes
  - Response time p95 > 2s for 10 minutes
  - CPU > 95% for 5 minutes
  - Memory > 95% for 3 minutes
  - Disk full > 90%

Warning (Slack):
  - Error rate > 1% for 10 minutes
  - Response time p95 > 1s for 15 minutes
  - CPU > 80% for 10 minutes
  - Memory > 85% for 10 minutes

Info (Dashboard):
  - Response time trending up
  - Traffic spike detected
  - Deploy completed
```

### Prometheus + Grafana Basics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api-server'
    static_configs:
      - targets: ['localhost:3000']
```

```javascript
// Express.js Prometheus metrics
const client = require('prom-client')
const express = require('express')

// Default metrics (CPU, memory, event loop)
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ timeout: 5000 })

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
})

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration)
  })
  next()
})

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})
```

### Error Budgets

```yaml
SLO: 99.9% uptime per month
Error Budget: 0.1% = 43.2 minutes downtime allowed

Calculation:
  - Month: 30 days = 43,200 minutes
  - Error budget: 43,200 * 0.001 = 43.2 minutes
  - Remaining budget: 43.2 - actual_downtime

Policy:
  - Budget > 50%: ship new features freely
  - Budget 25-50%: reduce release velocity
  - Budget < 25%: freeze releases, focus on reliability
  - Budget exhausted: incident response only

Tracking:
  - Daily burn rate: (downtime_today / 1440) / 0.001
  - Projected end of month: budget - (burn_rate * days_remaining)
```

## Quick Wins Checklist

Ranked by effort vs impact (⭐ = high impact, 🔧 = low effort)

### Immediate (< 1 hour)
1. **⭐🔧 Enable compression** — gzip/brotli in nginx/Express (30% size reduction)
2. **⭐🔧 Add cache headers** — static assets with `max-age=31536000`
3. **⭐🔧 Optimize images** — convert to WebP/AVIF, compress with imagemin
4. **🔧 Defer non-critical JS** — add `defer` to script tags
5. **🔧 Remove unused dependencies** — `npm-check` or `depcheck`

### Quick (1-4 hours)
6. **⭐ Add database indexes** — run EXPLAIN on slow queries, add indexes
7. **⭐ Implement lazy loading** — code-split routes and heavy components
8. **⭐ Add Redis caching** — cache frequent database queries (5min TTL)
9. **🔧 Use CDN for static assets** — offload images, CSS, JS to CDN
10. **🔧 Minimize render-blocking resources** — inline critical CSS

### Medium (1 day)
11. **⭐ Optimize Core Web Vitals** — preload LCP image, reduce CLS shifts
12. **⭐ Connection pooling** — configure DB pool (min 5, max 20)
13. **Implement service worker** — cache-first for static, network-first for API
14. **Add performance monitoring** — set up Prometheus + Grafana
15. **Database query optimization** — reduce N+1 queries, use batch loading

### Effort vs Impact Matrix

```
High Impact │ 1. Compression        │ 6. DB indexes
            │ 2. Cache headers      │ 7. Lazy loading
            │ 3. Image optimization │ 8. Redis cache
            │                       │ 11. Core Web Vitals
            │                       │ 12. Connection pool
────────────┼───────────────────────┼──────────────────
Low Impact  │ 4. Defer JS           │ 13. Service worker
            │ 5. Remove deps        │ 14. Monitoring
            │ 9. CDN                │ 15. Query optimization
            │ 10. Inline CSS        │
            │                       │
            └───────────────────────┴──────────────────
              Low Effort              High Effort
```

---

## Output Format

When conducting performance optimization:

1. **Baseline metrics** — measure current state (Lighthouse, profiler, query times)
2. **Identify bottleneck** — profile to find actual slow path (don't guess)
3. **Implement fix** — apply targeted optimization from relevant section above
4. **Verify improvement** — re-measure with same tools to confirm gains
5. **Document change** — record what was optimized and impact achieved

Report template:
```
## Performance Optimization Report

### Baseline
- Metric: [value before]
- Tool: [profiling method]
- Bottleneck: [identified issue]

### Changes Applied
- [optimization 1]
- [optimization 2]

### Results
- Metric: [value after]
- Improvement: [% or absolute gain]
- Trade-offs: [any new issues]

### Next Steps
- [remaining optimizations]
```
