# Student Life Management System Frontend

## Overview

The Student Life Management (SLM) frontend is a high performance Single Page Application (SPA) built with React 19 and TypeScript. It serves as a centralized Command Center for students, providing real-time synchronisation with a Flask REST API to manage academic progress, financial health, and daily productivity.

## Project Purpose

The aim of this frontend is to eliminate academic burnout by consolidating fragmented student data into a single, intuitive interface. Unlike static prototypes, this system features a fully reactive UI where data changes (e.g., updating a grade or completing a task) immediately propagate across the dashboard metrics.

## Features

### Implemented Features

- Secure Authentication (UR-1, SR-1.1, SR-1.2): Responsive Login and Registration modals with real-time password strength validation.

- Unified Dashboard (UR-2): Aggregated view of today's classes and upcoming deadlines using global state management.

- Dynamic Timetable (UR-3): Support for Day, Week, and Month views with interactive filtering by entry type (Lecture, Lab, Seminar).

- Financial Visualization (UR-4): Integrated Recharts library to provide interactive spending breakdowns and budget limit alerts.

- Academic Tracker (UR-5): Algorithmic calculation of weighted averages and distinction trajectories (UK 1st/2:1 classification).

- Kanban Task Board (UR-6): A productivity lifecycle manager with a distraction-free Notebook Area for detailed planning.

## User Interface Design

### Design Approach

- Consistency: A Sidebar architecture ensures navigation is never more than one click away.

- Hierarchy: High-contrast cards separate critical "Alerts" (Overdue/Overbudget) from standard informational lists.

- Adaptability: A CSS-variable driven engine supports Classic, Light, and Dark modes to reduce eye strain during late-night study sessions.

### Design Rationale

The interface follows a dashboard-first approach, where key information is presented immediately upon login. This design reduces the need for navigation between pages and supports efficient task completion.

This approach aligns with Non-Functional Requirements related to usability and performance, particularly the requirement that key tasks should be completed within a limited number of interactions. It also improves maintainability, as reusable components and consistent layout

## Technical Specification

| Dependency   | Version      | Purpose                                                                                             |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------- |
| React        | 19.2.4       | UI library for component-based architecture.                                                        |
| Vite         | 8.0.0 (Beta) | Next-generation frontend tooling and build pipeline.                                                |
| TypeScript   | 5.9.3        | Static type checking for robust, error-free logic.                                                  |
| React Router | 7.13.0       | Declarative routing for dashboard navigation.                                                       |
| Recharts     | 3.8.1        | Data visualization for financial and academic metrics.                                              |
| Bootstrap    | 5.3.8        | Foundational UI components and global resets; layout logic handled via custom CSS Grid and Flexbox. |

### Technology Justification

React was selected due to its component-based architecture, which improves code reusability and maintainability. TypeScript was used to enhance code reliability through static typing.

Vite was chosen for its fast build times and efficient development workflow, although its beta version introduces potential stability risks. This trade-off was considered acceptable due to the performance benefits during development.

React Router enables efficient client-side navigation, reducing page reloads and improving user experience. Recharts was integrated to provide clear and interactive data visualisation, supporting better interpretation of financial and academic data.

## API End Points

| Route Path       | Component          | Auth Required | Description                     |
| ---------------- | ------------------ | ------------- | ------------------------------- |
| /                | Login.tsx          | No            | Landing page with login/signup  |
| /about           | about.tsx          | No            | Info about the system and team  |
| /forgot-password | ForgotPassword.tsx | No            | Reset password flow             |
| /dashboard       | dashboard.tsx      | Yes           | Overview of classes and tasks   |
| /timetable       | timetable.tsx      | Yes           | View and manage schedule        |
| /deadlines       | deadlines.tsx      | Yes           | Track assignments and deadlines |
| /tasks           | tasks.tsx          | Yes           | Kanban board for tasks          |
| /modules         | modules.tsx        | Yes           | Track grades and performance    |
| /budget          | budget.tsx         | Yes           | Monitor spending and budget     |
| /account         | account.tsx        | Yes           | Manage user profile             |
| /help            | help.tsx           | Yes           | Guides, FAQs, and support       |

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

