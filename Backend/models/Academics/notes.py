from storage.storagerepo import JSONStorage
from datetime import datetime


class Notes:
    # Class for managing module notes

    def __init__(self, storage_path="data/notes.json"):
        self.storage = JSONStorage(storage_path)

    def _generate_id(self):

        # Generate unique note ID
        notes = self.storage.read_all()
        if not notes:
            return 1
        return max(n["id"] for n in notes) + 1

    def create(
        self,
        user_id,
        module_id,
        module_name,
        module_code,
        title,
        topic,
        content,
        tags=None,
    ):

        # Validate inputs
        if not title:
            raise ValueError("Note title is required")

        if not content:
            raise ValueError("Note content cannot be empty")

        if not topic:
            raise ValueError("Topic is required for organizing notes")

        note = {
            "id": self._generate_id(),
            "user_id": user_id,
            "module_id": module_id,
            "module_name": module_name,
            "module_code": module_code,
            "title": title.strip(),
            "topic": topic.strip(),
            "content": content,
            "tags": tags if tags else [],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "is_pinned": False,
            "is_archived": False,
        }

        self.storage.append(note)
        return note

    def get_all_for_module(
        self, module_id, user_id, topic=None, include_archived=False
    ):

        notes = self.storage.read_all()
        module_notes = [
            n for n in notes if n["module_id"] == module_id and n["user_id"] == user_id
        ]

        # Filter by topic if specified
        if topic:
            module_notes = [n for n in module_notes if n["topic"] == topic]

        # Filter archived unless requested
        if not include_archived:
            module_notes = [n for n in module_notes if not n.get("is_archived", False)]

        # Sort: pinned first, then by updated date (most recent first)
        module_notes.sort(
            key=lambda x: (not x.get("is_pinned", False), x.get("updated_at", "")),
            reverse=True,
        )

        return module_notes

    def get_topics_for_module(self, module_id, user_id):

        # Get specific topics for a module
        notes = self.storage.read_all()
        module_notes = [
            n
            for n in notes
            if n["module_id"] == module_id
            and n["user_id"] == user_id
            and not n.get("is_archived", False)
        ]

        # Count notes per topic
        topic_counts = {}
        for note in module_notes:
            topic = note.get("topic", "Uncategorized")
            if topic not in topic_counts:
                topic_counts[topic] = {
                    "topic": topic,
                    "note_count": 0,
                    "pinned_count": 0,
                }
            topic_counts[topic]["note_count"] += 1
            if note.get("is_pinned", False):
                topic_counts[topic]["pinned_count"] += 1

        # Convert to list and sort alphabetically
        topics = list(topic_counts.values())
        topics.sort(key=lambda x: x["topic"])

        return topics

    def get_by_id(self, note_id, user_id):

        # Get a specific note
        notes = self.storage.read_all()
        for n in notes:
            if n["id"] == note_id and n["user_id"] == user_id:
                return n
        return None

    def update(self, note_id, user_id, updates):

        # Update an existing note
        notes = self.storage.read_all()

        for i, n in enumerate(notes):
            if n["id"] == note_id and n["user_id"] == user_id:
                # Update allowed fields
                if "title" in updates:
                    if not updates["title"].strip():
                        raise ValueError("Title cannot be empty")
                    n["title"] = updates["title"].strip()

                if "topic" in updates:
                    if not updates["topic"].strip():
                        raise ValueError("Topic cannot be empty")
                    n["topic"] = updates["topic"].strip()

                if "content" in updates:
                    if not updates["content"]:
                        raise ValueError("Content cannot be empty")
                    n["content"] = updates["content"]

                if "tags" in updates:
                    n["tags"] = updates["tags"] if updates["tags"] else []

                if "is_pinned" in updates:
                    n["is_pinned"] = bool(updates["is_pinned"])

                if "is_archived" in updates:
                    n["is_archived"] = bool(updates["is_archived"])

                # Update timestamp
                n["updated_at"] = datetime.now().isoformat()

                notes[i] = n
                self.storage.overwrite(notes)
                return n

        raise ValueError("Note not found")

    def delete(self, note_id, user_id):

        # Delete a note
        notes = self.storage.read_all()

        for i, n in enumerate(notes):
            if n["id"] == note_id and n["user_id"] == user_id:
                notes.pop(i)
                self.storage.overwrite(notes)
                return True

        raise ValueError("Note not found")

    def delete_all_for_module(self, module_id, user_id):

        # Delete all notes for a module (used when module is deleted)
        notes = self.storage.read_all()
        notes = [
            n
            for n in notes
            if not (n["module_id"] == module_id and n["user_id"] == user_id)
        ]
        self.storage.overwrite(notes)
        return True

    def search_notes(self, user_id, query, module_id=None):

        # Search notes by title, content, or tags
        notes = self.storage.read_all()
        user_notes = [n for n in notes if n["user_id"] == user_id]

        # Filter by module if specified
        if module_id:
            user_notes = [n for n in user_notes if n["module_id"] == module_id]

        # Don't search archived notes
        user_notes = [n for n in user_notes if not n.get("is_archived", False)]

        # Search in title, content, topic, and tags
        query_lower = query.lower()
        matching_notes = []

        for note in user_notes:
            if (
                query_lower in note["title"].lower()
                or query_lower in note["content"].lower()
                or query_lower in note["topic"].lower()
                or any(query_lower in tag.lower() for tag in note.get("tags", []))
            ):
                matching_notes.append(note)

        # Sort by relevance (title match first, then updated date)
        matching_notes.sort(
            key=lambda x: (
                query_lower not in x["title"].lower(),
                x.get("updated_at", ""),
            ),
            reverse=True,
        )

        return matching_notes

    def pin_note(self, note_id, user_id):

        # Pin a note to the top
        return self.update(note_id, user_id, {"is_pinned": True})

    def unpin_note(self, note_id, user_id):

        # Unpin a note
        return self.update(note_id, user_id, {"is_pinned": False})

    def archive_note(self, note_id, user_id):

        # Archive a note
        return self.update(note_id, user_id, {"is_archived": True})

    def unarchive_note(self, note_id, user_id):

        # Unarchive a note
        return self.update(note_id, user_id, {"is_archived": False})
