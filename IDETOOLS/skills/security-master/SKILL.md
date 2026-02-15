---
name: security-master
description: >
  Comprehensive security guide covering OWASP Top 10, threat modeling,
  secure coding patterns, API security, dependency auditing, and compliance.
  Consolidates 12 security skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Security Master Skill

Comprehensive security reference for application security, infrastructure security, compliance, and security testing. Use this skill for security reviews, threat modeling, compliance assessments, and implementing security best practices.

## When to Use This Skill

Invoke this skill when you need to:
- **Security review** — "audit my code for security issues", "review this API for vulnerabilities"
- **Threat modeling** — "run a STRIDE analysis", "identify security threats in this architecture"
- **Compliance check** — "is this GDPR compliant?", "do we meet SOC 2 requirements?"
- **Secure implementation** — "how do I prevent SQL injection?", "implement secure authentication"
- **Dependency audit** — "check for vulnerable dependencies", "set up automated security scanning"
- **Security testing** — "configure SAST tools", "what security tests should I write?"

## OWASP Top 10 Quick Reference

### 1. Broken Access Control
**Risk:** Users accessing resources they shouldn't (privilege escalation, IDOR, missing authorization).

**Prevention:**
- Deny by default; require explicit authorization checks
- Use centralized authorization logic (RBAC, ABAC)
- Validate ownership on every access: `if (resource.userId !== currentUser.id) throw Forbidden`
- Log all access control failures

### 2. Cryptographic Failures
**Risk:** Sensitive data exposed due to weak/missing encryption, insecure key management, outdated algorithms.

**Prevention:**
- Encrypt data at rest (databases, file storage) and in transit (TLS 1.2+)
- Use strong algorithms: AES-256, RSA-4096, bcrypt/argon2 for passwords
- Never store plaintext passwords or API keys
- Implement key rotation policies
- Avoid deprecated protocols (SSLv3, TLS 1.0/1.1)

### 3. Injection
**Risk:** SQL, NoSQL, OS command, LDAP injection via untrusted input.

**Prevention:**
- Use parameterized queries/prepared statements exclusively
- Use ORM/query builders (Prisma, TypeORM, SQLAlchemy)
- Validate and sanitize all input (whitelist approach)
- Escape special characters for dynamic queries
- Principle of least privilege for database accounts

### 4. Insecure Design
**Risk:** Architecture-level flaws, missing threat modeling, insufficient security controls.

**Prevention:**
- Conduct threat modeling during design phase (see STRIDE section)
- Use secure design patterns (zero trust, defense in depth)
- Implement rate limiting, circuit breakers, backpressure
- Security requirements in every user story
- Document security boundaries and trust zones

### 5. Security Misconfiguration
**Risk:** Default credentials, verbose errors, unnecessary features enabled, unpatched systems.

**Prevention:**
- Remove default accounts and sample applications
- Disable directory listings, stack traces in production
- Keep all software updated (OS, frameworks, libraries)
- Use security headers (CSP, HSTS, X-Frame-Options)
- Harden configurations using CIS benchmarks

### 6. Vulnerable and Outdated Components
**Risk:** Using libraries with known CVEs, unmaintained dependencies.

**Prevention:**
- Run `npm audit` / `pip-audit` in CI/CD
- Enable Dependabot/Renovate for automated updates
- Monitor CVE databases (NVD, Snyk, GitHub Security Advisories)
- Remove unused dependencies
- Use lock files (package-lock.json, poetry.lock) and verify checksums

### 7. Identification and Authentication Failures
**Risk:** Weak passwords, credential stuffing, broken session management, missing MFA.

**Prevention:**
- Enforce strong password policies (min 12 chars, complexity)
- Implement MFA for sensitive operations
- Use secure session management (httpOnly, secure, SameSite cookies)
- Rate limit login attempts, implement account lockout
- Hash passwords with bcrypt/argon2 (cost factor ≥12)
- Never log credentials

