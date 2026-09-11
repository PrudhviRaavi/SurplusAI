/**
 * Elevation shadow styles for FoodShareAI Design System
 * Soft, elegant shadows for floating buttons, cards, and bottom sheets
 */

import { colors } from './colors';

export const shadows = {
  soft: {
    shadowColor: colors.shadowColor || '#231F20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: colors.shadowColor || '#231F20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  floatingNav: {
    shadowColor: colors.shadowColor || '#231F20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};
