# IterateUP — AI Career OS

IterateUP is a career intelligence platform for students. It connects a student's goals, profile evidence, skill gaps, projects, learning plan, target companies, job matches, applications, and interview preparation into one guided path.

The product is being built incrementally. The first release focuses on a credible student experience and a dashboard that answers the most important question: **what should I do next?**

## Current foundation

- React + Vite + TypeScript frontend in `artifacts/career-os`
- Reusable UI primitives and a responsive product shell
- Complete Student Platform:
  - `/` — Landing page with value proposition, method, and live readiness teaser
  - `/login`, `/signup` — Authentication entry points
  - `/onboarding/*` — 4-step intake (Goals, Profile, Social connect)
  - `/dashboard` — Daily Career Copilot, readiness gauge, next actions, activity pulse
  - `/profile` — Student profile, resume parser simulation, GitHub/LinkedIn sync, education, and credentials
  - `/skills` — 8-category configurable readiness breakdown & skill gap mitigation engine
  - `/roadmap` — 14-week 4-phase sprint with interactive task check-offs
  - `/projects` — Skill-gap guided project blueprints and architectural specifications
  - `/courses` — Curated curricula directly mapped to identified skill gaps
  - `/companies` — Target employer intelligence with tech stack overlap and hiring cycles
  - `/jobs` — Job matching with matched vs missing skill breakdown and 1-click pipeline tracking
  - `/applications` — Multi-stage application pipeline tracker with stage selectors and action reminders
  - `/interview` — Role-specific interview prep simulator with STAR framework & diagnostic feedback
  - `/settings` — Career targets, daily copilot alerts, and data privacy boundaries
- Clearly separated local mock data for high-fidelity frontend execution
- Shared Express API server in `artifacts/api-server`
- OpenAPI, generated client, Zod, and Drizzle workspace libraries ready for database integration

## Product architecture

The long-term intelligence loop is:

```text
PROFILE → UNDERSTAND → IDENTIFY GAP → RECOMMEND → ACT → MEASURE → IMPROVE → OPPORTUNITY
```

The system uses structured data rather than turning a resume into an unstructured paragraph:

```text
resume + GitHub + education + projects + certifications + career goal
→ structured student profile
→ normalized skills
→ target-role requirements
→ skill gaps
→ recommendations
→ companies, jobs, applications, and interview preparation
```

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn-style primitives
- Backend: Express through the shared API server
- API contracts: OpenAPI with generated React Query and Zod helpers
- Database: PostgreSQL with Drizzle ORM
- AI: modular service boundary to be connected after the core UI and data contracts are stable

## Local development

Run the product:

```bash
pnpm dev
```

Useful checks:

```bash
pnpm run typecheck
pnpm run build
```

## Project structure

```text
artifacts/career-os/
  src/
    components/      reusable product UI & shell
    lib/mock/        isolated demo data models
    pages/           10+ production product screens
    App.tsx          router and app composition
    index.css        theme tokens and global styles
artifacts/api-server/
  src/routes/        API route modules
lib/api-spec/         OpenAPI source of truth
lib/api-client-react/ generated frontend hooks and schemas
lib/api-zod/          generated server validation schemas
lib/db/               Drizzle database package
```

## Data and safety boundaries

The initial screens use realistic mock content for product development. They are not claims about live jobs, hiring status, customer results, or partnerships. Production job availability and recommendations must come from verified underlying sources, and AI output must be presented as recommendations rather than guarantees.

## Roadmap

1. [COMPLETED] Stabilize foundation, shell, landing page, and student dashboard.
2. [COMPLETED] Implement all 10 core student modules (Profile, Skills, Roadmap, Projects, Courses, Companies, Jobs, Applications, Interview, Settings).
3. Connect PostgreSQL persistence through Drizzle ORM and OpenAPI contracts.
4. Add user authentication with session management and private document storage.
5. Add college/institution placement coordinator workspace.
6. Add recruiter talent search and pipeline portal.