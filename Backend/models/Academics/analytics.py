from models.Academics.modules import Modules
from models.Academics.assessments import Assessments
from models.Academics.grading import GradingSystem

class AcademicAnalytics:
    #Service for academic analytics and grade calculations
    
    def __init__(self):
        self.module_service = Modules()
        self.assessment_service = Assessments()
        self.grading = GradingSystem()
    
    def calculate_module_grade(self, module_id, user_email):

        # Get module
        module = self.module_service.get_by_id(module_id, user_email)
        if not module:
            raise ValueError("Module not found")
        
        # Get assessments
        assessments = self.assessment_service.get_all_for_module(module_id, user_email)
        
        if not assessments:
            return {
                "module_id": module_id,
                "module_name": module["name"],
                "module_code": module["code"],
                "module_credits": module["credits"],
                "current_percentage": None,
                "uk_grade": None,
                "uk_classification": None,
                "total_weight": 0,
                "remaining_weight": 100,
                "assessments_count": 0,
                "message": "No assessments recorded"
            }
        
        # Calculate weighted average
        total_weighted_score = 0
        total_weight = 0
        
        for assessment in assessments:
            percentage = (assessment["score"] / assessment["max_score"]) * 100
            weighted_contribution = (percentage * assessment["weight"]) / 100
            total_weighted_score += weighted_contribution
            total_weight += assessment["weight"]
        
        # Current grade based on completed assessments
        current_percentage = total_weighted_score if total_weight > 0 else 0
        
        # Get UK grade and classification
        uk_grade = self.grading.calculate_grade(current_percentage)
        classification = self.grading.get_classification(current_percentage)
        
        return {
            "module_id": module_id,
            "module_name": module["name"],
            "module_code": module["code"],
            "module_credits": module["credits"],
            "current_percentage": round(current_percentage, 2),
            "uk_grade": uk_grade,
            "uk_classification": classification,
            "total_weight": round(total_weight, 2),
            "remaining_weight": round(100 - total_weight, 2),
            "assessments_count": len(assessments),
            "assessments": assessments
        }
    
    def get_year_overview(self, user_email, year_of_study, academic_year):

        # Get all modules for the year
        modules = self.module_service.get_all(
            user_email, 
            year_of_study=year_of_study, 
            academic_year=academic_year
        )
        
        overview = []
        total_credits = 0
        weighted_percentage = 0
        
        for module in modules:
            # Skip dropped modules
            if module["status"] == "dropped":
                continue
            
            # Get grade info for module
            grade_info = self.calculate_module_grade(module["id"], user_email)
            
            module_data = {
                "module": module,
                "grade_info": grade_info
            }
            
            overview.append(module_data)
            
            # Calculate year average contribution (weighted by credits)
            # Only count modules with at least 40% of assessments completed
            if grade_info["current_percentage"] is not None and grade_info["total_weight"] >= 40:
                total_credits += module["credits"]
                weighted_percentage += grade_info["current_percentage"] * module["credits"]
        
        # Calculate year average
        year_average = (weighted_percentage / total_credits) if total_credits > 0 else 0
        
        # Get overall classification
        classification = self.grading.get_classification(year_average) if year_average > 0 else None
        
        return {
            "year_of_study": year_of_study,
            "academic_year": academic_year,
            "modules": overview,
            "total_credits": total_credits,
            "year_average": round(year_average, 2),
            "uk_classification": classification
        }
    
    def get_module_summary(self, module_id, user_email):

        grade_info = self.calculate_module_grade(module_id, user_email)
        
        return {
            "module_name": grade_info["module_name"],
            "module_code": grade_info["module_code"],
            "current_grade": grade_info["uk_grade"],
            "percentage": grade_info["current_percentage"],
            "progress": f"{grade_info['total_weight']}% complete"
        }