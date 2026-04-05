# Sprint Log

## Agile Methodology

This project followed an adapted Scrum methodology suited to a 4-person student team. Each sprint lasted approximately one week. Work was split by expertise, with backend developers (Muiiz, Aamr) and frontend developers (Abhishil, Tomas) working in parallel and integrating at the end of each sprint.

| Team Member | Role |
|-------------|------|
| Muiiz Ayodele | Backend Architect |
| Aamr | Backend Architect |
| Abhishil Sinoj | Frontend Developer |
| Tomas Santos | Frontend Developer |

The `dev` branch served as the integration branch. Features were developed in separate branches and merged via pull requests. The `main` branch was 
reserved for stable, reviewed code. The GitHub Actions CI pipeline ran automatically on every push, providing immediate feedback on code quality.

---

## Sprint 1 — Foundation and Authentication

**Duration:** Week 1 - 4 
**Sprint Goal:** Establish the project structure, implement user 
authentication end-to-end, and build the public-facing landing page.

### Planned
- Flask project with service layer and Blueprint architecture
- User model with UUID-based identity, email, username, hashed password, birthdate
- Registration with email uniqueness check and full password validation
- Login with bcrypt verification and account lockout after 5 failed attempts
- JWT generation and `@token_required` decorator
- OTP password reset via Gmail SMTP
- React project with TypeScript and Vite
- Landing page with hero section, feature sections, and login/signup modals
- Forgot password page with 3-step OTP flow
- `storage.ts` session management and `PrivateRoute` guard

### Delivered
- `AuthService` with registration, login, lockout, password validation
- `auth_routes.py` Flask Blueprint for all `/api/auth/*` routes
- JWT `generate_token` with email, user_id, and 24-hour expiry
- `@token_required` decorator passing `current_user_email` and `current_user_id`
- Landing page with hero, feature sections, and animated modals
- `Signup.tsx` with login and registration modals connected to backend
- `ForgotPassword.tsx` with 3-step OTP flow
- `storage.ts` with `saveSession`, `isLoggedIn`, `logout`
- `App.tsx` with `PrivateRoute` guard redirecting unauthenticated users
- Gmail SMTP integration with `.env` credentials

### Not Delivered
- End-to-end email delivery testing (SMTP configured, not verified live)

### Retrospective
The most significant mid-sprint change was a security refactor. The initial 
design used `user_email` as the user identifier in JWT payloads, route 
parameters, and data models. This was identified as a risk — email addresses 
appearing in API URLs get logged by proxies and browser history. The design 
was refactored to use `user_id` (UUID) throughout. This added approximately 
half a day of rework but resulted in a fundamentally more secure architecture.

The `.venv` virtual environment folder was accidentally committed early in 
the sprint, bloating the repository history. It was removed and added to 
`.gitignore`. This prompted the team to also configure `.gitignore` for 
`__pycache__`, `.DS_Store`, and `.env` before any further commits.

---

## Sprint 2 — Budget Tracker and Timetable

**Duration:** Week 4 - 7  
**Sprint Goal:** Build full financial tracking with charts and a visual 
weekly timetable with persistent backend storage.

### Planned
- `Transaction` and `Budget` models with `user_id` throughout
- `BudgetService` with transaction CRUD, budget creation, spending summaries
- 16 default categories auto-initialised on first run (11 expense, 5 income)
- Income vs expense pie chart and category breakdown chart using Recharts
- `TimetableEntry` model with day, time, location, and entry type
- `TimetableService` with CRUD and day/time sorting
- Weekly timetable grid with colour-coded entry types
- Backend API integration for both budget and timetable pages

### Delivered
- ✅ `Transaction` model (`user_id`, `category_id`, `amount`, `description`, `transaction_date`, `is_recurring`)
- ✅ `Budget` model (`user_id`, `category_id`, `amount`, `month`, `year`)
- ✅ `BudgetService` with full transaction and budget CRUD, category initialisation
- ✅ Income vs expense overview pie chart (Recharts)
- ✅ Expense breakdown by category pie chart
- ✅ Transaction list with delete functionality
- ✅ `TimetableEntry` model extended with `start_date` and `end_date` fields for recurring entries
- ✅ `TimetableService` with CRUD, day/time sorting, and date range support
- ✅ Weekly grid with absolute-positioned entries calculated from start/end times
- ✅ Colour-coded entry types (lecture, lab, seminar, tutorial, other)
- ✅ Theme switching (Classic, Light, Dark) implemented across all dashboard pages
- ✅ Shared `Sidebar` and `Topbar` components exported from `dashboard.tsx`

### Not Delivered
- ❌ Budget limit vs spending status endpoint (route built, frontend not connected)
- ❌ Timetable entry editing (delete and re-add used as workaround)

### Retrospective
The `Budget` model was not updated during the Sprint 1 `user_email` → `user_id` 
refactor. This was not caught until the budget routes were tested and crashed 
with a `TypeError` — `create_budget` was receiving `user_id` from the token 
but the `Budget` class constructor still expected `user_email`. The fix required 
updating the model, service, and all references consistently.

`timetable.tsx` was initially built with local React state only — timetable 
entries were lost on page refresh. It was refactored at the end of the sprint 
to load from `GET /api/timetable` on mount and write to `POST /api/timetable` 
on form submission. This pattern was applied consistently from Sprint 3 onwards.

