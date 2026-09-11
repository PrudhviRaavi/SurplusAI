/**
 * FoodShareAI - Role-Based Access Control (RBAC) Middleware
 * Enforces route authorization based on authenticated user role.
 */

/**
 * Authorize specified roles to access a route
 * @param  {...string} roles Allowed roles (e.g. 'DONOR', 'NGO', 'VOLUNTEER', 'ADMIN')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};
