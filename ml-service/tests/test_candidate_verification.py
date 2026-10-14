"""
FoodShareAI - Phase 3 Candidate Model & Service Verification Test
Tests:
1. Candidate model selection via FOOD_DETECTION_MODEL_PATH
2. Real YOLOv8 inference execution on validation image
3. Missing model error reporting (honest MODEL_NOT_LOADED state)
4. Direct-run Uvicorn entrypoint syntax check
5. FastAPI /health endpoint inspection
"""

import os
import sys
from pathlib import Path
from PIL import Image

# Ensure ml-service root is in sys.path
ML_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ML_ROOT))

CANDIDATE_PATH = ML_ROOT / "colab_preparation" / "candidate_run_165338_best.pt"
VAL_IMAGE_PATH = ML_ROOT / "datasets" / "food_detection" / "images" / "val" / "00101a0160a05d31.jpg"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def run_tests():
    passed = 0
    failed = 0

    def assert_test(condition, label):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  [PASS] {label}")
        else:
            failed += 1
            print(f"  [FAIL] {label}")

    print("\n--- 1. Candidate Model Checkpoint Existence & Loading ---")
    assert_test(CANDIDATE_PATH.exists(), f"Candidate checkpoint exists at {CANDIDATE_PATH}")
    assert_test(VAL_IMAGE_PATH.exists(), f"Validation image exists at {VAL_IMAGE_PATH}")

    # Set explicit environment variable
    os.environ["FOOD_DETECTION_MODEL_PATH"] = str(CANDIDATE_PATH)

    from services.food_detection_service import FoodDetectionService, VALID_APP_CATEGORIES
    service = FoodDetectionService(model_path=str(CANDIDATE_PATH))
    assert_test(service.is_loaded is True, "Candidate YOLOv8 model loaded successfully")
    assert_test(service.model is not None, "YOLO model object instantiated")

    print("\n--- 2. Real Image Inference with Candidate Model ---")
    img = Image.open(VAL_IMAGE_PATH)
    result = service.detect_food(img)

    assert_test(result.get("status") == "LOADED", "Inference returns status: LOADED")
    detections = result.get("detections", [])
    assert_test(len(detections) > 0, f"Candidate model produced real detections (count: {len(detections)})")

    for i, det in enumerate(detections):
        cls_name = det.get("className")
        cat = det.get("category")
        conf = det.get("confidence")
        bbox = det.get("boundingBox", {})
        print(f"     Det #{i+1}: class='{cls_name}', category='{cat}', confidence={conf:.4f}, bbox={bbox}")
        assert_test(conf > 0.0 and conf <= 1.0, f"Confidence score {conf} is a valid probability")
        assert_test(cat in VALID_APP_CATEGORIES, f"Category '{cat}' is in VALID_APP_CATEGORIES")

    print("\n--- 3. Missing Model Error Reporting (Honesty Check) ---")
    missing_service = FoodDetectionService(model_path=str(ML_ROOT / "models" / "non_existent_weights.pt"))
    assert_test(missing_service.is_loaded is False, "Missing model path sets is_loaded=False")
    missing_result = missing_service.detect_food(img)
    assert_test(missing_result.get("status") == "MODEL_NOT_LOADED", "Missing model reports honest MODEL_NOT_LOADED status")
    assert_test("not found" in missing_result.get("message", "").lower(), "Missing model returns informative message")

    print("\n--- 4. Direct-Run Uvicorn Entrypoint Verification ---")
    app_py_content = (ML_ROOT / "app.py").read_text(encoding="utf-8")
    assert_test('uvicorn.run("app:app"' in app_py_content, "app.py uses valid uvicorn.run('app:app') module reference")
    assert_test('uvicorn.run("app.py:app"' not in app_py_content, "app.py does not contain invalid 'app.py:app' reference")

    print("\n--- 5. FastAPI /health Endpoint Check ---")
    from fastapi.testclient import TestClient
    from app import app
    client = TestClient(app)

    health_res = client.get("/health")
    assert_test(health_res.status_code == 200, "FastAPI /health returns HTTP 200")
    health_data = health_res.json()
    assert_test(health_data.get("status") == "ok", "FastAPI /health status is 'ok'")
    assert_test(health_data.get("service") == "foodshare-ml-service", "FastAPI reports correct service name")

    print("\n========================================")
    print(f"Phase 3 ML Verification: {passed} PASSED, {failed} FAILED")
    print("========================================\n")

    if failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
