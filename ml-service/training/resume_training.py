#!/usr/bin/env python3
"""
FoodShareAI - Safe YOLOv8 Food Detection Resume & Evaluation Script
Safely resumes training from epoch 5 (epochs 6-10) using last.pt checkpoint,
preserving original artifacts and configuration, followed by validation and test evaluations.
"""

import sys
import json
import logging
from pathlib import Path
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("food_detection_resume")

def main():
    logger.info("==================================================================")
    logger.info("  FoodShareAI - Food Detection Training Resume & Evaluation")
    logger.info("==================================================================")
    
    workspace_root = Path(__file__).resolve().parent.parent
    original_run_dir = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu"
    backup_run_dir = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu_backup"
    resumed_run_dir = workspace_root / "runs" / "food_detection_cpu_baseline" / "yolov8n_10ep_416_cpu_resumed"
    data_yaml = workspace_root / "datasets" / "food_detection" / "food_detection.yaml"
    
    # 1. Verification of paths
    logger.info(f"Workspace Root:    {workspace_root}")
    logger.info(f"Original Run Dir:  {original_run_dir}")
    logger.info(f"Backup Run Dir:    {backup_run_dir}")
    logger.info(f"Resumed Run Dir:   {resumed_run_dir}")
    logger.info(f"Dataset YAML:      {data_yaml}")
    
    if not backup_run_dir.exists():
        logger.error(f"Backup directory {backup_run_dir} does not exist!")
        sys.exit(1)
        
    last_pt = resumed_run_dir / "weights" / "last.pt"
    if not last_pt.exists():
        logger.error(f"Checkpoint last.pt not found at {last_pt}!")
        sys.exit(1)
        
    # 2. Checkpoint inspection with torch
    import torch
    ckpt = torch.load(last_pt, map_location="cpu", weights_only=False)
    epoch_idx = ckpt.get("epoch", -1)
    best_fitness = ckpt.get("best_fitness", None)
    has_optimizer = "optimizer" in ckpt and ckpt["optimizer"] is not None
    
    logger.info(f"Checkpoint Integrity: Verified")
    logger.info(f"Checkpoint Completed Epoch Index: {epoch_idx} (Epoch {epoch_idx + 1} completed)")
    logger.info(f"Checkpoint Best Fitness: {best_fitness}")
    logger.info(f"Optimizer State Present: {has_optimizer}")
    
    if epoch_idx != 4:
        logger.warning(f"Expected epoch index 4 (5 completed epochs), got {epoch_idx}")
    if not has_optimizer:
        logger.error("Optimizer state missing in checkpoint! Cannot safely resume training.")
        sys.exit(1)
        
    # 3. Initialize Ultralytics DetectionTrainer with resume=True
    from ultralytics.models.yolo.detect import DetectionTrainer
    from ultralytics import YOLO
    
    overrides = {
        "model": str(last_pt),
        "resume": True,
        "save_dir": str(resumed_run_dir),
        "data": str(data_yaml),
        "batch": 4,
        "imgsz": 416,
        "device": "cpu",
        "workers": 0,
        "epochs": 10,
    }
    
    logger.info("Initializing DetectionTrainer for resuming remaining epochs (6 to 10)...")
    trainer = DetectionTrainer(overrides=overrides)
    logger.info(f"Trainer save_dir: {trainer.save_dir}")
    logger.info(f"Trainer csv path: {trainer.csv}")
    
    # 4. Start training
    logger.info("Starting resumed training...")
    start_train_time = datetime.now()
    trainer.train()
    end_train_time = datetime.now()
    train_duration = end_train_time - start_train_time
    logger.info(f"Resumed training completed in {train_duration}!")
    
    # 5. Locate best weights
    best_weight = resumed_run_dir / "weights" / "best.pt"
    final_last_weight = resumed_run_dir / "weights" / "last.pt"
    results_csv = resumed_run_dir / "results.csv"
    
    if not best_weight.exists():
        logger.error(f"Best checkpoint not found at {best_weight}")
        sys.exit(1)
        
    logger.info(f"Best checkpoint: {best_weight} ({best_weight.stat().st_size / (1024*1024):.2f} MB)")
    logger.info(f"Last checkpoint: {final_last_weight}")
    logger.info(f"Results CSV:     {results_csv}")
    
    # 6. Evaluate Best Checkpoint on Validation Set
    logger.info("\n==================================================================")
    logger.info("  EVALUATING BEST CHECKPOINT ON VALIDATION SPLIT (589 IMAGES)")
    logger.info("==================================================================")
    eval_model = YOLO(str(best_weight))
    val_metrics = eval_model.val(data=str(data_yaml), split="val", imgsz=416, device="cpu", verbose=True)
    
    val_p = float(val_metrics.box.mp) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mp") else 0.0
    val_r = float(val_metrics.box.mr) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mr") else 0.0
    val_map50 = float(val_metrics.box.map50) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map50") else 0.0
    val_map = float(val_metrics.box.map) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map") else 0.0
    
    # 7. Evaluate Best Checkpoint on Held-Out Test Set
    logger.info("\n==================================================================")
    logger.info("  EVALUATING BEST CHECKPOINT ON HELD-OUT TEST SPLIT (300 IMAGES)")
    logger.info("==================================================================")
    test_metrics = eval_model.val(data=str(data_yaml), split="test", imgsz=416, device="cpu", verbose=True)
    
    test_p = float(test_metrics.box.mp) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mp") else 0.0
    test_r = float(test_metrics.box.mr) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mr") else 0.0
    test_map50 = float(test_metrics.box.map50) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map50") else 0.0
    test_map = float(test_metrics.box.map) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map") else 0.0
    
    # 8. Per-class metrics
    class_names = eval_model.names
    test_maps = getattr(test_metrics.box, "maps", [])
    per_class_metrics = {}
    
    for cls_idx, cls_name in class_names.items():
        cls_map = float(test_maps[cls_idx]) if cls_idx < len(test_maps) else 0.0
        per_class_metrics[cls_name] = {
            "class_id": cls_idx,
            "mAP50-95": round(cls_map, 4),
        }
        
    sorted_classes = sorted(per_class_metrics.items(), key=lambda x: x[1]["mAP50-95"], reverse=True)
    strongest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[:5]]
    weakest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[-5:]]
    
    # 9. Save Evaluation Report
    report = {
        "timestamp": datetime.now().isoformat(),
        "model_architecture": "YOLOv8n",
        "dataset_yaml": str(data_yaml),
        "total_epochs": 10,
        "resumed_epochs_run": "6 to 10",
        "train_duration_resumed_seconds": round(train_duration.total_seconds(), 2),
        "best_checkpoint_path": str(best_weight),
        "last_checkpoint_path": str(final_last_weight),
        "results_csv_path": str(results_csv),
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
        "strongest_classes": strongest_classes,
        "weakest_classes": weakest_classes,
    }
    
    report_file = resumed_run_dir / "resumed_eval_report.json"
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    logger.info(f"\nFinal evaluation report saved to {report_file}")
    
    logger.info("==================================================================")
    logger.info("  RESUME TRAINING & EVALUATION COMPLETE")
    logger.info("==================================================================")
    logger.info(f"Validation: Precision={val_p:.4f}, Recall={val_r:.4f}, mAP50={val_map50:.4f}, mAP50-95={val_map:.4f}")
    logger.info(f"Held-out Test: Precision={test_p:.4f}, Recall={test_r:.4f}, mAP50={test_map50:.4f}, mAP50-95={test_map:.4f}")
    logger.info(f"Top 5 classes: {strongest_classes}")
    logger.info(f"Lowest 5 classes: {weakest_classes}")
    logger.info("==================================================================")

if __name__ == "__main__":
    main()
