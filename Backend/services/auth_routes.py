from flask import Blueprint, request, jsonify
from services.authorisation import AuthService
from functools import wraps
import jwt
import os
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_service = AuthService()

# Secret key for JWT - use environment variable in production
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

def generate_token(email, user_id):
    payload = {
        'email': email,
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    """Decorator to protect routes with JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user_email = data['email']
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user_email, current_user_id, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('username') or not data.get('password') or not data.get('birthdate'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        user = auth_service.register_user(
            email=data['email'],
            username=data['username'],
            password=data['password'],
            birthdate=data['birthdate']
        )
        
        token = generate_token(data['email'], user.user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'email': data['email'],
                'username': data['username'],
                'birthdate': data['birthdate']
            },
            'access_token': token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        success = auth_service.login_user(
            email=data['email'],
            password=data['password']
        )
        
        if success:
            users = auth_service.storage.read_all()
            user = next((u for u in users if u['email'] == data['email']), None)
            
            token = generate_token(user['email'], user['user_id'])
            
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'email': user['email'],
                    'username': user['username']
                },
                'access_token': token
            }), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user_email, current_user_id):
    try:
        users = auth_service.storage.read_all()
        user = next((u for u in users if u['email'] == current_user_email), None)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'email': user['email'],
            'username': user['username'],
            'birthdate': user.get('birthdate', '')
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'details': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user_email, current_user_id):
    try:
        data = request.get_json()
        
        if not data or not data.get('new_password'):
            return jsonify({'error': 'New password is required'}), 400
        
        auth_service.change_password(current_user_email, data['new_password'])
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to change password', 'details': str(e)}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request a password reset token (6 digits)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        token = auth_service.generate_reset_token(data['email'])
        
        print(f"\n{'='*40}")
        print(f"SECURITY ALERT: Reset requested for {data['email']}")
        print(f"YOUR 6-DIGIT TOKEN IS: {token}")
        print(f"{'='*40}\n")

        # Pulls from .env, falls back to the hardcoded one if EMAIL_USER isn't set
        sender_email = os.getenv('EMAIL_USER', "studentlife.app.noreply@gmail.com")
        sender_password = os.getenv('GMAIL_APP_PASSWORD')
        
        if not sender_password:
            print("Warning: GMAIL_APP_PASSWORD not set in .env file")
            return jsonify({'error': 'Email service not configured'}), 500
        
        msg = MIMEText(f"Your password reset token is: {token}\nThis code is valid for 1 hour.")
        msg['Subject'] = "Your SLM Password Reset Code"
        msg['From'] = sender_email
        msg['To'] = data['email']
        
        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(sender_email, sender_password)
                server.send_message(msg)
        except Exception as mail_error:
            print(f"Failed to send email: {mail_error}")
            return jsonify({'error': 'Could not send email. Check backend credentials.'}), 500

        return jsonify({
            'message': 'If the email exists, a token has been sent.',
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to process request', 'details': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using the 6-digit token"""
    try:
        data = request.get_json()
        
        if not data or not data.get('token') or not data.get('new_password'):
            return jsonify({'error': 'Token and new password are required'}), 400
        
        auth_service.reset_password_with_token(data['token'], data['new_password'])
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to reset password', 'details': str(e)}), 500

@auth_bp.route('/verify-reset-token', methods=['POST'])
def verify_reset_token():
    try:
        data = request.get_json()
        
        if not data or not data.get('token'):
            return jsonify({'error': 'Token is required'}), 400
        
        email = auth_service.verify_reset_token(data['token'])
        
        return jsonify({
            'message': 'Token is valid',
            'email': email
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to verify token', 'details': str(e)}), 500

@auth_bp.route('/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user_email, current_user_id):
    """Permanently delete user and all associated data"""
    try:
        auth_service.delete_account(current_user_email, current_user_id)
        return jsonify({'message': 'Account and all associated data deleted successfully'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to delete account', 'details': str(e)}), 500