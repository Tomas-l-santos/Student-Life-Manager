# Project Retrospective - Student Life Management System

**Project:** Student Budget & Academics Management System  
**Sprint/Period:** Initial Development (January - March 2025)  
**Team Size:** 4 developers  
**Retrospective Date:** April 7, 2025

---

## Executive Summary

### Project Goals
Build a comprehensive student management system combining budget tracking and academic performance monitoring with a note-taking feature.

### What We Achieved
- Complete authentication system with password reset
- Budget tracking with 16 pre loaded categories 
- Academic module and assessment tracking (UK grading system)
- Notes system with topic-based organization
- JSON-based storage with thread-safe operations


### Overall Assessment
**Status:** Completed   
**Team Morale:** Positive  
**Technical Debt:** None 
**Next Steps:** Small tweaks and bug fixes

---

## What Went Well

### 1. **Feature Implementation**
- **UK Grading System**
  - Successfully implemented authentic UK university grading (1st, 2:1, 2:2, 3rd, Fail)
  - Credit validation matching UK standards (10, 15, 20, 30, 40, 60)
  - Weighted grade calculations working accurately


- **Notes System**
  - Topic-based organization gives users complete freedom
  - Pin/archive functionality enhances usability
  - Search across title, content, topics, and tags works well
  - **Impact:** Solves real student pain point of scattered notes

- **Password Reset via Email**
  - 6-digit OTP system is user-friendly
  - Email integration working (Gmail SMTP)
  - Token expiry (1 hour) balances security and UX
  - **Impact:** Professional feature expected in modern apps

### 2. **Code Organization**
- **Service Layer Pattern**
  - Clean separation: Routes → Services → Models → Storage
  - `AcademicsService` coordinates modules, assessments, analytics, notes
  - `BudgetService` handles transactions, budgets, categories
  - **Impact:** Code is maintainable and testable

- **Model Abstraction**
  - Each domain has clear models (User, Module, Assessment, Note, etc.)
  - `to_dict()` and `from_dict()` methods standardized
  - **Impact:** Consistent data handling across the app

- **Package Structure**
  - `models/Budget/` and `models/Academics/` clearly separated
  - `__init__.py` files enable clean imports
  - **Impact:** Professional project structure

### 3. **Team Collaboration**
- **Clear Division of Work**
  - Developer 1: Frontend
  - Developer 2: Frontend
  - Developer 3: Backend
  - Developer 4: Backend

- **Code Consistency**
  - Agreed on naming conventions early
  - Consistent error handling patterns
  - Shared `JSONStorage` class across features
  - **Impact:** Code feels like one person wrote it

### 4. **Security Fundamentals**
- **Password Security**
  - bcrypt hashing implemented correctly
  - Password validation enforced (8+ chars, upper, lower, digit, special)
  - Account lockout after 5 failed attempts
  - **Impact:** Professional security baseline

- **JWT Authentication**
  - Token-based auth working
  - 24-hour expiry reasonable for student app
  - Authorization header properly checked
  - **Impact:** Stateless, scalable auth

### 5. **Data Validation**
- **Input Validation Throughout**
  - Email regex validation
  - Date format validation (YYYY-MM-DD)
  - UK credit values validated
  - Assessment weights validated (0-100)
  - **Impact:** Prevents bad data, better error messages

### 6. **User Experience Decisions**
- **Flexible Topic Names**
  - Students can create any topic names they want
  - No forced structure (Week 1, Week 2)
  - Topics auto-organize based on user input
  - **Impact:** Respects student preferences

- **Category Icons**
  - Visual category system with emojis
  - Makes budget tracking more engaging
  - **Impact:** Better UX, especially on mobile

---

## What Could Be Improved

### 1. **Architecture Issues**

#### Problem: Routes in main.py
- **Current State:** All budget/transaction routes defined directly in `main.py`
- **Impact:** 
  - `main.py` is 80+ lines and hard to read
  - Violates separation of concerns
  - Difficult to test individual routes
- **Lesson Learned:** Start with blueprints from day one
- **Action Item:** Refactor into separate route files this week

#### Problem: Inconsistent User Identification
- **Current State:** Mix of `user_id` and `user_email` across codebase
  - Transactions use `user_id`
  - Budgets use `user_email`
  - Modules use `user_email`
- **Impact:**
  - Confusion when writing new features
  - Potential bugs in cross-feature queries
  - Harder to enforce foreign key relationships
- **Lesson Learned:** Standardize data relationships early
- **Action Item:** Migration plan to use `user_id` everywhere

