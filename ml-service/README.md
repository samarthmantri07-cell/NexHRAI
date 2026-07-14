# NexHR ML Service

This is the Machine Learning microservice for NexHRAI.

## Installation

1. Navigate to the `ml-service` directory.
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - On Windows: `.venv\Scripts\activate`
   - On Unix/macOS: `source .venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

To run the application locally in development mode:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. You can view the Swagger UI documentation at `http://localhost:8000/docs`.

## Project Structure

```
ml-service/
├── app/                  # FastAPI application code
│   ├── api/              # API routers and endpoints
│   ├── config/           # Configuration and settings
│   ├── schemas/          # Pydantic schemas (models)
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions (logging, exceptions)
├── datasets/             # Dataset loading utilities
├── evaluation/           # Model evaluation logic
├── explainability/       # Model explainability (e.g., SHAP)
├── models/               # Saved trained models
├── notebooks/            # Jupyter notebooks for exploration
├── preprocessing/        # Data preprocessing logic
├── tests/                # Unit and integration tests
├── training/             # Model training logic
├── main.py               # Main application entry point
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables
```

## Future Roadmap

- Implement robust preprocessing pipeline for IBM HR dataset.
- Train predictive models for employee attrition (XGBoost).
- Integrate SHAP for explainable AI insights.
- Provide predictions to the main backend application via API.
