import { create } from 'zustand';
import { impactService } from '../services/impact/impactService';

const initialFormData = {
  // Basic Account Details
  fullName: 'Prudhvi Raavi',
  email: 'prudhvi@foodshareai.org',
  phone: '+91 98765 43210',
  password: '',
  confirmPassword: '',
  otpCode: '',

  // Donor Onboarding
  donorType: 'restaurant',
  donorOrgName: 'Royal Spice Palace',
  donorContactName: 'Prudhvi Raavi',
  donorPhone: '+91 98765 43210',
  donorEmail: 'prudhvi@foodshareai.org',
  donorAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
  donorCategories: ['Cooked meals', 'Bakery items', 'Packaged food'],
  donorQuantity: '50-100 meals',
  donorFrequency: 'Daily',
  donorLocationConfirmed: true,

  // NGO Onboarding
  ngoName: 'Hope Community Foundation',
  ngoType: 'ngo',
  ngoRegNumber: 'NGO-8842-HYD',
  ngoWebsite: 'https://hopefoundation.org',
  ngoContactName: 'Ananya Sharma',
  ngoDesignation: 'Program Director',
  ngoPhone: '+91 98765 00112',
  ngoEmail: 'contact@hopefoundation.org',
  ngoCategories: ['Cooked meals', 'Fruits & vegetables', 'Dairy'],
  ngoMealsRequired: 250,
  ngoDailyCapacity: 500,
  ngoOperatingHours: '08:00 AM - 09:00 PM',
  ngoPickupRadius: '15 km',
  ngoLocationConfirmed: true,

  // Volunteer Onboarding
  volFullName: 'Prudhvi Raavi',
  volPhone: '+91 98765 43210',
  volEmail: 'prudhvi@foodshareai.org',
  volPreferences: ['Food pickup', 'Food delivery', 'Distribution'],
  volAvailability: ['Morning', 'Evening', 'Weekends'],
  volTravelRadius: '15 km',
  volTransport: 'Two-wheeler',

  // Forgot Password Flow
  resetEmailOrPhone: '',
  resetOtpCode: '',
  newPassword: '',
  confirmNewPassword: '',
};

const initialDonations = [
  {
    id: 'DON-8842',
    donorId: 'DNR-001',
    donorName: 'Green Leaf Restaurant',
    donorType: 'Restaurant',
    donorVerified: true,
    donorAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    ngoName: 'Hope Community Kitchen',
    ngoAddress: 'Hope Foundation, Koti, Hyderabad',
    foodName: 'Vegetable Biryani & Curry',
    category: 'Cooked meals',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    quantity: '25 meals',
    quantityNum: 25,
    quantityUnit: 'meals',
    preparationTime: 'Today, 3:30 PM',
    bestBefore: 'Today, 8:00 PM',
    storageCondition: 'Refrigerated',
    freshnessScore: 94,
    freshnessLabel: 'Good',
    aiConfidence: '94%',
    pickupLocation: { latitude: 17.43, longitude: 78.40 },
    pickupAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    pickupStartTime: '6:00 PM',
    pickupEndTime: '8:00 PM',
    pickupWindow: '6:00 PM – 8:00 PM',
    notes: 'Packaged in individual hygienic foil boxes.',
    isFoodSafe: true,
    status: 'VOLUNTEER_ACCEPTED', // 'PUBLISHED' | 'CLAIMED' | 'VOLUNTEER_ASSIGNED' | 'VOLUNTEER_ACCEPTED' | 'FOOD_COLLECTED' | 'DELIVERED' | 'COMPLETED'
    claimedBy: 'Hope Community Kitchen',
    claimedAt: new Date().toISOString(),
    volunteerId: 'VOL-001',
    volunteerName: 'Arjun Kumar',
    volunteerPhone: '+91 98765 11223',
    volunteerTransport: 'Two-wheeler',
    matchScore: 94,
    reasons: [
      'Matches your food requirements',
      '2.4 km away',
      'Within your capacity (72 meals space)',
      'Available during operating hours',
    ],
  },
];

const initialNotifications = [
  {
    id: 'notif-1',
    roleTarget: 'Donor',
    title: 'Surplus Listing Active',
    message: 'Your donation #DON-8842 is now live on the FoodShareAI rescue network.',
    timestamp: '10 min ago',
    unread: true,
  },
];

