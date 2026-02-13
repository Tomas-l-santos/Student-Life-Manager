import bcrypt
from models.user import User
from storage.storagerepo import JSONStorage
import re
from time import time

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
USERNAME_REGEX = r"^[a-zA-Z0-9_]{3,20}$"



class AuthService:
    def __init__(self, storage_path="data/users.json"):
        self.storage = JSONStorage(storage_path)
        self.failed_attempts = {}

    def validate_email(self, email):
        if not re.match(EMAIL_REGEX, email):
            raise ValueError("Invalid email format")

    def validate_username(self, username):
        if not re.match(USERNAME_REGEX, username):
            raise ValueError("Invalid username")

    def register_user(self, email, username, password):
        email = email.strip()
        username = username.strip()
        password = password.strip()

        self.validate_email(email)
        self.validate_username(username)
        self.validate_password(password)

        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                raise ValueError("Email already exists")

        password_hash = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

        user = User(email, username, password_hash)
        self.storage.append(user.to_dict())

        return True

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
                    return True
                else:
                    attempts, _ = self.failed_attempts.get(email, (0, now))
                    self.failed_attempts[email] = (attempts + 1, now)
                    return False

        return False

    def change_password(self, email, new_password):
        email = email.strip()
        new_password = new_password.strip()
        self.validate_password(new_password)

        users = self.storage.read_all()

        for u in users:
            if u["email"] == email:
                new_hash = bcrypt.hashpw(
                    new_password.encode(),
                    bcrypt.gensalt()
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


