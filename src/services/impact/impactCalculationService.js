/**
 * Isolated Impact Calculation Service for FoodShareAI
 * Environmental formulas and metric conversions:
 * - 1 meal = approx 0.4 kg food rescued
 * - 1 kg food rescued = approx 2.5 kg CO2 avoided
 * - 1 delivery = approx 1.2 volunteer hours
 */

export const impactCalculationService = {
  calculateMeals: (quantityNum) => {
    return quantityNum || 25;
  },

  calculateFoodSavedKg: (meals) => {
    return Math.round((meals || 25) * 0.4);
  },

  calculateEstimatedCO2: (foodSavedKg) => {
    return Math.round((foodSavedKg || 10) * 2.5 * 10) / 10;
  },

  calculateVolunteerHours: (deliveriesCount) => {
    return Math.round((deliveriesCount || 1) * 1.2 * 10) / 10;
  },
};
