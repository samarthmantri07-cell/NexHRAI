from fastapi import Request, status
from fastapi.responses import JSONResponse
from .logger import logger

class MLServiceException(Exception):
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected error occurred. Please try again later."},
    )

async def ml_service_exception_handler(request: Request, exc: MLServiceException):
    logger.error(f"ML Service exception: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message},
    )
