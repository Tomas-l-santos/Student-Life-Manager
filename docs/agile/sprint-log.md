# Sprint Log

## Agile Methodology

This project followed an adapted Scrum methodology suited to a 4-person student team working across backend and frontend responsibilities. Sprints varied in length depending on academic commitments, ranging from one to two weeks. Work was coordinated through GitHub branches — each team member worked on a personal branch (`docs-declaringintent`, `docs-AbishilS`, `docs-tomas-l-santos`, `docs-A9rlt`) and merged via pull requests into `main`.


| Team Member | GitHub Handle | Role |
|-------------|--------------|------|
| Muiiz Ayodele | declaringintent | Backend Architect |
| Aamr | A9rlt | Backend Architect |
| Abhishil Sinoj | AbishilS | Frontend Developer |
| Tomas Santos | tomas-l-santos | Frontend Developer |


## Sprint 1 — Project Initialisation and Requirements Engineering
**Dates:** 11 jan 2026 – 6 Feb 2026  
**Sprint Goal:** Set up the repository, establish team roles, and produce the initial requirements documentation.

### Planned 
 - Create file structure for the project
 - Fill out the requirements and uml diagrams

### Delivered
 - `Requirements.md` and `SystemModelling.md` files created
 - User and system requirements written
 - Functional requirements documented
 - Non-functional requirements, MoSCoW prioritisation, stakeholder analysis, and usability requirements added
 - Requirements refined for specificity and corrected for language errors
 - Frontend folder structure created with HTML, CSS, JavaScript, and image assets
 - Backend OOP separation established 
 - Frontend converted from JavaScript to TypeScript with Vite configuration updated

### Not Delivered
 - Uml diagrams for `SystemModelling.md` 

### Retrospective
The requirements were written collaboratively across multiple pull requests, with each team member contributing different sections. The decision to convert the frontend from JavaScript to TypeScript was made early, which added initial setup complexity but provided type safety throughout development.


## Sprint 2 — Core Backend and First Frontend Pages
**Dates:** 8 Feb – 18 Feb 2026  
**Sprint Goal:** Build the authentication backend and create the first HTML page prototypes for the frontend.

### Planned
 - Use case diagram for UR-1
 - Sequence diagrams for UR-2 to 4
 - Expenses and Budget backend code
 - Authentication backend for login and signup
 - Define data models

### Delivered
 - Flask server creation tested (`main.py`)
 - `JSONStorage` class built in `storagerepo.py` for file-based persistence
 - `User` data class created with email, username, hashed password, birthdate
 - `authorisation.py` written with login and registration logic
 - `users.json` storage file created
 - `login.html` created
 - `CreateYourAccount.html` and `Forgotpassword.html` created
 - Logo images (`student_life_logo_4`, `student_life_logo_5`) added
 - CSS moved to a shared `styles.css` stylesheet
 - `dashboard.html` prototype created
 - Trial State diagram for UR-4 added to `SystemModelling.md`
 - `Budget`, `Category` model classes created under `models/Budget/`
 - `__init__.py` added for package imports

### Not Delivered
 - Use case diagram for UR-1
 - Sequence diagram for UR-2 to 4
 - Expenses and Budget backend code


### Retrospective
At this stage the frontend and backend were developed independently with no integration. The HTML pages served as visual prototypes to agree on layout before React conversion. The `Transaction` model was initially named `expenses.py` and renamed to `transactions.py` for clarity. Due to upcoming coursework and a lack of understanding, UML diagrams were temporarily put on hold.


## Sprint 3 — Budget Service, Security Fixes, and API Connection
**Dates:** 24 Feb – 6 Mar 2026  
**Sprint Goal:** Build the budget service layer, fix security risks, and connect the frontend to the backend for the first time.

### Planned
 - Ensure security requirements are met
 - Implement income and expense tracking
 - connect frontend to backend for a trial run

### Delivered
 - `budget_service.py` built with category initialisation, transaction methods, and budget methods
 - `BudgetService` follows the same service layer pattern as `AuthService`
 - `transactions.py` model updated to use `user_id` instead of `user_email`after identifying that storing email in records creates an unnecessary exposure risk
 - `api.ts` created to connect React frontend to Flask backend
 - `main.py` converted to a proper Flask REST API with JSON responses
 - `auth_routes.py` created as a Flask Blueprint for auth endpoints
 - `transaction_service.py` written with input validation
 - JSON data files created: `categories.json`, `budgets.json`, `transactions.json`, `users.json`
 - Sequence diagram for UR-4 added
 - React project restructured — `reactpage/` directory created
 - `Login.tsx` and `App.tsx` initial drafts implemented
 - `ForgotPassword.tsx` implemented with initial UI
 - Full set of dashboard HTML pages created with a consistent theme

