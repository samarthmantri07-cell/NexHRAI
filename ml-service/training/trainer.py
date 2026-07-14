import os
import joblib
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from app.utils.logger import logger

class ModelTrainer:
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
        self.models = self._initialize_models()
        self.param_grids = self._initialize_param_grids()
        self.trained_models = {}

    def _initialize_models(self) -> Dict[str, Any]:
        """Initialize the base classifiers."""
        return {
            'Logistic Regression': LogisticRegression(random_state=self.random_state, max_iter=1000),
            'Decision Tree': DecisionTreeClassifier(random_state=self.random_state),
            'Random Forest': RandomForestClassifier(random_state=self.random_state),
            'XGBoost': XGBClassifier(random_state=self.random_state, use_label_encoder=False, eval_metric='logloss')
        }

    def _initialize_param_grids(self) -> Dict[str, Dict[str, List[Any]]]:
        """Define hyperparameters for GridSearchCV."""
        return {
            'Logistic Regression': {
                'C': [0.1, 1.0, 10.0],
                'solver': ['liblinear', 'lbfgs']
            },
            'Decision Tree': {
                'max_depth': [None, 5, 10, 15],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'Random Forest': {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 10, 20],
                'min_samples_leaf': [1, 2, 4]
            },
            'XGBoost': {
                'n_estimators': [50, 100, 200],
                'max_depth': [3, 5, 7],
                'learning_rate': [0.01, 0.1, 0.2],
                'subsample': [0.8, 1.0]
            }
        }

    def train_and_tune(self, X_train: np.ndarray, y_train: np.ndarray) -> Dict[str, Any]:
        """Run GridSearchCV for all defined models."""
        logger.info("Starting model training and hyperparameter tuning...")
        
        for name, model in self.models.items():
            logger.info(f"Training {name}...")
            param_grid = self.param_grids.get(name, {})
            
            grid_search = GridSearchCV(
                estimator=model,
                param_grid=param_grid,
                cv=self.cv,
                scoring='f1_weighted', # Use weighted F1 for imbalanced dataset
                n_jobs=-1,
                verbose=1
            )
            
            grid_search.fit(X_train, y_train)
            
            self.trained_models[name] = {
                'best_estimator': grid_search.best_estimator_,
                'best_params': grid_search.best_params_,
                'best_cv_score': grid_search.best_score_
            }
            logger.info(f"{name} best CV score (F1 weighted): {grid_search.best_score_:.4f}")
            
        logger.info("All models trained successfully.")
        return self.trained_models
