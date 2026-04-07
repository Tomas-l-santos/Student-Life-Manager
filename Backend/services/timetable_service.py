from models.timetable_entry import TimetableEntry
from storage.storagerepo import JSONStorage

VALID_DAYS = (
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
)
VALID_TYPES = ("lecture", "lab", "seminar", "tutorial", "other")


# This template was developed with assistance from Claude ai (Anthropic, 2025).
# Prompt:“Generate a template that takes in entries to create timetables”
# The output was reviewed, modified, and tested by the Muiiz.
class TimetableService:
    def __init__(self, storage_path="data/timetable.json"):
        self.storage = JSONStorage(storage_path)

    def _generate_id(self):
        entries = self.storage.read_all()
        if not entries:
            return 1
        return max(e["id"] for e in entries) + 1

    def add_entry(
        self,
        user_id,
        module_name,
        location,
        entry_type,
        day,
        start_time,
        end_time,
        start_date=None,
        end_date=None,
    ):
        if day not in VALID_DAYS:
            raise ValueError(f"Day must be one of: {', '.join(VALID_DAYS)}")
        if entry_type not in VALID_TYPES:
            raise ValueError(f"Type must be one of: {', '.join(VALID_TYPES)}")
        if not module_name.strip():
            raise ValueError("Module name cannot be empty")

        entry = TimetableEntry(
            id=self._generate_id(),
            user_id=user_id,
            module_name=module_name.strip(),
            location=location.strip(),
            entry_type=entry_type,
            day=day,
            start_time=start_time,
            end_time=end_time,
            start_date=start_date,  # Added
            end_date=end_date,  # Added
        )
        self.storage.append(entry.to_dict())
        return entry.to_dict()

    def get_user_timetable(self, user_id, day=None):
        entries = self.storage.read_all()
        result = [e for e in entries if e["user_id"] == user_id]

        if day:
            result = [e for e in result if e["day"] == day]

        # Sort by day then start time
        day_order = {d: i for i, d in enumerate(VALID_DAYS)}
        result.sort(key=lambda x: (day_order.get(x["day"], 99), x["start_time"]))
        return result

    def update_entry(self, entry_id, user_id, updates):
        entries = self.storage.read_all()
        for i, e in enumerate(entries):
            if e["id"] == entry_id and e["user_id"] == user_id:
                if "module_name" in updates:
                    e["module_name"] = updates["module_name"].strip()
                if "location" in updates:
                    e["location"] = updates["location"].strip()
                if "entry_type" in updates:
                    if updates["entry_type"] not in VALID_TYPES:
                        raise ValueError(
                            f"Type must be one of: {', '.join(VALID_TYPES)}"
                        )
                    e["entry_type"] = updates["entry_type"]
                if "day" in updates:
                    if updates["day"] not in VALID_DAYS:
                        raise ValueError(f"Day must be one of: {', '.join(VALID_DAYS)}")
                    e["day"] = updates["day"]
                if "start_time" in updates:
                    e["start_time"] = updates["start_time"]
                if "end_time" in updates:
                    e["end_time"] = updates["end_time"]
                if "start_date" in updates:
                    e["start_date"] = updates["start_date"]
                if "end_date" in updates:
                    e["end_date"] = updates["end_date"]
                entries[i] = e
                self.storage.overwrite(entries)
                return e
        raise ValueError("Timetable entry not found")

    def delete_entry(self, entry_id, user_id):
        entries = self.storage.read_all()
        filtered = [
            e for e in entries if not (e["id"] == entry_id and e["user_id"] == user_id)
        ]
        if len(filtered) == len(entries):
            raise ValueError("Timetable entry not found")
        self.storage.overwrite(filtered)
        return True
