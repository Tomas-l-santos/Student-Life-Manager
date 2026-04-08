# AI Reflection & Critical Evaluation

## Formal Declaration

The development team utilized Large Language Models (LLMs) specifically Google Gemini, OpenAI ChatGPT, and Anthropic Claude as collaborative assistants during the creation of the Student Life Management (SLM) system. These models provided support across the following areas:

- Foundational Coding: Generating initial code structures and handling repetitive scripting tasks for both frontend and backend modules.

- Technical Consulting: Acting as a virtual consultant to explain complex software concepts and suggest industry-standard best practices.

- System Design: Brainstorming UI/UX layouts and providing help for technical documentation.

- Debugging: Finding and fixing errors by understanding system messages, especially when parts of the app fail to connect or work together properly.

The team carefully checked and tested all AI suggestions to make sure they were correct and secure. This ensured the final system was built with human judgment, supported by AI.

## Methodology & Group Workflow

### Collaborative Integration

The team of four was divided into two functional pairs: Frontend (React/TypeScript) and Backend (Python/Flask). AI was used in a coordinated manner to ensure consistency between system components:

- Shared Data Contracts: Before implementation, both teams used AI to help define request/response formats (e.g., the JSON structure for Tasks and Modules). This ensured that AI-generated UI logic matched the expected backend outputs.

- Prompt Alignment: Prompts were discussed before use to ensure both pairs were working toward the same architectural standards (e.g., using UUIDs instead of simple integers).

- Integration Testing: Version control (GitHub) was used to identify mismatches early. If a frontend fetch request failed, AI was used to compare the frontend code with the backend route to find the discrepancy.

### Iterative Prompting Strategy

- Initial Discovery: AI was used to explore high-level architecture. We prompted with broad questions like “How should a student management be structured using React and Flask?” to understand layered architecture.

- Refinement: Prompts became constrained as requirements were defined. For example: “Create a Python service for handling transactions using JSON storage with strong validation logic.” This allowed us to align AI outputs with our specific Functional Requirements.

- Debugging: We provided AI with specific Python tracebacks and browser console errors. Rather than blindly applying fixes, we asked the AI to “Explain the root cause of this CORS error,” allowing the team to understand the fix before implementation.

## Backend Critical Evaluation (Team: [Muiiz Ayodele, Amr Assaf])

In Backend development, AI were most valuable in generating templates and structure as well as explaining library APIs and security designs. However, AI often extended past what was necessary, often to the detriment of the entire code. It was also unreliable at times where errors could not be found in a code block but was rather a result of foreign code.

### CI Pipeline Development - Muiiz Ayodele

- Prompt Desing and AI Suggestion: AI was prompted to generate a GitHub Actions CI pipeline for the project, inclusing steps for installation, linting, and formatting. The AI suggested a linear pipeline frontend and backend tests were executed sequentially all within a single job. Furthermore, the AI gave a static list of files to be checked for syntax.

- Evaluation: While functional the AI-generated pipeline lacked optimization and separation of concerns. Running checks sequentially increased feedback time. Additionally, formatting was enforced after linting which meant that any error that could be solved through formatting would fail before that stage. Lastly, the files all had to be manually added for the linting process which made it easier to miss one accidentally.

- Engineering Override: The pipeline was restructured to two parallel jobs for frontend and backend. Linting was placed after formatting checks with Black in the backend stage. All relevant files were automatically gathered and compiled before the linting stage through py_compile

- Learnings: AI provides a solid baseline but lacks awareness of CI efficiency and developer experience. Engineering judgment is often required to optimize execution order, introduce parallelism, and reduce runtime costs.

### Architecture - Muiiz Ayodele

- Prompt Desing and AI Suggestion: AI produced Flask applications where route handlers contained inline file I/O, business logic, and validation all within a single function.

- Evaluation: While functional for small prototypes, this approach made code difficult to maintain, test, and extend. It showed poor OOP and would have required more work from all members of the project.

