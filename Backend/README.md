# Backend

Flask REST API serving all data to the frontend

## Setup    
```bash
cd Backend
python -m venv myenv
myenv\Scripts\activate        # Windows
source myenv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python main.py
```

## Environment Variables
Create a `.env` file in the `Backend/` folder:
 - SECRET_KEY = your-secret-key
 - GMAIL_APP_PASSWORD = "your gmail app password"

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/forgot-password` | No | Send OTP email |
| POST | `/api/auth/reset-password` | No | Reset with OTP |
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
| GET | `/api/tasks` | Yes | Get tasks |
| POST | `/api/tasks` | Yes | Add task |
| PUT | `/api/tasks/<id>` | Yes | Update task |
| DELETE | `/api/tasks/<id>` | Yes | Delete task |
| GET | `/api/tasks/upcoming` | Yes | Tasks due within N days |
| GET | `/api/tasks/with-deadlines` | Yes | Tasks that have due dates |

## Project Structure
Backend/
data/              = JSON storage files
models/            = Data classes (User, Transaction, etc.)
services/          = Business logic layer
storage/           = JSONStorage abstraction
main.py            = Flask app + routes
requirements.txt
## Linting
```bash
flake8 .     # check style
black .      # auto-format
```