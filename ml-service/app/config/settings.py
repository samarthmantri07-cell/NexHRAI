from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "NexHR ML Service"
    version: str = "1.0.0"
    debug: bool = False
    
    # Dataset configurations
    dataset_path: str = "../datasets/raw/WA_Fn-UseC_-HR-Employee-Attrition.csv"

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()
