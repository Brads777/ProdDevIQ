---
name: api-master
description: >
  Comprehensive API guide covering REST design, GraphQL, OpenAPI specs,
  type-safe clients, documentation, security, and testing.
  Consolidates 8 API skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# API Master

Complete reference for API design, implementation, documentation, security, and testing. Covers REST, GraphQL, OpenAPI, type-safe clients, and production best practices.

## When to Use This Skill

Invoke for any API-related work:
- Designing new REST or GraphQL APIs
- Generating OpenAPI/Swagger specifications
- Creating type-safe API clients
- Auto-generating API documentation
- Implementing authentication and security
- API testing and fuzzing
- Versioning and evolution strategies
- Troubleshooting API integration issues

## 1. REST API Design

### Resource Naming

```typescript
// Good: plural nouns, hierarchical relationships
GET    /api/users
GET    /api/users/123
GET    /api/users/123/posts
POST   /api/users/123/posts
GET    /api/posts?author_id=123

// Bad: verbs in URLs, inconsistent pluralization
GET    /api/getUser/123
POST   /api/createNewPost
GET    /api/user/123/post
```

**Rules:**
- Use plural nouns for collections (`/users`, `/posts`)
- Use hierarchical paths for relationships (`/users/123/posts`)
- Avoid verbs — HTTP methods convey actions
- Use query parameters for filtering, not path segments
- Keep URLs lowercase with hyphens for multi-word resources (`/user-preferences`)

### HTTP Methods & Status Codes

```typescript
// User resource example
class UserController {
  // GET /api/users — 200 OK, 500 Server Error
  async list(req, res) {
    const users = await db.users.findMany();
    return res.status(200).json({ data: users });
  }

  // GET /api/users/:id — 200 OK, 404 Not Found, 500 Server Error
  async get(req, res) {
    const user = await db.users.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ data: user });
  }

  // POST /api/users — 201 Created, 400 Bad Request, 409 Conflict
  async create(req, res) {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.issues
      });
    }

    const existing = await db.users.findUnique({
      where: { email: req.body.email }
    });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await db.users.create({ data: validation.data });
    return res.status(201)
      .header('Location', `/api/users/${user.id}`)
      .json({ data: user });
  }

  // PUT /api/users/:id — 200 OK, 404 Not Found, 400 Bad Request
  async update(req, res) {
    const user = await db.users.update({
      where: { id: req.params.id },
      data: req.body
    }).catch(() => null);

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ data: user });
  }

  // PATCH /api/users/:id — 200 OK (partial update)
  async patch(req, res) {
    const user = await db.users.update({
      where: { id: req.params.id },
      data: req.body // only provided fields updated
    });
    return res.status(200).json({ data: user });
  }

  // DELETE /api/users/:id — 204 No Content, 404 Not Found
  async delete(req, res) {
    await db.users.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
```

**Status Code Guide:**
- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **3xx Redirection**: 301 Moved Permanently, 304 Not Modified
- **4xx Client Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests
- **5xx Server Errors**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

### Pagination & Filtering

```typescript
// Cursor-based pagination (recommended for large datasets)
interface PaginationQuery {
  cursor?: string;
  limit?: number;
}

app.get('/api/posts', async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  const posts = await db.posts.findMany({
    take: limit + 1, // fetch one extra to detect if there's a next page
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, -1) : posts;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return res.json({
    data: items,
    pagination: {
      nextCursor,
      hasNextPage,
      limit
    }
  });
});

// Offset-based pagination (simpler, for smaller datasets)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.users.findMany({ skip: offset, take: limit }),
    db.users.count()
  ]);

  return res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Filtering with query parameters
app.get('/api/posts', async (req, res) => {
  const { status, author_id, tag, sort = 'createdAt', order = 'desc' } = req.query;

  const where = {
    ...(status && { status }),
    ...(author_id && { authorId: author_id }),
    ...(tag && { tags: { has: tag } })
  };

  const posts = await db.posts.findMany({
    where,
    orderBy: { [sort]: order }
  });

  return res.json({ data: posts });
});
```

