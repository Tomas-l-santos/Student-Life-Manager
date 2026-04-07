from datetime import datetime


# This template was developed with assistance from Claude ai (Anthropic, 2025).
# Prompt:“Generate a class that stores information required for a timetable entry page”
# The output was reviewed, modified, and tested by the Muiiz.
class TimetableEntry:
    def __init__(
        self,
        id,
        user_id,
        module_name,
        location,
        entry_type,
        day,
        start_time,
        end_time,
        start_date=None,
        end_date=None,
        created_at=None,
    ):
        self.id = id
        self.user_id = user_id
        self.module_name = module_name
        self.location = location
        self.entry_type = entry_type  # "lecture", "lab", "seminar"
        self.day = day  # "Monday", "Tuesday", etc.
        self.start_time = start_time  # "09:00"
        self.end_time = end_time  # "11:00"
        self.start_date = start_date
        self.end_date = end_date
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "module_name": self.module_name,
            "location": self.location,
            "entry_type": self.entry_type,
            "day": self.day,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data):
        return TimetableEntry(
            id=data["id"],
            user_id=data["user_id"],
            module_name=data["module_name"],
            location=data["location"],
            entry_type=data["entry_type"],
            day=data["day"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            created_at=data.get("created_at"),
        )