#### Problem: In-Memory Password Reset Tokens
- **Current State:** `self.reset_tokens = {}` in `AuthService`
- **Impact:**
  - Tokens lost on server restart
  - Can't scale to multiple servers
  - No persistence for audit trail
- **Lesson Learned:** Critical data needs persistence
- **Action Item:** Move to Redis or database table

### 2. **Testing Gaps**

#### Problem: No Automated Tests
- **Current State:** Manual testing only via Postman/curl
- **Impact:**
  - Regressions not caught early
  - Refactoring is risky
  - Can't confidently deploy
  - No CI/CD possible
- **Lesson Learned:** Tests should be written alongside features
- **Action Item:** Add pytest, start with service layer tests

#### Problem: No Test Data
- **Current State:** Developers manually create test users/data
- **Impact:**
  - Inconsistent testing environments
  - Difficult to reproduce bugs
  - Onboarding new developers is slow
- **Lesson Learned:** Need seed data scripts
- **Action Item:** Create `scripts/seed_test_data.py`

### 3. **Code Quality**

#### Problem: Error Handling Inconsistency
- **Current State:** Mix of approaches:
  - Some functions raise `ValueError`
  - Some return `None`
  - Some return `False`
- **Impact:**
  - Confusing for other developers
  - Harder to debug
- **Lesson Learned:** Define error handling strategy upfront
- **Action Item:** Document error handling conventions

#### Problem: Missing Docstrings
- **Current State:** Many methods have no documentation as they were talked about in real life
- **Impact:**
  - Hard to understand what methods do
  - Difficult for new team members
- **Lesson Learned:** Write docstrings as you code
- **Action Item:** Add docstrings to all public methods

#### Problem: No Type Hints
- **Current State:** Python code has no type annotations
- **Impact:**
  - IDE can't provide good autocomplete
  - Type related bugs not caught early
  - Harder to refactor with confidence
- **Lesson Learned:** Type hints are worth the effort
- **Action Item:** Add type hints gradually, starting with new code

### 4. **Database & Storage**

#### Problem: JSON Storage Limitations
- **Current State:** All data in JSON files
- **Impact:**
  - No transactions (risk of data corruption)
  - Poor performance with large datasets
  - No relationships/foreign keys enforced
  - No indexes for fast queries
  - Difficult to backup/restore
- **Lesson Learned:** JSON fine for prototyping, not production
- **Action Item:** Migration to SQLite planned for v0.3

#### Problem: No Data Validation at Storage Layer
- **Current State:** Storage accepts any dict
- **Impact:**
  - Invalid data can be saved
  - Schema changes not enforced
  - No data integrity guarantees
- **Lesson Learned:** Need schema validation
- **Action Item:** Consider Pydantic models or database ORM

### 5. **Security Concerns**

#### Problem: Secrets in Code
- **Current State:** 
  - Email credentials hardcoded in `auth_routes.py`
  - JWT secret has default value
- **Impact:**
  - Can't commit code to public repo safely
  - Difficult to manage different environments
  - Security vulnerability if leaked
- **Lesson Learned:** Use `.env` from the start
- **Action Item:** Move all secrets to environment variables


#### Problem: Token Exposure in Responses
- **Current State:** Password reset token shown in API response
  ```python
  return jsonify({'reset_token': token})
  ```
- **Impact:**
  - Token visible in browser console/logs
  - Increases attack surface
- **Lesson Learned:** Sensitive data shouldn't be in responses
- **Action Item:** Only send token via email, never in API response

### 6. **User Experience**

#### Problem: Cryptic Error Messages
- **Current State:** Technical errors exposed to users
  ```python
  return jsonify({'error': str(e)})  # Shows stack traces
  ```
- **Impact:**
  - Confusing for non-technical users
  - Exposes implementation details
  - Unprofessional
- **Lesson Learned:** User-facing vs developer-facing errors
- **Action Item:** Create error message mapping

#### Problem: No Input Sanitization
- **Current State:** User input passed through mostly as-is
- **Impact:**
  - Risk of XSS when displaying data
  - Potential for injection attacks
  - Malformed data can break UI
- **Lesson Learned:** Never trust user input
- **Action Item:** Add input sanitization library

### 7. **Documentation**

#### Problem: No Setup Guide
- **Current State:** New developers have to figure out setup
- **Impact:**
  - Slow onboarding
  - Environment inconsistencies
  - Wasted time troubleshooting
- **Lesson Learned:** README with setup steps is essential
- **Action Item:** Create comprehensive `README.md`

