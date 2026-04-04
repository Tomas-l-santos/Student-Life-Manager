# User Stories and Acceptance Criteria

## 1. Introduction and Methodology

### 1.1 Purpose and Scope

The purpose of this document is to outline the functional requirements of the Student Life Management (SLM) system from a user-focused perspective. User stories are used to ensure that each feature developed provides clear value to students. These requirements cover the full application scope, including secure login, grade tracking, budgeting, and productivity tools. This document serves as a guide for development and a reference for testing.

### 1.2 Structure and Acceptance Criteria

Requirements are written using the Agile format:

- **_“As a [user role], I want to [action], so that [benefit].”_**

Each user story is supported by Acceptance Criteria (AC), which define the conditions that must be met for the feature to be complete. These criteria help ensure accuracy and make it easier to test whether requirements have been successfully implemented.

## 2. Authentication and Security

### 2.1 User Identity and Session Management

This subsection focuses on how a student establishes their identity within the Student Life Management system and maintains access to their private data.

| ID   | User Story                                                                                                                                 | Acceptance Criteria                                                                                                                                                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| US-1 | As a student, I want to register with my email and a secure password, so that my personal and academic data is saved to a private profile. | AC 1: Given the registration form, when all fields (email, username, password, birthdate) are valid, then a unique user_id is generated and the user is redirected to the dashboard. <br> AC 2: Given a password entry, when it fails complexity rules (NFR-1), then the system displays a specific error message and prevents account creation. |
| US-2 | As a student, I want my login session to persist for 24 hours, so that I do not have to re-authenticate every time I open the application. | AC 1: Given a successful login, when a JSON Web Token (JWT) is issued, then the token remains valid for 24 hours allowing access to protected routes without a password prompt.                                                                                                                                                                  |

### 2.2 Account Protection and Recovery

This subsection defines the safety mechanisms used to prevent unauthorized access and allow users to regain control of their accounts.

| ID   | User Story                                                                                                                                             | Acceptance Criteria                                                                                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-3 | As a student, I want to reset my password using a 6-digit OTP sent to my email, so that I can recover my account if I forget my credentials.           | AC 1: Given a registered email, when "Forgot Password" is submitted, then a 6-digit numeric code is sent via SMTP.<br>AC 2: Given an OTP, when the code is more than 1 hour old, then the system rejects the reset attempt as expired. |
| US-4 | As a user, I want the system to temporarily block login attempts after multiple failures, so that my account is protected against brute-force attacks. | AC 1: Given five consecutive failed login attempts, when a sixth attempt is made within 5 minutes, then the system returns a "Locked" status and prevents further tries (NFR-2).                                                       |

## 3. Academic Performance Tracking

### 3.1 Module and Assessment Management

This subsection covers the fundamental ability for a student to organize their academic portfolio and record results for specific coursework and exams.

| ID   | User Story                                                                                                                                                                  | Acceptance Criteria                                                                                                                                                                                                                                                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-5 | As a student, I want to create and delete academic modules, so that I can organize my dashboard according to my current semester's curriculum.                              | AC 1: Given the module form, when a name, code, and UK credit value (15, 30, etc.) are provided, then the module is saved and appears in the portfolio list.<br>AC 2: Given an existing module, when the delete action is triggered, then all associated assessments and notes for that module are also permanently removed (cascading delete). |
| US-6 | As a student, I want to log assessment scores with specific percentage weights, so that the system can calculate how much each piece of work contributes to my final grade. | AC 1: Given a module, when an assessment is added with a score and weight (e.g., 40%), then the system calculates the weighted contribution correctly: (Score/Max) × Weight.<br>AC 2: Given multiple assessments, when the module is viewed, then the total "Current Percentage" is updated in real-time.                                       |

### 3.2 Performance Analytics and Goal Setting

This subsection defines the logic used to translate raw percentages into meaningful academic classifications and targets.

| ID   | User Story                                                                                                                                                                        | Acceptance Criteria                                                                                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| US-7 | As a student, I want the system to automatically assign a UK degree classification to my grades, so that I understand my current standing (e.g., 1st, 2:1).                       | AC 1: Given a calculated weighted average, when it is ≥ 70%, then the UI displays "First Class (1st)".<br>AC 2: When the average is between 60–69%, then the UI displays "Upper Second Class (2:1)" (SR-3.4).                  |
| US-8 | As a high-achiever, I want to use a "Distinction Calculator" to see what average is required in remaining modules, so that I can set realistic study goals to hit an overall 70%. | AC 1: Given the current year average and total target modules, when the "Modules" page is viewed, then the system calculates and displays the specific percentage needed in all future work to achieve a Distinction (SR-3.4). |

## 4. Financial Management

### 4.1 Transaction Lifecycle Management

This subsection focuses on the student's ability to maintain an accurate ledger of their financial activity, covering both income and expenditure.

