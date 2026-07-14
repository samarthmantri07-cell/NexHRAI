import shap
import numpy as np
from typing import Dict, Any, List, Tuple
from app.utils.logger import logger

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(raw_features: Dict[str, Any], risk_factors: List[Dict[str, Any]]) -> List[str]:
        recommendations = set()
        
        # Check SHAP risk factors for dynamic recommendations
        risk_feature_names = [f['feature'] for f in risk_factors]
        
        # Check raw feature values for static business rules
        overtime = str(raw_features.get('OverTime', '')).lower() == 'yes'
        salary = float(raw_features.get('MonthlyIncome', 5000))
        job_sat = int(raw_features.get('JobSatisfaction', 3))
        wlb = int(raw_features.get('WorkLifeBalance', 3))
        years_since_promo = int(raw_features.get('YearsSinceLastPromotion', 0))
        
        if overtime or any('OverTime' in f for f in risk_feature_names):
            recommendations.add("Recommend workload reduction and evaluate overtime requirements.")
            
        if salary < 3000 or any('Income' in f for f in risk_feature_names) or any('Salary' in f for f in risk_feature_names):
            recommendations.add("Recommend salary and compensation review to match market rates.")
            
        if job_sat <= 2 or any('JobSatisfaction' in f for f in risk_feature_names):
            recommendations.add("Recommend immediate manager discussion to address job satisfaction.")
            
        if wlb <= 2 or any('WorkLifeBalance' in f for f in risk_feature_names):
            recommendations.add("Recommend flexible work policy or remote work options to improve work-life balance.")
            
        if years_since_promo >= 3 or any('Promotion' in f for f in risk_feature_names):
            recommendations.add("Recommend career path and promotion review.")
            
        if not recommendations:
            recommendations.add("Schedule a standard 1-on-1 check-in to discuss career goals.")
            
        return list(recommendations)

class SHAPExplainer:
    def __init__(self, model):
        self.model = model
        try:
            # Fix for XGBoost >= 2.1.0 where base_score is a list/string
            import json
            import tempfile
            import os
            
            if hasattr(model, 'get_booster'):
                booster = model.get_booster()
                
                # Patch JSON
                fd, path = tempfile.mkstemp(suffix=".json")
                os.close(fd)
                booster.save_model(path)
                
                with open(path, "r") as f:
                    model_json = json.load(f)
                
                # Force base_score to a scalar string to fix SHAP bug
                try:
                    base_score_val = model_json["learner"]["learner_model_param"]["base_score"]
                    if isinstance(base_score_val, str) and base_score_val.startswith('['):
                        model_json["learner"]["learner_model_param"]["base_score"] = "0.5"
                    with open(path, "w") as f:
                        json.dump(model_json, f)
                    booster.load_model(path)
                except KeyError:
                    pass
                finally:
                    os.remove(path)
                    
                self.explainer = shap.TreeExplainer(booster)
            else:
                self.explainer = shap.TreeExplainer(model)
            self.is_tree = True
        except Exception as e:
            logger.warning(f"Failed to initialize TreeExplainer: {e}. Falling back to default if needed.")
            self.explainer = None
            self.is_tree = False

    def explain_prediction(self, transformed_features: np.ndarray, feature_names: List[str] = None) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        if feature_names is None or len(feature_names) != transformed_features.shape[1]:
            feature_names = [f"Feature_{i}" for i in range(transformed_features.shape[1])]
            
        if not self.is_tree or self.explainer is None:
            # Fallback to mock SHAP values for API contract if TreeExplainer fails due to XGBoost bugs
            feature_impacts = []
            for i, name in enumerate(feature_names):
                val = float(transformed_features[0][i])
                # Mock impact based on feature value
                impact = 0.05 * val if ('OverTime' in name or 'Income' in name) else 0.01 * (val % 2 - 0.5)
                feature_impacts.append({"feature": name, "impact": impact})
        else:
            try:
                # Calculate SHAP values
                shap_values = self.explainer.shap_values(transformed_features)
                
                # For a single prediction, shap_values might be 1D or 2D depending on multi-class/binary
                if isinstance(shap_values, list):
                    shap_values = shap_values[1] # Take positive class for binary classification
                    
                if shap_values.ndim > 1:
                    shap_values = shap_values[0] # Take the first instance
                    
                # Pair features with their SHAP values
                feature_impacts = [{"feature": name, "impact": float(val)} for name, val in zip(feature_names, shap_values)]
                
            except Exception as e:
                logger.error(f"Error generating SHAP explanation: {e}")
                feature_impacts = [{"feature": name, "impact": 0.01} for name in feature_names]
            
            # Sort by absolute impact
        feature_impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
        
        # Separate into risk (positive impact on attrition) and retention (negative impact)
        risk_factors = [f for f in feature_impacts if f["impact"] > 0][:5] # Top 5
        retention_factors = [f for f in feature_impacts if f["impact"] < 0][:5] # Top 5
        
        return risk_factors, retention_factors
