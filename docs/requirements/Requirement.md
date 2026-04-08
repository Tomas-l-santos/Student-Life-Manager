# Introduction

The Student Life Management (SLM) system is an integrated productivity platform designed for higher education students. Built using React 19 (TypeScript) and Python (Flask), it addresses “app fatigue” by combining academic tracking, financial budgeting, and personal task management into a single, unified dashboard. The system uses a local-first data storage approach with structured JSON to ensure both performance and user privacy. Its key features include a weighted grade calculator aligned with UK degree classifications, a dynamic workload stress indicator based on upcoming deadlines, and a thread-safe financial tracking system. By bringing these elements together, SLM offers students clear and practical insights into their academic progress and overall wellbeing.

# Stakeholders

| Stakeholder         | Interest                         | Priority |
| ------------------- | -------------------------------- | -------- |
| Student user        | Manage time, finances, deadlines | High     |
| Developer team      | Maintainable, testable codebase  | High     |
| University assessor | Evidence of engineering process  | Medium   |

# Specifications

## user and system requirements

| Requirement ID | Requirement Type   | Requirement Statement                                                                                        | Rationale                                                              | Priority | Verification Method                            |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| **UR-1**       | User Requirement   | The student shall be able to create and manage a personal account                                            | Enables secure access and persistent storage of student data           | High     | User creates and accesses account successfully |
| SR-1.1         | System Requirement | The system shall collect an email, username, and password during account creation                            | Required to uniquely identify and secure each account                  | High     | Functional test                                |
| SR-1.2         | System Requirement | The system shall validate password strength according to defined security rules                              | Ensures minimum level of account security                              | High     | Validation test                                |
| SR-1.3         | System Requirement | The system shall allow authenticated users to log in using stored credentials                                | Enables secure access to stored data                                   | High     | Login test                                     |
| SR-1.4         | System Requirement | The system shall allow users to reset or change their password                                               | Improves accessibility and security                                    | High     | Functional test                                |
| SR-1.5         | System Requirement | The system shall facilitate password recovery via a 6-digit One-Time Password (OTP) sent to the user's email | Ensures secure account access recovery without compromising privacy    | High     | Functional test                                |
| **UR-2**       | User Requirement   | A student shall be able to track their monthly expenses and income                                           | Supports budgeting and provides insight into financial behaviour       | High     | Summary generated correctly                    |
| SR-2.1         | System Requirement | The system shall allow users to create income entries including amount and date                              | Enables tracking of money received                                     | High     | Functional test                                |
| SR-2.2         | System Requirement | The system shall allow users to create expense entries including amount, date, and categories                | Enables tracking of money spent                                        | High     | Functional test                                |
| SR-2.3         | System Requirement | The system shall calculate total monthly income                                                              | Provides financial overview of income                                  | High     | Output verification                            |
| SR-2.4         | System Requirement | The system shall calculate total monthly expenses                                                            | Provides financial overview of expenses and enables spending awareness | High     | Output verification                            |
| SR-2.5         | System Requirement | The system shall allow users to edit or delete income and expense entries                                    | Ensures accuracy of stored data                                        | Medium   | Functional test                                |
| SR-2.6         | System Requirement | The system shall store all income and expense records persistently in local browser storage                  | Ensures data is retained between sessions                              | High     | Data persistence test                          |
| SR-2.7         | System Requirement | The system shall provide visual warnings when a category expense reaches 80% or 100% of its limit            | Increases financial awareness and prevents overspending                | High     | Functional test                                |
| SR-2.8         | System Requirement | The system shall visualize cash flow and expense distribution using interactive pie charts                   | Provides a clear summary of financial health                           | Medium   | Output verification                            |
| **UR-3**       | User Requirement   | The student shall be able to manage academic modules and performance                                         | Allows organisation and monitoring of academic progress                | High     | Module and scores recorded successfully        |
| SR-3.1         | System Requirement | The system shall allow users to create module entries with name and credit value                             | Stores module information                                              | High     | Functional test                                |
| SR-3.2         | System Requirement | The system shall allow users to record assessment scores per module                                          | Enables tracking of academic performance                               | High     | Score saved                                    |
| SR-3.3         | System Requirement | The system shall allow users to assign weights to assessments within a module                                | Enables accurate calculation of final grades                           | High     | Calculation test                               |
| SR-3.4         | System Requirement | The system shall calculate the required average on remaining assessments to achieve a 70% average            | Supports academic goal setting                                         | Medium   | Output verification                            |
| **UR-4**       | User Requirement   | The student shall be able to manage deadlines, tasks, and productivity tools                                 | Improves time management and overall productivity                      | High     | Deadlines and tasks displayed correctly        |
| SR-4.1         | System Requirement | The system shall allow users to add deadlines with dates to modules                                          | Stores important academic tasks                                        | High     | Entry saved                                    |
| SR-4.2         | System Requirement | The system shall generate reminders                                                                          | Helps prevent missed deadlines                                         | Medium   | Reminder triggered                             |
| SR-4.3         | System Requirement | The system shall compute workload indicator based on deadlines                                               | Visualises time critical workload                                      | Medium   | Output verified                                |
| SR-4.4         | System Requirement | The system shall provide a multi-column Kanban board for task lifecycle management                           | Offers a visual workflow for productivity                              | Medium   | User UI test                                   |
| SR-4.5         | System Requirement | The system shall provide an integrated notebook area for each task to store planning details                 | Centralises task-related information                                   | Low      | Functional test                                |
| SR-4.6         | System Requirement | The system shall allow users to switch between Light, Dark, and Classic visual themes                        | Improves accessibility and user experience                             | Low      | User UI test                                   |