### Retrospective
Several bugs were introduced during the budget service integration and fixed within the same sprint such as typos in `user_id` references, incorrect imports in `budget_service.py`, and redundant/repeated code in `auth_routes.py`.


## Sprint 4 — Frontend-Backend Integration and Auth Completion
**Dates:** 6 Mar – 17 Mar 2026  
**Sprint Goal:** Complete the authentication flow end-to-end, integrate Gmail OTP, fix the `user_id` security refactor across all components, and begin converting HTML pages to React.

### Planned
 - Conversion of html pages to React
 - Replace `user-email` with `user_id`
 - ensure login and signup is completed

### Delivered
 - `authorisation.py` updated to handle password reset tokens
 - `auth_routes.py` fixed — removed redundant and repeated code
 - Gmail SMTP integration added for OTP email delivery
 - `user_id` added to JWT payload for secure identity propagation
 - `main.py` updated to register and import routes properly
 - Login and signup modals extracted into reusable `Signup.tsx` component
 - `about.tsx` designed and implemented
 - `ForgotPassword.tsx` redesigned with improved UI
 - Merge conflict in `styles.css` resolved
 - UR-1 sequence diagram added to `SystemModelling.md`
 - UR-2 sequence diagram added
 - `dashboard.tsx` implemented — HTML prototype converted to React
 - `timetable.tsx` implemented — date-driven views and calendar navigation
 - `dashboard.css` and `timetable.css` updated to support shared layout between HTML and React
 - `App.tsx` updated with navigation routes for dashboard and timetable
 - `budget.py` model: all remaining `user_email` references replaced with `user_id`
 - `storage.ts` created — saves user email and username to localStorage on login
 - `Signup.tsx` updated to use `storage.ts` session helpers
 - `api.ts` updated with missing auth functions and raw fetch calls removed
 - `App.tsx`: dashboard and timetable routes made protected via `PrivateRoute`

### Retrospective
This was the most intensive sprint in terms of bug resolution. The `user_email` → `user_id` refactor needed to be applied consistently across the `Budget` model, `budget_service.py`, `main.py`, JWT payload, and the `@token_required` decorator. Each component was fixed independently rather than in one coordinated change, which meant some bugs were introduced and fixed within the same sprint across multiple commits.


## Sprint 5 — Academic Service, Deadlines, and React Component Completion
**Dates:** 24 Mar – 2 Apr 2026  
**Sprint Goal:** Build the academics service, implement the deadlines page with full backend integration, convert remaining HTML pages to interactive React components, and complete frontend routing.

### Planned
 - `Deadline` model and `DeadlineService` with priority and completion tracking
 - Workload stress indicator calculated from overdue and due-soon counts
 - `AcademicsService` coordinating modules, assessments, analytics, and notes
 - Module tracker with weighted average score calculation per module
 - Initial documentation structure

### Delivered
 - `deadlines.tsx` implemented as a functional React component with backend integration
 - `deadlines.css` updated to support the new React layout
 - `App.tsx` updated with route for `/deadlines`
 - `auth_routes.py` fix — email service credential loading resolved via `.env`
 - `requirements.txt` generated and committed with all backend dependencies
 - `budget.tsx` converted from static mockup to interactive React component with Recharts pie charts and live backend data
 - `modules.tsx` converted — academic module tracker with assessment input
 - `tasks.tsx` converted — task manager with kanban-style layout
 - `budget.css`, `modules.css`, `tasks.css` updated with full theme support
 - `academics_service.py` built as a facade coordinating four domain classes:`Modules`, `Assessments`, `AcademicAnalytics`, `Notes`
 - `main.py` updated with academic service routes
 - `assessments.json`, `modules.json`, `notes.json` storage files initialised
 - Academic data models (`analytics.py`, `assessments.py`, `modules.py`) updated with calculation logic
 - `api.ts` refactored — improved error handling, synced with backend endpoints
 - `App.tsx` updated with full routing for all pages
 - `deadlines.json` and `timetable.json` created as empty JSON lists
 - `deadline.py` model created with fields: `id`, `user_id`, `module_name`, `title`, `due_date`, `priority`, `completed`, `status`, `notes`
 - `timetable_entry.py` model created with fields: `id`, `user_id`, `module_name`, `location`, `entry_type`, `day`, `start_time`, `end_time`,`start_date`, `end_date`
 - `deadline_service.py` and `timetable_service.py` built
 - `main.py` updated with deadline and timetable routes
 - `api.ts` updated with deadline and timetable API functions
 - `deadlines.tsx` and `timetable.tsx` connected to backend
 - `account.tsx` and `help.tsx` React components created
 - `App.tsx` updated with routes for `/account` and `/help`

