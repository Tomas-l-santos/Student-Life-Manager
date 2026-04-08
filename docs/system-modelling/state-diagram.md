# State Diagrams

## Overview
This section presents the state diagrams for the Student Life Management System. State diagrams were used to model the dynamic behaviour of the system by showing how key features change between different states based on user actions, validation checks, and system rules.

These diagrams were selected to support features with clear event-driven behaviour, such as user authentication, password recovery, financial budget alerts, academic tracking, and task progression. They also help connect the requirements to expected system behaviour before implementation.

## State Diagram 1: User Authentication and Password Recovery

```mermaid
stateDiagram-v2
    [*] --> LoggedOut

    LoggedOut --> Registering : create account
    Registering --> AccountCreated : valid email/username/password
    Registering --> Registering : invalid input
    AccountCreated --> LoggedOut : registration complete

    LoggedOut --> LoggingIn : enter credentials
    LoggingIn --> Authenticated : valid credentials
    LoggingIn --> LoginFailed : invalid credentials
    LoginFailed --> LoggingIn : try again
    LoginFailed --> LockedOut : 5 failed attempts

    LockedOut --> LoggedOut : 5 minutes elapsed

    LoggedOut --> PasswordRecoveryRequested : forgot password
    PasswordRecoveryRequested --> OTPSent : send 6-digit OTP
    OTPSent --> OTPVerification : user enters OTP
    OTPVerification --> PasswordResetAllowed : valid OTP
    OTPVerification --> OTPSent : invalid OTP / resend
    PasswordResetAllowed --> LoggedOut : password changed

    Authenticated --> PasswordChange : change password
    PasswordChange --> Authenticated : password updated

    Authenticated --> DeleteAccountRequested : delete account
    DeleteAccountRequested --> AccountDeleted : confirm deletion
    AccountDeleted --> [*]
```
### State Diagram 1 

This diagram models the lifecycle of a user account from registration to authentication and recovery. It reflects the requirements for account creation, login validation, password strength enforcement, OTP-based password recovery, temporary lockout after repeated failed login attempts, and permanent account deletion. This was important to model because the authentication feature contains multiple security-related transitions and error states.

## State Diagram 2: Finance Tracking and Budget Alerts

```mermaid
stateDiagram-v2
    [*] --> NoRecords

    NoRecords --> RecordingIncome : add income
    NoRecords --> RecordingExpense : add expense

    RecordingIncome --> RecordsStored : valid income saved
    RecordingExpense --> RecordsStored : valid expense saved
    RecordingIncome --> NoRecords : cancelled
    RecordingExpense --> NoRecords : cancelled

    RecordsStored --> SummaryUpdated : recalculate monthly totals
    SummaryUpdated --> WithinBudget : expense < 80% of limit
    SummaryUpdated --> Warning80 : expense >= 80% of limit
    SummaryUpdated --> LimitExceeded : expense >= 100% of limit

    WithinBudget --> RecordingExpense : add more expense
    Warning80 --> RecordingExpense : add more expense
    LimitExceeded --> RecordingExpense : add more expense

    RecordsStored --> EditingRecord : edit entry
    RecordsStored --> DeletingRecord : delete entry
    EditingRecord --> SummaryUpdated : save changes
    DeletingRecord --> SummaryUpdated : record removed
```
    
### State Diagram 2

This diagram shows how the finance system changes state when a user records, edits, or deletes income and expense entries. It also includes budget monitoring behaviour by showing transitions between normal spending, warning level, and limit exceeded states. This supports the budgeting and alert logic required by the finance manager.

## State Diagram 3: Module and Grade Tracking

```mermaid
stateDiagram-v2
    [*] --> NoModules

    NoModules --> ModuleCreated : add module
    ModuleCreated --> AssessmentPending : no assessments yet

    AssessmentPending --> AssessmentAdded : add assessment score
    AssessmentAdded --> WeightAssigned : assign weighting
    WeightAssigned --> AverageCalculated : calculate module average
    AverageCalculated --> TargetCheckCalculated : calculate score needed for 70%

    AssessmentAdded --> AssessmentAdded : add more assessments
    WeightAssigned --> WeightAssigned : edit weightings
    AverageCalculated --> AssessmentAdded : add new result
    AverageCalculated --> ModuleEdited : edit module
    ModuleEdited --> AverageCalculated : save changes

    ModuleCreated --> ModuleDeleted : delete module
    ModuleDeleted --> NoModules
```

### State Diagram 3

This diagram models the states involved in academic module tracking. It begins with module creation and progresses through assessment entry, weighting configuration, average grade calculation, and distinction target analysis. It helps represent how the academic performance feature supports both record keeping and goal setting.

## State Diagram 4: Task and Deadline Management

```mermaid
stateDiagram-v2
    [*] --> NoTasks

    NoTasks --> TaskCreated : add task/deadline
    TaskCreated --> Planned : task saved
    Planned --> InProgress : start task
    InProgress --> Completed : mark complete
    Planned --> Completed : complete directly

    Planned --> ReminderDueSoon : deadline approaching
    InProgress --> ReminderDueSoon : deadline approaching
    ReminderDueSoon --> Overdue : due date passed
    ReminderDueSoon --> InProgress : continue working
    Overdue --> InProgress : resume task
    Overdue --> Completed : mark complete

    Planned --> NotesUpdated : add notebook details
    InProgress --> NotesUpdated : update notebook
    NotesUpdated --> Planned
    NotesUpdated --> InProgress

    Planned --> KanbanMoved : move board column
    InProgress --> KanbanMoved : move board column
    KanbanMoved --> Planned
    KanbanMoved --> InProgress
    KanbanMoved --> Completed
```

### State Diagram 4

This diagram shows the task lifecycle within the productivity area of the system. It includes task creation, Kanban progression, note-taking, reminders, and overdue status transitions. This is useful because the task system is heavily based on workflow state changes and deadline monitoring.