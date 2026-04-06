import bcrypt
import secrets
import string
import re
from time import time
from models.user import User
from storage.storagerepo import JSONStorage

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
USERNAME_REGEX = r"^[a-zA-Z0-9_]{3,20}$"


class AuthService:
    def __init__(self, storage_path="data/users.json"):
        self.storage = JSONStorage(storage_path)
        self.failed_attempts = {}
        self.reset_tokens = {}

    def validate_email(self, email):
        if not re.match(EMAIL_REGEX, email):
            raise ValueError("Invalid email format")

    def validate_username(self, username):
        if not re.match(USERNAME_REGEX, username):
            raise ValueError("Invalid username")

    def register_user(self, email, username, password, birthdate):
        email = email.strip()
        username = username.strip()
        password = password.strip()
        birthdate = birthdate.strip()

        self.validate_email(email)
        self.validate_username(username)
        self.validate_password(password)

        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                raise ValueError("Email already exists")

        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

        user = User(email, username, password_hash, birthdate)
        self.storage.append(user.to_dict())

        return user

    def login_user(self, email, password):
        email = email.strip()
        password = password.strip()
        now = time()

        if email in self.failed_attempts:
            attempts, last_time = self.failed_attempts[email]
            if attempts >= 5 and now - last_time < 300:
                raise ValueError("Account locked. Try again later")

        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                stored_hash = u["password_hash"].encode()

                if bcrypt.checkpw(password.encode(), stored_hash):
                    self.failed_attempts.pop(email, None)
                    return User.from_dict(u)
                else:
                    attempts, _ = self.failed_attempts.get(email, (0, now))
                    self.failed_attempts[email] = (attempts + 1, now)
                    raise ValueError("Invalid email or password")

        raise ValueError("Invalid email or password")

    def change_password(self, email, new_password):
        email = email.strip()
        new_password = new_password.strip()
        self.validate_password(new_password)

        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                new_hash = bcrypt.hashpw(
                    new_password.encode(), bcrypt.gensalt()
                ).decode()
                u["password_hash"] = new_hash
                self.storage.overwrite(users)
                return True

        raise ValueError("User not found")

    def validate_password(self, password):
        if len(password) < 8:
            raise ValueError("Password too short")

        if not any(c.isupper() for c in password):
            raise ValueError("Must contain uppercase")

        if not any(c.islower() for c in password):
            raise ValueError("Must contain lowercase")

        if not any(c.isdigit() for c in password):
            raise ValueError("Must contain number")

        if not any(not c.isalnum() for c in password):
            raise ValueError("Must contain special character")

    def delete_account(self, email, user_id):
        users = self.storage.read_all()
        initial_len = len(users)
        users = [
            u for u in users if u.get("email") != email and u.get("user_id") != user_id
        ]

        if len(users) == initial_len:
            raise ValueError("User not found")

        self.storage.overwrite(users)
        for filename in [
            "data/transactions.json",
            "data/budgets.json",
            "data/deadlines.json",
            "data/timetable.json",
        ]:
            try:
                store = JSONStorage(filename)
                data = store.read_all()
                filtered = [item for item in data if item.get("user_id") != user_id]
                store.overwrite(filtered)
            except Exception as e:
                print(f"Error cleaning {filename}: {e}")
        for filename in [
            "data/modules.json",
            "data/assessments.json",
            "data/notes.json",
        ]:
            try:
                store = JSONStorage(filename)
                data = store.read_all()
                filtered = [item for item in data if item.get("user_email") != email]
                store.overwrite(filtered)
            except Exception as e:
                print(f"Error cleaning {filename}: {e}")
        self.failed_attempts.pop(email, None)
        tokens_to_remove = [
            t for t, d in self.reset_tokens.items() if d["email"] == email
        ]
        for t in tokens_to_remove:
            del self.reset_tokens[t]

        return True

    def generate_reset_token(self, email):
        """Generate a 6-digit OTP for a user"""
        email = email.strip()
        self.validate_email(email)

        # Check if user exists
        users = self.storage.read_all()
        user_exists = any(u["email"] == email for u in users)

        if not user_exists:
            raise ValueError("User not found")

        # GENERATES A 6-DIGIT OTP INSTEAD OF 32 CHARACTERS
        token = "".join(secrets.choice(string.digits) for _ in range(6))

        # Store token with expiration 1 hr
        expiry = time() + 3600
        self.reset_tokens[token] = {"email": email, "expiry": expiry}

        # Clean up expired tokens
        self._cleanup_expired_tokens()

        return token

    def verify_reset_token(self, token):
        """Verify if a reset token is valid"""
        if token not in self.reset_tokens:
            raise ValueError("Invalid or expired OTP")

        token_data = self.reset_tokens[token]

        if time() > token_data["expiry"]:
            del self.reset_tokens[token]
            raise ValueError("OTP has expired")

        return token_data["email"]

    def reset_password_with_token(self, token, new_password):
        """Reset password using a valid reset token"""
        # Verify token and get email
        email = self.verify_reset_token(token)

        # Validate new password
        new_password = new_password.strip()
        self.validate_password(new_password)

        # Change password
        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                new_hash = bcrypt.hashpw(
                    new_password.encode(), bcrypt.gensalt()
                ).decode()
                u["password_hash"] = new_hash
                self.storage.overwrite(users)

                # Delete the used token and clear
                del self.reset_tokens[token]
                self.failed_attempts.pop(email, None)

                return True

        raise ValueError("User not found")

    def _cleanup_expired_tokens(self):
        """Remove expired reset tokens"""
        now = time()
        expired_tokens = [
            token for token, data in self.reset_tokens.items() if now > data["expiry"]
        ]
        for token in expired_tokens:
            del self.reset_tokens[token]
