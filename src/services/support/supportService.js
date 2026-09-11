/**
 * Support & FAQ Service for FoodShareAI
 */

const mockFaqs = [
  {
    id: 'faq-1',
    question: 'How does FoodShareAI match donations?',
    answer: 'FoodShareAI uses a weighted 8-factor matching algorithm considering proximity, NGO food requirement categories, capacity, urgency, and operating hours.',
  },
  {
    id: 'faq-2',
    question: 'What does the AI food analysis mean?',
    answer: 'Our computer vision engine detects food items, estimates meal quantity, and calculates a freshness score (0-100) with a safe consumption window estimate.',
  },
  {
    id: 'faq-3',
    question: 'Who is responsible for food safety?',
    answer: 'Donors must ensure food is prepared under hygienic conditions. Volunteers verify container packaging during pickup, and NGOs inspect condition upon arrival.',
  },
  {
    id: 'faq-4',
    question: 'How do NGOs claim a donation?',
    answer: 'NGOs review matched donations on their dashboard and tap "Claim This Donation". Once claimed, a volunteer is dispatched for pickup.',
  },
  {
    id: 'faq-5',
    question: 'How does volunteer assignment work?',
    answer: 'When an NGO claims a donation, nearby available volunteers are evaluated based on distance, transportation type, and schedule window.',
  },
  {
    id: 'faq-6',
    question: 'How is environmental impact calculated?',
    answer: 'Calculations convert meal quantities into estimated weight (~0.4 kg/meal) and CO2 emissions prevented (~2.5 kg CO2 per kg food diverted from landfill).',
  },
];

export const supportService = {
  getFaqs: () => mockFaqs,

  submitSupportRequest: async (ticket) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      ticketId: `TCK-${Date.now()}`,
      message: 'Support request submitted. Our team will review within 24 hours.',
    };
  },
};