---

## Key Learnings

### Technical Insights

1. **Start with Structure**
   - Setting up blueprints/routes properly from day one saves refactoring time
   - Package structure matters - invest time early

2. **Consistency is King**
   - Agreeing on patterns early (error handling, naming, etc.) prevents confusion
   - Code reviews help maintain consistency

3. **Security Can't Be an Afterthought**
   - Moving secrets to `.env` later is painful
   - Rate limiting easier to add early than retrofit

4. **JSON for Prototyping Only**
   - Great for MVP to validate features quickly
   - But migrate to real database early in development

5. **Tests Save Time**
   - Manual testing of 50+ endpoints is unsustainable
   - Tests pay for themselves after first refactor

### Process Insights

1. **Communication Prevents Conflicts**
   - Regular sync-ups prevented merge conflicts
   - Slack/Discord for quick questions worked well

2. **Feature Branches Work**
   - Each developer on own branch reduced conflicts
   - PRs helped catch issues before merging

3. **Document as You Go**
   - Writing docs after the fact is painful
   - Quick comments during development save hours later

### Team Dynamics

1. **Clear Ownership Helps**
   - Each person owning a domain (budget vs academics) worked well
   - Less stepping on each other's toes

2. **Pair Programming for Complex Features**
   - Password reset email integration benefited from two pairs of eyes
   - Caught bugs early

3. **Celebrate Small Wins**
   - First successful API call
   - First module grade calculation
   - Kept morale high

---

##  Action Items for Next Sprint

### Critical 

1. **Refactor Routes** (Priority: P0)
   - [ ] Create `routes/` directory with separate files
   - [ ] Move all routes from `main.py` to blueprints
   - [ ] Update imports in `main.py`
   - **Owner:** Developer 1
   - **Deadline:** End of week
   - **Blockers:** None

2. **Environment Variables** (Priority: P0)
   - [ ] Create `.env.example` file
   - [ ] Move email credentials to `.env`
   - [ ] Move JWT secret to `.env`
   - [ ] Add `python-dotenv` to requirements
   - **Owner:** Developer 2
   - **Deadline:** End of week
   - **Blockers:** None

3. **Fix User ID Inconsistency** (Priority: P0)
   - [ ] Decide: Use `user_id` or `user_email` everywhere
   - [ ] Document decision and rationale
   - [ ] Create migration script if changing
   - [ ] Update all affected code
   - **Owner:** Team discussion needed
   - **Deadline:** Next week
   - **Blockers:** Need team consensus

### Important (Should Do)

4. **Add Basic Tests** (Priority: P1)
   - [ ] Set up pytest
   - [ ] Write tests for `AuthService`
   - [ ] Write tests for `AcademicsService`
   - [ ] Aim for 30% coverage to start
   - **Owner:** Both developers
   - **Deadline:** 2 weeks
   - **Blockers:** None

5. **API Documentation** (Priority: P1)
   - [ ] Set up Swagger/OpenAPI
   - [ ] Document all auth endpoints
   - [ ] Document all budget endpoints
   - [ ] Document all academics endpoints
   - **Owner:** Developer 1
   - **Deadline:** 2 weeks
   - **Blockers:** None

6. **Improve Error Handling** (Priority: P1)
   - [ ] Create error response standard
   - [ ] Map technical errors to user-friendly messages
   - [ ] Add error logging
   - **Owner:** Developer 2
   - **Deadline:** 2 weeks
   - **Blockers:** None

### Nice to Have (Could Do)

7. **Add Rate Limiting** (Priority: P2)
   - [ ] Install Flask-Limiter
   - [ ] Add rate limits to all endpoints
   - [ ] Test rate limiting behavior
   - **Owner:** TBD
   - **Deadline:** 3 weeks
   - **Blockers:** None

8. **Seed Test Data** (Priority: P2)
   - [ ] Create sample users
   - [ ] Create sample transactions
   - [ ] Create sample modules/assessments
   - [ ] Create sample notes
   - **Owner:** TBD
   - **Deadline:** 3 weeks
   - **Blockers:** None

---

##  Metrics & Progress

### Completed Features
- **Total Features Planned:** 8
- **Features Completed:** 8 (100%)
- **Features Partially Complete:** 0

### Code Quality
- **Lines of Code:** 2,500+
- **Number of Files:** 20+
- **Test Coverage:** 0%
- **Known Bugs:** 3 critical, 5 high priority

