<!-- # DevGraph

## What is DevGraph?

## Why a graph database?

## Architecture

## Graph data model

## Main graph queries

### Search developers by skills
### Search by domain
### Shared project connections
### Multi-hop developer matching

## Tech stack

## Project structure

## Local setup

## Environment variables

## Seed database

## Run application

## Screenshots

## Demo -->


# DevGraph

> Discover developers through their skills, projects, technologies, companies, and professional connections.

DevGraph is a small graph-powered developer discovery application built for the Wexa AI CognoDB take-home assignment.

Instead of treating developers, skills, projects, technologies, companies, and domains as isolated records, DevGraph models the relationships between them and uses graph traversal to answer relationship-heavy search questions.

## Live Demo

**Demo:** `YOUR_DEPLOYED_URL`

**Screen Recording:** `YOUR_RECORDING_URL`

## Why DevGraph?

Finding developers is often more useful when we can understand their **relationships and experience**, not just their profile attributes.

For example:

> Find Rust developers with PostgreSQL experience who worked on Fintech projects.

This requires following multiple relationships:

![DevGraph relationship example](docs/graph-model.svg)

```text
Developer
   ├── HAS_SKILL ──────────────> Skill
   │
   └── WORKED_ON ──────────────> Project
                                   ├── IN_DOMAIN ────────> Domain
                                   ├── USES ──────────────> Technology
                                   ├── REQUIRES_SKILL ────> Skill
                                   └── FOR_COMPANY ───────> Company
```

A relational database can model this information, but relationship-heavy traversal becomes increasingly join-oriented as the number of relationships and hops grows.

A graph database makes these relationships first-class and allows the application to query paths directly.

## Why a Graph Database?

The core questions in DevGraph are about **connections**:

* Which developers have a particular skill?
* Which developers worked on projects in a particular domain?
* Which developers worked on the same projects?
* Which technologies were used by a developer's projects?
* Which skills are required by those projects?
* Which developers match multiple graph-based criteria?

These are graph traversal problems rather than simple record lookups.

For example:

```text
Developer
   ↓ WORKED_ON
Project
   ↓ IN_DOMAIN
Domain
```

and:

```text
Developer
   ↓ WORKED_ON
Project
   ↑ WORKED_ON
Developer
```

The second path allows DevGraph to discover related developers through shared projects without storing an artificial direct `CONNECTED_TO` relationship.

## Graph Data Model

### Nodes

* `Developer`
* `Project`
* `Skill`
* `Technology`
* `Company`
* `Domain`

### Relationships

```text
Developer ──HAS_SKILL──────────────> Skill
Developer ──WORKED_ON──────────────> Project
Developer ──WORKS_AT───────────────> Company
Developer ──HAS_DOMAIN_EXPERIENCE──> Domain

Project ──USES─────────────────────> Technology
Project ──REQUIRES_SKILL───────────> Skill
Project ──IN_DOMAIN────────────────> Domain
Project ──FOR_COMPANY──────────────> Company
```

The full graph model is documented in:

`docs/graph-model.png`

## Architecture

```text
┌─────────────────────────────┐
│       React + TypeScript    │
│          Vite               │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│     Fastify + TypeScript    │
│                             │
│ Routes → Services           │
│           ↓                 │
│       Repositories          │
└──────────────┬──────────────┘
               │
               │ neo4j-driver
               ▼
┌─────────────────────────────┐
│        Bolt 5.x             │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│          CognoDB            │
│       Graph + Cypher        │
└─────────────────────────────┘
```

### Application flow

```text
User search
    ↓
React search UI
    ↓
POST /api/search
    ↓
Search service
    ↓
Entity resolver
    ↓
Structured search filters
    ↓
Developer repository
    ↓
Parameterized Cypher
    ↓
Neo4j JavaScript driver
    ↓
CognoDB
    ↓
Developer results
    ↓
React cards
```

## Search

The application provides a natural-looking search experience.

Example:

```text
Find Rust developers with PostgreSQL experience in fintech
```

The application resolves known entities from the graph into structured filters:

```json
{
  "skills": ["Rust", "PostgreSQL"],
  "technologies": [],
  "domains": ["Fintech"],
  "projects": [],
  "companies": []
}
```

These filters are then passed to fixed Cypher queries as parameters.

The user does **not** send arbitrary Cypher to the database.

## Main Graph Queries

### 1. Find developers by skills and optional graph filters

The main developer search traverses:

```text
Developer
   ↓ HAS_SKILL
Skill

Developer
   ↓ WORKED_ON
Project
   ├── USES → Technology
   ├── IN_DOMAIN → Domain
   └── FOR_COMPANY → Company
```

The query uses parameters such as:

```text
$skills
$technologies
$domains
$projects
$companies
```

This allows filters to be combined without string-concatenating user input into Cypher.

### 2. Multi-hop developer search

Example:

