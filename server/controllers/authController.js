import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mykouch_super_secret_jwt_key_2026_luxury_sofas', {
    expiresIn: '7d',
  });
};

// @desc    Auth owner & get token
// @route   POST /api/auth/login
// @access  Public
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Owner account not recognized.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password is incorrect.',
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Owner login successful',
      token,
      owner: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message,
    });
  }
};

// @desc    Get current owner details
// @route   GET /api/auth/me
// @access  Private (Owner)
export const getOwnerProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      owner: req.owner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// @desc    Update owner profile / credentials
// @route   PUT /api/auth/profile
// @access  Private (Owner)
export const updateOwnerCredentials = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.owner.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Owner account not found',
      });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current password to update your password',
        });
      }
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
      admin.passwordHash = await Admin.hashPassword(newPassword);
    }

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase().trim();

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Owner credentials updated successfully',
      owner: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating owner credentials: ' + error.message,
    });
  }
};

