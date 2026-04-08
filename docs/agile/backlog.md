# Core System Features

- Financial Management: Budget tracking with category-specific limits and analytics.

- Academic Infrastructure: Module and assessment tracking with weighted contribution logic.

- Grading Analytics: UK degree classification trajectory (1st, 2:1, etc.) and GPA calculations.

- Productivity Suite: Kanban task management and spatial timetable rendering.

- Security Framework: JWT authentication, OTP password recovery, and secure data purging.

# Completed Features

## Authentication System

- JWT Integration: Token-based session management with protected React routes.

- Validation Engine: Strict regex for emails/usernames and complexity requirements for passwords.

- Brute-Force Protection: Account lockout mechanism after 5 failed login attempts.

- Recovery Flow: 6-digit OTP generation and email integration for password resets.

- Privacy Control: Permanent account deletion with cascading data purge across all JSON files.

## Academic Management - Modules

- UK Credit Standard: Support for 10, 15, 20, 30, 40, and 60 credit module weights.

- Grade Trajectory: Real-time calculation of marks needed in remaining modules to achieve a 1st Class degree.

- Assessment Tracking: CRUD operations for Exams, Coursework, and Projects with weighted scoring.

- UK Classification: Automatic mapping of percentages to 1st, 2:1, 2:2, and 3rd Class honours.

## Productivity & Scheduling

- Spatial Timetable: Mathematical rendering (Pixel-per-Minute algorithm) for accurate schedule visualization.

- Multi-View Calendar: Support for Day, Week, and Month navigation.

- Kanban Task Board: 3-column state machine (To-Do, In-Progress, Done) for academic triage.

- Workload Heuristics: Reactive "Stress Level" indicator calculated based on overdue/upcoming deadline ratios.

- Persistence: Debounced auto-save for task notes to prevent data loss during typing.

## Financial Analytics

- Category Limits: Monthly spending thresholds with visual alerts (On Track, Warning, Exceeded).

- Data Visualization: Recharts integration for Expense Breakdown and Cash Flow distribution.

- Transaction Ledger: Historical summary by month and year with income/expense filtering.eration

## UI/UX & System Architecture

- Dynamic Theme Engine: System-wide support for Classic, Light, and Dark modes via CSS variables.

- Concurrent Fetching: Optimized dashboard loading using Promise.allSettled() for non-blocking API calls.

- Thread-Safe Storage: Custom JSON storage repository using Python threading.Lock to prevent data corruption.

# Must Have Features

**_All are completed_**

- Environment Security: Implementation of .env files for SECRET_KEYS and sensitive API credentials.

- Cross-Origin Support: Proper CORS configuration to bridge the React frontend and Flask backend.

- Thread-Safe Persistence: Custom locking mechanisms in the backend to prevent JSON data corruption during concurrent writes.

- Stateless Authentication: JWT-based login system with temporal account lockout (NFR-2).

- CI/CD Pipeline: Automated GitHub Actions for linting, formatting, and building.

# Should Have Features

**_All are completed_**

- Weighted Academic Engine: Algorithmic calculation of grades based on UK classification (1st, 2:1, etc.).

- Workload Stress Heuristic: A visual metric that converts deadline density into a tiered "Stress Level" indicator.

- Temporal UI Rendering: Pixel-per-minute algorithm for the Timetable to ensure lectures scale accurately to their duration.

- Asynchronous Data Aggregation: Use of Promise.allSettled() to ensure the dashboard loads all modules without blocking the UI.

- Debounced Persistence: 1000ms delay on the notebook editor to prevent server flooding.

# Could Have

- Multi-Theme Engine: Dynamic switching between Classic Blue, Light, and Dark modes via CSS variables. [Done]

- Multi-View Calendar: Support for Day, Week, and Month views within the Timetable module. [Done]

- Kanban State Machine: status management for tasks (To-Do → In Progress → Done). [Done]

- Data Export: Ability to export the financial ledger to CSV (Planned but de-prioritized for core stability). [NOT DONE]

# Wont Have Features

- Third-Party Integrations: Direct linking to personal bank accounts (Plaid API).

- SQL Migration: The system remains strictly on a custom-built JSON persistence layer rather than a relational database.

- Native Mobile App: Support is limited to web browsers; no iOS or Android native packages were developed.

- Peer-to-Peer Sharing: Real-time collaboration on notes or shared budget groups.

- OCR & Image Processing: Automatic timetable filling from images or receipt scanning.
