# IterateUP — AI Career OS Project State

## CURRENT STATUS

The project has a complete, fully functional, production-grade student experience running live on `http://localhost:5173/`. All 10 core student modules that were previously stubs/placeholders have now been designed, implemented, and connected into the application.

## CURRENT PHASE

Phase 2 — Full Student Experience Complete (All 10 Core Product Surfaces Implemented & Verified).

## COMPLETED FEATURES

- **Landing Page (`/`)**: Hero, product explanation, IterateUP method, live readiness teaser, signal map, CTA.
- **Authentication (`/login`, `/signup`)**: Student credential management with tabbed login/signup flow.
- **Onboarding Flow (`/onboarding/*`)**: 4-step guided intake (Career Goal, Profile Evidence, Social Connect).
- **Student Dashboard (`/dashboard`)**: Career Readiness Score, Today's Actions with interactive checkoffs, Skill gaps pulse, Roadmap sprint preview, Proof of work cards, Job matches, and Application activity tracker.
- **Student Profile (`/profile`)**: Comprehensive profile calibrated for Indian engineering students (Aarav Sharma, B.Tech Computer Engineering at COEP Pune, 8.94 CGPA) with simulated PDF resume upload & parsing confidence, GitHub activity metrics (repos, commits, language breakdown), LinkedIn connection, COEP T&P Cell affiliation, Pune startup internship, and AWS & NPTEL certifications.
- **Skills & Readiness Breakdown (`/skills`)**: 8-category configurable scoring breakdown (Technical Skills, Projects, Experience, Resume, GitHub, Certifications, Interview Readiness, Communication) with target role switcher, evidence-backed skill gap cards with delta meters, priority filters, and custom skill addition.
- **Personalized Roadmap (`/roadmap`)**: 14-week 4-phase career sprint with milestone timeline, impact tags, and interactive task check-offs that dynamically update completion percentages.
- **Personalized Projects Engine (`/projects`)**: Proof-of-work project cards (*CityTransit Pune*, *Tiny Teams India*, *High-Concurrency UPI Gateway Simulator*) answering *Why This Project?*, *Which Skill Gap Does It Address?*, and *What Will The Student Learn?*, complete with an interactive Architecture Blueprint modal.
- **Learning Engine / Courses (`/courses`)**: Curated curricula mapped to gaps (Striver SDE Sheet, NPTEL IIT Kharagpur DBMS, Full Stack Open, Docker/K8s, System Design by Alex Xu) with cost and difficulty filters.
- **Company Intelligence (`/companies`)**: Company targeting engine for top Indian tech employers & global MNCs in India (Razorpay, PhonePe, Swiggy, Zomato, TCS Digital, Atlassian India) with tech stack overlap, candidate fit scores, recruitment cycles, and verified careers links.
- **Job Matching (`/jobs`)**: Matched summer internship and new grad openings with percentage fit, matched vs missing skills breakdown, Indian Rupee compensation (₹65,000–₹85,000/mo and ₹7.5–₹11.5 LPA), verified source attribution, and 1-click pipeline tracking.
- **Application Tracker (`/applications`)**: Full candidate pipeline tracker with stages (Saved, Applied, Assessment, Interview, Offer, Rejected), pipeline metrics, next critical action reminders, stage selectors, and add-application modal.
- **Interview Room (`/interview`)**: Technical, system design (UPI idempotency, real-time bus search), and behavioral mock interview simulator with STAR methodology breakdowns, interviewer evaluation criteria, draft answer recorder, and diagnostic scoring feedback.
- **Settings & Preferences (`/settings`)**: Student career goals, Daily Copilot morning digest controls (IST timing), interview reminders, and student data privacy boundary toggles.

## IN-PROGRESS

- Preparing database schema and OpenAPI specifications in `lib/api-spec/` for future full-stack persistence.

## NEXT TASK

Generate backend database schema (`lib/db/src/schema/`) and connect API routes for persistent user storage.

## FILES CREATED / MODIFIED

- `artifacts/career-os/src/pages/profile.tsx` — Student profile, resume parser, connected accounts
- `artifacts/career-os/src/pages/skills.tsx` — Skills & configurable readiness scoring engine
- `artifacts/career-os/src/pages/roadmap.tsx` — 4-phase roadmap sprint with interactive task toggles
- `artifacts/career-os/src/pages/projects.tsx` — Skill-gap guided project blueprints and specs
- `artifacts/career-os/src/pages/courses.tsx` — Curated learning engine mapped to gaps
- `artifacts/career-os/src/pages/companies.tsx` — Company intelligence and recruitment patterns
- `artifacts/career-os/src/pages/jobs.tsx` — Jobs matching with verified skills breakdown
- `artifacts/career-os/src/pages/applications.tsx` — Multi-stage application pipeline tracker
- `artifacts/career-os/src/pages/interview.tsx` — Role-specific interview prep simulator
- `artifacts/career-os/src/pages/settings.tsx` — Workspace settings and privacy boundaries
- `artifacts/career-os/src/lib/mock/career-data.ts` — Comprehensive data models across all 10 modules
- `artifacts/career-os/src/App.tsx` — Route composition connecting all modules
- `artifacts/career-os/vite.config.ts` — Local dev defaults for PORT and BASE_PATH
- `pnpm-workspace.yaml` — Removed Darwin arm64 platform exclusions
- `package.json` — Added root `dev` script
- `PROJECT_STATE.md` — Updated project status and completed modules

## DATABASE STATUS

Drizzle schema defined in `lib/db/`. Ready for persistence when connecting PostgreSQL.

## API STATUS

Shared Express server ready in `artifacts/api-server`.

## HOW TO RUN

- `pnpm dev` — Start the web application on `http://localhost:5173/`
- `pnpm run typecheck` — Full workspace typecheck across all 9 packages
- `pnpm run build` — Production bundle build

## LAST WORKING STATE

All 10 previously incomplete placeholder routes are now fully implemented with production-grade components, interactive features, and zero TypeScript or build errors. The dev server is running live on `http://localhost:5173/`.