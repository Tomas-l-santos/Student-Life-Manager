# Sequence Diagrams

## Overview
This file presents two sequence diagrams for the Student Life Management System. These diagrams were selected to represent important behavioural workflows within the system. They show how the student, interface, internal services, and storage components interact over time to complete key tasks.

The two modelled scenarios are:
1. User login and email-based password reset
2. Expense entry and budget summary update

These were chosen because they are strongly linked to the system requirements and demonstrate both core functionality and supporting processes such as validation, storage, calculations, alerts, and user feedback.

## 1. User Login and Email-Based Password Reset

This sequence diagram models the interaction that occurs when a student logs into the system and when a password reset is requested. The password reset process uses a 6-digit code sent to the user’s registered email address, which must then be entered before a new password can be created.

## 1. User Login and Email-Based Password Reset

```mermaid
sequenceDiagram
    actor Student
    participant UI as Web Interface
    participant Auth as Authentication Service
    participant Validator as Validation Service
    participant Store as Local Storage
    participant Email as Email Service
    participant Log as Event Logger

    Student->>UI: Enter email/username and password
    UI->>Validator: Validate input format
    Validator-->>UI: Input valid
    UI->>Auth: Submit login request
    Auth->>Store: Retrieve stored user credentials
    Store-->>Auth: Return account record
    Auth->>Auth: Compare entered password with stored password

    alt Login successful
        Auth->>Log: Record successful login event
        Log-->>Auth: Event stored
        Auth-->>UI: Login successful
        UI-->>Student: Redirect to dashboard
    else Login failed
        Auth->>Log: Record failed login attempt
        Log-->>Auth: Event stored
        Auth-->>UI: Invalid login details
        UI-->>Student: Display error message

        alt 5 failed attempts reached
            Auth-->>UI: Lock login for 5 minutes
            UI-->>Student: Show temporary lock message
        end
    end

    opt Forgot password selected
        Student->>UI: Select "Forgot Password"
        UI->>Auth: Submit password reset request
        Auth->>Store: Check registered email
        Store-->>Auth: Email exists
        Auth->>Auth: Generate 6-digit reset code
        Auth->>Email: Send reset code to user email
        Email-->>Student: Reset code received by email

        Student->>UI: Enter reset code and new password
        UI->>Validator: Validate reset code and password format
        Validator-->>UI: Code and password format valid
        UI->>Auth: Submit code and new password
        Auth->>Auth: Verify reset code

        alt Code correct
            Auth->>Store: Update stored password
            Store-->>Auth: Password updated
            Auth->>Log: Record password reset event
            Log-->>Auth: Event stored
            Auth-->>UI: Password reset successful
            UI-->>Student: Prompt user to log in
        else Code incorrect
            Auth-->>UI: Invalid or expired reset code
            UI-->>Student: Show reset error message
        end
    end
```

## 2. Expense Entry and Budget Summary 

This sequence diagram models the process of entering a new expense into the finance management section of the system. It shows how the system validates the entry, saves it in local storage, recalculates totals, checks budget thresholds, and updates the visual summary for the student.

## 2. Mermiad Diagram Two 

```mermaid
sequenceDiagram
    actor Student
    participant UI as Web Interface
    participant Validator as Validation Service
    participant Budget as Budget Manager
    participant Store as Local Storage
    participant Alert as Warning Service
    participant Analytics as Chart Engine

    Student->>UI: Enter expense details (amount, date, category)
    UI->>Validator: Validate required fields and values
    Validator-->>UI: Input valid
    UI->>Budget: Submit new expense
    Budget->>Store: Save expense record
    Store-->>Budget: Expense stored

    Budget->>Store: Retrieve income and expense records
    Store-->>Budget: Return current financial data

    Budget->>Budget: Calculate total monthly expenses
    Budget->>Budget: Calculate category expense total
    Budget->>Budget: Compare category total to budget limit

    alt Category reaches 80% of budget
        Budget->>Alert: Generate warning message
        Alert-->>UI: Display 80% alert
    else Category reaches 100% of budget
        Budget->>Alert: Generate exceeded warning
        Alert-->>UI: Display exceeded alert
    else Category below threshold
        Budget-->>UI: No warning required
    end

    Budget->>Analytics: Update expense distribution and cash flow data
    Analytics-->>UI: Return updated chart values
    UI-->>Student: Show updated totals, alerts, and pie chart
```