### API Versioning

```typescript
// URL versioning (recommended for public APIs)
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Header versioning
app.use((req, res, next) => {
  const version = req.header('API-Version') || '1';
  req.apiVersion = version;
  next();
});

// Accept header versioning
app.use((req, res, next) => {
  const accept = req.header('Accept');
  if (accept?.includes('application/vnd.myapi.v2+json')) {
    req.apiVersion = '2';
  }
  next();
});
```

## 2. API Response Patterns

### Envelope Pattern

```typescript
// Success response
interface SuccessResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
    timestamp?: string;
  };
}

// Error response (RFC 7807 Problem Details)
interface ErrorResponse {
  type: string;         // URI identifying the problem type
  title: string;        // Short, human-readable summary
  status: number;       // HTTP status code
  detail?: string;      // Specific explanation
  instance?: string;    // URI identifying this occurrence
  errors?: Array<{      // Validation errors
    field: string;
    message: string;
  }>;
}

// Middleware implementation
function envelope<T>(data: T, meta?: any): SuccessResponse<T> {
  return {
    data,
    ...(meta && { meta: { ...meta, timestamp: new Date().toISOString() } })
  };
}

function errorResponse(
  status: number,
  title: string,
  detail?: string,
  errors?: any[]
): ErrorResponse {
  return {
    type: `https://api.example.com/errors/${status}`,
    title,
    status,
    ...(detail && { detail }),
    ...(errors && { errors })
  };
}

// Usage
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });

  if (!user) {
    return res.status(404).json(
      errorResponse(404, 'User not found', `No user with ID ${req.params.id}`)
    );
  }

  return res.json(envelope(user));
});

app.post('/api/users', async (req, res) => {
  const validation = userSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json(
      errorResponse(
        400,
        'Validation failed',
        'Request body contains invalid fields',
        validation.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message
        }))
      )
    );
  }

  const user = await db.users.create({ data: validation.data });
  return res.status(201).json(envelope(user));
});
```

### HATEOAS (Hypermedia as the Engine of Application State)

```typescript
interface HATEOASLink {
  rel: string;
  href: string;
  method: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  _links: HATEOASLink[];
}

app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });

  const response: UserResponse = {
    ...user,
    _links: [
      { rel: 'self', href: `/api/users/${user.id}`, method: 'GET' },
      { rel: 'update', href: `/api/users/${user.id}`, method: 'PUT' },
      { rel: 'delete', href: `/api/users/${user.id}`, method: 'DELETE' },
      { rel: 'posts', href: `/api/users/${user.id}/posts`, method: 'GET' }
    ]
  };

  return res.json({ data: response });
});
```

## 3. GraphQL

### When to Use REST vs GraphQL

**Use REST when:**
- Simple CRUD operations
- Well-defined resource hierarchy
- Caching is critical (HTTP caching)
- Public API consumed by third parties
- Team unfamiliar with GraphQL

**Use GraphQL when:**
- Clients need flexible data fetching
- Mobile apps (reduce round-trips)
- Multiple front-end clients with different needs
- Complex nested relationships
- Real-time updates (subscriptions)

### Schema Design

```graphql
# schema.graphql

type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  published: Boolean!
  createdAt: DateTime!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}

type Query {
  user(id: ID!): User
  users(limit: Int, cursor: String): UserConnection!
  post(id: ID!): Post
  posts(authorId: ID, published: Boolean): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  createPost(authorId: ID!, title: String!, content: String!): Post!
}

