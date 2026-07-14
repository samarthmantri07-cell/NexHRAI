import pandas as pd
import numpy as np
import joblib
import os
from typing import Tuple, Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from app.utils.logger import logger

class HRDataPreprocessor:
    def __init__(self, target_col: str = 'Attrition'):
        self.target_col = target_col
        self.categorical_features: List[str] = []
        self.numerical_features: List[str] = []
        self.identifier_features: List[str] = []
        self.constant_features: List[str] = []
        
        self.pipeline: Pipeline = None
        self.target_encoder: LabelEncoder = None

    def validate_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect missing values, duplicate rows, constant columns."""
        logger.info("Validating dataset...")
        summary = {
            "total_rows": len(df),
            "missing_values": df.isnull().sum().to_dict(),
            "duplicate_rows": df.duplicated().sum(),
            "constant_columns": [col for col in df.columns if df[col].nunique() <= 1],
            "invalid_types": []
        }
        
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col].astype(str)
                except Exception:
                    summary["invalid_types"].append(col)
                    
        logger.info(f"Validation summary: duplicates={summary['duplicate_rows']}, constant_cols={len(summary['constant_columns'])}")
        return summary

    def classify_features(self, df: pd.DataFrame):
        """Automatically classify features into numerical, categorical, etc."""
        logger.info("Classifying features...")
        self.constant_features = [col for col in df.columns if df[col].nunique() <= 1]
        
        # Potential identifiers (high cardinality, non-numeric or just ID-like)
        if 'EmployeeNumber' in df.columns:
            self.identifier_features.append('EmployeeNumber')
        if 'EmployeeCount' in df.columns and 'EmployeeCount' not in self.constant_features:
            self.constant_features.append('EmployeeCount')
        if 'StandardHours' in df.columns and 'StandardHours' not in self.constant_features:
            self.constant_features.append('StandardHours')
        if 'Over18' in df.columns and 'Over18' not in self.constant_features:
             self.constant_features.append('Over18')

        features_to_ignore = self.constant_features + self.identifier_features + [self.target_col]
        
        for col in df.columns:
            if col in features_to_ignore:
                continue
            
            if pd.api.types.is_numeric_dtype(df[col]):
                self.numerical_features.append(col)
            else:
                self.categorical_features.append(col)
                
        logger.info(f"Classified {len(self.numerical_features)} numerical, {len(self.categorical_features)} categorical features.")

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values, duplicate removal, constant column removal."""
        logger.info("Cleaning data...")
        df_clean = df.copy()
        
        # Remove duplicates
        df_clean = df_clean.drop_duplicates()
        
        # Remove constant features and identifiers
        cols_to_drop = self.constant_features + self.identifier_features
        df_clean = df_clean.drop(columns=[col for col in cols_to_drop if col in df_clean.columns])
        
        # Handle missing values (simple imputation for now)
        for col in self.numerical_features:
            if df_clean[col].isnull().any():
                df_clean[col] = df_clean[col].fillna(df_clean[col].median())
                
        for col in self.categorical_features:
            if df_clean[col].isnull().any():
                df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])
                
        return df_clean

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create engineered features."""
        logger.info("Engineering features...")
        df_eng = df.copy()
        
        # IncomePerYear
        if 'MonthlyIncome' in df_eng.columns:
            df_eng['IncomePerYear'] = df_eng['MonthlyIncome'] * 12
            self.numerical_features.append('IncomePerYear')
            
        # StabilityRatio: YearsInCurrentRole / YearsAtCompany
        if 'YearsInCurrentRole' in df_eng.columns and 'YearsAtCompany' in df_eng.columns:
            df_eng['StabilityRatio'] = df_eng.apply(
                lambda row: row['YearsInCurrentRole'] / row['YearsAtCompany'] if row['YearsAtCompany'] > 0 else 0, axis=1
            )
            self.numerical_features.append('StabilityRatio')
            
        # PromotionStagnation: YearsSinceLastPromotion / YearsAtCompany
        if 'YearsSinceLastPromotion' in df_eng.columns and 'YearsAtCompany' in df_eng.columns:
            df_eng['PromotionStagnation'] = df_eng.apply(
                lambda row: row['YearsSinceLastPromotion'] / row['YearsAtCompany'] if row['YearsAtCompany'] > 0 else 0, axis=1
            )
            self.numerical_features.append('PromotionStagnation')
            
        # YearsPerCompany: TotalWorkingYears / NumCompaniesWorked
        if 'TotalWorkingYears' in df_eng.columns and 'NumCompaniesWorked' in df_eng.columns:
            df_eng['YearsPerCompany'] = df_eng.apply(
                lambda row: row['TotalWorkingYears'] / row['NumCompaniesWorked'] if row['NumCompaniesWorked'] > 0 else row['TotalWorkingYears'], axis=1
            )
            self.numerical_features.append('YearsPerCompany')
            
        # ExperienceLevel
        if 'TotalWorkingYears' in df_eng.columns:
            df_eng['ExperienceLevel'] = pd.cut(
                df_eng['TotalWorkingYears'], 
                bins=[-1, 2, 5, 10, 20, 50], 
                labels=['Entry', 'Junior', 'Mid', 'Senior', 'Executive']
            ).astype(str)
            self.categorical_features.append('ExperienceLevel')
            
        # AgeGroup
        if 'Age' in df_eng.columns:
            df_eng['AgeGroup'] = pd.cut(
                df_eng['Age'], 
                bins=[0, 25, 35, 45, 55, 100], 
                labels=['GenZ', 'YoungMillennial', 'OlderMillennial', 'GenX', 'Boomer']
            ).astype(str)
            self.categorical_features.append('AgeGroup')
            
        # SalaryBand
        if 'MonthlyIncome' in df_eng.columns:
            df_eng['SalaryBand'] = pd.qcut(
                df_eng['MonthlyIncome'], 
                q=4, 
                labels=['Low', 'Medium', 'High', 'Premium']
            ).astype(str)
            self.categorical_features.append('SalaryBand')
            
        # TenureGroup
        if 'YearsAtCompany' in df_eng.columns:
            df_eng['TenureGroup'] = pd.cut(
                df_eng['YearsAtCompany'], 
                bins=[-1, 1, 3, 7, 15, 50], 
                labels=['Newbie', 'Settling', 'Established', 'Veteran', 'Lifer']
            ).astype(str)
            self.categorical_features.append('TenureGroup')
            
        # Deduplicate features list
        self.numerical_features = list(dict.fromkeys(self.numerical_features))
        self.categorical_features = list(dict.fromkeys(self.categorical_features))
            
        return df_eng

    def build_sklearn_pipeline(self):
        """Create reusable sklearn preprocessing pipeline."""
        logger.info("Building sklearn preprocessing pipeline...")
        
        numeric_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, self.numerical_features),
                ('cat', categorical_transformer, self.categorical_features)
            ])
            
        self.pipeline = Pipeline(steps=[('preprocessor', preprocessor)])

    def process_and_split(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Run full preprocessing and split into train/test."""
        logger.info("Starting full preprocessing pipeline...")
        
        # 1. Validate
        self.validate_data(df)
        
        # 2. Classify
        self.classify_features(df)
        
        # 3. Clean
        df_clean = self.clean_data(df)
        
        # 4. Engineer
        df_eng = self.engineer_features(df_clean)
        
        # 5. Build Pipeline
        self.build_sklearn_pipeline()
        
        # Separate features and target
        if self.target_col not in df_eng.columns:
            raise ValueError(f"Target column '{self.target_col}' not found in dataset.")
            
        X = df_eng[self.numerical_features + self.categorical_features]
        y = df_eng[self.target_col]
        
        # Encode Target
        self.target_encoder = LabelEncoder()
        y_encoded = self.target_encoder.fit_transform(y)
        
        # Fit transform features
        X_transformed = self.pipeline.fit_transform(X)
        
        # 80/20 Stratified Split
        logger.info("Splitting data into 80/20 train/test sets...")
        X_train, X_test, y_train, y_test = train_test_split(
            X_transformed, y_encoded, 
            test_size=0.20, 
            stratify=y_encoded, 
            random_state=42
        )
        
        logger.info(f"Split complete. Train shape: {X_train.shape}, Test shape: {X_test.shape}")
        return X_train, X_test, y_train, y_test

    def save_pipeline(self, output_dir: str):
        """Save preprocessing objects using joblib."""
        logger.info(f"Saving pipeline and encoders to {output_dir}...")
        os.makedirs(output_dir, exist_ok=True)
        
        joblib.dump(self.pipeline, os.path.join(output_dir, 'preprocessor.pkl'))
        joblib.dump(self.target_encoder, os.path.join(output_dir, 'target_encoder.pkl'))
        
        # Save feature lists for future reference
        joblib.dump({
            'numerical': self.numerical_features,
            'categorical': self.categorical_features
        }, os.path.join(output_dir, 'features.pkl'))
        
        logger.info("Pipeline saved successfully.")
