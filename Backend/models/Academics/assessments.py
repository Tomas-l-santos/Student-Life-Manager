from storage.storagerepo import JSONStorage
from models.Academics.grading import GradingSystem
from datetime import datetime


class Assessments:

    VALID_TYPES = [
        "exam",
        "coursework",
        "essay",
        "project",
        "presentation",
        "lab",
        "other",
    ]

    def __init__(self, storage_path="data/assessments.json"):
        self.storage = JSONStorage(storage_path)
        self.grading = GradingSystem()

    def _generate_id(self):

        assessments = self.storage.read_all()
        if not assessments:
            return 1
        return max(a["id"] for a in assessments) + 1

    def create(
        self,
        user_id,
        module_id,
        module_name,
        module_code,
        name,
        assessment_type,
        score,
        max_score,
        weight,
        date,
    ):
        # Validate inputs
        if not name:
            raise ValueError("Assessment name is required")

        # Validate scores and weight
        try:
            score = float(score)
            max_score = float(max_score)
            weight = float(weight)

            if score < 0 or max_score <= 0:
                raise ValueError("Invalid score values")

            if score > max_score:
                raise ValueError("Score cannot exceed max score")

            if weight < 0 or weight > 100:
                raise ValueError("Weight must be between 0 and 100")
        except ValueError as e:
            if "could not convert" in str(e):
                raise ValueError("Invalid numeric values")
            raise

        # Validate date format
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD")

        # Validate assessment type
        if assessment_type not in self.VALID_TYPES:
            raise ValueError(
                f"Invalid assessment type. Must be one of: {', '.join(self.VALID_TYPES)}"
            )

        # Calculate percentage and UK grade
        percentage = (score / max_score * 100) if max_score > 0 else 0
        uk_grade = self.grading.calculate_grade(percentage)

        assessment = {
            "id": self._generate_id(),
            "user_id": user_id,
            "module_id": module_id,
            "module_name": module_name,
            "module_code": module_code,
            "name": name,
            "assessment_type": assessment_type,
            "score": score,
            "max_score": max_score,
            "weight": weight,
            "date": date,
            "percentage": round(percentage, 2),
            "uk_grade": uk_grade,
            "created_at": datetime.now().isoformat(),
        }

        self.storage.append(assessment)
        return assessment

    def get_all_for_module(self, module_id, user_id):

        # Get all assessments for a specific module

        assessments = self.storage.read_all()
        module_assessments = [
            a
            for a in assessments
            if a["module_id"] == module_id and a.get("user_id") == user_id
        ]

        # Sort by date (most recent first)
        module_assessments.sort(key=lambda x: x["date"], reverse=True)

        return module_assessments

    def get_by_id(self, assessment_id, user_id):

        # Get a specific assessment
        assessments = self.storage.read_all()
        for a in assessments:
            if a["id"] == assessment_id and a.get("user_id") == user_id:
                return a
        return None

    def update(self, assessment_id, user_id, updates):

        # Update an existing assessment
        assessments = self.storage.read_all()

        for i, a in enumerate(assessments):
            if a["id"] == assessment_id and a.get("user_id") == user_id:
                # Update fields
                if "name" in updates:
                    a["name"] = updates["name"]

                if "assessment_type" in updates:
                    if updates["assessment_type"] not in self.VALID_TYPES:
                        raise ValueError(
                            f"Invalid assessment type. Must be one of: {', '.join(self.VALID_TYPES)}"
                        )
                    a["assessment_type"] = updates["assessment_type"]

                # Update scores (recalculate percentage and grade)
                if "score" in updates or "max_score" in updates:
                    score = float(updates.get("score", a["score"]))
                    max_score = float(updates.get("max_score", a["max_score"]))

                    if score < 0 or max_score <= 0:
                        raise ValueError("Invalid score values")
                    if score > max_score:
                        raise ValueError("Score cannot exceed max score")

                    a["score"] = score
                    a["max_score"] = max_score
                    a["percentage"] = round(
                        (score / max_score * 100) if max_score > 0 else 0, 2
                    )
                    a["uk_grade"] = self.grading.calculate_grade(a["percentage"])

                if "weight" in updates:
                    weight = float(updates["weight"])
                    if weight < 0 or weight > 100:
                        raise ValueError("Weight must be between 0 and 100")
                    a["weight"] = weight

                if "date" in updates:
                    try:
                        datetime.strptime(updates["date"], "%Y-%m-%d")
                        a["date"] = updates["date"]
                    except ValueError:
                        raise ValueError("Invalid date format. Use YYYY-MM-DD")

                assessments[i] = a
                self.storage.overwrite(assessments)
                return a

        raise ValueError("Assessment not found")

    def delete(self, assessment_id, user_id):

        # Delete an assessment
        assessments = self.storage.read_all()

        for i, a in enumerate(assessments):
            if a["id"] == assessment_id and a.get("user_id") == user_id:
                assessments.pop(i)
                self.storage.overwrite(assessments)
                return True

        raise ValueError("Assessment not found")

    def delete_all_for_module(self, module_id, user_id):

        # Delete all assessments for a module (used when module is deleted)
        assessments = self.storage.read_all()
        assessments = [
            a
            for a in assessments
            if not (a["module_id"] == module_id and a.get("user_id") == user_id)
        ]
        self.storage.overwrite(assessments)
        return True
