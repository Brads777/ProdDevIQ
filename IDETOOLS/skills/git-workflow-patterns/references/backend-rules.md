---
trigger: always_on
---

# Backend Development Rules

Follow these rules when working on backend code, APIs, and server-side logic.

## API Design

### Naming Conventions
- Use RESTful naming: `/api/[resource]` (plural nouns)
- Use kebab-case for multi-word resources: `/api/user-preferences`
- Nest related resources: `/api/users/{id}/orders`
- Use query parameters for filtering: `/api/users?status=active`

### HTTP Methods
- GET: Retrieve resources (idempotent, no side effects)
- POST: Create new resources
- PUT: Replace entire resource
- PATCH: Partial update
- DELETE: Remove resource

### Response Codes
- 200: Success
- 201: Created
- 204: No content (successful delete)
- 400: Bad request (client error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not authorized)
- 404: Not found
- 422: Validation error
- 500: Server error

## Data Handling

### Input Validation
- Validate all external input at API boundaries
- Use schema validation (JSON Schema, Zod, Pydantic, etc.)
- Sanitize user input before storage
- Reject invalid requests early with clear error messages

### Database Operations
- Use parameterized queries (never string concatenation)
- Use transactions for multi-step operations
- Implement proper connection pooling
- Add indexes for frequently queried fields
- Paginate large result sets

### Error Handling
- Never expose internal errors to clients
- Log errors with sufficient context for debugging
- Return consistent error response format
- Include correlation IDs for request tracing

## Security

### Authentication
- Use established auth standards (JWT, OAuth 2.0, sessions)
- Store passwords with strong hashing (bcrypt, Argon2)
- Implement proper session management
- Use HTTPS for all endpoints

### Authorization
- Check permissions on every protected endpoint
- Implement principle of least privilege
- Validate ownership before resource access
- Use role-based or attribute-based access control

### Data Protection
- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Implement rate limiting on all endpoints

## Performance

### Optimization
- Cache expensive operations
- Use async operations for I/O-bound tasks
- Batch database operations where possible
- Implement request timeouts
- Monitor and profile slow endpoints

### Scalability
- Design stateless services where possible
- Use message queues for async processing
- Implement circuit breakers for external services
- Plan for horizontal scaling
