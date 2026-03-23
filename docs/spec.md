# Contractor Hub — Technical Specification & Product Requirements

**Status:** In Development  
**Version:** 0.1  
**Last Updated:** March 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem)
3. [The Solution](#3-the-solution)
4. [Product Philosophy](#4-product-philosophy)
5. [User Personas](#5-user-personas)
6. [Core Feature Domains](#6-core-feature-domains)
7. [Design Principles](#7-design-principles)
8. [Data Architecture](#8-data-architecture)
9. [Technical Stack](#9-technical-stack)
10. [Infrastructure & Deployment](#10-infrastructure--deployment)
11. [Security & Compliance](#11-security--compliance)
12. [AI Integration](#12-ai-integration)
13. [Development Roadmap](#13-development-roadmap)
14. [Open Questions & Future Considerations](#14-open-questions--future-considerations)

---

## 1. Executive Summary

Contractor Hub is a B2B SaaS platform for IT consultancies operating in government and regulated markets. It turns career progression into a data engine — capturing structured evidence of work at the source, automating the promotion track for employees, and dramatically reducing the time required to assemble bid responses for government frameworks such as SFIA v9 and DDaT.

The platform is designed with compliance as a competitive advantage. By linking verified career evidence with real-time security clearance and citizenship tracking, consultancies can go from identifying a bid opportunity to exporting a validated team in minutes — while maintaining an audit-ready posture that satisfies ISO 27001 and government procurement standards.

The initial target customer is a mid-size UK IT consultancy doing government contract work. The platform is architected for multi-tenancy from day one to support B2B sales to additional consultancies.

---

## 2. The Problem

In an IT consultancy, the product is the collective expertise of its people. Most companies manage this inventory with spreadsheets and disconnected documents. This creates five compounding failures.

**Inventory blindness.** Leadership cannot see what skills and experience exist across the organisation, let alone what is available for a specific bid. The information exists only in the heads of individual managers.

**Framework mapping friction.** Government tenders require staff to be mapped to rigid frameworks (SFIA v9, DDaT). A consultancy using different internal terminology has to manually retrofit experience into framework definitions every time an RFP lands — a scramble during a critical window.

**The black box career path.** Promotion decisions are subjective, driven by the loudest voice or the opinion of a line manager who may not share the employee's technical background. High-performing staff leave when they feel their growth is invisible or unfairly measured.

**Hero culture.** Existing peer recognition rewards visibility over value. People are rewarded for dramatic interventions ("hero work") while the critical glue work — mentoring, documentation, refactoring, maintaining standards — goes unnoticed. This creates an environment where individuals compete for recognition rather than collaborating on delivery.

**Vetting and eligibility blindness.** Security clearances, residency histories, citizenship, and visa statuses are managed in spreadsheets with manual reminders. If a staff member's SC clearance expires or they lack the required residency for a high-side project, the company faces immediate contractual and financial penalties.

---

## 3. The Solution

Contractor Hub solves these problems through a self-sustaining Value Loop where the output of employee career growth becomes the input for company business growth.

### The Value Loop

**Step 1 — Journal.** An employee logs a S.T.A.R. (Situation, Task, Action, Result) entry after a sprint or project milestone. The app automatically translates that work into SFIA and DDaT progression levels. The employee sees their promotion readiness score move immediately.

**Step 2 — Verify.** A Technical Mentor or Chapter Lead verifies the impact of that entry. Once verified, the entry is locked and becomes bid-ready. The employee no longer has to reconstruct their achievements at annual review time.

**Step 3 — Bid.** When the Bid Team needs a team for an RFP, the system pulls verified S.T.A.R. entries directly into a formatted proposal — matched to the client's required framework.

**Step 4 — Promote.** Winning the bid puts the employee on a higher-profile project, generating better evidence, accelerating their next promotion. The loop completes.

### The AI-Ready Cumulative Effect

Every pass through the Value Loop enriches the organisation's structured metadata. By month six there is a heatmap of technical gaps. By month twelve there is a verified evidence library that AI can query in natural language — asking questions like "who has Home Office experience, active SC clearance, and DDaT Data Architect at Working level?"

---

## 4. Product Philosophy

These principles are non-negotiable constraints on design and development decisions.

**Framework Agnostic, Skill Specific.** Users speak work. The system speaks framework. Employees select internal skills in natural language (e.g. "Infrastructure as Code"). They never see "SFIA Level 4" during input. The mapping to SFIA or DDaT is a business logic problem solved in the application layer, not a data entry problem pushed to the user.

**Evidence over Opinion.** Progress is not based on time in role or manager intuition. It is based on proven, verified impact. Validated S.T.A.R. entries are the only currency for promotion and bidding. If it is not in the evidence locker, it did not happen. Progress bars only move when evidence is peer-verified.

**Never Overwrite, Always Append.** The database is a high-fidelity map of the company's history. Deleting or overwriting a relationship or skill level destroys the evidence chain required for government audits. Roles use "Transition" rather than "Edit" — capturing end dates for old roles and start dates for new ones. Every relationship record has a start date and an end date.

**Relationship-Based Visibility.** Data visibility is a function of professional relationship, not a rigid role hierarchy. A Squad Lead sees project blockers. A Technical Mentor sees skill gaps. Neither sees passport numbers unless they are also a Security Sponsor. Access is enforced at the database layer using PostgreSQL Row-Level Security, not just application-layer if/else logic.

**Sovereign and Secure.** In government work, security is the product. Sensitive data — clearances, visas, residency — is treated with the same rigour as a financial transaction. No sensitive field is shown by default. Every reveal action is intentional, logged, and time-limited.

**No Dead Data.** Data should never sit idle. If a user logs a skill, the app should suggest a mentor or relevant project. If a mentor has not verified an entry in 48 hours, the UI surfaces this as a priority action to keep the Value Loop moving.

---

## 5. User Personas

### The Consultant (The Inventory)

A technical or non-technical specialist (developer, PM, BA) working on client sites.

**Win condition:** "I know exactly what I need to do to get promoted, and my achievements are recorded even if my manager changes."

**Key needs:** Autonomy over career path. Evidence logging that takes less effort than writing an email. A real-time promotion readiness percentage. No requirement to understand government framework codes.

### The Chapter Lead / Technical Mentor (The Validator)

A senior peer responsible for technical standards and growth within a specific craft.

**Win condition:** "I can see the technical health of my team and provide objective mentorship without being bogged down in admin."

**Key needs:** A streamlined inbox of peer evidence to review. Skill heatmaps to identify chapter-wide gaps. Hard data to defend promotion recommendations objectively.

### The Bid Manager / Resource Manager (The Commercial Driver)

The person responsible for responding to government RFPs and staffing projects.

**Win condition:** "I can find a perfectly qualified, cleared, and available team for a bid in under 10 minutes."

**Key needs:** Advanced filtering by clearance level, DDaT role, availability, and sector experience. One-click generation of a capability bio from verified STAR entries. Zero risk of bidding someone whose SC clearance is about to expire.

### The Compliance Lead / HR (The Guardian)

Responsible for ISO 27001, GDPR, and government framework compliance.

**Win condition:** "We are audit-ready at all times, and sensitive data is only seen by those who truly need it."

**Key needs:** A non-erasable log of every time sensitive data was accessed. Automated alerts for visa expiries or residency gaps before they become legal issues.

---

## 6. Core Feature Domains

### 6.1 The Evidence Locker

The primary entry point for the Value Loop. Transforms daily work into corporate assets.

- Strictly partitioned S.T.A.R. input (four separate text areas — no general achievement fields)
- Mandatory contextual tags on every entry: Project Context, Sector, Security Environment
- Three-state verification workflow: Draft → Pending Verification → Verified
- Verification can only be performed by a user with an active Technical Mentor or Chapter Lead relationship to the author for that specific skill category
- Once verified, entries are immutable — only appendable with follow-up results
- Every entry tagged with sector and project context so bid searches return pre-contextualised results

### 6.2 The Growth Hub

The employee's personal dashboard for career acceleration.

- Promotion Readiness Heatmap showing current grade vs. next grade requirements
- Weighted readiness score: verified entries only, recency-weighted (12 months = 1.0x, 2+ years = 0.5x)
- Gap logic: if a grade requires three skills and the user has Level 0 in one, readiness cannot exceed 66%
- Skill gap analysis with targeted opportunity suggestions
- Mentor matching based on shared skill tags regardless of reporting structure
- Promotion application portal where employees package verified evidence into a formal dossier
- Kanban-style process tracking for promotion applications (Submitted → Interview → Board Review → Decision)
- OKR tracking alongside the evidence locker as a separate achievement journal

### 6.3 The Compliance Passport

The most sensitive area of the application. Manages sovereign data required for government work.

- Security clearance stacking (BPSS, SC, DV) with independent expiry trackers
- Residency and citizenship tracker with automatic eligibility calculation for 3, 5, and 10-year UK residency windows
- All sensitive fields masked by default — clearance reference numbers, passport details, home addresses render as blurred text or dots
- Reveal interaction: authorised user selects a business reason from a constrained dropdown, clicks Confirm, data is decrypted and shown for 60 seconds, then automatically re-masked
- Every reveal writes an immutable row to the audit log before the data is returned

### 6.4 The Bid Intelligence Centre

The interface for leadership and bid teams to query the organisation's inventory.

- Advanced filtering by clearance level, DDaT role, availability, sector experience, security context
- High-side safeguard: bid searches for classified projects only surface people who meet the clearance baseline — no accidental exposure of unqualified candidates
- Bid shortlist workspace for drafting a team against an RFP
- Automated capability bio generation pulling the three most relevant verified STAR entries for the bid context, formatted to the client's framework

### 6.5 The Continuous Feedback Engine

Replaces point-in-time performance reviews with high-fidelity, objective growth data.

- Micro-feedback prompts triggered by project milestones — designed to take under two minutes
- Three feedback visibility types: Public Praise, Private Praise, Constructive (Reviewer Only)
- Double-blind calibration buffer: constructive feedback routes to a Calibration Lead for review before it reaches the employee's dashboard
- Thematic aggregation: feedback visualised as a skill radar or sentiment trend rather than a chronological list of comments
- Peer endorsements for specific skills rather than general nominations
- "Glue Work" category explicitly tracking invisible contributions — documentation, mentoring, code reviews

---

## 7. Design Principles

### Perspective-Based UI

A single user often holds multiple roles. The interface adapts to the current intent of the user via a role switcher — no logout required.

- **Growth View:** Encouraging, visual, progress-oriented. Focus on SFIA/DDaT progress, skill heatmaps, STAR evidence.
- **Delivery View:** Efficient, data-dense. Focus on current project milestones, team allocation, capacity.
- **Compliance View:** Serious, minimalist. Focus on clearances, citizenship logs, audit trails. Data masking is prominent.

Upon login, every user sees their most urgent success driver first — a consultant sees their promotion bar, a mentor sees pending verifications, a bid manager sees open RFP deadlines.

### The "So What?" Rule

Every data field an employee fills in must have a clearly visible reason for its existence — e.g. "This field is required to map you to the DDaT Practitioner grade." Users should never feel they are filling in a form for someone else's benefit.

### Data Masking and the Reveal Interaction

Sensitive fields follow a strict Privacy by Interaction model:

1. Default state: field rendered as dots or blurred text
2. User clicks Reveal
3. Modal asks for a reason for access (constrained dropdown, not free text)
4. User confirms — data is decrypted, served to UI, audit log entry written simultaneously
5. Data auto-re-masks after 60 seconds of inactivity

### Design System

The UI uses an Ink & Amber design language — a dark, archival aesthetic built to feel trustworthy for government-adjacent work while remaining approachable for daily use. Colour tokens use OKLCH for perceptual uniformity and P3 wide gamut support. All contrast ratios meet WCAG AA minimum (4.5:1 for normal text). Typography pairs Playfair Display (editorial, human) with IBM Plex Mono (precise, institutional).

---

## 8. Data Architecture

### Model Type

PostgreSQL with a graph-relational hybrid pattern. The organisation and its relationships are modelled as a Directed Acyclic Graph stored within a relational database.

- **Nodes:** Users, Skills, Projects, Frameworks
- **Edges:** User Relationships (with temporal start/end dates and multi-role support)
- **Transactions:** Evidence Entries (S.T.A.R. logs)

Graph traversal uses PostgreSQL Recursive CTEs. No separate graph database is required at current scale.

### Core Schema Tables

| Table                   | Purpose                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `organizations`         | Multi-tenancy root — every user belongs to an organisation                             |
| `users`                 | Application users, linked to Better Auth via `auth_user_id`                            |
| `user_relationships`    | Directed edges between users with temporal columns and generated `is_active`           |
| `relationship_to_role`  | Many roles per relationship edge (e.g. LINE_MANAGER + TECHNICAL_MENTOR simultaneously) |
| `user_project_roles`    | Temporal project membership with allocation percentage                                 |
| `evidence_entries`      | S.T.A.R. entries with sector, security context, status, and skill mapping              |
| `skills`                | Internal skill taxonomy — natural language, not framework codes                        |
| `skill_levels`          | Complexity levels 1–5 per skill with criteria                                          |
| `external_frameworks`   | SFIA, DDaT, or custom client frameworks                                                |
| `external_skills`       | Framework-specific skill definitions with levels                                       |
| `framework_mappings`    | Many-to-many: internal skill level → external framework skill                          |
| `clearances`            | Security clearances with expiry tracking                                               |
| `visas`                 | Visa details with expiry                                                               |
| `user_citizenship`      | Citizenship records with acquisition method                                            |
| `residential_addresses` | Temporal address history for residency calculations                                    |
| `feedback`              | Peer feedback linked to evidence entries                                               |
| `audit_logs`            | Immutable access log — append-only, no UPDATE or DELETE permissions                    |

### Key Design Decisions

**Temporal relationships.** Every relationship edge has `start_date` and `end_date`. `is_active` is a generated column — never set by application code. When a role changes, the old record gets an `end_date` and a new record is created. This preserves the audit chain and allows the system to answer "who was Reyna's mentor in January 2025?" accurately.

**Framework mapping is a runtime calculation.** Internal skills are never stored as SFIA or DDaT levels. When an employee views their profile the backend joins `evidence_entries → framework_mappings → external_frameworks` at query time. This means adding a new framework requires no re-entry of existing evidence — the system re-scans against the new mapping rules.

**Promotion readiness is a weighted score.** Unverified entries count for 0%. Evidence from the last 12 months is weighted at 1.0x, evidence older than two years at 0.5x. Gap logic prevents lopsided promotions by capping the score if any required skill is at Level 0.

**Audit log is immutable by design.** The `audit_logs` table has no UPDATE or DELETE grants for any database user including the admin role. This is enforced at the PostgreSQL level, not just application logic.

**Multi-tenancy from day one.** Every user has an `organisation_id` foreign key. Row-Level Security policies filter all queries by organisation. A user from Consultancy A can never see data from Consultancy B.

---

## 9. Technical Stack

All decisions below reflect deliberate choices made with the following constraints: solo development, government-adjacent data sovereignty requirements, no vendor lock-in, self-hosting capability, and a path to AI features without re-architecture.

### Monorepo Structure

```
apps/
  api/       Hono server — the running backend process
  web/       SolidJS frontend — built by Vite into static assets
packages/
  db/        Drizzle schema, migrations, queries — shared data layer
  ui/        SolidJS component library — consumed by apps/web
  tokens/    OKLCH CSS design tokens — consumed by ui and web
```

### Frontend

| Concern        | Choice                              | Rationale                                                             |
| -------------- | ----------------------------------- | --------------------------------------------------------------------- |
| Framework      | SolidJS                             | Fine-grained reactivity, no virtual DOM, no vendor alignment concerns |
| Build tool     | Vite                                | Infrastructure-agnostic, fast HMR, no framework vendor dependency     |
| Router         | @solidjs/router                     | Official SolidJS router                                               |
| Styling        | CSS Modules + CSS custom properties | Native platform, no Tailwind dependency, tokens via OKLCH variables   |
| Component docs | Storybook 10 (solidjs-vite)         | Component isolation and visual testing                                |

Note: React and Next.js were deliberately excluded. Next.js has deepening vendor coupling to Vercel infrastructure. React Server Components introduce implicit platform dependencies. SolidJS has no equivalent commercial pressure.

### Backend

| Concern   | Choice                         | Rationale                                                                                           |
| --------- | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Framework | Hono                           | Fast, TypeScript-first, runs on any JS runtime, clean middleware model                              |
| Runtime   | Node.js (tsx in dev)           | Stability, ecosystem, compatible with company infrastructure                                        |
| ORM       | Drizzle                        | SQL-first, no magic, supports recursive CTEs and temporal queries, Drizzle Studio for visualisation |
| Database  | PostgreSQL (AWS RDS eu-west-2) | ACID, RLS, pgvector extension, temporal tables, UK data residency                                   |

### Authentication

| Concern        | Choice                                     | Rationale                                                                                                                                                                                                        |
| -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth library   | Better Auth                                | Open source, TypeScript-native, SolidJS adapter, Drizzle adapter, no per-user pricing                                                                                                                            |
| Enterprise SSO | OIDC via Better Auth SSO plugin            | Target company uses Okta — OIDC configured per-organisation at runtime, not hardcoded                                                                                                                            |
| Strategy       | Separate auth users from application users | `auth_user_id` foreign key on `usersTable` links Better Auth identity to application profile. Auth credentials in Better Auth schema, application data in own schema. Provider-swappable without data migration. |

### Environment Management

Single root `.env` file loaded by `dotenvx` at the workspace level. No per-package env loading. Variables namespaced by app for clarity. `.env.example` committed to git and kept current as the authoritative reference for required configuration.

---

## 10. Infrastructure & Deployment

### Target Environment

AWS eu-west-2 (London) throughout. This satisfies UK data residency requirements for government procurement without negotiation.

| Component    | Service             | Notes                                                                        |
| ------------ | ------------------- | ---------------------------------------------------------------------------- |
| API          | AWS ECS Fargate     | Serverless containers, no cluster management, scales to zero                 |
| Database     | AWS RDS PostgreSQL  | Managed, encrypted at rest, automated backups, Multi-AZ for production       |
| File storage | AWS S3 (eu-west-2)  | CV exports, evidence file attachments                                        |
| Frontend     | CloudFront + S3     | Static Vite build served via CDN                                             |
| Secrets      | AWS Secrets Manager | Runtime secret injection into ECS tasks — nothing sensitive in Docker images |

### Containerisation

Docker wraps the Hono API. Image stays small — no model weights, no static assets. Moving to Azure or GCP if a government client mandates a specific cloud provider is a configuration change, not a rebuild.

### Local Development

`docker-compose.yml` runs PostgreSQL, the Hono API, and the llama.cpp inference server as three services. Single `docker compose up` for the full stack. No cloud dependencies required for local development.

---

## 11. Security & Compliance

### ISO 27001 Requirements

- All sensitive PII fields (passport number, visa reference, clearance reference, home address) encrypted at the field level in the application layer before storage
- Every access to a sensitive field writes an immutable row to `audit_logs` before the data is returned — the backend cannot return decrypted data without simultaneously writing the log entry
- Audit log captures: viewer ID, target ID, field accessed, business reason, IP address, timestamp (microsecond precision)
- `audit_logs` table has no UPDATE or DELETE grants — append-only enforced at the database layer
- Row-Level Security enforced in PostgreSQL for all multi-tenant data isolation and relationship-based visibility

### GDPR

- Data processing within the UK (AWS eu-west-2) throughout
- Right to erasure handled via soft delete (`deleted_at` column) with a documented retention policy — hard deletion of PII on request while preserving anonymised audit trail integrity
- Data minimisation: sensitive fields not rendered in the DOM on initial page load — never exposed until explicitly requested

### Security Clearance Handling

- Clearance reference numbers masked by default in all views
- Reveal interaction requires business reason selection from a constrained enum — no free text
- Auto-re-mask after 60 seconds
- High-side bid searches filter by clearance baseline at the query layer — not a UI-only filter

---

## 12. AI Integration

### Philosophy

AI features are scoped to tasks where the model is classifying or querying structured data — low hallucination risk because outputs are verifiable against known schemas. Generative content (draft tenders, promotion letters) is explicitly out of scope for the current phase.

### Feature 1: Natural Language Querying

Bid managers and resource managers can query the workforce inventory in plain English.

- Implementation: text-to-SQL with the Drizzle schema as context
- The LLM receives a natural language question and the schema definition, returns a SQL query, the application executes it and returns results
- Output is verifiable — wrong results are immediately obvious
- No vector database required

### Feature 2: STAR Tagging Suggestions

When an employee submits a STAR entry, the AI analyses the text and suggests appropriate skill tags and complexity levels from the internal taxonomy.

- Implementation: classification prompt against the skills taxonomy
- Employee sees suggestions and confirms or adjusts — the AI does not write to the database directly
- Reduces the friction of tagging without removing human judgement

### Model Infrastructure

AI features run on self-hosted open models, not cloud APIs. This is a hard requirement for government-adjacent data — no personnel data leaves UK infrastructure.

| Environment          | Stack                             | Notes                                                                                 |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Local development    | llama.cpp in Docker               | Lightweight, CPU-capable, OpenAI-compatible API, GGUF quantised weights (Q4_K_M ~5GB) |
| Production           | vLLM on AWS EC2 G4/G5 (eu-west-2) | High-throughput serving, same OpenAI-compatible API endpoint                          |
| Customer on-premises | llama.cpp or vLLM                 | Data never leaves customer network                                                    |

**Model selection:** Llama 3.1 8B or Mistral 7B for the two scoped features. Both are sufficient for structured classification and text-to-SQL. Mistral AI's European origin is a useful procurement conversation point.

**Abstraction layer:** A simple provider interface in the Hono backend accepts a prompt and returns a completion. The underlying model is swappable via configuration — Anthropic API for development iteration against synthetic data, self-hosted model for all real data. Application code does not change when the provider changes.

---

## 13. Development Roadmap

Phases are ordered to deliver a demonstrable working product as early as possible. Infrastructure and AI complexity is deferred until the core loop is proven.

### Phase 1 — The Core Loop (Current)

Deliverable: A working demonstration of the full Value Loop end to end.

- Schema stable and pushed to database ✅
- Authentication working (Better Auth, email/password, Okta OIDC path prepared) ✅
- Single consultant creates a STAR entry
- Single mentor verifies the entry
- Promotion readiness score updates
- Basic lobby view for both personas

This is the internal pitch artefact. Not a full product — a working proof of the core concept.

### Phase 2 — Framework Mapping

- SFIA v9 and DDaT seed data for `external_frameworks` and `external_skills`
- `framework_mappings` populated for common engineering and delivery skills
- Runtime calculation wiring promotion readiness to external framework levels
- Framework translation shown in the Growth Hub

### Phase 3 — UI Properly

- Full design system implemented in `packages/ui` with Storybook documentation
- All Phase 1 and 2 features rebuilt with the production design system
- Responsive layouts, accessibility audit, keyboard navigation

### Phase 4 — Compliance Passport

- Clearance tracking with expiry alerts
- Residency history with automatic 3/5/10-year eligibility calculation
- Reveal interaction with audit logging
- High-side safeguard in bid searches

### Phase 5 — Bid Intelligence Centre

- Advanced resource search with clearance and framework filters
- Capability bio generation from verified STAR entries
- Bid shortlist workspace

### Phase 6 — AI Features

- Natural language querying over workforce inventory
- STAR tagging suggestions on evidence submission
- llama.cpp in Docker for local development
- Production inference on AWS eu-west-2

---

## 14. Open Questions & Future Considerations

**Promotion conflict of interest in feedback routing.** The double-blind buffer routes constructive feedback through a Calibration Lead. The routing logic when the Calibration Lead is the subject of the feedback, or is line manager to both parties, is not yet defined. This needs a policy decision before the feedback feature is built.

**Keycloak migration path.** Better Auth handles Okta OIDC cleanly for the initial deployment. If a government customer mandates self-hosted identity, Keycloak is the migration target. Both use standard OIDC protocols — migration is a configuration change estimated at one sprint.

**pgvector for bid matching.** The current Bid Intelligence Centre design uses structured SQL queries. If semantic search over STAR entries proves valuable (searching by meaning rather than exact tags), `pgvector` is already available as a PostgreSQL extension. This avoids a separate vector database at current scale.

**Framework scoping for non-technical roles.** The schema supports multiple frameworks per organisation. The product currently assumes SFIA for engineers and DDaT for digital roles. Framework scoping for sales, account management, or other non-technical functions is architecturally ready but not yet designed at the product level.

**Amendment policy for the append-only rule.** The "never overwrite, always append" principle is correct for audit integrity. Genuine data entry errors (wrong start date, misspelled project name) need an amendment system with a reason field and visible correction history. The policy for what constitutes a correctable error versus a new evidence entry needs definition before the UI is built.

**Predictive hiring.** The schema and data model support comparing bid pipeline requirements against the current skills heatmap to flag hiring needs proactively. This is a reporting feature that requires sufficient data volume to be meaningful — a Phase 6+ consideration.

---

_This document should be treated as a living specification. Decisions marked as open should be resolved and recorded here before the relevant feature enters development._
