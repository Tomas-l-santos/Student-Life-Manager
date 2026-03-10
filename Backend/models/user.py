class User:
    def __init__(self, email, username, password_hash, birthdate=""):
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.birthdate = birthdate

    def to_dict(self):
        return {
            "email": self.email,
            "username": self.username,
            "password_hash": self.password_hash,
            "birthdate": self.birthdate 
        }

    @staticmethod
    def from_dict(data):
        return User(
            email=data["email"],
            username=data["username"],
            password_hash=data["password_hash"],
            birthdate=data.get("birthdate", "") 
        )