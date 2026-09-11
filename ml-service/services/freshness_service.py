import os
import logging
from typing import Dict, Any
from PIL import Image

from config.config import FRESHNESS_MODEL_PATH, MODEL_VERSIONS, FRESHNESS_CLASSES

logger = logging.getLogger("ml_service.freshness")

class FreshnessService:
    def __init__(self, model_path: str = FRESHNESS_MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self.transform = None
        self.device = "cpu"
        self.is_loaded = False
        self.version = MODEL_VERSIONS["freshness"]
        self.classes = FRESHNESS_CLASSES
        self._load_model()

    def _load_model(self):
        """Loads EfficientNet-B0 model weights if available."""
        if not os.path.exists(self.model_path):
            logger.info(f"[EfficientNet-B0] Weight file not found at {self.model_path}. Service in MODEL_NOT_LOADED state.")
            self.is_loaded = False
            return

        try:
            import torch
            import torchvision.transforms as T
            from torchvision.models import efficientnet_b0

            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            model = efficientnet_b0(weights=None)
            # Custom classification head for our freshness classes
            num_ftrs = model.classifier[1].in_features
            model.classifier[1] = torch.nn.Linear(num_ftrs, len(self.classes))

            checkpoint = torch.load(self.model_path, map_location=self.device)
            state_dict = checkpoint.get("state_dict", checkpoint)
            model.load_state_dict(state_dict)
            model.to(self.device)
            model.eval()

            self.model = model
            self.transform = T.Compose([
                T.Resize((224, 224)),
                T.ToTensor(),
                T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            self.is_loaded = True
            logger.info(f"[EfficientNet-B0] Successfully loaded model from {self.model_path}")
        except Exception as e:
            logger.error(f"[EfficientNet-B0] Failed to load model weights: {e}")
            self.model = None
            self.is_loaded = False

    def predict_freshness(self, pil_image: Image.Image) -> Dict[str, Any]:
        """
        Executes EfficientNet-B0 classification on image.
        Returns label and confidence, or MODEL_NOT_LOADED.
        Does NOT fake scores or confidence.
        """
        if not self.is_loaded or self.model is None:
            return {
                "status": "MODEL_NOT_LOADED",
                "message": f"EfficientNet-B0 freshness model weights not found at '{self.model_path}'.",
                "modelVersion": self.version,
                "label": None,
                "confidence": None,
            }

        try:
            import torch
            tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            with torch.no_grad():
                logits = self.model(tensor)
                probs = torch.softmax(logits, dim=1)[0]
                conf, pred_idx = torch.max(probs, dim=0)

            label = self.classes[pred_idx.item()]
            return {
                "status": "LOADED",
                "modelVersion": self.version,
                "label": label,
                "confidence": round(conf.item(), 4),
            }
        except Exception as e:
            logger.error(f"[EfficientNet-B0] Error during freshness inference: {e}")
            return {
                "status": "INFERENCE_ERROR",
                "message": str(e),
                "modelVersion": self.version,
                "label": None,
                "confidence": None,
            }

# Singleton instance
freshness_service = FreshnessService()
