import time
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


# This test was created with assistance from Claude AI (Anthropic, 2026).
# Prompt:“What are the basics of creating a testing process for SDLC”
# The output was reviewed, modified, and tested by the Muiiz.
class TestResponseTime:
    def test_login_completes_under_2_seconds(self, client):
        client.post(
            "/api/auth/register",
            json={
                "email": "perf@example.com",
                "username": "perfuser",
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        start = time.time()
        res = client.post(
            "/api/auth/login",
            json={"email": "perf@example.com", "password": "SecurePass1!"},
        )
        elapsed = time.time() - start

        assert res.status_code == 200
        assert elapsed < 2.0, f"Login took {elapsed:.2f}s — exceeds 2s threshold"

    def test_get_transactions_completes_under_1_second(self, client, auth_headers):
        # Add 50 transactions first
        for i in range(50):
            client.post(
                "/api/transactions",
                json={
                    "category_id": 1,
                    "amount": float(i + 1),
                    "description": f"Transaction {i}",
                    "transaction_date": "2026-04-01",
                },
                headers=auth_headers,
            )

        start = time.time()
        res = client.get("/api/transactions", headers=auth_headers)
        elapsed = time.time() - start

        assert res.status_code == 200
        assert elapsed < 1.0, f"GET /transactions took {elapsed:.2f}s with 50 records"

    def test_get_deadlines_completes_under_1_second(self, client, auth_headers):
        for i in range(20):
            client.post(
                "/api/deadlines",
                json={
                    "title": f"Deadline {i}",
                    "module_name": "COMP1234",
                    "due_date": "2026-05-01",
                    "priority": "normal",
                },
                headers=auth_headers,
            )

        start = time.time()
        res = client.get("/api/deadlines", headers=auth_headers)
        elapsed = time.time() - start

        assert res.status_code == 200
        assert elapsed < 1.0, f"GET /deadlines took {elapsed:.2f}s with 20 records"

    def test_registration_completes_under_3_seconds(self, client):
        start = time.time()
        res = client.post(
            "/api/auth/register",
            json={
                "email": "timing@example.com",
                "username": "timinguser",
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        elapsed = time.time() - start

        assert res.status_code == 201
        assert elapsed < 3.0, f"Registration took {elapsed:.2f}s — exceeds 3s threshold"
