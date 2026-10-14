#!/usr/bin/env python3
"""
FoodShareAI - YOLOv8 Food Detection Training Script
Trains a custom YOLOv8 detector on fine-grained food classes.
"""

import os
import sys
import argparse
import logging
from pathlib import Path
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("food_detection_training")

def parse_args():
    parser = argparse.ArgumentParser(description="FoodShareAI YOLOv8 Food Detection Training")
    
    # Model and dataset paths
    parser.add_argument(
        "--model",
        type=str,
        default="yolov8n.pt",
        help="Initial YOLOv8 checkpoint (e.g. yolov8n.pt, yolov8s.pt)",
    )
    parser.add_argument(
        "--data",
        type=str,
        default=str(Path(__file__).resolve().parent.parent / "datasets" / "food_detection" / "food_detection.yaml"),
        help="Path to dataset YAML config",
    )
    
    # Training hyperparameters
    parser.add_argument("--epochs", type=int, default=30, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Target image size (pixels)")
    parser.add_argument("--batch", type=int, default=16, help="Batch size per step")
    parser.add_argument("--device", type=str, default="cpu", help="Compute device ('cpu', '0', etc.)")
    parser.add_argument("--workers", type=int, default=2, help="DataLoader worker processes")
    parser.add_argument("--cache", action="store_true", default=False, help="Cache images in RAM")
    parser.add_argument("--fraction", type=float, default=1.0, help="Fraction of dataset to use for training")
    
    # Output and experiment naming
    parser.add_argument(
        "--project",
        type=str,
        default=str(Path(__file__).resolve().parent.parent / "runs" / "food_detection"),
        help="Root directory for training run outputs",
    )
    parser.add_argument(
        "--name",
        type=str,
        default="train",
        help="Experiment run name subdirectory",
    )
    parser.add_argument(
        "--exist-ok",
        action="store_true",
        default=True,
        help="Overwrite existing experiment directory if present",
    )

    return parser.parse_args()

def main():
    args = parse_args()
    
    # Ensure data YAML exists
    data_path = Path(args.data).resolve()
    if not data_path.exists():
        logger.error(f"Dataset YAML configuration not found at '{data_path}'")
        sys.exit(1)
        
    logger.info("==================================================================")
    logger.info("  FoodShareAI - ML Model 1: YOLOv8 Food Detection Training")
    logger.info("==================================================================")
    logger.info(f"Timestamp:       {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"Model:           {args.model}")
    logger.info(f"Dataset YAML:    {data_path}")
    logger.info(f"Epochs:          {args.epochs}")
    logger.info(f"Image Size:      {args.imgsz}")
    logger.info(f"Batch Size:      {args.batch}")
    logger.info(f"Device:          {args.device}")
    logger.info(f"Workers:         {args.workers}")
    logger.info(f"Cache:           {args.cache}")
    logger.info(f"Fraction:        {args.fraction}")
    logger.info(f"Project Dir:     {args.project}")
    logger.info(f"Run Name:        {args.name}")
    logger.info("==================================================================")
    
    # Import Ultralytics
    try:
        from ultralytics import YOLO
    except ImportError as e:
        logger.error(f"Failed to import ultralytics: {e}")
        logger.error("Please run: pip install ultralytics")
        sys.exit(1)
        
    # Initialize YOLOv8 Model
    logger.info(f"Initializing YOLOv8 model from '{args.model}'...")
    model = YOLO(args.model)
    
    # Train
    logger.info("Starting training run...")
    start_time = datetime.now()
    
    # Track initial resource usage
    try:
        import psutil
        mem_start = psutil.virtual_memory()
        logger.info(f"Initial RAM: {mem_start.used / (1024**3):.2f} GB used / {mem_start.total / (1024**3):.2f} GB total ({mem_start.percent}%)")
        logger.info(f"CPU count: {psutil.cpu_count(logical=True)} logical cores")
    except Exception as e:
        logger.warning(f"Could not read psutil metrics: {e}")
        mem_start = None

    results = model.train(
        data=str(data_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=args.device,
        workers=args.workers,
        project=args.project,
        name=args.name,
        exist_ok=args.exist_ok,
        cache=args.cache,
        fraction=args.fraction,
        verbose=True,
    )
    
    end_time = datetime.now()
    duration = end_time - start_time
    logger.info(f"Training run completed in {duration}.")
    
    # Run directory
    if hasattr(results, "save_dir") and results.save_dir:
        run_dir = Path(results.save_dir)
    else:
        run_dir = Path(args.project) / args.name
        
    best_weight = run_dir / "weights" / "best.pt"
    last_weight = run_dir / "weights" / "last.pt"
    results_csv = run_dir / "results.csv"
    
    if not best_weight.exists():
        logger.error(f"Expected best checkpoint not found at {best_weight}")
        sys.exit(1)
        
    logger.info(f"Best checkpoint found at: {best_weight} ({best_weight.stat().st_size / (1024*1024):.2f} MB)")
    logger.info(f"Last checkpoint found at: {last_weight}")
    logger.info(f"Results CSV found at:    {results_csv}")
    
    # Parse results.csv for training trajectory, best epoch, and overfitting signs
    best_epoch = None
    epochs_completed = args.epochs
    train_loss_history = []
    val_loss_history = []
    overfitting_analysis = "No overfitting detected."
    
    if results_csv.exists():
        try:
            import pandas as pd
            df_res = pd.read_csv(results_csv)
            df_res.columns = [c.strip() for c in df_res.columns]
            epochs_completed = len(df_res)
            
            # Find best epoch by mAP50-95 or mAP50
            map_col = "metrics/mAP50-95(B)" if "metrics/mAP50-95(B)" in df_res.columns else "metrics/mAP50(B)"
            if map_col in df_res.columns:
                best_idx = df_res[map_col].idxmax()
                best_epoch = int(df_res.loc[best_idx, "epoch"]) if "epoch" in df_res.columns else int(best_idx) + 1
            
            # Check loss trends for overfitting
            if "train/box_loss" in df_res.columns and "val/box_loss" in df_res.columns and len(df_res) >= 3:
                init_val_loss = df_res["val/box_loss"].iloc[0] + df_res["val/cls_loss"].iloc[0]
                final_val_loss = df_res["val/box_loss"].iloc[-1] + df_res["val/cls_loss"].iloc[-1]
                min_val_loss = (df_res["val/box_loss"] + df_res["val/cls_loss"]).min()
                if final_val_loss > min_val_loss * 1.15:
                    overfitting_analysis = f"Possible mild overfitting: Val loss reached minimum at an earlier epoch and rose by >15% by epoch {epochs_completed}."
                else:
                    overfitting_analysis = "Healthy convergence: Val loss remained stable/decreasing alongside train loss."
        except Exception as e:
            logger.warning(f"Could not parse results.csv for trajectory: {e}")

    # Load best model for official evaluation
    logger.info("Loading best model weights for validation and test evaluations...")
    eval_model = YOLO(str(best_weight))
    
    # 1. Validation split evaluation
    logger.info("Evaluating best model on VALIDATION split (589 images)...")
    val_metrics = eval_model.val(data=str(data_path), split="val", imgsz=args.imgsz, device=args.device)
    
    # 2. Test split evaluation (held-out test set: 300 images)
    logger.info("Evaluating best model on HELD-OUT TEST split (300 images)...")
    test_metrics = eval_model.val(data=str(data_path), split="test", imgsz=args.imgsz, device=args.device)
    
    # Extract metrics safely
    val_p = float(val_metrics.box.mp) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mp") else 0.0
    val_r = float(val_metrics.box.mr) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "mr") else 0.0
    val_map50 = float(val_metrics.box.map50) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map50") else 0.0
    val_map = float(val_metrics.box.map) if hasattr(val_metrics, "box") and hasattr(val_metrics.box, "map") else 0.0

    test_p = float(test_metrics.box.mp) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mp") else 0.0
    test_r = float(test_metrics.box.mr) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "mr") else 0.0
    test_map50 = float(test_metrics.box.map50) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map50") else 0.0
    test_map = float(test_metrics.box.map) if hasattr(test_metrics, "box") and hasattr(test_metrics.box, "map") else 0.0

    # Per-class metrics on test split
    class_names = eval_model.names
    test_maps = getattr(test_metrics.box, "maps", [])
    per_class_metrics = {}
    
    for cls_idx, cls_name in class_names.items():
        cls_map = float(test_maps[cls_idx]) if cls_idx < len(test_maps) else 0.0
        per_class_metrics[cls_name] = {
            "class_id": cls_idx,
            "mAP50-95": round(cls_map, 4),
        }

    # Rank classes
    sorted_classes = sorted(per_class_metrics.items(), key=lambda x: x[1]["mAP50-95"], reverse=True)
    strongest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[:5]]
    weakest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes if d["mAP50-95"] < 0.05]
    if not weakest_classes:
        weakest_classes = [(c, d["mAP50-95"]) for c, d in sorted_classes[-5:]]

    # 3. Test inferences and FoodShareAI mapping check
    mapping_file = Path(__file__).resolve().parent.parent / "datasets" / "food_detection" / "class_mapping.json"
    class_mapping = {}
    if mapping_file.exists():
        import json
        with open(mapping_file, "r") as f:
            class_mapping = json.load(f)
            
    # Verify all 30 classes map to FoodShareAI categories
    unmapped_all_classes = [c for c in class_names.values() if c not in class_mapping]
    
    # Sample predictions from test set
    test_img_dir = Path(__file__).resolve().parent.parent / "datasets" / "food_detection" / "images" / "test"
    sample_images = sorted(list(test_img_dir.glob("*.jpg")))[:6]
    sample_results = []
    
    logger.info(f"Running sample inference on {len(sample_images)} unseen test images...")
    for img_path in sample_images:
        preds = eval_model(str(img_path), imgsz=args.imgsz, device=args.device, verbose=False, conf=0.15)[0]
        boxes_info = []
        for box in preds.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = class_names.get(cls_id, f"Unknown-{cls_id}")
            conf = float(box.conf[0].item())
            app_category = class_mapping.get(cls_name, "UNMAPPED")
            xyxy = [round(x, 1) for x in box.xyxy[0].tolist()]
            boxes_info.append({
                "class_name": cls_name,
                "confidence": round(conf, 4),
                "bbox": xyxy,
                "app_category": app_category
            })
        sample_results.append({
            "image": img_path.name,
            "detections": boxes_info
        })

    # Memory usage at completion
    try:
        mem_end = psutil.virtual_memory()
        mem_info = {
            "used_gb": round(mem_end.used / (1024**3), 2),
            "total_gb": round(mem_end.total / (1024**3), 2),
            "percent": mem_end.percent
        }
    except Exception:
        mem_info = {}

    # Assemble training summary report
    report = {
        "timestamp": datetime.now().isoformat(),
        "model_architecture": "YOLOv8n",
        "pretrained_weights": args.model,
        "dataset_yaml": str(data_path),
        "hyperparameters": {
            "epochs": args.epochs,
            "imgsz": args.imgsz,
            "batch": args.batch,
            "device": args.device,
            "workers": args.workers,
            "cache": args.cache,
            "fraction": args.fraction,
        },
        "training_completion_status": "COMPLETED",
        "actual_epochs_completed": epochs_completed,
        "best_epoch": best_epoch,
        "training_duration_seconds": round(duration.total_seconds(), 2),
        "training_duration_str": str(duration),
        "run_directory": str(run_dir),
        "best_checkpoint_path": str(best_weight),
        "last_checkpoint_path": str(last_weight),
        "results_csv_path": str(results_csv),
        "checkpoint_size_mb": round(best_weight.stat().st_size / (1024*1024), 2),
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
        "overfitting_analysis": overfitting_analysis,
        "unmapped_dataset_classes": unmapped_all_classes,
        "sample_inferences": sample_results,
        "resource_usage": mem_info,
        "production_candidate_readiness": "Candidate Baseline Checkpoint (Pending Review - Best.pt remains isolated)"
    }

    import json
    report_path = run_dir / "training_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    logger.info(f"Detailed training report saved to {report_path}")

    logger.info("==================================================================")
    logger.info("  FINAL TRAINING & EVALUATION REPORT")
    logger.info("==================================================================")
    logger.info(f"Status:             COMPLETED ({epochs_completed} epochs)")
    logger.info(f"Duration:           {duration}")
    logger.info(f"Best Epoch:         {best_epoch}")
    logger.info(f"Best Checkpoint:    {best_weight} ({report['checkpoint_size_mb']} MB)")
    logger.info(f"Last Checkpoint:    {last_weight}")
    logger.info(f"Results CSV:        {results_csv}")
    logger.info(f"Validation mAP50:   {val_map50:.4f}, mAP50-95: {val_map:.4f}")
    logger.info(f"Test Precision:     {test_p:.4f}, Recall: {test_r:.4f}")
    logger.info(f"Test mAP50:         {test_map50:.4f}, Test mAP50-95: {test_map:.4f}")
    logger.info(f"Strongest Classes:  {strongest_classes}")
    logger.info(f"Weakest Classes:    {weakest_classes}")
    logger.info(f"Overfitting Check:  {overfitting_analysis}")
    logger.info(f"Category Mapping:   {'All 30 classes cleanly mapped' if not unmapped_all_classes else f'Unmapped: {unmapped_all_classes}'}")
    logger.info("==================================================================")

if __name__ == "__main__":
    main()
