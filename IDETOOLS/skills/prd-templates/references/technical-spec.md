# Technical Specification Template

## Document Information
Generate metadata including version, status, date, and author based on the current context.

## 1. System Overview

### 1.1 Purpose
Define what the system does and the problem it solves based on the PRD.

### 1.2 Scope
Specify the boundaries of this technical specification, clarifying what is included and excluded.

## 2. Architecture Decisions
Document major technical decisions that shape the system; ask the user about constraints, preferences, and existing infrastructure.

### 2.1 ADR-001
Create the first architecture decision record with context, decision, and consequences; derive from the most critical technical choice.

### 2.2 ADR-002
Add additional ADRs as needed for significant decisions identified during planning.

## 3. Project Structure
Design the directory layout based on chosen framework and architecture patterns; present to user for approval.

## 4. Database Design
Design the data model and relationships based on entities identified in the PRD; ask about existing databases or preferences.

### 4.1 Entity Relationship Diagram
Create a visual representation of entities and their relationships using text-based diagrams.

### 4.2 Indexing Strategy
Define database indexes for query optimization based on expected access patterns.

### 4.3 Row-Level Security Policies
Specify access control rules if the database supports RLS; derive from authorization requirements.

## 5. API Specification
Design the API layer based on frontend needs and integrations; ask about REST vs GraphQL preferences.

### 5.1 Router Structure
Organize API routes into logical groupings based on domain entities.

### 5.2 Example Router Implementation
Provide standard CRUD patterns as reference implementations for the defined endpoints.

### 5.3 Webhook Endpoints
Define webhook handlers for any external service integrations identified in the PRD.

## 6. Authentication & Authorization
Design the auth system based on user types and security requirements from the PRD.

### 6.1 Auth Configuration
Specify authentication providers, session handling, and callbacks; ask about OAuth providers or existing auth systems.

### 6.2 Role-Based Access Control
Define roles, permissions, and authorization logic based on user personas and access requirements.

## 7. File Upload & Media Processing
Design file handling if the PRD includes upload features; skip if not applicable.

### 7.1 Upload Flow
Specify the process for accepting, validating, and storing uploaded files.

### 7.2 Storage Client
Define the storage abstraction layer and provider configuration.

## 8. Caching Strategy
Design caching for performance-critical paths; ask about expected traffic and latency requirements.

### 8.1 Cache Layer
Specify cache configuration, key patterns, and TTL values based on data volatility.

### 8.2 Cache Invalidation
Define rules for when and how cached data is cleared to maintain consistency.

## 9. Error Handling
Design consistent error management across the application.

### 9.1 Error Types
Define custom error classes and their use cases based on failure modes in the system.

### 9.2 Global Error Handler
Specify centralized error catching, logging, and response formatting.

## 10. Environment Variables
List all required configuration values; group by service and indicate which are secrets.

## Additional Sections
Add sections for background jobs, real-time features, third-party integrations, or other needs identified in the PRD.
