from storage.storagerepo import JSONStorage
from models.Budget import Transaction, Budget
from datetime import datetime


class BudgetService:
    def __init__(
        self,
        transactions_path="data/transactions.json",
        budgets_path="data/budgets.json",
        categories_path="data/categories.json",
    ):
        self.transactions_storage = JSONStorage(transactions_path)
        self.budgets_storage = JSONStorage(budgets_path)
        self.categories_storage = JSONStorage(categories_path)
        self._initialize_categories()

    def _initialize_categories(self):
        """Initialize default categories if none exist"""
        categories = self.categories_storage.read_all()
        if not categories:
            default_categories = [
                {"id": 1, "name": "Food & Dining", "type": "expense", "icon": ""},
                {"id": 2, "name": "Transportation", "type": "expense", "icon": ""},
                {"id": 3, "name": "Rent", "type": "expense", "icon": ""},
                {"id": 4, "name": "Utilities", "type": "expense", "icon": ""},
                {"id": 5, "name": "Entertainment", "type": "expense", "icon": ""},
                {"id": 6, "name": "Shopping", "type": "expense", "icon": ""},
                {"id": 7, "name": "Education", "type": "expense", "icon": ""},
                {"id": 8, "name": "Healthcare", "type": "expense", "icon": ""},
                {"id": 9, "name": "Personal Care", "type": "expense", "icon": ""},
                {"id": 10, "name": "Other Expenses", "type": "expense", "icon": ""},
                {"id": 11, "name": "Groceries", "type": "expense", "icon": ""},
                {"id": 12, "name": "Salary", "type": "income", "icon": ""},
                {"id": 13, "name": "Work", "type": "income", "icon": ""},
                {"id": 14, "name": "Scholarship", "type": "income", "icon": ""},
                {"id": 15, "name": "Allowance", "type": "income", "icon": ""},
                {"id": 16, "name": "Other Income", "type": "income", "icon": ""},
            ]
            self.categories_storage.write_all(default_categories)

    # categories
    def get_all_categories(self, category_type=None):
        categories = self.categories_storage.read_all()
        if category_type:
            categories = [c for c in categories if c["type"] == category_type]
        return categories

    def get_category_by_id(self, category_id):
        categories = self.categories_storage.read_all()
        for cat in categories:
            if cat["id"] == category_id:
                return cat
        return None

    #  transaction
    def _generate_transaction_id(self):
        transactions = self.transactions_storage.read_all()
        if not transactions:
            return 1
        return max(t["id"] for t in transactions) + 1

    def add_transaction(
        self,
        user_id,
        category_id,
        amount,
        description,
        transaction_date,
        is_recurring=False,
    ):
        category = self.get_category_by_id(category_id)
        if not category:
            raise ValueError("Category not found")
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except ValueError:
            raise ValueError("Invalid amount")
        try:
            datetime.strptime(transaction_date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD")
        transaction = Transaction(
            id=self._generate_transaction_id(),
            user_id=user_id,
            category_id=category_id,
            amount=amount,
            description=description,
            transaction_date=transaction_date,
            is_recurring=is_recurring,
        )
        self.transactions_storage.append(transaction.to_dict())
        return transaction.to_dict()

    def get_user_transactions(self, user_id, category_id=None, month=None, year=None):
        transactions = self.transactions_storage.read_all()
        user_transactions = [t for t in transactions if t.get("user_id") == user_id]
        if category_id:
            user_transactions = [
                t for t in user_transactions if t.get("category_id") == category_id
            ]
        if month and year:
            user_transactions = [
                t
                for t in user_transactions
                if datetime.strptime(t["transaction_date"], "%Y-%m-%d").month == month
                and datetime.strptime(t["transaction_date"], "%Y-%m-%d").year == year
            ]
        elif year:
            user_transactions = [
                t
                for t in user_transactions
                if datetime.strptime(t["transaction_date"], "%Y-%m-%d").year == year
            ]
        user_transactions.sort(key=lambda x: x["transaction_date"], reverse=True)
        for t in user_transactions:
            t["category"] = self.get_category_by_id(t["category_id"])
        return user_transactions

    def get_transaction_by_id(self, transaction_id, user_id):
        transactions = self.transactions_storage.read_all()
        for t in transactions:
            if t["id"] == transaction_id and t.get("user_id") == user_id:
                t["category"] = self.get_category_by_id(t["category_id"])
                return t
        return None

    def update_transaction(self, transaction_id, user_id, updates):
        transactions = self.transactions_storage.read_all()
        for i, t in enumerate(transactions):
            if t["id"] == transaction_id and t.get("user_id") == user_id:
                if "category_id" in updates:
                    if not self.get_category_by_id(updates["category_id"]):
                        raise ValueError("Category not found")
                    t["category_id"] = updates["category_id"]
                if "amount" in updates:
                    amount = float(updates["amount"])
                    if amount <= 0:
                        raise ValueError("Amount must be positive")
                    t["amount"] = amount
                if "description" in updates:
                    t["description"] = updates["description"]
                if "transaction_date" in updates:
                    datetime.strptime(updates["transaction_date"], "%Y-%m-%d")
                    t["transaction_date"] = updates["transaction_date"]
                if "is_recurring" in updates:
                    t["is_recurring"] = updates["is_recurring"]
                transactions[i] = t
                self.transactions_storage.overwrite(transactions)
                t["category"] = self.get_category_by_id(t["category_id"])
                return t
        raise ValueError("Transaction not found")

    def delete_transaction(self, transaction_id, user_id):
        transactions = self.transactions_storage.read_all()
        for i, t in enumerate(transactions):
            if t["id"] == transaction_id and t.get("user_id") == user_id:
                transactions.pop(i)
                self.transactions_storage.overwrite(transactions)
                return True
        raise ValueError("Transaction not found")

    def get_transaction_summary(self, user_id, month, year):
        transactions = self.get_user_transactions(user_id, month=month, year=year)
        total_income = sum(
            t["amount"] for t in transactions if t["category"]["type"] == "income"
        )
        total_expenses = sum(
            t["amount"] for t in transactions if t["category"]["type"] == "expense"
        )
        balance = total_income - total_expenses
        category_breakdown = {}
        for t in transactions:
            cat_name = t["category"]["name"]
            if cat_name not in category_breakdown:
                category_breakdown[cat_name] = {
                    "type": t["category"]["type"],
                    "total": 0,
                    "count": 0,
                }
            category_breakdown[cat_name]["total"] += t["amount"]
            category_breakdown[cat_name]["count"] += 1
        return {
            "month": month,
            "year": year,
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "balance": round(balance, 2),
            "transaction_count": len(transactions),
            "category_breakdown": category_breakdown,
        }

    # limit
    def _generate_budget_id(self):
        budgets = self.budgets_storage.read_all()
        if not budgets:
            return 1
        return max(b["id"] for b in budgets) + 1

    def create_budget(self, user_id, category_id, amount, month, year):
        category = self.get_category_by_id(category_id)
        if not category or category["type"] != "expense":
            raise ValueError("Budgets can only be set for valid expense categories")
        if not (1 <= month <= 12):
            raise ValueError("Month must be between 1 and 12")
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except ValueError:
            raise ValueError("Invalid amount")
        budgets = self.budgets_storage.read_all()
        # if budget exists, replace it
        for b in budgets:
            if (
                b.get("user_id") == user_id
                and b.get("category_id") == category_id
                and b.get("month") == month
                and b.get("year") == year
            ):
                b["amount"] = amount
                self.budgets_storage.overwrite(budgets)
                b["category"] = category
                return b
        budget = Budget(
            id=self._generate_budget_id(),
            user_id=user_id,
            category_id=category_id,
            amount=amount,
            month=month,
            year=year,
        )
        self.budgets_storage.append(budget.to_dict())
        res = budget.to_dict()
        res["category"] = category
        return res

    def get_user_budgets(self, user_id, month=None, year=None):
        budgets = self.budgets_storage.read_all()
        user_budgets = [b for b in budgets if b.get("user_id") == user_id]
        if month and year:
            user_budgets = [
                b
                for b in user_budgets
                if b.get("month") == month and b.get("year") == year
            ]
        elif year:
            user_budgets = [b for b in user_budgets if b.get("year") == year]
        for b in user_budgets:
            b["category"] = self.get_category_by_id(b.get("category_id"))
        return user_budgets

    def get_budget_by_id(self, budget_id, user_id):
        budgets = self.budgets_storage.read_all()
        for b in budgets:
            if b["id"] == budget_id and b.get("user_id") == user_id:
                b["category"] = self.get_category_by_id(b["category_id"])
                return b
        return None

    def update_budget(self, budget_id, user_id, amount):
        budgets = self.budgets_storage.read_all()
        for i, b in enumerate(budgets):
            if b["id"] == budget_id and b.get("user_id") == user_id:
                try:
                    amount = float(amount)
                    if amount <= 0:
                        raise ValueError("Amount must be positive")
                except ValueError:
                    raise ValueError("Invalid amount")
                b["amount"] = amount
                budgets[i] = b
                self.budgets_storage.overwrite(budgets)
                b["category"] = self.get_category_by_id(b["category_id"])
                return b
        raise ValueError("Budget not found")

    def delete_budget(self, budget_id, user_id):
        budgets = self.budgets_storage.read_all()
        for i, b in enumerate(budgets):
            if b["id"] == budget_id and b.get("user_id") == user_id:
                budgets.pop(i)
                self.budgets_storage.overwrite(budgets)
                return True
        raise ValueError("Budget not found")

    def get_budget_status(self, user_id, month, year):
        # CRITICAL FIX: Passing user_id downwards
        budgets = self.get_user_budgets(user_id, month=month, year=year)
        budget_status = []
        for budget in budgets:
            transactions = self.get_user_transactions(
                user_id, category_id=budget["category_id"], month=month, year=year
            )
            spent = sum(t["amount"] for t in transactions)
            remaining = budget["amount"] - spent
            percentage_used = (
                (spent / budget["amount"] * 100) if budget["amount"] > 0 else 0
            )
            if percentage_used >= 100:
                status = "exceeded"
            elif percentage_used >= 80:
                status = "warning"
            else:
                status = "on_track"
            budget_status.append(
                {
                    "budget": budget,
                    "spent": round(spent, 2),
                    "remaining": round(remaining, 2),
                    "percentage_used": round(percentage_used, 2),
                    "status": status,
                }
            )
        total_budget = sum(b["budget"]["amount"] for b in budget_status)
        total_spent = sum(b["spent"] for b in budget_status)
        total_remaining = total_budget - total_spent
        return {
            "month": month,
            "year": year,
            "budgets": budget_status,
            "total_budget": round(total_budget, 2),
            "total_spent": round(total_spent, 2),
            "total_remaining": round(total_remaining, 2),
            "overall_percentage_used": round(
                (total_spent / total_budget * 100) if total_budget > 0 else 0, 2
            ),
        }