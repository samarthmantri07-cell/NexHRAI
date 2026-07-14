import os
import sys
import numpy as np

# Ensure the app module can be found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from datasets.loader import load_ibm_hr_dataset
from preprocessing.pipeline import HRDataPreprocessor

def main():
    print("=== Testing ML Preprocessing Pipeline ===")
    
    # Load dataset
    print("Loading dataset...")
    df = load_ibm_hr_dataset()
    
    # Initialize preprocessor
    preprocessor = HRDataPreprocessor(target_col='Attrition')
    
    # Run full pipeline
    print("Running process and split...")
    X_train, X_test, y_train, y_test = preprocessor.process_and_split(df)
    
    # Verify no missing values
    print("Verifying no missing values in output arrays...")
    assert not np.isnan(X_train).any(), "Missing values found in X_train"
    assert not np.isnan(X_test).any(), "Missing values found in X_test"
    
    # Save models
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    print(f"Saving pipeline to {models_dir}...")
    preprocessor.save_pipeline(models_dir)
    
    print("Verification completed successfully. All components working as expected.")

if __name__ == "__main__":
    main()
