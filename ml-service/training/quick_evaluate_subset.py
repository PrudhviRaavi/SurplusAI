#!/usr/bin/env python3
"""
FoodShareAI - Quick Evaluation of Best Food Detection Checkpoint on Validation Subset
Evaluates best.pt on a documented 50-image validation subset and generates test visualizations.
"""

import sys
import json
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("quick_eval")

def main():
    logger.info("==================================================================")
    logger.info("  FoodShareAI - Quick Real Checkpoint Evaluation (10-Min Mode)")
    logger.info("==================================================================")
    
    workspace_root = Path(__file__).resolve().parent.parent
    checkpoint_path = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu" / "weights" / "best.pt"
    subset_yaml = workspace_root / "datasets" / "food_detection" / "food_detection_subset_eval.yaml"
    subset_txt = workspace_root / "datasets" / "food_detection" / "val_subset_50.txt"
    test_img_dir = workspace_root / "datasets" / "food_detection" / "images" / "test"
    
    out_dir = workspace_root / "runs" / "food_detection_cpu_baseline" / "quick_eval_subset"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Target Checkpoint:   {checkpoint_path}")
    logger.info(f"Checkpoint Exists:   {checkpoint_path.exists()} ({checkpoint_path.stat().st_size / (1024*1024):.2f} MB)")
    logger.info(f"Validation Subset:   {subset_txt} (50 images)")
    logger.info(f"Subset Config YAML:  {subset_yaml}")
    logger.info(f"Output Directory:    {out_dir}")
    
    if not checkpoint_path.exists():
        logger.error(f"Checkpoint not found at {checkpoint_path}")
        sys.exit(1)
        
    from ultralytics import YOLO
    
    # 1. Load model
    logger.info("Loading YOLOv8 model from checkpoint...")
    model = YOLO(str(checkpoint_path))
    class_names = model.names
    logger.info(f"Model loaded: {len(class_names)} classes recognized.")
    
    # 2. Run real evaluation on the 50 validation images
    logger.info("\n--- 1. EVALUATING ON 50-IMAGE VALIDATION SUBSET ---")
    start_eval = datetime.now()
    metrics = model.val(
        data=str(subset_yaml),
        split="val",
        imgsz=416,
        batch=4,
        device="cpu",
        plots=True,
        project=str(workspace_root / "runs" / "food_detection_cpu_baseline"),
        name="quick_eval_subset",
        exist_ok=True,
        verbose=True
    )
    eval_duration = datetime.now() - start_eval
    logger.info(f"Evaluation completed in {eval_duration}.")
    
    # Extract actual metrics
    mp = float(metrics.box.mp) if hasattr(metrics, "box") and hasattr(metrics.box, "mp") else 0.0
    mr = float(metrics.box.mr) if hasattr(metrics, "box") and hasattr(metrics.box, "mr") else 0.0
    map50 = float(metrics.box.map50) if hasattr(metrics, "box") and hasattr(metrics.box, "map50") else 0.0
    map50_95 = float(metrics.box.map) if hasattr(metrics, "box") and hasattr(metrics.box, "map") else 0.0
    
    # Per-class metrics
    maps = getattr(metrics.box, "maps", [])
    per_class = {}
    for cls_idx, cls_name in class_names.items():
        score = float(maps[cls_idx]) if cls_idx < len(maps) else 0.0
        per_class[cls_name] = round(score, 4)
        
    detected_classes = {k: v for k, v in per_class.items() if v > 0.0}
    
    # 3. Sample test image inference & visual saves
    vis_dir = out_dir / "test_visualizations"
    vis_dir.mkdir(parents=True, exist_ok=True)
    
    test_images = sorted(list(test_img_dir.glob("*.jpg")))[:6]
    logger.info(f"\n--- 2. RUNNING INFERENCE ON {len(test_images)} HELD-OUT TEST IMAGES ---")
    
    mapping_file = workspace_root / "datasets" / "food_detection" / "class_mapping.json"
    class_mapping = {}
    if mapping_file.exists():
        with open(mapping_file) as f:
            class_mapping = json.load(f)
            
    sample_detections = []
    for img_path in test_images:
        preds = model.predict(
            source=str(img_path),
            imgsz=416,
            device="cpu",
            conf=0.15,
            save=True,
            project=str(out_dir),
            name="test_visualizations",
            exist_ok=True,
            verbose=False
        )[0]
        
        detections = []
        for box in preds.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = class_names.get(cls_id, f"Class-{cls_id}")
            conf = float(box.conf[0].item())
            app_category = class_mapping.get(cls_name, "UNMAPPED")
            xyxy = [round(x, 1) for x in box.xyxy[0].tolist()]
            detections.append({
                "class_name": cls_name,
                "confidence": round(conf, 4),
                "bbox": xyxy,
                "app_category": app_category
            })
            
        sample_detections.append({
            "image": img_path.name,
            "detection_count": len(detections),
            "detections": detections
        })
        det_summary = [f"{d['class_name']} ({d['confidence']*100:.1f}%)" for d in detections]
        logger.info(f"Test image {img_path.name}: {len(detections)} detections -> {det_summary}")

    # 4. Save Quick Evaluation Report
    report = {
        "report_type": "PRELIMINARY_SUBSET_EVALUATION",
        "notice": "Preliminary results evaluated on a documented 50-image validation subset. Not full validation or held-out test metrics.",
        "timestamp": datetime.now().isoformat(),
        "checkpoint_evaluated": str(checkpoint_path),
        "checkpoint_size_mb": round(checkpoint_path.stat().st_size / (1024*1024), 2),
        "validation_subset_image_count": 50,
        "validation_subset_file": str(subset_txt),
        "evaluation_duration_seconds": round(eval_duration.total_seconds(), 2),
        "metrics": {
            "precision": round(mp, 4),
            "recall": round(mr, 4),
            "mAP50": round(map50, 4),
            "mAP50-95": round(map50_95, 4),
        },
        "classes_with_detections_in_subset": detected_classes,
        "all_per_class_mAP50_95": per_class,
        "sample_test_detections": sample_detections,
        "visualization_directory": str(vis_dir),
    }
    
    report_file = out_dir / "quick_eval_report.json"
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    logger.info(f"\nQuick evaluation report saved to {report_file}")
    
    logger.info("==================================================================")
    logger.info("  QUICK EVALUATION SUMMARY (PRELIMINARY SUBSET)")
    logger.info("==================================================================")
    logger.info(f"Precision:  {mp:.4f}")
    logger.info(f"Recall:     {mr:.4f}")
    logger.info(f"mAP@50:     {map50:.4f}")
    logger.info(f"mAP@50-95:  {map50_95:.4f}")
    logger.info(f"Classes with non-zero mAP: {len(detected_classes)} of {len(class_names)}")
    logger.info("==================================================================")

if __name__ == "__main__":
    main()
