/**
 * Mock Impact Service for FoodShareAI
 * Telemetry data layer for Levels, Badges, Streaks, Milestones, and Leaderboards.
 */

const mockLevels = [
  { level: 1, name: 'First Step', minPoints: 0 },
  { level: 2, name: 'Food Friend', minPoints: 200 },
  { level: 3, name: 'Community Builder', minPoints: 500 },
  { level: 4, name: 'Impact Maker', minPoints: 1000 },
  { level: 5, name: 'Food Rescue Champion', minPoints: 2500 },
];

const mockDonorBadges = [
  { id: 'b1', title: 'First Donation', description: 'Rescued your first surplus meal listing', icon: '🌱', isUnlocked: true, unlockedAt: '2 weeks ago' },
  { id: 'b2', title: '10 Donations', description: 'Completed 10 surplus food contributions', icon: '📦', isUnlocked: true, unlockedAt: '5 days ago' },
  { id: 'b3', title: '100 Meals Rescued', description: 'Shared 100+ meals with local receivers', icon: '🍱', isUnlocked: true, unlockedAt: 'Yesterday' },
  { id: 'b4', title: 'Community Supporter', description: 'Supported 5+ verified local organizations', icon: '🤝', isUnlocked: false, unlockRequirement: 'Support 5 organizations' },
  { id: 'b5', title: 'Consistent Donor', description: 'Maintained a 4-week active donation streak', icon: '🔥', isUnlocked: false, unlockRequirement: '4-week active streak' },
];

const mockNgoBadges = [
  { id: 'b6', title: 'First Redistribution', description: 'Received and distributed first surplus claim', icon: '🍲', isUnlocked: true, unlockedAt: '3 weeks ago' },
  { id: 'b7', title: '100 Meals Served', description: 'Redistributed 100+ meals to community members', icon: '❤️', isUnlocked: true, unlockedAt: '1 week ago' },
  { id: 'b8', title: '500 Meals Served', description: 'Redistributed 500+ meals to local families', icon: '🌟', isUnlocked: true, unlockedAt: '2 days ago' },
  { id: 'b9', title: 'Community Partner', description: 'Connected with 10+ verified donor partners', icon: '🏛️', isUnlocked: false, unlockRequirement: 'Connect with 10 donors' },
  { id: 'b10', title: 'High Impact Org', description: 'Diverted 500+ kg food waste from landfill', icon: '♻️', isUnlocked: false, unlockRequirement: 'Rescue 500 kg food' },
];

const mockVolunteerBadges = [
  { id: 'b11', title: 'First Delivery', description: 'Completed your first food rescue dispatch', icon: '🚲', isUnlocked: true, unlockedAt: '1 month ago' },
  { id: 'b12', title: '10 Deliveries', description: 'Safely delivered 10 food rescue shipments', icon: '🛵', isUnlocked: true, unlockedAt: '1 week ago' },
  { id: 'b13', title: '50 Deliveries', description: 'Completed 50 community rescue dispatches', icon: '⚡', isUnlocked: false, unlockRequirement: 'Complete 50 deliveries' },
  { id: 'b14', title: '100 Meals Delivered', description: 'Transported 100+ meals from donor to NGO', icon: '🏆', isUnlocked: true, unlockedAt: 'Yesterday' },
  { id: 'b15', title: 'Reliable Volunteer', description: 'Maintained 95%+ historical completion rate', icon: '⭐', isUnlocked: true, unlockedAt: '3 days ago' },
];

const mockLeaderboards = {
  Overall: [
    { rank: 1, name: 'Royal Spice Palace', role: 'Donor', points: 2840, primaryMetric: '1,120 meals shared', isCurrentUser: false },
    { rank: 2, name: 'Hope Community Kitchen', role: 'NGO', points: 2450, primaryMetric: '980 meals served', isCurrentUser: false },
    { rank: 3, name: 'Green Leaf Restaurant', role: 'Donor', points: 2180, primaryMetric: '860 meals shared', isCurrentUser: false },
    { rank: 4, name: 'Arjun Kumar', role: 'Volunteer', points: 1940, primaryMetric: '42 deliveries', isCurrentUser: false },
    { rank: 5, name: 'Prudhvi Raavi', role: 'Donor', points: 1280, primaryMetric: '312 meals shared', isCurrentUser: true },
  ],
  Donors: [
    { rank: 1, name: 'Royal Spice Palace', role: 'Donor', points: 2840, primaryMetric: '1,120 meals shared', isCurrentUser: false },
    { rank: 2, name: 'Green Leaf Restaurant', role: 'Donor', points: 2180, primaryMetric: '860 meals shared', isCurrentUser: false },
    { rank: 3, name: 'Prudhvi Raavi', role: 'Donor', points: 1280, primaryMetric: '312 meals shared', isCurrentUser: true },
    { rank: 4, name: 'Metro Bistro Cafe', role: 'Donor', points: 940, primaryMetric: '210 meals shared', isCurrentUser: false },
  ],
  NGOs: [
    { rank: 1, name: 'Hope Community Kitchen', role: 'NGO', points: 2450, primaryMetric: '980 meals served', isCurrentUser: false },
    { rank: 2, name: 'Green Hope Foundation', role: 'NGO', points: 1820, primaryMetric: '720 meals served', isCurrentUser: false },
    { rank: 3, name: 'Community Care Trust', role: 'NGO', points: 1410, primaryMetric: '510 meals served', isCurrentUser: false },
  ],
  Volunteers: [
    { rank: 1, name: 'Arjun Kumar', role: 'Volunteer', points: 1940, primaryMetric: '42 deliveries', isCurrentUser: false },
    { rank: 2, name: 'Priya Sharma', role: 'Volunteer', points: 1620, primaryMetric: '35 deliveries', isCurrentUser: false },
    { rank: 3, name: 'Rahul Kumar', role: 'Volunteer', points: 1210, primaryMetric: '26 deliveries', isCurrentUser: false },
  ],
};

export const mockImpactService = {
  getLevels: () => mockLevels,
  getBadgesByRole: (role) => {
    if (role === 'NGO') return mockNgoBadges;
    if (role === 'Volunteer') return mockVolunteerBadges;
    return mockDonorBadges;
  },
  getLeaderboard: (category = 'Overall', timeframe = 'Monthly') => {
    return mockLeaderboards[category] || mockLeaderboards.Overall;
  },
};