type Subscription {
  postCreated(authorId: ID): Post!
  commentAdded(postId: ID!): Comment!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

scalar DateTime
```

### Resolvers & N+1 Prevention

```typescript
// Without DataLoader — N+1 problem
const resolvers = {
  Query: {
    posts: () => db.posts.findMany()
  },
  Post: {
    // This runs once per post — if 100 posts, 100 queries!
    author: (post) => db.users.findUnique({ where: { id: post.authorId } })
  }
};

// Solution 1: DataLoader (batching)
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds: string[]) => {
  const users = await db.users.findMany({
    where: { id: { in: userIds } }
  });
  const userMap = new Map(users.map(u => [u.id, u]));
  return userIds.map(id => userMap.get(id));
});

const resolvers = {
  Query: {
    posts: () => db.posts.findMany()
  },
  Post: {
    author: (post, _args, context) => context.loaders.user.load(post.authorId)
  }
};

// Solution 2: Prisma with include (single query)
const resolvers = {
  Query: {
    posts: () => db.posts.findMany({
      include: { author: true, comments: true }
    })
  },
  Post: {
    author: (post) => post.author, // already loaded
    comments: (post) => post.comments
  }
};

// Context setup with loaders
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    db,
    loaders: {
      user: new DataLoader(batchLoadUsers),
      post: new DataLoader(batchLoadPosts)
    }
  })
});
```

### GraphQL Error Handling

```typescript
import { GraphQLError } from 'graphql';

const resolvers = {
  Mutation: {
    createUser: async (_parent, { input }, { db }) => {
      // Validation error
      const validation = userSchema.safeParse(input);
      if (!validation.success) {
        throw new GraphQLError('Validation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            validationErrors: validation.error.issues
          }
        });
      }

      // Business logic error
      const existing = await db.users.findUnique({
        where: { email: input.email }
      });
      if (existing) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'CONFLICT' }
        });
      }

      // Authorization error
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      return db.users.create({ data: input });
    }
  }
};
```

## 4. OpenAPI/Swagger

### Writing OpenAPI Specs

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: User API
  version: 1.0.0
  description: User management REST API
servers:
  - url: https://api.example.com/v1
    description: Production
  - url: http://localhost:3000/v1
    description: Development

components:
  schemas:
    User:
      type: object
      required: [id, email, name]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        createdAt:
          type: string
          format: date-time

    CreateUserRequest:
      type: object
      required: [email, name, password]
      properties:
        email:
          type: string
          format: email
        name:
          type: string
        password:
          type: string
          minLength: 8

    ErrorResponse:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri
        title:
          type: string
        status:
          type: integer
        detail:
          type: string
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    type: object
                    properties:
                      page:
                        type: integer
                      limit:
                        type: integer
                      total:
                        type: integer

    post:
      summary: Create user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/User'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /users/{userId}:
    get:
      summary: Get user
      operationId: getUser
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/User'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
```

### Code Generation from OpenAPI

```bash
# Install openapi-typescript
npm install -D openapi-typescript

# Generate TypeScript types
npx openapi-typescript ./openapi.yaml -o ./src/api-types.ts

# Generate client with openapi-fetch
npm install openapi-fetch
npx openapi-typescript ./openapi.yaml -o ./src/api-schema.ts
```

```typescript
// src/api-client.ts
import createClient from 'openapi-fetch';
import type { paths } from './api-schema';

const client = createClient<paths>({ baseUrl: 'https://api.example.com/v1' });

// Type-safe API calls
const { data, error } = await client.GET('/users/{userId}', {
  params: { path: { userId: '123' } }
});
// data is typed as User | undefined
// error is typed as ErrorResponse | undefined

const { data: newUser, error: createError } = await client.POST('/users', {
  body: {
    email: 'test@example.com',
    name: 'Test User',
    password: 'secret123'
  }
});
// body is validated against CreateUserRequest schema
```

## 5. Type-Safe API Clients

### tRPC (Full-Stack Type Safety)

