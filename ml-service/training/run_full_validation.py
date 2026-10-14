#!/usr/bin/env python3
"""
FoodShareAI - Full Validation of Epoch 5 Checkpoint
Runs Ultralytics YOLO validation against the complete 589-image validation split.
Saves comprehensive metrics, speed metrics, per-class analysis, and JSON report.
"""

import sys
import json
import hashlib
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("full_validation")

def get_file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(8192 * 1024):
            h.update(chunk)
    return h.hexdigest().upper()

def main():
    logger.info("==================================================================")
    logger.info("  FoodShareAI - Full Validation Evaluation (Epoch 5 Checkpoint)")
    logger.info("==================================================================")
    
    workspace_root = Path(__file__).resolve().parent.parent
    checkpoint_path = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu" / "weights" / "best.pt"
    data_yaml = workspace_root / "datasets" / "food_detection" / "food_detection.yaml"
    out_dir = workspace_root / "runs" / "food_detection_cpu_baseline" / "full_validation_epoch5"
    results_csv = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu" / "results.csv"
    
    out_dir.mkdir(parents=True, exist_ok=True)
    
    if not checkpoint_path.exists():
        logger.error(f"Checkpoint not found at {checkpoint_path}")
        sys.exit(1)
    if not data_yaml.exists():
        logger.error(f"Dataset YAML not found at {data_yaml}")
        sys.exit(1)
        
    chk_size_bytes = checkpoint_path.stat().st_size
    chk_size_mb = round(chk_size_bytes / (1024 * 1024), 2)
    chk_hash = get_file_sha256(checkpoint_path)
    
    logger.info(f"Target Checkpoint:  {checkpoint_path}")
    logger.info(f"Size:               {chk_size_bytes} bytes ({chk_size_mb} MB)")
    logger.info(f"SHA-256 Hash:       {chk_hash}")
    logger.info(f"Dataset YAML:       {data_yaml}")
    logger.info(f"Output Directory:   {out_dir}")
    
    from ultralytics import YOLO
    
    logger.info("Loading model...")
    model = YOLO(str(checkpoint_path))
    class_names = model.names
    logger.info(f"Loaded YOLOv8 model with {len(class_names)} classes.")
    
    logger.info("\nExecuting validation on full 589 validation images (device=cpu, imgsz=416, batch=8)...")
    start_time = datetime.now()
    
    metrics = model.val(
        data=str(data_yaml),
        split="val",
        imgsz=416,
        batch=8,
        device="cpu",
        plots=True,
        project=str(workspace_root / "runs" / "food_detection_cpu_baseline"),
        name="full_validation_epoch5",
        exist_ok=True,
        verbose=True
    )
    
    duration = datetime.now() - start_time
    logger.info(f"Full validation completed in {duration}.")
    
    # Extract overall metrics
    p = float(metrics.box.mp) if hasattr(metrics.box, "mp") else 0.0
    r = float(metrics.box.mr) if hasattr(metrics.box, "mr") else 0.0
    map50 = float(metrics.box.map50) if hasattr(metrics.box, "map50") else 0.0
    map50_95 = float(metrics.box.map) if hasattr(metrics.box, "map") else 0.0
    
    # Inference speeds
    speeds = getattr(metrics, "speed", {})
    
    # Per-class metrics
    maps = getattr(metrics.box, "maps", [])
    per_class_metrics = {}
    for cls_idx, cls_name in class_names.items():
        cls_map = float(maps[cls_idx]) if cls_idx < len(maps) else 0.0
        per_class_metrics[cls_name] = {
            "class_id": cls_idx,
            "mAP50-95": round(cls_map, 4)
        }
        
    sorted_classes = sorted(per_class_metrics.items(), key=lambda x: x[1]["mAP50-95"], reverse=True)
    strongest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[:5]]
    weakest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[-5:]]
    zero_map_classes = [c for c, d in sorted_classes if d["mAP50-95"] == 0.0]
    
    # Historical comparison against results.csv Epoch 5
    hist_epoch5 = {}
    if results_csv.exists():
        import csv
        with open(results_csv) as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("epoch") == "5":
                    hist_epoch5 = {
                        "precision": float(row.get("metrics/precision(B)", 0)),
                        "recall": float(row.get("metrics/recall(B)", 0)),
                        "mAP50": float(row.get("metrics/mAP50(B)", 0)),
                        "mAP50-95": float(row.get("metrics/mAP50-95(B)", 0)),
                    }
                    break
                    
    # Previous 50-image subset metrics
    subset_metrics = {
        "precision": 0.2202,
        "recall": 0.4830,
        "mAP50": 0.4074,
        "mAP50-95": 0.3404,
    }
    
    report = {
        "report_type": "FULL_VALIDATION_EPOCH5",
        "timestamp": datetime.now().isoformat(),
        "checkpoint": {
            "path": str(checkpoint_path),
            "size_bytes": chk_size_bytes,
            "size_mb": chk_size_mb,
            "sha256": chk_hash,
            "model_architecture": "YOLOv8n",
            "epochs_trained": 5,
        },
        "dataset": {
            "config_yaml": str(data_yaml),
            "split": "val",
            "total_val_images": 589,
            "imgsz": 416,
            "batch_size": 8,
            "device": "cpu",
        },
        "execution_duration_seconds": round(duration.total_seconds(), 2),
        "speed_ms_per_image": {
            "preprocess": round(speeds.get("preprocess", 0.0), 2),
            "inference": round(speeds.get("inference", 0.0), 2),
            "loss": round(speeds.get("loss", 0.0), 2),
            "postprocess": round(speeds.get("postprocess", 0.0), 2),
        },
        "full_validation_metrics": {
            "precision": round(p, 5),
            "recall": round(r, 5),
            "mAP50": round(map50, 5),
            "mAP50-95": round(map50_95, 5),
        },
        "historical_results_csv_epoch5": hist_epoch5,
        "previous_50_image_subset_metrics": subset_metrics,
        "per_class_mAP50_95": per_class_metrics,
        "strongest_classes": strongest_classes,
        "weakest_classes": weakest_classes,
        "zero_map_classes_count": len(zero_map_classes),
        "zero_map_classes": zero_map_classes,
        "artifacts_generated": [
            str(out_dir / "full_validation_report.json"),
            str(out_dir / "confusion_matrix.png"),
            str(out_dir / "confusion_matrix_normalized.png"),
            str(out_dir / "BoxPR_curve.png"),
            str(out_dir / "BoxF1_curve.png"),
            str(out_dir / "val_batch0_pred.jpg"),
            str(out_dir / "val_batch0_labels.jpg"),
        ]
    }
    
    report_path = out_dir / "full_validation_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    logger.info(f"Machine-readable full validation report saved to: {report_path}")
    
    logger.info("==================================================================")
    logger.info("  FULL VALIDATION SUMMARY (589 IMAGES)")
    logger.info("==================================================================")
    logger.info(f"Precision:    {p:.5f}")
    logger.info(f"Recall:       {r:.5f}")
    logger.info(f"mAP@50:       {map50:.5f}")
    logger.info(f"mAP@50-95:    {map50_95:.5f}")
    logger.info(f"Strongest:    {strongest_classes}")
    logger.info(f"Weakest:      {weakest_classes}")
    logger.info(f"Zero mAP:     {len(zero_map_classes)} classes: {zero_map_classes}")
    logger.info(f"Speed:        {speeds.get('inference', 0.0):.1f}ms inference/image")
    logger.info("==================================================================")

if __name__ == "__main__":
    main()
