from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.router import router
from app.config.settings import get_settings
from app.utils.exceptions import MLServiceException, global_exception_handler, ml_service_exception_handler
from app.utils.logger import logger
from prediction.service import PredictionService

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models
    logger.info("Starting up ML Service and loading models...")
    app.state.prediction_service = PredictionService()
    yield
    # Shutdown: Clean up resources if needed
    logger.info("Shutting down ML Service...")

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Machine Learning Service for NexHRAI",
    lifespan=lifespan
)

# Exception handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(MLServiceException, ml_service_exception_handler)

# Include router - changing prefix to /api to match requirements
app.include_router(router, prefix="/api")

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "success", "message": "ML Service is running"}
