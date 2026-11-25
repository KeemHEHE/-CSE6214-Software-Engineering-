# CSE6214 Software Engineering Fundamentals — Project

MMU, November 2026 (Term 2630). Part I & II group project.

## Docs
- [Project Description & Rubrics](docs/PROJECT_DESCRIPTION.md)
- [Part I Group Report Template](docs/PART_I_REPORT_TEMPLATE.md)
- [Part I Report (draft)](docs/PART_I_REPORT.md) — **start here.** The cover table assigns each member's actor, modules, use cases, Level 5 feature and report sections.
- [Progress Tracker](docs/PROGRESS.md) — what's done vs outstanding, split by writing / UML / code.

## Getting Started (new team member)

1. Read your row in the [Part I Report](docs/PART_I_REPORT.md) cover table to see your module, use cases and Level 5 feature.
2. Clone the repo, then create your own branch off `main`: `git checkout -b yourname/yourmodule`. Never commit straight to `main`.
3. Run the backend:
   ```
   cd server
   npm install
   npm run dev      # starts the API on http://localhost:4000
   npm run seed      # (separate terminal) creates one account per role + sample data
   ```
4. Run the frontend:
   ```
   cd client
   npm install
   npm run dev      # starts the app on http://localhost:5173
   ```
5. Your module's code lives under `server/src/modules/<your-module>/`. Read it, run it against the seeded accounts, and write your own tests for it — this is graded individually in Part II (testing 8%, oral defence 7%).
6. Open a pull request into `main` when your piece is ready.

## Key Dates
| Milestone | Due |
|---|---|
| Group formation | 10–20 Nov 2026 (Wk 1–2) |
| Part I: Planning, Requirements & Design | 27 Dec 2026, 11:59 PM (Wk 7) |
| Part II: Development, Testing & Evaluation | 31 Jan 2027, 11:59 PM (Wk 12) |
| Individual Oral Defence | 1–5 Feb 2027 (Wk 13) |

## Marks
Part I (20%) + Part I Documentation (20%) + Part II (40%) = **80%**
