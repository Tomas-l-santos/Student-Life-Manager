from datetime import datetime


class Transaction:
    def __init__(
        self,
        id,
        user_id,
        category_id,
        amount,
        description,
        transaction_date,
        is_recurring=False,
        created_at=None,
    ):

        self.id = id
        self.user_id = user_id
        self.category_id = category_id
        self.amount = amount
        self.description = description
        self.transaction_date = transaction_date
        self.is_recurring = is_recurring
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "amount": self.amount,
            "description": self.description,
            "transaction_date": self.transaction_date,
            "is_recurring": self.is_recurring,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data):
        return Transaction(
            id=data["id"],
            user_id=data["user_id"],
            category_id=data["category_id"],
            amount=data["amount"],
            description=data.get("description", ""),
            transaction_date=data["transaction_date"],
            is_recurring=data.get("is_recurring", False),
            created_at=data.get("created_at"),
        )
