/**
 * FoodShareAI - Authentication Middleware
 * Validates incoming Bearer JWT tokens and attaches authenticated user context.
 */
const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Verify user exists and remains active in DB
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      profileCompleted: user.profileCompleted,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
};

module.exports = {
  authenticate,
};
