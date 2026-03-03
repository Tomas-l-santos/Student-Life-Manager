import uuid
from datetime import datetime
from models.Budget.transactions import Transaction
from storage.storagerepo import storagerepo

class TransactionService:

    def __init__(self):
        self.storage = StorageRepo("date/Transactions.json")
    
    def _validate_amount(self. amount):
        if not isinstance(amount, (int, float)):
            raise ValueError ("Amount must be a number")

        if amount == 0:
            raise ValueError ("Amount cannot be zero")

        return float(amount)


    def _validate_description (self, description):
        if description and len(description) > 255:
            raise ValueError ("Description too long")
        return description.strip()


    def add_transaction(self, user_id, category_id, amount, description, transaction_date, is_recurring=False):
        amount = self._validate_amount(amount)
        transaction_date = self._validate_date(transaction_date)
        description = self._validate_description(description)

        transaction = Transaction(id=str(uuid.uuid4()), user_id=user_id, category_id=category_id, amount=amount, description=description, transaction_date=transaction_date,
            is_recurring=is_recurring
            )
        self.storage.append(transaction.to_dict())
        return transaction

     def get_user_transactions(self, user_id):
        all_transactions = self.storage.read_all()  

        user_transactions = [
            Transaction.from_dict(t)
            for t in all_transactions
            if t["user_id"] == user_id
        ]

        return user_transactions

    def delete_transaction(self, transaction_id, user_id):
        transactions = self.storage.read_all()

        filtered = [
            t for t in Transactions
            if not (t["id"] == transaction_id and  t["user_id"] == user_id)
        ]
        self.storage.overwrite(filtered)