### Structure Rationale

The project structure separates concerns into components, services, and styles, improving code readability and maintainability.

Reusable components are isolated to avoid duplication, while API logic is centralised in the services layer to ensure consistent communication with the backend.

The inclusion of initial static HTML pages reflects the early prototyping phase of the project, which was later transitioned into a React-based architecture.

## Installation & Setup

### Prerequisites

Ensure the following tools are installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. Clone the repository:

```bash

    git clone <repository-url>

- **_Navigate to Directory: cd Frontend_**

    cd Frontend

- **_Install Dependencies: npm install_**

    npm install

- **_Launch Local Server: npm run dev_**

    npm run dev

- **_Access App: Navigate to http://localhost:5173_**
```

## Key Files

- **App.tsx**  
  Main application component responsible for routing and layout structure.

- **main.tsx**  
  Entry point of the React application, responsible for rendering the app into the DOM.

- **api.ts**  
  Handles communication with the Flask backend API, including data fetching and submission.

- **storage.ts**  
  Manages local storage, including session handling and token persistence.

- **Login.tsx / Signup.tsx**  
  Implements authentication interfaces and user input handling.

- **ForgotPassword.tsx**  
  Manages password recovery workflow using verification mechanisms.

- **Dashboard Components**  
  Responsible for rendering core features such as tasks, budget tracking, and timetable data.

- **styles**  
  Define global and component-level styling for consistent UI presentation.

## Technologies Used

### Core Technologies

- React (Frontend framework)
- TypeScript (Static typing)
- Vite (Build tool)
- Flask (Backend API)
- Recharts (Data visualisation)

In addition to the primary React-based implementation, several supporting technologies were used during the development process:

- **HTML & CSS**  
  Used during the initial prototyping phase to design and structure static layouts before transitioning to a React-based architecture. These prototypes acted as blueprints for the final component design.

- **JavaScript**  
  Used in early development stages to test interactive behaviour before implementing logic within React components.

- **Mermaid**  
  Used to generate system diagrams (e.g., sequence diagrams and system models) to support documentation and system understanding.

## Usage Guide

### How to Use the Frontend

1. **Access the Application**  
   Open the application in a web browser via the local development server.

2. **User Authentication**
   - New users can register by providing an email, username, and password.
   - Existing users can log in using their credentials.

3. **Navigate the Dashboard**  
   After logging in, users are presented with a dashboard displaying key information such as upcoming deadlines, scheduled activities, and summary metrics.

4. **Use the Sidebar Navigation**  
   The sidebar provides access to core features including:
   - Timetable
   - Tasks
   - Budget tracking
   - Academic performance

5. **Interact with Features**  
   Users can:
   - Add, edit, and delete tasks or deadlines
   - Input financial data and track expenses
   - View and manage timetable entries
   - Monitor academic progress through calculated metrics

6. **Real-Time Updates**  
   Changes made within the system are reflected immediately across relevant components, ensuring a responsive user experience.

## Requirements Coverage

### Functional Requirements Mapping

The frontend implementation supports the following functional requirements:

| Requirement ID | Description             | Frontend Implementation                                              |
| -------------- | ----------------------- | -------------------------------------------------------------------- |
| UR-1           | User Account & Security | Secure Login, Signup, and JWT session management                     |
| UR-2           | Financial Management    | Budget.tsx featuring Recharts visualization and budget limit alerts  |
| UR-3           | Academic Performance    | Modules.tsx with weighted average algorithms and trajectory tracking |
| UR-4           | Productivity & Tasks    | Kanban board lifecycle management and reactive Deadline tables       |

### Non-Functional Requirements

The frontend also addresses key non-functional requirements:

- **Usability**  
  A consistent layout and intuitive navigation reduce user effort and improve accessibility.

- **Performance**  
  The use of a Single Page Application (SPA) architecture enables fast interaction and reduced page reloads.

- **Responsiveness**  
  The interface adapts to different screen sizes using responsive design principles.