```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  userList: t.procedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().max(100).default(20)
    }))
    .query(async ({ input }) => {
      const users = await db.users.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit
      });
      return users;
    }),

  userCreate: t.procedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(8)
    }))
    .mutation(async ({ input }) => {
      return db.users.create({ data: input });
    }),

  userGet: t.procedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const user = await db.users.findUnique({ where: { id: input } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    })
});

export type AppRouter = typeof appRouter;

// client/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/trpc';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Fully type-safe calls (no codegen needed!)
const users = await trpc.userList.query({ page: 1, limit: 10 });
const newUser = await trpc.userCreate.mutate({
  email: 'test@example.com',
  name: 'Test',
  password: 'secret123'
});
```

### Zodios (OpenAPI-Style with Zod)

```typescript
import { makeApi, Zodios } from '@zodios/core';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime()
});

const apiDefinition = makeApi([
  {
    method: 'get',
    path: '/users',
    alias: 'getUsers',
    response: z.array(userSchema),
    parameters: [
      { name: 'page', type: 'Query', schema: z.number().default(1) },
      { name: 'limit', type: 'Query', schema: z.number().default(20) }
    ]
  },
  {
    method: 'post',
    path: '/users',
    alias: 'createUser',
    response: userSchema,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
          email: z.string().email(),
          name: z.string(),
          password: z.string().min(8)
        })
      }
    ]
  },
  {
    method: 'get',
    path: '/users/:id',
    alias: 'getUser',
    response: userSchema,
    parameters: [
      { name: 'id', type: 'Path', schema: z.string().uuid() }
    ]
  }
]);

const api = new Zodios('https://api.example.com/v1', apiDefinition);

// Type-safe + runtime validation
const users = await api.getUsers({ queries: { page: 1, limit: 10 } });
const newUser = await api.createUser({
  email: 'test@example.com',
  name: 'Test',
  password: 'secret123'
});
const user = await api.getUser({ params: { id: '123' } });
```

## 6. API Documentation

### Auto-Generation from Code

```typescript
// With JSDoc annotations for OpenAPI generation
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', async (req, res) => {
  const users = await db.users.findMany();
  res.json({ data: users });
});

// Generate OpenAPI spec from JSDoc
import swaggerJsdoc from 'swagger-jsdoc';

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'User API',
      version: '1.0.0'
    }
  },
  apis: ['./routes/*.ts']
});

// Serve Swagger UI
import swaggerUi from 'swagger-ui-express';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### TypeScript-First Documentation (TypeDoc)

```typescript
// src/api/users.ts

/**
 * Represents a user in the system
 * @public
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** Account creation timestamp */
  createdAt: Date;
}

/**
 * Fetch a user by ID
 * @param userId - The user's unique identifier
 * @returns The user object if found
 * @throws {NotFoundError} When user doesn't exist
 * @public
 */
export async function getUser(userId: string): Promise<User> {
  const user = await db.users.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');
  return user;
}

