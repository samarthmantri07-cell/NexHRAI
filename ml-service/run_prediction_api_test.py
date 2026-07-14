import time
import requests
import sys

def main():
    print("=== Testing ML Prediction API ===")
    
    base_url = "http://127.0.0.1:8000"
    
    # 1. Health check
    print("\n1. Testing /health...")
    try:
        resp = requests.get(f"{base_url}/health")
        resp.raise_for_status()
        print(f"Health response: {resp.json()}")
    except Exception as e:
        print(f"Failed to connect to API: {e}")
        sys.exit(1)
        
    # 2. Model Info
    print("\n2. Testing /api/model/info...")
    try:
        resp = requests.get(f"{base_url}/api/model/info")
        resp.raise_for_status()
        print(f"Model Info: {resp.json().get('model_name', 'Unknown')}")
    except Exception as e:
        print(f"Failed model info: {e}")
        
    # 3. Single Prediction
    print("\n3. Testing /api/predict...")
    sample_employee = {
        "Age": 34,
        "BusinessTravel": "Travel_Rarely",
        "DailyRate": 1000,
        "Department": "Research & Development",
        "DistanceFromHome": 10,
        "Education": 3,
        "EducationField": "Life Sciences",
        "EnvironmentSatisfaction": 2,
        "Gender": "Male",
        "HourlyRate": 50,
        "JobInvolvement": 2,
        "JobLevel": 2,
        "JobRole": "Laboratory Technician",
        "JobSatisfaction": 2,
        "MaritalStatus": "Single",
        "MonthlyIncome": 2500,
        "MonthlyRate": 15000,
        "NumCompaniesWorked": 1,
        "OverTime": "Yes",
        "PercentSalaryHike": 12,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 3,
        "StockOptionLevel": 0,
        "TotalWorkingYears": 5,
        "TrainingTimesLastYear": 2,
        "WorkLifeBalance": 2,
        "YearsAtCompany": 4,
        "YearsInCurrentRole": 2,
        "YearsSinceLastPromotion": 0,
        "YearsWithCurrManager": 2
    }
    
    try:
        resp = requests.post(f"{base_url}/api/predict", json=sample_employee)
        resp.raise_for_status()
        result = resp.json()
        print(f"Prediction: {result.get('prediction')} (Prob: {result.get('probability'):.2f})")
        print(f"Top Risk Factor: {result.get('riskFactors')[0]['feature'] if result.get('riskFactors') else 'None'}")
        print(f"Recommendations: {result.get('recommendations')}")
    except Exception as e:
        print(f"Failed single prediction: {e}")
        if 'resp' in locals():
            print(resp.text)
            
    # 4. Batch Prediction
    print("\n4. Testing /api/predict/batch...")
    try:
        batch_payload = {"employees": [sample_employee, sample_employee]}
        resp = requests.post(f"{base_url}/api/predict/batch", json=batch_payload)
        resp.raise_for_status()
        result = resp.json()
        print(f"Batch processed: {len(result.get('results', []))} predictions.")
    except Exception as e:
        print(f"Failed batch prediction: {e}")
        if 'resp' in locals():
            print(resp.text)

    print("\n=== All Tests Completed ===")

if __name__ == "__main__":
    main()
