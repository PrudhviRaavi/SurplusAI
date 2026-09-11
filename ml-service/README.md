# FoodShareAI - Python ML Inference Microservice

Dedicated, standalone Python microservice hosting FoodShareAI's custom machine learning models for computer vision and food safety prediction.

## Architecture

```
React Native Client
        ↓
Node.js Express Backend
        ↓ (HTTP POST)
FastAPI Python Microservice (Port 8000)
        ↓
Inference Pipeline:
  1. Image preprocessing & RGB validation
  2. YOLOv8 Food Detection & Classification
  3. EfficientNet-B0 Freshness Classification
  4. YOLOv8-Seg + Quantity Regression (kg)
  5. XGBoost Safe Consumption / Expiry Estimation
        ↓
Standardized JSON Response
        ↓
Node.js Express Backend (Persisted in MongoDB AIAnalysis collection)
```

## Model Stack

1. **Food Detection**: YOLOv8 (`models/food_detection/best.pt`)
2. **Freshness Classification**: EfficientNet-B0 (`models/freshness/efficientnet_b0_freshness.pth`)
3. **Quantity Estimation**: YOLOv8-Seg + Regression (`models/quantity/quantity_regressor.joblib`)
4. **Expiry / Safe Hours**: XGBoost (`models/expiry/xgboost_expiry.joblib`)
5. **Demand Forecasting**: LSTM (`models/demand/`) *(reserved for future dedicated chunk)*

## Honest Reporting Principle
- **Zero Fake Predictions**: If trained model files are not installed, the microservice gracefully and honestly returns `MODEL_NOT_LOADED` with status indicators.
- It does **NOT** invent fake bounding boxes, random freshness labels, or pseudo-scientific confidence numbers.

## Setup & Running

### 1. Python Prerequisites
- Python 3.10+ (tested on Python 3.13)

### 2. Virtual Environment Setup
```bash
cd ml-service
python -m venv venv

# Windows:
.\venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Place Model Weights
Download or train weights according to the project specifications and place them into:
- `models/food_detection/best.pt`
- `models/freshness/efficientnet_b0_freshness.pth`
- `models/quantity/quantity_regressor.joblib`
- `models/expiry/xgboost_expiry.joblib`

### 5. Start the FastAPI Service
```bash
python app.py
# Or with uvicorn directly:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Health & Analysis Verification
- Health Check: `GET http://localhost:8000/health`
- Food Analysis: `POST http://localhost:8000/api/ml/analyze`