- **Maintainability**  
  A modular component-based structure ensures that features can be updated and extended efficiently.

## Design Decisions

### Key Frontend Decisions

- **Prototype-First Development Approach**  
  Initial static HTML and CSS pages were created to design and validate the user interface before transitioning to a React-based architecture. This approach reduced development risk and allowed early testing of layout and usability.

- **Component-Based Architecture (React)**  
  The system was later implemented using React to enable reusable components and improve maintainability. This reduces code duplication and supports scalable development.

- **Separation of Concerns**  
  The project structure separates UI components, styling, and data handling (services layer). This improves readability, debugging, and future extensibility.

- **Use of CSS Variables for Theming**  
  A variable-based styling system was implemented to support multiple themes and ensure consistent design across the application.

- **Client-Side Routing**  
  React Router was used to handle navigation within the application without full page reloads, improving performance and user experience.

### Design Trade-offs

While React improves scalability and maintainability, it introduces additional complexity compared to static HTML. The initial use of static pages simplified early development but required restructuring during the transition to a dynamic framework.

Similarly, using Vite (beta) improved development speed but introduced potential stability risks, which were considered acceptable within the project scope.

## AI Usage Acknowledgement

AI tools such as ChatGPT were used to support frontend development, particularly during prototyping, UI design, and documentation.

AI assisted with:

- Generating initial layout ideas (e.g., dashboard and sidebar)
- Suggesting project structure and organisation
- Improving clarity and structure of documentation

All AI-generated outputs were critically reviewed, modified, and tested before being integrated into the system to ensure alignment with project requirements and architecture.

A detailed critical evaluation of AI usage, including prompt evolution, limitations, and decision-making, is provided in the `AI-Reflection.md` file.

## State who worked on the frontend and what they contributed.

### Tomas – Frontend Development Contribution

- Led the initial frontend prototyping phase by designing and developing HTML-based layouts, which served as the foundation for the React application.

- Engineered a consistent and reusable CSS styling system, ensuring seamless visual transition from static prototypes to the final TypeScript-based implementation.

- Translated functional requirements into structured frontend features, preparing them for scalable integration within a component-based React architecture.

- Developed and standardised the theming and visual identity of the application, including layout structure, colour schemes, and UI consistency across all main interfaces.

### Abhishil - Frontend Development Contribution

- Architecture & Security: Led the transition from static HTML to a React + TypeScript SPA. Implemented protected routing, JWT-based session management, password validation, OTP reset flow, and robust error handling.

- API & Data Handling: Designed a central API layer to integrate with the Flask backend. Implemented parallel data fetching to efficiently combine timetable, deadline, and financial data in real time.

Core Features:

- Built an academic system with grade calculations, UK classification logic, and visual tracking charts.
  Developed a workload stress indicator and advanced deadline sorting.
- Engineered a dynamic timetable that visually adapts based on lecture times.

UI & Productivity Tools:

- Developed a Kanban board with drag-and-drop functionality and auto-saving notes.
- Added charts for financial and academic data visualization.

UX & Design:

- Implemented light/dark themes, smooth animations, and reusable components such as modals.

## Testing

### Testing Approach

Testing was performed to validate the functionality, usability, and consistency of the frontend system.

### Functional Testing

- Verified user authentication flows, including login, registration, and password recovery
- Tested creation, editing, and deletion of tasks, deadlines, and financial records
- Confirmed that dashboard data updates correctly after user interactions

### User Interface Testing

- Checked layout consistency across all pages
- Verified correct rendering of components such as cards, charts, and navigation elements
- Ensured visual hierarchy correctly highlights important information (e.g., alerts)

### Input Validation Testing

- Tested invalid inputs (e.g., weak passwords, empty fields)
- Ensured appropriate error messages are displayed
- Verified that data is only submitted when valid

### Browser Testing

- Tested the application in multiple browsers (e.g., Chrome, Edge)
- Ensured consistent behaviour and layout across environments

### Limitations

- No automated testing framework (e.g., Jest or Cypress) was implemented due to project scope
- Testing was primarily manual, which may limit coverage of edge cases