### 8. Software and Data Integrity Failures
**Risk:** Unsigned updates, insecure CI/CD, deserialization attacks, untrusted sources.

**Prevention:**
- Use signed commits and verified artifacts
- Implement SRI (Subresource Integrity) for CDN resources
- Verify checksums and signatures for downloads
- Avoid native deserialization of untrusted data (use JSON schema validation)
- Use immutable infrastructure and container image signing

### 9. Security Logging and Monitoring Failures
**Risk:** Attacks undetected, insufficient audit trails, logs not protected.

**Prevention:**
- Log authentication events (login, logout, failed attempts)
- Log authorization failures and privilege changes
- Include context: userId, IP, timestamp, action
- Protect logs from tampering (write-only access, log forwarding)
- Set up alerting for suspicious patterns (multiple failed logins, privilege escalation)
- Centralize logs (ELK, Splunk, CloudWatch)

### 10. Server-Side Request Forgery (SSRF)
**Risk:** Application fetching remote resources controlled by attacker, accessing internal services.

**Prevention:**
- Validate and sanitize all URLs (whitelist allowed domains)
- Use network segmentation (block internal IPs from web tier)
- Disable HTTP redirects for user-supplied URLs
- Implement URL schema validation (allow only http/https)
- Use allowlists for external services

## Secure Coding Patterns

### Input Validation and Sanitization

```typescript
// ❌ INSECURE: No validation
app.post('/api/user', (req, res) => {
  const { email, age } = req.body;
  db.insert({ email, age });
});

// ✅ SECURE: Zod schema validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/)
});

app.post('/api/user', (req, res) => {
  const validated = userSchema.parse(req.body); // Throws if invalid
  db.insert(validated);
});
```

### Output Encoding (XSS Prevention)

```javascript
// ❌ INSECURE: Direct HTML insertion
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML += comment;
}

// ✅ SECURE: Use textContent or framework escaping
function displayUserComment(comment) {
  const p = document.createElement('p');
  p.textContent = comment; // Auto-escapes
  document.getElementById('comments').appendChild(p);
}

// React automatically escapes
function Comment({ text }) {
  return <p>{text}</p>; // Safe
}
```

### SQL Injection Prevention

```python
# ❌ INSECURE: String concatenation
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    return db.execute(query)

# ✅ SECURE: Parameterized query
def get_user(username):
    query = "SELECT * FROM users WHERE username = ?"
    return db.execute(query, (username,))

# ✅ SECURE: ORM
def get_user(username):
    return User.query.filter_by(username=username).first()
```

### Authentication (Password Hashing)

```javascript
// ❌ INSECURE: Plaintext or weak hash
const bcrypt = require('bcrypt');

async function createUser(email, password) {
  const hash = crypto.createHash('md5').update(password).digest('hex'); // Weak!
  await db.insert({ email, password: hash });
}

// ✅ SECURE: bcrypt with cost factor
const SALT_ROUNDS = 12;

async function createUser(email, password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  await db.insert({ email, passwordHash: hash });
}

async function verifyPassword(email, password) {
  const user = await db.findByEmail(email);
  return await bcrypt.compare(password, user.passwordHash);
}
```

### Authorization (RBAC Pattern)

```typescript
// ✅ SECURE: Centralized authorization
enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

enum Permission {
  READ_POST = 'read:post',
  WRITE_POST = 'write:post',
  DELETE_POST = 'delete:post',
  BAN_USER = 'ban:user'
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_POST, Permission.WRITE_POST],
  [Role.MODERATOR]: [Permission.READ_POST, Permission.WRITE_POST, Permission.DELETE_POST],
  [Role.ADMIN]: Object.values(Permission)
};

function requirePermission(permission: Permission) {
  return (req, res, next) => {
    const userPermissions = rolePermissions[req.user.role];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.delete('/api/posts/:id', requirePermission(Permission.DELETE_POST), deletePost);
```

### CSRF Protection

