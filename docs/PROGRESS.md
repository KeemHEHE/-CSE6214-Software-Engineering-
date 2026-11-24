# EcoBin MMU — Progress Tracker

Split by work type: **Writing** (report prose), **UML / Diagrams** (modelling artifacts), **Code** (Part II implementation). See `docs/PART_I_REPORT.md` for the authoritative design and `PART_I_REPORT.md`'s WBS (Section 1.6) for owners.

Last updated: 24/11/2026.

## Writing (Part I report prose)

| Section | Content | Status |
|---|---|---|
| 1.1 | Background | ✅ Done |
| 1.2 | Problem Statement | ✅ Done |
| 1.3 | Target Users | ✅ Done |
| 1.4 | Scope and Exclusions | ✅ Done |
| 1.5 | Development Process | ✅ Done |
| 1.6 | Project Schedule (WBS, milestones, risks text) | ✅ Done |
| 2.1 | System Description | ✅ Done |
| 2.2 | Actors table | ✅ Done |
| 2.3 | Assumptions and Dependencies | ✅ Done |
| 3.1 | FR/NFR descriptions | ✅ Done (FR-01–31, NFR-01–11) |
| 4.2 | Entity descriptions + data assumptions | ✅ Done |
| 7 | Traceability and consistency write-up | ✅ Done |
| 8 | References | 🟡 Partial — core references listed; survey/interview citations still to add once 1.3 elicitation is done |
| 9 | Weekly AI Thought Partner Tracker | 🟡 Partial — Week 2 entry has blanks (what you thought of the output, what you did with it) still to fill in; Weeks 3+ not started |
| — | Real group member names/IDs (cover table) | ⬜ Not done — Members 2–4 still placeholders |
| — | Requirements elicitation (student survey) | ⬜ Not done |
| — | Final proofread + PDF export for submission | ⬜ Not done |

## UML / Diagrams

| Diagram | Section | Status |
|---|---|---|
| Use Case Diagram | 3.2 | ✅ Done (Mermaid) — redraw in draw.io/StarUML with proper stick-figure actors noted as a TODO in the doc |
| Use Case Descriptions (5 detailed + 11 brief) | 3.2.1–3.2.6 | ✅ Done |
| ERD | 4.1 | ✅ Done (Mermaid, 11 entities, keys/cardinalities/constraints) — redraw as image with crow's-foot notation noted as a TODO |
| System Architecture Diagram | 5 | ✅ Done (three-tier, Mermaid) |
| Navigation Flow Diagram | 6 | ✅ Done (Mermaid) |
| Wireframes (4 screens) | 6 | ✅ Done (ASCII text placeholders) — redraw in Figma/draw.io noted as a TODO |
| Gantt Chart | 1.6 | ✅ Done (Mermaid) |
| Sequence / Class / State Diagrams | — | ⬜ Not started — not required by the rubric (only use case, ERD, architecture, wireframes are graded under Section 5 "Design documentation and notation"); link list in the project description is optional reference material only |

## Code (Part II implementation)

| Module | Scope | Status |
|---|---|---|
| Project setup | `server/` (Express+TS+SQLite) and `client/` (React+Vite+TS) scaffolded | ✅ Done |
| DB schema + seed | `server/src/db/schema.sql` mirrors ERD exactly; `npm run seed` | ✅ Done |
| M1 User Management | Register (MMU email only), verify, login w/ lockout, password reset, profile, admin user mgmt, role-guard middleware | ✅ Done, tested end-to-end |
| M2 Recycling Point & Bin Mgmt | Points/bins CRUD, QR code generation + lookup | ✅ Done, tested |
| M3 Waste Reporting | Submit w/ duplicate detection, status history, priority/resolve/reject/duplicate, status log | ✅ Done, tested |
| M4 Scheduling & Assignment | Schedules, task generation from schedules, assignment, start/miss/complete w/ transactional weight recording | ✅ Done, tested (full transaction verified) |
| M5 Dashboard & Export | Weight-by-type/point, open reports, overdue tasks, avg resolution time, CSV export | ✅ Done, tested |
| M5 Notifications | List, mark-read, escalation check | 🟡 Done but **not split from M5 dashboard code** — currently both live in `reporting.routes.ts`; doc assigns them to different owners (Adam vs Member 2) |
| OPT-01 Rewards | Points on resolve, leaderboard | ✅ Done, tested |
| OPT-02 Campus Map | Points + bins + today's collection status | ✅ Done, tested |
| OPT-03 Trend Analysis | Weekly totals + >30% spike flag | ✅ Done, tested |
| OPT-04 Route Optimisation | Nearest-neighbour suggested visiting order | ✅ Done, tested |
| Frontend dashboards | One per actor (Reporter, Worker, Officer, Admin) wired to the API | ✅ Done, builds clean |
| Automated test suite | Unit/integration tests (Jest, etc.) | ⬜ Not started — current verification was manual (curl) end-to-end testing |
| Real SMTP email | Verification/reset emails currently stubbed to console | ⬜ Not done — D1 dependency, needs real SMTP credentials |
| Per-module polish by actual owners | Each member reviewing/refining their assigned module and Level 5 feature | ⬜ Not started |

---

**Summary:** Part I writing and diagrams are essentially complete except the group-formation placeholders, the student survey, and final PDF export. Part II has a fully working, tested backend and frontend covering all core modules and all four Level 5 features, but still needs an automated test suite, real email, and each member's own review/polish of their assigned piece.
