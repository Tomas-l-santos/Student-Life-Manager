from datetime import datetime

class Category:
    def __init__(self, id, name, type, icon=None):
        self.id = id      #unique identifier for the category 
        self.name = name  #names for the categorty 
        self.type = type  #income or expense makes it + or -
        self.icon = icon  #this is opitional for asthetic icons like burger emoji for food ect

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "icon": self.icon
        }

    @staticmethod
    def from_dict(data):
        return Category(
            id=data["id"],
            name=data["name"],
            type=data["type"],
            icon=data.get("icon")
        )