/**
 * Create a new user
 * @param data - User creation data
 * @returns The created user
 * @throws {ValidationError} When input is invalid
 * @throws {ConflictError} When user already exists
 * @public
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // implementation
}
```

```bash
# Generate docs
npm install -D typedoc
npx typedoc src/api --out docs/api
```

### Redoc (Alternative to Swagger UI)

```typescript
import { serve as redocServe, setup as redocSetup } from 'redoc-express';

app.get('/docs/openapi.json', (req, res) => {
  res.json(openapiSpec);
});

app.use('/docs', redocServe, redocSetup(openapiSpec, {
  theme: {
    colors: {
      primary: { main: '#3b82f6' }
    }
  }
}));
```

## 7. API Security

### Authentication Strategies

```typescript
// JWT Authentication
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d', issuer: 'api.example.com' }
  );
}

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = await db.users.findUnique({ where: { id: payload.userId } });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// API Key Authentication
async function authenticateAPIKey(req, res, next) {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const key = await db.apiKeys.findUnique({ where: { hash: keyHash } });

  if (!key || !key.active) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Update last used timestamp
  await db.apiKeys.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() }
  });

  req.apiKey = key;
  next();
}

// OAuth 2.0 (using Passport.js)
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const user = await db.users.upsert({
    where: { email: profile.emails[0].value },
    create: {
      email: profile.emails[0].value,
      name: profile.displayName,
      googleId: profile.id
    },
    update: { googleId: profile.id }
  });
  done(null, user);
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/auth-success?token=${token}`);
  }
);
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:global:'
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: res.getHeader('Retry-After')
    });
  }
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  })
});

// Per-user rate limiting
const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: async (req) => {
    if (req.user?.role === 'premium') return 1000;
    return 100;
  },
  keyGenerator: (req) => req.user?.id || req.ip,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:user:'
  })
});

app.use('/api', globalLimiter);
app.use('/auth', authLimiter);
app.use('/api', authenticateJWT, userLimiter);
```

### Input Validation & Sanitization

```typescript
import { z } from 'zod';
import validator from 'validator';

// Zod validation middleware
function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues
      });
    }
    req.validatedBody = result.data;
    next();
  };
}

// Schemas with sanitization
const createUserSchema = z.object({
  email: z.string().email().transform(e => e.toLowerCase().trim()),
  name: z.string().min(1).max(100).transform(n => validator.escape(n.trim())),
  password: z.string().min(8).max(100),
  website: z.string().url().optional().transform(u =>
    u ? validator.normalizeEmail(u) : undefined
  )
});

app.post('/users', validate(createUserSchema), async (req, res) => {
  const { email, name, password } = req.validatedBody;
  // Data is already validated and sanitized
  const user = await db.users.create({ data: { email, name, password } });
  res.status(201).json({ data: user });
});

// SQL injection prevention (use parameterized queries)
// Bad:
const users = await db.raw(`SELECT * FROM users WHERE email = '${email}'`);

// Good (parameterized):
const users = await db.raw('SELECT * FROM users WHERE email = ?', [email]);

// Better (ORM):
const users = await db.users.findMany({ where: { email } });
```

### CORS Configuration

```typescript
import cors from 'cors';

// Development (permissive)
app.use(cors());

// Production (restrictive)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://example.com',
      'https://app.example.com',
      /\.example\.com$/
    ];

    if (!origin || allowedOrigins.some(allowed =>
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
}));

// Preflight caching
app.options('*', cors());
```

## 8. API Testing

### Integration Testing

```typescript
// tests/api/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app';

const request = supertest(app);

describe('User API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Setup: create test user and get token
    const res = await request.post('/auth/login').send({
      email: 'test@example.com',
      password: 'secret123'
    });
    authToken = res.body.token;
  });

  afterAll(async () => {
    // Cleanup: delete test data
    await db.users.deleteMany({ where: { email: 'test@example.com' } });
  });

  it('should create a user', async () => {
    const res = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      email: 'newuser@example.com',
      name: 'New User'
    });
    expect(res.body.data).not.toHaveProperty('password');

    userId = res.body.data.id;
  });

  it('should reject invalid email', async () => {
    const res = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        email: 'invalid-email',
        name: 'Test',
        password: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should get user by id', async () => {
    const res = await request
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(userId);
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request
      .get('/api/users/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  it('should require authentication', async () => {
    const res = await request.get('/api/users');
    expect(res.status).toBe(401);
  });
});
```

### Contract Testing (Pact)

```typescript
// consumer-test.ts (front-end)
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'WebApp',
  provider: 'UserAPI'
});

describe('User API Contract', () => {
  it('should get user by id', () => {
    provider
      .given('user 123 exists')
      .uponReceiving('a request for user 123')
      .withRequest({
        method: 'GET',
        path: '/api/users/123',
        headers: { Authorization: 'Bearer token123' }
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: {
            id: '123',
            email: MatchersV3.email(),
            name: MatchersV3.string('John Doe'),
            createdAt: MatchersV3.iso8601DateTime()
          }
        }
      });

    return provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/api/users/123`, {
        headers: { Authorization: 'Bearer token123' }
      });
      const data = await response.json();
      expect(data.data.id).toBe('123');
    });
  });
});

// provider-test.ts (back-end)
import { Verifier } from '@pact-foundation/pact';

describe('Pact Verification', () => {
  it('should validate the pact contract', () => {
    return new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: ['./pacts/webapp-userapi.json'],
      stateHandlers: {
        'user 123 exists': async () => {
          await db.users.upsert({
            where: { id: '123' },
            create: { id: '123', email: 'john@example.com', name: 'John Doe' },
            update: {}
          });
        }
      }
    }).verifyProvider();
  });
});
```

### API Fuzzing

```typescript
// fuzz-test.ts
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

const request = supertest(app);

describe('API Fuzzing', () => {
  it('should handle malformed JSON', async () => {
    const res = await request
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');

    expect([400, 500]).toContain(res.status);
  });

  it('should handle extremely long strings', async () => {
    const res = await request
      .post('/api/users')
      .send({
        email: faker.string.alpha({ length: 10000 }),
        name: faker.string.alpha({ length: 10000 }),
        password: faker.string.alpha({ length: 10000 })
      });

    expect(res.status).toBe(400);
  });

  it('should handle special characters', async () => {
    const specialChars = ['<script>alert(1)</script>', '../../../etc/passwd',
      '${7*7}', '\'; DROP TABLE users; --'];

    for (const char of specialChars) {
      const res = await request
        .post('/api/users')
        .send({ email: char, name: char, password: 'test123' });

      expect([400, 422]).toContain(res.status);
    }
  });

  it('should handle large payloads', async () => {
    const largePayload = {
      email: 'test@example.com',
      name: 'Test',
      password: 'test123',
      metadata: faker.helpers.multiple(() => faker.lorem.paragraphs(100), {
        count: 1000
      })
    };

    const res = await request.post('/api/users').send(largePayload);
    expect([400, 413]).toContain(res.status);
  });
});
```

## 9. API Versioning & Evolution

### Versioning Strategies

```typescript
// Strategy 1: URL versioning (recommended for public APIs)
// /api/v1/users vs /api/v2/users
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// v1/routes/users.ts
router.get('/users/:id', (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });
  res.json({ ...user }); // flat structure
});

// v2/routes/users.ts
router.get('/users/:id', (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    include: { profile: true }
  });
  res.json({
    data: user,
    _links: {
      self: `/api/v2/users/${user.id}`,
      posts: `/api/v2/users/${user.id}/posts`
    }
  });
});

// Strategy 2: Header versioning
app.use((req, res, next) => {
  const version = req.header('API-Version') || '1';
  req.apiVersion = version;
  next();
});

router.get('/users/:id', (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });

  if (req.apiVersion === '2') {
    return res.json({ data: user, _links: {...} });
  }

  res.json(user);
});

// Strategy 3: Content negotiation
app.use((req, res, next) => {
  const accept = req.header('Accept');
  if (accept?.includes('application/vnd.myapi.v2+json')) {
    req.apiVersion = '2';
  }
  next();
});
```

### Deprecation Strategy

```typescript
// Deprecation headers
function deprecate(endpoint: string, sunset: string, replacement?: string) {
  return (req, res, next) => {
    res.set('Deprecation', 'true');
    res.set('Sunset', sunset); // RFC 8594
    if (replacement) {
      res.set('Link', `<${replacement}>; rel="alternate"`);
    }

    // Log deprecation usage
    logger.warn('Deprecated endpoint accessed', {
      endpoint,
      user: req.user?.id,
      ip: req.ip,
      userAgent: req.header('User-Agent')
    });

    next();
  };
}

app.get('/api/v1/users/:id',
  deprecate('/api/v1/users/:id', '2026-06-01', '/api/v2/users/:id'),
  (req, res) => {
    // old implementation
  }
);

// Response includes:
// Deprecation: true
// Sunset: Wed, 01 Jun 2026 00:00:00 GMT
// Link: </api/v2/users/:id>; rel="alternate"
```

### Backward Compatibility Techniques

```typescript
// Field evolution: add optional fields, never remove required ones
interface UserV1 {
  id: string;
  name: string;
  email: string;
}

interface UserV2 extends UserV1 {
  profilePicture?: string; // new optional field
  createdAt?: string;      // new optional field
}

// Transform layer for backward compatibility
function transformUserResponse(user: UserV2, version: string): UserV1 | UserV2 {
  if (version === '1') {
    const { profilePicture, createdAt, ...v1Fields } = user;
    return v1Fields; // strip new fields for v1 clients
  }
  return user;
}

router.get('/users/:id', async (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });
  const transformed = transformUserResponse(user, req.apiVersion);
  res.json({ data: transformed });
});

// Field renaming with aliasing
interface UserResponseV1 {
  user_id: string;
  user_name: string;
}

interface UserResponseV2 {
  id: string;
  name: string;
}

function toV1(user: User): UserResponseV1 {
  return {
    user_id: user.id,
    user_name: user.name
  };
}

function toV2(user: User): UserResponseV2 {
  return {
    id: user.id,
    name: user.name
  };
}
```

### Migration Guides

```markdown
# Migration Guide: v1 → v2

## Breaking Changes

### 1. Response Structure
**v1:**
```json
{ "id": "123", "name": "John" }
```

**v2:**
```json
{
  "data": { "id": "123", "name": "John" },
  "_links": { "self": "/api/v2/users/123" }
}
```

**Migration:**
```typescript
// Before
const user = await fetch('/api/v1/users/123').then(r => r.json());

// After
const response = await fetch('/api/v2/users/123').then(r => r.json());
const user = response.data;
```

### 2. Pagination Format
**v1:** Offset-based (`?page=1&limit=20`)
**v2:** Cursor-based (`?cursor=abc123&limit=20`)

**Migration:**
```typescript
// v1
let page = 1;
while (true) {
  const users = await fetch(`/api/v1/users?page=${page}&limit=20`);
  if (users.length === 0) break;
  page++;
}

// v2
let cursor = null;
while (true) {
  const res = await fetch(`/api/v2/users?cursor=${cursor || ''}&limit=20`);
  const { data, pagination } = await res.json();
  if (!pagination.hasNextPage) break;
  cursor = pagination.nextCursor;
}
```

### 3. Error Format
**v1:** `{ "error": "User not found" }`
**v2:** RFC 7807 Problem Details

**Migration:**
```typescript
// v1
try {
  const user = await fetchUser();
} catch (err) {
  console.error(err.error);
}

// v2
try {
  const user = await fetchUser();
} catch (err) {
  console.error(err.title, err.detail, err.status);
}
```

## Timeline
- **2026-03-01**: v2 released, v1 deprecated
- **2026-06-01**: v1 sunset (no longer supported)
```

## Best Practices Summary

1. **REST Design**: Use plural nouns, HTTP methods for actions, hierarchical paths
2. **Status Codes**: Be precise (200/201/204 for success, 400/404/409 for client errors)
3. **Pagination**: Cursor-based for large datasets, offset for simplicity
4. **Errors**: RFC 7807 format with type, title, status, detail
5. **GraphQL**: Use DataLoader to prevent N+1 queries
6. **OpenAPI**: Write specs first (design-first) or generate from code
7. **Type Safety**: Use tRPC for full-stack or openapi-typescript for existing APIs
8. **Security**: JWT/OAuth for auth, rate limiting, input validation, CORS
9. **Testing**: Integration tests, contract tests (Pact), fuzzing for edge cases
10. **Versioning**: URL versioning for public APIs, deprecation headers, migration guides
