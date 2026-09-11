import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ML Microservice Port and Environment
ML_SERVICE_PORT = int(os.getenv("ML_SERVICE_PORT", "8000"))
ML_SERVICE_HOST = os.getenv("ML_SERVICE_HOST", "0.0.0.0")

# Model Paths
MODELS_DIR = BASE_DIR / "models"
FOOD_DETECTION_MODEL_PATH = os.getenv(
    "FOOD_DETECTION_MODEL_PATH",
    str(MODELS_DIR / "food_detection" / "best.pt"),
)
FRESHNESS_MODEL_PATH = os.getenv(
    "FRESHNESS_MODEL_PATH",
    str(MODELS_DIR / "freshness" / "efficientnet_b0_freshness.pth"),
)
QUANTITY_MODEL_PATH = os.getenv(
    "QUANTITY_MODEL_PATH",
    str(MODELS_DIR / "quantity" / "quantity_regressor.joblib"),
)
QUANTITY_SEG_MODEL_PATH = os.getenv(
    "QUANTITY_SEG_MODEL_PATH",
    str(MODELS_DIR / "quantity" / "yolov8_seg.pt"),
)
EXPIRY_MODEL_PATH = os.getenv(
    "EXPIRY_MODEL_PATH",
    str(MODELS_DIR / "expiry" / "xgboost_expiry.joblib"),
)
DEMAND_MODEL_PATH = os.getenv(
    "DEMAND_MODEL_PATH",
    str(MODELS_DIR / "demand" / "lstm_demand.pth"),
)
FRAUD_MODEL_PATH = os.getenv(
    "FRAUD_MODEL_PATH",
    str(MODELS_DIR / "fraud" / "isolation_forest.joblib"),
)

# Model Version Registry
MODEL_VERSIONS = {
    "food_detection": os.getenv("MODEL_VERSION_FOOD_DETECTION", "food_detection_v1"),
    "freshness": os.getenv("MODEL_VERSION_FRESHNESS", "freshness_v1"),
    "quantity": os.getenv("MODEL_VERSION_QUANTITY", "quantity_seg_v1"),
    "expiry": os.getenv("MODEL_VERSION_EXPIRY", "expiry_v1"),
    "demand": os.getenv("MODEL_VERSION_DEMAND", "demand_lstm_v1"),
    "fraud": os.getenv("MODEL_VERSION_FRAUD", "isolation_forest_v1"),
}

# LSTM Architecture Hyperparameters
DEMAND_SEQUENCE_LENGTH = int(os.getenv("DEMAND_SEQUENCE_LENGTH", "7"))
DEMAND_HIDDEN_SIZE = int(os.getenv("DEMAND_HIDDEN_SIZE", "64"))
DEMAND_NUM_LAYERS = int(os.getenv("DEMAND_NUM_LAYERS", "2"))
DEMAND_DROPOUT = float(os.getenv("DEMAND_DROPOUT", "0.2"))

# Supported Freshness Classes from Project Standards
FRESHNESS_CLASSES = ["FRESH", "GOOD", "MODERATE", "EXPIRING", "UNSAFE"]

# Supported Safety Levels
SAFETY_RISK_LEVELS = ["SAFE", "WARNING", "UNSAFE"]

# Maximum allowed file size for image inference (15 MB)
MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024
