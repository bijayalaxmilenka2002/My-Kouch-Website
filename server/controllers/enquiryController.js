import Enquiry from '../models/Enquiry.js';

// @desc    Submit a new customer enquiry or customization request
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      product,
      productId,
      enquiryType,
      customizationDetails,
      message,
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required to submit an enquiry',
      });
    }

    const enquiry = new Enquiry({
      customerName,
      phone,
      email: email || '',
      product: product || 'Custom Sofa Requirement',
      productId: productId || null,
      enquiryType: enquiryType || 'Customization',
      customizationDetails: customizationDetails || {},
      message: message || '',
      status: 'New',
    });

    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your sofa enquiry has been received. Our craftsman/shopkeeper will contact you shortly.',
      enquiryId: enquiry._id,
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry: ' + error.message,
    });
  }
};

// @desc    Get all enquiries with filters (Owner only)
// @route   GET /api/enquiries
// @access  Private (Owner)
export const getAllEnquiries = async (req, res) => {
  try {
    const { status, enquiryType, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (enquiryType && enquiryType !== 'All') {
      query.enquiryType = enquiryType;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    const counts = {
      total: await Enquiry.countDocuments(),
      new: await Enquiry.countDocuments({ status: 'New' }),
      contacted: await Enquiry.countDocuments({ status: 'Contacted' }),
      inProgress: await Enquiry.countDocuments({ status: 'In Progress' }),
      completed: await Enquiry.countDocuments({ status: 'Completed' }),
    };

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      counts,
      enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries: ' + error.message,
    });
  }
};

// @desc    Update enquiry status and notes (Owner only)
// @route   PUT /api/enquiries/:id
// @access  Private (Owner)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ownerNotes } = req.body;

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    if (status) enquiry.status = status;
    if (ownerNotes !== undefined) enquiry.ownerNotes = ownerNotes;

    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry: ' + error.message,
    });
  }
};

// @desc    Delete enquiry (Owner only)
// @route   DELETE /api/enquiries/:id
// @access  Private (Owner)
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry: ' + error.message,
    });
  }
};