export const useAppStore = create((set) => ({
  activeRole: 'Donor', // 'Donor' | 'NGO' | 'Volunteer'
  setActiveRole: (role) => set({ activeRole: role }),

  formData: initialFormData,
  updateFormData: (fields) =>
    set((state) => ({
      formData: { ...state.formData, ...fields },
    })),

  resetFormData: () => set({ formData: initialFormData }),

  // Centralized Impact Telemetry
  donorMealsShared: 312,
  donorFoodRescuedKg: 128,
  ngoMealsReceived: 380,
  ngoPeopleServed: 520,
  volunteerDeliveries: 14,
  volunteerMealsDelivered: 184,

  // NGO Capacity State
  ngoCapacityUsed: 53,
  ngoTotalCapacity: 100,

  donationsList: initialDonations,

  addDonation: (donationData) =>
    set((state) => ({
      donationsList: [donationData, ...state.donationsList],
    })),

  claimDonation: (donationId, ngoDetails) =>
    set((state) => {
      const ngoName = ngoDetails?.name || 'Hope Community Kitchen';
      const quantityClaimed = 25;

      const updatedList = state.donationsList.map((item) => {
        if (item.id === donationId) {
          return {
            ...item,
            status: 'CLAIMED',
            claimedBy: ngoName,
            claimedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      const newDonorNotif = {
        id: `notif-${Date.now()}`,
        roleTarget: 'Donor',
        title: 'Donation Claimed! 🎉',
        message: `Your donation #${donationId} was claimed by ${ngoName}. Pickup reserved for 6:00 PM – 8:00 PM.`,
        timestamp: 'Just now',
        unread: true,
      };

      return {
        donationsList: updatedList,
        ngoCapacityUsed: Math.min(100, state.ngoCapacityUsed + quantityClaimed),
        notificationsList: [newDonorNotif, ...state.notificationsList],
      };
    }),

  assignVolunteer: (donationId, volunteerDetails) =>
    set((state) => {
      const volName = volunteerDetails?.name || 'Arjun Kumar';

      const updatedList = state.donationsList.map((item) => {
        if (item.id === donationId || !donationId) {
          return {
            ...item,
            status: 'VOLUNTEER_ASSIGNED',
            volunteerId: volunteerDetails?.volunteerId || 'VOL-001',
            volunteerName: volName,
            volunteerPhone: volunteerDetails?.phone || '+91 98765 11223',
            volunteerTransport: volunteerDetails?.transportation || 'Two-wheeler',
          };
        }
        return item;
      });

      return { donationsList: updatedList };
    }),

  acceptVolunteerTask: (donationId) =>
    set((state) => {
      const updatedList = state.donationsList.map((item) => {
        if (item.id === donationId || !donationId) {
          return { ...item, status: 'VOLUNTEER_ACCEPTED' };
        }
        return item;
      });
      return { donationsList: updatedList };
    }),

  updateDeliveryStage: (donationId, stage) =>
    set((state) => {
      const updatedList = state.donationsList.map((item) => {
        if (item.id === donationId || !donationId) {
          return { ...item, status: stage };
        }
        return item;
      });

      let notifTitle = 'Delivery Status Update';
      let notifMsg = `Donation delivery status updated to ${stage}`;

      if (stage === 'FOOD_COLLECTED') {
        notifTitle = 'Food Collected! 🍱';
        notifMsg = 'The volunteer has collected your surplus meals and is en route to the NGO.';
      } else if (stage === 'DELIVERED') {
        notifTitle = 'Food Arrived at Destination ✓';
        notifMsg = '25 meals have safely reached Hope Community Kitchen.';
      }

      const notif = {
        id: `notif-stage-${Date.now()}`,
        roleTarget: 'Donor',
        title: notifTitle,
        message: notifMsg,
        timestamp: 'Just now',
        unread: true,
      };

      return {
        donationsList: updatedList,
        notificationsList: [notif, ...state.notificationsList],
      };
    }),

  confirmNgoReceipt: (donationId) =>
    set((state) => {
      const targetItem = state.donationsList.find((i) => i.id === donationId) || state.donationsList[0];
      impactService.recordCompletedDonation(targetItem);

      const updatedList = state.donationsList.map((item) => {
        if (item.id === donationId || !donationId) {
          return { ...item, status: 'COMPLETED' };
        }
        return item;
      });

      const completionNotif = {
        id: `notif-complete-${Date.now()}`,
        roleTarget: 'Donor',
        title: 'Donation Completed! 🎉',
        message: 'Your 25 meals of Vegetable Biryani were successfully redistributed. Thank you for making an impact!',
        timestamp: 'Just now',
        unread: true,
      };

      return {
        donationsList: updatedList,
        donorMealsShared: state.donorMealsShared + 25,
        donorFoodRescuedKg: state.donorFoodRescuedKg + 10,
        ngoMealsReceived: state.ngoMealsReceived + 25,
        ngoPeopleServed: state.ngoPeopleServed + 25,
        volunteerDeliveries: state.volunteerDeliveries + 1,
        volunteerMealsDelivered: state.volunteerMealsDelivered + 25,
        notificationsList: [completionNotif, ...state.notificationsList],
      };
    }),

  notificationsList: initialNotifications,
  addNotification: (notif) =>
    set((state) => ({
      notificationsList: [notif, ...state.notificationsList],
    })),

  toastMessage: null,
  showToast: (message) => set({ toastMessage: message }),
  clearToast: () => set({ toastMessage: null }),
}));