### Not Delivered
 - Task backend (`task_service.py`, `tasks.json`) — task management instead connected to deadlines backend
 - The `AcademicsService`, `Modules`, `Assessments`, and `Notes` models were all built using user_email as the identifier which should be resolved into user-id


### Retrospective
`deadlines.tsx` and `timetable.tsx` were initially connected to local React state rather than the backend. Both required a refactor once the backend services were built by replacing `useState` initialisers and manual state mutations with `useEffect` load-on-mount and API calls on save and delete.
The `deadline.py` model was extended beyond the original design to include `status` ("To-Do", "In Progress") and `notes` fields. Similarly `timetable_entry.py` was extended with `start_date` and `end_date` to support recurring weekly entries over a semester date range rather than single one-off events.
The `AcademicsService` was deliberately designed as a facade as the routes call a single service, which internally coordinates four domain classes. This kept `main.py` clean and allowed the academics domain to grow in complexity without affecting any other part of the system.
Tasks was connected to deadlines backend as it made use of the same data and would save work.


## Sprint 6 — CI/CD Pipeline, Linting, and Documentation
**Dates:** 3 Apr – 5 Apr 2026  
**Sprint Goal:** Set up the GitHub Actions CI pipeline, configure linting for both backend and frontend, fix all violations found, and produce the full project documentation.

### Planned
 - CI/CD completion
 - Documentation of the project
 - Format and syntax frontend and backend with linting tools
 - UML diagrams for various parts of the project
 - Finish frontend, backend, and top level `README.md`

### Delivered
 - `.github/workflows/ci.yml` created with parallel backend and frontend jobs
 - Backend job: Python 3.12 setup, `pip install -r requirements.txt`, flake8 syntax and style checking
 - Frontend job: Node 20 setup, `npm install`, TypeScript type check, ESLint lint, Vite production build
 - CI status badge added to top-level `README.md`
 - `Backend/.flake8` configuration created (max line length 100, venv excluded)
 - All flake8 violations fixed across the codebase:
  - Removed unused imports in `main.py`, `budget_service.py`, `category.py`, `transaction_service.py`
  - Fixed f-string arithmetic operator spacing (`{'='*40}` → `separator = "=" * 40`)
  - Fixed blank lines containing whitespace (`W293`) in `authorisation.py`
  - Fixed excess blank lines (`E303`) and missing blank lines before functions (`E302`) in `auth_routes.py`
  - Removed local re-import of `datetime` inside `_validate_date()` in `transaction_service.py`
 - `eslint.config.js` updated to include `eslint-config-prettier`
 - `Frontend/.prettierrc` created with formatting rules
 - `lint:fix` and `format` scripts added to `package.json`
 - All ESLint errors fixed:
  - `account.tsx`: `setState` inside `useEffect` replaced with `useState` direct initialisation from localStorage
  - `dashboard.tsx`: `setState` inside `useEffect` replaced with lazy `useState` 
 - Full `docs/` folder structure created and populated:
  - `docs/system-modelling/architecture.md` — 3-tier architecture with Mermaid diagrams, component breakdown, request lifecycle, security architecture, and design patterns
  - `docs/agile/sprint-log.md` — accurate sprint history from commit log
  - `docs/requirements/requirements.md` — functional and non-functional requirements with implementation status
  - `docs/ci-cd.md` — pipeline explanation with stage-by-stage breakdown
 - `Backend/README.md` — setup guide, project structure, full API reference
 - `Frontend/README.md` — setup guide, page reference, project structure
 - Top-level `README.md` updated with CI badge, tech stack table, and documentation links
 - `Academics/` and `main.py` updated with user_email instances replaced with user_id

### Retrospective
The CI pipeline immediately revealed issues that had not been caught locally because flake8 was not installed in the team's PATH outside the virtual environment. Using `python -m flake8` rather than `flake8` directly resolved this.
Two ESLint errors pointed to a React anti-pattern in both `account.tsx` and `dashboard.tsx`: `setState` called synchronously inside `useEffect`. In both cases the values came from `localStorage`, which is synchronous. The correct pattern was applied to both files.
The ESLint configuration caused a dependency conflict when attempting to install `@typescript-eslint/eslint-plugin` separately. The project already had `typescript-eslint` installed as a bundle via `package.json`. The resolution was to use ESLint 9's flat config format (`eslint.config.js`) and configure only the packages already present rather than duplicating them.
