"""
FoodShareAI - Fraud & Anomaly Feature Engineering
Extracts standard measurable numerical features for Isolation Forest anomaly detection.
Uses exclusively operational metrics without sensitive personal attributes.
"""
import logging
from typing import Dict, Any, List
import numpy as np

logger = logging.getLogger("ml_service.fraud_features")

# Standard feature ordering expected by Isolation Forest model
FEATURE_NAMES = [
    "donation_frequency_per_week",
    "average_donation_quantity",
    "quantity_deviation",
    "claim_frequency_per_week",
    "cancellation_rate",
    "delivery_completion_rate",
    "rapid_submission_count",
    "duplicate_content_flag",
    "account_activity_velocity",
]

def extract_feature_vector(features: Dict[str, Any]) -> np.ndarray:
    """
    Transforms dictionary of raw operational indicators into a standardized numeric feature vector.
    Validates bounds and prevents NaN/infinite values.
    """
    if not isinstance(features, dict):
        raise ValueError("features must be a dictionary of operational metrics")

    try:
        donation_freq = float(features.get("donationFrequency", features.get("donation_frequency_per_week", 0.0)))
        avg_qty = float(features.get("averageQuantity", features.get("average_donation_quantity", 1.0)))
        qty_dev = float(features.get("quantityDeviation", features.get("quantity_deviation", 0.0)))
        claim_freq = float(features.get("claimFrequency", features.get("claim_frequency_per_week", 0.0)))
        cancel_rate = float(features.get("cancellationRate", features.get("cancellation_rate", 0.0)))
        completion_rate = float(features.get("completionRate", features.get("delivery_completion_rate", 1.0)))
        rapid_submissions = float(features.get("rapidSubmissions", features.get("rapid_submission_count", 0.0)))
        duplicate_flag = 1.0 if features.get("duplicateFlag", features.get("duplicate_content_flag", False)) else 0.0
        activity_velocity = float(features.get("activityVelocity", features.get("account_activity_velocity", 1.0)))

        # Constrain rates between 0 and 1
        cancel_rate = max(0.0, min(1.0, cancel_rate))
        completion_rate = max(0.0, min(1.0, completion_rate))

        vector = np.array([
            donation_freq,
            avg_qty,
            qty_dev,
            claim_freq,
            cancel_rate,
            completion_rate,
            rapid_submissions,
            duplicate_flag,
            activity_velocity,
        ], dtype=np.float32)

        # Replace any potential nan/inf with zero
        vector = np.nan_to_num(vector, nan=0.0, posinf=100.0, neginf=0.0)

        # Reshape to 2D array (1, n_features) for scikit-learn
        return vector.reshape(1, -1)

    except Exception as e:
        logger.error(f"Error vectorizing fraud features: {str(e)}")
        raise ValueError(f"Feature vectorization failed: {str(e)}")

def explain_anomalous_features(features: Dict[str, Any]) -> List[str]:
    """
    Generates explainable, non-accusatory operational risk reasons for detected anomalies.
    Does NOT declare fraud; highlights measurable outlier factors for human review.
    """
    reasons = []

    rapid = float(features.get("rapidSubmissions", features.get("rapid_submission_count", 0.0)))
    if rapid >= 3:
        reasons.append(f"Unusually high submission frequency: {int(rapid)} donations within 15 minutes")

    qty_dev = float(features.get("quantityDeviation", features.get("quantity_deviation", 0.0)))
    avg_qty = float(features.get("averageQuantity", features.get("average_donation_quantity", 1.0)))
    if avg_qty > 0 and qty_dev > (avg_qty * 3.0):
        reasons.append(f"Abnormal quantity deviation: Listing quantity deviates significantly from historic average ({avg_qty:.1f})")

    cancel_rate = float(features.get("cancellationRate", features.get("cancellation_rate", 0.0)))
    if cancel_rate > 0.4:
        reasons.append(f"Elevated cancellation rate ({cancel_rate * 100:.1f}%) observed")

    if features.get("duplicateFlag", features.get("duplicate_content_flag", False)):
        reasons.append("Potential duplicate listing detected matching existing donation metadata")

    completion_rate = float(features.get("completionRate", features.get("delivery_completion_rate", 1.0)))
    if completion_rate < 0.5:
        reasons.append(f"Low delivery completion rate ({completion_rate * 100:.1f}%) flagged for review")

    velocity = float(features.get("activityVelocity", features.get("account_activity_velocity", 1.0)))
    if velocity > 5.0:
        reasons.append(f"High activity velocity ({velocity:.1f} events/hr) exceeds standard operational baseline")

    if not reasons:
        reasons.append("Multivariate feature outlier identified by Isolation Forest baseline")

    return reasons