| ID    | User Story                                                                                                                   | Acceptance Criteria                                                                                                                                                                                                                                                                                                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-9  | As a student, I want to log my income and expenses by category, so that I can keep an organized record of my financial flow. | AC 1: Given the transaction form, when a user enters an amount, description, date, and selects a category (e.g., "Scholarship" or "Groceries"), then the entry is saved to the ledger.<br>AC 2: Given an entry, when the amount is ≤ 0, then the system prevents submission and displays an "Amount must be positive" error (SR-2.1). |
| US-10 | As a user, I want to delete incorrect transactions, so that my monthly balance and summaries remain accurate.                | AC 1: Given an existing transaction in the list, when the delete action is confirmed, then the entry is removed from the storage and all totals update immediately (SR-2.5).                                                                                                                                                          |

### 4.2 Budgetary Control and Alerting

This subsection defines the "Spend vs. Limits" logic that helps students prevent overspending through visual cues.

| ID    | User Story                                                                                                                                      | Acceptance Criteria                                                                                                                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-11 | As a student on a tight budget, I want to set monthly spending limits for specific categories, so that I can control my discretionary spending. | AC 1: Given the "Set Budget Limit" form, when a user assigns a limit to an expense category (e.g., £150 for "Entertainment"), then the system stores this limit for the current month and year (SR-2.7).                |
| US-12 | As a user, I want the system to provide visual warnings based on my spending progress, so that I am alerted before I run out of money.          | AC 1: Given a category limit, when spending reaches 80% of the limit, then the status badge changes to "Warning".<br>AC 2: When spending reaches or exceeds 100%, then the status badge changes to "Exceeded" (SR-2.7). |

## 4.3 Data Visualisation and Summaries

This subsection details the analytical components that provide a high-level overview of financial health.

| ID    | User Story                                                                                                                                            | Acceptance Criteria                                                                                                                                                                                                                                             |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-13 | As a visual learner, I want to see a pie chart of my expense distribution, so that I can quickly identify which categories take up most of my budget. | AC 1: Given recorded expenses, when the Budget page is loaded, then the PieChart component renders a breakdown of category totals.<br>AC 2: When the user hovers over a chart segment, then a tooltip displays the exact GBP amount for that category (SR-2.8). |
| US-14 | As a user, I want a real-time summary of my "Remaining Balance," so that I know exactly how much money I have left for the month.                     | AC 1: Given current income and expenses, when a new transaction is added, then the "Remaining Balance" is recalculated as (Total Income − Total Expenses) and displayed at the top of the dashboard (SR-2.3, SR-2.4).                                           |

## 5. Productivity and Time Management

### 5.1 Timetable and Schedule Planning

This subsection focuses on the user's ability to map out their academic week, ensuring they can visualize class locations and times to prevent scheduling conflicts.

| ID    | User Story                                                                                                                                                      | Acceptance Criteria                                                                                                                                                                                                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-15 | As a student, I want to add lectures and labs to a weekly timetable grid, so that I can see my full academic schedule at a glance.                              | AC 1: Given the timetable form, when a user provides a module name, time, and day, then the entry is rendered on the calendar grid at the correct position (SR-4.1).<br>AC 2: Given an entry, when the user clicks on it, then the system displays a modal with full details including location and entry type. |
| US-16 | As a user, I want timetable entries to be color-coded by type (e.g., Lecture vs. Lab), so that I can instantly distinguish between different types of sessions. | AC 1: Given a "Lecture" entry, when it appears on the grid, then it is assigned the Amber color defined in the system legend (SR-4.1).                                                                                                                                                                          |

### 5.2 Task and Deadline Management

This subsection defines how students manage individual deliverables and their current progress through a visual workflow.

| ID    | User Story                                                                                                                                               | Acceptance Criteria                                                                                                                                                                                                                        |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| US-17 | As a student, I want to add deadlines with specific priority levels, so that I can focus my energy on high-priority tasks first.                         | AC 1: Given a new deadline entry, when the priority is set to "High," then it appears with a red visual indicator on the dashboard (SR-4.1).                                                                                               |
| US-18 | As a user, I want to manage my tasks using a Kanban board with "To-Do," "In Progress," and "Done" columns, so that I can track my productivity pipeline. | AC 1: Given a task on the board, when a user clicks "Start," then the task moves from the "To-Do" column to the "In Progress" column (SR-4.4).<br>AC 2: When moved to "Done," the task is marked as completed in the global deadline list. |
| US-19 | As a student, I want an integrated notebook area for each task that saves automatically, so that I can brainstorm without worrying about losing my data. | AC 1: Given the task editor is active, when a user stops typing, the system triggers a background save to ensure persistence (SR-4.5).                                                                                                     |

### 5.3 Workload and Experience Customisation

This subsection covers the system's ability to provide high-level health metrics and cater to different visual preferences.

| ID    | User Story                                                                                                                                                            | Acceptance Criteria                                                                                                                                                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-20 | As a student with many commitments, I want the system to calculate a "Workload Stress" indicator, so that I am warned when my schedule becomes unmanageable.          | AC 1: Given the total number of active/overdue deadlines, when the dashboard is loaded, then the system calculates a stress percentage and displays a descriptive label (e.g., "Critical" if multiple items are overdue) (SR-4.3). |
| US-21 | As a user who works in various environments, I want to switch between Light, Dark, and Classic themes, so that the interface remains comfortable to use at all times. | AC 1: Given the theme dropdown in the Topbar, when a new theme is selected, then the CSS variables update immediately and the preference is saved to local storage (SR-4.6, NFR-9).                                                |
