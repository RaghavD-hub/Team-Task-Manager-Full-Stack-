import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token format' });
    }

    const tokenValue = authHeader.replace('Bearer ', '');
    const decodedPayload = jwt.verify(tokenValue, process.env.JWT_SECRET || 'fallback_secret_for_dev');

    const matchedUser = await User.findById(decodedPayload.userId).select('-secretHash');
    if (!matchedUser) {
      return res.status(401).json({ error: 'Token valid but user no longer exists' });
    }

    // Attach to request object for downstream use
    req.currentUser = matchedUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed', details: err.message });
  }
};

export const restrictToRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ error: 'Context missing. Did you forget requireAuthentication?' });
    }

    if (!allowedRoles.includes(req.currentUser.accessLevel)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    
    next();
  };
};
