# Project Retrospective - Student Life Management Syste

**Sprint/Period:** Initial Development (January - March 2025)  
**Team:** ASSA (Amr Assaf, Abhishil Sinoj, Tomás Santos, Muiiz Ayodele)
**Period:** Januvary 2025 – April 2026

---

## Sprint 1 — Initialisation & Requirements Engineering

### Goal: Establish repository, define roles, and engineer system requirements.

**_What Went Well:_**

- Proactive Tech Shift: Deciding to convert the project from JavaScript to TypeScript early provided robust type-safety that caught dozens of integration bugs before they reached runtime.

- Collaborative Logic: Writing requirements through multiple Pull Requests ensured the whole team understood the Data Contracts before a single line of backend code was written.

**_What Didn't Go Well:_**

- Modeling Lag: We prioritized text requirements over visual UML modelling, leaving us without a visual blueprint for data relationships during the first coding week.

**_What We’d Do Differently:_**

- Draft basic UML sketches (even if not final) alongside functional requirements to visualize logic flow before the environment setup.

## Sprint 2 — Backend Core & UI Prototyping

### Goal: Build the auth backend and create static HTML prototypes for the UI.

**_What Went Well:_**

- Storage Abstraction: The creation of the JSONStorage class in storagerepo.py provided a unified interface for file persistence, making it easy to add new data models (like Budgets and Modules) later.

- Vibe Check: Building static HTML/CSS prototypes first allowed the frontend team to finalize the UI layout and a brand identity without being blocked by API development.

**_What Didn't Go Well:_**

- Development Siloing: Frontend and Backend teams worked in isolation. While prototypes looked good, we had no mechanism to test if the backend models actually fit the React component needs.

**_What We’d Do Differently:_**

- Define a shared JSON Contract document in Sprint 2 to ensure frontend state keys matched backend dictionary keys from day one.

## Sprint 3 — Budget Service & Security Refactoring

### Goal: Implement financial tracking and establish the first React-to-Flask API bridge.

**_What Went Well:_**

- The Security Pivot: Identifying the risk of using user_email as a foreign key and refactoring the entire system to UUIDs (user_id) saved us from a catastrophic data migration in the project.

- Blueprint Adoption: Transitioning to Flask Blueprints kept the main.py entry point clean and modular as we scaled up.

**_What Didn't Go Well:_**

- Integration Friction: Connecting the two halves revealed "Naming Convention" discrepancies (e.g., transactionDate vs transaction_date) that caused debugging.

**_What We’d Do Differently:_**

- Establish a project-wide Naming Convention guide for variables to prevent name case conflicts during API calls.

## Sprint 4 — End-to-End Auth & Temporal UI

### Goal: Complete the authentication flow and build the interactive Timetable navigation.

**_What Went Well:_**

- Professional Logic: Successfully implementing a 6-digit OTP via Gmail SMTP provided a production-grade finish to the account recovery flow.

- Mathematical UI: Developing the Pixel-per-minute algorithm for the Timetable ensured that lecture blocks scaled accurately to their duration, satisfying UR-3.

**_What Didn't Go Well:_**

- Style Drift: Frequent global changes to styles by multiple developers led to complex merge conflicts.

**_What We’d Do Differently:_**

- Implement CSS Modules or a more modular folder structure for stylesheets to scope styles specifically to components (e.g., Budget.module.css).

## Sprint 5 — Academic Logic & System Resilience

### Goal: Build the academics facade, implement grade analytics, and finish frontend routing.

**_What Went Well:_**

- Facade Pattern: Using AcademicsService to coordinate Modules, Assessments, and Notes followed industry-standard OOP principles and kept the backend architecture clean.

- Engineering Overrides: Moving beyond simple averages to implement Weighted Contribution logic ensured academic accuracy for UK degree classifications.

- Resilience: Implementing Promise.allSettled() on the dashboard ensured the UI remained functional even if a specific service (like Budget) experienced latency.

**_What Didn't Go Well:_**

- We added new fields (“status” and “notes”) to the deadline feature halfway through the sprint, which forced us to update many existing files in both the backend and frontend.

**_What We’d Do Differently:_**

- Lock the data structure before development starts so we don’t need to make disruptive changes mid-sprint.

## Sprint 6 — CI/CD & Quality Assurance

### Goal: Configure GitHub Actions, enforce linting, and finalize documentation.

**_What Went Well:_**

- Automated Quality: Setting up parallel CI jobs for Flask and React forced us to fix significant anti-patterns, such as removing synchronous setState calls inside useEffect.

- Technical Debt Clearance: Finalizing the migration to UUIDs and moving all secrets to a .env file brought the project up to professional security standards.

**_What Didn't Go Well:_**

- Linting Fatigue: Fixing Flake8 and ESLint violations in the final week was exhausting.

**_What We’d Do Differently:_**

- Configure the CI pipeline and linters in Sprint 1. It is much easier to write clean code from the start than to clean up 2,500 lines at the deadline.

## Conclusion

The SLM project demonstrates a successful transition to a resilient service-oriented architecture designed to meet professional engineering standards. By integrating a React 19 (TypeScript) frontend with a Flask (Python 3.12) backend, Team ASSA delivered a cohesive system that emphasizes data integrity and academic reliability. Although early stages were affected by siloed development and naming inconsistencies, the project ultimately reached a feature-complete MVP(Minimum Viable Product). Across six sprints, the team highlighted the importance of human engineering oversight, refining AI-generated foundations into a secure and production-ready tool that supports student success.
