# AI Career OS

AI Career OS helps students turn a career goal into a focused plan of skills, proof of work, learning, applications, and next actions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/career-os run dev` — run the student-facing web app through its managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/career-os/src/App.tsx` — route composition
- `artifacts/career-os/src/components/career-shell.tsx` — reusable product shell and navigation
- `artifacts/career-os/src/lib/mock/career-data.ts` — first-pass local demo data
- `artifacts/career-os/src/index.css` — product theme tokens and global styling
- `lib/api-spec/openapi.yaml` — source of truth for future API contracts
- `lib/db/src/schema/` — source of truth for future PostgreSQL schema
- `PROJECT_STATE.md` — session handoff and current implementation boundary

## Architecture decisions

- The student experience is the first product surface; college and recruiter modules should extend the domain model later rather than shape the first UI.
- Mock content is isolated from UI components and explicitly labeled as demo data.
- The first build is frontend-first; authentication, persistence, AI analysis, and third-party sources are deferred until the core UI and contracts are stable.
- Career readiness is presented as an actionable loop, not a static score: gaps lead to recommendations and next actions.

## Product

The current build includes a startup-style landing page, login and signup flows, four-step onboarding, a responsive student shell, a career readiness dashboard, linked placeholder-ready routes, and polished not-found handling. The dashboard connects readiness, next actions, skill gaps, roadmap progress, projects, job matches, and application activity.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Manual Vite builds require `PORT` and `BASE_PATH`; use the managed workflow for the normal preview.
- Do not treat the local demo data as live job or hiring data.
- After changing `lib/api-spec/openapi.yaml`, run API codegen before importing generated hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
