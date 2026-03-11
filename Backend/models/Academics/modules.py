from storage.storagerepo import JSONStorage
from models.Academics.grading import GradingSystem
from datetime import datetime


class Modules:
    #manages academic modules
    
    def __init__(self, storage_path="data/modules.json"):
        self.storage = JSONStorage(storage_path)
        self.grading = GradingSystem()
    
    def _generate_id(self):
        
        #Generate unique module ID
        modules = self.storage.read_all()
        if not modules:
            return 1
        return max(m["id"] for m in modules) + 1
    
    def create(self, user_email, name, code, credits, year_of_study, academic_year, status="in_progress"):

        # Validate inputs
        if not name or not code:
            raise ValueError("Module name and code are required")
        
        try:
            credits = int(credits)
            if not self.grading.validate_uk_credits(credits):
                valid_values = self.grading.get_valid_credit_values()
                raise ValueError(f"Credits must be one of: {', '.join(map(str, valid_values))}")
        except ValueError as e:
            if "Credits must be" in str(e):
                raise
            raise ValueError("Invalid credits value")
        
        try:
            year_of_study = int(year_of_study)
            if year_of_study < 1 or year_of_study > 4:
                raise ValueError("Year of study must be 1, 2, 3, or 4")
        except ValueError:
            raise ValueError("Invalid year of study")
        
        # Check for duplicates
        if self._module_exists(user_email, code, academic_year):
            raise ValueError("Module with this code already exists for this academic year")
        
        module = {
            "id": self._generate_id(),
            "user_email": user_email,
            "name": name,
            "code": code,
            "credits": credits,
            "year_of_study": year_of_study,
            "academic_year": academic_year,
            "status": status,
            "created_at": datetime.now().isoformat()
        }
        
        self.storage.append(module)
        return module
    
    def _module_exists(self, user_email, code, academic_year):
        
        #Check if module already exists
        modules = self.storage.read_all()
        for m in modules:
            if (m["user_email"] == user_email and 
                m["code"] == code and 
                m["academic_year"] == academic_year and 
                m["status"] != "dropped"):
                return True
        return False
    
    def get_all(self, user_email, year_of_study=None, academic_year=None, status=None):
        
        #Get all modules for a user with optional filters
        modules = self.storage.read_all()
        user_modules = [m for m in modules if m["user_email"] == user_email]
        
        # Apply filters
        if year_of_study:
            user_modules = [m for m in user_modules if m["year_of_study"] == year_of_study]
        
        if academic_year:
            user_modules = [m for m in user_modules if m["academic_year"] == academic_year]
        
        if status:
            user_modules = [m for m in user_modules if m["status"] == status]
        
        # Sort by academic year and year of study
        user_modules.sort(key=lambda x: (x["academic_year"], x["year_of_study"]), reverse=True)
        
        return user_modules
    
    def get_by_id(self, module_id, user_email):
        
        #Get a specific module
        modules = self.storage.read_all()
        for m in modules:
            if m["id"] == module_id and m["user_email"] == user_email:
                return m
        return None
    
    def update(self, module_id, user_email, updates):
        
        #Update an existing module
        modules = self.storage.read_all()
        
        for i, m in enumerate(modules):
            if m["id"] == module_id and m["user_email"] == user_email:
                # Update fields
                if "name" in updates:
                    m["name"] = updates["name"]
                
                if "code" in updates:
                    m["code"] = updates["code"]
                
                if "credits" in updates:
                    credits = int(updates["credits"])
                    if not self.grading.validate_uk_credits(credits):
                        valid_values = self.grading.get_valid_credit_values()
                        raise ValueError(f"Credits must be one of: {', '.join(map(str, valid_values))}")
                    m["credits"] = credits
                
                if "year_of_study" in updates:
                    year_of_study = int(updates["year_of_study"])
                    if year_of_study < 1 or year_of_study > 4:
                        raise ValueError("Year of study must be 1, 2, 3, or 4")
                    m["year_of_study"] = year_of_study
                
                if "academic_year" in updates:
                    m["academic_year"] = updates["academic_year"]
                
                if "status" in updates:
                    if updates["status"] not in ["in_progress", "completed", "dropped"]:
                        raise ValueError("Invalid status")
                    m["status"] = updates["status"]
                
                modules[i] = m
                self.storage.overwrite(modules)
                return m
        
        raise ValueError("Module not found")
    
    def delete(self, module_id, user_email):
        
        #Delete a module
        modules = self.storage.read_all()
        
        for i, m in enumerate(modules):
            if m["id"] == module_id and m["user_email"] == user_email:
                modules.pop(i)
                self.storage.overwrite(modules)
                return True
        
        raise ValueError("Module not found")