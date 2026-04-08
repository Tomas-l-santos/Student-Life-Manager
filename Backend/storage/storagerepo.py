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

    def _read_all_unlocked(self):
        """Internal method to read without acquiring the lock."""
        with open(self.filepath, "r") as f:
            return json.load(f)

    def _write_all_unlocked(self, data):
        """Internal method to write without acquiring the lock."""
        with open(self.filepath, "w") as f:
            json.dump(data, f, indent=2)

    def read_all(self):
        with self.lock:
            return self._read_all_unlocked()

    def write_all(self, data):
        with self.lock:
            self._write_all_unlocked(data)

    def append(self, item):
        with self.lock:
            data = self._read_all_unlocked()
            data.append(item)
            self._write_all_unlocked(data)