- Engineering Override: The architecture was refactored into a strict three layer structure where the routes would handle request parsing and response formatting only, the services would contain all business logic, validation, and computation, and storage would handle file I/O with consistent methods.

- Learnings: AI code often prioritised simplicity and short term progress over long term ease of maintainability. The layered architecture enabled easier error spotting which was critical to a project developed by multiple people.

### Data Persistence - Muiiz Ayodele

- Prompt Desing and AI Suggestion: AI generated implementations for persistence relied on basic file handling, using direct open and write calls embedded within functions, often assumming single threaded execution model.

- Evaluation: This approach introduced a critical risk, spotted during testing, or race conditions under concurrent requests. Multiple requests could read and overwrite files simultaneously, leading to data loss.

- Engineering Override: a threading.Lock was introduced to enforce atomic read/write operations. The lock is acquired before any file access and only released after operation completion.

- Learnings: AI overlooks concurrency and real world problems, especially when suggesting persistence strategies.

## Frontend Critical Evaluation (Team: [Abhishil Sinoj, Tomas Santos])

Frontend development required balancing fast AI-generated code with the performance and data accuracy needs of a React 19 application. While AI helped generate initial components, additional engineering was needed to turn the system from a basic prototype into a reliable, production-ready student management tool.

---

**_Abhishil Sinoj_**

The following instances represent specific engineering decisions where AI-generated suggestions were critically evaluated and modified to meet the system's performance, security, and functional need

### Architectural Resilience in Data Aggregation (dashboard.tsx)

- Prompt Design & AI Suggestion: The LLM was prompted to create a data-loading function for fetching timetable, deadline, and budget data.The AI suggested a series of sequential await calls.

- Evaluation: Sequential fetching introduced a blocking bottleneck. A delay in one request (e.g., timetable data) would prevent other data (eg., budget information) from rendering, violating NFR-5 (Performance) for a responsive Single Page Application

- Engineering Override: The sequential logic was replaced with a Promise.allSettled() architecture to enable concurrent API execution.

- Learnings: This demonstrates that AI-generated solutions often prioritize simplicity over resilience. A concurrent-first design approach ensures partial UI functionality during service delays or outages, reflecting sound engineering judgement.

### Network Optimization & Rate Limiting (tasks.tsx)

- Prompt Design & AI Suggestion: The AI was assked to "make the notebook notes auto-save as the user types." The AI suggested attaching a backend PUT request directly to the onChange event.

- Evaluation: This approach created a network spam anti-pattern, where each keystroke triggered an API call, potentially overwhelming the backend with redundant requests.

- Engineering Override: A 1000ms debounce function using setTimeout was implemented to buffer input, ensuring synchronization occurs only after user inactivity.

- Learnings: AI logic is often stateless and ignores the cost of network overhead. This reinforced the importance of implementing rate-limiting logic at the source of user input to ensure industry readiness.

### Spatial Mathematical Logic in UI Rendering (timetable.tsx)

- Prompt Design & AI Suggestion: A prompt requested a weekly timetable view using CSS Grid. The AI generated a layout where all class blocks had identical heights.

- Evaluation: This failed functional requirement UR-3, as it prevented visual differentiation between sessions of varying durations (e.g., 1-hour vs 3-hour classes). The solution lacked proper mapping of temporal data to spatial representation

- Engineering Override: A dynamic pixel-per-minute algorithm was implemented to calculate element height and vertical positioning based on timestamps.

- Learnings: While AI performs well in visual styling, it is less effective in handling visual mathematical transformations. Complex data visualizations require deliberate algorithmic design.

### Domain-Specific Accuracy in Academic Analytics (modules.tsx)

- Prompt Design & AI Suggestion: A prompt requested a grade calculation function for university modules. The AI suggested a simple arithmetic mean.

- Evaluation: This was academically incorrect for the UK higher education context as it ignored assessment weightings. Relying on this would have misled students regarding their actual degree classification, failing SR-3.3.

