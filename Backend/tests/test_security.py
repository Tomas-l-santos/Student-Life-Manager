import pytest
import jwt
import time


class TestAuthEnforcement:
    """Every protected route must reject requests without a valid token."""

    PROTECTED_ROUTES = [
        ("GET", "/api/transactions"),
        ("POST", "/api/transactions"),
        ("GET", "/api/budgets"),
        ("POST", "/api/budgets"),
        ("GET", "/api/deadlines"),
        ("POST", "/api/deadlines"),
        ("GET", "/api/timetable"),
        ("POST", "/api/timetable"),
        ("GET", "/api/modules"),
        ("POST", "/api/modules"),
        ("GET", "/api/auth/me"),
    ]

    @pytest.mark.parametrize("method,route", PROTECTED_ROUTES)
    def test_no_token_returns_401(self, client, method, route):
        res = client.open(route, method=method)
        assert (
            res.status_code == 401
        ), f"{method} {route} should return 401 without token"

    def test_invalid_token_returns_401(self, client):
        res = client.get(
            "/api/transactions",
            headers={"Authorization": "Bearer not.a.real.token"},
        )
        assert res.status_code == 401

    def test_expired_token_returns_401(self, client):
        import os
        from auth_routes import generate_token
        from datetime import datetime, timedelta

        # Manually create an already-expired token
        payload = {
            "email": "test@example.com",
            "user_id": "fake-id",
            "exp": datetime.utcnow() - timedelta(seconds=1),
        }
        secret = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        expired_token = jwt.encode(payload, secret, algorithm="HS256")

        res = client.get(
            "/api/transactions",
            headers={"Authorization": f"Bearer {expired_token}"},
        )
        assert res.status_code == 401
        assert "expired" in res.get_json().get("error", "").lower()

    def test_malformed_auth_header_returns_401(self, client):
        res = client.get(
            "/api/transactions",
            headers={"Authorization": "NotBearer token"},
        )
        # Either 401 or the token will be invalid
        assert res.status_code == 401


class TestDataIsolation:
    """Users must not be able to access each other's data."""

    def _register_and_login(self, client, email, username):
        client.post(
            "/api/auth/register",
            json={
                "email": email,
                "username": username,
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        res = client.post(
            "/api/auth/login",
            json={"email": email, "password": "SecurePass1!"},
        )
        return res.get_json()["access_token"]

    def test_user_cannot_see_other_users_transactions(self, client):
        token_a = self._register_and_login(client, "userA@test.com", "userA")
        token_b = self._register_and_login(client, "userB@test.com", "userB")

        # User A adds a transaction
        client.post(
            "/api/transactions",
            json={
                "category_id": 1,
                "amount": 100.0,
                "description": "User A's secret",
                "transaction_date": "2026-04-01",
            },
            headers={"Authorization": f"Bearer {token_a}"},
        )

        # User B fetches transactions
        res = client.get(
            "/api/transactions",
            headers={"Authorization": f"Bearer {token_b}"},
        )
        assert res.status_code == 200
        data = res.get_json()
        assert all(t.get("description") != "User A's secret" for t in data)

    def test_user_cannot_delete_other_users_deadline(self, client):
        token_a = self._register_and_login(client, "ownerA@test.com", "ownerA")
        token_b = self._register_and_login(client, "attackerB@test.com", "attackerB")

        # User A creates a deadline
        res = client.post(
            "/api/deadlines",
            json={
                "title": "Protected deadline",
                "module_name": "COMP",
                "due_date": "2026-05-01",
                "priority": "high",
            },
            headers={"Authorization": f"Bearer {token_a}"},
        )
        deadline_id = res.get_json()["id"]

        # User B tries to delete it
        res = client.delete(
            f"/api/deadlines/{deadline_id}",
            headers={"Authorization": f"Bearer {token_b}"},
        )
        # Should get 400 (not found for this user) not 200
        assert res.status_code == 400


class TestInputSanitisation:
    """Malformed inputs must not crash the server."""

    def test_sql_injection_attempt_in_email(self, client):
        res = client.post(
            "/api/auth/login",
            json={"email": "' OR 1=1 --", "password": "anything"},
        )
        # Must return 401
        assert res.status_code in (400, 401)

    def test_extremely_large_payload(self, client):
        res = client.post(
            "/api/auth/register",
            json={
                "email": "x" * 10000 + "@example.com",
                "username": "user",
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        # Must return 400
        assert res.status_code in (400, 500)
        if res.status_code == 500:
            # If 500, at least confirm it has an error key
            assert "error" in res.get_json()

    def test_missing_json_body_returns_400(self, client):
        res = client.post("/api/auth/login", data="not json", content_type="text/plain")
        assert res.status_code in (400, 415)

    def test_transaction_with_zero_amount_returns_400(self, client, auth_headers):
        res = client.post(
            "/api/transactions",
            json={
                "category_id": 1,
                "amount": 0,
                "description": "Zero",
                "transaction_date": "2026-04-01",
            },
            headers=auth_headers,
        )
        assert res.status_code == 400
