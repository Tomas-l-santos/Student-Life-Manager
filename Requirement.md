# Introduction

## system overview

# Stakeholders

- Primary stakeholders 
    Students, they use the system to create accounts, track modules/grades, manage timetables, record expenses, and view reminders/stress indicators.
# Stakeholders


# Specifications
## user and system requirements
| Requirement ID | Requirement Type   | Requirement Statement                                                                         | Rationale                                                                              | Priority | Verification Method                  |
| -------------- | ------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------- | ------------------------------------ |
| UR-1           | User Requirement   | The student shall be able to create a personal account                                        | enables local browser persistent storage of financial and academic data of the student | High     | User creates an account successfully |
| SR-1.1         | System Requirement | The system shall collect an email, username, and password during account creation             | Required to uniquely identify and secure each account                                  | High     | Functional test                      |
| SR-1.2         | System Requirement | The system shall validate password strength according to defined security rules               | Ensures minimum level of account security                                              | High     | Validation test                      |
| SR-1.3         | System Requirement | The system shall allow authenticated users to log in using stored credentials                 | Enables secure access to stored data                                                   | High     | Login test                           |
| SR_1.4         | System Requirement | The system shall allow users to reset or change their password                                | Improves accessibility and security                                                    | High     | Functional test                                     |
| UR-2           | User Requirement   | A student shall be able to track their monthly expenses and income                            | Supports budgeting and provides information of distribution of expenses                | High     | Summary generated correctly          |
| SR-2.1         | System Requirement | The system shall allow users to create income entries including amount, and date              | Enables tracing of money received                                                      | High     | Functional test                      |
| SR-2.2         | System Requirement | The system shall allow users to create expense entries including amount, date, and categories | Enables tracking of money spent                                                        | High     | Functional test                      |
| SR-2.3         | System Requirement | The system shall calculate total monthly income                                               | Provides financial overview of income                                                  | High     | Output verification                  |
| SR-2.4         | System Requirement | The system shall calculate total monthly expenses                                             | Provides financial overview of expenses and enables spending awareness                 | High     | Output verification                  |
| SR-2.5         | System Requirement | The system shall allow users to edit or delete income and expenses entries                    | Ensures accuracy of data                                                               | Medium   | Functional test                      |
| SR-2.6         | System Requirement | The system shall store all income and expenses records persistently in local browser storage  | Ensures data is stored between sessions                                                | High     | Data persistence test                |
| UR-3           | User Requirement   | The student shall be able to add and manage academic modules                                  | Allows organisation of academic workload                                               | High     | Module added successfully            |
| SR-3.1         | System Requirement | The system shall allow users to create module entries with name and credit value              | Stores module information                                                              | High     | Functional test                      |
| SR-3.2         | System Requirement | The system shall allow users to record assessment scores per module                           | Enables progress tracking                                                              | High     | Score saved                          |
| UR-4           | User Requirement   | The system shall be able to manage academic deadlines                                         | Prevent missing submission deadlines                                                   | High     | Deadline displayed                   |
| SR-4.1         | System Requirement | The system shall allow users to add deadlines with dates to modules                           | Stores time important tasks                                                            | High     | Entry saved                          |
| SR-4.2         | System Requirement | The system shall generate reminders                                                           | Improves time management                                                               | Medium   | Reminder saved                       |
| SR-4.3         | System Requirement | The system shall compute workload indicator based on deadlines                                | Visualise time critical tasks                                                          | Medium   | Output verified                      |



# Functional Requirement

## Academic & Timetable Management

- The system shall allow users to log modules and input scores.

- The system shall calculate the average score for each module.

- The system should allow users to manually create a timetable or upload a picture for automatic filling.

- The system should permit users to add side notes to each specific lecture entry.

- The system shall generate automated deadline reminders for each academic module.

- The system shall visualize a stress metric that links upcoming deadlines, student workload.

## Finance Management 

- The system shall allow users to set a budget limit and record daily expenses.

- The system should categorize expenses(e.g,food, rent, travel) for better tracking.

- The system shall generate monthly summaries of spend limits versus actual spending.

## Mental & Physical Health Tracking




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
    The system shall load the dashboard page in under 2 seconds on a typical laptop with up to 200 stored timetable entries.

- NFR-6
    The system shall allow key tasks such as; module score, add expense, and timetable entry.

- NFR-7
    The system should log important events locally without storing sensitive details (this would be like password changed, account created, and data deleted).

- NFR-8
    The system shall meet WCAG 2.1 AA basics where keyboard navigation, visible focus, suffcient contrast and form lables for inputs.

# Mermaid map of requirements 

- Security 
    NFR-1 
    NFR-2

- Data Integrity & Privacy 
    NFR-3
    NFR-4
    NFR-7

- Performance 
    NFR-5

- Usability & Accessibility
    NFR-6
    NFR-8
mermaid map of requirements






# Useability Requirements

Students should all be able to use this product easily as it has no learing curve and minimal, or next to no technical errors, should occur when a student is using the product. The students would be familiar with the simple design and UI of the product, consisting of a drop down menu with all the product's functions mentioned above such as Study Life, Finance Manager and Health. These have thier own functions within each of thier own respective sections such as an exam reminder, a budget tracker and a virtual notepad. (incase we decide to add more features add here)  These functions for our product are designed close to already existing actions and behaviours of other apps for familiarity such as, common timetable UI, budget pie charts from banking apps and a simple Google Docs/ Word theme notes app.  

