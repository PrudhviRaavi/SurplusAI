/**
 * Unified Search Service for FoodShareAI
 * Searches across available food donations, NGOs, and food categories.
 */

const mockSearchDatabase = {
  donations: [
    { id: 'DON-8842', title: 'Vegetable Biryani & Curry', category: 'Cooked meals', quantity: '25 meals', donor: 'Green Leaf Restaurant', distance: '2.4 km' },
    { id: 'DON-8845', title: 'Paneer Butter Masala', category: 'Cooked meals', quantity: '40 meals', donor: 'Spice Route Hotel', distance: '3.1 km' },
    { id: 'DON-8846', title: 'Fresh Artisanal Bread', category: 'Bakery items', quantity: '30 loaves', donor: 'Bakers Delight', distance: '1.8 km' },
  ],
  organizations: [
    { id: 'org-1', name: 'Hope Community Kitchen', type: 'NGO', verified: true, distance: '2.4 km', mealsServed: '1,240' },
    { id: 'org-2', name: 'Green Leaf Restaurant', type: 'Donor', verified: true, distance: '1.8 km', mealsRescued: '312' },
    { id: 'org-3', name: 'Koti Community Care', type: 'NGO', verified: true, distance: '4.2 km', mealsServed: '860' },
  ],
  categories: [
    { name: 'Cooked meals', count: 12 },
    { name: 'Bakery items', count: 8 },
    { name: 'Fruits & Vegetables', count: 6 },
    { name: 'Packaged Food', count: 4 },
  ],
};

export const searchService = {
  search: async (query) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!query || query.trim() === '') {
      return {
        recentSearches: ['Cooked meals', 'Hope Community Kitchen', 'Bakery items'],
        donations: [],
        organizations: [],
        categories: mockSearchDatabase.categories,
      };
    }

    const q = query.toLowerCase();

    const matchedDonations = mockSearchDatabase.donations.filter(
      (d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );

    const matchedOrgs = mockSearchDatabase.organizations.filter(
      (o) => o.name.toLowerCase().includes(q) || o.type.toLowerCase().includes(q)
    );

    const matchedCats = mockSearchDatabase.categories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );

    return {
      recentSearches: ['Cooked meals', 'Hope Community Kitchen', 'Bakery items'],
      donations: matchedDonations,
      organizations: matchedOrgs,
      categories: matchedCats,
    };
  },
};
