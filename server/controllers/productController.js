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

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, category and price',
      });
    }

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
      return res.status(400).json({
        success: false,
        message: 'At least one sofa image is required',
      });
    }

    const product = new Product({
      name,
      slug,
      description,
      category,
      subType: subType || '',
      images: parsedImages,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
      dimensions: dimensions || 'Standard Luxury Fit',
      colors: Array.isArray(colors) ? colors : typeof colors === 'string' ? colors.split(',').map(s => s.trim()) : undefined,
      materials: Array.isArray(materials) ? materials : typeof materials === 'string' ? materials.split(',').map(s => s.trim()) : undefined,
      seatingCapacity: seatingCapacity || (category.includes('Sofa') ? '3 Seater' : ''),
      badge: badge || (isNewArrival ? 'New Arrival' : ''),
      isNewArrival: isNewArrival === true || isNewArrival === 'true',
      isTopSelling: isTopSelling === true || isTopSelling === 'true',
      isActive: isActive === undefined ? true : (isActive === true || isActive === 'true'),
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Sofa product created successfully',
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

// @desc    Update sofa product (Owner only)
// @route   PUT /api/products/:id
// @access  Private (Owner)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
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

    if (updateData.originalPrice && updateData.originalPrice > (updateData.price || product.price)) {
      updateData.discount = Math.round(((updateData.originalPrice - (updateData.price || product.price)) / updateData.originalPrice) * 100);
    }

    product = await Product.findByIdAndUpdate(id, updateData, {
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

// @desc    Delete sofa product (Owner only)
// @route   DELETE /api/products/:id
// @access  Private (Owner)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product: ' + error.message,
    });
  }
};
