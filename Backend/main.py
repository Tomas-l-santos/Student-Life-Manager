from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from services.auth_routes import auth_bp 

app = Flask(__name__)

# 1. Broadest possible CORS settings
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 2. Manual Preflight Handler (The "Brute Force" fix)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

app.register_blueprint(auth_bp)

if __name__ == "__main__":
    # host='0.0.0.0' ensures it listens on 'localhost' and '127.0.0.1'
    app.run(debug=True, host='0.0.0.0', port=5000)