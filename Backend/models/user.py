import uuid

class User:
<<<<<<< docs-AbishilS
    def __init__(self, email, username, password_hash, birthdate=""):
=======
    def __init__(self, email, username, password_hash, user_id=None):
        self.user_id = user_id or str(uuid.uuid4())
>>>>>>> main
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
            "birthdate": self.birthdate 
        }

    @staticmethod
    def from_dict(data):
        return User(
            email=data["email"],
            username=data["username"],
            password_hash=data["password_hash"],
<<<<<<< docs-AbishilS
            birthdate=data.get("birthdate", "") 
=======
            user_id=data.get("user_id")  
>>>>>>> main
        )