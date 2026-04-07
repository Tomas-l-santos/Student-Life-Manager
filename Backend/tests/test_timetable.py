import pytest


# This test was created with assistance from Claude AI (Anthropic, 2026).
# Prompt:“What are the basics of creating a testing process for SDLC”
# The output was reviewed, modified, and tested by the Muiiz.
class TestTimetableService:
    """FR-6: Timetable entry management."""

    def test_add_entry_success(self, timetable_service):
        e = timetable_service.add_entry(
            user_id="user-123",
            module_name="Software Engineering",
            location="Room 401",
            entry_type="lecture",
            day="Monday",
            start_time="09:00",
            end_time="11:00",
        )
        assert e["module_name"] == "Software Engineering"
        assert e["day"] == "Monday"
        assert e["entry_type"] == "lecture"

    def test_add_entry_invalid_day_raises(self, timetable_service):
        with pytest.raises(ValueError, match="Day must be one of"):
            timetable_service.add_entry(
                user_id="user-123",
                module_name="Test",
                location="Room 1",
                entry_type="lecture",
                day="Funday",
                start_time="09:00",
                end_time="10:00",
            )

    def test_add_entry_invalid_type_raises(self, timetable_service):
        with pytest.raises(ValueError, match="Type must be one of"):
            timetable_service.add_entry(
                user_id="user-123",
                module_name="Test",
                location="Room 1",
                entry_type="exam",
                day="Monday",
                start_time="09:00",
                end_time="10:00",
            )

    def test_add_entry_empty_module_name_raises(self, timetable_service):
        with pytest.raises(ValueError, match="Module name cannot be empty"):
            timetable_service.add_entry(
                user_id="user-123",
                module_name="   ",
                location="Room 1",
                entry_type="lecture",
                day="Monday",
                start_time="09:00",
                end_time="10:00",
            )

    def test_get_timetable_filters_by_user(self, timetable_service):
        timetable_service.add_entry(
            user_id="user-A",
            module_name="Module A",
            location="Room 1",
            entry_type="lecture",
            day="Monday",
            start_time="09:00",
            end_time="10:00",
        )
        timetable_service.add_entry(
            user_id="user-B",
            module_name="Module B",
            location="Room 2",
            entry_type="lab",
            day="Tuesday",
            start_time="10:00",
            end_time="12:00",
        )
        results = timetable_service.get_user_timetable("user-A")
        assert len(results) == 1
        assert results[0]["module_name"] == "Module A"

    def test_get_timetable_sorted_by_day_and_time(self, timetable_service):
        timetable_service.add_entry(
            user_id="user-123",
            module_name="Wednesday Module",
            location="Room 1",
            entry_type="lecture",
            day="Wednesday",
            start_time="09:00",
            end_time="10:00",
        )
        timetable_service.add_entry(
            user_id="user-123",
            module_name="Monday Module",
            location="Room 2",
            entry_type="lab",
            day="Monday",
            start_time="14:00",
            end_time="16:00",
        )
        results = timetable_service.get_user_timetable("user-123")
        assert results[0]["day"] == "Monday"
        assert results[1]["day"] == "Wednesday"

    def test_delete_entry(self, timetable_service):
        e = timetable_service.add_entry(
            user_id="user-123",
            module_name="To delete",
            location="Room 1",
            entry_type="lecture",
            day="Friday",
            start_time="09:00",
            end_time="10:00",
        )
        timetable_service.delete_entry(e["id"], "user-123")
        results = timetable_service.get_user_timetable("user-123")
        assert len(results) == 0

    def test_filter_by_day(self, timetable_service):
        timetable_service.add_entry(
            user_id="user-123",
            module_name="Monday Module",
            location="Room 1",
            entry_type="lecture",
            day="Monday",
            start_time="09:00",
            end_time="10:00",
        )
        timetable_service.add_entry(
            user_id="user-123",
            module_name="Friday Module",
            location="Room 2",
            entry_type="lab",
            day="Friday",
            start_time="10:00",
            end_time="12:00",
        )
        results = timetable_service.get_user_timetable("user-123", day="Monday")
        assert len(results) == 1
        assert results[0]["module_name"] == "Monday Module"