### Time Estimates vs Actual
| Feature | Estimated | Actual | Variance |
|---------|-----------|--------|----------|
| Authentication | 3 days | 4 days | +1 day |
| Budget System | 5 days | 6 days | +1 day |
| Academics (Modules/Assessments) | 5 days | 7 days | +2 days |
| Notes System | 3 days | 3 days | On time |
| Integration | 2 days | 4 days | +2 days |
| **Total** | **18 days** | **24 days** | **+6 days** |

**Analysis:** We underestimated integration complexity and debugging time. UK grading system required more research than expected.

### Velocity
- **Sprint 1:** 8 story points
- **Sprint 2:** 13 story points
- **Sprint 3:** 15 story points
- **Trend:** Velocity increasing as team gels

---

## Team Reflections

### Developer 1 (Backend - Auth/Budget)
**Went Well:**
- All features came together nicely
- Email integration was satisfying to get working
- Good collaboration with Developer 2

**Could Improve:**
- Should have written tests from the start
- Need to be better at time estimation
- Could communicate blockers earlier

**Personal Goal:**
- Learn more about database design for the migration

---

### Developer 2 (Backend - Academics/Notes)
**Went Well:**
- UK grading system research was interesting
- Notes feature exceeded initial scope (in a good way)
- Clean code organization

**Could Improve:**
- Should have flagged the user_id inconsistency earlier
- Need to improve Git workflow (fewer large commits)
- Could document decisions better

**Personal Goal:**
- Get better at breaking down large features into smaller tasks

---

## Knowledge Sharing

### Technical Knowledge Gained
- **Flask Blueprints:** How to structure large Flask apps
- **JWT Authentication:** Token-based auth implementation
- **bcrypt:** Proper password hashing
- **Thread Safety:** Why `Lock` is important in `JSONStorage`
- **UK Education System:** UK grading and credit system

### Resources That Helped
- Flask documentation (blueprints section)
- Real Python JWT tutorial
- UK university grading system explanations
- Stack Overflow for specific bugs

### Code Patterns We Established
```python
# Service layer pattern
service = SomeService()
result = service.some_method()

# Error handling pattern
try:
    result = service.method()
    return jsonify(result), 200
except ValueError as e:
    return jsonify({'error': str(e)}), 400
except Exception as e:
    return jsonify({'error': 'Something went wrong'}), 500

# JWT protection pattern
@token_required
def protected_route(current_user_email):
    # Route implementation
```

---

## Collaboration Highlights

### What Worked Well
- **Daily Standups:** 15-minute check-ins kept everyone aligned
- **Shared Google Doc:** For design decisions and brainstorming
- **Code Reviews:** Caught several bugs before merging
- **Slack Channel:** Quick questions resolved fast

### What Could Improve
- **Merge Conflicts:** Had a few painful ones, need better branch strategy
- **Documentation:** Should write more inline comments
- **Planning:** Need better task breakdown in next sprint

---

## 🏆 Wins to Celebrate

1. **First Successful API Call** 🎉
   - Date: Week 1
   - What: Auth registration endpoint working end-to-end

2. **Email Integration Working** 📧
   - Date: Week 3
   - What: Password reset emails sending successfully

3. **Grade Calculator Accuracy** 📊
   - Date: Week 4
   - What: UK grading calculations validated against real university data

4. **Zero Data Loss** 💾
   - Date: Throughout
   - What: Thread-safe JSON storage prevented race conditions

5. **Notes Search Feature** 🔍
   - Date: Week 5
   - What: Search across title/content/tags working perfectly

---

## Appendix

### Decisions Made
1. **JSON vs Database:** Start with JSON for speed, migrate to SQLite in v0.3
2. **User Identification:** Initially mixed `user_id` and `user_email`, standardizing to `user_id` next sprint
3. **UK Grading Only:** Don't support multiple grading systems yet, focus on UK
4. **No Frontend Yet:** Backend-first approach, frontend to follow
5. **Email for Reset:** Using email for password reset, not SMS

### Tools Used
- **Backend:** Python 3.10, Flask, bcrypt, PyJWT
- **Storage:** JSON files with thread-safe operations
- **Testing:** Manual testing via Postman/curl
- **Collaboration:** Git/GitHub, Slack, Google Docs
- **Email:** Gmail SMTP for password reset

### Risks Identified
1. **Technical Debt:** Accumulating, need to address in next sprint
2. **No Tests:** Major risk for refactoring and scaling
3. **In-Memory Tokens:** Will break in production
4. **JSON Storage:** Won't scale beyond 1000 users
5. **Hardcoded Secrets:** Can't open-source safely yet
