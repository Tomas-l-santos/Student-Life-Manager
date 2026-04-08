# Use Cases - Student Life Management System

**Project:** Student Budget & Academics Management System  
**Version:** 1.0  
**Last Updated:** April 8th, 2026  
**Document Type:** Functional Requirements & Use Cases

---

## Table of Contents

1. [User Personas](#user-personas)
2. [Authentication Use Cases](#authentication-use-cases)
3. [Budget Management Use Cases](#budget-management-use-cases)
4. [Academic Management Use Cases](#academic-management-use-cases)
5. [Notes Management Use Cases](#notes-management-use-cases)
6. [Integration Use Cases](#integration-use-cases)
7. [Edge Cases & Error Scenarios](#edge-cases--error-scenarios)

---

## User Personas

### Persona 1: Sarah - First Year Undergraduate
**Age:** 19  
**Background:** First-time living away from home, struggling with budget management  
**Goals:**
- Track spending to avoid overdrafts
- Understand where money goes each month
- Keep track of first-year module grades
- Organize lecture notes by topic

**Pain Points:**
- Never budgeted before
- Worried about failing first year
- Notes scattered across notebooks and apps
- Doesn't know how UK grading works

**Technical Skill:** Medium (uses apps daily but not tech-savvy)

---

### Persona 2: James - Third Year Computer Science Student
**Age:** 21  
**Background:** Experienced student, needs to maintain 2:1 for grad school  
**Goals:**
- Monitor degree classification trajectory
- Calculate what grades needed on upcoming assessments
- Track spending on course materials
- Keep detailed project notes organized

**Pain Points:**
- Many modules with different weightings
- Needs to predict final grade
- Running multiple projects simultaneously
- Budget tight due to placement year prep

**Technical Skill:** High (developer, power user)

---

### Persona 3: Aisha - International Student (Masters)
**Age:** 24  
**Background:** New to UK, converting from different grading system  
**Goals:**
- Understand UK grading system
- Track living expenses in new currency
- Organize research notes by topic
- Monitor budget carefully (fixed funds)

**Pain Points:**
- Confused by UK percentage vs grade classifications
- Everything more expensive than expected
- Needs structured note system for thesis
- Can't overspend (no local bank account yet)

**Technical Skill:** Medium-High (experienced with digital tools)

---

## Authentication Use Cases

### UC-AUTH-01: User Registration

**Actor:** New User (Sarah)  
**Preconditions:** None  
**Trigger:** User wants to create an account

**Main Flow:**
1. User navigates to registration page
2. System displays registration form
3. User enters email, username, password, and birthdate
4. User submits form
5. System validates email format (regex check)
6. System validates username (3-20 alphanumeric characters)
7. System validates password:
    - Minimum 8 characters
    - Contains uppercase letter
    - Contains lowercase letter
    - Contains digit
    - Contains special character
8. System checks email doesn't already exist
9. System hashes password using bcrypt
10. System generates unique user_id (UUID)
11. System saves user to database
12. System generates JWT token (24-hour expiry)
13. System returns success with token and user info

**Postconditions:**
- User account created
- User logged in with valid token
- User can access protected endpoints

**Alternative Flows:**

**A1: Email Already Exists**
- At step 8, system finds existing email
- System returns error: "Email already exists"
- User tries different email or goes to login

**A2: Weak Password**
- At step 7, password fails validation
- System returns specific error (e.g., "Must contain uppercase")
- User corrects password and resubmits

**A3: Invalid Email Format**
- At step 5, email fails regex validation
- System returns error: "Invalid email format"
- User corrects email and resubmits

**Example Request:**
```json
POST /api/auth/register
{
  "email": "sarah.jones@student.ac.uk",
  "username": "sarahj",
  "password": "SecurePass123!",
  "birthdate": "2005-06-15"
}
```

**Example Response:**
```json
{
  "message": "User registered successfully",
  "user": {
     "email": "sarah.jones@student.ac.uk",
     "username": "sarahj",
     "birthdate": "2005-06-15"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Business Rules:**
- BR-AUTH-01: Email must be unique
- BR-AUTH-02: Username must be 3-20 characters
- BR-AUTH-03: Password must meet complexity requirements
- BR-AUTH-04: User must provide birthdate (for age verification)

---

### UC-AUTH-02: User Login

**Actor:** Existing User (Sarah)  
**Preconditions:** User has registered account  
**Trigger:** User wants to access their account

**Main Flow:**
1. User navigates to login page
2. System displays login form
3. User enters email and password
4. User submits form
5. System checks for rate limiting (max 5 attempts)
6. System retrieves user by email
7. System compares password hash using bcrypt
8. Passwords match
9. System clears any failed attempt counters
10. System generates new JWT token (24-hour expiry)
11. System returns success with token and user info

**Postconditions:**
- User logged in
- Valid JWT token issued
- Failed attempt counter reset

**Alternative Flows:**

**A1: Invalid Credentials**
- At step 8, passwords don't match
- System increments failed attempt counter
- System returns error: "Invalid email or password"
- User can retry (up to 5 times)

**A2: Account Locked**
- At step 5, user has 5 failed attempts within 5 minutes
- System returns error: "Account locked. Try again later"
- User must wait 5 minutes before retrying

**A3: User Not Found**
- At step 6, email doesn't exist
- System returns same error as invalid password (security)
- User can try different email or register

**Example Request:**
```json
POST /api/auth/login
{
  "email": "sarah.jones@student.ac.uk",
  "password": "SecurePass123!"
}
```

**Example Response:**
```json
{
  "message": "Login successful",
  "user": {
     "email": "sarah.jones@student.ac.uk",
     "username": "sarahj"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Business Rules:**
- BR-AUTH-05: Max 5 failed login attempts
- BR-AUTH-06: Account locked for 5 minutes after 5 failures
- BR-AUTH-07: Same error message for invalid email or password (security)
- BR-AUTH-08: JWT token expires after 24 hours

---

### UC-AUTH-03: Password Reset Request

**Actor:** User (Sarah - forgot password)  
**Preconditions:** User has registered account with valid email  
**Trigger:** User forgot password and can't login

**Main Flow:**
1. User clicks "Forgot Password" on login page
2. System displays email input form
3. User enters registered email
4. User submits form
5. System validates email format
6. System checks if user exists (silently)
7. System generates 6-digit OTP code
8. System stores OTP with 1-hour expiration
9. System sends email with OTP code
10. System returns generic success message (security)
11. User receives email with OTP
12. User proceeds to password reset with OTP

**Postconditions:**
- OTP generated and stored
- Email sent to user
- OTP expires in 1 hour

**Alternative Flows:**

**A1: Email Not Found**
- At step 6, email doesn't exist in system
- System still returns success message (prevents email enumeration)
- No email sent
- User doesn't know if email exists (security feature)

**A2: Email Send Failure**
- At step 9, SMTP error occurs
- System logs error internally
- System returns error: "Could not send email"
- User can retry

**A3: Recent OTP Exists**
- At step 7, user already has valid OTP
- System invalidates old OTP
- System generates new OTP
- System sends new email

**Example Request:**
```json
POST /api/auth/forgot-password
{
  "email": "sarah.jones@student.ac.uk"
}
```

**Example Response:**
```json
{
  "message": "If the email exists, a token has been sent."
}
```

**Example Email:**
```
Subject: Your SLM Password Reset Code

Your password reset token is: 847293

This code is valid for 1 hour.

If you didn't request this, please ignore this email.
```

**Business Rules:**
- BR-AUTH-09: OTP is 6 digits (numeric only)
- BR-AUTH-10: OTP expires after 1 hour
- BR-AUTH-11: Only one valid OTP per user at a time
- BR-AUTH-12: Generic message prevents email enumeration
- BR-AUTH-13: Email sent from studentlife.app.noreply@gmail.com

---

### UC-AUTH-04: Password Reset Completion

**Actor:** User (Sarah - with OTP code)  
**Preconditions:** User has received OTP via email  
**Trigger:** User wants to set new password

**Main Flow:**
1. User navigates to password reset page
2. System displays OTP and new password form
3. User enters 6-digit OTP from email
4. User enters new password (twice for confirmation)
5. User submits form
6. System validates OTP exists
7. System checks OTP hasn't expired (< 1 hour old)
8. System validates new password complexity
9. System hashes new password using bcrypt
10. System updates user's password
11. System deletes used OTP
12. System clears failed login attempts for user
13. System returns success message

**Postconditions:**
- Password updated
- OTP invalidated
- Failed attempts cleared
- User can login with new password

**Alternative Flows:**

**A1: Invalid OTP**
- At step 6, OTP not found in system
- System returns error: "Invalid or expired OTP"
- User can request new OTP

**A2: Expired OTP**
- At step 7, OTP is older than 1 hour
- System deletes expired OTP
- System returns error: "OTP has expired"
- User must request new OTP

**A3: Weak New Password**
- At step 8, password fails complexity check
- System returns specific error
- User corrects password

**Example Request:**
```json
POST /api/auth/reset-password
{
  "token": "847293",
  "new_password": "NewSecurePass456!"
}
```

**Example Response:**
```json
{
  "message": "Password reset successfully"
}
```

**Business Rules:**
- BR-AUTH-14: OTP can only be used once
- BR-AUTH-15: New password must meet same complexity as registration
- BR-AUTH-16: Old OTP deleted after successful reset
- BR-AUTH-17: User can login immediately after reset

---

## Budget Management Use Cases

### UC-BUDGET-01: View All Categories

**Actor:** User (Sarah)  
**Preconditions:** User is logged in  
**Trigger:** User wants to see available spending categories

**Main Flow:**
1. User navigates to budget section
2. System retrieves all categories from database
3. System returns 16 pre-loaded categories:
    - **Expense (11):** Food, Transport, Accommodation, Entertainment, Course Materials, Personal Care, Utilities, Healthcare, Clothing, Subscriptions, Other Expenses
    - **Income (5):** Part-time Job, Student Loan, Parents/Family, Scholarship, Other Income
4. Each category includes icon emoji
5. System displays categories grouped by type

**Postconditions:**
- User sees all available categories
- Categories grouped by income/expense

**Example Request:**
```json
GET /api/categories
```

**Example Response:**
```json
[
  {
     "id": 1,
     "name": "Food",
     "type": "expense",
     "icon": "Food"
  },
  {
     "id": 12,
     "name": "Part-time Job",
     "type": "income",
     "icon": "Work"
  }
]
```

**Business Rules:**
- BR-BUDGET-01: Categories are pre-loaded (users can create custom ones with "other" options)
- BR-BUDGET-02: Each category has unique ID
- BR-BUDGET-03: Category type is either "income" or "expense"

---

### UC-BUDGET-02: Add Transaction

**Actor:** User (Sarah - just bought lunch)  
**Preconditions:** User is logged in  
**Trigger:** User spent money and wants to record it

**Main Flow:**
1. User clicks "Add Transaction"
2. System displays transaction form
3. User selects category (Food)
4. User enters amount (£12.50)
5. User enters description ("Lunch at campus cafe")
6. User selects date (today's date pre-filled)
7. User optionally marks as recurring
8. User submits form
9. System validates amount is non-zero number
10. System validates date format (YYYY-MM-DD)
11. System validates description length (< 255 chars)
12. System generates unique transaction ID (UUID)
13. System saves transaction with user_email
14. System returns created transaction

**Postconditions:**
- Transaction saved
- Transaction appears in user's transaction list
- Budget status updated if budget exists for category

**Alternative Flows:**

**A1: Zero Amount**
- At step 9, amount is 0
- System returns error: "Amount cannot be zero"
- User enters valid amount

**A2: Invalid Date**
- At step 10, date format incorrect
- System returns error: "Invalid date format. Use YYYY-MM-DD"
- User corrects date

**A3: Future Date Transaction**
- User enters future date for transaction
- System accepts (allows planned expenses)
- Transaction saved with future date

**Example Request:**
```json
POST /api/transactions
{
  "user_email": "sarah.jones@student.ac.uk",
  "category_id": 1,
  "amount": 12.50,
  "description": "Lunch at campus cafe",
  "transaction_date": "2026-03-11",
  "is_recurring": false
}
```

**Example Response:**
```json
{
  "id": "a8f3e2d1-4c5b-6789-0abc-def123456789",
  "user_email": "sarah.jones@student.ac.uk",
  "category_id": 1,
  "amount": 12.50,
  "description": "Lunch at campus cafe",
  "transaction_date": "2026-03-11",
  "is_recurring": false,
  "created_at": "2026-03-11T14:23:45.123Z"
}
```

**Business Rules:**
- BR-BUDGET-04: Amount must be non-zero (positive or negative)
- BR-BUDGET-05: Description optional, max 255 characters
- BR-BUDGET-06: Date must be valid YYYY-MM-DD format
- BR-BUDGET-07: Recurring flag for monthly repeated transactions

---

### UC-BUDGET-03: View Monthly Spending

**Actor:** User (Sarah - reviewing March spending)  
**Preconditions:** User has transactions recorded  
**Trigger:** User wants to see how much spent this month

**Main Flow:**
1. User navigates to transactions page
2. User selects month (March) and year (2026)
3. System retrieves all user's transactions for March 2026
4. System enriches each transaction with category info
5. System calculates summary:
    - Total income (all income category transactions)
    - Total expenses (all expense category transactions)
    - Net balance (income - expenses)
    - Breakdown by category
6. System displays transactions sorted by date (newest first)
7. System shows summary at top

**Postconditions:**
- User sees all March transactions
- User sees spending summary
- User understands financial position

**Example Request:**
```json
GET /api/transactions/sarah.jones@student.ac.uk?month=3&year=2026
```

**Example Response:**
```json
{
  "transactions": [
     {
        "id": "uuid-1",
        "category_name": "Food",
        "category_icon": "Food",
        "amount": 12.50,
        "description": "Lunch",
        "transaction_date": "2026-03-11"
     },
     {
        "id": "uuid-2",
        "category_name": "Transport",
        "category_icon": "Bus",
        "amount": 45.00,
        "description": "Monthly bus pass",
        "transaction_date": "2026-03-01"
     }
  ],
  "summary": {
     "total_income": 800.00,
     "total_expenses": 485.50,
     "balance": 314.50,
     "category_breakdown": {
        "Food": 125.50,
        "Transport": 85.00,
        "Accommodation": 275.00
     }
  }
}
```

**Business Rules:**
- BR-BUDGET-08: Transactions sorted by date (newest first)
- BR-BUDGET-09: Each transaction shows category details
- BR-BUDGET-10: Summary calculated in real-time
- BR-BUDGET-11: Income positive, expenses shown as negative

---

### UC-BUDGET-04: Set Monthly Budget

**Actor:** User (Sarah - setting food budget)  
**Preconditions:** User is logged in  
**Trigger:** User wants to limit spending on food

**Main Flow:**
1. User navigates to budgets page
2. User clicks "Set Budget"
3. System displays budget form
4. User selects category (Food)
5. User enters amount (£200)
6. User selects month (March) and year (2026)
7. User submits form
8. System validates category is expense type (not income)
9. System checks if budget already exists for this category/month
10. No existing budget found
11. System creates new budget
12. System returns created budget

**Postconditions:**
- Budget saved for Food in March 2026
- User will see warnings if spending exceeds £200
- Budget appears in budget list

**Alternative Flows:**

**A1: Budget Already Exists**
- At step 9, budget already exists for Food/March/2026
- System returns error: "Budget already exists for this category and month"
- User can edit existing budget or choose different month

**A2: Income Category Selected**
- At step 8, user selects income category
- System returns error: "Cannot set budget for income categories"
- User selects expense category

**Example Request:**
```json
POST /api/budgets
{
  "user_email": "sarah.jones@student.ac.uk",
  "category_id": 1,
  "amount": 200.00,
  "month": 3,
  "year": 2026
}
```

**Example Response:**
```json
{
  "id": 1,
  "user_email": "sarah.jones@student.ac.uk",
  "category_id": 1,
  "amount": 200.00,
  "month": 3,
  "year": 2026,
  "created_at": "2026-03-01T10:00:00.000Z"
}
```

**Business Rules:**
- BR-BUDGET-12: Only expense categories can have budgets
- BR-BUDGET-13: One budget per category per month per user
- BR-BUDGET-14: Amount must be positive
- BR-BUDGET-15: Month must be 1-12, year must be valid

---

### UC-BUDGET-05: Check Budget Status

**Actor:** User (Sarah - checking if over budget)  
**Preconditions:** User has budgets set and transactions recorded  
**Trigger:** User wants to see budget progress

**Main Flow:**
1. User navigates to budget status page
2. User selects month (March) and year (2026)
3. System retrieves all user's budgets for March 2026
4. For each budget:
    - System calculates total spent in that category
    - System calculates percentage used (spent/budget * 100)
    - System determines status:
      - "on_track" if < 80% used
      - "warning" if 80-100% used
      - "exceeded" if > 100% used
5. System displays each budget with status indicator
6. System shows progress bar for each

**Postconditions:**
- User sees all budgets for the month
- User knows which categories need attention
- User can adjust spending accordingly

**Example Request:**
```json
GET /api/budgets/status/sarah.jones@student.ac.uk?month=3&year=2026
```

**Example Response:**
```json
[
  {
     "category_name": "Food",
     "category_icon": "Food",
     "budget_amount": 200.00,
     "spent": 125.50,
     "remaining": 74.50,
     "percentage_used": 62.75,
     "status": "on_track"
  },
  {
     "category_name": "Entertainment",
     "category_icon": "Entertainment",
     "budget_amount": 50.00,
     "spent": 85.00,
     "remaining": -35.00,
     "percentage_used": 170.00,
     "status": "exceeded"
  }
]
```

**Business Rules:**
- BR-BUDGET-16: Status "on_track" if < 80% used
- BR-BUDGET-17: Status "warning" if 80-100% used
- BR-BUDGET-18: Status "exceeded" if > 100% used
- BR-BUDGET-19: Remaining can be negative (over budget)

---

## Academic Management Use Cases

### UC-ACADEMIC-01: Add Module

**Actor:** User (James - starting new semester)  
**Preconditions:** User is logged in  
**Trigger:** New semester started, user has new modules

**Main Flow:**
1. User navigates to modules page
2. User clicks "Add Module"
3. System displays module form
4. User enters module name ("Advanced Algorithms")
5. User enters module code ("COMP3001")
6. User selects credits (20)
7. User selects year of study (3)
8. User enters academic year ("2025/2026")
9. User selects status ("in_progress")
10. User submits form
11. System validates module name and code required
12. System validates credits are UK standard (10, 15, 20, 30, 40, 60)
13. System validates year of study (1-4)
14. System checks module code doesn't already exist for this academic year
15. System generates unique module ID
16. System saves module
17. System returns created module

**Postconditions:**
- Module saved
- Module appears in user's module list
- User can add assessments to module

**Alternative Flows:**

**A1: Invalid Credits**
- At step 12, credits not in UK standard list
- System returns error: "Credits must be one of: 10, 15, 20, 30, 40, 60"
- User selects valid credit value

**A2: Duplicate Module Code**
- At step 14, module code already exists for 2025/2026
- System returns error: "Module with this code already exists for this academic year"
- User checks existing modules or uses different code

**A3: Invalid Year of Study**
- At step 13, year is 5 or 0
- System returns error: "Year of study must be 1, 2, 3, or 4"
- User enters valid year

**Example Request:**
```json
POST /api/modules
{
  "user_email": "james.smith@student.ac.uk",
  "name": "Advanced Algorithms",
  "code": "COMP3001",
  "credits": 20,
  "year_of_study": 3,
  "academic_year": "2025/2026",
  "status": "in_progress"
}
```

**Example Response:**
```json
{
  "id": 1,
  "user_email": "james.smith@student.ac.uk",
  "name": "Advanced Algorithms",
  "code": "COMP3001",
  "credits": 20,
  "year_of_study": 3,
  "academic_year": "2025/2026",
  "status": "in_progress",
  "created_at": "2025-09-15T10:00:00.000Z"
}
```

**Business Rules:**
- BR-ACADEMIC-01: UK credits must be 10, 15, 20, 30, 40, or 60
- BR-ACADEMIC-02: Year of study must be 1, 2, 3, or 4
- BR-ACADEMIC-03: Module code unique per user per academic year
- BR-ACADEMIC-04: Status can be "in_progress", "completed", or "dropped"
- BR-ACADEMIC-05: Academic year format "YYYY/YYYY" (e.g., "2025/2026")

---

### UC-ACADEMIC-02: Add Assessment

**Actor:** User (James - got exam results)  
**Preconditions:** User has module created  
**Trigger:** User received assessment grade and wants to track it

**Main Flow:**
1. User navigates to module details page
2. User clicks "Add Assessment"
3. System displays assessment form pre-filled with module info
4. User enters assessment name ("Midterm Exam")
5. User selects type ("exam")
6. User enters score (68)
7. User enters max score (100)
8. User enters weight (40%) - represents 40% of final grade
9. User selects date (2026-03-05)
10. User submits form
11. System validates all required fields present
12. System validates score ≥ 0 and max_score > 0
13. System validates score ≤ max_score
14. System validates weight between 0-100
15. System validates date format (YYYY-MM-DD)
16. System validates assessment type in allowed list
17. System calculates percentage: (68/100) * 100 = 68%
18. System determines UK grade: 68% → "Upper Second Class (2:1)"
19. System saves assessment with calculated values
20. System returns created assessment

**Postconditions:**
- Assessment saved with UK grade
- Assessment appears in module's assessment list
- Module grade calculation updated

**Alternative Flows:**

**A1: Score Exceeds Max**
- At step 13, score is 105 and max is 100
- System returns error: "Score cannot exceed max score"
- User corrects score

**A2: Invalid Assessment Type**
- At step 16, type is "quiz" (not in allowed list)
- System returns error: "Invalid assessment type. Must be one of: exam, coursework, essay, project, presentation, lab, other"
- User selects valid type

**A3: Weight Over 100%**
- At step 14, weight is 120
- System returns error: "Weight must be between 0 and 100"
- User corrects weight

**Example Request:**
```json
POST /api/assessments
{
  "user_email": "james.smith@student.ac.uk",
  "module_id": 1,
  "name": "Midterm Exam",
  "assessment_type": "exam",
  "score": 68,
  "max_score": 100,
  "weight": 40,
  "date": "2026-03-05"
}
```

**Example Response:**
```json
{
  "id": 1,
  "user_email": "james.smith@student.ac.uk",
  "module_id": 1,
  "module_name": "Advanced Algorithms",
  "module_code": "COMP3001",
  "name": "Midterm Exam",
  "assessment_type": "exam",
  "score": 68,
  "max_score": 100,
  "weight": 40,
  "date": "2026-03-05",
  "percentage": 68.00,
  "uk_grade": "Upper Second Class (2:1)",
  "created_at": "2026-03-05T15:30:00.000Z"
}
```

**Business Rules:**
- BR-ACADEMIC-06: Assessment types: exam, coursework, essay, project, presentation, lab, other
- BR-ACADEMIC-07: Score must not exceed max_score
- BR-ACADEMIC-08: Weight is percentage of final grade (0-100)
- BR-ACADEMIC-09: UK grading: ≥70=1st, 60-69=2:1, 50-59=2:2, 40-49=3rd, <40=Fail
- BR-ACADEMIC-10: Percentage auto-calculated from score/max_score

---

### UC-ACADEMIC-03: Calculate Module Grade

**Actor:** User (James - checking current standing)  
**Preconditions:** User has module with assessments  
**Trigger:** User wants to know current module grade

**Main Flow:**
1. User clicks on module ("Advanced Algorithms")
2. User clicks "View Grade"
3. System retrieves module details
4. System retrieves all assessments for module
5. System calculates weighted average:
    - Midterm (68%, weight 40%) → contributes 27.2%
    - Coursework (75%, weight 30%) → contributes 22.5%
    - Total so far: 49.7% out of 70% assessed
6. System calculates current percentage: 49.7%
7. System determines UK grade: 49.7% → "Lower Second Class (2:2)"
8. System shows remaining weight: 30% (final exam not taken)
9. System displays results

**Postconditions:**
- User sees current grade based on completed assessments
- User knows how much of module still to be assessed
- User can plan what grade needed on remaining assessments

**Example Request:**
```json
GET /api/modules/1/grade
```

**Example Response:**
```json
{
  "module_id": 1,
  "module_name": "Advanced Algorithms",
  "module_code": "COMP3001",
  "module_credits": 20,
  "current_percentage": 49.70,
  "uk_grade": "Lower Second Class (2:2)",
  "uk_classification": {
     "classification": "Lower Second Class Honours",
     "abbreviation": "2:2",
     "description": "Satisfactory achievement"
  },
  "total_weight": 70,
  "remaining_weight": 30,
  "assessments_count": 2,
  "assessments": [...]
}
```

**Business Rules:**
- BR-ACADEMIC-11: Grade calculated from weighted average of completed assessments
- BR-ACADEMIC-12: Only completed assessments (with scores) counted
- BR-ACADEMIC-13: Remaining weight shows uncompleted portion
- BR-ACADEMIC-14: Current grade can change as more assessments added

---

### UC-ACADEMIC-04: View Year Overview

**Actor:** User (Aisha - checking degree progress)  
**Preconditions:** User has modules for an academic year  
**Trigger:** User wants to see overall year performance

**Main Flow:**
1. User navigates to academics dashboard
2. User selects year of study (1) and academic year (2025/2026)
3. System retrieves all modules for year 1, 2025/2026
4. System excludes dropped modules
5. For each module:
    - System calculates module grade
    - Only includes if ≥40% of assessments completed
6. System calculates credit-weighted average:
    - Module 1 (20 credits, 65%) → 1300 points
    - Module 2 (20 credits, 72%) → 1440 points
    - Module 3 (10 credits, 58%) → 580 points
    - Total: 3320 points / 50 credits = 66.4%
7. System determines year classification: 66.4% → "Upper Second Class (2:1)"
8. System displays overview

**Postconditions:**
- User sees all year 1 modules with grades
- User sees overall year average
- User sees predicted degree classification
- User can identify struggling modules

**Example Request:**
```json
GET /api/academics/year-overview?year_of_study=1&academic_year=2025/2026
```

**Example Response:**
```json
{
  "year_of_study": 1,
  "academic_year": "2025/2026",
  "modules": [
     {
        "module": {
          "name": "Programming Fundamentals",
          "credits": 20,
          "status": "in_progress"
        },
        "grade_info": {
          "current_percentage": 65.00,
          "uk_grade": "Upper Second Class (2:1)"
        }
     }
  ],
  "total_credits": 50,
  "year_average": 66.40,
  "uk_classification": {
     "classification": "Upper Second Class Honours",
     "abbreviation": "2:1",
     "description": "Good achievement"
  }
}
```

**Business Rules:**
- BR-ACADEMIC-15: Only count modules with ≥40% assessments completed
- BR-ACADEMIC-16: Dropped modules excluded from average
- BR-ACADEMIC-17: Year average weighted by module credits
- BR-ACADEMIC-18: Standard UK year is 120 credits

---

## Notes Management Use Cases

### UC-NOTES-01: Create Note

**Actor:** User (Sarah - taking lecture notes)  
**Preconditions:** User has module created  
**Trigger:** User attended lecture and wants to save notes

**Main Flow:**
1. User navigates to module notes
2. User clicks "New Note"
3. System displays note creation form
4. User enters title ("Lecture 1 - Introduction to OOP")
5. User enters topic ("Week 1")
6. User enters content (markdown supported):
    ```
    # Object Oriented Programming
    
    ## Key Concepts
    - Encapsulation
    - Inheritance
    - Polymorphism
    ```
7. User optionally adds tags ["OOP", "fundamentals", "exam-topic"]
8. User submits form
9. System validates title not empty
10. System validates topic not empty
11. System validates content not empty
12. System generates unique note ID
13. System sets created_at and updated_at timestamps
14. System sets is_pinned = false, is_archived = false
15. System saves note
16. System returns created note

**Postconditions:**
- Note saved with user-defined topic
- Note appears in module's notes list
- Note searchable by title, content, topic, and tags

**Alternative Flows:**

**A1: Missing Title**
- At step 9, title is empty
- System returns error: "Note title is required"
- User enters title

**A2: Missing Topic**
- At step 10, topic is empty
- System returns error: "Topic is required for organizing notes"
- User enters topic (can be anything: "Week 1", "Chapter 3", "Important Concepts", etc.)

**Example Request:**
```json
POST /api/notes
{
  "user_email": "sarah.jones@student.ac.uk",
  "module_id": 1,
  "title": "Lecture 1 - Introduction to OOP",
  "topic": "Week 1",
  "content": "# Object Oriented Programming\n\n## Key Concepts\n- Encapsulation...",
  "tags": ["OOP", "fundamentals", "exam-topic"]
}
```

**Example Response:**
```json
{
  "id": 1,
  "user_email": "sarah.jones@student.ac.uk",
  "module_id": 1,
  "module_name": "Programming Fundamentals",
  "module_code": "COMP1001",
  "title": "Lecture 1 - Introduction to OOP",
  "topic": "Week 1",
  "content": "# Object Oriented Programming\n\n## Key Concepts\n- Encapsulation...",
  "tags": ["OOP", "fundamentals", "exam-topic"],
  "is_pinned": false,
  "is_archived": false,
  "created_at": "2026-03-11T10:00:00.000Z",
  "updated_at": "2026-03-11T10:00:00.000Z"
}
```

**Business Rules:**
- BR-NOTES-01: Topic name is user-defined (complete freedom)
- BR-NOTES-02: Content supports markdown formatting
- BR-NOTES-03: Tags are optional, stored as array
- BR-NOTES-04: Notes auto-organized by topic
- BR-NOTES-05: Title, topic, and content are required

---

### UC-NOTES-02: View Notes by Topic

**Actor:** User (Sarah - reviewing Week 1 notes)  
**Preconditions:** User has notes created for module  
**Trigger:** User wants to review notes from specific topic

**Main Flow:**
1. User navigates to module notes page
2. System displays list of topics with note counts:
    - "Week 1" (3 notes, 1 pinned)
    - "Week 2" (2 notes, 0 pinned)
    - "Exam Revision" (1 note, 1 pinned)
3. User clicks "Week 1" topic
4. System retrieves all notes for module with topic "Week 1"
5. System excludes archived notes
6. System sorts notes: pinned first, then by updated date (newest first)
7. System displays filtered notes

**Postconditions:**
- User sees only Week 1 notes
- Pinned notes appear at top
- User can click another topic to switch view

**Example Request:**
```json
GET /api/notes/module/1?topic=Week 1
```

**Example Response:**
```json
[
  {
     "id": 3,
     "title": "Important Exam Points",
     "topic": "Week 1",
     "is_pinned": true,
     "updated_at": "2026-03-10T14:00:00.000Z"
  },
  {
     "id": 1,
     "title": "Lecture 1 - Introduction",
     "topic": "Week 1",
     "is_pinned": false,
     "updated_at": "2026-03-11T10:00:00.000Z"
  },
  {
     "id": 2,
     "title": "Seminar Discussion Notes",
     "topic": "Week 1",
     "is_pinned": false,
     "updated_at": "2026-03-09T15:00:00.000Z"
  }
]
```

**Business Rules:**
- BR-NOTES-06: Topics auto-generated from user input
- BR-NOTES-07: Pinned notes always appear first
- BR-NOTES-08: Archived notes hidden by default
- BR-NOTES-09: Notes sorted by updated_at within pin status

---

### UC-NOTES-03: Search Notes

**Actor:** User (James - looking for specific concept)  
**Preconditions:** User has notes created  
**Trigger:** User wants to find notes about "recursion"

**Main Flow:**
1. User enters "recursion" in search box
2. User optionally filters to specific module
3. User submits search
4. System searches across all user's notes:
    - Title contains "recursion"
    - Content contains "recursion"
    - Topic contains "recursion"
    - Tags contain "recursion"
5. System excludes archived notes
6. System ranks results: title match first, then by updated date
7. System returns matching notes

**Postconditions:**
- User sees all notes mentioning recursion
- Results ranked by relevance
- User can click note to view full content

**Example Request:**
```json
GET /api/notes/search?q=recursion&module_id=1
```

**Example Response:**
```json
{
  "query": "recursion",
  "results_count": 2,
  "notes": [
     {
        "id": 15,
        "title": "Recursion Explained",
        "topic": "Week 5",
        "module_name": "Advanced Algorithms",
        "updated_at": "2026-03-11T10:00:00.000Z"
     },
     {
        "id": 8,
        "title": "Algorithm Examples",
        "topic": "Week 3",
        "module_name": "Advanced Algorithms",
        "updated_at": "2026-02-20T14:00:00.000Z"
     }
  ]
}
```

**Business Rules:**
- BR-NOTES-10: Search is case-insensitive
- BR-NOTES-11: Search looks in title, content, topic, and tags
- BR-NOTES-12: Title matches ranked higher than content matches
- BR-NOTES-13: Archived notes not included in search

---

### UC-NOTES-04: Pin Important Note

**Actor:** User (Sarah - marking exam topics)  
**Preconditions:** User has note created  
**Trigger:** User wants note to always appear at top

**Main Flow:**
1. User views note list
2. User clicks pin icon on "Important Exam Topics" note
3. System updates note: is_pinned = true
4. System updates updated_at timestamp
5. System saves note
6. System refreshes note list
7. Pinned note now appears at top of list

**Postconditions:**
- Note is pinned
- Note appears at top of topic view
- Pin icon shows pinned status

**Example Request:**
```json
POST /api/notes/3/pin
```

**Example Response:**
```json
{
  "message": "Note pinned successfully",
  "note": {
     "id": 3,
     "title": "Important Exam Topics",
     "is_pinned": true,
     "updated_at": "2026-03-11T11:00:00.000Z"
  }
}
```

**Business Rules:**
- BR-NOTES-14: Unlimited notes can be pinned
- BR-NOTES-15: All pinned notes appear before unpinned notes
- BR-NOTES-16: Within pinned group, sorted by updated_at

---

### UC-NOTES-05: Archive Old Note

**Actor:** User (Aisha - cleaning up old notes)  
**Preconditions:** User has note from previous semester  
**Trigger:** User doesn't need note anymore but doesn't want to delete

**Main Flow:**
1. User views note list
2. User clicks archive icon on "Week 1 Notes" note
3. System updates note: is_archived = true
4. System updates updated_at timestamp
5. System saves note
6. System refreshes note list
7. Archived note no longer appears in default view

**Postconditions:**
- Note is archived
- Note hidden from default view
- Note can be retrieved if needed (include_archived=true)
- Note not deleted (can be unarchived)

**Example Request:**
```json
POST /api/notes/1/archive
```

**Example Response:**
```json
{
  "message": "Note archived successfully",
  "note": {
     "id": 1,
     "title": "Week 1 Notes",
     "is_archived": true,
     "updated_at": "2026-03-11T12:00:00.000Z"
  }
}
```

**Business Rules:**
- BR-NOTES-17: Archived notes hidden from default views
- BR-NOTES-18: Archived notes not included in search
- BR-NOTES-19: Archived notes can be unarchived anytime
- BR-NOTES-20: Archived notes deleted when module deleted

---

## Integration Use Cases

### UC-INT-01: Complete Student Workflow

**Actor:** User (Sarah - new student setting up everything)  
**Trigger:** First week of university

**Scenario:**
1. **Day 1 - Setup**
    - Sarah registers account
    - Receives welcome email
    - Sets up profile

2. **Day 2 - Budgeting**
    - Sarah receives student loan (£800)
    - Records transaction: Student Loan, £800, income
    - Sets budgets:
      - Food: £200/month
      - Transport: £50/month
      - Entertainment: £50/month
    - Checks budget status: all "on_track"

3. **Day 3 - Academic Setup**
    - Sarah adds 4 modules:
      - Programming (20 credits)
      - Mathematics (20 credits)
      - Digital Systems (20 credits)
      - Professional Skills (10 credits)
    - Total: 70 credits for semester 1

4. **Week 2 - First Expenses**
    - Buys textbooks: £85 (Course Materials)
    - Monthly bus pass: £45 (Transport)
    - Groceries: £35 (Food)
    - Budget status updates automatically

5. **Week 3 - First Lecture Notes**
    - Attends Programming lecture
    - Creates note: "Lecture 1 - Variables"
    - Topic: "Week 1"
    - Tags: ["basics", "exam"]

6. **Week 8 - First Assessment**
    - Completes coursework
    - Receives grade: 65/100
    - Adds assessment: Coursework, 65, 100, weight 30%
    - System calculates: 65% = 2:1
    - Pins note with exam tips

7. **Month End - Review**
    - Checks budget status
    - Food: 92% used (warning)
    - Transport: 90% used (warning)
    - Adjusts spending for next month

8. **Semester End - Progress Check**
    - All 4 modules have assessments
    - Views year overview
    - Current average: 64%
    - Classification: 2:1
    - Planning to improve to First

**Outcome:**
- Sarah has complete financial picture
- Sarah tracks academic progress
- Sarah has organized notes for revision
- Sarah feels in control of student life

---

### UC-INT-02: Module Deletion Cascade

**Actor:** User (James - dropped a module)  
**Preconditions:** User has module with assessments and notes  
**Trigger:** User drops module mid-semester

**Main Flow:**
1. User decides to drop "Advanced Databases" module
2. User navigates to module list
3. User clicks delete on "Advanced Databases"
4. System shows confirmation: "Delete module? All assessments and notes will also be deleted."
5. User confirms
6. System begins deletion:
    - Step 1: Delete all assessments for module
    - Step 2: Delete all notes for module
    - Step 3: Delete module itself
7. System returns success
8. Module no longer appears in list
9. Year overview recalculates without this module

**Postconditions:**
- Module deleted
- All assessments deleted (cascade)
- All notes deleted (cascade)
- Year average recalculated
- No orphaned data

**Business Rules:**
- BR-INT-01: Deleting module deletes all related assessments
- BR-INT-02: Deleting module deletes all related notes
- BR-INT-03: Deletion is permanent (no soft delete currently)
- BR-INT-04: User must confirm deletion

---

## Edge Cases & Error Scenarios

### EDGE-01: Concurrent Budget Updates

**Scenario:**
- User A opens budget page on laptop
- User A opens budget page on phone
- User A creates Food budget (£200) on laptop
- User A creates Food budget (£180) on phone (didn't refresh)
- Second request fails: "Budget already exists"

**System Behavior:**
- Thread-safe JSON storage prevents corruption
- Second request rejected with clear error
- User refreshes to see first budget
- User can update existing budget if desired

---

### EDGE-02: Assessment Weights Over 100%

**Scenario:**
- Module has 3 assessments:
  - Coursework 1: 40% weight
  - Coursework 2: 40% weight
  - Exam: 50% weight (user mistake)
- Total weight: 130%

**System Behavior:**
- System allows this (doesn't validate total weight)
- Grade calculation still works (uses weighted average)
- User sees "remaining weight: -30%" (negative indicates over 100%)
- **Future Enhancement:** Warn user when total exceeds 100%

---

### EDGE-03: Future-Dated Transactions

**Scenario:**
- User creates transaction for next month
- User views current month summary
- Future transaction not included

**System Behavior:**
- System accepts future dates (planned expenses)
- Transactions filtered by exact month/year
- Future transactions appear when that month selected
- No budget warnings for future transactions yet

---

### EDGE-04: Empty Grade Calculation

**Scenario:**
- User creates module
- User views module grade before adding assessments
- System shows:
  ```json
  {
     "current_percentage": null,
     "uk_grade": null,
     "message": "No assessments recorded"
  }
  ```

**System Behavior:**
- Gracefully handles empty assessment list
- Shows informative message
- Doesn't break or show errors
- User knows to add assessments first

---

### EDGE-05: Archived Note Search

**Scenario:**
- User has 10 notes, 3 are archived
- User searches for "algorithm"
- 2 matches found: 1 active, 1 archived
- System only returns the 1 active note

**System Behavior:**
- Archived notes excluded from search
- User gets only relevant active notes
- To search archived: special flag needed
- Keeps search results clean

---

### EDGE-06: Token Expiration During Session

**Scenario:**
- User logs in at 9:00 AM (token expires 9:00 AM next day)
- User leaves browser open overnight
- User tries action at 10:00 AM next day
- Token expired

**System Behavior:**
- API returns 401: "Token has expired"
- Frontend should detect and redirect to login
- User logs in again
- New 24-hour token issued

**Future Enhancement:**
- Implement refresh tokens
- Auto-refresh before expiry

---

## Success Metrics

For each use case, success is measured by:

1. **Completion Rate:** % of users who complete flow without errors
2. **Time to Complete:** Average time from start to finish
3. **Error Rate:** % of attempts that result in errors
4. **User Satisfaction:** Rating of ease of use

**Example Targets:**
- Registration: 95% completion, < 2 min, < 5% errors
- Add Transaction: 98% completion, < 30 sec, < 2% errors
- Module Grade View: 100% completion, < 5 sec, 0% errors

---

## Future Use Cases (Not Yet Implemented)

1. **UC-FUTURE-01:** Share note with another student
2. **UC-FUTURE-02:** Export year overview as PDF
3. **UC-FUTURE-03:** Set spending alerts (email when 80% budget used)
4. **UC-FUTURE-04:** Import transactions from bank CSV
5. **UC-FUTURE-05:** Predict final grade based on remaining assessments
6. **UC-FUTURE-06:** Recurring transactions auto-creation
7. **UC-FUTURE-07:** Budget templates (quick setup for new students)
8. **UC-FUTURE-08:** Collaborative notes (study groups)

---

**Document Owner:** Development Team  
**Last Review:** April 8th, 2026  
**Next Review:** April 16th, 2026  
**Status:** Living Document - Updated as features evolve