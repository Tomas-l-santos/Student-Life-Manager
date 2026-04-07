# Features

- Budget tracking and expense management  
- Academic module and assessment tracking  
- UK grading system with grade calculations  
- Note-taking system organized by topics  
- User authentication and password management  

---

# Completed Features

## 1. Authentication System

- User registration with email validation  
- Login with JWT token authentication  
- Password validation (uppercase, lowercase, number, special char)  
- Password change functionality  
- Forgot password with 6-digit OTP  
- Email integration for password reset  
- Account lockout after 5 failed attempts  
- Birthdate collection during registration  

## 2. Budget Management

- Transaction creation (income/expense)  
- Category system (11 expense, 5 income categories)  
- Budget creation per category per month  
- Set budget status tracking (on track/warning/exceeded)  
- Transaction summary by month/year  
- Recurring transaction support  
- Category-based transaction filtering  

## 3. Academic Management - Modules

- Module creation with UK credit system (10, 15, 20, 30, 40, 60)  
- Module tracking by year and academic year  
- Module status (in progress, completed, dropped)  
- Duplicate module prevention per academic year  
- Module filtering by year/status  

## 4. Academic Management - Assessments

- Assessment creation with multiple types (exam, coursework, essay, project, etc.)  
- Automatic UK grade calculation  
- Weighted grade calculations  
- Assessment tracking with scores and weights  
- Date validation (YYYY-MM-DD format)  

## 5. Academic Management - Analytics

- Module grade calculation (weighted average)  
- UK grading system (1st, 2:1, 2:2, 3rd, Fail)  
- Degree classification system  
- Year overview with credit-weighted average  
- Progress tracking (total weight vs remaining weight)  
- Module summary generation  

## 6. Notes System

- Note creation for modules  
- Topic-based organization (user-defined topics)  
- Pin/unpin notes  
- Archive/unarchive notes  
- Tag support for categorization  
- Search functionality (title, content, topic, tags)  
- Topic list with note counts  
- Automatic cleanup when module deleted  

## 7. Data Storage

- JSON-based storage system  
- Thread-safe operations with Lock  
- Automatic file creation  
- CRUD operations for all models  

## 8. Models

- User model with UUID  
- Transaction model  
- Budget model  
- Category model  
- Module model  
- Assessment model  
- Note model  

---

# Must Have Features

## Backend

- Add environment variable loading (.env file)  
- Implement proper error logging  
- Implement proper CORS configuration  

## Data & Security

- Hash sensitive data at rest  
- Implement refresh tokens for JWT  
- Add session management  
- Create database migration from JSON to SQLite/PostgreSQL  
- Add data backup functionality  
- Implement data export (CSV/Excel)  

## Testing

- Write unit tests for all services  
- Write integration tests for routes  
- Add end-to-end testing  
- Create test data generators  
- Set up CI/CD pipeline  

---

# Should Have Features

## Budget Features

- Budget templates (preset budgets)  
- Budget alerts/notifications  
- Spending analytics and charts  
- Budget recommendations based on spending patterns  
- Receipt upload and OCR  
- Recurring transaction automation  
- Export budget reports (PDF/Excel)  

## Academic Features

- Grade calculator (UK system 1st, 2:1, 2:2, 3rd, Fail)  
- Predicted grade calculator  
- Module prerequisite tracking  
- Timetable/schedule management  
- Study time tracker  
- Assignment deadline reminders  
- Grade improvement suggestions  
- Academic goal setting and tracking  
- Transcript generation  
- Course comparison tool  

## Notes Features

- Rich text editor (markdown rendering)  
- Note sharing with other students  
- Note version history  
- File attachments (images, PDFs)  
- Voice notes  
- Drawing/sketch support  
- Collaborative notes (real-time editing)  
- Note templates  
- Export notes to PDF/Word  
- OCR for handwritten notes  

## User Management

- Profile picture upload  
- User preferences/settings  
- Email verification  
- Two-factor authentication (2FA)  
- Social login (Google, Microsoft)  
- Account deletion  
- Data privacy controls  
- Activity log/audit trail  

---

# Could Have

## Advanced Features

- Mobile app (React Native/Flutter)  
- Desktop app (Electron)  
- Dark mode  
- Multiple theme support  
- Accessibility features (screen reader support)  
- Internationalization (i18n) - multiple languages  
- Push notifications  
- Email notifications  
- SMS notifications  

## Social Features

- Friend system  
- Study groups  
- Budget groups (shared expenses)  
- Leaderboards (gamification)  
- Achievement badges  
- Study buddy matching  
- Anonymous Q&A forum  

## Analytics & Insights

- Spending trends visualization  
- Grade trends over time  
- Study pattern analysis  
- Personalized recommendations  
- Predictive analytics (future grades)  
- Budget vs actual comparison  
- Year-over-year comparisons  

## Integrations

- Bank account integration (Plaid API)  
- University LMS integration (Canvas, Moodle)  
- Calendar integration (Google Calendar, Outlook)  
- Cloud storage (Google Drive, Dropbox)  
- Payment apps (PayPal, Venmo)  
- Student discount platforms  

---

# Wont Have Features

- Cryptocurrency tracking  
- Investment portfolio management  
- Loan/debt management  
- Scholarship finder  
- Job board integration  
- Marketplace for student items  
- Housing/accommodation finder  
- Meal planning integration  