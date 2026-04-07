import uuid


class User:
    def __init__(self, email, username, password_hash, birthdate, user_id=None):
        # Automatically generates a unique ID if one isn't provided
        self.user_id = user_id if user_id else str(uuid.uuid4())
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.birthdate = birthdate

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "email": self.email,
            "username": self.username,
            "password_hash": self.password_hash,
            "birthdate": self.birthdate,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            email=data.get("email"),
            username=data.get("username"),
            password_hash=data.get("password_hash"),
            birthdate=data.get("birthdate"),
            user_id=data.get("user_id"),
        )
