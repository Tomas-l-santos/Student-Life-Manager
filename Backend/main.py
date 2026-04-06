from flask import Flask, jsonify, request
from flask_cors import CORS
from services.budget_service import BudgetService
from services.academics_service import AcademicsService
from services.auth_routes import auth_bp, token_required
from services.deadline_service import DeadlineService
from services.timetable_service import TimetableService

app = Flask(__name__)
# --- CRITICAL FIX: Enabling CORS so React can communicate with Flask ---
CORS(app)
# Register the auth Blueprint (gives you /api/auth/login, /api/auth/me, etc.)
app.register_blueprint(auth_bp)

budget_service = BudgetService()
academics_service = AcademicsService()
deadline_service = DeadlineService()
timetable_service = TimetableService()


@app.route("/api/transactions", methods=["POST"])
@token_required
def add_transaction(current_user_email, current_user_id):
    data = request.json
    try:
        t = budget_service.add_transaction(
            user_id=current_user_id,
            category_id=data["category_id"],
            amount=data["amount"],
            description=data["description"],
            transaction_date=data["transaction_date"],
        )
        return jsonify(t), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/transactions", methods=["GET"])
@token_required
def get_transactions(current_user_email, current_user_id):
    try:
        return jsonify(budget_service.get_user_transactions(current_user_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/transactions/<int:transaction_id>", methods=["DELETE"])
@token_required
def remove_transaction(current_user_email, current_user_id, transaction_id):
    try:
        budget_service.delete_transaction(transaction_id, current_user_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/budgets", methods=["POST"])
@token_required
def create_budget(current_user_email, current_user_id):
    data = request.json
    try:
        b = budget_service.create_budget(
            user_id=current_user_id,  # from token, not request body
            category_id=data["category_id"],
            amount=data["amount"],
            month=data["month"],
            year=data["year"],
        )
        return jsonify(b), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/budgets", methods=["GET"])
@token_required
def get_budgets(current_user_email, current_user_id):
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    try:
        return (
            jsonify(
                budget_service.get_user_budgets(current_user_id, month=month, year=year)
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/budgets/status", methods=["GET"])
@token_required
def get_budget_status(current_user_email, current_user_id):
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    try:
        return (
            jsonify(
                budget_service.get_budget_status(
                    current_user_id, month=month, year=year
                )
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/budgets/<int:budget_id>", methods=["DELETE"])
@token_required
def delete_budget(current_user_email, current_user_id, budget_id):
    try:
        budget_service.delete_budget(budget_id, current_user_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/categories", methods=["GET"])
def get_categories():
    cat_type = request.args.get("type")  # ?type=expense or ?type=income
    result = budget_service.get_all_categories(category_type=cat_type)
    return jsonify(result), 200


# Accademic routes
@app.route("/api/modules", methods=["GET"])
@token_required
def get_modules(current_user_email, current_user_id):
    try:
        modules = academics_service.get_user_modules(current_user_id)
        for module in modules:
            assessments = academics_service.get_module_assessments(
                module["id"], current_user_id
            )
            module["assessments"] = assessments
        return jsonify(modules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/modules", methods=["POST"])
@token_required
def create_module(current_user_email, current_user_id):
    data = request.json
    try:
        new_module = academics_service.create_module(
            user_id=current_user_id,  # Secure identity
            name=data.get("name"),
            code=data.get("code"),
            credits=data.get("credits"),
            year_of_study=data.get("year_of_study"),
            academic_year=data.get("academic_year"),
            deadline=data.get("deadline", ""),
        )
        return jsonify(new_module), 201
    except Exception as e:
        print(f"Backend Error creating module: {e}")
        return jsonify({"error": str(e)}), 400


@app.route("/api/modules/<int:module_id>", methods=["DELETE"])
@token_required
def delete_module(current_user_email, current_user_id, module_id):
    try:
        academics_service.delete_module(module_id, current_user_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Backend Error deleting module: {e}")
        return jsonify({"error": str(e)}), 400


@app.route("/api/assessments", methods=["POST"])
@token_required
def add_assessment(current_user_email, current_user_id):
    data = request.json
    try:
        new_assessment = academics_service.create_assessment(
            user_id=current_user_id,
            module_id=int(data.get("module_id")),
            name=data.get("name"),
            assessment_type=data.get("assessment_type"),
            score=data.get("score"),
            max_score=data.get("max_score"),
            weight=data.get("weight"),
            date=data.get("date"),
        )
        return jsonify(new_assessment), 201
    except Exception as e:
        print(f"Backend Error creating assessment: {e}")
        return jsonify({"error": str(e)}), 400


# Deadline Routes
@app.route("/api/deadlines", methods=["POST"])
@token_required
def add_deadline(current_user_email, current_user_id):
    data = request.json
    try:
        d = deadline_service.add_deadline(
            user_id=current_user_id,
            module_name=data.get("module_name", ""),
            title=data["title"],
            due_date=data["due_date"],
            priority=data.get("priority", "normal"),
            status=data.get("status", "To-Do"),
            notes=data.get("notes", ""),
        )
        return jsonify(d), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/deadlines", methods=["GET"])
@token_required
def get_deadlines(current_user_email, current_user_id):
    completed = request.args.get("completed")
    if completed is not None:
        completed = completed.lower() == "true"
    try:
        return (
            jsonify(
                deadline_service.get_user_deadlines(
                    current_user_id, completed=completed
                )
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/deadlines/<int:deadline_id>", methods=["PUT"])
@token_required
def update_deadline(current_user_email, current_user_id, deadline_id):
    try:
        d = deadline_service.update_deadline(deadline_id, current_user_id, request.json)
        return jsonify(d), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/deadlines/<int:deadline_id>", methods=["DELETE"])
@token_required
def delete_deadline(current_user_email, current_user_id, deadline_id):
    try:
        deadline_service.delete_deadline(deadline_id, current_user_id)
        return jsonify({"message": "Deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Timetable Routes
@app.route("/api/timetable", methods=["POST"])
@token_required
def add_timetable_entry(current_user_email, current_user_id):
    data = request.json
    try:
        e = timetable_service.add_entry(
            user_id=current_user_id,
            module_name=data["module_name"],
            location=data.get("location", ""),
            entry_type=data.get("entry_type", "lecture"),
            day=data["day"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            start_date=data.get("start_date"),  # Added extraction
            end_date=data.get("end_date"),  # Added extraction
        )
        return jsonify(e), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/timetable", methods=["GET"])
@token_required
def get_timetable(current_user_email, current_user_id):
    day = request.args.get("day")
    try:
        return (
            jsonify(timetable_service.get_user_timetable(current_user_id, day=day)),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/timetable/<int:entry_id>", methods=["PUT"])
@token_required
def update_timetable_entry(current_user_email, current_user_id, entry_id):
    try:
        e = timetable_service.update_entry(entry_id, current_user_id, request.json)
        return jsonify(e), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/timetable/<int:entry_id>", methods=["DELETE"])
@token_required
def delete_timetable_entry(current_user_email, current_user_id, entry_id):
    try:
        timetable_service.delete_entry(entry_id, current_user_id)
        return jsonify({"message": "Deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)