import os
import logging
from typing import Dict, Any, List
from PIL import Image

from config.config import FOOD_DETECTION_MODEL_PATH, MODEL_VERSIONS

logger = logging.getLogger("ml_service.food_detection")

class FoodDetectionService:
    def __init__(self, model_path: str = FOOD_DETECTION_MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self.is_loaded = False
        self.version = MODEL_VERSIONS["food_detection"]
        self._load_model()

    def _load_model(self):
        """Loads YOLOv8 model if the weight file exists."""
        if not os.path.exists(self.model_path):
            logger.info(f"[YOLOv8] Weight file not found at {self.model_path}. Service in MODEL_NOT_LOADED state.")
            self.is_loaded = False
            return

        try:
            from ultralytics import YOLO
            self.model = YOLO(self.model_path)
            self.is_loaded = True
            logger.info(f"[YOLOv8] Successfully loaded model from {self.model_path}")
        except Exception as e:
            logger.error(f"[YOLOv8] Failed to load weights from {self.model_path}: {e}")
            self.model = None
            self.is_loaded = False

    def detect_food(self, pil_image: Image.Image) -> Dict[str, Any]:
        """
        Executes YOLOv8 detection on the provided PIL image.
        Returns detections or honest MODEL_NOT_LOADED status.
        Does NOT fake predictions or confidence.
        """
        if not self.is_loaded or self.model is None:
            return {
                "status": "MODEL_NOT_LOADED",
                "message": f"YOLOv8 food detection model weights not found at '{self.model_path}'.",
                "modelVersion": self.version,
                "detections": []
            }

        try:
            results = self.model(pil_image)
            detections: List[Dict[str, Any]] = []

            for result in results:
                boxes = result.boxes
                if boxes is None:
                    continue
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = result.names.get(cls_id, f"class_{cls_id}")
                    conf = float(box.conf[0].item())
                    xywh = box.xywh[0].tolist()

                    detections.append({
                        "className": cls_name,
                        "confidence": round(conf, 4),
                        "boundingBox": {
                            "x": round(xywh[0], 2),
                            "y": round(xywh[1], 2),
                            "width": round(xywh[2], 2),
                            "height": round(xywh[3], 2),
                        }
                    })

            return {
                "status": "LOADED",
                "modelVersion": self.version,
                "detections": detections
            }
        except Exception as e:
            logger.error(f"[YOLOv8] Error during inference: {e}")
            return {
                "status": "INFERENCE_ERROR",
                "message": str(e),
                "modelVersion": self.version,
                "detections": []
            }

# Singleton instance
food_detection_service = FoodDetectionService()
