# System Modelling

## 1. Introduction

This section explains how the Student Life Management System was designed using different UML diagrams.  
Each diagram focuses on a specific part of the system, such as how the user interacts with it, how the system is structured, and how different parts communicate.

The main aim of this was not just to draw diagrams, but to actually plan the system properly before coding and make sure everything links back to the requirements.

## 2. System Architecture

The system is designed as a web-based application made up of three main parts:

- **Frontend** – Built using HTML and CSS (with plans to convert to React). This is what the user interacts with.
- **Application Logic** – Handles features such as login, task management, and updating data.
- **Data Storage** – Uses local storage to save user data like tasks, modules, and budget information.

This approach was chosen mainly because it keeps the system simple and easy to run without needing a database.  
However, it does come with some limitations, such as not being able to access data across different devices and reduced scalability.

## 3. UML Diagrams and Their Purpose

Different diagrams were used to represent different parts of the system.

### 3.1 Use Case Diagram

See: [use-case.md](./use-case.md)

This diagram shows what the user can actually do in the system, such as creating an account, managing tasks, tracking deadlines, and viewing their budget.

It was useful at the start of the project to make sure all key features were included and matched the requirements.

### 3.2 Activity Diagram

See: [activity-diagram.md](activity-diagram.md)

The activity diagram shows how processes work step by step.  
For example, it can show the flow of logging in or adding a task.

This helped break things down clearly and made it easier to understand the logic before implementing it.

### 3.3 Sequence Diagram

See: [sequence-diagram.md](./sequence-diagram.md)

This diagram shows how different parts of the system interact over time.  
For example, in the password reset process, the system sends a code to the user’s email, which is then used to verify and update the password.

This was important to make sure everything happens in the correct order, especially for security-related features.

### 3.4 Class Diagram

See: [class-diagram.md](./class-diagram.md)

The class diagram shows how the system is structured.  
It includes key components like User, Task, Module, and Budget, and how they relate to each other.

This helped organise the system properly and influenced how data is stored and managed.

### 3.5 State Diagram

See: [state-diagram.md](./state-diagram.md)

The state diagram shows how something changes over time.  
For example, a task can move between states like _pending_, _in progress_, and _completed_.

This helps make sure the system behaves consistently when users interact with it.

## 4. Design Decisions and Justification

Some important decisions were made during the design process:

- **Using Local Storage**  
  This was chosen to keep the system simple and avoid needing a backend.  
  It makes the system easy to use, but it also means data is limited to one device.

- **Email-Based Password Reset**  
  A verification code system was used to improve security and make the system closer to real-world applications.

- **Modular Page Design**  
  The system is split into pages like Dashboard, Tasks, Modules, and Budget.  
  This makes it easier to use and also easier to expand in the future.

- **Separation of Features**  
  Each feature (tasks, deadlines, budget) works independently, which helps keep the system organised and easier to maintain.

## 5. Traceability to Requirements

All diagrams were based on the system requirements and were used to guide development.

For example:

- Account creation and login → shown in use case and sequence diagrams
- Task and deadline features → shown in activity and class diagrams
- Security features (password rules and reset) → shown in sequence diagrams

This helped make sure that what was designed is exactly what was implemented.

## 6. Evaluation of the Modelling Approach

Using these diagrams made it much easier to understand and plan the system before coding.  
They helped identify missing features and made complex processes clearer.

However, there were also some downsides:

- Some diagrams can become difficult to read if too much detail is added
- Keeping diagrams updated alongside the code can take extra time

Even with this, the modelling process helped create a more structured and organised system overall.

## 7. Summary

Overall, the system modelling played an important role in designing the Student Life Management System.  
It helped connect the requirements to the final implementation and made the development process more organised.

The diagrams provided a clear understanding of how the system works, both in terms of structure and behaviour.
