import pandas as pd
import zipfile
import io
from app.config.settings import get_settings
from app.utils.logger import logger

settings = get_settings()

def load_ibm_hr_dataset(path: str = None) -> pd.DataFrame:
    """
    Load the IBM HR Analytics Employee Attrition & Performance dataset.
    This utility extracts the CSV file from the ZIP archive in the datasets folder.
    """
    dataset_path = path or settings.dataset_path
    logger.info(f"Loading dataset from {dataset_path}")
    
    try:
        # Check if it's a zip or csv based on extension
        if str(dataset_path).lower().endswith('.zip'):
            with zipfile.ZipFile(dataset_path, 'r') as z:
                # Assuming there is only one CSV file in the zip or a specific one we want
                csv_files = [f for f in z.namelist() if f.endswith('.csv')]
                if not csv_files:
                    raise FileNotFoundError("No CSV file found in the zip archive")
                
                # Read the first CSV file found
                with z.open(csv_files[0]) as f:
                    df = pd.read_csv(f)
        else:
            # Direct CSV read
            df = pd.read_csv(dataset_path)
            
        logger.info(f"Successfully loaded dataset with shape: {df.shape}")
        return df
                
    except Exception as e:
        logger.error(f"Failed to load dataset: {str(e)}")
        raise
