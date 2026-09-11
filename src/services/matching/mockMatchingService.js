/**
 * Mock Matching Service for FoodShareAI
 * Implements weighted 8-factor scoring model:
 * 1. Food Compatibility (30%)
 * 2. Distance (20%)
 * 3. Capacity Match (15%)
 * 4. Urgency & Safe Window (15%)
 * 5. Organization Requirements (10%)
 * 6. Pickup Radius (5%)
 * 7. Availability (2.5%)
 * 8. Verification Status (2.5%)
 */

const mockNgos = [
  {
    organizationId: 'NGO-001',
    name: 'Hope Community Kitchen',
    category: 'Shelter & Kitchen',
    isVerified: true,
    latitude: 17.44,
    longitude: 78.41,
    distanceKm: 2.4,
    acceptedCategories: ['Cooked meals', 'Bakery items', 'Packaged food'],
    availableCapacity: 72,
    pickupRadiusKm: 15,
    requirementLevel: 'High',
    requiredCategory: 'Cooked meals',
  },
  {
    organizationId: 'NGO-002',
    name: 'Green Hope Foundation',
    category: 'Community Shelter',
    isVerified: true,
    latitude: 17.45,
    longitude: 78.42,
    distanceKm: 3.8,
    acceptedCategories: ['Cooked meals', 'Fruits & vegetables', 'Dairy'],
    availableCapacity: 120,
    pickupRadiusKm: 12,
    requirementLevel: 'Medium',
    requiredCategory: 'Cooked meals',
  },
  {
    organizationId: 'NGO-003',
    name: 'Community Care Trust',
    category: 'Child Welfare',
    isVerified: true,
    latitude: 17.42,
    longitude: 78.44,
    distanceKm: 5.2,
    acceptedCategories: ['Cooked meals', 'Packaged food'],
    availableCapacity: 40,
    pickupRadiusKm: 10,
    requirementLevel: 'Medium',
    requiredCategory: 'Packaged food',
  },
];

export const mockMatchingService = {
  findMatches: async (donation) => {
    // Simulate ML recommendation calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const itemCategory = donation?.category || 'Cooked meals';
    const quantityNeeded = 25; // default numeric quantity

    const scoredMatches = mockNgos
      .map((ngo) => {
        // 1. Food Compatibility (30%)
        const acceptsCategory = ngo.acceptedCategories.includes(itemCategory);
        const foodCompScore = acceptsCategory ? 30 : 0;

        if (!acceptsCategory) return null; // Filter out incompatible food types

        // 2. Distance Score (20%)
        let distanceScore = 20;
        if (ngo.distanceKm > 10) distanceScore = 8;
        else if (ngo.distanceKm > 5) distanceScore = 14;

        // 3. Capacity Score (15%)
        let capacityScore = 15;
        if (ngo.availableCapacity < quantityNeeded) {
          capacityScore = 5; // Limited capacity
        }
        if (ngo.availableCapacity === 0) return null; // Filter out zero capacity

        // 4. Urgency Score (15%)
        const urgencyScore = 14;

        // 5. Requirement Score (10%)
        const reqScore = ngo.requiredCategory === itemCategory ? 10 : 6;

        // 6. Pickup Radius (5%)
        const radiusScore = ngo.distanceKm <= ngo.pickupRadiusKm ? 5 : 2;

        // 7. Availability & Verification (5%)
        const trustScore = ngo.isVerified ? 5 : 2;

        const totalScore = Math.min(
          98,
          foodCompScore +
            distanceScore +
            capacityScore +
            urgencyScore +
            reqScore +
            radiusScore +
            trustScore
        );

        let matchLabel = 'Possible match';
        if (totalScore >= 90) matchLabel = 'Excellent match';
        else if (totalScore >= 75) matchLabel = 'Strong match';

        // Transparent recommendation reasons
        const reasons = [];
        if (acceptsCategory) reasons.push(`Accepts ${itemCategory.toLowerCase()}`);
        reasons.push(`${ngo.distanceKm} km away (within ${ngo.pickupRadiusKm} km radius)`);
        reasons.push(`Has enough capacity (${ngo.availableCapacity} meals space)`);
        if (ngo.requiredCategory === itemCategory) {
          reasons.push(`High demand for ${itemCategory.toLowerCase()} today`);
        }
        reasons.push('Can receive within your pickup window');

        return {
          organizationId: ngo.organizationId,
          name: ngo.name,
          category: ngo.category,
          matchScore: Math.round(totalScore),
          matchLabel,
          isVerified: ngo.isVerified,
          distanceKm: ngo.distanceKm,
          acceptedCategories: ngo.acceptedCategories,
          availableCapacity: ngo.availableCapacity,
          donationQuantity: `${quantityNeeded} meals`,
          demandLevel: ngo.requirementLevel,
          reasons,
          factors: {
            foodCompatibility: foodCompScore,
            distanceScore,
            capacityScore,
            urgencyScore,
            requirementScore: reqScore,
            pickupCompatibility: radiusScore,
            trustScore,
          },
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      donationId: donation?.id || 'DON-8842',
      foodName: donation?.foodName || 'Vegetable Biryani',
      quantity: donation?.quantity || '25 meals',
      matches: scoredMatches,
    };
  },
};
