from datetime import datetime


class Budget:
    def __init__(self, id, user_id, category_id, amount, month, year, created_at=None):
        self.id = id
        self.user_id = user_id
        self.category_id = category_id
        self.amount = amount
        self.month = month  # Number of the month (1-12)
        self.year = year
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "amount": self.amount,
            "month": self.month,
            "year": self.year,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data):
        return Budget(
            id=data["id"],
            user_id=data["user_id"],
            category_id=data["category_id"],
            amount=data["amount"],
            month=data["month"],
            year=data["year"],
            created_at=data.get("created_at"),
        )
