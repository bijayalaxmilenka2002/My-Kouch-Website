import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Sparkles,
  Tag,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload,
  Search,
  Sliders,
  Phone,
  Mail,
  X,
  Save,
  KeyRound,
  ShieldCheck,
  Bed,
  Layers,
  Filter,
  RotateCcw,
  User,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getDashboardStats,
  uploadImage,
  getImageUrl,
} from '../services/api';
import { CATEGORY_NAMES } from '../constants/categories';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

const ALL_CATEGORIES = [
  // Sofas
  'L-Shaped Sofas',
  '3 Seater Sofas',
  'Sofa Combos',
  'Recliner Sofas',
  '2 Seater Sofas',
  // Expanded Pillars
  'Mattress & Beddings',
  'Pillow & Cushion',
];

const MATTRESS_SUBTYPES = [
  { key: 'orthopedic', label: 'Orthopedic Dual-Comfort' },
  { key: 'pocket-spring', label: 'Pocket Spring Hybrid' },
  { key: 'memory-foam', label: 'Cool-Gel Memory Foam' },
  { key: 'beddings', label: 'Platform Beds & Bedding' },
];

const PILLOW_SUBTYPES = [
  { key: 'throw-cushions', label: 'Decorative Throw Cushions' },
  { key: 'neck-pillows', label: 'Orthopedic Neck Pillows' },
  { key: 'bed-pillows', label: 'Sleeping & Bed Pillows' },
];