```javascript
// ✅ SECURE: CSRF token middleware
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', csrfProtection, (req, res) => {
  // Token validated automatically
  processForm(req.body);
});

// Frontend
<form method="POST" action="/submit">
  <input type="hidden" name="_csrf" value="{{csrfToken}}" />
</form>
```

### Secure Headers

```javascript
// ✅ SECURE: Helmet.js for Express
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Avoid unsafe-inline in production
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));
```

## API Security

### Authentication Options

```typescript
// ✅ JWT Authentication
import jwt from 'jsonwebtoken';

function generateToken(userId: string): string {
  return jwt.sign(
    { userId, iat: Date.now() },
    process.env.JWT_SECRET!,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}

function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

// Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = authHeader.substring(7);
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Rate Limiting

```javascript
// ✅ Express rate limiter
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth endpoints
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### Input Validation (API Layer)

```typescript
// ✅ Zod validation middleware
import { z } from 'zod';

function validateBody(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors
        });
      }
      next(err);
    }
  };
}

// Usage
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).max(5).optional()
});

app.post('/api/posts', validateBody(createPostSchema), createPost);
```

### CORS Configuration

```javascript
// ✅ SECURE: Explicit CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// ❌ INSECURE: Allow all origins
app.use(cors()); // Don't do this in production
```

### Secure Error Responses

```javascript
// ❌ INSECURE: Leaking internal details
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// ✅ SECURE: Generic error messages
app.use((err, req, res, next) => {
  console.error(err); // Log for debugging

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Don't leak internal errors
  res.status(500).json({ error: 'Internal server error' });
});
```

## Dependency Security

### npm Audit

```bash
# Check for vulnerabilities
npm audit

# Show detailed report
npm audit --json > audit-report.json

# Attempt automatic fixes (updates dependencies)
npm audit fix

# Fix including breaking changes
npm audit fix --force

# CI/CD integration — fail build on high/critical
npm audit --audit-level=high
```

### pip-audit (Python)

```bash
# Install
pip install pip-audit

# Run audit
pip-audit

# Check specific requirements file
pip-audit -r requirements.txt

# Output JSON
pip-audit --format json > audit.json

# CI/CD — fail on any vulnerability
pip-audit --strict
```

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
    # Only security updates
    versioning-strategy: increase-if-necessary
```

### Renovate Configuration

```json
{
  "extends": ["config:base"],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"]
  },
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    },
    {
      "matchUpdateTypes": ["minor", "patch"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true
    }
  ]
}
```

### Lock File Importance

**Always commit lock files:**
- `package-lock.json` (npm)
- `yarn.lock` (Yarn)
- `pnpm-lock.yaml` (pnpm)
- `poetry.lock` (Python Poetry)
- `Gemfile.lock` (Ruby)

Lock files ensure reproducible builds and prevent supply chain attacks via dependency confusion.

### Evaluating Package Trustworthiness

Before adding a dependency, check:

1. **Maintenance activity** — Recent commits? Active issues/PRs?
2. **Download stats** — npm weekly downloads, GitHub stars
3. **Security history** — Past CVEs? How quickly were they fixed?
4. **Dependencies** — How many transitive deps? Any red flags?
5. **License** — Compatible with your project?
6. **Code quality** — Tests? CI/CD? Documentation?
7. **Ownership** — Reputable maintainer? Organization-backed?

Tools:
- [Snyk Advisor](https://snyk.io/advisor/)
- [Socket.dev](https://socket.dev/)
- [npm trends](https://www.npmtrends.com/)

## Secrets Management

### Never Commit Secrets

```bash
# ❌ NEVER do this
const API_KEY = "sk_live_abc123..."; // Hardcoded

# ✅ Use environment variables
const API_KEY = process.env.STRIPE_API_KEY;
```

### .env Files and .gitignore

```bash
# .env (NEVER commit this)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your-secret-key-here
STRIPE_API_KEY=sk_live_abc123...