- Engineering Override: A weighted contribution engine was implemented, calculating results using the formula,to produce an accurate weighted average aligned with classification thresholds.
  - (score/max)× weight = max score

- Learnings : AI lacks contextual domain awareness and defaults to simplified models. Systems requiring domain-specific accuracy must rely on explicitly defined formulas rather than inferred logic.

### Centralized Security Architecture (App.tsx & api.ts)

- Prompt Design & AI Suggestion: The AI initially suggested checking for a login token inside every individual component that needed protection

- Critical Evaluation: This resulted in a fragmented and unmaintainable security model, increasing the risk of unprotected routes and violating NFR-1 (Security).

- Engineering Override: A centralized Higher-Order Component (HOC) pattern was implemented using a "PrivateRoute" wrapper to secure all dashboard routes consistently.

- Learnings: Centralized security architecture improves maintainability and reduces risk. AI can assist with implementation details, but architectural decisions must enforce modular and scalable design principles.

## Comparative Analysis Table

The table below shows how AI suggestions were compared with final human decisions, highlighting how each was reviewed to ensure the system is secure, reliable, and well-structured.

| Technical Domain        | AI Suggested Approach                                                                       | Human Engineering Override                                                                                 | Rationale & Justification                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication Strategy | Simple session-based cookies or basic boolean login returns.                                | Implemented a JWT (JSON Web Token) architecture with a structured User object return including a UUID.     | Ensures stateless scalability and allows the frontend to securely identify user-specific data across various dashboard modules.        |
| Security & Hashing      | Storing passwords in plain text or using outdated sha256 hashing.                           | Integrated bcrypt with salt-rounds in authorisation.py.                                                    | Complies with NFR-1 and modern security standards to prevent rainbow table attacks.                                                    |
| Login Protection        | Infinite login attempts allowed by default.                                                 | Developed a Temporal Lockout Gate monitoring failed_attempts within a 300s window.                         | Directly addresses NFR-2, mitigating brute-force risks while ensuring user access is restored automatically after a cooling period.    |
| Password Validation     | Basic string length check (password.length >= 8) on the frontend signup form.               | Implemented Strict Regex Validation requiring uppercase, lowercase, numbers, and special characters.       | Enforces strong security compliance at the registration gateway before payload data ever reaches the Flask backend.                    |
| Backend Architecture    | Monolithic route files containing all file I/O and business logic.                          | Refactored into a Service-Oriented Architecture (SOA) with a dedicated storagerepo.py.                     | Decouples business logic from storage, satisfies NFR-4, and allows future migration to a SQL database without rewriting services.      |
| Data Persistence        | Direct open().write() calls within endpoint functions.                                      | Implemented a Thread-safe JSONStorage class with Lock() management.                                        | Prevents race conditions and data corruption when multiple API requests attempt to write to the JSON files simultaneously.             |
| Legacy Data Handling    | Direct dictionary key access for relational mapping (e.g., strict item["user_id"] lookups). | Refactored all backend Python models to use Safe .get("user_id") extraction methods.                       | Prevents fatal KeyError crashes when parsing older, legacy JSON data created before the UUID update, ensuring backwards compatibility. |
| API Data Aggregation    | Sequential, blocking fetch requests for each dashboard widget's data.                       | Implemented Promise.allSettled() for parallel, non-blocking execution in dashboard.tsx.                    | Ensures the dashboard loads faster and remains partially functional even if one specific endpoint fails, improving system resilience.  |
| Auto-Save Performance   | Triggering a database PUT request on every single onChange keystroke event.                 | Engineered a 1000ms Debounce Function using setTimeout and clearTimeout.                                   | Prevents severe API spam and server bottlenecking while ensuring notes are saved safely in the background during active typing.        |
| Financial Calculations  | Basic arithmetic without category context or rounding logic.                                | Created a Threshold Logic Engine in budget_service.py to calculate percentage_used.                        | Enables reactive UI alerts (Amber/Red) at 80% and 100% marks, satisfying SR-2.7 and enhancing student financial awareness.             |
| Academic Analytics      | Simplified mean average calculation (Total/Count).                                          | Built a Weighted Contribution Algorithm (MaxScore × Weight) mapped to UK classifications.                  | Provides academic accuracy required for SR-3.3 and SR-3.4, correctly identifying First Class (70%+) and 2:1 trajectories.              |
| Stress Level Algorithm  | A basic boolean check or simple count of overdue tasks to determine user stress.            | Designed a Weighted Heuristic Algorithm factoring in overdue (×45), due soon (×25), and active tasks (×5). | Provides a nuanced, mathematically sound, and psychologically accurate "Workload Stress" indicator for students.                       |
| Timetable Rendering     | Static grid alignment or basic CSS flexbox gaps for scheduling blocks.                      | Developed a Dynamic Pixel-per-minute mapping for CSS absolute top and height properties.                   | Ensures that varying lecture durations are visually distinct and mathematically accurate relative to the true time of day.             |
| Multi-Condition Sorting | Basic alphabetical or single-parameter chronological array sorting for deadlines.           | Created a Weighted Heuristic Mapper (High=3, Normal=2, Low=1) paired with completion status.               | Ensures critical tasks organically float to the top of the user's view, improving academic triage efficiency.                          |
| UI State Management     | Simple list views for task management.                                                      | Implemented a Multi-column Kanban State Machine with a "Done" status toggle.                               | Improves productivity visualization as per UR-4, allowing for better lifecycle management of academic tasks.                           |
| System Theming          | Hardcoded HEX values or a single "Dark Mode" toggle.                                        | Engineered a Dynamic Theme Engine using CSS Custom Properties and data-theme attributes.                   | Addresses NFR-9, providing a customizable user experience (Classic, Light, Dark) for different lighting environments.                  |
| Code Integrity          | Unstructured JavaScript with minimal error checking.                                        | Implemented TypeScript (TSX) with strict interface definitions for all data models.                        | Reduces runtime errors and ensures that both pairs adhered to the agreed-upon Data Contracts.                                          |

