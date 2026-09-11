/**
 * Notification Service for FoodShareAI Global Notification Center
 * Connects frontend notification center to real backend APIs with graceful offline fallback.
 * Maps backend notifications to category tabs (All, Donations, Deliveries, Impact, System).
 */
import { apiClient } from '../api/apiClient';

let cachedNotifications = [
  {
    id: 'n-1',
    category: 'Donations',
    title: 'Donation Claimed! 🎉',
    description: 'Hope Community Kitchen claimed your 25 meals of Vegetable Biryani.',
    timestamp: '10 min ago',
    read: false,
    targetScreen: 'DonationDetails',
  },
  {
    id: 'n-2',
    category: 'Deliveries',
    title: 'Volunteer Accepted Delivery 🛵',
    description: 'Arjun Kumar accepted the delivery task from Green Leaf Restaurant.',
    timestamp: '25 min ago',
    read: false,
    targetScreen: 'DeliveryDetails',
  },
  {
    id: 'n-3',
    category: 'Impact',
    title: 'New Achievement Unlocked! 🏆',
    description: 'You unlocked "100 Meals Rescued" badge. Great job!',
    timestamp: '2 hours ago',
    read: true,
    targetScreen: 'Impact',
  },
  {
    id: 'n-4',
    category: 'System',
    title: 'NGO Verification Complete ✓',
    description: 'Your organization profile for Hope Community Foundation is verified.',
    timestamp: '1 day ago',
    read: true,
    targetScreen: 'Profile',
  },
];

/**
 * Maps backend Notification.type to frontend category tab.
 */
const mapCategory = (type) => {
  if (!type) return 'System';
  if (type.startsWith('DONATION') || type.startsWith('AI_ANALYSIS')) return 'Donations';
  if (type.startsWith('DELIVERY') || type.startsWith('PICKUP') || type === 'FOOD_PICKED_UP') return 'Deliveries';
  if (type.includes('IMPACT')) return 'Impact';
  return 'System';
};

/**
 * Formats a Date to a human-friendly relative time string.
 */
const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Recently';
  const diffMs = Date.now() - new Date(dateInput).getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const notificationService = {
  getNotifications: (filterCategory = 'All') => {
    if (filterCategory === 'All') return cachedNotifications;
    return cachedNotifications.filter((n) => n.category === filterCategory);
  },

  /**
   * Fetches live notifications from the backend.
   */
  fetchNotifications: async (filterCategory = 'All') => {
    try {
      const res = await apiClient.get('/notifications');
      if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        cachedNotifications = res.data.data.map((item) => ({
          id: item._id,
          category: mapCategory(item.type),
          title: item.title,
          description: item.message,
          timestamp: formatRelativeTime(item.createdAt),
          read: item.isRead,
          targetScreen: item.relatedEntityType === 'DONATION' ? 'DonationDetails' : item.relatedEntityType === 'DELIVERY' ? 'DeliveryDetails' : 'Profile',
        }));
      }
      return notificationService.getNotifications(filterCategory);
    } catch (err) {
      return notificationService.getNotifications(filterCategory);
    }
  },

  /**
   * Fetches unread count from backend.
   */
  getUnreadCount: async () => {
    try {
      const res = await apiClient.get('/notifications/unread-count');
      return res.data?.count ?? cachedNotifications.filter((n) => !n.read).length;
    } catch (err) {
      return cachedNotifications.filter((n) => !n.read).length;
    }
  },

  markAllAsRead: async () => {
    cachedNotifications = cachedNotifications.map((n) => ({ ...n, read: true }));
    try {
      await apiClient.put('/notifications/read-all');
    } catch (err) {
      // offline fallback
    }
    return cachedNotifications;
  },

  markAsRead: async (id) => {
    cachedNotifications = cachedNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch (err) {
      // offline fallback
    }
    return cachedNotifications;
  },

  /**
   * Registers Expo device push token with the backend.
   */
  registerDeviceToken: async (pushToken) => {
    try {
      const res = await apiClient.post('/notifications/device-token', { pushToken });
      return res.data;
    } catch (err) {
      return null;
    }
  },

  /**
   * Removes Expo device push token upon logout.
   */
  removeDeviceToken: async (pushToken) => {
    try {
      const res = await apiClient.delete('/notifications/device-token', { data: { pushToken } });
      return res.data;
    } catch (err) {
      return null;
    }
  },
};
