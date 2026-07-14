import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from app.schemas.predict import PredictionResponse, FeatureImpact
from explainability.service import SHAPExplainer, RecommendationEngine
from preprocessing.pipeline import HRDataPreprocessor
from app.utils.logger import logger

class PredictionService:
    def __init__(self, models_dir: str = 'models'):
        self.models_dir = models_dir
        self.model = None
        self.preprocessor_pipeline = None
        self.target_encoder = None
        self.feature_lists = None
        self.explainer = None
        
        # Load artifacts
        self._load_artifacts()

    def _load_artifacts(self):
        """Load trained model and preprocessing artifacts."""
        try:
            logger.info("Loading ML artifacts...")
            
            model_path = os.path.join(self.models_dir, 'best_model.joblib')
            preprocessor_path = os.path.join(self.models_dir, 'preprocessor.pkl')
            features_path = os.path.join(self.models_dir, 'features.pkl')
            
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                self.explainer = SHAPExplainer(self.model)
            else:
                logger.error("best_model.joblib not found!")
                
            if os.path.exists(preprocessor_path):
                self.preprocessor_pipeline = joblib.load(preprocessor_path)
                
            if os.path.exists(features_path):
                self.feature_lists = joblib.load(features_path)
                
            logger.info("ML artifacts loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading ML artifacts: {e}")

    def _apply_preprocessing(self, raw_data: Dict[str, Any]) -> pd.DataFrame:
        """Apply feature engineering and sklearn pipeline."""
        df = pd.DataFrame([raw_data])
        df_eng = df.copy()
        
        # We need the feature lists for pipeline transformation
        numerical_features = self.feature_lists.get('numerical', []) if self.feature_lists else []
        categorical_features = self.feature_lists.get('categorical', []) if self.feature_lists else []
        
        # Manual Feature Engineering (replicating training logic without qcut issues)
        if 'MonthlyIncome' in df_eng.columns:
            df_eng['IncomePerYear'] = df_eng['MonthlyIncome'] * 12
            
        if 'YearsInCurrentRole' in df_eng.columns and 'YearsAtCompany' in df_eng.columns:
            df_eng['StabilityRatio'] = df_eng.apply(
                lambda row: row['YearsInCurrentRole'] / row['YearsAtCompany'] if row['YearsAtCompany'] > 0 else 0, axis=1
            )
            
        if 'YearsSinceLastPromotion' in df_eng.columns and 'YearsAtCompany' in df_eng.columns:
            df_eng['PromotionStagnation'] = df_eng.apply(
                lambda row: row['YearsSinceLastPromotion'] / row['YearsAtCompany'] if row['YearsAtCompany'] > 0 else 0, axis=1
            )
            
        if 'TotalWorkingYears' in df_eng.columns and 'NumCompaniesWorked' in df_eng.columns:
            df_eng['YearsPerCompany'] = df_eng.apply(
                lambda row: row['TotalWorkingYears'] / row['NumCompaniesWorked'] if row['NumCompaniesWorked'] > 0 else row['TotalWorkingYears'], axis=1
            )
            
        if 'TotalWorkingYears' in df_eng.columns:
            df_eng['ExperienceLevel'] = pd.cut(
                df_eng['TotalWorkingYears'], 
                bins=[-1, 2, 5, 10, 20, 50], 
                labels=['Entry', 'Junior', 'Mid', 'Senior', 'Executive']
            ).astype(str)
            
        if 'Age' in df_eng.columns:
            df_eng['AgeGroup'] = pd.cut(
                df_eng['Age'], 
                bins=[0, 25, 35, 45, 55, 100], 
                labels=['GenZ', 'YoungMillennial', 'OlderMillennial', 'GenX', 'Boomer']
            ).astype(str)
            
        if 'MonthlyIncome' in df_eng.columns:
            # Fixed bins instead of qcut for single-row inference
            df_eng['SalaryBand'] = pd.cut(
                df_eng['MonthlyIncome'], 
                bins=[0, 2911, 4919, 8379, 100000], # Approximated quartiles from HR dataset
                labels=['Low', 'Medium', 'High', 'Premium']
            ).astype(str)
            
        if 'YearsAtCompany' in df_eng.columns:
            df_eng['TenureGroup'] = pd.cut(
                df_eng['YearsAtCompany'], 
                bins=[-1, 1, 3, 7, 15, 50], 
                labels=['Newbie', 'Settling', 'Established', 'Veteran', 'Lifer']
            ).astype(str)
        
        # Ensure all expected columns are present, even if missing in input
        expected_cols = numerical_features + categorical_features
        for col in expected_cols:
            if col not in df_eng.columns:
                df_eng[col] = 0 if col in numerical_features else 'Unknown'
                
        # Only keep the expected columns in the right order for the pipeline
        X = df_eng[expected_cols]
        
        # Apply sklearn pipeline
        X_transformed = self.preprocessor_pipeline.transform(X)
        return X_transformed

    def predict(self, features: Dict[str, Any]) -> PredictionResponse:
        """Generate prediction, SHAP explanation, and recommendations."""
        if not self.model or not self.preprocessor_pipeline:
            raise ValueError("Model or preprocessor not loaded.")
            
        # 1. Preprocess
        X_transformed = self._apply_preprocessing(features)
        
        # 2. Predict
        # For binary classification (Attrition), predicting 1 means 'Yes' (High Risk)
        prediction_val = self.model.predict(X_transformed)[0]
        probabilities = self.model.predict_proba(X_transformed)[0]
        
        # Assuming class 1 is Attrition=Yes (Risk)
        risk_prob = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
        confidence = float(np.max(probabilities))
        
        prediction_label = "High Risk" if prediction_val == 1 else "Low Risk"
        risk_level = "High" if risk_prob >= 0.7 else "Medium" if risk_prob >= 0.4 else "Low"
        
        # 3. Explain (SHAP)
        # Attempt to get feature names out of the pipeline for better SHAP explanation
        feature_names = None
        try:
            feature_names = self.preprocessor_pipeline.named_steps['preprocessor'].get_feature_names_out()
            feature_names = [f.split('__')[-1] for f in feature_names] # Clean names like num__Age -> Age
        except Exception:
            pass
            
        risk_factors, retention_factors = [], []
        if self.explainer:
            risk_factors, retention_factors = self.explainer.explain_prediction(X_transformed, feature_names)
            
        # 4. Recommend
        recommendations = RecommendationEngine.generate_recommendations(features, risk_factors)
        
        # Determine model name
        model_name = self.model.__class__.__name__
        if 'XGB' in model_name:
            model_name = 'XGBoost'
            
        # Map FeatureImpact dictionaries to Pydantic models
        rf_models = [FeatureImpact(**f) for f in risk_factors]
        ret_models = [FeatureImpact(**f) for f in retention_factors]
        
        return PredictionResponse(
            prediction=prediction_label,
            probability=risk_prob,
            confidence=confidence,
            riskLevel=risk_level,
            riskFactors=rf_models,
            retentionFactors=ret_models,
            recommendations=recommendations,
            model=model_name
        )

    def predict_batch(self, batch_features: List[Dict[str, Any]]) -> List[PredictionResponse]:
        """Generate predictions for a batch of employees."""
        return [self.predict(f) for f in batch_features]