```text
Developer
   ↓ WORKED_ON
Project
   ↓ IN_DOMAIN
Domain
```

This allows searches such as:

> Rust developers with Fintech project experience.

### 3. Shared-project connections

```text
Developer
   ↓ WORKED_ON
Project
   ↑ WORKED_ON
Developer
```

This allows DevGraph to discover developers who worked together on the same project.

### 4. Developer project exploration

A developer's profile can expose:

```text
Developer
   ├── Skills
   ├── Projects
   │     ├── Technologies
   │     ├── Required skills
   │     ├── Domain
   │     └── Company
   ├── Company
   └── Connected developers
```

## Example Graph Data

Example project relationships:

```text
Invoice SaaS
    ├── USES → Axum
    ├── USES → Tokio
    ├── REQUIRES_SKILL → Rust
    ├── REQUIRES_SKILL → PostgreSQL
    └── IN_DOMAIN → Fintech
```

Another project:

```text
Developer Portal
    ├── USES → React
    ├── USES → Kafka
    ├── REQUIRES_SKILL → TypeScript
    └── IN_DOMAIN → Developer Tools
```

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Node.js
* TypeScript
* Fastify

### Database

* CognoDB
* openCypher
* Bolt
* Official Neo4j JavaScript driver

### Validation / Configuration

* Environment variables for database credentials
* Structured application configuration

## Project Structure

```text
devgraph/
├── docs/
│   └── graph-model.png
│
├── backend/
│   ├── scripts/
│   │   ├── seed.ts
│   │   └── test-search.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   │
│   │   ├── db/
│   │   │   └── neo4j.ts
│   │   │
│   │   ├── repositories/
│   │   │   └── developer.repository.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── search.ts
│   │   │   └── developers.ts
│   │   │
│   │   ├── services/
│   │   │   └── search.service.ts
│   │   │
│   │   ├── utils/
│   │   │   └── entity-resolver.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Configuration

Create `backend/.env`:

```env
COGNODB_URI=bolt+s://<instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password>
PORT=3000
```

Do not commit `.env`.

The repository includes `.env.example` as a template.

The assignment requires CognoDB connection details to be read from environment variables and not committed to the repository.

## Create a CognoDB Instance

1. Create an account at CognoDB Cloud.
2. Create a free `c0` instance.
3. Select a region.
4. Copy the generated Bolt URI.
5. Save the generated `cognodb` password securely.
6. Put the credentials into `backend/.env`.

CognoDB exposes a Bolt-compatible interface and supports openCypher with the official Neo4j drivers.

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example`.

Then start the API:

```bash
npm run dev
```

The backend runs by default at:

```text
http://localhost:3000
```

### Seed the graph

Run:

```bash
npm run seed
```

The seed script creates realistic developers, projects, skills, technologies, companies, domains, and relationships.

The assignment requires a seed script to be included in the repository.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL shown in the terminal.

## API

### Search

```http
POST /api/search
Content-Type: application/json
```

Example:

```json
{
  "query": "Find Rust developers with PostgreSQL experience in fintech"
}
```

### Developer

```http
GET /api/developers/:id
```

### Developer Connections

```http
GET /api/developers/:id/connections
```

### Health Check

```http
GET /health
```

## Parameterized Cypher

All user-derived values are passed as query parameters.

Example:

```cypher
MATCH (d:Developer)
...
WHERE
  size($skills) = 0
  OR all(skill IN $skills WHERE skill IN developerSkills)
RETURN d
```

Parameters are supplied separately through the Neo4j driver:

```ts
session.run(query, {
  skills,
  technologies,
  domains,
  projects,
  companies,
});
```

No user input is concatenated directly into Cypher.

This follows the assignment requirement for parameterized queries through the official Neo4j driver.

## Error Handling

The application handles:

* Invalid or empty search requests
* No search results
* Failed API requests
* Database connectivity failures

Technical errors are logged by the backend while the frontend presents user-friendly error states.

The assignment explicitly requires graceful handling when the database is unreachable.

## UI States

The UI includes:

* Search loading state
* Empty result state
* API/database error state
* Developer profile loading state
* Developer connection empty state

## Screenshots

### Search

`docs/screenshots/search.png`

### Search Results

`docs/screenshots/results.png`

### Developer Profile

`docs/screenshots/developer-profile.png`

### Graph Model

![DevGraph graph model](docs/graph-model.png)

## Demo

**Hosted application:** `YOUR_DEPLOYED_URL`

**Screen recording:** `YOUR_RECORDING_URL`

## Assignment Notes

This project was built as a small, complete graph application focused on demonstrating:

* Graph data modeling
* Relationship-oriented queries
* Multi-hop traversal
* Parameterized Cypher
* Clean backend layering
* Reproducible seed data
* A usable frontend experience

The assignment states that a strong submission should have a sound data model, seed script, working application, polished UX, well-structured architecture, hosted demo, and a clear end-to-end use case.
