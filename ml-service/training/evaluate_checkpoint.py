#!/usr/bin/env python3
"""
FoodShareAI - Checkpoint Evaluation Script
Evaluates a trained YOLOv8 food detection checkpoint on both validation and held-out test splits.
"""

import sys
import json
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("eval_food_detection")

def evaluate(weights_path: str, data_yaml_path: str, imgsz: int = 640, device: str = "cpu"):
    weights_file = Path(weights_path).resolve()
    yaml_file = Path(data_yaml_path).resolve()
    
    if not weights_file.exists():
        logger.error(f"Weights file not found at {weights_file}")
        sys.exit(1)
    if not yaml_file.exists():
        logger.error(f"YAML file not found at {yaml_file}")
        sys.exit(1)
        
    logger.info("==================================================================")
    logger.info("  FoodShareAI - YOLOv8 Food Detection Evaluation")
    logger.info("==================================================================")
    logger.info(f"Weights:     {weights_file}")
    logger.info(f"Size:        {weights_file.stat().st_size / (1024*1024):.2f} MB")
    logger.info(f"Data YAML:   {yaml_file}")
    logger.info(f"Device:      {device}")
    logger.info(f"Image Size:  {imgsz}")
    logger.info("==================================================================")
    
    from ultralytics import YOLO
    
    # 1. Load model
    logger.info("Loading model checkpoint...")
    model = YOLO(str(weights_file))
    class_names = model.names
    logger.info(f"Model loaded successfully with {len(class_names)} classes.")
    
    # 2. Evaluate on validation set
    logger.info("\n--- 1. EVALUATING ON VALIDATION SET (589 images) ---")
    val_metrics = model.val(data=str(yaml_file), split="val", imgsz=imgsz, device=device, verbose=True)
    
    val_p = float(val_metrics.box.mp) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mp") else 0.0
    val_r = float(val_metrics.box.mr) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mr") else 0.0
    val_map50 = float(val_metrics.box.map50) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map50") else 0.0
    val_map = float(val_metrics.box.map) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map") else 0.0

    # 3. Evaluate on held-out test set
    logger.info("\n--- 2. EVALUATING ON HELD-OUT TEST SET (300 images) ---")
    test_metrics = model.val(data=str(yaml_file), split="test", imgsz=imgsz, device=device, verbose=True)
    
    test_p = float(test_metrics.box.mp) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mp") else 0.0
    test_r = float(test_metrics.box.mr) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mr") else 0.0
    test_map50 = float(test_metrics.box.map50) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map50") else 0.0
    test_map = float(test_metrics.box.map) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map") else 0.0

    # Per-class metrics on test split
    test_maps = getattr(test_metrics.box, "maps", [])
    per_class_metrics = {}
    weak_classes = []
    
    for cls_idx, cls_name in class_names.items():
        cls_map = float(test_maps[cls_idx]) if cls_idx < len(test_maps) else 0.0
        per_class_metrics[cls_name] = {
            "class_id": cls_idx,
            "mAP50-95": round(cls_map, 4),
        }
        if cls_map < 0.05:
            weak_classes.append(cls_name)

    # 4. Check FoodShareAI category mappings
    mapping_file = yaml_file.parent / "class_mapping.json"
    class_mapping = {}
    if mapping_file.exists():
        with open(mapping_file, "r") as f:
            class_mapping = json.load(f)
            
    # Sample predictions from test set
    test_img_dir = yaml_file.parent / "images" / "test"
    sample_images = sorted(list(test_img_dir.glob("*.jpg")))[:8]
    sample_results = []
    unmapped_classes = set()
    total_detections = 0
    
    logger.info(f"\n--- 3. SAMPLE INFERENCE ON {len(sample_images)} UNSEEN TEST IMAGES ---")
    for img_path in sample_images:
        preds = model(str(img_path), imgsz=imgsz, device=device, verbose=False, conf=0.15)[0]
        boxes_info = []
        for box in preds.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = class_names.get(cls_id, f"Unknown-{cls_id}")
            conf = float(box.conf[0].item())
            app_category = class_mapping.get(cls_name, "UNMAPPED")
            if app_category == "UNMAPPED":
                unmapped_classes.add(cls_name)
            xyxy = [round(x, 1) for x in box.xyxy[0].tolist()]
            boxes_info.append({
                "class_name": cls_name,
                "confidence": round(conf, 4),
                "bbox": xyxy,
                "app_category": app_category
            })
            total_detections += 1
        sample_results.append({
            "image": img_path.name,
            "detections": boxes_info
        })
        logger.info(f"Image: {img_path.name} -> {len(boxes_info)} detections: {[d['class_name'] + ' (' + str(round(d['confidence']*100, 1)) + '%) -> ' + d['app_category'] for d in boxes_info]}")

    # Build report
    eval_report = {
        "timestamp": datetime.now().isoformat(),
        "weights_path": str(weights_file),
        "checkpoint_size_mb": round(weights_file.stat().st_size / (1024*1024), 2),
        "validation_metrics": {
            "precision": round(val_p, 4),
            "recall": round(val_r, 4),
            "mAP50": round(val_map50, 4),
            "mAP50-95": round(val_map, 4),
        },
        "test_metrics": {
            "precision": round(test_p, 4),
            "recall": round(test_r, 4),
            "mAP50": round(test_map50, 4),
            "mAP50-95": round(test_map, 4),
        },
        "per_class_test_metrics": per_class_metrics,
        "weak_classes": weak_classes,
        "unmapped_classes": list(unmapped_classes),
        "sample_inferences": sample_results,
    }
    
    report_out = weights_file.parent.parent / "eval_report.json"
    with open(report_out, "w") as f:
        json.dump(eval_report, f, indent=2)
    logger.info(f"\nEvaluation report saved to {report_out}")
    
    return eval_report

if __name__ == "__main__":
    weights = sys.argv[1] if len(sys.argv) > 1 else "runs/detect/runs/food_detection_real/yolov8n_50ep_640_cpu/weights/best.pt"
    data = sys.argv[2] if len(sys.argv) > 2 else "datasets/food_detection/food_detection.yaml"
    evaluate(weights, data)
