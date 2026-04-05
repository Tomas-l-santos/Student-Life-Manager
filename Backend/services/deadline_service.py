from datetime import datetime

from models.deadline import Deadline
from storage.storagerepo import JSONStorage


class DeadlineService:
    def __init__(self, storage_path="data/deadlines.json"):
        self.storage = JSONStorage(storage_path)

    def _generate_id(self):
        deadlines = self.storage.read_all()
        if not deadlines:
            return 1
        return max(d["id"] for d in deadlines) + 1

    def add_deadline(
        self,
        user_id,
        module_name,
        title,
        due_date,
        priority="normal",
        status="To-Do",
        notes="",
    ):
        if priority not in ("high", "normal", "low"):
            raise ValueError("Priority must be high, normal, or low")
        try:
            datetime.strptime(due_date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD")
        if not title.strip():
            raise ValueError("Title cannot be empty")
        deadline = Deadline(
            id=self._generate_id(),
            user_id=user_id,
            module_name=module_name,
            title=title.strip(),
            due_date=due_date,
            priority=priority,
            status=status,
            notes=notes,
        )
        self.storage.append(deadline.to_dict())
        return deadline.to_dict()

    def get_user_deadlines(self, user_id, completed=None):
        deadlines = self.storage.read_all()
        result = [d for d in deadlines if d["user_id"] == user_id]
        if completed is not None:
            result = [d for d in result if d["completed"] == completed]
        result.sort(key=lambda x: x["due_date"])
        return result

    def update_deadline(self, deadline_id, user_id, updates):
        deadlines = self.storage.read_all()
        for i, d in enumerate(deadlines):
            if d["id"] == deadline_id and d["user_id"] == user_id:
                if "title" in updates:
                    d["title"] = updates["title"].strip()
                if "module_name" in updates:
                    d["module_name"] = updates["module_name"]
                if "due_date" in updates:
                    try:
                        datetime.strptime(updates["due_date"], "%Y-%m-%d")
                    except ValueError:
                        raise ValueError("Invalid date format. Use YYYY-MM-DD")
                    d["due_date"] = updates["due_date"]
                if "priority" in updates:
                    if updates["priority"] not in ("high", "normal", "low"):
                        raise ValueError("Priority must be high, normal, or low")
                    d["priority"] = updates["priority"]
                if "completed" in updates:
                    d["completed"] = bool(updates["completed"])
                if "status" in updates:
                    d["status"] = updates["status"]
                if "notes" in updates:
                    d["notes"] = updates["notes"]
                deadlines[i] = d
                self.storage.overwrite(deadlines)
                return d
        raise ValueError("Deadline not found")

    def delete_deadline(self, deadline_id, user_id):
        deadlines = self.storage.read_all()
        filtered = [
            d
            for d in deadlines
            if not (d["id"] == deadline_id and d["user_id"] == user_id)
        ]
        if len(filtered) == len(deadlines):
            raise ValueError("Deadline not found")
        self.storage.overwrite(filtered)
        return True