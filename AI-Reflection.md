# AI Reflection & Critical Evaluation

## Formal Declaration

The development team utilized Large Language Models (LLMs) specifically Google Gemini, OpenAI ChatGPT, and Anthropic Claude as collaborative assistants during the creation of the Student Life Management (SLM) system. These models provided support across the following areas:

- Foundational Coding: Generating initial code structures and handling repetitive scripting tasks for both frontend and backend modules.

- Technical Consulting: Acting as a virtual consultant to explain complex software concepts and suggest industry-standard best practices.

- System Design: Brainstorming UI/UX layouts and providing help for technical documentation.

- Debugging: Finding and fixing errors by understanding system messages, especially when parts of the app fail to connect or work together properly.

The team carefully checked and tested all AI suggestions to make sure they were correct and secure. This ensured the final system was built with human judgment, supported by AI.

## 1 Methodology & Group Workflow

### Collaborative Integration

The team of four was divided into two functional pairs: Frontend (React/TypeScript) and Backend (Python/Flask). AI was used in a coordinated manner to ensure consistency between system components:

- Shared Data Contracts: Before implementation, both teams used AI to help define request/response formats (e.g., the JSON structure for Tasks and Modules). This ensured that AI-generated UI logic matched the expected backend outputs.

- Prompt Alignment: Prompts were discussed before use to ensure both pairs were working toward the same architectural standards (e.g., using UUIDs instead of simple integers).

- Integration Testing: Version control (GitHub) was used to identify mismatches early. If a frontend fetch request failed, AI was used to compare the frontend code with the backend route to find the discrepancy.

### Iterative Prompting Strategy

- Initial Discovery: AI was used to explore high-level architecture. We prompted with broad questions like “How should a student management be structured using React and Flask?” to understand layered architecture.

- Refinement: Prompts became constrained as requirements were defined. For example: “Create a Python service for handling transactions using JSON storage with strong validation logic.” This allowed us to align AI outputs with our specific Functional Requirements.

- Debugging: We provided AI with specific Python tracebacks and browser console errors. Rather than blindly applying fixes, we asked the AI to “Explain the root cause of this CORS error,” allowing the team to understand the fix before implementation.

## 1.2 Backend Critical Evaluation (Team: [Names])

## 1.3 Frontend Critical Evaluation (Team: [Names])

## 1.4 Comparative Analysis Table

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

## 1.5 Professional & Ethical Reflection

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

## 1.6 Conclusion on AI in the SDLC
