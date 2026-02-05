# Introduction

## system overview

# Stakeholders

- Primary stakeholders 
    Students, they use the system to create accounts, track modules/grades, manage timetables, record expenses, and view reminders/stress indicators.
# Stakeholders


# Specifications
## user and system requirements
Requirement ID`	Requirement Type	Requirement Statement	Rationale	Priority	Verification Method
UR-1	User Requirement	The student shall be able to create an account	enables local browser storage of information of the student	High	Account creation attempt
SR-1.1	System Requirement	The system should be able to collect a email, username, and password for a local account	the system will reference the student by name and lock their account to the password	Medium	Functional test
SR-1.2	System Requirement	The system should be able to authenticate the password used	To ensure the account is secure, the password need to be of a certain character length with special characters	High	Functional test
SR-1.3	System Requirement	The system should be able to pull the account based on the email provided, and allow a changing of the password	Ensures accessibility and security of the accounts on the website	High	Functional test



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


