# Backend

Flask REST API serving all data to the frontend

## Setup    

```bash
cd Backend
python -m venv myenv
source myenv/Scripts/activate # Windows Git Bash
source myenv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python main.py
```

## Environment Variables

Create a `.env` file in the `Backend/` folder:
 - SECRET_KEY = your-secret-key
 - GMAIL_APP_PASSWORD = "your gmail app password"
 - EMAIL_USER = "your gmail"

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/forgot-password` | No | Send OTP email |
| POST | `/api/auth/reset-password` | No | Reset with OTP |
| POST | `/api/auth/change-password` | Yes | Change with OTP |
| DELETE | `/api/auth/delete-account` | YES | Delete account |
| GET | `/api/transactions` | Yes | Get user transactions |
| POST | `/api/transactions` | Yes | Add transaction |
| DELETE | `/api/transactions/<id>` | Yes | Delete transaction |
| GET | `/api/categories` | Yes | Get all categories |
| GET | `/api/budgets` | Yes | Get user budgets |
| POST | `/api/budgets` | Yes | Create budget |
| GET | `/api/budgets/status` | Yes | Get budget vs spending |
| GET | `/api/deadlines` | Yes | Get deadlines |
| POST | `/api/deadlines` | Yes | Add deadline |
| PUT | `/api/deadlines/<id>` | Yes | Update deadline |
| DELETE | `/api/deadlines/<id>` | Yes | Delete deadline |
| GET | `/api/timetable` | Yes | Get timetable entries |
| POST | `/api/timetable` | Yes | Add entry |
| PUT | `/api/timetable/<id>` | Yes | Update entry |
| DELETE | `/api/timetable/<id>` | Yes | Delete entry |

## Project Structure

```
Backend/                          # Flask REST API implementation and core business logic
├── README.md                    # Backend technical documentation and environment setup
├── data/                        # Persistent flat-file storage layer (JSON format)
│   ├── Transactions.json        # Stores all user financial income and expense records
│   ├── Users.json               # Persistent user credentials and profile metadata
│   ├── assessments.json         # Academic grading records and weightings
│   ├── budgets.json             # User-defined monthly category spending limits
│   ├── categories.json          # Static definition of expense and income types
│   ├── deadlines.json           # Primary store for all academic task deadlines
│   ├── modules.json             # Registry for academic course modules and credits
│   ├── notes.json               # Content for the distraction-free notebook feature
│   └── timetable.json           # Scheduled events and class occurrences
├── main.py                      # Application gateway and RESTful endpoint definitions
├── models/                      # Object-oriented schemas and data transfer objects
│   ├── Academics/               # Schema definitions for modules and grades
│   ├── Budget/                  # Data structures for financial transactions
│   ├── deadline.py              # Blueprint for academic deadline objects
│   ├── timetable_entry.py       # Blueprint for scheduling and duration logic
│   └── user.py                  # User entity model including secure UUID management
├── requirements.txt             # Python dependencies (Flask, JWT, bcrypt)
├── services/                    # Business logic layer isolating API from storage
│   ├── academics_service.py     # Grade weighting and module analytics
│   ├── auth_routes.py           # JWT-based secure endpoint controllers
│   ├── authorisation.py         # Authentication logic and password hashing
│   ├── budget_service.py        # Financial threshold logic and calculations
│   ├── deadline_service.py      # CRUD operations and sorting for tasks
│   ├── timetable_service.py     # Scheduling and recurrence logic
│   └── transaction_service.py   # Validation and management of cash flow
├── storage/                     # Infrastructure layer for I/O operations
│   └── storagerepo.py           # Thread-safe JSON handling with locking
└── tests/                       # Backend test suite
    ├── __init__.py
    ├── conftest.py
    ├── test_auth.py
    ├── test_budget.py
    ├── test_deadlines.py
    ├── test_performance.py
    ├── test_security.py
    └── test_timetable.py
```

## Linting

```bash
python -m flake8 .     # check style
python -m black .      # auto-format
```
