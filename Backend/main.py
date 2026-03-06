from flask import Flask, jsonify, request
from flask_cors import CORS
from services.authorisation import AuthService
from services.budget_service import BudgetService
from services.auth_routes import auth_bp  # Register the Blueprint

app = Flask(__name__)
CORS(app)

# Register the auth Blueprint (gives you /api/auth/login, /api/auth/me, etc.)
app.register_blueprint(auth_bp)

budget_service = BudgetService()

# --- TRANSACTION ROUTES ---

@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    try:
        t = budget_service.add_transaction(
            user_email=data["user_email"],  # use email consistently
            category_id=data["category_id"],
            amount=data["amount"],
            description=data["description"],
            transaction_date=data["transaction_date"]
        )
        return jsonify(t), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/transactions/<user_email>", methods=["GET"])
def get_transactions(user_email):
    try:
        result = budget_service.get_user_transactions(user_email)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- BUDGET ROUTES ---

@app.route("/api/budgets", methods=["POST"])
def create_budget():
    data = request.json
    try:
        b = budget_service.create_budget(
            user_email=data["user_email"],
            category_id=data["category_id"],
            amount=data["amount"],
            month=data["month"],
            year=data["year"]
        )
        return jsonify(b), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/budgets/<user_email>", methods=["GET"])
def get_budgets(user_email):
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    try:
        result = budget_service.get_user_budgets(user_email, month=month, year=year)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/budgets/status/<user_email>", methods=["GET"])
def get_budget_status(user_email):
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    try:
        result = budget_service.get_budget_status(user_email, month=month, year=year)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- CATEGORY ROUTES ---

@app.route("/api/categories", methods=["GET"])
def get_categories():
    cat_type = request.args.get("type")  # ?type=expense or ?type=income
    result = budget_service.get_all_categories(category_type=cat_type)
    return jsonify(result), 200

if __name__ == "__main__":
    app.run(debug=True)
