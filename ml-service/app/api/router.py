import os
import json
from fastapi import APIRouter, HTTPException, Depends, Request
from app.utils.logger import logger
from app.schemas.predict import PredictionResponse, BatchPredictionRequest, BatchPredictionResponse
from prediction.service import PredictionService

router = APIRouter()

# Dependency to get prediction service from app state
def get_prediction_service(request: Request) -> PredictionService:
    service = getattr(request.app.state, "prediction_service", None)
    if not service:
        raise HTTPException(status_code=503, detail="Prediction service is not available.")
    return service

@router.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the NexHR ML Service API"}

@router.post("/predict", response_model=PredictionResponse)
async def predict_employee_attrition(
    features: dict,
    service: PredictionService = Depends(get_prediction_service)
):
    """Predict attrition risk for a single employee."""
    try:
        logger.info(f"Received prediction request for employee data")
        return service.predict(features)
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_employee_attrition_batch(
    request: BatchPredictionRequest,
    service: PredictionService = Depends(get_prediction_service)
):
    """Predict attrition risk for a batch of employees."""
    try:
        logger.info(f"Received batch prediction request for {len(request.employees)} employees")
        results = service.predict_batch(request.employees)
        return BatchPredictionResponse(
            results=results,
            model=results[0].model if results else "Unknown"
        )
    except Exception as e:
        logger.error(f"Batch prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/info")
async def get_model_info():
    """Retrieve metadata about the currently loaded model."""
    try:
        metadata_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models', 'model_metadata.json')
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                return json.load(f)
        return {"status": "Metadata not found"}
    except Exception as e:
        logger.error(f"Failed to retrieve model info: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve model info")
