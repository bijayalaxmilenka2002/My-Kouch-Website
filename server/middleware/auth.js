import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectOwner = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access owner portal. Please log in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mykouch_super_secret_jwt_key_2026_luxury_sofas');
    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Owner account not found or token invalid.',
      });
    }

    req.owner = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed: ' + error.message,
    });
  }
};