# .env.example (commit this as template)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=generate-a-secret-key
STRIPE_API_KEY=your-stripe-key
```

```gitignore
# .gitignore
.env
.env.local
.env.*.local
*.pem
*.key
secrets/
```

### Environment Variable Patterns

```javascript
// ✅ Validate required env vars at startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

validateEnv();
```

### Cloud Secrets Management

**Azure Key Vault:**
```javascript
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const client = new SecretClient(process.env.VAULT_URL, credential);

const secret = await client.getSecret("database-password");
```

**AWS Secrets Manager:**
```javascript
const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({ region: 'us-east-1' });

const data = await client.getSecretValue({ SecretId: 'prod/db/password' }).promise();
const secret = JSON.parse(data.SecretString);
```

**Google Secret Manager:**
```javascript
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

const [version] = await client.accessSecretVersion({
  name: 'projects/my-project/secrets/db-password/versions/latest',
});
const secret = version.payload.data.toString();
```

## Threat Modeling (STRIDE)

STRIDE is a framework for identifying security threats in system design.

### STRIDE Categories

| Threat | Target | Example |
|--------|--------|---------|
| **Spoofing** | Authentication | Attacker impersonates legitimate user |
| **Tampering** | Integrity | Attacker modifies data in transit or at rest |
| **Repudiation** | Non-repudiation | User denies performing an action (no audit trail) |
| **Information Disclosure** | Confidentiality | Sensitive data exposed to unauthorized parties |
| **Denial of Service** | Availability | System unavailable due to resource exhaustion |
| **Elevation of Privilege** | Authorization | User gains higher permissions than intended |

### Running a Threat Model Session

**Participants:** Architect, security engineer, developers, product owner

**Steps:**

1. **Define scope** — What system/feature are we modeling?
2. **Create data flow diagram** — Components, data flows, trust boundaries
3. **Identify threats** — Apply STRIDE to each component/flow
4. **Rate risks** — Impact (H/M/L) × Likelihood (H/M/L)
5. **Mitigate** — Document controls and residual risk
6. **Review** — Update model when architecture changes

### Threat Modeling Template

```markdown
## Threat Model: [System/Feature Name]

### Scope
- **System:** User authentication service
- **Boundaries:** Web app → Auth API → Database
- **Assets:** User credentials, session tokens, PII

### Data Flow Diagram
[Insert diagram or describe flow]

User → [TLS] → Load Balancer → [TLS] → Auth API → [TLS] → PostgreSQL

### Threats Identified

#### T1: Session Token Theft (Spoofing)
- **Component:** Auth API
- **Threat:** Attacker steals JWT from intercepted traffic or XSS
- **Impact:** High (full account takeover)
- **Likelihood:** Medium
- **Mitigation:**
  - Use httpOnly, secure, SameSite cookies
  - Implement CSP to prevent XSS
  - Short token expiration (15m)
  - Refresh token rotation
- **Residual Risk:** Low

#### T2: SQL Injection (Tampering)
- **Component:** Database queries
- **Threat:** Attacker injects SQL via login form
- **Impact:** High (data breach, data loss)
- **Likelihood:** Low (using ORM)
- **Mitigation:**
  - Parameterized queries only (Prisma ORM)
  - Input validation (Zod schemas)
  - WAF rules for SQL patterns
- **Residual Risk:** Very Low

#### T3: Lack of Audit Trail (Repudiation)
- **Component:** Authentication events
- **Threat:** User denies login activity
- **Impact:** Medium (compliance, forensics)
- **Likelihood:** High (if no logging)
- **Mitigation:**
  - Log all login attempts (success/failure)
  - Include IP, user-agent, timestamp
  - Tamper-proof logging (write-only S3)
- **Residual Risk:** Low

[Continue for all identified threats...]

