import time
import logging
from typing import Dict, Any, Optional
from PIL import Image

from services.food_detection_service import food_detection_service
from services.freshness_service import freshness_service
from services.quantity_service import quantity_service
from services.expiry_service import expiry_service

logger = logging.getLogger("ml_service.pipeline")

class PipelineService:
    """
    Orchestrates the custom ML image-analysis pipeline:
    Image -> YOLOv8 Detection
          -> EfficientNet-B0 Freshness
          -> YOLOv8-Seg + Quantity Regression
          -> XGBoost Expiry & Safe Consumption
    """
    def run_pipeline(
        self,
        pil_image: Image.Image,
        image_metadata: Dict[str, Any],
        context_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        start_time = time.perf_counter()
        context_metadata = context_metadata or {}

        # 1. Food Detection (YOLOv8)
        food_res = food_detection_service.detect_food(pil_image)
        detections = food_res.get("detections", [])

        # 2. Freshness Classification (EfficientNet-B0)
        fresh_res = freshness_service.predict_freshness(pil_image)

        # 3. Quantity Estimation (YOLOv8-Seg + Regressor)
        qty_res = quantity_service.estimate_quantity(pil_image, detections)

        # 4. Expiry / Safe Hours Estimation (XGBoost)
        expiry_features = {
            "foodCategory": context_metadata.get("foodCategory", "OTHER"),
            "freshnessLabel": fresh_res.get("label", "GOOD"),
            "preparationTime": context_metadata.get("preparationTime"),
            "estimatedQuantity": qty_res.get("estimatedQuantity"),
        }
        expiry_res = expiry_service.predict_expiry(expiry_features)

        # Calculate processing time
        processing_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Calculate overall confidence across loaded models
        confidences = []
        if food_res.get("status") == "LOADED" and detections:
            confidences.append(sum(d["confidence"] for d in detections) / len(detections))
        if fresh_res.get("status") == "LOADED" and fresh_res.get("confidence") is not None:
            confidences.append(fresh_res["confidence"])
        if qty_res.get("status") == "LOADED" and qty_res.get("confidence") is not None:
            confidences.append(qty_res["confidence"])
        if expiry_res.get("status") == "LOADED" and expiry_res.get("confidence") is not None:
            confidences.append(expiry_res["confidence"])

        overall_confidence = round(sum(confidences) / len(confidences), 4) if confidences else None

        # Build clean structured output matching MongoDB AIAnalysis schema expectations
        return {
            "success": True,
            "pipelineStatus": "COMPLETED",
            "foodDetection": food_res,
            "freshnessPrediction": fresh_res,
            "quantityEstimation": qty_res,
            "expiryPrediction": expiry_res,
            "overallConfidence": overall_confidence,
            "processingTimeMs": processing_time_ms,
            "imageMetadata": image_metadata,
            "modelsLoaded": {
                "foodDetection": food_detection_service.is_loaded,
                "freshness": freshness_service.is_loaded,
                "quantity": quantity_service.is_loaded,
                "expiry": expiry_service.is_loaded,
            },
        }

pipeline_service = PipelineService()
