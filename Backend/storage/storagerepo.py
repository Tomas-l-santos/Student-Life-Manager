import json
import os
from threading import Lock


class JSONStorage:
    def __init__(self, filepath):
        self.filepath = filepath
        self.lock = Lock()

        if not os.path.exists(filepath):
            with open(filepath, "w") as f:
                json.dump([], f)

    def read_all(self):
        with self.lock:
            with open(self.filepath, "r") as f:
                return json.load(f)

    def write_all(self, data):
        with self.lock:
            with open(self.filepath, "w") as f:
                json.dump(data, f, indent=2)

    def append(self, item):
        data = self.read_all()
        data.append(item)
        self.write_all(data)

    def overwrite(self, data):
        self.write_all(data)