The shared `Sidebar` and `Topbar` components significantly reduced duplication. 
Because all theme state lives in `Topbar`, theme changes propagate to all pages 
automatically without any per-page code.

---

## Sprint 3 — Deadlines, Academics, and Linting

**Duration:** Week 8 - 11  
**Sprint Goal:** Build deadline management with extended fields, implement 
the academics module tracker, configure code quality tooling, and begin 
documentation.

### Planned
- `Deadline` model and `DeadlineService` with priority and completion tracking
- Workload stress indicator calculated from overdue and due-soon counts
- `AcademicsService` coordinating modules, assessments, analytics, and notes
- Module tracker with weighted average score calculation per module
- ESLint and Prettier configured for frontend
- flake8 and Black configured for backend
- Initial documentation structure

### Delivered
- ✅ `Deadline` model with extended fields: `priority`, `completed`, `status` (To-Do/In Progress), `notes`
- ✅ `DeadlineService` with CRUD, priority validation, status and notes support
- ✅ Deadlines page with search, sort by date or priority, stress indicator
- ✅ `AcademicsService` as a facade coordinating `Modules`, `Assessments`, `AcademicAnalytics`, `Notes`
- ✅ Weighted assessment score calculation per module
- ✅ Modules page with add/delete module and add assessment functionality
- ✅ flake8 and Black configured (`Backend/.flake8`)
- ✅ ESLint configured with flat config format (`Frontend/eslint.config.js`)
- ✅ Prettier configured (`Frontend/.prettierrc`)
- ✅ Documentation folder structure created

### Not Delivered
- ❌ Task backend (`task_service.py`, `tasks.json`) — task management 
  remains frontend-only (local state, no persistence between sessions)
- ❌ Cross-linking of tasks to deadlines page (requires task backend)
- ❌ Upcoming tasks on dashboard (requires task backend)

### Retrospective
The `handleInputChange` function in `deadlines.tsx` used a union type 
(`HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement`) for its 
event parameter. TypeScript's strict mode rejected this pattern when the 
handler was passed to individual `onChange` props, producing 20 type errors. 
The fix was to replace the shared handler with inline arrow functions on each 
input field.

The ESLint setup caused a dependency conflict because the project already had 
`typescript-eslint` installed as a bundle. Attempting to install 
`@typescript-eslint/eslint-plugin` separately introduced a version mismatch. 
The resolution was to use ESLint 9's flat config format and configure only 
the packages already present rather than installing duplicates.

The `AcademicsService` was designed as a facade pattern — routes in `main.py` 
call a single service, which internally coordinates four domain classes. 
This keeps the route layer clean while allowing the academics domain to grow 
in complexity independently.

---

## Sprint 4 — CI/CD Pipeline and Documentation

**Duration:** Week 11  
**Sprint Goal:** Set up the GitHub Actions CI pipeline, fix all linting 
violations, and complete project documentation.

### Planned
- GitHub Actions CI pipeline running on push to `main` and `dev`
- Backend: dependency install, syntax check, flake8 lint
- Frontend: dependency install, TypeScript type check, ESLint lint, Vite build
- Fix all flake8 violations across backend files
- Fix all TypeScript and ESLint errors across frontend files
- Complete all documentation files

### Delivered
- ✅ GitHub Actions `ci.yml` with parallel backend and frontend jobs
- ✅ CI badge added to top-level `README.md`
- ✅ All flake8 violations fixed:
  - Removed unused imports (`AuthService` from `main.py`, `Category` from `budget_service.py`, `datetime` from `category.py` and `transaction_service.py`)
  - Fixed f-string arithmetic (`{'='*40}` → extracted `separator` variable)
  - Fixed blank line whitespace (`W293`) and excess blank lines (`E303`)
  - Fixed missing blank lines before functions (`E302`)
- ✅ All ESLint errors fixed:
  - `setState` in `useEffect` in `account.tsx` — replaced with `useState` direct initialisation
  - `setState` in `useEffect` in `dashboard.tsx` — replaced with lazy `useState` initialiser and separate DOM effect
- ✅ TypeScript warnings addressed (`any` types replaced with typed alternatives)
- ✅ `architecture.md`, `sprint-log.md`, `requirements.md`, `ci-cd.md` completed
- ✅ Backend and frontend `README.md` files written

### Not Delivered
- ❌ pytest unit tests — manual testing only throughout the project
- ❌ Automated deployment — application runs locally only
- ❌ Task backend persistence — tasks remain in local React state

### Retrospective
The CI pipeline revealed flake8 violations that had not been caught locally 
because flake8 was not installed in the development environment's PATH. The 
root cause was that the virtual environment was not consistently activated 
before development. Using `python -m flake8` rather than `flake8` directly 
resolved the PATH issue and is now the recommended approach in the backend 
`README.md`.

Two ESLint errors — `setState` called synchronously inside `useEffect` — 
pointed to a React anti-pattern in both `account.tsx` and `dashboard.tsx`. 
Both cases involved reading from `localStorage`, which is synchronous and 
always available on mount. The correct pattern is to initialise state 
directly from `localStorage` using `useState`'s lazy initialiser, then 
use `useEffect` only for the resulting DOM side effect (applying the theme 
to `document.body`).

The task backend was deprioritised in favour of completing documentation and 
the CI pipeline within the sprint timeframe. Task persistence is identified 
as the primary technical debt item for a future iteration.