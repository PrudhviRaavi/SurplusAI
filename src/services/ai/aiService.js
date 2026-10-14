import { ML_BASE_URL } from '../api/apiConfig';
import { donorApiService } from '../api/donorApiService';
import { freshnessEstimator } from './freshnessEstimator';

export const VALID_APP_CATEGORIES = [
  'COOKED_MEALS',
  'FRUITS_VEGETABLES',
  'BAKERY',
  'PACKAGED_FOOD',
  'DAIRY',
  'BEVERAGES',
  'OTHER',
];

export const APP_CATEGORY_LABELS = {
  COOKED_MEALS: 'Cooked Meals',
  FRUITS_VEGETABLES: 'Fruits & Vegetables',
  BAKERY: 'Bakery Items',
  PACKAGED_FOOD: 'Packaged Food',
  DAIRY: 'Dairy Products',
  BEVERAGES: 'Beverages',
  OTHER: 'Other Food Items',
};

/**
 * Converts a remote, local file, or blob URI to a base64 Data URI if needed.
 */
const ensureDataUri = async (uri, metadata = {}) => {
  if (metadata?.base64) {
    return metadata.base64.startsWith('data:')
      ? metadata.base64
      : `data:image/jpeg;base64,${metadata.base64}`;
  }
  if (!uri) return null;
  if (uri.startsWith('data:image/')) return uri;

  // Local file / content URI handling (e.g. Android file:/// or content://)
  if (uri.startsWith('file:') || uri.startsWith('content:')) {
    try {
      let FileSystem;
      try {
        FileSystem = require('expo-file-system');
      } catch (_) {}

      if (FileSystem && FileSystem.readAsStringAsync) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType?.Base64 || 'base64',
        });
        if (base64) {
          return `data:image/jpeg;base64,${base64}`;
        }
      }
    } catch (fsErr) {
      console.warn('[aiService] expo-file-system local file read error:', fsErr.message);
    }
  }

  if (
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('blob:') ||
    uri.startsWith('file:') ||
    uri.startsWith('content:')
  ) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('[aiService] Could not convert URI to data URI:', err.message);
      return uri;
    }
  }

  // Likely a raw base64 string
  return `data:image/jpeg;base64,${uri}`;
};

/**
 * Public AI Service Interface
 * Connected directly to the candidate FastAPI ML service (port 8002) with backend gateway fallback.
 * Strictly honest: Never fabricates freshness, quantity, or expiry scores when models are unavailable.
 */
