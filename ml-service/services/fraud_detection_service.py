"""
FoodShareAI - Isolation Forest Fraud & Anomaly Detection Service
Hosts scikit-learn IsolationForest model for non-accusatory behavioral anomaly detection.
Flags outlier patterns for human administrative review without automatic user punishment.
"""
import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional

try:
    import joblib
    from sklearn.ensemble import IsolationForest
    import numpy as np
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

from config.config import FRAUD_MODEL_PATH, MODEL_VERSIONS
from utils.fraud_features import extract_feature_vector, explain_anomalous_features

logger = logging.getLogger("ml_service.fraud_detection")

class FraudDetectionService:
    def __init__(self):
        self.model_path = FRAUD_MODEL_PATH
        self.version = MODEL_VERSIONS.get("fraud", "isolation_forest_v1")
        self.model: Optional[Any] = None
        self._load_model()

    def _load_model(self):
        """
        Loads saved IsolationForest joblib model.
        Reports MODEL_NOT_LOADED honestly if weights/file are not present.
        """
        if not SKLEARN_AVAILABLE:
            logger.warning("scikit-learn is not available in environment. IsolationForest disabled.")
            self.model = None
            return

        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Loaded IsolationForest model from {self.model_path}")
            except Exception as e:
                logger.error(f"Failed to load IsolationForest model from {self.model_path}: {e}")
                self.model = None
        else:
            logger.info(f"IsolationForest model file not found at {self.model_path}. Ready for training or loading.")
            self.model = None

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def detect_anomaly(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detects operational anomalies across donation, claim, or delivery behaviors.
        Returns honest status: MODEL_NOT_LOADED if model is not loaded.
        """
        features_dict = payload.get("features", payload)

        if not self.is_loaded:
            logger.debug("IsolationForest model is not loaded. Returning honest MODEL_NOT_LOADED status.")
            return {
                "status": "MODEL_NOT_LOADED",
                "isAnomaly": False,
                "anomalyScore": 0.0,
                "riskLevel": "LOW",
                "reasons": [],
                "modelVersion": self.version,
                "message": "IsolationForest model weights not loaded. System operates in deterministic baseline mode.",
            }

        try:
            X = extract_feature_vector(features_dict)
            prediction = self.model.predict(X)[0]  # -1 for anomaly, 1 for inlier
            # decision_function returns negative values for anomalies, positive for inliers
            raw_score = float(self.model.decision_function(X)[0])

            is_anomaly = bool(prediction == -1)

            # Map raw score to standardized 0.0 - 1.0 anomaly scale
            # (raw_score ~ 0 is decision boundary; -0.2 is severe anomaly; +0.2 is safe inlier)
            anomaly_score = round(max(0.0, min(1.0, 0.5 - (raw_score * 1.5))), 4)

            # Assign non-accusatory risk level
            if not is_anomaly:
                risk_level = "LOW"
            elif anomaly_score >= 0.75:
                risk_level = "HIGH"
            else:
                risk_level = "MEDIUM"

            # Formulate explainable reasons if an anomaly is detected
            reasons = explain_anomalous_features(features_dict) if is_anomaly else []

            return {
                "status": "COMPLETED",
                "isAnomaly": is_anomaly,
                "anomalyScore": anomaly_score,
                "riskLevel": risk_level,
                "reasons": reasons,
                "modelVersion": self.version,
            }

        except Exception as e:
            logger.error(f"Inference error in detect_anomaly: {str(e)}")
            return {
                "status": "ERROR",
                "isAnomaly": False,
                "anomalyScore": 0.0,
                "riskLevel": "LOW",
                "reasons": [f"Inference failed: {str(e)}"],
                "modelVersion": self.version,
            }

# Singleton instance
fraud_detection_service = FraudDetectionService()
