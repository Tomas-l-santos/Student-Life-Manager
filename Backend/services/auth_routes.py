from flask import Blueprint, request, jsonify
from services.authorisations import AuthService
from functools import wraps
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_service = AuthService()

# Secret key for JWT - use environment variable in production
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

def generate_token(email):
    """Generate JWT token"""
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    """Decorator to protect routes with JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user_email = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user_email, *args, **kwargs)
    
    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Register user using your AuthService
        auth_service.register_user(
            email=data['email'],
            username=data['username'],
            password=data['password']
        )
        
        # Generate token
        token = generate_token(data['email'])
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'email': data['email'],
                'username': data['username']
            },
            'access_token': token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        # Login using your AuthService
        success = auth_service.login_user(
            email=data['email'],
            password=data['password']
        )
        
        if success:
            # Get user info
            users = auth_service.storage.read_all()
            user = next((u for u in users if u['email'] == data['email']), None)
            
            # Generate token
            token = generate_token(data['email'])
            
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
def get_current_user(current_user_email):
    """Get current logged-in user"""
    try:
        users = auth_service.storage.read_all()
        user = next((u for u in users if u['email'] == current_user_email), None)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'email': user['email'],
            'username': user['username']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'details': str(e)}), 500


@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user_email):
    """Change user password"""
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


@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    """Request a password reset token"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        token = auth_service.generate_reset_token(data['email'])
        
        # In production, you would send this token via email
        # For now, we return it in the response for testing
        return jsonify({
            'message': 'Password reset token generated',
            'reset_token': token,
            'note': 'In production, this would be sent via email. Token expires in 1 hour.'
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to generate reset token', 'details': str(e)}), 500


@auth_bp.route('/verify-reset-token', methods=['POST'])
def verify_reset_token():
    """Verify if a reset token is valid"""
    try:
        data = request.get_json()
        
        if not data or not data.get('token'):
            return jsonify({'error': 'Reset token is required'}), 400
        
        email = auth_service.verify_reset_token(data['token'])
        
        return jsonify({
            'message': 'Token is valid',
            'email': email
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to verify token', 'details': str(e)}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using a valid reset token"""
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


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request a password reset token"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        token = auth_service.generate_reset_token(data['email'])
        
        # In production, send this token via email
        # For now, return it in the response (NOT secure for production!)
        return jsonify({
            'message': 'Password reset token generated',
            'reset_token': token,
            'note': 'In production, this token would be sent via email'
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to generate reset token', 'details': str(e)}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using a reset token"""
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
    """Verify if a reset token is valid"""
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