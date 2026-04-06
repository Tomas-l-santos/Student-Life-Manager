# Student Life Management System – Frontend

## Overview

The Student Life Management (SLM) frontend is a high performance Single Page Application (SPA) built with React 19 and TypeScript. It serves as a centralized Command Center for students, providing real-time synchronization with a Flask REST API to manage academic progress, financial health, and daily productivity.

## Project Purpose

The aim of this frontend is to eliminate academic burnout by consolidating fragmented student data into a single, intuitive interface. Unlike static prototypes, this system features a fully reactive UI where data changes (e.g., updating a grade or completing a task) immediately propagate across the dashboard metrics.

## Features

### Implemented Features

- Secure Authentication: Responsive Login and Registration modals with real-time password strength validation.

- Unified Dashboard: Aggregated view of today's classes and upcoming deadlines using global state management.

- Dynamic Timetable: Support for Day, Week, and Month views with interactive filtering by entry type (Lecture, Lab, Seminar).

- Financial Visualization: Integrated Recharts library to provide interactive spending breakdowns and budget limit alerts.

- Academic Tracker: Algorithmic calculation of weighted averages and distinction trajectories (UK 1st/2:1 classification).

- Kanban Task Board: A productivity lifecycle manager with a distraction-free Notebook Area for detailed planning.

## User Interface Design

### Design Approach

- Consistency: A Sidebar architecture ensures navigation is never more than one click away.

- Hierarchy: High-contrast cards separate critical "Alerts" (Overdue/Overbudget) from standard informational lists.

- Adaptability: A CSS-variable driven engine supports Classic, Light, and Dark modes to reduce eye strain during late-night study sessions.

### Design Rationale

The layout uses a Dashboard-First methodology. By providing Snapshots on the main page, we satisfy NFR-6 (completing key tasks in under three interactions), allowing students to view their status without deep-diving into sub-pages.

## Technical Specification

| Dependency   | Version      | Purpose                                                |
| ------------ | ------------ | ------------------------------------------------------ |
| React        | 19.2.4       | UI library for component-based architecture.           |
| Vite         | 8.0.0 (Beta) | Next-generation frontend tooling and build pipeline.   |
| TypeScript   | 5.9.3        | Static type checking for robust, error-free logic.     |
| React Router | 7.13.0       | Declarative routing for dashboard navigation.          |
| Recharts     | 3.8.1        | Data visualization for financial and academic metrics. |
| Bootstrap    | 5.3.8        | Grid system and foundational styling components.       |

## Frontend Structure

```text
Frontend/
├── public/                     # Static global assets
│   └── Images/                 # System UI screenshots and logos
├── src/                        # Main application source code
│   ├── assets/                 # Local assets and icon files
│   ├── components/             # Reusable UI components
│   ├── Pages/                  # Legacy/Static HTML prototyping layouts
│   │   ├── dashboard pages/    # HTML mockups for dashboard features
│   │   └── Login Pages/        # HTML mockups for entry pages
│   ├── reactpage/              # Primary React Application Logic
│   │   ├── Dashboard RP/       # Core feature components (Budget, Tasks, etc.)
│   │   ├── about.tsx           # Company/Team information page
│   │   ├── ForgotPassword.tsx  # Password recovery workflow
│   │   ├── Login.tsx           # Landing page logic (home page)
│   │   └── Signup.tsx          # User registration modals
│   ├── services/               # Infrastructure Layer
│   │   ├── api.ts              # Flask REST API endpoints and Fetch logic
│   │   └── storage.ts          # LocalStorage management (JWT & Sessions)
│   ├── styles/                 # Modular CSS System
│   │   ├── dashboard-css/      # Feature specific styling
│   │   ├── login css/          # Authentication specific styling(HTML)
│   │   └── styles.css          # styles for about,ForgotPassword,login,signup.tsx (React)
│   ├── App.tsx                 # Main Router and Private Route configuration
│   ├── main.tsx                # Application entry point (DOM Rendering)
│   ├── App.css                 # Base application styles
│   └── index.css               # Global reset and typography
├── .eslintrc.js                # Linting configuration
├── package.json                # Dependencies and project metadata
├── tsconfig.json               # TypeScript compiler settings
└── vite.config.ts              # Vite build and server configuration
```

## Installation & Setup

- **_Clone the Repository_**

- **_Navigate to Directory: cd Frontend_**

- **_Install Dependencies: npm install_**

- **_Launch Local Server: npm run dev_**

- **_Access App: Navigate to http://localhost:5173_**

### Folder Structure

```text
frontend/
├── pages/
├── styles/
├── scripts/
├── assets/
└── README.md

Key Files

Briefly explain what each important file does.

Technologies Used
HTML
CSS
JavaScript
GitHub Pages (if used)
Mermaid (if diagrams are referenced elsewhere)
Installation / Setup
Running Locally

Step-by-step:

Clone repository
Open project folder
Open the HTML file in browser or run with Live Server
Navigate through pages
Usage Guide
How to Use the Frontend

Explain how a user interacts with it:

open login page
navigate through sidebar
add/view information
interact with forms and sections
Requirements Coverage
Related Functional Requirements

Link the frontend to requirements, for example:

UR-1: create and manage account
timetable management
deadlines tracking
task organisation
module management
budget tracking
Related Non-Functional Requirements
usability
consistency
responsiveness
maintainability
Design Decisions
Key Frontend Decisions

For example:

static page-first approach for quick prototyping
reusable layout across pages
simple CSS structure for maintainability
clear separation of pages and styling
Testing
Frontend Testing Performed
page navigation testing
form input testing
layout consistency checks
browser rendering checks
Limitations
currently static in some areas
limited backend integration
no live email verification yet
AI Usage Acknowledgement

Some parts of this frontend were developed with the help of AI tools such as ChatGPT. All AI-generated suggestions were reviewed, modified, and tested before being included.

Example Prompts Used
“Generate a clean sidebar layout for a student dashboard”
“Suggest a folder structure for a multi-page frontend project”
“Help improve the wording for the README documentation”
Authors / Team Contribution

State who worked on the frontend and what they contributed.

Future Improvements
connect to backend services
improve validation
responsive design for mobile
accessibility improvements
References

Include any sources used for design inspiration, documentation, or tools.
```
