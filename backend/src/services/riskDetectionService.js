/**
 * FoodShareAI - Risk & Anomaly Detection Service
 * Extracts operational telemetry, coordinates with Python ML Isolation Forest service,
 * and creates non-accusatory governance RiskAssessment records in MongoDB.
 * Handles timeouts and offline ML microservice gracefully with deterministic fallback rules.
 */
const http = require('http');
const https = require('https');
const { URL } = require('url');
const { RiskAssessment, Donation, Claim, Delivery } = require('../models');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_TIMEOUT_MS = parseInt(process.env.ML_FRAUD_TIMEOUT_MS, 10) || 3000;

/**
 * Dispatches an HTTP POST request to the Python ML microservice.
 */
const callMlService = (endpoint, payload) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(endpoint, ML_SERVICE_URL);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const postData = JSON.stringify(payload);

      const req = client.request(
        {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
          timeout: ML_TIMEOUT_MS,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(JSON.parse(body));
              } else {
                reject(new Error(`ML service responded with HTTP ${res.statusCode}: ${body}`));
              }
            } catch (err) {
              reject(new Error(`Failed to parse ML service response: ${err.message}`));
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`ML service request timed out after ${ML_TIMEOUT_MS}ms`));
      });

      req.write(postData);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Extracts measurable operational telemetry for a donation/user.
 */
const extractRiskFeatures = async ({ userId, donation = null }) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

  // 1. User historic donation activity
  const recentDonations = await Donation.find({
    donorId: userId,
    createdAt: { $gte: oneWeekAgo },
  }).lean();

  const totalDonationsCount = recentDonations.length;
  const quantities = recentDonations.map((d) => d.quantity || 0).filter((q) => q > 0);
  const avgQuantity = quantities.length > 0 ? quantities.reduce((a, b) => a + b, 0) / quantities.length : (donation ? donation.quantity : 1);

  // Rapid submissions in the past 15 minutes
  const rapidCount = recentDonations.filter((d) => new Date(d.createdAt) >= fifteenMinsAgo).length;

  const currentQuantity = donation ? donation.quantity : avgQuantity;
  const quantityDeviation = Math.abs(currentQuantity - avgQuantity);

  // 2. Cancellation and delivery stats for user (claims/deliveries)
  const claims = await Claim.find({ ngoId: userId }).lean();
  const cancellations = claims.filter((c) => c.status === 'CANCELLED').length;
  const cancellationRate = claims.length > 0 ? cancellations / claims.length : 0.0;

  const deliveries = await Delivery.find({ volunteerId: userId }).lean();
  const completedDeliveries = deliveries.filter((d) => d.status === 'COMPLETED').length;
  const completionRate = deliveries.length > 0 ? completedDeliveries / deliveries.length : 1.0;

  const duplicateFlag = donation ? Boolean(donation.duplicateFlag) : false;

  return {
    donationFrequency: totalDonationsCount,
    averageQuantity: Math.round(avgQuantity * 10) / 10,
    quantityDeviation: Math.round(quantityDeviation * 10) / 10,
    claimFrequency: claims.length,
    cancellationRate: Math.round(cancellationRate * 100) / 100,
    completionRate: Math.round(completionRate * 100) / 100,
    rapidSubmissions: rapidCount,
    duplicateFlag,
    activityVelocity: Math.round((totalDonationsCount + claims.length) * 10) / 10,
  };
};

/**
 * Deterministic baseline rule evaluator used when ML service is offline or weights not loaded.
 */
const evaluateBaselineRules = (features) => {
  const reasons = [];
  let isAnomaly = false;
  let riskLevel = 'LOW';
  let score = 0.05;

  if (features.rapidSubmissions >= 3) {
    isAnomaly = true;
    score = 0.78;
    riskLevel = 'HIGH';
    reasons.push(`Rapid submission anomaly: ${features.rapidSubmissions} listings created within 15 minutes`);
  }

  if (features.duplicateFlag) {
    isAnomaly = true;
    score = Math.max(score, 0.72);
    if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    reasons.push('High-similarity duplicate donation flagged by duplicate detection engine');
  }

  if (features.averageQuantity > 0 && features.quantityDeviation > features.averageQuantity * 4) {
    isAnomaly = true;
    score = Math.max(score, 0.65);
    if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    reasons.push(`Unusual quantity magnitude: Listing quantity is ${features.quantityDeviation.toFixed(1)} above account baseline`);
  }

  if (features.cancellationRate > 0.5) {
    isAnomaly = true;
    score = Math.max(score, 0.70);
    if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    reasons.push(`Elevated cancellation frequency (${Math.round(features.cancellationRate * 100)}%)`);
  }

  return {
    status: 'BASELINE_EVALUATION',
    isAnomaly,
    anomalyScore: score,
    riskLevel,
    reasons,
    modelVersion: 'baseline_rules_v1',
  };
};

/**
 * Evaluates risk for an entity (donation, user, etc.) and persists a RiskAssessment record.
 */
const analyzeRisk = async ({ entityType = 'DONATION', entityId, userId, donation = null }) => {
  // 1. Extract standard operational features
  const features = await extractRiskFeatures({ userId, donation });

  let result;
  try {
    const mlResponse = await callMlService('/api/ml/fraud/analyze', {
      entityType,
      entityId,
      features,
    });

    if (mlResponse.status === 'MODEL_NOT_LOADED') {
      // Honest reporting: ML weights not loaded, fall back to deterministic baseline rules
      result = evaluateBaselineRules(features);
      result.message = 'IsolationForest weights not loaded; baseline operational rules applied.';
    } else {
      result = mlResponse;
    }
  } catch (err) {
    // Graceful fallback if ML microservice is unreachable or times out
    result = evaluateBaselineRules(features);
    result.message = `ML microservice offline or unreachable (${err.message}); evaluated via deterministic baseline rules.`;
  }

  // 2. Persist or update RiskAssessment record in MongoDB
  const assessment = await RiskAssessment.findOneAndUpdate(
    { entityType, entityId },
    {
      entityType,
      entityId,
      userId,
      isAnomaly: Boolean(result.isAnomaly),
      anomalyScore: result.anomalyScore || 0.0,
      riskLevel: result.riskLevel || 'LOW',
      reasons: result.reasons || [],
      features,
      modelVersion: result.modelVersion || 'isolation_forest_v1',
      status: result.isAnomaly ? 'PENDING' : 'REVIEWED',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return assessment;
};

module.exports = {
  callMlService,
  extractRiskFeatures,
  evaluateBaselineRules,
  analyzeRisk,
};
