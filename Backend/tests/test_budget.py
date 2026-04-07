import pytest


# This test was created with assistance from Claude AI (Anthropic, 2026).
# Prompt:“What are the basics of creating a testing process for SDLC”
# The output was reviewed, modified, and tested by the Muiiz.
class TestTransactions:
    def test_add_transaction_success(self, budget_service):
        t = budget_service.add_transaction(
            user_id="user-123",
            category_id=1,
            amount=50.0,
            description="Food shop",
            transaction_date="2026-04-01",
        )
        assert t["amount"] == 50.0
        assert t["user_id"] == "user-123"
        assert t["category_id"] == 1

    def test_add_transaction_invalid_category_raises(self, budget_service):
        with pytest.raises(ValueError, match="Category not found"):
            budget_service.add_transaction(
                user_id="user-123",
                category_id=999,
                amount=50.0,
                description="Test",
                transaction_date="2026-04-01",
            )

    def test_add_transaction_negative_amount_raises(self, budget_service):
        with pytest.raises(ValueError):
            budget_service.add_transaction(
                user_id="user-123",
                category_id=1,
                amount=-10.0,
                description="Test",
                transaction_date="2026-04-01",
            )

    def test_add_transaction_invalid_date_raises(self, budget_service):
        with pytest.raises(ValueError, match="Invalid date format"):
            budget_service.add_transaction(
                user_id="user-123",
                category_id=1,
                amount=50.0,
                description="Test",
                transaction_date="01-04-2026",
            )

    def test_get_user_transactions_filters_by_user(self, budget_service):
        budget_service.add_transaction(
            user_id="user-A",
            category_id=1,
            amount=100.0,
            description="A's transaction",
            transaction_date="2026-04-01",
        )
        budget_service.add_transaction(
            user_id="user-B",
            category_id=1,
            amount=200.0,
            description="B's transaction",
            transaction_date="2026-04-01",
        )
        results = budget_service.get_user_transactions("user-A")
        assert len(results) == 1
        assert results[0]["description"] == "A's transaction"

    def test_delete_transaction(self, budget_service):
        t = budget_service.add_transaction(
            user_id="user-123",
            category_id=1,
            amount=50.0,
            description="To delete",
            transaction_date="2026-04-01",
        )
        budget_service.delete_transaction(t["id"], "user-123")
        results = budget_service.get_user_transactions("user-123")
        assert len(results) == 0

    def test_delete_transaction_wrong_user_raises(self, budget_service):
        t = budget_service.add_transaction(
            user_id="user-123",
            category_id=1,
            amount=50.0,
            description="Protected",
            transaction_date="2026-04-01",
        )
        with pytest.raises(ValueError, match="Transaction not found"):
            budget_service.delete_transaction(t["id"], "wrong-user")


class TestCategories:
    def test_categories_initialised_automatically(self, budget_service):
        cats = budget_service.get_all_categories()
        assert len(cats) == 16

    def test_filter_expense_categories(self, budget_service):
        cats = budget_service.get_all_categories(category_type="expense")
        assert all(c["type"] == "expense" for c in cats)
        assert len(cats) == 11

    def test_filter_income_categories(self, budget_service):
        cats = budget_service.get_all_categories(category_type="income")
        assert all(c["type"] == "income" for c in cats)
        assert len(cats) == 5
