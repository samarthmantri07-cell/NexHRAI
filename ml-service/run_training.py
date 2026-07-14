import os
import sys

# Ensure the app module can be found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from datasets.loader import load_ibm_hr_dataset
from preprocessing.pipeline import HRDataPreprocessor
from training.trainer import ModelTrainer
from evaluation.evaluator import ModelEvaluator

def main():
    print("=== Starting ML Model Training and Evaluation Pipeline ===")
    
    # 1. Load Data and Preprocess
    print("1. Loading dataset and running preprocessing...")
    df = load_ibm_hr_dataset()
    preprocessor = HRDataPreprocessor(target_col='Attrition')
    X_train, X_test, y_train, y_test = preprocessor.process_and_split(df)
    
    features_used = preprocessor.numerical_features + preprocessor.categorical_features
    
    # 2. Train Models
    print("\n2. Training models with hyperparameter tuning...")
    trainer = ModelTrainer()
    trained_models = trainer.train_and_tune(X_train, y_train)
    
    # 3. Evaluate Models
    print("\n3. Evaluating models and generating comparison...")
    eval_dir = os.path.join(os.path.dirname(__file__), 'evaluation')
    evaluator = ModelEvaluator(output_dir=eval_dir)
    evaluator.evaluate_models(trained_models, X_test, y_test)
    
    # 4. Save Best Model
    print("\n4. Saving best model and metadata...")
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    evaluator.save_best_model(models_dir, features_used=features_used)
    
    print("\n=== Training Pipeline Completed Successfully ===")

if __name__ == "__main__":
    main()
