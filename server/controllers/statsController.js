import Product from '../models/Product.js';
import Offer from '../models/Offer.js';
import Enquiry from '../models/Enquiry.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const newArrivals = await Product.countDocuments({ isNewArrival: true, isActive: true });
    const topSelling = await Product.countDocuments({ isTopSelling: true, isActive: true });
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ isActive: true });
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });

    // Category segregation stats
    const sofasCount = await Product.countDocuments({ category: { $nin: ['Mattress & Beddings', 'Pillow & Cushion'] } });
    const mattressesCount = await Product.countDocuments({ category: 'Mattress & Beddings' });
    const pillowsCount = await Product.countDocuments({ category: 'Pillow & Cushion' });

    // Recent enquiries
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        newArrivals,
        topSelling,
        totalOffers,
        activeOffers,
        totalEnquiries,
        newEnquiries,
        sofasCount,
        mattressesCount,
        pillowsCount,
      },
      recentEnquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats: ' + error.message,
    });
  }
};
