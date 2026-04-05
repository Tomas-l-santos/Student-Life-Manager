from datetime import datetime


class Deadline:
    def __init__(
        self,
        id,
        user_id,
        module_name,
        title,
        due_date,
        priority="normal",
        completed=False,
        status="To-Do",
        notes="",
        created_at=None,
    ):
        self.id = id
        self.user_id = user_id
        self.module_name = module_name
        self.title = title
        self.due_date = due_date  # "YYYY-MM-DD"
        self.priority = priority  # "high", "normal", "low"
        self.completed = completed
        self.status = status
        self.notes = notes
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "module_name": self.module_name,
            "title": self.title,
            "due_date": self.due_date,
            "priority": self.priority,
            "completed": self.completed,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data):
        return Deadline(
            id=data["id"],
            user_id=data["user_id"],
            module_name=data["module_name"],
            title=data["title"],
            due_date=data["due_date"],
            priority=data.get("priority", "normal"),
            completed=data.get("completed", False),
            status=data.get("status", "To-Do"),
            notes=data.get("notes", ""),
            created_at=data.get("created_at"),
        )