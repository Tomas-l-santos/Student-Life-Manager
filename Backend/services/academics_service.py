# This service coordinates between module, assessment, analytics, and notes classes which provides a unified interface for the routes layer

from models.Academics import Modules, Assessments, AcademicAnalytics, Notes


class AcademicsService:

    def __init__(self):
        self.modules = Modules()
        self.assessments = Assessments()
        self.analytics = AcademicAnalytics()
        self.notes = Notes()

    # ------ MODULES OPERATIONS ------

    def create_module(
        self,
        user_email,
        name,
        code,
        credits,
        year_of_study,
        academic_year,
        deadline,
        status="in_progress",
    ):

        # Create a new module
        return self.modules.create(
            user_email,
            name,
            code,
            credits,
            year_of_study,
            academic_year,
            deadline,
            status,
        )

    def get_user_modules(
        self, user_email, year_of_study=None, academic_year=None, status=None
    ):

        # Get all modules for a user
        return self.modules.get_all(user_email, year_of_study, academic_year, status)

    def get_module_by_id(self, module_id, user_email):

        # Get a specific module
        return self.modules.get_by_id(module_id, user_email)

    def update_module(self, module_id, user_email, updates):

        # Update a module
        return self.modules.update(module_id, user_email, updates)

    def delete_module(self, module_id, user_email):

        # Delete a assesments then its modules
        self.assessments.delete_all_for_module(module_id, user_email)

        return self.modules.delete(module_id, user_email)

    # ------ ASSESSMENTS OPERATIONS ------

    def create_assessment(
        self,
        user_email,
        module_id,
        name,
        assessment_type,
        score,
        max_score,
        weight,
        date,
    ):

        # Create a new assessment

        # Get module info first
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")

        return self.assessments.create(
            user_email=user_email,
            module_id=module_id,
            module_name=module["name"],
            module_code=module["code"],
            name=name,
            assessment_type=assessment_type,
            score=score,
            max_score=max_score,
            weight=weight,
            date=date,
        )

    def get_module_assessments(self, module_id, user_email):

        # Get all assessments for a module

        # Verify module exists
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")

        return self.assessments.get_all_for_module(module_id, user_email)

    def get_assessment_by_id(self, assessment_id, user_email):

        # Get a specific assessment
        return self.assessments.get_by_id(assessment_id, user_email)

    def update_assessment(self, assessment_id, user_email, updates):

        # Update an assessment
        return self.assessments.update(assessment_id, user_email, updates)

    def delete_assessment(self, assessment_id, user_email):

        # Delete an assessment
        return self.assessments.delete(assessment_id, user_email)

    # ------ ANALYTICS OPERATIONS ------

    def calculate_module_grade(self, module_id, user_email):

        # Calculate grade for a module
        return self.analytics.calculate_module_grade(module_id, user_email)

    def get_year_overview(self, user_email, year_of_study, academic_year):

        # Get year overview with all modules and grades
        return self.analytics.get_year_overview(
            user_email, year_of_study, academic_year
        )

    def get_module_summary(self, module_id, user_email):

        # Get quick module summary
        return self.analytics.get_module_summary(module_id, user_email)

    # ------ NOTES OPERATIONS ------

    def create_note(self, user_email, module_id, title, topic, content, tags=None):

        # Create a new note for a module

        # Get module info first
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")

        return self.notes.create(
            user_email=user_email,
            module_id=module_id,
            module_name=module["name"],
            module_code=module["code"],
            title=title,
            topic=topic,
            content=content,
            tags=tags,
        )

    def get_module_notes(
        self, module_id, user_email, topic=None, include_archived=False
    ):

        # Get all notes for a module

        # Verify module exists
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")

        return self.notes.get_all_for_module(
            module_id, user_email, topic, include_archived
        )

    def get_module_topics(self, module_id, user_email):

        # Get all topics for a module's notes

        # Verify module exists
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")

        return self.notes.get_topics_for_module(module_id, user_email)

    def get_note_by_id(self, note_id, user_email):

        # Get a specific note
        return self.notes.get_by_id(note_id, user_email)

    def update_note(self, note_id, user_email, updates):

        # Update a note
        return self.notes.update(note_id, user_email, updates)

    def delete_note(self, note_id, user_email):

        # Delete a note
        return self.notes.delete(note_id, user_email)

    def search_notes(self, user_email, query, module_id=None):

        # Search notes
        return self.notes.search_notes(user_email, query, module_id)

    def pin_note(self, note_id, user_email):

        # Pin a note to the top
        return self.notes.pin_note(note_id, user_email)

    def unpin_note(self, note_id, user_email):

        # Unpin a note
        return self.notes.unpin_note(note_id, user_email)

    def archive_note(self, note_id, user_email):

        # Archive a note
        return self.notes.archive_note(note_id, user_email)

    def unarchive_note(self, note_id, user_email):

        # Unarchive a note
        return self.notes.unarchive_note(note_id, user_email)
