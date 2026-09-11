/**
 * FoodShareAI - Node.js AI Service Client
 * Connects the Express backend to the standalone FastAPI Python ML microservice.
 * Orchestrates YOLOv8, EfficientNet-B0, YOLOv8-Seg, and XGBoost food analysis.
 * Does NOT invent fake predictions or fake accuracy.
 */

const DEFAULT_ML_SERVICE_URL = 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Normalizes category name for ML service consumption
 */
const normalizeCategoryForMl = (cat) => {
  if (!cat) return 'OTHER';
  return String(cat).toUpperCase().replace(/[\s-]/g, '_');
};

/**
 * Checks connectivity and model loaded state from Python ML microservice
 * @returns {Promise<object>} Health and models status
 */
const checkMlServiceHealth = async () => {
  const mlServiceUrl = process.env.ML_SERVICE_URL || DEFAULT_ML_SERVICE_URL;

  try {
    const response = await fetch(`${mlServiceUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        connected: false,
        status: 'UNHEALTHY',
        statusCode: response.status,
        message: `ML service health responded with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      connected: true,
      status: data.status || 'ok',
      service: data.service,
      modelVersions: data.modelVersions,
      modelsStatus: data.modelsStatus,
    };
  } catch (err) {
    return {
      connected: false,
      status: 'UNREACHABLE',
      message: `Failed to connect to ML service at ${mlServiceUrl}: ${err.message}`,
    };
  }
};

/**
 * Sends a food image to the standalone Python ML microservice for multi-model inference.
 * @param {string} imageReference Image URL, Base64 data string, or Data URI
 * @param {object} contextMetadata Additional context (foodCategory, preparationTime, estimatedQuantity)
 * @returns {Promise<object>} Structured analysis result or controlled failure/unloaded response
 */
const analyzeFoodImage = async (imageReference, contextMetadata = {}) => {
  const mlServiceUrl = process.env.ML_SERVICE_URL || DEFAULT_ML_SERVICE_URL;

  if (!imageReference || typeof imageReference !== 'string' || imageReference.trim() === '') {
    const err = new Error('Valid food image reference is required for AI analysis');
    err.statusCode = 400;
    throw err;
  }

  const payload = {
    imageData: imageReference,
    foodCategory: normalizeCategoryForMl(contextMetadata.foodCategory),
    preparationTime: contextMetadata.preparationTime || null,
    estimatedQuantity: contextMetadata.quantity ? Number(contextMetadata.quantity) : null,
  };

  try {
    const startTime = Date.now();
    const response = await fetch(`${mlServiceUrl}/api/ml/analyze/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    const elapsedMs = Date.now() - startTime;

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorDetail;
      } catch (_) {
        // fallback to status code
      }

      console.warn(`[AIAnalysisClient] ML service returned error: ${errorDetail}`);
      return {
        connected: true,
        success: false,
        status: 'FAILED',
        error: errorDetail,
        processingTime: elapsedMs,
      };
    }

    const mlResponse = await response.json();

    // Check if models were loaded or reported as MODEL_NOT_LOADED
    const modelsLoaded = mlResponse.modelsLoaded || {};
    const anyModelLoaded = Object.values(modelsLoaded).some((v) => v === true);

    const overallStatus = anyModelLoaded ? 'COMPLETED' : 'MODEL_NOT_LOADED';

    return {
      connected: true,
      success: true,
      status: overallStatus,
      raw: mlResponse,
      processingTime: mlResponse.processingTimeMs || elapsedMs,
      modelsLoaded,
      foodDetection: mlResponse.foodDetection?.detections || [],
      freshnessPrediction: mlResponse.freshnessPrediction || null,
      quantityEstimation: mlResponse.quantityEstimation || null,
      expiryPrediction: mlResponse.expiryPrediction || null,
      confidence: {
        overall: mlResponse.overallConfidence || 0,
      },
      imageMetadata: mlResponse.imageMetadata || {},
    };
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    const errorMsg = isTimeout
      ? `ML inference timed out after ${DEFAULT_TIMEOUT_MS}ms`
      : `Failed to connect to ML microservice at ${mlServiceUrl}: ${error.message}`;

    console.warn(`[AIAnalysisClient] ${errorMsg}`);

    return {
      connected: false,
      success: false,
      status: isTimeout ? 'FAILED' : 'UNREACHABLE',
      error: errorMsg,
      message: 'Custom ML microservice is currently unreachable. Real model inference will resume once the service is started.',
      isTimeout,
    };
  }
};

module.exports = {
  analyzeFoodImage,
  checkMlServiceHealth,
};
