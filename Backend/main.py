from flask import Flask, jsonify
from flask_cors import CORS
from service.authorisation import AuthService
from serive.transaction_service import TransactionService

app = Flask(__name__)
CORS(app)

auth_service = AuthService
transaction_service = TransactionService()


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    try:
        user = auth_serivce.register_user(
            data["email"],
            data["username"],
            data["password"]
        )
        return jsonify({"message": "User created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    try:
        user = auth_service.login_user(
            data["email"],
            data["password"]
        )
        return jsonify({
            "message": "Login successful",
            "user_id": user.user_id
        })
    except Exception as e:
        return jsonify({"error":str(e)}), 401


@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    try:
        transaction = transaction_service.add_transaction(
            user_id=data["user_id"],
            category_id=data["category_id"],
            amount=data["amount"],
            description=data["description"],
            transaction_date=data["transaction_date"]
        )
        return jsonify(transaction.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/transactions/<user_id>", methods=["GET"])
def get_transactions(user_id):
    transactions = transaction_service.get_user_transactions(user_id)

    return jsonify([t.to_dict() for t in trnasactions])

if __name__ == " __main__":
    app.run(debug=True)
    


