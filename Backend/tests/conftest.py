import pytest
import json
import os
import tempfile
import sys
from main import app as flask_app
from services.authorisation import AuthService
from services.budget_service import BudgetService
from services.deadline_service import DeadlineService
from services.timetable_service import TimetableService

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmpdir:
        yield tmpdir


@pytest.fixture
def auth_service(temp_dir):
    path = os.path.join(temp_dir, "users.json")
    with open(path, "w") as f:
        json.dump([], f)
    return AuthService(storage_path=path)


@pytest.fixture
def budget_service(temp_dir):
    return BudgetService(
        transactions_path=os.path.join(temp_dir, "transactions.json"),
        budgets_path=os.path.join(temp_dir, "budgets.json"),
        categories_path=os.path.join(temp_dir, "categories.json"),
    )


@pytest.fixture
def deadline_service(temp_dir):
    path = os.path.join(temp_dir, "deadlines.json")
    with open(path, "w") as f:
        json.dump([], f)
    return DeadlineService(storage_path=path)


@pytest.fixture
def timetable_service(temp_dir):
    path = os.path.join(temp_dir, "timetable.json")
    with open(path, "w") as f:
        json.dump([], f)
    return TimetableService(storage_path=path)


@pytest.fixture
def app(temp_dir):
    flask_app.config["TESTING"] = True
    flask_app.config["DATA_DIR"] = temp_dir
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def registered_user(auth_service):
    return auth_service.register_user(
        email="test@example.com",
        username="testuser",
        password="SecurePass1!",
        birthdate="2000-01-01",
    )


@pytest.fixture
def auth_token(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "SecurePass1!",
            "birthdate": "2000-01-01",
        },
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "SecurePass1!"},
    )
    return res.get_json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    """Authorization headers for authenticated requests."""
    return {"Authorization": f"Bearer {auth_token}"}