### Summary
- **Total threats identified:** 12
- **High risk:** 3 (all mitigated)
- **Medium risk:** 5 (4 mitigated, 1 accepted)
- **Low risk:** 4 (accepted)
```

## Security Audit Checklist

### Code Review Checklist (15 Items)

- [ ] **Input validation** — All user input validated/sanitized (Zod, Joi, express-validator)
- [ ] **SQL injection** — Only parameterized queries or ORM used
- [ ] **XSS prevention** — Output encoding, CSP headers
- [ ] **CSRF protection** — Tokens on state-changing requests
- [ ] **Authentication** — bcrypt/argon2 for passwords, MFA available
- [ ] **Authorization** — Access checks on every resource access
- [ ] **Secrets** — No hardcoded credentials, using env vars or secrets manager
- [ ] **Error handling** — Generic error messages, no stack traces in production
- [ ] **Logging** — Auth events logged, PII redacted
- [ ] **Dependencies** — `npm audit` clean, no known CVEs
- [ ] **HTTPS** — TLS 1.2+ enforced, HSTS enabled
- [ ] **Secure headers** — CSP, X-Frame-Options, X-Content-Type-Options
- [ ] **Rate limiting** — Applied to auth and sensitive endpoints
- [ ] **Session management** — Secure cookies, expiration, logout
- [ ] **File uploads** — Type validation, size limits, virus scanning

### Infrastructure Checklist (10 Items)

- [ ] **Network segmentation** — DMZ, app tier, data tier separated
- [ ] **Firewall rules** — Least privilege, only required ports open
- [ ] **Patch management** — OS and software up to date
- [ ] **Access control** — SSH keys only, no password auth
- [ ] **Monitoring** — Intrusion detection (IDS/IPS), log aggregation
- [ ] **Backups** — Encrypted, tested restore process
- [ ] **Encryption** — Data at rest encrypted (disk encryption)
- [ ] **Container security** — Images scanned, non-root user, minimal base
- [ ] **Secret rotation** — Automated rotation for DB passwords, API keys
- [ ] **Incident response** — Runbooks documented, team trained

### CI/CD Security

- [ ] **Secrets in pipelines** — Use secret managers (GitHub Secrets, GitLab CI/CD vars)
- [ ] **Signed commits** — GPG signing required for main branch
- [ ] **SAST in CI** — Semgrep, SonarQube, or CodeQL on every PR
- [ ] **Dependency scanning** — `npm audit` / `pip-audit` in CI, fail on high/critical
- [ ] **Container scanning** — Trivy, Snyk, or Clair for image vulnerabilities
- [ ] **Artifact verification** — Sign and verify build artifacts
- [ ] **Least privilege** — CI/CD service accounts with minimal permissions
- [ ] **Audit logs** — All deployments logged with approver, timestamp

## Compliance Quick Reference

### GDPR Basics for Developers

**Key principles:**
- **Lawful basis** — Consent, contract, legal obligation, legitimate interest
- **Data minimization** — Collect only what's necessary
- **Purpose limitation** — Use data only for stated purpose
- **Right to access** — Users can request their data
- **Right to erasure** — Users can request deletion ("right to be forgotten")
- **Data portability** — Export user data in machine-readable format
- **Security** — Appropriate technical and organizational measures

**Implementation:**
```typescript
// User data export endpoint
app.get('/api/user/export', authenticateUser, async (req, res) => {
  const userData = await db.getUserData(req.user.id);
  res.json(userData); // JSON format for portability
});

// User deletion endpoint
app.delete('/api/user', authenticateUser, async (req, res) => {
  await db.deleteUser(req.user.id); // Hard delete or anonymize
  res.status(204).send();
});
```

### SOC 2 Essentials

**Trust Service Criteria:**
- **Security** — Protection against unauthorized access
- **Availability** — System available as agreed (SLA)
- **Processing Integrity** — System processes data correctly
- **Confidentiality** — Confidential data protected
- **Privacy** — Personal information handled per commitments

**Developer responsibilities:**
- Implement access controls (RBAC)
- Log security events (authentication, authorization failures)
- Encrypt sensitive data (at rest and in transit)
- Maintain audit trails (who did what, when)
- Follow change management (code review, deployment approvals)

### PCI DSS (Payment Card Industry)

**Key requirements:**
- **Requirement 2** — Remove default passwords
- **Requirement 3** — Protect stored cardholder data (encrypt, tokenize)
- **Requirement 4** — Encrypt transmission over public networks (TLS)
- **Requirement 6** — Secure coding practices (OWASP Top 10)
- **Requirement 8** — Unique IDs, strong authentication
- **Requirement 10** — Log all access to cardholder data

**Best practice:** Use payment processors (Stripe, PayPal) to avoid PCI scope.

```javascript
// ❌ INSECURE: Storing card numbers
await db.insert({ cardNumber: req.body.cardNumber });

