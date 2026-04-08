# Class Diagram

## Purpose
This class diagram presents the main structural components of the Student Life Management system. It shows how academic management, finance tracking, and productivity features are organised into related classes. The class diagram was designed from the system requirements so that the application is clear before implementation.

## Why this model was chosen
A class diagram was selected because the project contains several connected data entities, including users, modules, assessments, deadlines, tasks, timetable entries, and finance records. Modelling these relationships helps ensure that the design remains consistent with the requirements and supports maintainable implementation.

## Mermaid Diagram 

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String username
        +String passwordHash
        +String themePreference
        +createAccount()
        +login()
        +changePassword()
        +deleteAccount()
    }

    class Module {
        +String moduleId
        +String moduleName
        +int credits
        +calculateAverage()
        +calculateRequiredScoreFor70()
    }

    class Assessment {
        +String assessmentId
        +String title
        +float score
        +float weight
        +addScore()
        +updateScore()
    }

    class Deadline {
        +String deadlineId
        +String title
        +Date dueDate
        +String priority
        +String status
        +createReminder()
    }

    class Task {
        +String taskId
        +String title
        +String status
        +Date dueDate
        +String priority
        +moveTask()
        +updateTask()
    }

    class NotebookEntry {
        +String noteId
        +String content
        +Date createdAt
        +Date updatedAt
        +saveNote()
        +editNote()
    }

    class TimetableEntry {
        +String entryId
        +String day
        +String time
        +String location
        +String sideNote
        +addEntry()
        +editEntry()
    }

    class IncomeEntry {
        +String incomeId
        +float amount
        +Date date
        +String source
        +addIncome()
        +editIncome()
        +deleteIncome()
    }

    class ExpenseEntry {
        +String expenseId
        +float amount
        +Date date
        +String category
        +addExpense()
        +editExpense()
        +deleteExpense()
    }

    class BudgetCategory {
        +String categoryId
        +String name
        +float monthlyLimit
        +checkLimit()
        +getWarningLevel()
    }

    class Reminder {
        +String reminderId
        +String message
        +Date triggerDate
        +String type
        +sendReminder()
    }

    User "1" --> "0..*" Module : manages
    Module "1" --> "0..*" Assessment : contains
    Module "1" --> "0..*" Deadline : has
    Module "1" --> "0..*" TimetableEntry : scheduled in
    User "1" --> "0..*" Task : creates
    Task "1" --> "0..*" NotebookEntry : includes
    User "1" --> "0..*" IncomeEntry : records
    User "1" --> "0..*" ExpenseEntry : records
    BudgetCategory "1" --> "0..*" ExpenseEntry : groups
    Deadline "1" --> "0..*" Reminder : triggers
    Task "1" --> "0..*" Reminder : triggers
```