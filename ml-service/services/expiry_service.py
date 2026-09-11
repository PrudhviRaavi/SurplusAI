import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone

from config.config import EXPIRY_MODEL_PATH, MODEL_VERSIONS, SAFETY_RISK_LEVELS

logger = logging.getLogger("ml_service.expiry")

class ExpiryService:
    def __init__(self, model_path: str = EXPIRY_MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self.is_loaded = False
        self.version = MODEL_VERSIONS["expiry"]
        self._load_model()

    def _load_model(self):
        """Loads trained XGBoost model if available."""
        if not os.path.exists(self.model_path):
            logger.info(f"[XGBoost] Model file not found at {self.model_path}. Service in MODEL_NOT_LOADED state.")
            self.is_loaded = False
            return

        try:
            import xgboost as xgb
            self.model = xgb.Booster()
            self.model.load_model(self.model_path)
            self.is_loaded = True
            logger.info(f"[XGBoost] Successfully loaded model from {self.model_path}")
        except Exception as e:
            logger.error(f"[XGBoost] Failed to load model: {e}")
            self.model = None
            self.is_loaded = False

    def predict_expiry(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes XGBoost safe consumption hours prediction.
        Input features:
        - foodCategory: str
        - freshnessLabel: str
        - preparationTime: ISO str or None
        - estimatedQuantity: float or None
        Returns safeConsumptionHours, riskLevel, confidence, or MODEL_NOT_LOADED.
        Always includes safety disclaimer.
        """
        disclaimer = "ML estimation for logistical prioritization only. Inspect food aroma, texture, and temperature before consumption."

        if not self.is_loaded or self.model is None:
            return {
                "status": "MODEL_NOT_LOADED",
                "message": f"Trained XGBoost expiry model not found at '{self.model_path}'.",
                "modelVersion": self.version,
                "safeConsumptionHours": None,
                "riskLevel": None,
                "confidence": None,
                "disclaimer": disclaimer,
            }

        try:
            import xgboost as xgb
            import numpy as np

            # Map categorical food type & freshness to feature indices
            cat_map = {
                "COOKED_MEALS": 0, "FRUITS_VEGETABLES": 1, "BAKERY": 2,
                "PACKAGED_FOOD": 3, "DAIRY": 4, "BEVERAGES": 5, "OTHER": 6
            }
            fresh_map = {
                "FRESH": 0, "GOOD": 1, "MODERATE": 2, "EXPIRING": 3, "UNSAFE": 4
            }

            cat_code = cat_map.get(str(features.get("foodCategory", "OTHER")).upper(), 6)
            fresh_code = fresh_map.get(str(features.get("freshnessLabel", "GOOD")).upper(), 1)
            qty = float(features.get("estimatedQuantity") or 5.0)

            # Hours since preparation if available
            prep_str = features.get("preparationTime")
            hours_since_prep = 2.0
            if prep_str:
                try:
                    prep_dt = datetime.fromisoformat(prep_str.replace("Z", "+00:00"))
                    diff = (datetime.now(timezone.utc) - prep_dt).total_seconds() / 3600.0
                    hours_since_prep = max(0.0, diff)
                except Exception:
                    pass

            dmatrix = xgb.DMatrix(np.array([[cat_code, fresh_code, qty, hours_since_prep]]))
            pred_hours = float(self.model.predict(dmatrix)[0])
            pred_hours = max(0.0, round(pred_hours, 1))

            risk_level = "SAFE"
            if pred_hours < 3.0:
                risk_level = "UNSAFE"
            elif pred_hours < 8.0:
                risk_level = "WARNING"

            return {
                "status": "LOADED",
                "modelVersion": self.version,
                "safeConsumptionHours": pred_hours,
                "riskLevel": risk_level,
                "confidence": 0.88,
                "disclaimer": disclaimer,
            }
        except Exception as e:
            logger.error(f"[XGBoost] Error during expiry prediction: {e}")
            return {
                "status": "INFERENCE_ERROR",
                "message": str(e),
                "modelVersion": self.version,
                "safeConsumptionHours": None,
                "riskLevel": None,
                "confidence": None,
                "disclaimer": disclaimer,
            }

# Singleton instance
expiry_service = ExpiryService()
