/**
 * Navigation Guards for FoodShareAI
 * Enforces role isolation and prevents unauthorized route access.
 */

export const navigationGuards = {
  isRoleAllowed: (currentRole, targetRole) => {
    if (!currentRole) return false;
    if (targetRole === 'Public') return true;
    if (currentRole === 'Admin') return true; // Admin has operational intelligence access
    return currentRole === targetRole;
  },

  canAccessAdmin: (role) => {
    return role === 'Admin';
  },

  canAccessDonor: (role) => {
    return role === 'Donor' || role === 'Admin';
  },

  canAccessNgo: (role) => {
    return role === 'NGO' || role === 'Admin';
  },

  canAccessVolunteer: (role) => {
    return role === 'Volunteer' || role === 'Admin';
  },
};
