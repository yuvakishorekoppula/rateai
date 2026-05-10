

# System Architecture

## High-Level Architecture Diagram (Mermaid)

```mermaid
flowchart TD

    A[User Uploads Product URL / Review Data] --> B[Frontend - Next.js]
    B --> C[API Route / Backend Service]

    C --> D[Fetch Product Reviews]
    D --> E[AI Processing Layer]

    E --> F[Sentiment Analysis]
    E --> G[Fake Review Detection]
    E --> H[Price & Competitor Analysis]

    F --> I[Audit Scoring Engine]
    G --> I
    H --> I

    I --> J[Generate Audit Report]
    J --> K[Store Results in Supabase]

    K --> L[Dashboard UI]
    J --> L

    L --> M[User Views Insights & Recommendations]

    # Data Flow

```mermaid
sequenceDiagram

    participant U as User
    participant F as Frontend (Next.js)
    participant A as API Backend
    participant DB as Supabase
    participant AI as OpenAI API
    participant R as Audit Report Engine

    U->>F: Enter Product URL / Upload Reviews
    F->>A: Send Audit Request

    A->>A: Validate & Clean Input
    A->>DB: Fetch / Store Product Data

    A->>AI: Send Reviews for Analysis
    AI-->>A: Return Sentiment & Insights

    A->>R: Generate Audit Score
    R-->>A: Final Audit Result

    A->>DB: Save Audit Report
    A-->>F: Return Audit Response

    F-->>U: Display Dashboard & Insights

    # Why I Chose This Stack

## Frontend — Next.js

- Fast development with React ecosystem
- Built-in API routes for full-stack support
- Server-side rendering improves performance
- Easy deployment using Vercel
- Good developer experience for scalable apps

---

## Backend — Node.js

- Non-blocking asynchronous architecture
- Efficient for API-heavy applications
- Handles concurrent requests well
- Smooth integration with AI services and databases

---

## Database — Supabase

- PostgreSQL-based relational database
- Built-in authentication support
- Real-time database features
- Easy integration with Next.js applications
- Reduces backend setup complexity

---

## AI Layer — OpenAI API

- Strong NLP and sentiment analysis capabilities
- Helps summarize and analyze reviews
- Flexible prompt-based workflows
- Fast integration for AI-powered auditing

---

## Deployment — Vercel

- Optimized for Next.js applications
- Automatic CI/CD deployment pipeline
- Preview deployments for testing
- Edge network improves performance globally

---

## Overall Stack Benefits

The stack was selected to prioritize:

- Rapid development
- Scalability
- AI integration
- Clean developer workflow
- Fast deployment
- Maintainability
- Real-time user experience

# Scaling Plan — Handling 10k+ Audits Per Day

## Current Limitation

The current architecture works well for MVP-scale traffic, but at 10k+ audits/day the following bottlenecks would appear:

- synchronous AI processing
- API timeout risks
- repeated database reads
- expensive AI requests
- single backend dependency
- limited observability

To support production-scale traffic, the system architecture would evolve as follows.

---

# 1. Queue-Based Background Processing

## Current
```text
User Request → AI Processing → Response

## Improved 
User Request
      ↓
API Gateway
      ↓
Job Queue (BullMQ / RabbitMQ / Kafka)
      ↓
Background Workers
      ↓
AI Processing Engine
      ↓
Database Storage
      ↓
Dashboard Retrieval

# 2. Redis Caching Layer
Frontend
    ↓
API Layer
    ↓
Redis Cache
    ↓ (cache miss)
Database / AI Service

# 3. Microservices Architecture
## Improved 
                ┌────────────────┐
                │ API Gateway    │
                └──────┬─────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼

Auth Service     Audit Service     AI Analysis Service

    ▼                  ▼                  ▼

User DB         Audit DB          Vector DB / AI APIs


# 4. Database Optimization
## Improved
- PostgreSQL indexing
- read replicas
- partitioned audit tables
- query optimization
- connection pooling

# 5. AI Cost Optimization Pipeline
## Improved
Reviews
   ↓
Preprocessing Layer
   ↓
Deduplication + Filtering
   ↓
Batch Summarization
   ↓
LLM Processing

# 6. Containerization & Auto Scaling
                Load Balancer
                       ↓

        ┌────────┬────────┬────────┐
        ▼        ▼        ▼

     App Pod   App Pod   App Pod
        │        │        │
        └────────┴────────┘
                 ↓
            Kubernetes


# Final Production Architecture
Users
  ↓
CDN / Load Balancer
  ↓
API Gateway
  ↓
Redis Cache
  ↓
Job Queue
  ↓
Worker Cluster
  ↓
AI Processing Services
  ↓
PostgreSQL + Read Replicas
  ↓
Analytics Dashboard