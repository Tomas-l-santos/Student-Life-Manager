# ELEE1149 – Student Life Management System

A web-based system designed to support students in managing academic, financial, and personal responsibilities in one unified platform.

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

| Feature Area        | Description |
|--------------------|-------------|
| User Account System | Secure login and account creation with password validation and reset functionality |
| Dashboard          | Central overview displaying tasks, deadlines, and workload indicators with real-time updates |
| Task Management    | Create, edit, delete, and prioritise tasks, with completion tracking |
| Deadline Tracking  | Manage deadlines with automatic sorting and visual indicators for overdue and upcoming items |
| Module Management  | Record modules and assessment results with automatic average calculation |
| Budget Management  | Track income and expenses with categorisation and real-time balance updates |

## Tech Stack

- Frontend: HTML, CSS, TypeScript 5.9, React 19, Vite 8, Recharts
- Backend: Python 3.12, Flask 3, Flask-CORS  
- Data Storage: JSON flat files
- Authentication: pyJWT, bcrypt
- Version Control: Git & GitHub  
- Development Tools: VS Code, GitHub Classroom,
- Linting: ESLint 9, Prettier, flake8, Black

## Getting Started
*What does a user need on there system to run this software?*

### Prerequisites

- Python 3.12 or higher
- Node.js 20 or higher
- npm 10 or higher
- A Gmail account with an App Password configured (for OTP email)
- Git

### Installation
See [Backend README](./Backend/README.md#setup) and [Frontend README](./Frontend/README.md#setup-instructions)

### Usage
You need two terminals running simultaneously

Terminal 1: Start the backend:
```bash
cd Backend
source myenv/Scripts/activate   # for windows Git Bash
python main.py
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
*Add screenshots or GIFs to showcase the UI or functionality.*


### Project Structure
*Example format below*
```
project-name/
│
├── src/            # Source code
├── docs/           # Documentation
├── tests/          # Unit tests
└── README.md       # Project README
```

## Contributors

- [A9rlt](https://github.com/A9rlt) - Back End Developer
- [AbishilS](https://github.com/AbishilS) - Front End Developer
- [declaringintent](https://github.com/declaringintent) – Back End Developer
- [Tomas-l-santos](https://github.com/Tomas-l-santos) - Front End Developer

## License
Specify the license (e.g., MIT, Apache 2.0).
`
