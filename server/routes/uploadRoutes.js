import express from 'express';
import { upload } from '../middleware/upload.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/single', protectOwner, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Upload failed: ' + error.message,
    });
  }
});

// Upload multiple images
router.post('/multiple', protectOwner, upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const urls = req.files.map(f => `/uploads/${f.filename}`);
    return res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Upload failed: ' + error.message,
    });
  }
});

export default router;
