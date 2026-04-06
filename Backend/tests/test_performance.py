import pytest
import time
import threading
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


class TestResponseTime:
    """NFR-5: Key operations complete in acceptable time."""

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


class TestConcurrentRequests:
    """Test that JSONStorage's thread lock prevents data corruption under load."""

    def test_concurrent_transaction_writes_no_data_loss(self, client, auth_headers):
        """
        100 threads each add one transaction simultaneously.
        All 100 must be persisted — no writes lost to race conditions.
        """
        errors = []
        results = []

        def add_transaction(i):
            try:
                res = client.post(
                    "/api/transactions",
                    json={
                        "category_id": 1,
                        "amount": float(i + 1),
                        "description": f"Concurrent {i}",
                        "transaction_date": "2026-04-01",
                    },
                    headers=auth_headers,
                )
                results.append(res.status_code)
            except Exception as e:
                errors.append(str(e))

        threads = [
            threading.Thread(target=add_transaction, args=(i,)) for i in range(50)
        ]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        assert len(errors) == 0, f"Errors during concurrent writes: {errors}"
        assert all(s == 201 for s in results), f"Not all writes succeeded: {results}"

        # Verify all 50 were saved
        res = client.get("/api/transactions", headers=auth_headers)
        transactions = res.get_json()
        assert (
            len(transactions) == 50
        ), f"Expected 50 transactions, got {len(transactions)}"

    def test_concurrent_reads_do_not_error(self, client, auth_headers):
        """Multiple simultaneous reads must all succeed."""
        errors = []

        def read_transactions():
            try:
                res = client.get("/api/transactions", headers=auth_headers)
                if res.status_code != 200:
                    errors.append(res.status_code)
            except Exception as e:
                errors.append(str(e))

        threads = [threading.Thread(target=read_transactions) for _ in range(20)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        assert len(errors) == 0, f"Errors during concurrent reads: {errors}"
