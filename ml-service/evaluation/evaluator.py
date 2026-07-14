import os
import json
import joblib
import datetime
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, Any, List

from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, roc_auc_score, confusion_matrix, 
    classification_report, roc_curve, auc
)
from app.utils.logger import logger

class ModelEvaluator:
    def __init__(self, output_dir: str = 'evaluation'):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.evaluation_results = []
        self.best_model_name = None
        self.best_model = None

    def evaluate_models(self, trained_models: Dict[str, Any], X_test: np.ndarray, y_test: np.ndarray):
        """Evaluate all trained models and collect metrics."""
        logger.info("Evaluating models on test set...")
        
        plt.figure(figsize=(10, 8))
        
        for name, data in trained_models.items():
            model = data['best_estimator']
            
            # Predict
            y_pred = model.predict(X_test)
            y_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
            
            # Metrics
            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
            rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
            f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
            
            roc_auc = 0.0
            if y_proba is not None:
                try:
                    roc_auc = roc_auc_score(y_test, y_proba)
                except ValueError:
                    pass # Handled if multi-class, but this is binary (Attrition)
                    
            # Confusion Matrix
            cm = confusion_matrix(y_test, y_pred)
            self._plot_confusion_matrix(cm, name)
            
            # Classification Report
            report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
            
            # ROC Curve
            if y_proba is not None:
                fpr, tpr, _ = roc_curve(y_test, y_proba)
                plt.plot(fpr, tpr, label=f'{name} (AUC = {roc_auc:.3f})')
            
            self.evaluation_results.append({
                'Model': name,
                'Accuracy': acc,
                'Precision': prec,
                'Recall': rec,
                'F1 Score': f1,
                'ROC-AUC': roc_auc,
                'Estimator': model,
                'Params': data['best_params']
            })
            
            logger.info(f"{name} Evaluation -> F1: {f1:.4f}, ROC-AUC: {roc_auc:.4f}")
            
        # Finalize ROC Curve plot
        plt.plot([0, 1], [0, 1], 'k--')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('Receiver Operating Characteristic (ROC) Curve')
        plt.legend(loc="lower right")
        plt.savefig(os.path.join(self.output_dir, 'roc_curve_comparison.png'))
        plt.close()
        
        self._generate_comparison_chart()
        self._select_best_model()

    def _plot_confusion_matrix(self, cm: np.ndarray, model_name: str):
        """Plot and save confusion matrix."""
        plt.figure(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title(f'Confusion Matrix - {model_name}')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        filename = f'confusion_matrix_{model_name.replace(" ", "_").lower()}.png'
        plt.savefig(os.path.join(self.output_dir, filename))
        plt.close()

    def _generate_comparison_chart(self):
        """Generate a bar chart comparing models."""
        df = pd.DataFrame(self.evaluation_results)
        
        df_melted = df.melt(id_vars='Model', value_vars=['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC'], 
                            var_name='Metric', value_name='Score')
                            
        plt.figure(figsize=(12, 6))
        sns.barplot(x='Metric', y='Score', hue='Model', data=df_melted)
        plt.title('Model Comparison Across Metrics')
        plt.ylim(0, 1.05)
        plt.legend(loc='lower right')
        plt.savefig(os.path.join(self.output_dir, 'model_comparison_chart.png'))
        plt.close()
        
        logger.info("\n--- Model Comparison Table ---")
        logger.info("\n" + df[['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC']].to_string(index=False))

    def _select_best_model(self):
        """Select the best model based on F1 Score and explain why."""
        df = pd.DataFrame(self.evaluation_results)
        best_row = df.loc[df['F1 Score'].idxmax()]
        
        self.best_model_name = best_row['Model']
        self.best_model = best_row['Estimator']
        
        logger.info(f"Automatically selected best model: {self.best_model_name}")
        logger.info(f"Reason: It achieved the highest F1 Score ({best_row['F1 Score']:.4f}) and an ROC-AUC of {best_row['ROC-AUC']:.4f}.")
        
        self._plot_feature_importance(self.best_model, self.best_model_name)

    def _plot_feature_importance(self, model: Any, model_name: str):
        """Plot feature importance if supported by the model."""
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            indices = np.argsort(importances)[-20:] # Top 20 features
            
            plt.figure(figsize=(10, 8))
            plt.title(f'Feature Importances - {model_name}')
            # Since we don't have exact feature names after OneHotEncoding, we just plot indices or generic names
            plt.barh(range(len(indices)), importances[indices], color='b', align='center')
            plt.yticks(range(len(indices)), [f"Feature {i}" for i in indices])
            plt.xlabel('Relative Importance')
            plt.savefig(os.path.join(self.output_dir, 'feature_importance_best_model.png'))
            plt.close()

    def save_best_model(self, models_dir: str = 'models', features_used: List[str] = None):
        """Save the best model and its metadata."""
        os.makedirs(models_dir, exist_ok=True)
        
        model_path = os.path.join(models_dir, 'best_model.joblib')
        joblib.dump(self.best_model, model_path)
        logger.info(f"Best model saved to {model_path}")
        
        best_metrics = next(item for item in self.evaluation_results if item["Model"] == self.best_model_name)
        
        metadata = {
            "model_name": self.best_model_name,
            "training_date": datetime.datetime.now().isoformat(),
            "metrics": {
                "Accuracy": best_metrics["Accuracy"],
                "Precision": best_metrics["Precision"],
                "Recall": best_metrics["Recall"],
                "F1 Score": best_metrics["F1 Score"],
                "ROC-AUC": best_metrics["ROC-AUC"]
            },
            "best_params": best_metrics["Params"],
            "features_used": features_used or []
        }
        
        metadata_path = os.path.join(models_dir, 'model_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=4)
            
        logger.info(f"Model metadata saved to {metadata_path}")
