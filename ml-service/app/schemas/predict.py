from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional

class FeatureImpact(BaseModel):
    feature: str
    impact: float

class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    confidence: float
    riskLevel: str
    riskFactors: List[FeatureImpact]
    retentionFactors: List[FeatureImpact]
    recommendations: List[str]
    model: str

class BatchPredictionRequest(BaseModel):
    employees: List[Dict[str, Any]]
    
class BatchPredictionResponse(BaseModel):
    results: List[PredictionResponse]
    model: str
