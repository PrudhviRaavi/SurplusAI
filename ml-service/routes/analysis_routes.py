import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel

from utils.image_utils import decode_image_bytes, decode_base64_or_data_uri
from services.pipeline_service import pipeline_service
from services.food_detection_service import food_detection_service
from services.freshness_service import freshness_service
from services.quantity_service import quantity_service
from services.expiry_service import expiry_service
from services.demand_prediction_service import demand_prediction_service
from services.fraud_detection_service import fraud_detection_service
from config.config import MAX_IMAGE_SIZE_BYTES, MODEL_VERSIONS

logger = logging.getLogger("ml_service.routes")
router = APIRouter()

class AnalysisJsonRequest(BaseModel):
    imageData: Optional[str] = None  # Base64 or Data URI
    imageUrl: Optional[str] = None
    foodCategory: Optional[str] = "OTHER"
    preparationTime: Optional[str] = None
    estimatedQuantity: Optional[float] = None

class DemandPredictRequest(BaseModel):
    foodCategory: Optional[str] = "ALL"
    historicalData: List[Dict[str, Any]]
    forecastPeriod: Optional[str] = "24_HOURS"

class FraudAnalyzeRequest(BaseModel):
    entityType: Optional[str] = "DONATION"
    entityId: Optional[str] = None
    features: Dict[str, Any]

@router.get("/health")
def health_check():
    """
    Health check endpoint reporting service and real model loaded status.
    Honest reporting: does NOT report models as loaded unless actually loaded.
    """
    return {
        "status": "ok",
        "service": "foodshare-ml-service",
        "modelVersions": MODEL_VERSIONS,
        "modelsStatus": {
            "foodDetection": {
                "loaded": food_detection_service.is_loaded,
                "version": food_detection_service.version,
                "path": food_detection_service.model_path,
            },
            "freshness": {
                "loaded": freshness_service.is_loaded,
                "version": freshness_service.version,
                "path": freshness_service.model_path,
            },
            "quantity": {
                "loaded": quantity_service.is_loaded,
                "version": quantity_service.version,
                "path": quantity_service.regressor_path,
            },
            "expiry": {
                "loaded": expiry_service.is_loaded,
                "version": expiry_service.version,
                "path": expiry_service.model_path,
            },
            "demand": {
                "loaded": demand_prediction_service.is_loaded,
                "version": demand_prediction_service.version,
                "path": demand_prediction_service.model_path,
            },
            "fraud": {
                "loaded": fraud_detection_service.is_loaded,
                "version": fraud_detection_service.version,
                "path": fraud_detection_service.model_path,
            },
        },
    }

@router.post("/api/ml/fraud/analyze")
def analyze_fraud_risk(request: FraudAnalyzeRequest):
    """
    Behavioral anomaly and risk detection via custom scikit-learn Isolation Forest model.
    Flags unusual patterns for human review without automatic punishment.
    """
    if not request.features:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="features dictionary cannot be empty",
        )

    return fraud_detection_service.detect_anomaly({
        "entityType": request.entityType,
        "entityId": request.entityId,
        "features": request.features,
    })

@router.post("/api/ml/demand/predict")
def predict_food_demand(request: DemandPredictRequest):
    """
    Time-series food demand forecasting via custom LSTM model.
    """
    if not request.historicalData:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="historicalData array cannot be empty",
        )

    return demand_prediction_service.predict_demand({
        "foodCategory": request.foodCategory,
        "historicalData": request.historicalData,
        "forecastPeriod": request.forecastPeriod,
    })

@router.post("/api/ml/analyze")
async def analyze_food(
    file: Optional[UploadFile] = File(None),
    payload: Optional[str] = Form(None),
):
    """
    Multipart endpoint for food image analysis.
    Accepts file upload or JSON payload with base64 data.
    """
    image_bytes = None
    context_metadata = {}

    if file:
        if file.size and file.size > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Image size exceeds maximum limit of {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)}MB",
            )
        image_bytes = await file.read()
    elif payload:
        import json
        try:
            parsed = json.loads(payload)
            context_metadata = {
                "foodCategory": parsed.get("foodCategory", "OTHER"),
                "preparationTime": parsed.get("preparationTime"),
                "estimatedQuantity": parsed.get("estimatedQuantity"),
            }
            if parsed.get("imageData"):
                pil_img, meta = decode_base64_or_data_uri(parsed["imageData"])
                return pipeline_service.run_pipeline(pil_img, meta, context_metadata)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse payload: {str(e)}",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file or base64 imageData is required",
        )

    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty image data received",
        )

    try:
        pil_img, meta = decode_image_bytes(image_bytes)
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err),
        )

    return pipeline_service.run_pipeline(pil_img, meta, context_metadata)

@router.post("/api/ml/analyze/json")
def analyze_food_json(request: AnalysisJsonRequest):
    """
    JSON endpoint for clients providing base64 encoded food images.
    """
    if not request.imageData:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="imageData (base64 string or data URI) is required",
        )

    try:
        pil_img, meta = decode_base64_or_data_uri(request.imageData)
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err),
        )

    context_metadata = {
        "foodCategory": request.foodCategory,
        "preparationTime": request.preparationTime,
        "estimatedQuantity": request.estimatedQuantity,
    }

    return pipeline_service.run_pipeline(pil_img, meta, context_metadata)
