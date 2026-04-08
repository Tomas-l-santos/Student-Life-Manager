# ELEE1149 – Student Life Management System

<div align="center">

  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Made%20with-Python%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/Made%20with-React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Built%20with-Vite_8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  </a>

<br><br>

  <img src="https://skillicons.dev/icons?i=ts,css,py,html,js" alt="Languages">

<br><br>

  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" alt="Build Status">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License">

<br><br>

  <img src="/docs/images/Final.gif" alt="Student Life Management System Demo" width="100%">

</div>

> **A web-based system designed to support students in managing academic, financial, and personal responsibilities in one unified platform.**

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Demo](#demo)
- [Known Issues](#known-issues)
- [Contributors](#contributors)
- [License](#license)

## About the Project

This project is a Student Life Management System, developed as part of the ELEE1149 Software Engineering module. The system provides students with a centralised platform to manage key aspects of university life, including:

- Academic modules and grades
- Timetables and deadlines
- Task management
- Personal budgeting and expenses

### Problem it Solves

Students often use multiple disconnected tools (notes apps, calendars, spreadsheets), which leads to:

- Poor organisation
- Missed deadlines
- Lack of visibility over workload and finances

This system solves that by integrating all features into one structured application, improving productivity and reducing stress.

### Target Users

- University students
- Individuals managing multiple responsibilities
- Users who need a simple and structured productivity tool

## Features

### Core Features

The system was developed based on defined functional and non-functional requirements, ensuring alignment between user needs and implementation.

| Feature Area        | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| User Account System | Secure login and account creation with password validation and reset functionality           |
| Dashboard           | Central overview displaying tasks, deadlines, and workload indicators with real-time updates |
| Task Management     | Create, edit, delete, and prioritise tasks, with completion tracking                         |
| Deadline Tracking   | Manage deadlines with automatic sorting and visual indicators for overdue and upcoming items |
| Module Management   | Record modules and assessment results with automatic average calculation                     |
| Budget Management   | Track income and expenses with categorisation and real-time balance updates                  |
| Timetable Entries   | Create a personalised timetable with categorisation for different objectives                 |

## Tech Stack

- Frontend: HTML, CSS, TypeScript 5.9, React 19, Vite 8, Recharts
- Backend: Python 3.12, Flask 3, Flask-CORS
- Data Storage: JSON flat files
- Authentication: pyJWT, bcrypt
- Version Control: Git & GitHub
- Development Tools: VS Code, GitHub Classroom
- Linting: ESLint 9, Prettier, flake8, Black

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 20 or higher
- npm 10 or higher
- A Gmail account with an App Password configured (for OTP email)
- Git

### Installation

See [Backend README](./Backend/README.md#setup) and [Frontend README](./Frontend/README.md#setup-instructions)

### Usage

**_You need two terminals running simultaneously._**

Terminal 1: Start the backend:

```bash
cd Backend
source myenv/Scripts/activate # for Windows Git Bash
python main.py # python3 for Ma OS
# Running on http://127.0.0.1:5000
```

Terminal 2: Start the frontend:

```bash
cd Frontend
npm run dev
# Local: http://localhost:5173
```

Open http://localhost:5173 in your browser.

## Screenshots

### Home Page and About Page

| Home Page                                 | About Page                       |
| ----------------------------------------- | -------------------------------- |
| ![Home](/Frontend/public/Images/Home.png) | ![About](/docs/images/about.png) |

### Login And Signup Popup

| Login Popup                      | Signup Popup                       |
| -------------------------------- | ---------------------------------- |
| ![Login](/docs/images/login.png) | ![Signup](/docs/images/signup.png) |

### DashBoard (Variants)

| Dashboard(Classic)                   | Dashboard(Light Mode)            | Dashboard(Dark Mode)           |
| ------------------------------------ | -------------------------------- | ------------------------------ |
| ![Classic](/docs/images/classic.png) | ![Light](/docs/images/light.png) | ![Dark](/docs/images/dark.png) |

### Timtable And Deadlines Screen

| Timetable                                | Deadlines                               |
| ---------------------------------------- | --------------------------------------- |
| ![Timetable](/docs/images/timtables.png) | ![Deadlines](/docs/images/deadline.png) |

### Tasks and Modules Screen

| Tasks                                 | Modules                                   |
| ------------------------------------- | ----------------------------------------- |
| ![Tasks](/docs/images/taskscreen.png) | ![Modules](/docs/images/modulescreen.png) |

### Budget Screen

| Budget-1                         | Budget-2                          |
| -------------------------------- | --------------------------------- |
| ![Bud1](/docs/images/buget2.png) | ![Bud2](/docs/images/budget1.png) |

### Account and Help Screen

| Account Screen                       | Help Screen                    |
| ------------------------------------ | ------------------------------ |
| ![Acoount](/docs/images/account.png) | ![Help](/docs/images/help.png) |

---

### Project Structure

```
elee1149-courswork-2025-a-s-s-a
├── AI-Reflection.md                    # Formal declaration and critical evaluation of GenAI usage
├── Backend                             # Flask REST API implementation and core business logic
│   ├── README.md                       # Backend technical documentation and environment setup
│   ├── data                            # Persistent flat-file storage layer (JSON format)
│   │   ├── Transactions.json           # Stores all user financial income and expense records
│   │   ├── Users.json                  # Persistent user credentials and profile metadata
│   │   ├── assessments.json            # Academic grading records and weightings
│   │   ├── budgets.json                # User-defined monthly category spending limits
│   │   ├── categories.json             # Static definition of expense and income types
│   │   ├── deadlines.json              # Primary store for all academic task deadlines
│   │   ├── modules.json                # Registry for academic course modules and credits
│   │   ├── notes.json                  # Content for the distraction-free notebook feature
│   │   └── timetable.json              # Scheduled events and class occurrences
│   ├── main.py                         # Application gateway and RESTful endpoint definitions
│   ├── models                          # Object-oriented schemas and data transfer objects
│   │   ├── Academics                   # Schema definitions for modules and grades
│   │   ├── Budget                      # Data structures for financial transactions
│   │   ├── deadline.py                 # Blueprint for academic deadline objects
│   │   ├── timetable_entry.py          # Blueprint for scheduling and duration logic
│   │   └── user.py                     # User entity model including secure UUID management
│   ├── requirements.txt                # Python environment dependencies (Flask, JWT, bcrypt)
│   ├── services                        # Business logic layer isolating API from storage
│   │   ├── academics_service.py        # Logic for grade weighting and module analytics
│   │   ├── auth_routes.py              # JWT-based secure endpoint controllers
│   │   ├── authorisation.py            # Authentication logic and password hashing management
│   │   ├── budget_service.py           # Financial threshold logic and balance calculations
│   │   ├── deadline_service.py         # CRUD operations and sorting for task management
│   │   ├── timetable_service.py        # Algorithmic scheduling and occurrence logic
│   │   └── transaction_service.py      # Validation and management of cash flow data
│   ├── storage                         # Infrastructure layer for I/O operations
│   │   └── storagerepo.py              # Thread-safe JSON handling with locking mechanisms
│   └── tests                           # Test For Backend
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_budget.py
│       ├── test_deadlines.py
│       ├── test_performance.py
│       ├── test_security.py
│       └── test_timetable.py
├── Frontend                            # React 19 / TypeScript Single Page Application (SPA)
│   ├── README.md                       # Frontend architecture overview and build guides
│   ├── ReactandTypeScripts.md          # Technical guidelines for TSX component development
│   ├── eslint.config.js                # Linting rules for maintaining code quality standards
│   ├── index.html                      # Empty
│   ├── package-lock.json               # Deterministic dependency tree lock file
│   ├── package.json                    # Frontend project metadata and script definitions
│   ├── public                          # Static assets served without processing
│   │   ├── Images                      # Core system imagery and UI visual elements
│   │   └── vite.svg                    # Application favicon and default branding
│   ├── src                             # Main application source code
│   │   ├── App.css                     # Empty
│   │   ├── App.tsx                     # Main router configuration and route guarding
│   │   ├── Pages                       # Legacy/Static HTML prototyping layouts
│   │   ├── assets                      # Component-specific static resources
│   │   ├── index.css                   # Empty
│   │   ├── main.tsx                    # Entry point for React DOM mounting
│   │   ├── reactpage                   # Primary dashboard and authentication views
│   │   ├── services                    # API client infrastructure and storage helpers
│   │   └── styles                      # Modular CSS system supporting dynamic theming
│   │       ├── dashboard-css           # Style modules for dashboard feature pages
│   │       │   ├── account&security.css
│   │       │   ├── budget.css
│   │       │   ├── dashboard.css
│   │       │   ├── deadlines.css
│   │       │   ├── help.css
│   │       │   ├── modules.css
│   │       │   ├── tasks.css
│   │       │   └── timetable.css
│   │       ├── login-css               # Dedicated styles for the auth and entry flows
│   │       │   ├── createyouraccount.css
│   │       │   ├── forgotpassword.css
│   │       │   └── login.css
│   │       └── styles.css              # Core styling for Landing, About, and Auth pages
│   ├── tsconfig.app.json               # TypeScript configuration for application code
│   ├── tsconfig.json                   # Master TypeScript compiler settings
│   ├── tsconfig.node.json              # TypeScript configuration for Vite/Node environment
│   └── vite.config.ts                  # Vite build tool and dev server configuration
├── GeistMono                           # Project typography resources
│   ├── GeistMonoNerdFontMono-Regular.otf# Monospaced font file for technical UI elements
│   ├── LICENSE                         # Licensing terms for font redistribution
│   └── README.md                       # Font installation and usage instructions
├── License                             # Primary project licensing terms (MIT)
├── OriginalREADME.md                   # Inherited project documentation
├── README.md                           # Main project portal and documentation hub
└── docs                                # Comprehensive engineering and lifecycle documentation
    ├── agile                           # Project management and iterative development logs
    │   ├── backlog.md                  # Prioritised list of functional user stories
    │   ├── retrospective.md            # Critical analysis of team performance and workflow
    │   └── sprint-log.md               # Detailed history of development iterations
    ├── ci-cd.md                        # Documentation of the linting and testing pipeline
    ├── images                          # Repository of UML diagrams and system screenshots
    │   ├── ClassDiagram.png            # Visual representation of data structures
    │   ├── Passwords.png               # Architectural view of authentication security
    │   ├── SequenceDiagramOne.png      # Workflow mapping for login/auth cycles
    │   ├── SequenceDiagramTwo.png      # Workflow mapping for module management
    │   ├── StateDiagramFour.png        # State transitions for budget tracking
    │   ├── StateDiagramOne.png         # State transitions for user sessions
    │   ├── StateDiagramThree.png       # State transitions for task progress
    │   ├── StateDiagramTwo.png         # State transitions for academic modules
    │   ├── acc.png                     # Visual blueprint of account systems
    │   ├── budget.png                  # Visual blueprint of financial management
    │   ├── modules.png                 # Visual blueprint of academic tracking
    │   └── task.png                    # Visual blueprint of the Kanban board logic
    ├── requirements                    # Formal requirements engineering documentation
    │   ├── Requirement.md              # Functional and non-functional specifications
    │   ├── traceability-matrix.md      # Mapping of requirements to implementation
    │   └── user-stories.md             # End-user requirements and use-case scenarios
    └── system-modelling                # Blueprint for system architecture and UML
        ├── SystemModelling.md          # Master architectural design document
        ├── activity-diagram.md         # Process flow logic for system operations
        ├── architecture.md             # High-level overview of system components
        ├── class-diagram.md            # Structural modelling of backend entities
        ├── sequence-diagram.md         # Temporal mapping of system interactions
        ├── state-diagram.md            # Behavioral modelling of system entities
        └── use-case.md                 # Visual mapping of user-system interactions
```

## Documentation

The full engineering process is documented in the following files:

- Requirements: See [Requirements.md](./docs/requirements/Requirement.md) for Functional & Non-Functional mapping.

- System Modelling: See [SystemModelling.md](./docs/system-modelling/SystemModelling.md) for UML and Architectural decisions.

- AI Reflection: See [AI-Reflection.md](./AI-Reflection.md) for evaluation of LLM usage during the SDLC.

## Demo

- [Watch the Demo](https://youtu.be/RxWvsZ9n9e4)

## Known Issues

- Many Exceptions are bare which leaks internal error details to the client.
- No proper logging of errors.
- No actual rate limiting exists for logging in as the lockout counter resets everytime the Flask process restarts.
- There is no error handling for corrupted JSON files.
- Many functions are inefficient such as calling `datetime.strptime` twice in `get_user_transactions` to retrieve month and year separately.

## Contributors

- [A9rlt](https://github.com/A9rlt) - Lead Back End Developer
- [AbishilS](https://github.com/AbishilS) - Lead Front End Developer
- [declaringintent](https://github.com/declaringintent) - Lead Back End Developer
- [Tomas-l-santos](https://github.com/Tomas-l-santos) - Lead Front End Developer

## License

Distributed under the **MIT License**. See the [LICENSE](./License) file for more information.