// ✅ SECURE: Use Stripe tokenization
const paymentMethod = await stripe.paymentMethods.create({
  type: 'card',
  card: { token: req.body.stripeToken }
});
await db.insert({ stripePaymentMethodId: paymentMethod.id });
```

## Security Testing

### SAST Tools (Static Analysis)

**ESLint Security Plugins (JavaScript/TypeScript):**
```bash
npm install --save-dev eslint-plugin-security eslint-plugin-no-secrets

# .eslintrc.json
{
  "plugins": ["security", "no-secrets"],
  "extends": ["plugin:security/recommended"],
  "rules": {
    "no-secrets/no-secrets": "error"
  }
}
```

**Bandit (Python):**
```bash
pip install bandit

# Scan all Python files
bandit -r . -f json -o bandit-report.json

# CI/CD — fail on medium severity
bandit -r . -ll
```

**Semgrep (Multi-language):**
```bash
# Install
pip install semgrep

# Run with OWASP rules
semgrep --config=p/owasp-top-ten --error

# Custom rules
semgrep --config=.semgrep/rules/
```

### DAST Basics (Dynamic Analysis)

**OWASP ZAP (Zed Attack Proxy):**
```bash
# Docker quick start
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com

# Full scan with report
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://example.com -r zap-report.html
```

**Burp Suite:**
- Manual proxy-based testing
- Configure browser to use Burp proxy (127.0.0.1:8080)
- Intercept/modify requests, test for vulnerabilities
- Professional version has automated scanner

### Dependency Scanning in CI

**GitHub Actions:**
```yaml
name: Security Audit

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

      - name: Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          severity: 'CRITICAL,HIGH'
```

**GitLab CI:**
```yaml
security:
  stage: test
  image: node:20
  script:
    - npm audit --audit-level=high
    - npx semgrep --config=p/owasp-top-ten --error
  only:
    - merge_requests
    - main
```

## Related Skills

- `security-auditor` — Security audit agent (comprehensive assessments)
- `sast-configuration` — SAST tool setup (Semgrep, SonarQube, CodeQL)
- `deployment-pipeline-design` — Secure CI/CD pipeline design
- `github-workflow-automation` — GitHub Actions security workflows

## Quick Reference Commands

```bash
# Dependency audits
npm audit --audit-level=high
pip-audit --strict

# SAST scanning
semgrep --config=p/owasp-top-ten --error
bandit -r . -ll

# Container scanning
docker scan myapp:latest
trivy image myapp:latest

# Secret scanning
git-secrets --scan
gitleaks detect --source=. --verbose

# Security headers check
curl -I https://example.com | grep -i "security\|x-frame\|x-content\|strict-transport"
```

## Next Steps

After reviewing this skill:

1. **Run security audit** — Use checklist to assess current codebase
2. **Fix critical issues** — Address OWASP Top 10 vulnerabilities first
3. **Implement SAST** — Add `semgrep` or similar to CI/CD
4. **Enable dependency scanning** — Dependabot or Renovate
5. **Conduct threat modeling** — STRIDE analysis for core features
6. **Document security practices** — Add to team wiki/CLAUDE.md
7. **Train team** — Share findings, run workshops
8. **Monitor continuously** — Set up alerts for security events

---

**Remember:** Security is not a one-time task. Continuously review, test, and improve your security posture. When in doubt, apply defense in depth and principle of least privilege.