## Professional & Ethical Reflection

### Data Security & Privacy Protocols

The team followed strict procedures to protect the integrity of the project:

- Credential Protection: Sensitive data, such as SMTP passwords and JWT secret keys, was never shared with LLMs. We used .env templates to keep these secrets local.

- Data Anonymization: During debugging, real user data was replaced with placeholders (e.g., test@test.com) before being shared with the AI.

- Logic Auditing: All AI-generated code was reviewed to ensure no insecure default settings or "telemetry" scripts were included.

### Technical Limitations & Bias

While the AI was helpful, it had limitations that required human oversight:

- Generic Output: The AI often produced basic, one-size-fits-all code that didn’t meet our security standards (e.g., missing brute-force protection). We addressed this by specifying clear requirements and constraints.

- Outdated Suggestions: The AI occasionally recommended old syntax or non-existent features for libraries like Vite 8 or Recharts. We checked official documentation and tested the code manually to ensure it was up to date.

- Context Limitations: For larger, multi-file projects, the AI sometimes suggested changes that conflicted with existing code. We mitigated this by providing smaller, well-defined code sections and clearly specifying component interfaces

## Conclusion on AI in the SDLC

The development of the SLM system demonstrates a clear example of modern AI-augmented engineering. Throughout the software development lifecycle, tools such as Gemini, ChatGPT, and Claude significantly accelerated tasks like generating boilerplate code and handling syntax. However, they lacked the contextual understanding needed to produce fully reliable, production-ready systems.

A recurring issue was the “perfect prototype” trap, where AI-generated solutions worked in isolation but failed in real-world, multi-user environments. Without human oversight, the system would have faced serious problems, including race conditions in data handling, network congestion due to excessive API calls, and errors in grade calculations.

This highlights that while AI can greatly enhance development speed, human expertise remains essential to ensure accuracy, reliability, and robustness.