export default function OwnerDashboardPage() {
  const { token, owner, logout, updateCredentials } = useAuth();
  const navigate = useNavigate();

  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'new-arrivals' | 'offers' | 'enquiries' | 'settings'
  const [pillarFilter, setPillarFilter] = useState('all'); // 'all' | 'sofas' | 'mattresses' | 'pillows'
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [enquiryPillarFilter, setEnquiryPillarFilter] = useState('All');

  // Data States
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [offers, setOffers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'L-Shaped Sofas',
    subType: '',
    description: '',
    price: '',
    originalPrice: '',
    dimensions: '108" L x 72" W x 34" H',
    seatingCapacity: '6 Seater',
    badge: 'New Arrival',
    images: ['/assets/sofas/drawing_room_1_2.jpg'],
    colors: 'Emerald Teal, Royal Navy, Warm Terracotta, Ivory Beige',
    materials: 'Royal Velvet, Performance Leatherette',
    isNewArrival: true,
    isTopSelling: false,
    isActive: true,
    specifications: {
      frameMaterial: 'Termite-Proof Treated Sal & Marandi Hardwood Frame',
      foamDensity: '40 Density High Resilience (HR) Supersoft Foam',
      suspension: 'Heavy-Gauge Carbon Zig-Zag Springs & Reinforced Poly-Webbing',
      warranty: '10 Years Frame & Structural Warranty',
      legs: 'Solid Metal Legs with Champagne Gold Finish',
      customizable: true,
    },
  });

  // Promotional Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount: 'UP TO 35% OFF',
    couponCode: 'COMFORT35',
    image: '/assets/sofas/drawing_room_1_2.jpg',
    ctaText: 'Explore Living & Sleep Offers',
    ctaLink: '/collections',
    isActive: true,
  });

  // Owner Account / Credentials Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: owner?.name || 'myKouch Owner',
    email: owner?.email || 'admin@mykouch.in',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Sync owner info to settings form
  useEffect(() => {
    if (owner) {
      setSettingsForm((prev) => ({
        ...prev,
        name: owner.name || 'myKouch Owner',
        email: owner.email || 'admin@mykouch.in',
      }));
    }
  }, [owner]);

  // Initial Load
  useEffect(() => {
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // 1. Fetch remote data in parallel
      const [statsRes, prodRes, offerRes, enqRes] = await Promise.all([
        getDashboardStats(token).catch(() => ({ stats: null })),
        getProducts({ isActive: undefined }).catch(() => ({ products: [] })),
        getAllOffers(token).catch(() => ({ offers: [] })),
        getAllEnquiries(token).catch(() => ({ enquiries: [], counts: {} })),
      ]);

      // 2. Resolve Products with robust local storage persistence
      let resolvedProducts = FALLBACK_PRODUCTS;
      if (prodRes?.products && prodRes.products.length > 0) {
        resolvedProducts = prodRes.products;
      }

      // Check locally cached / user-added products in localStorage
      try {
        const localCustomRaw = localStorage.getItem('mykouch_custom_products');
        if (localCustomRaw) {
          const localCustom = JSON.parse(localCustomRaw);
          if (Array.isArray(localCustom) && localCustom.length > 0) {
            // Merge custom products
            resolvedProducts = localCustom;
          }
        }
      } catch (e) {
        // ignore
      }
      setProducts(resolvedProducts);

      // 3. Resolve Offers
      let resolvedOffers = offerRes?.offers || [];
      try {
        const localOffersRaw = localStorage.getItem('mykouch_custom_offers');
        if (localOffersRaw) {
          const localOffers = JSON.parse(localOffersRaw);
          if (Array.isArray(localOffers) && localOffers.length > 0) {
            resolvedOffers = localOffers;
          }
        }
      } catch (e) {
        // ignore
      }
      if (resolvedOffers.length === 0) {
        resolvedOffers = [
          {
            _id: 'off_01',
            title: 'Festive Home Comfort Fest',
            subtitle: 'Factory-Direct Sofas & Orthopedic Mattresses',
            description: 'Save up to 35% on handcrafted sofas, luxury beddings, and memory contour pillows made in Bhubaneswar.',
            discount: 'UP TO 35% OFF',
            couponCode: 'COMFORT35',
            image: '/assets/sofas/drawing_room_1_2.jpg',
            ctaText: 'Explore Collections',
            ctaLink: '/collections',
            isActive: true,
          },
        ];
      }
      setOffers(resolvedOffers);

      // 4. Resolve Enquiries
      let resolvedEnquiries = enqRes?.enquiries || [];
      try {
        const localEnqRaw = localStorage.getItem('mykouch_local_enquiries');
        if (localEnqRaw) {
          const localEnqs = JSON.parse(localEnqRaw);
          if (Array.isArray(localEnqs) && localEnqs.length > 0) {
            resolvedEnquiries = [...localEnqs, ...resolvedEnquiries];
          }
        }
      } catch (e) {
        // ignore
      }
      if (resolvedEnquiries.length === 0) {
        resolvedEnquiries = [
          {
            _id: 'enq_sample_1',
            customerName: 'Ashok Mohapatra',
            phone: '+91 98610 23456',
            email: 'ashok.mohapatra@gmail.com',
            product: 'myKouch Royal Emerald Velvet L-Shape Sectional',
            category: 'L-Shaped Sofas',
            createdAt: new Date().toISOString(),
            status: 'New',
            customizationDetails: {
              sofaType: 'L-Shaped Sectional',
              seatingPreference: '6 Seater',
              fabricPreference: 'Royal Emerald Velvet',
              preferredColor: 'Emerald Teal',
              roomDimensions: '14ft x 18ft Living Room',
            },
            message: 'Looking for left-side chaise orientation and gold legs for Patia apartment.',
          },
          {
            _id: 'enq_sample_2',
            customerName: 'Priyanka Das',
            phone: '+91 94370 78910',
            email: 'priyanka.das@yahoo.com',
            product: 'myKouch Orthopedic Dual-Comfort Memory Foam & HR Mattress',
            category: 'Mattress & Beddings',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            status: 'Contacted',
            customizationDetails: {
              sofaType: 'Orthopedic Mattress',
              seatingPreference: 'King Size (78" x 72")',
              fabricPreference: '10 Inch Thick Cool-Gel Memory Core',
              preferredColor: 'Snow White Quilted',
              roomDimensions: 'Standard King Cot',
            },
            message: 'Need urgent delivery to Khandagiri. Does it include 10-year sag warranty card?',
          },
          {
            _id: 'enq_sample_3',
            customerName: 'Rajesh Swain',
            phone: '+91 99371 44556',
            email: 'rajesh.swain@rediffmail.com',
            product: 'Luxury Bouclé & Velvet Living Room Throw Cushions (Set of 5)',
            category: 'Pillow & Cushion',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            status: 'Completed',
            customizationDetails: {
              sofaType: 'Decorative Cushions',
              seatingPreference: 'Set of 5 (16" x 16")',
              fabricPreference: 'Textured Bouclé & Forest Velvet',
              preferredColor: 'Ivory & Olive',
            },
            message: 'Order dispatched and delivered.',
          },
        ];
      }
      setEnquiries(resolvedEnquiries);

      // Counts
      const counts = {
        total: resolvedEnquiries.length,
        new: resolvedEnquiries.filter((e) => e.status === 'New').length,
        contacted: resolvedEnquiries.filter((e) => e.status === 'Contacted').length,
        inprogress: resolvedEnquiries.filter((e) => e.status === 'In Progress').length,
        completed: resolvedEnquiries.filter((e) => e.status === 'Completed').length,
      };
      setEnquiryCounts(counts);

      // Stats
      if (statsRes?.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4500);
  };

  // Helper to persist custom products locally
  const persistProducts = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem('mykouch_custom_products', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache products to localStorage:', e);
    }
  };

  // ================= CATEGORY CHANGE & PRESETS =================
  const handleCategoryChange = (newCat) => {
    let defaultDims = '108" L x 72" W x 34" H';
    let defaultCap = '6 Seater';
    let defaultSubType = '';
    let defaultSpecs = { ...productForm.specifications };

    if (newCat === 'Mattress & Beddings') {
      defaultDims = '78" L x 72" W x 10" Thick (King Size)';
      defaultCap = 'King Size (78" x 72")';
      defaultSubType = 'orthopedic';
      defaultSpecs = {
        frameMaterial: 'Dual-Zone Spine Support with Zero-Motion Pocket Spring Architecture',
        foamDensity: '50D Visco-Elastic Cool Gel Memory Foam + 40D HR Support Core',
        warranty: '10 Years Direct Manufacturer Warranty with Zero-Sag Guarantee',
        legs: 'Hand-Tufted Anti-Microbial Bamboo Jacquard Cover',
        customizable: true,
      };
    } else if (newCat === 'Pillow & Cushion') {
      defaultDims = '27" L x 18" W (Standard Bed Pillow)';
      defaultCap = 'Set of 2 Pillows';
      defaultSubType = 'throw-cushions';
      defaultSpecs = {
        frameMaterial: 'Ergonomic Cervical Contour Memory Foam Core',
        foamDensity: 'Breathable Knitted Bamboo Shell + Cotton Inner Casing',
        warranty: '1 Year Material & Stitching Guarantee',
        legs: 'Heavy-Duty Concealed Zippers, Machine-Washable Cover',
        customizable: true,
      };
    } else {
      defaultDims = '108" L x 72" W x 34" H';
      defaultCap = newCat.includes('2') ? '2 Seater' : newCat.includes('3') ? '3 Seater' : '6 Seater';
      defaultSubType = '';
      defaultSpecs = {
        frameMaterial: 'Termite-Proof Treated Sal & Marandi Hardwood Frame',
        foamDensity: '40 Density High Resilience (HR) Supersoft Foam',
        suspension: 'Heavy-Gauge Carbon Zig-Zag Springs & Reinforced Poly-Webbing',
        warranty: '10 Years Frame & Structural Warranty',
        legs: 'Solid Metal Legs with Champagne Gold Finish',
        customizable: true,
      };
    }

    setProductForm((prev) => ({
      ...prev,
      category: newCat,
      subType: defaultSubType,
      dimensions: defaultDims,
      seatingCapacity: defaultCap,
      specifications: defaultSpecs,
    }));
  };

  // Smart preset loader for fast entry
  const applyPreset = (presetType) => {
    if (presetType === 'pocket-spring') {
      setProductForm((prev) => ({
        ...prev,
        category: 'Mattress & Beddings',
        subType: 'pocket-spring',
        name: 'myKouch Royal Hybrid Pocket Spring Mattress',
        price: '34999',
        originalPrice: '49999',
        dimensions: '78" L x 72" W x 10" Thick',
        seatingCapacity: 'King Size (78" x 72")',
        badge: 'Zero-Motion',
        materials: 'Individually Encased Coils, High Resilience Foam, Organic Bamboo',
        colors: 'Pearl White Quilted, Navy Border Accent',
        specifications: {
          frameMaterial: 'Individually Encased Carbon Pocket Springs (Zero Motion Transfer)',
          foamDensity: '40D High Resilience Foam + Orthopedic Transition Layer',
          warranty: '10 Years Direct Manufacturer Warranty with Zero-Sag Guarantee',
          legs: 'Breathable Jacquard Knitted Ticking with Reinforced Edge Support',
          customizable: true,
        },
      }));
    } else if (presetType === 'orthopedic-mattress') {
      setProductForm((prev) => ({
        ...prev,
        category: 'Mattress & Beddings',
        subType: 'orthopedic',
        name: 'myKouch Orthopedic Dual-Comfort Memory Foam Mattress',
        price: '24999',
        originalPrice: '34999',
        dimensions: '78" L x 72" W x 8" Thick',
        seatingCapacity: 'King Size (78" x 72")',
        badge: 'Orthopedic Core',
        materials: 'Cool-Gel Visco Memory Foam, High Resilience Support Foam',
        colors: 'Snow White, Charcoal Grey Border',
        specifications: {
          frameMaterial: 'High Resilience Anti-Sag Orthopedic Support Core',
          foamDensity: '50D Cool-Gel Memory Foam + 40D HR Orthopedic Core',
          warranty: '10 Years Direct Manufacturer Warranty',
          legs: 'Hypoallergenic Bamboo Fabric Cover with Zipper',
          customizable: true,
        },
      }));
    } else if (presetType === 'throw-cushions') {
      setProductForm((prev) => ({
        ...prev,
        category: 'Pillow & Cushion',
        subType: 'throw-cushions',
        name: 'myKouch Designer Accent Throw Cushions (Set of 5)',
        price: '2199',
        originalPrice: '3299',
        dimensions: '16" x 16" / 18" x 18" Set',
        seatingCapacity: 'Set of 5 Cushions',
        badge: 'Plush Living',
        materials: 'Royal Velvet, Tactile Bouclé, Siliconized Microfiber',
        colors: 'Terracotta, Emerald, Ivory, Ochre, Navy',
        specifications: {
          frameMaterial: 'Siliconized Virgin Conjugate Microfiber Fillers',
          foamDensity: 'Double-Stitched Seams with Hidden YKK Zippers',
          warranty: '1 Year Fabric & Stitching Guarantee',
          legs: 'Dry-Clean or Gentle Hand Wash Friendly',
          customizable: true,
        },
      }));
    } else if (presetType === 'neck-pillow') {
      setProductForm((prev) => ({
        ...prev,
        category: 'Pillow & Cushion',
        subType: 'neck-pillows',
        name: 'myKouch Orthopedic Cervical Contour Memory Pillow',
        price: '1699',
        originalPrice: '2499',
        dimensions: '24" L x 14" W x 4.5" H',
        seatingCapacity: '1 Ergonomic Pillow',
        badge: 'Cervical Care',
        materials: 'Slow-Rebound Visco-Elastic Memory Foam',
        colors: 'Crisp White with Grey Mesh Accent',
        specifications: {
          frameMaterial: '100% High-Density Slow-Rebound Temperature-Neutral Memory Foam',
          foamDensity: 'Dual Contour Height Curve for Back & Side Sleepers',
          warranty: '2 Years Shape Retention Guarantee',
          legs: 'Removable Breathable Bamboo Fabric Shell',
          customizable: true,
        },
      }));
    } else if (presetType === 'luxury-sofa') {
      setProductForm((prev) => ({
        ...prev,
        category: 'L-Shaped Sofas',
        subType: '',
        name: 'myKouch Bespoke Velvet Sectional Sofa',
        price: '58999',
        originalPrice: '79999',
        dimensions: '108" L x 72" W x 34" H',
        seatingCapacity: '6 - 7 Seater',
        badge: 'Bestseller',
        materials: 'Royal Velvet, Treated Sal Hardwood, 40D HR Foam',
        colors: 'Emerald Green, Royal Navy, Terracotta, Ivory Beige',
        specifications: {
          frameMaterial: 'Termite-Proof Seasoned Sal & Marandi Hardwood Frame',
          foamDensity: '40 Density High Resilience (HR) Supersoft Foam',
          suspension: 'Heavy-Gauge Carbon Zig-Zag Springs & Reinforced Poly-Webbing',
          warranty: '10 Years Frame & Structural Warranty',
          legs: 'Solid Metal Legs with Champagne Gold Finish',
          customizable: true,
        },
      }));
    }
  };

  // ================= PRODUCT ACTIONS =================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'L-Shaped Sofas',
      subType: '',
      description: '',
      price: '',
      originalPrice: '',
      dimensions: '108" L x 72" W x 34" H',
      seatingCapacity: '6 Seater',
      badge: 'New Arrival',
      images: ['/assets/sofas/drawing_room_1_12.jpg'],
      colors: 'Emerald Teal, Royal Navy, Warm Terracotta, Ivory Beige',
      materials: 'Royal Velvet, Performance Leatherette',
      isNewArrival: true,
      isTopSelling: false,
      isActive: true,
      specifications: {
        frameMaterial: 'Termite-Proof Treated Sal & Marandi Hardwood Frame',
        foamDensity: '40 Density High Resilience (HR) Supersoft Foam',
        suspension: 'Heavy-Gauge Carbon Zig-Zag Springs & Reinforced Poly-Webbing',
        warranty: '10 Years Frame & Structural Warranty',
        legs: 'Solid Metal Legs with Champagne Gold Finish',
        customizable: true,
      },
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || 'L-Shaped Sofas',
      subType: prod.subType || '',
      description: prod.description || '',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      dimensions: prod.dimensions || '',
      seatingCapacity: prod.seatingCapacity || '',
      badge: prod.badge || '',
      images: prod.images && prod.images.length > 0 ? prod.images : ['/assets/sofas/drawing_room_1_2.jpg'],
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : prod.colors || '',
      materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : prod.materials || '',
      isNewArrival: prod.isNewArrival || false,
      isTopSelling: prod.isTopSelling || false,
      isActive: prod.isActive !== false,
      specifications: prod.specifications || {},
    });
    setIsProductModalOpen(true);
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadImage(file, token);
      if (res.success && res.url) {
        setProductForm((prev) => ({
          ...prev,
          images: [res.url, ...prev.images],
        }));
        showNotification('Product photo uploaded successfully!');
      }
    } catch (err) {
      // Local preview fallback if upload endpoint is offline
      const localUrl = URL.createObjectURL(file);
      setProductForm((prev) => ({
        ...prev,
        images: [localUrl, ...prev.images],
      }));
      showNotification('Photo added to product preview!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please fill product name and price');
      return;
    }

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        colors: productForm.colors ? productForm.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
        materials: productForm.materials ? productForm.materials.split(',').map((m) => m.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        // Try remote API update
        try {
          await updateProduct(editingProduct._id, payload, token);
        } catch (apiErr) {
          console.warn('API updateProduct bypassed for local persistence:', apiErr.message);
        }

        const updatedList = products.map((p) =>
          p._id === editingProduct._id ? { ...p, ...payload } : p
        );
        persistProducts(updatedList);
        showNotification(`Product "${productForm.name}" updated successfully!`);
      } else {
        const newId = 'prod_' + Date.now();
        let newProductItem = {
          ...payload,
          _id: newId,
          slug: payload.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4),
          createdAt: new Date().toISOString(),
          rating: 5.0,
          reviewsCount: 1,
        };

        try {
          const apiRes = await createProduct(payload, token);
          if (apiRes?.product) {
            newProductItem = apiRes.product;
          }
        } catch (apiErr) {
          console.warn('API createProduct bypassed for local persistence:', apiErr.message);
        }

        persistProducts([newProductItem, ...products]);
        showNotification(`New product "${productForm.name}" published to catalog!`);
      }

      setIsProductModalOpen(false);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        try {
          await deleteProduct(id, token);
        } catch (apiErr) {
          console.warn('API deleteProduct bypassed for local persistence:', apiErr.message);
        }
        const updated = products.filter((p) => p._id !== id);
        persistProducts(updated);
        showNotification(`Product "${name}" deleted.`);
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const handleToggleProductState = async (id, field, currentValue) => {
    try {
      const updatedValue = !currentValue;
      try {
        await updateProduct(id, { [field]: updatedValue }, token);
      } catch (apiErr) {
        console.warn('API toggle bypassed for local persistence:', apiErr.message);
      }
      const updated = products.map((p) =>
        p._id === id ? { ...p, [field]: updatedValue } : p
      );
      persistProducts(updated);
      showNotification(`Updated ${field}.`);
    } catch (err) {
      alert('Failed to update toggle: ' + err.message);
    }
  };

  // ================= OFFER ACTIONS =================
  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setOfferForm({
      title: '',
      subtitle: 'Exclusive Factory-Direct Pricing & Free Design Consultation',
      description: '',
      discount: 'UP TO 35% OFF',
      couponCode: 'COMFORT35',
      image: '/assets/sofas/drawing_room_1_2.jpg',
      ctaText: 'Explore Offers',
      ctaLink: '/collections',
      isActive: true,
    });
    setIsOfferModalOpen(true);
  };

  const handleOpenEditOffer = (off) => {
    setEditingOffer(off);
    setOfferForm({
      title: off.title,
      subtitle: off.subtitle || '',
      description: off.description || '',
      discount: off.discount || '',
      couponCode: off.couponCode || '',
      image: off.image || '',
      ctaText: off.ctaText || 'Explore Offers',
      ctaLink: off.ctaLink || '/collections',
      isActive: off.isActive !== false,
    });
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!offerForm.title || !offerForm.description) {
      alert('Please fill offer title and description');
      return;
    }

    try {
      if (editingOffer) {
        try {
          await updateOffer(editingOffer._id, offerForm, token);
        } catch (e) {}
        const updated = offers.map((o) =>
          o._id === editingOffer._id ? { ...o, ...offerForm } : o
        );
        setOffers(updated);
        localStorage.setItem('mykouch_custom_offers', JSON.stringify(updated));
        showNotification('Offer banner updated successfully!');
      } else {
        let newOffer = { ...offerForm, _id: 'off_' + Date.now() };
        try {
          const apiRes = await createOffer(offerForm, token);
          if (apiRes?.offer) {
            newOffer = apiRes.offer;
          }
        } catch (e) {}
        const updated = [newOffer, ...offers];
        setOffers(updated);
        localStorage.setItem('mykouch_custom_offers', JSON.stringify(updated));
        showNotification('New promotional offer published to Homepage!');
      }
      setIsOfferModalOpen(false);
    } catch (err) {
      alert('Failed to save offer: ' + err.message);
    }
  };

  const handleDeleteOffer = async (id, title) => {
    if (window.confirm(`Delete promotional offer "${title}"?`)) {
      try {
        try {
          await deleteOffer(id, token);
        } catch (e) {}
        const updated = offers.filter((o) => o._id !== id);
        setOffers(updated);
        localStorage.setItem('mykouch_custom_offers', JSON.stringify(updated));
        showNotification('Offer deleted.');
      } catch (err) {
        alert('Failed to delete offer: ' + err.message);
      }
    }
  };

  // ================= ENQUIRY ACTIONS =================
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    try {
      try {
        await updateEnquiryStatus(id, { status: newStatus }, token);
      } catch (e) {}
      const updated = enquiries.map((enq) =>
        enq._id === id ? { ...enq, status: newStatus } : enq
      );
      setEnquiries(updated);
      localStorage.setItem('mykouch_local_enquiries', JSON.stringify(updated));
      showNotification(`Enquiry marked as "${newStatus}"`);
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDeleteEnquiry = async (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      try {
        try {
          await deleteEnquiry(id, token);
        } catch (e) {}
        const updated = enquiries.filter((e) => e._id !== id);
        setEnquiries(updated);
        localStorage.setItem('mykouch_local_enquiries', JSON.stringify(updated));
        showNotification(`Enquiry from "${name}" deleted.`);
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  // ================= OWNER CREDENTIALS & SECURITY =================
  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (settingsForm.newPassword) {
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        setSettingsError('New password and confirmation do not match.');
        return;
      }
      if (settingsForm.newPassword.length < 6) {
        setSettingsError('New password must be at least 6 characters long.');
        return;
      }
    }

    try {
      setUpdatingSettings(true);
      await updateCredentials({
        name: settingsForm.name,
        email: settingsForm.email,
        currentPassword: settingsForm.currentPassword,
        newPassword: settingsForm.newPassword,
      });

      setSettingsSuccess('Owner credentials updated successfully!');
      showNotification('Owner credentials & password updated successfully!');
      setSettingsForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => {
        setIsSettingsModalOpen(false);
        setSettingsSuccess('');
      }, 1500);
    } catch (err) {
      setSettingsError(err.message || 'Failed to update owner credentials');
    } finally {
      setUpdatingSettings(false);
    }
  };

  // ================= COMPUTED FILTERED LISTS =================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Pillar filter
      if (pillarFilter === 'sofas') {
        if (p.category === 'Mattress & Beddings' || p.category === 'Pillow & Cushion') return false;
      } else if (pillarFilter === 'mattresses') {
        if (p.category !== 'Mattress & Beddings') return false;
      } else if (pillarFilter === 'pillows') {
        if (p.category !== 'Pillow & Cushion') return false;
      }

      // 2. New arrivals tab
      if (activeTab === 'new-arrivals') {
        if (!p.isNewArrival) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subType && p.subType.toLowerCase().includes(q)) ||
          (p.dimensions && p.dimensions.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [products, pillarFilter, activeTab, searchQuery]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      // Status filter
      if (enquiryStatusFilter !== 'All' && e.status !== enquiryStatusFilter) {
        return false;
      }

      // Pillar filter
      if (enquiryPillarFilter !== 'All') {
        const cat = (e.category || '').toLowerCase();
        const prod = (e.product || '').toLowerCase();
        if (enquiryPillarFilter === 'sofas') {
          if (cat.includes('mattress') || cat.includes('pillow') || prod.includes('mattress') || prod.includes('pillow')) return false;
        } else if (enquiryPillarFilter === 'mattresses') {
          if (!cat.includes('mattress') && !prod.includes('mattress')) return false;
        } else if (enquiryPillarFilter === 'pillows') {
          if (!cat.includes('pillow') && !cat.includes('cushion') && !prod.includes('pillow') && !prod.includes('cushion')) return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.customerName.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          (e.product && e.product.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [enquiries, enquiryStatusFilter, enquiryPillarFilter, searchQuery]);

  // Inventory counts by pillar
  const countsByPillar = useMemo(() => {
    const sofas = products.filter((p) => p.category !== 'Mattress & Beddings' && p.category !== 'Pillow & Cushion').length;
    const mattresses = products.filter((p) => p.category === 'Mattress & Beddings').length;
    const pillows = products.filter((p) => p.category === 'Pillow & Cushion').length;
    return { sofas, mattresses, pillows, total: products.length };
  }, [products]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="dashboard-page">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 3500,
            background: 'var(--color-espresso-dark)',
            color: '#FFFFFF',
            padding: '0.9rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            border: '1px solid var(--color-primary)',
          }}
        >
          <CheckCircle size={18} color="var(--color-primary)" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div className="dashboard-nav-container">
          <div className="dashboard-brand">
            <Link to="/">
              <img src="/assets/logo/logo.png" alt="myKouch" />
            </Link>
            <span className="dashboard-role-badge">Owner Portal</span>
          </div>

          <div className="dashboard-header-actions">
            <span className="dashboard-user-info">
              Logged in: <strong>{owner?.name || 'myKouch Owner'}</strong> ({owner?.email || 'admin@mykouch.in'})
            </span>

            <div className="dashboard-header-btns">
              {/* Change Password / Settings Button */}
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="btn btn-light btn-sm"
                title="Change Owner Password & Account Credentials"
              >
                <KeyRound size={14} />
                <span>Account &amp; Password</span>
              </button>

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-sm"
                title="Open public website in new tab"
              >
                <span>View Website</span>
                <ExternalLink size={14} />
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/owner/login');
                }}
                className="btn btn-outline btn-sm"
                title="Logout from owner session"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="dashboard-tabs-bar">
        <button
          onClick={() => {
            setActiveTab('products');
            setSearchQuery('');
          }}
          className={`dashboard-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Products Management</span>
          <span className="tab-badge">{products.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('new-arrivals');
            setSearchQuery('');
          }}
          className={`dashboard-tab-btn ${activeTab === 'new-arrivals' ? 'active' : ''}`}
        >
          <Sparkles size={18} />
          <span>New Arrivals</span>
          <span className="tab-badge">{products.filter((p) => p.isNewArrival).length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('offers');
            setSearchQuery('');
          }}
          className={`dashboard-tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
        >
          <Tag size={18} />
          <span>Offers &amp; Promotions</span>
          <span className="tab-badge">{offers.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('enquiries');
            setSearchQuery('');
          }}
          className={`dashboard-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Customer Enquiries</span>
          <span className="tab-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
            {enquiryCounts.new || 0} New
          </span>
        </button>

        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="dashboard-tab-btn"
          style={{ marginLeft: 'auto' }}
        >
          <Lock size={16} />
          <span>Owner Credentials</span>
        </button>
      </div>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Top Stats Cards Grid (Sofas, Mattresses, Pillows, Enquiries) */}
        <div className="stats-grid">
          {/* 1. Total Catalog */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Catalog Items</div>
              <div className="stat-value">{countsByPillar.total}</div>
            </div>
            <div className="stat-icon">
              <Package size={24} />
            </div>
          </div>

          {/* 2. Handcrafted Sofas */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Handcrafted Sofas</div>
              <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                {countsByPillar.sofas}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Layers size={24} />
            </div>
          </div>

          {/* 3. Mattresses & Beddings */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Mattresses &amp; Beddings</div>
              <div className="stat-value" style={{ color: '#0284C7' }}>
                {countsByPillar.mattresses}
              </div>
            </div>
            <div className="stat-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>
              <Bed size={24} />
            </div>
          </div>

          {/* 4. Pillows & Cushions */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Pillows &amp; Cushions</div>
              <div className="stat-value" style={{ color: '#16A34A' }}>
                {countsByPillar.pillows}
              </div>
            </div>
            <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* ================= TAB 1 & 2: PRODUCTS OR NEW ARRIVALS ================= */}
        {(activeTab === 'products' || activeTab === 'new-arrivals') && (
          <div>
            {/* Quick Pillar Filter Pills: All, Sofas, Mattresses, Pillows */}
            <div className="pillar-filter-pills">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', marginRight: '0.25rem' }}>
                Collection Filter:
              </span>
              <button
                onClick={() => setPillarFilter('all')}
                className={`pillar-filter-btn ${pillarFilter === 'all' ? 'active' : ''}`}
              >
                <span>All Collections</span>
                <span className="pillar-count">{countsByPillar.total}</span>
              </button>
              <button
                onClick={() => setPillarFilter('sofas')}
                className={`pillar-filter-btn ${pillarFilter === 'sofas' ? 'active' : ''}`}
              >
                <span>🛋️ Handcrafted Sofas</span>
                <span className="pillar-count">{countsByPillar.sofas}</span>
              </button>
              <button
                onClick={() => setPillarFilter('mattresses')}
                className={`pillar-filter-btn ${pillarFilter === 'mattresses' ? 'active' : ''}`}
              >
                <span>🛏️ Mattress &amp; Beddings</span>
                <span className="pillar-count">{countsByPillar.mattresses}</span>
              </button>
              <button
                onClick={() => setPillarFilter('pillows')}
                className={`pillar-filter-btn ${pillarFilter === 'pillows' ? 'active' : ''}`}
              >
                <span>✨ Pillows &amp; Cushions</span>
                <span className="pillar-count">{countsByPillar.pillows}</span>
              </button>
            </div>

            {/* Search & Add Control Bar */}
            <div className="dashboard-control-bar">
              <div className="dashboard-search-box">
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or dimensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleOpenAddProduct} className="btn btn-primary">
                  <Plus size={18} />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="dashboard-table-card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Size / Dimensions</th>
                    <th>New Arrival</th>
                    <th>Top Selling</th>
                    <th>Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No products match the selected filters or search keyword.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isMattress = prod.category === 'Mattress & Beddings';
                      const isPillow = prod.category === 'Pillow & Cushion';

                      return (
                        <tr key={prod._id || prod.slug}>
                          <td>
                            <div className="product-table-cell">
                              <img
                                src={getImageUrl(prod.images?.[0])}
                                alt=""
                                className="product-table-thumb"
                                onError={(e) => {
                                  if (!e.target.dataset.failed) {
                                    e.target.dataset.failed = 'true';
                                    e.target.src = '/assets/sofas/drawing_room_1_2.jpg';
                                  }
                                }}
                              />
                              <div>
                                <strong style={{ color: 'var(--color-espresso)', display: 'block' }}>
                                  {prod.name}
                                </strong>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  {prod.dimensions || prod.seatingCapacity}
                                </span>
                                {prod.subType && (
                                  <div className="sub-type-badge">
                                    {prod.subType.replace('-', ' ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className="table-badge"
                              style={{
                                background: isMattress ? '#E0F2FE' : isPillow ? '#DCFCE7' : 'var(--bg-sand)',
                                color: isMattress ? '#0369A1' : isPillow ? '#15803D' : 'var(--color-espresso)',
                              }}
                            >
                              {prod.category}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-espresso-dark)' }}>
                              {formatPrice(prod.price)}
                            </strong>
                            {prod.originalPrice && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                {formatPrice(prod.originalPrice)}
                              </div>
                            )}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {prod.seatingCapacity || prod.dimensions || '—'}
                          </td>
                          {/* Toggle New Arrival */}
                          <td>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={prod.isNewArrival}
                                onChange={() => handleToggleProductState(prod._id, 'isNewArrival', prod.isNewArrival)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          {/* Toggle Top Selling */}
                          <td>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={prod.isTopSelling}
                                onChange={() => handleToggleProductState(prod._id, 'isTopSelling', prod.isTopSelling)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          {/* Toggle Active */}
                          <td>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={prod.isActive}
                                onChange={() => handleToggleProductState(prod._id, 'isActive', prod.isActive)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-action-group" style={{ justifyContent: 'flex-end' }}>
                              <Link
                                to={`/product/${prod._id || prod.slug}`}
                                target="_blank"
                                className="btn-icon-table"
                                title="View on website"
                              >
                                <Eye size={15} />
                              </Link>
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="btn-icon-table"
                                title="Edit Product Details"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id, prod.name)}
                                className="btn-icon-table delete"
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PROMOTIONAL OFFERS ================= */}
        {activeTab === 'offers' && (
          <div>
            <div className="dashboard-control-bar">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-espresso)' }}>
                Website Promotional Banners &amp; Coupons
              </h2>
              <button onClick={handleOpenAddOffer} className="btn btn-primary">
                <Plus size={18} />
                <span>Create New Offer</span>
              </button>
            </div>

            <div className="dashboard-table-card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Offer Title &amp; Details</th>
                    <th>Discount</th>
                    <th>Coupon</th>
                    <th>CTA Button</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((off) => (
                    <tr key={off._id}>
                      <td>
                        <strong style={{ color: 'var(--color-espresso)', display: 'block' }}>
                          {off.title}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {off.description?.substring(0, 85)}...
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>{off.discount}</strong>
                      </td>
                      <td>
                        <code style={{ background: 'var(--bg-sand)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                          {off.couponCode || 'N/A'}
                        </code>
                      </td>
                      <td>{off.ctaText}</td>
                      <td>
                        <span className={`table-badge ${off.isActive ? 'badge-status-completed' : 'badge-status-new'}`}>
                          {off.isActive ? 'Live on Website' : 'Draft / Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-action-group" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenEditOffer(off)}
                            className="btn-icon-table"
                            title="Edit Offer"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(off._id, off.title)}
                            className="btn-icon-table delete"
                            title="Delete Offer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CUSTOMER ENQUIRIES ================= */}
        {activeTab === 'enquiries' && (
          <div>
            {/* Filter Pills for Status & Category */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', alignSelf: 'center', marginRight: '0.3rem' }}>Status:</span>
                {['All', 'New', 'Contacted', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`btn btn-sm ${enquiryStatusFilter === st ? 'btn-primary' : 'btn-light'}`}
                  >
                    <span>{st}</span>
                    {st !== 'All' && enquiryCounts[st.toLowerCase().replace(' ', '')] !== undefined && (
                      <span style={{ marginLeft: '4px', opacity: 0.8 }}>
                        ({enquiryCounts[st.toLowerCase().replace(' ', '')]})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)' }}>Category:</span>
                <select
                  value={enquiryPillarFilter}
                  onChange={(e) => setEnquiryPillarFilter(e.target.value)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                >
                  <option value="All">All Inquiries</option>
                  <option value="sofas">🛋️ Sofas</option>
                  <option value="mattresses">🛏️ Mattresses</option>
                  <option value="pillows">✨ Cushions &amp; Pillows</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredEnquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No customer enquiries found in this view.</p>
                </div>
              ) : (
                filteredEnquiries.map((enq) => {
                  const details = enq.customizationDetails || {};
                  return (
                    <div key={enq._id} className="dashboard-enquiry-card">
                      <div className="enquiry-card-header">
                        <div className="enquiry-card-user-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-espresso)', margin: 0 }}>
                              {enq.customerName}
                            </h3>
                            <span
                              className={`table-badge ${
                                enq.status === 'New'
                                  ? 'badge-status-new'
                                  : enq.status === 'Contacted'
                                  ? 'badge-status-contacted'
                                  : enq.status === 'In Progress'
                                  ? 'badge-status-inprogress'
                                  : 'badge-status-completed'
                              }`}
                            >
                              {enq.status}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(enq.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                            Product Reference: {enq.product}
                          </div>
                        </div>

                        {/* Status Selector Dropdown */}
                        <div className="enquiry-card-status-ctrl">
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button
                            onClick={() => handleDeleteEnquiry(enq._id, enq.customerName)}
                            className="btn-icon-table delete"
                            title="Delete Enquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Customer Contact Links (WhatsApp & Call) */}
                      <div className="enquiry-contact-links">
                        <a
                          href={`tel:${enq.phone}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.88rem', fontWeight: 600 }}
                        >
                          <Phone size={15} />
                          <span>{enq.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.customerName}, this is myKouch regarding your enquiry for "${enq.product}". How can we help customize your comfort?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.88rem', fontWeight: 600 }}
                        >
                          <MessageSquare size={15} />
                          <span>Chat on WhatsApp</span>
                        </a>
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                          >
                            <Mail size={15} />
                            <span>{enq.email}</span>
                          </a>
                        )}
                      </div>

                      {/* Customization Details Grid (Adaptive to Sofa, Mattress, and Pillow) */}
                      {(details.sofaType || details.preferredSize || details.fabricPreference || details.preferredColor || details.seatingPreference) && (
                        <div className="enquiry-details-grid">
                          {details.sofaType && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Type / System:</span>
                              <strong>{details.sofaType}</strong>
                            </div>
                          )}
                          {details.seatingPreference && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Size / Seating:</span>
                              <strong>{details.seatingPreference}</strong>
                            </div>
                          )}
                          {details.fabricPreference && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Fabric / Foam Core:</span>
                              <strong>{details.fabricPreference}</strong>
                            </div>
                          )}
                          {details.preferredColor && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Color / Finish:</span>
                              <strong>{details.preferredColor}</strong>
                            </div>
                          )}
                          {details.preferredSize && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Cot / Pillow Size:</span>
                              <strong>{details.preferredSize}</strong>
                            </div>
                          )}
                          {details.roomDimensions && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Room / Cot Dimensions:</span>
                              <strong>{details.roomDimensions}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {enq.message && (
                        <p className="enquiry-message-box">
                          "{enq.message}"
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD/EDIT PRODUCT MODAL ================= */}
      {isProductModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Edit Product in Catalog' : 'Add New Product to Catalog'}
              </h2>
              <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-body">
              {/* Quick Presets Toolbar */}
              <div style={{ background: 'var(--bg-sand-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px dashed var(--border-medium)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '0.4rem' }}>
                  ⚡ Quick Autofill Presets (Click to autofill specifications):
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => applyPreset('luxury-sofa')} className="spec-preset-btn">
                    🛋️ Luxury Sofa
                  </button>
                  <button type="button" onClick={() => applyPreset('pocket-spring')} className="spec-preset-btn">
                    🛏️ Pocket Spring Mattress
                  </button>
                  <button type="button" onClick={() => applyPreset('orthopedic-mattress')} className="spec-preset-btn">
                    🩺 Orthopedic Dual-Comfort
                  </button>
                  <button type="button" onClick={() => applyPreset('throw-cushions')} className="spec-preset-btn">
                    ✨ Accent Throw Cushions
                  </button>
                  <button type="button" onClick={() => applyPreset('neck-pillow')} className="spec-preset-btn">
                    💤 Cervical Neck Pillow
                  </button>
                </div>
              </div>

              {/* Product Name */}
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. myKouch Orthopedic Dual-Comfort Mattress / Royal Velvet Sofa"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Category & Subtype */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Subtype Selector (Contextual) */}
                <div className="form-group">
                  <label className="form-label">Sub-Category / Type</label>
                  {productForm.category === 'Mattress & Beddings' ? (
                    <select
                      value={productForm.subType || 'orthopedic'}
                      onChange={(e) => setProductForm({ ...productForm, subType: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {MATTRESS_SUBTYPES.map((st) => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>
                  ) : productForm.category === 'Pillow & Cushion' ? (
                    <select
                      value={productForm.subType || 'throw-cushions'}
                      onChange={(e) => setProductForm({ ...productForm, subType: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {PILLOW_SUBTYPES.map((st) => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={productForm.subType || ''}
                      onChange={(e) => setProductForm({ ...productForm, subType: e.target.value })}
                      placeholder="e.g. Sectional / Loveseat / Recliner"
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              </div>

              {/* Price & Showroom Original Price */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Factory Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 29999"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Showroom MRP (Optional for discount)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 42999"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Dimensions & Capacity */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Dimensions / Thickness</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder='e.g. 78" L x 72" W x 10" Thick or 108" L x 72" W'
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Size / Capacity</label>
                  <input
                    type="text"
                    value={productForm.seatingCapacity}
                    onChange={(e) => setProductForm({ ...productForm, seatingCapacity: e.target.value })}
                    placeholder="e.g. King Size / Set of 2 / 6 Seater"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe comfort architecture, core materials, ergonomics, and handcrafted details..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Image Upload / URLs */}
              <div className="form-group" style={{ background: 'var(--bg-sand-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-medium)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={16} />
                  <span>Product Photos</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Uploading image...</p>}

                {productForm.images && productForm.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto' }}>
                    {productForm.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img
                          src={getImageUrl(img)}
                          alt=""
                          style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                          onError={(e) => {
                            if (!e.target.dataset.failed) {
                              e.target.dataset.failed = 'true';
                              e.target.src = '/assets/sofas/drawing_room_1_2.jpg';
                            }
                          }}
                        />
                        {productForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setProductForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, idx) => idx !== i),
                              }))
                            }
                            style={{ position: 'absolute', top: -5, right: -5, background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Remove image"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors & Badge */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Available Colors (Comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Pearl White, Deep Navy, Charcoal, Terracotta"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Badge Text</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller, Dual-Comfort, New Arrival"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Contextual Technical Specifications */}
              <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '0.75rem' }}>
                  🔧 Technical Craftsmanship Specifications:
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      {productForm.category === 'Mattress & Beddings' ? 'Spring Architecture / Foundation' : productForm.category === 'Pillow & Cushion' ? 'Filling Core' : 'Frame Timber Material'}
                    </label>
                    <input
                      type="text"
                      value={productForm.specifications?.frameMaterial || ''}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specifications: { ...productForm.specifications, frameMaterial: e.target.value },
                        })
                      }
                      placeholder={productForm.category === 'Mattress & Beddings' ? 'Individually Encased Coils / Anti-Sag Core' : 'Treated Sal Wood'}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {productForm.category === 'Mattress & Beddings' ? 'Foam Comfort Layers' : productForm.category === 'Pillow & Cushion' ? 'Casing Shell' : 'Foam Density'}
                    </label>
                    <input
                      type="text"
                      value={productForm.specifications?.foamDensity || ''}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specifications: { ...productForm.specifications, foamDensity: e.target.value },
                        })
                      }
                      placeholder={productForm.category === 'Mattress & Beddings' ? '50D Cool-Gel Memory Foam + 40D HR' : '40D HR Supersoft Foam'}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Warranty Details</label>
                  <input
                    type="text"
                    value={productForm.specifications?.warranty || ''}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        specifications: { ...productForm.specifications, warranty: e.target.value },
                      })
                    }
                    placeholder="10 Years Direct Manufacturer Warranty with Zero-Sag Guarantee"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', padding: '1rem', background: '#FAF8F5', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                  />
                  <span>Mark as New Arrival (Homepage)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isTopSelling}
                    onChange={(e) => setProductForm({ ...productForm, isTopSelling: e.target.checked })}
                  />
                  <span>Mark as Top Seller</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  />
                  <span>Active &amp; Published in Catalog</span>
                </label>
              </div>

              <div className="dashboard-modal-actions">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-light">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD/EDIT OFFER MODAL ================= */}
      {isOfferModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsOfferModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingOffer ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
              </h2>
              <button onClick={() => setIsOfferModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="modal-body">
              <div className="form-group">
                <label className="form-label">Offer Headline *</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. Living &amp; Bedroom Luxury Comfort Fest"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Hook</label>
                <input
                  type="text"
                  value={offerForm.subtitle}
                  onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                  placeholder="Handcrafted in Bhubaneswar • Custom Sizes &amp; Direct Factory Pricing"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Offer Description *</label>
                <textarea
                  rows={3}
                  required
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Details of the promotion across Sofas, Mattresses, and Pillows..."
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Text</label>
                  <input
                    type="text"
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    placeholder="UP TO 35% OFF"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Coupon Code</label>
                  <input
                    type="text"
                    value={offerForm.couponCode}
                    onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                    placeholder="COMFORT35"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={offerForm.isActive}
                    onChange={(e) => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                  />
                  <span>Publish &amp; Show Live on Website</span>
                </label>
              </div>

              <div className="dashboard-modal-actions">
                <button type="button" onClick={() => setIsOfferModalOpen(false)} className="btn btn-light">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>{editingOffer ? 'Update Offer' : 'Publish Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= OWNER ACCOUNT & PASSWORD MODAL ================= */}
      {isSettingsModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} color="var(--color-primary)" />
                <span>Owner Credentials &amp; Password</span>
              </h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Update your owner portal email, display name, and password anytime to maintain exclusive portal access.
              </p>

              {settingsError && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {settingsError}
                </div>
              )}

              {settingsSuccess && (
                <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {settingsSuccess}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Owner Display Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  placeholder="myKouch Owner"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Login Email</label>
                <input
                  type="email"
                  required
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="admin@mykouch.in"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Password (Required for changes)</label>
                <input
                  type="password"
                  required
                  value={settingsForm.currentPassword}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">New Password (Optional)</label>
                  <input
                    type="password"
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="dashboard-modal-actions">
                <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="btn btn-light">
                  Cancel
                </button>
                <button type="submit" disabled={updatingSettings} className="btn btn-primary">
                  {updatingSettings ? 'Saving...' : 'Update Owner Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
