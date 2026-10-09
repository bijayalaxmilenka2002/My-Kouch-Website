import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Helper to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim() + '-' + Date.now().toString().slice(-4);
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      isNewArrival,
      isTopSelling,
      isActive,
      minPrice,
      maxPrice,
      seatingCapacity,
      search,
      sort,
      limit,
    } = req.query;

    const query = {};

    // By default, public only sees active products, unless owner queries specifically
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      const slugMap = {
        'mattress-beddings': 'Mattress & Beddings',
        'mattress & beddings': 'Mattress & Beddings',
        'mattresses': 'Mattress & Beddings',
        'pillow-cushion': 'Pillow & Cushion',
        'pillows-cushions': 'Pillow & Cushion',
        'pillows & cushions': 'Pillow & Cushion',
        'cushions': 'Pillow & Cushion',
        'pillows': 'Pillow & Cushion',
        'l-shaped-sofas': 'L-Shaped Sofas',
        '3-seater-sofas': '3 Seater Sofas',
        'sofa-combos': 'Sofa Combos',
        'recliner-sofas': 'Recliner Sofas',
        '2-seater-sofas': '2 Seater Sofas',
      };
      const normalizedCategory = slugMap[category.toLowerCase()] || category;
      query.category = normalizedCategory;
    }

    if (isNewArrival !== undefined) {
      query.isNewArrival = isNewArrival === 'true';
    }

    if (isTopSelling !== undefined) {
      query.isTopSelling = isTopSelling === 'true';
    }

    if (seatingCapacity) {
      query.seatingCapacity = seatingCapacity;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    let mongoQuery = Product.find(query).sort(sortOption);

    if (limit) {
      mongoQuery = mongoQuery.limit(Number(limit));
    }

    const products = await mongoQuery;
    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      products,
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products: ' + error.message,
    });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sofa product not found',
      });
    }

    // Get 4 related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    return res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product: ' + error.message,
    });
  }
};

// @desc    Create new sofa product (Owner only)
// @route   POST /api/products
// @access  Private (Owner)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subType,
      images,
      price,
      originalPrice,
      specifications,
      dimensions,
      colors,
      materials,
      seatingCapacity,
      badge,
      isNewArrival,
      isTopSelling,
      isActive,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least product name and price',
      });
    }

    const safeDescription = description || `${name} - Handcrafted luxury custom furniture by myKouch Bhubaneswar.`;
    const safeCategory = category || 'L-Shaped Sofas';
    const slug = createSlug(name);

    // Parse image array if passed as string
    let parsedImages = images;
    if (typeof images === 'string') {
      try {
        parsedImages = JSON.parse(images);
      } catch (e) {
        parsedImages = [images];
      }
    }

    if (!parsedImages || parsedImages.length === 0) {
      parsedImages = ['/assets/sofas/drawing_room_1_2.jpg'];
    }

    const slugCategoryMap = {
      'mattress-beddings': 'Mattress & Beddings',
      'mattresses & beddings': 'Mattress & Beddings',
      'mattress & beddings': 'Mattress & Beddings',
      'mattresses': 'Mattress & Beddings',
      'pillow-cushion': 'Pillow & Cushion',
      'pillows-cushions': 'Pillow & Cushion',
      'pillows & cushions': 'Pillow & Cushion',
      'pillow & cushion': 'Pillow & Cushion',
      'pillows': 'Pillow & Cushion',
      'cushions': 'Pillow & Cushion',
      'l-shaped-sofas': 'L-Shaped Sofas',
      '3-seater-sofas': '3 Seater Sofas',
      'sofa-combos': 'Sofa Combos',
      'recliner-sofas': 'Recliner Sofas',
      '2-seater-sofas': '2 Seater Sofas',
    };
    const finalCategory = slugCategoryMap[safeCategory.toLowerCase()] || safeCategory;

    const numPrice = Number(price);
    const numOrig = originalPrice ? Number(originalPrice) : undefined;
    let computedDiscount = 0;
    if (numOrig && numOrig > numPrice) {
      computedDiscount = Math.round(((numOrig - numPrice) / numOrig) * 100);
    }

    const product = new Product({
      name,
      slug,
      description: safeDescription,
      category: finalCategory,
      subType: subType || '',
      images: parsedImages,
      price: numPrice,
      originalPrice: numOrig,
      discount: computedDiscount,
      specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
      dimensions: dimensions || 'Standard Luxury Fit',
      colors: Array.isArray(colors) ? colors : typeof colors === 'string' ? colors.split(',').map(s => s.trim()) : undefined,
      materials: Array.isArray(materials) ? materials : typeof materials === 'string' ? materials.split(',').map(s => s.trim()) : undefined,
      seatingCapacity: seatingCapacity || (finalCategory.includes('Sofa') ? '3 Seater' : ''),
      badge: badge || (isNewArrival ? 'New Arrival' : ''),
      isNewArrival: isNewArrival === true || isNewArrival === 'true',
      isTopSelling: isTopSelling === true || isTopSelling === 'true',
      isActive: isActive === undefined ? true : (isActive === true || isActive === 'true'),
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product: ' + error.message,
    });
  }
};

// @desc    Update product (Owner only)
// @route   PUT /api/products/:id
// @access  Private (Owner)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product && req.body.name) {
      product = await Product.findOne({ name: req.body.name });
    }

    const updateData = { ...req.body };

    // If images passed as JSON string
    if (typeof updateData.images === 'string') {
      try {
        updateData.images = JSON.parse(updateData.images);
      } catch (e) {
        updateData.images = [updateData.images];
      }
    }

    if (updateData.colors && typeof updateData.colors === 'string') {
      updateData.colors = updateData.colors.split(',').map(s => s.trim());
    }

    if (updateData.materials && typeof updateData.materials === 'string') {
      updateData.materials = updateData.materials.split(',').map(s => s.trim());
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);

    if (updateData.originalPrice && updateData.originalPrice > (updateData.price || (product ? product.price : 0))) {
      updateData.discount = Math.round(((updateData.originalPrice - (updateData.price || (product ? product.price : 0))) / updateData.originalPrice) * 100);
    }

    // Dynamic upsert: If product does not yet exist in MongoDB (e.g. originated from local draft), create it
    if (!product) {
      const newSlug = createSlug(updateData.name || 'product');
      product = new Product({
        ...updateData,
        name: updateData.name || 'Custom Product',
        slug: updateData.slug || newSlug,
        category: updateData.category || 'L-Shaped Sofas',
        description: updateData.description || `${updateData.name || 'Custom Product'} handcrafted by myKouch.`,
        price: Number(updateData.price || 0),
        images: (updateData.images && updateData.images.length > 0) ? updateData.images : ['/assets/sofas/drawing_room_1_2.jpg'],
        isActive: updateData.isActive !== false,
      });
      await product.save();

      return res.status(200).json({
        success: true,
        message: 'Product synced and stored in database',
        product,
      });
    }

    product = await Product.findByIdAndUpdate(product._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product: ' + error.message,
    });
  }
};

// @desc    Delete product (Owner only)
// @route   DELETE /api/products/:id
// @access  Private (Owner)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ slug: id });
    }

    if (!product) {
      product = await Product.findOneAndDelete({
        $or: [
          { name: id },
          { name: req.body?.name || '' },
          { slug: req.body?.slug || '' },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product: ' + error.message,
    });
  }
};
