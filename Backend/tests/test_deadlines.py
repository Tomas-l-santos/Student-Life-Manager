import pytest


class TestDeadlineService:
    """FR-7: Deadline CRUD."""

    def test_add_deadline_success(self, deadline_service):
        d = deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP1234",
            title="Submit report",
            due_date="2026-05-01",
            priority="high",
        )
        assert d["title"] == "Submit report"
        assert d["priority"] == "high"
        assert d["status"] == "To-Do"
        assert d["completed"] is False

    def test_add_deadline_invalid_priority_raises(self, deadline_service):
        with pytest.raises(ValueError, match="Priority must be high, normal, or low"):
            deadline_service.add_deadline(
                user_id="user-123",
                module_name="COMP1234",
                title="Test",
                due_date="2026-05-01",
                priority="urgent",
            )

    def test_add_deadline_invalid_date_raises(self, deadline_service):
        with pytest.raises(ValueError, match="Invalid date format"):
            deadline_service.add_deadline(
                user_id="user-123",
                module_name="COMP1234",
                title="Test",
                due_date="01/05/2026",
                priority="high",
            )

    def test_add_deadline_empty_title_raises(self, deadline_service):
        with pytest.raises(ValueError, match="Title cannot be empty"):
            deadline_service.add_deadline(
                user_id="user-123",
                module_name="COMP1234",
                title="   ",
                due_date="2026-05-01",
                priority="high",
            )

    def test_get_deadlines_filters_by_user(self, deadline_service):
        deadline_service.add_deadline(
            user_id="user-A",
            module_name="COMP1234",
            title="A's deadline",
            due_date="2026-05-01",
            priority="high",
        )
        deadline_service.add_deadline(
            user_id="user-B",
            module_name="COMP1234",
            title="B's deadline",
            due_date="2026-05-01",
            priority="low",
        )
        results = deadline_service.get_user_deadlines("user-A")
        assert len(results) == 1
        assert results[0]["title"] == "A's deadline"

    def test_deadlines_sorted_by_due_date(self, deadline_service):
        deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP",
            title="Later",
            due_date="2026-06-01",
            priority="low",
        )
        deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP",
            title="Sooner",
            due_date="2026-04-15",
            priority="high",
        )
        results = deadline_service.get_user_deadlines("user-123")
        assert results[0]["title"] == "Sooner"

    def test_update_deadline_status(self, deadline_service):
        d = deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP1234",
            title="Test",
            due_date="2026-05-01",
            priority="normal",
        )
        updated = deadline_service.update_deadline(
            d["id"], "user-123", {"status": "In Progress"}
        )
        assert updated["status"] == "In Progress"

    def test_mark_deadline_complete(self, deadline_service):
        d = deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP1234",
            title="Test",
            due_date="2026-05-01",
            priority="normal",
        )
        updated = deadline_service.update_deadline(
            d["id"], "user-123", {"completed": True}
        )
        assert updated["completed"] is True

    def test_delete_deadline(self, deadline_service):
        d = deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP1234",
            title="To delete",
            due_date="2026-05-01",
            priority="normal",
        )
        deadline_service.delete_deadline(d["id"], "user-123")
        results = deadline_service.get_user_deadlines("user-123")
        assert len(results) == 0

    def test_delete_deadline_wrong_user_raises(self, deadline_service):
        d = deadline_service.add_deadline(
            user_id="user-123",
            module_name="COMP1234",
            title="Protected",
            due_date="2026-05-01",
            priority="normal",
        )
        with pytest.raises(ValueError, match="Deadline not found"):
            deadline_service.delete_deadline(d["id"], "wrong-user")
