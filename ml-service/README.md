# SurplusAI - Python ML Inference & Training Microservice

Dedicated, standalone Python microservice hosting SurplusAI's custom machine learning models for computer vision, freshness classification, quantity regression, safe shelf-life estimation, and demand forecasting.

---

## 1. Architecture

```text
React Native Mobile & Web Client
        ↓
Node.js Express Backend (Port 5000)
        ↓ (HTTP POST / REST)
FastAPI Python Microservice (Port 8000)
        ↓
Multi-Model Inference Pipeline:
  1. Image preprocessing & RGB validation
  2. YOLOv8 Food Detection & Classification (30 food classes)
  3. Canonical Category Normalization (6 core surplus categories)
  4. EfficientNet-B0 Freshness Classification (FRESH, GOOD, MODERATE, EXPIRING, UNSAFE)
  5. YOLOv8-Seg + Ridge Regression (Serving count & volume estimation in kg)
  6. XGBoost Safe Consumption / Shelf-Life Window (Hours until expiry)
        ↓
Standardized JSON Response
        ↓
Node.js Express Backend (Persisted in MongoDB AIAnalysis collection)
```

---

## 2. Model Stack & Category Mapping

### Model Registry
| Model | Target Task | File Location | Framework |
| :--- | :--- | :--- | :--- |
| **YOLOv8n** | Multi-class food object detection | `models/food_detection/best.pt` | Ultralytics / PyTorch |
| **EfficientNet-B0** | Deep visual freshness grading | `models/freshness/efficientnet_b0_freshness.pth` | PyTorch / torchvision |
| **YOLOv8-Seg + Ridge** | Serving count & volume regression (kg) | `models/quantity/quantity_regressor.joblib` | scikit-learn / Ultralytics |
| **XGBoost** | Tabular shelf-life & safe hours | `models/expiry/xgboost_expiry.joblib` | XGBoost / NumPy |
| **PyTorch LSTM** | Time-series category demand forecast | `models/demand/` | PyTorch (`nn.LSTM`) |
| **Isolation Forest** | Behavioral anomaly fraud detection | Dynamic in-memory / scikit-learn | scikit-learn |

### 30 Food Classes → 6 Canonical Surplus Categories
The vision system maps 30 detected food items into 6 standardized platform categories:
- **Cooked Meals**: Cooked Rice, Dal / Lentil Curry, Mixed Vegetable Curry, Paneer Curry, Chicken Curry, Biryani / Pulao, Pasta, Pizza, Burger, Noodles, Soup
- **Bakery & Bread**: Roti / Chapati, Naan / Paratha, Sliced Bread, Buns / Rolls, Croissants, Pastries / Cakes
- **Produce & Fruits**: Fresh Apples, Bananas, Oranges, Tomatoes, Potatoes, Leafy Greens
- **Dairy Products**: Milk, Yogurt / Curd, Cheese
- **Packaged Goods**: Biscuits / Crackers, Canned Beans / Veg, Dry Snacks
- **Beverages**: Fruit Juice

---

## 3. Training & Validation Pipelines (`training/`)

The `training/` directory contains complete, reproducible Python scripts for model fine-tuning and evaluation:

```bash
# 1. Fine-tune YOLOv8n on food detection dataset
python training/train_food_detection.py --data datasets/food_detection.yaml --epochs 50 --imgsz 640

# 2. Resume training cleanly from checkpoint
python training/resume_training.py --checkpoint runs/detect/train/weights/last.pt

# 3. Evaluate checkpoint mAP@50 and precision/recall
python training/evaluate_checkpoint.py --weights models/food_detection/best.pt --split val

# 4. Run full validation suite with structured JSON reporting
python training/run_full_validation.py --weights models/food_detection/best.pt

# 5. Rapid subset smoke testing (fast turnaround evaluation)
python training/quick_evaluate_subset.py --weights models/food_detection/best.pt --samples 50
```

---

## 4. Automated Test Suites (`tests/`)

Automated verification tests ensure contract consistency between the ML inference engine and backend:

```bash
cd ml-service

# Run candidate model verification suite
python -m pytest tests/test_candidate_verification.py -v

# Run category mapping integration test
python -m pytest tests/test_category_mapping_integration.py -v
```

---

## 5. Google Colab Free GPU Workflow (`colab_preparation/`)

For free GPU training without requiring a local NVIDIA GPU:
- **`colab_preparation/FoodShareAI_YOLOv8n_GPU_Training.ipynb`**: Complete Jupyter Notebook for Google Colab with T4 GPU acceleration.
- **`colab_preparation/food_detection_colab.yaml`**: Standalone Linux dataset configuration.
- **`colab_preparation/google_drive_upload_manifest.json`**: Upload specifications with SHA-256 integrity hashes.
- **`colab_preparation/open_colab_workflow.bat`**: Windows launcher script for the workflow.
- Refer to [`colab_preparation/README.md`](colab_preparation/README.md) for full step-by-step instructions.

*Note: Large dataset archives (`*.zip`) and heavyweight model checkpoint weights (`*.pt`) are git-ignored to prevent exceeding GitHub size limits.*

---

## 6. Honest Reporting Principle

- **Zero Fake Predictions**: If trained model files are not installed, the microservice gracefully and honestly returns `MODEL_NOT_LOADED` with status indicators.
- It does **NOT** invent fake bounding boxes, random freshness labels, or pseudo-scientific confidence numbers.

---

## 7. Setup & Running

### 1. Python Prerequisites
- Python 3.10+ (tested on Python 3.10, 3.11, 3.12, 3.13)

### 2. Virtual Environment Setup
```bash
cd ml-service
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux / macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Model Weights Placement
Place trained model weights into their respective directories:
- `models/food_detection/best.pt`
- `models/freshness/efficientnet_b0_freshness.pth`
- `models/quantity/quantity_regressor.joblib`
- `models/expiry/xgboost_expiry.joblib`

### 5. Start the FastAPI Service
```bash
python app.py
# Or with uvicorn:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Health & Inference Endpoints
- **Health Check**: `GET http://localhost:8000/health`
- **Food Analysis**: `POST http://localhost:8000/api/ml/analyze`
