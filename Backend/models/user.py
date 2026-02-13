class User:
    def __init__(self, email, username, password_hash):
        self.email = email
        self.username = username
        self.password_hash = password_hash

    def to_dict(self):
        return {
            "email": self.email,
            "username": self.username,
            "password_hash": self.password_hash
        }

    @staticmethod
    def from_dict(data):
        return User(
            email=data["email"],
            username=data["username"],
            password_hash=data["password_hash"]
        )
