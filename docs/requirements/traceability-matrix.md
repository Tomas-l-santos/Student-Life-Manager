# Traceability Matrix

This section establishes a direct connection between the initial requirements and the implemented code. To illustrate system coherence, the matrix is organized by functional area, mapping each requirement to its corresponding backend logic, frontend components.

## Authentication & Account Management (UR-1)

| Req ID | Requirement Summary     | Backend Implementation           | Frontend Component                     |
| ------ | ----------------------- | -------------------------------- | -------------------------------------- |
| SR-1.1 | Account Data Collection | models/user.py (User Class)      | SignupModal (Signup.tsx)               |
| SR-1.2 | Password Validation     | AuthService.validate_password    | checkPasswordStrength                  |
| SR-1.3 | Authenticated Login     | POST /api/auth/login             | LoginModal (Signup.tsx)                |
| SR-1.4 | Password Reset          | AuthService.change_password      | ForgotPassword.tsx                     |
| SR-1.5 | 6-Digit OTP Recovery    | AuthService.generate_reset_token | ForgotPassword.tsx                     |
| NFR-1  | Password Complexity     | AuthService.validate_password    | SignupModal Error States               |
| NFR-2  | 5-Attempt Lockout       | authorisation.py                 | isLocked state (account&security.html) |
| NFR-3  | Data Deletion           | AuthService.delete_account       | Account.tsx (handleDeleteAccount)      |

## Financial Behavior & Tracking (UR-2)

| Req ID | Requirement Summary     | Backend Implementation                | Frontend Component                |
| ------ | ----------------------- | ------------------------------------- | --------------------------------- |
| SR-2.1 | Income Logging          | BudgetService.add_transaction         | Budget.tsx (Transaction Form)     |
| SR-2.2 | Expense Categorization  | models/Budget/category.py             | Budget.tsx (Expense Logic)        |
| SR-2.3 | Monthly Summaries       | BudgetService.get_transaction_summary | summary state in Budget.tsx       |
| SR-2.4 | Expense Calculation     | BudgetService.get_budget_status       | summary.expenses in Budget.tsx    |
| SR-2.6 | Persistent Storage      | storagerepo.py (JSONStorage)          | localStorage in storage.ts        |
| SR-2.7 | Threshold Warnings      | BudgetService.get_budget_status       | Budget.tsx (Conditional Alerts)   |
| SR-2.8 | Pie Chart Visualization | BudgetService.get_transaction_summary | Recharts (PieChart) in Budget.tsx |

## Academic Performance Management (UR-3)

| Req ID | Requirement Summary        | Backend Implementation                   | Frontend Component          |
| ------ | -------------------------- | ---------------------------------------- | --------------------------- |
| SR-3.1 | Module Creation            | models/Academics/modules.py              | Modules.tsx (Add Module UI) |
| SR-3.2 | Assessment Recording       | models/Academics/assessments.py          | Modules.tsx (Grade Modal)   |
| SR-3.3 | Weighted Grade Calculation | analytics.py (calculate_module_grade)    | getModuleAverage function   |
| SR-3.4 | Trajectory (70% Target)    | AcademicAnalytics.calculate_module_grade | Modules.tsx (stats object)  |

## Productivity & Tasks (UR-4)

| Req ID | Requirement Summary       | Backend Implementation             | Frontend Component             |
| ------ | ------------------------- | ---------------------------------- | ------------------------------ |
| SR-4.1 | Deadline Tracking         | services/deadline_service.py       | Deadlines.tsx (Table View)     |
| SR-4.3 | Workload Stress Indicator | DeadlineService.get_user_deadlines | deadlines.tsx (stats state)    |
| SR-4.4 | Kanban Lifecycle          | PUT /api/deadlines/<id>            | Tasks.tsx (renderKanbanColumn) |
| SR-4.5 | Integrated Notebook       | Deadline Model (notes field)       | Tasks.tsx (Auto-save Editor)   |
| NFR-9  | Multi-Theme Support       | Stateless API (No implementation)  | Topbar (dashboard.tsx)         |