export const aiService = {
  analyzeFoodImage: async (imageUri, metadata = {}) => {
    try {
      if (!imageUri && !metadata?.base64) {
        return {
          success: false,
          error: 'Please upload or select a clear food image.',
        };
      }

      const imageData = await ensureDataUri(imageUri, metadata);
      let rawResult = null;

      // 1. First attempt direct connection to candidate ML microservice (configured via ML_BASE_URL)
      if (!ML_BASE_URL.includes('__UNCONFIGURED_ANDROID_LAN_HOST__')) {
        try {
          const mlResponse = await fetch(`${ML_BASE_URL}/api/ml/analyze/json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              imageData,
              foodCategory: metadata.foodCategory || 'OTHER',
              preparationTime: metadata.preparationTime || null,
              estimatedQuantity: metadata.quantity ? Number(metadata.quantity) : null,
            }),
          });

          if (mlResponse.ok) {
            rawResult = await mlResponse.json();
          }
        } catch (directErr) {
          console.info('[aiService] Direct ML endpoint query failed or offline, trying backend gateway:', directErr.message);
        }
      } else {
        console.warn('[aiService] Direct ML endpoint skipped: Missing LAN IP configuration for physical Android.');
      }

      // 2. Fallback to Express backend gateway (/api/ai/analyze) if direct ML connection did not succeed
      if (!rawResult) {
        try {
          const backendResponse = await donorApiService.analyzeImage({
            imageUri: imageData || imageUri,
            foodCategory: metadata.foodCategory || 'OTHER',
            preparationTime: metadata.preparationTime || null,
            quantity: metadata.quantity || null,
          });
          if (backendResponse && backendResponse.success) {
            rawResult = backendResponse.raw || backendResponse;
          }
        } catch (backendErr) {
          console.warn('[aiService] Backend gateway also unavailable:', backendErr.message);
        }
      }

      if (!rawResult) {
        return {
          success: false,
          error: `Could not reach the AI ML service at ${ML_BASE_URL}. Ensure the service is running.`,
        };
      }

      // Check model loaded state
      const foodDetection = rawResult.foodDetection || {};
      const isDetectionLoaded = foodDetection.status === 'LOADED';

      if (!isDetectionLoaded) {
        return {
          success: true,
          modelLoaded: false,
          detectedFood: 'Model not loaded',
          detectedItems: [],
          detections: [],
          confidence: 'N/A',
          confidenceScore: null,
          category: metadata.foodCategory || 'OTHER',
          categoryLabel: APP_CATEGORY_LABELS[metadata.foodCategory] || 'Other Food Items',
          isLowConfidence: false,
          freshnessLabel: 'Inspection Required',
          freshnessScore: null,
          estimatedQuantity: 'Manual review required',
          estimatedQuantityNum: null,
          quantityConfidence: null,
          estimatedConsumptionWindow: 'Inspect before consumption',
          disclaimer: 'Candidate model is not loaded in memory.',
        };
      }

      // Parse real detections from YOLOv8 candidate
      const rawDetections = foodDetection.detections || [];
      const normalizedDetections = rawDetections.map((d) => {
        const cat = d.category && VALID_APP_CATEGORIES.includes(d.category) ? d.category : 'OTHER';
        return {
          className: d.className,
          itemName: d.itemName || d.className,
          category: cat,
          categoryLabel: APP_CATEGORY_LABELS[cat] || 'Other Food Items',
          confidence: d.confidence,
          confidencePercent: `${Math.round(d.confidence * 100)}%`,
          isLowConfidence: d.confidence < 0.50,
          boundingBox: d.boundingBox,
        };
      });

      const hasDetections = normalizedDetections.length > 0;
      const primary = hasDetections ? normalizedDetections[0] : null;

      const detectedFood = primary ? primary.itemName : 'No Food Detected';
      const category = primary ? primary.category : (metadata.foodCategory || 'OTHER');
      const categoryLabel = APP_CATEGORY_LABELS[category] || 'Other Food Items';
      const confidenceScore = primary ? primary.confidence : null;
      const confidence = primary ? primary.confidencePercent : '0%';
      const isLowConfidence = primary ? primary.isLowConfidence : true;

      // Auxiliary models: HONEST values only (no fake percentages or hours)
      const rawFreshness = rawResult.freshnessPrediction || {};
      const isFreshnessModelLoaded = rawFreshness.status === 'LOADED' && rawFreshness.confidence != null;

      // Transparent Freshness Evaluation
      const freshnessEval = freshnessEstimator.estimateFreshness({
        foodCategory: category,
        preparationTime: metadata.preparationTime,
        storageCondition: metadata.storageCondition,
        trainedModelResult: rawFreshness,
      });

      const freshnessLabel = freshnessEval.label;
      const freshnessScore = freshnessEval.score;
      const freshnessSource = freshnessEval.source;
      const freshnessBadge = freshnessEval.sourceBadge;
      const freshnessFactors = freshnessEval.factors;
      const freshnessExplanation = freshnessEval.explanation;

      const quantity = rawResult.quantityEstimation || {};
      const isQuantityLoaded = quantity.status === 'LOADED' && quantity.estimatedQuantity != null;
      const estimatedQuantityNum = isQuantityLoaded ? quantity.estimatedQuantity : null;
      const estimatedQuantity = isQuantityLoaded ? `${estimatedQuantityNum} ${quantity.unit || 'kg'}` : 'Manual entry required';

      const expiry = rawResult.expiryPrediction || {};
      const isExpiryLoaded = expiry.status === 'LOADED' && expiry.safeConsumptionHours != null;
      const consumptionWindow = isExpiryLoaded
        ? `${expiry.safeConsumptionHours} hours`
        : (freshnessEval.safeWindowText || 'Inspect before consumption');

      return {
        success: true,
        modelLoaded: true,
        hasDetections,
        detectedFood,
        detectedItems: normalizedDetections.map((d) => d.itemName),
        detections: normalizedDetections,
        primaryDetection: primary,
        category,
        categoryLabel,
        confidence,
        confidenceScore,
        isLowConfidence,
        freshnessLabel,
        freshnessScore,
        freshnessSource,
        freshnessBadge,
        freshnessFactors,
        freshnessExplanation,
        isFreshnessLoaded: isFreshnessModelLoaded,
        estimatedQuantity,
        estimatedQuantityNum,
        isQuantityLoaded,
        estimatedConsumptionWindow: consumptionWindow,
        isExpiryLoaded,
        disclaimer: expiry.disclaimer || freshnessEval.disclaimer || 'Always verify food aroma, texture, and appearance before donation.',
        processingTimeMs: rawResult.processingTimeMs || null,
      };
    } catch (err) {
      console.warn('[aiService error]', err.message);
      return {
        success: false,
        error: `AI analysis failed: ${err.message}`,
      };
    }
  },
};
