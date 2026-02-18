---
trigger: always_on
---

# Security Rules

Follow these security rules in all code to prevent vulnerabilities and protect user data.

## Input Handling

### Never Trust User Input
- Validate all input from users, APIs, and external sources
- Use allowlists over denylists for validation
- Sanitize before storage and escape before display
- Validate on both client and server (server is authoritative)

### Injection Prevention
- Use parameterized queries for all database operations
- Never concatenate user input into queries or commands
- Use ORM/query builders with proper escaping
- Sanitize input before shell command execution (avoid if possible)

## Authentication

### Password Security
- Use strong hashing algorithms (bcrypt, Argon2, PBKDF2)
- Never store passwords in plain text
- Implement account lockout after failed attempts
- Require strong passwords (length over complexity)

### Session Management
- Use secure, HTTP-only, SameSite cookies
- Regenerate session IDs after login
- Implement proper session expiration
- Provide secure logout (invalidate server-side)

### Token Security
- Use short expiration for access tokens
- Store refresh tokens securely
- Validate tokens on every request
- Implement token revocation capability

## Authorization

### Access Control
- Check permissions on every protected operation
- Verify resource ownership before access
- Implement principle of least privilege
- Use role-based or attribute-based access control
- Never rely solely on client-side checks

### API Security
- Authenticate all API endpoints (except public ones)
- Implement rate limiting
- Use CORS appropriately
- Validate Content-Type headers
- Log access attempts

## Data Protection

### Sensitive Data
- Encrypt sensitive data at rest
- Use TLS/HTTPS for data in transit
- Never log passwords, tokens, or PII
- Mask sensitive data in error messages
- Implement data retention policies

### Secrets Management
- Store secrets in environment variables
- Never commit secrets to version control
- Use secret management services in production
- Rotate secrets regularly
- Use different secrets per environment

## Output Encoding

### XSS Prevention
- Encode output based on context (HTML, JS, URL, CSS)
- Use templating engines with auto-escaping
- Sanitize HTML if user-generated content is allowed
- Set Content-Type headers correctly
- Use Content-Security-Policy headers

### Response Headers
- Set X-Content-Type-Options: nosniff
- Set X-Frame-Options or CSP frame-ancestors
- Use Strict-Transport-Security in production
- Remove server version headers

## Dependency Security

### Package Management
- Keep dependencies updated
- Use lock files for reproducible builds
- Audit dependencies regularly (npm audit, pip-audit)
- Avoid packages with known vulnerabilities
- Minimize dependency count

## Error Handling

### Secure Errors
- Never expose stack traces to users
- Log detailed errors server-side
- Return generic error messages to clients
- Include correlation IDs for debugging
- Don't reveal system information in errors

## Server-Side Rendering Security

### SSR Considerations
- Sanitize data before rendering to HTML
- Don't expose server environment to client
- Validate redirects to prevent open redirect
- Use nonces for inline scripts with CSP
- Be careful with hydration mismatches exposing data
