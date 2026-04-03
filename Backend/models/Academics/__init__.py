# This package contains all the data models used in the Academics application

from models.Academics.modules import Modules
from models.Academics.assessments import Assessments
from models.Academics.grading import GradingSystem
from models.Academics.analytics import AcademicAnalytics
from models.Academics.notes import Notes

__all__ = ["Modules", "Assessments", "GradingSystem", "AcademicAnalytics", "Notes"]
