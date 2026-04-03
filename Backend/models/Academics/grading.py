# Grading system for UK


class GradingSystem:

    @staticmethod
    def calculate_grade(percentage):

        if percentage >= 70:
            return "First Class (1st)"
        elif percentage >= 60:
            return "Upper Second Class (2:1)"
        elif percentage >= 50:
            return "Lower Second Class (2:2)"
        elif percentage >= 40:
            return "Third Class (3rd)"
        else:
            return "Fail"

    @staticmethod
    def get_classification(overall_percentage):

        if overall_percentage >= 70:
            return {
                "classification": "First Class Honours",
                "abbreviation": "1st",
                "description": "Excellent achievement",
            }
        elif overall_percentage >= 60:
            return {
                "classification": "Upper Second Class Honours",
                "abbreviation": "2:1",
                "description": "Good achievement",
            }
        elif overall_percentage >= 50:
            return {
                "classification": "Lower Second Class Honours",
                "abbreviation": "2:2",
                "description": "Satisfactory achievement",
            }
        elif overall_percentage >= 40:
            return {
                "classification": "Third Class Honours",
                "abbreviation": "3rd",
                "description": "Pass",
            }
        else:
            return {
                "classification": "Fail",
                "abbreviation": "Fail",
                "description": "Below pass standard",
            }

    @staticmethod
    def validate_uk_credits(credits):

        return credits in [10, 15, 20, 30, 40, 60]

    @staticmethod
    def get_valid_credit_values():

        return [10, 15, 20, 30, 40, 60]