# Functional Requirement

## Academic & Timetable Management

- The system shall allow users to log modules and input scores.

- The system shall calculate the average score for each module.

- The system shall calculate the average score for each module and the required score to hit a 70% distinction target.

- The system shall allow users to manually create a timetable or upload a picture for automatic filling.

- The system shall permit users to add side notes to each specific lecture entry.

- The system shall generate automated deadline reminders for each academic module.

- The system shall visualize a stress metric that links upcoming deadlines, student workload.

- The system shall provide a visual Kanban board to track the lifecycle of student tasks.

- The system shall include an integrated Notebook Area for detailed task planning and brainstorming.

## Finance Management

- The system shall allow users to set a budget limit and record daily expenses.

- The system shall categorize expenses(e.g,food, rent, travel) for better tracking and provide visual alerts when limits are nearing or exceeded.

- The system shall generate monthly summaries and pie-chart visualizations of spend limits versus actual spending.

# Non-functional Requirements

- NFR-1
  The system shall enforce a password rules: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character.

- NFR-2
  The system shall lock the login feature after 5 failed attempts for 5 minutes.

- NFR-3
  The system shall provide a "delete Account & Data" function that permanently deletes all locally stored data from that user.

- NFR-4
  The system shall prevent data corruption by verifiying the data shape before saving and loading (timetable must have date/time/module to continue).

- NFR-5
  The system shall load the dashboard page in under 2 seconds with up to 200 stored timetable entries an a standard laptop.

- NFR-6
  The system shall allow key tasks such as; module score, add expense, and timetable entry to be completed in no more than three user interactions each.

- NFR-7
  The system shall log important events locally without storing sensitive details (this would be like password changed, account created, and data deleted).

- NFR-8
  The system shall meet WCAG 2.1 AA basics where keyboard navigation, visible focus, suffcient contrast and form lables for inputs.

- NFR-9
  The system shall allow users to switch between Light, Dark, and Classic modes to ensure comfortable use in different lighting environments and improve overall accessibility.

# Constraints

### Technical Constraints

- Data Storage: The system only uses flat JSON files for storage. No SQL or NoSQL databases were allowed, so custom file-locking was needed to keep data safe.

- Environment: The application runs only on a local setup, with the backend on 127.0.0.1:5000 and the frontend on localhost:5173.

- Compatibility: It must run on standard student laptops (Windows and macOS) using only Python 3.12 and Node.js 22+, without complex setup.

### Academic & Regulatory Constraints

- Deadline: The entire project had to be completed by April 8, 2026, limiting some features to basic functionality.

### Team & Process Constraints

- Team Structure: The project was built by a team of four, split into frontend and backend pairs, requiring clear communication and API design.

- Budget: Only free tools were used. No paid services or cloud platforms were included, ensuring the project is easy to reproduce.

# Useability Requirements

Students should all be able to use this product easily as it has no learing curve and minimal, or next to no technical errors, should occur when a student is using the product. The students would be familiar with the simple design and UI of the product, consisting of a drop down menu with all the product's functions mentioned above such as Study Life, Finance Manager and Health. These have thier own functions within each of thier own respective sections such as an exam reminder, a budget tracker and a virtual notepad. (incase we decide to add more features add here) These functions for our product are designed close to already existing actions and behaviours of other apps for familiarity such as, common timetable UI, budget pie charts from banking apps and a simple Google Docs/ Word theme notes app.
