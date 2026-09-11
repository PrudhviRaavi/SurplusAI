/**
 * Mock AI Service for FoodShareAI
 * Simulates modular backend custom ML models:
 * 1. Food Detection Model
 * 2. Food Classification Model
 * 3. Freshness Prediction Model
 * 4. Quantity Estimation Model
 * 5. Safe Consumption / Expiry Prediction Model
 */

export const mockAIService = {
  analyzeFoodImage: async (imageUri) => {
    // Simulate network & ML inference delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    if (!imageUri) {
      throw new Error('No image provided. Please upload a clear photo of the surplus food.');
    }

    return {
      success: true,
      detectedFood: 'Vegetable Biryani',
      detectedItems: ['Vegetable Biryani', 'Basmati Rice', 'Mixed Vegetables'],
      confidence: '94%',
      confidenceScore: 94,
      category: 'Cooked meals',
      freshnessLabel: 'Good',
      freshnessScore: 86,
      estimatedQuantity: '20–25',
      estimatedQuantityNum: 25,
      quantityUnit: 'servings',
      quantityConfidence: '82%',
      estimatedConsumptionWindow: '4–6 hours',
      prepTimeEstimate: 'Today, 1:00 PM',
      bestBeforeEstimate: 'Today, 6:00 PM',
      storageRecommendation: 'Refrigerated',
      disclaimer: 'AI-generated estimate. Always verify food safety before donation.',
    };
  },
};
