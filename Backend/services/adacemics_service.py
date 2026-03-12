#This service coordinates between module, assessment, and analytics classes which provides a unified interface for the routes layer

from models.Academics.modules import Modules
from models.Academics.assessments import Assessments
from models.Academics.analytics import AcademicAnalytics


class AcademicsService:
    
    def __init__(self):
        self.modules = Modules()
        self.assessments = Assessments()
        self.analytics = AcademicAnalytics()
    
    
    
    # ------ MODULES OPERATIONS ------
    
    def create_module(self, user_email, name, code, credits, year_of_study, academic_year, status="in_progress"):
        
        #Create a new module
        return self.modules.create(user_email, name, code, credits, year_of_study, academic_year, status)
    
    def get_user_modules(self, user_email, year_of_study=None, academic_year=None, status=None):
        
        #Get all modules for a user
        return self.modules.get_all(user_email, year_of_study, academic_year, status)
    
    def get_module_by_id(self, module_id, user_email):
        
        #Get a specific module
        return self.modules.get_by_id(module_id, user_email)
    
    def update_module(self, module_id, user_email, updates):
        
        #Update a module
        return self.modules.update(module_id, user_email, updates)
    
    def delete_module(self, module_id, user_email):
        
        #Delete a assesments then its modules
        self.assessments.delete_all_for_module(module_id, user_email)
        
        return self.modules.delete(module_id, user_email)
    
    
    
    # ------ ASSESSMENTS OPERATIONS ------
    
    def create_assessment(self, user_email, module_id, name, assessment_type, score, max_score, weight, date):
        
        #Create a new assessment
        
        #Get module info first
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
            date=date
        )
    
    def get_module_assessments(self, module_id, user_email):
        
        #Get all assessments for a module
        
        # Verify module exists
        module = self.modules.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")
        
        return self.assessments.get_all_for_module(module_id, user_email)
    
    def get_assessment_by_id(self, assessment_id, user_email):
        
        #Get a specific assessment
        return self.assessments.get_by_id(assessment_id, user_email)
    
    def update_assessment(self, assessment_id, user_email, updates):
        
        #Update an assessment
        return self.assessments.update(assessment_id, user_email, updates)
    
    def delete_assessment(self, assessment_id, user_email):
        
        #Delete an assessment
        return self.assessments.delete(assessment_id, user_email)
    
    
    
    # ------ ANALYTICS OPERATIONS ------
    
    def calculate_module_grade(self, module_id, user_email):
        
        #Calculate grade for a module
        return self.analytics.calculate_module_grade(module_id, user_email)
    
    def get_year_overview(self, user_email, year_of_study, academic_year):
        
        #Get year overview with all modules and grades
        return self.analytics.get_year_overview(user_email, year_of_study, academic_year)
    
    def get_module_summary(self, module_id, user_email):
        
        #Get quick module summary
        return self.analytics.get_module_summary(module_id, user_email)