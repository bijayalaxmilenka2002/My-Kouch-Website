import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const categories = [
  'L-Shaped Sofas',
  '3 Seater Sofas',
  'Sofa Combos',
  'Recliner Sofas',
  '2 Seater Sofas',
];

export default function OwnerDashboardPage() {
  const { token, owner, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'L-Shaped Sofas',
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
      legs: 'Solid Metal Legs with Electroplated Champagne Gold Finish',
      customizable: true,
    },
  });

  // Offer Add/Edit Modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount: 'UP TO 35% OFF',
    couponCode: 'COMFORT35',
    image: '/assets/sofas/drawing_room_1_2.jpg',
    ctaText: 'Explore Sofa Offers',
    ctaLink: '/collections',
    isActive: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, offerRes, enqRes] = await Promise.all([
        getDashboardStats(token).catch(() => ({ stats: null })),
        getProducts({ isActive: undefined }), // fetch all, including inactive
        getAllOffers(token).catch(() => ({ offers: [] })),
        getAllEnquiries(token).catch(() => ({ enquiries: [], counts: {} })),
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (prodRes?.products) setProducts(prodRes.products);
      if (offerRes?.offers) setOffers(offerRes.offers);
      if (enqRes?.enquiries) {
        setEnquiries(enqRes.enquiries);
        setEnquiryCounts(enqRes.counts || {});
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // ================= PRODUCT ACTIONS =================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'L-Shaped Sofas',
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
        legs: 'Solid Metal Legs with Electroplated Champagne Gold Finish',
        customizable: true,
      },
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      dimensions: prod.dimensions || '',
      seatingCapacity: prod.seatingCapacity || '',
      badge: prod.badge || '',
      images: prod.images || [],
      colors: (prod.colors || []).join(', '),
      materials: (prod.materials || []).join(', '),
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
        showNotification('Sofa image uploaded successfully!');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
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
        colors: productForm.colors.split(',').map((c) => c.trim()).filter(Boolean),
        materials: productForm.materials.split(',').map((m) => m.trim()).filter(Boolean),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload, token);
        showNotification(`Sofa "${productForm.name}" updated successfully!`);
      } else {
        await createProduct(payload, token);
        showNotification(`New Sofa "${productForm.name}" published to website!`);
      }

      setIsProductModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await deleteProduct(id, token);
        showNotification(`Sofa "${name}" deleted.`);
        loadAllData();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const handleToggleProductState = async (id, field, currentValue) => {
    try {
      await updateProduct(id, { [field]: !currentValue }, token);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, [field]: !currentValue } : p))
      );
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
      subtitle: 'Exclusive Factory-Direct Pricing & Free Consultation',
      description: '',
      discount: 'UP TO 35% OFF',
      couponCode: 'COMFORT35',
      image: '/assets/sofas/drawing_room_1_2.jpg',
      ctaText: 'Explore Sofa Offers',
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
      description: off.description,
      discount: off.discount || '',
      couponCode: off.couponCode || '',
      image: off.image || '',
      ctaText: off.ctaText || '',
      ctaLink: off.ctaLink || '',
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
        await updateOffer(editingOffer._id, offerForm, token);
        showNotification('Offer updated successfully!');
      } else {
        await createOffer(offerForm, token);
        showNotification('New Promotional Offer published to Homepage!');
      }
      setIsOfferModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save offer: ' + err.message);
    }
  };

  const handleDeleteOffer = async (id, title) => {
    if (window.confirm(`Delete promotional offer "${title}"?`)) {
      try {
        await deleteOffer(id, token);
        showNotification('Offer deleted.');
        loadAllData();
      } catch (err) {
        alert('Failed to delete offer: ' + err.message);
      }
    }
  };

  // ================= ENQUIRY ACTIONS =================
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, { status: newStatus }, token);
      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === id ? { ...enq, status: newStatus } : enq))
      );
      showNotification(`Enquiry marked as "${newStatus}"`);
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDeleteEnquiry = async (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      try {
        await deleteEnquiry(id, token);
        showNotification('Enquiry deleted.');
        loadAllData();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new-arrivals') {
      if (!p.isNewArrival) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    if (enquiryStatusFilter !== 'All' && e.status !== enquiryStatusFilter) {
      return false;
    }
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
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 3000, background: 'var(--color-espresso-dark)', color: '#FFFFFF', padding: '0.9rem 1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid var(--color-primary)' }}>
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
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Logged in as: <strong>{owner?.email || 'admin@mykouch.in'}</strong>
            </span>
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
              onClick={logout}
              className="btn btn-outline btn-sm"
              title="Logout from owner session"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="dashboard-tabs-bar">
        <button
          onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
          className={`dashboard-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Products Management</span>
          <span className="tab-badge">{products.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab('new-arrivals'); setSearchQuery(''); }}
          className={`dashboard-tab-btn ${activeTab === 'new-arrivals' ? 'active' : ''}`}
        >
          <Sparkles size={18} />
          <span>New Arrivals</span>
          <span className="tab-badge">
            {products.filter((p) => p.isNewArrival).length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('offers'); setSearchQuery(''); }}
          className={`dashboard-tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
        >
          <Tag size={18} />
          <span>Offers &amp; Promotions</span>
          <span className="tab-badge">{offers.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
          className={`dashboard-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Customer Enquiries</span>
          <span className="tab-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
            {enquiryCounts.new || 0} New
          </span>
        </button>
      </div>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Top Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Sofa Products</div>
              <div className="stat-value">{products.length}</div>
            </div>
            <div className="stat-icon">
              <Package size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">New Arrivals Active</div>
              <div className="stat-value" style={{ color: '#15803D' }}>
                {products.filter((p) => p.isNewArrival && p.isActive).length}
              </div>
            </div>
            <div className="stat-icon" style={{ background: '#DCFCE7', color: '#15803D' }}>
              <Sparkles size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Promotional Offers</div>
              <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                {offers.filter((o) => o.isActive).length} Active
              </div>
            </div>
            <div className="stat-icon">
              <Tag size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Customer Enquiries</div>
              <div className="stat-value" style={{ color: '#B45309' }}>
                {enquiryCounts.total || enquiries.length} Total
              </div>
            </div>
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        {/* TAB 1 & 2: PRODUCTS OR NEW ARRIVALS */}
        {(activeTab === 'products' || activeTab === 'new-arrivals') && (
          <div>
            <div className="dashboard-control-bar">
              <div className="dashboard-search-box">
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search sofa by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleOpenAddProduct} className="btn btn-primary">
                  <Plus size={18} />
                  <span>Add New Sofa</span>
                </button>
              </div>
            </div>

            <div className="dashboard-table-card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Sofa Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>New Arrival</th>
                    <th>Top Selling</th>
                    <th>Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <div className="product-table-cell">
                          <img
                            src={getImageUrl(prod.images?.[0])}
                            alt=""
                            className="product-table-thumb"
                            onError={(e) => {
                              if (!e.target.dataset.triedRelative && e.target.src.includes('/uploads/')) {
                                e.target.dataset.triedRelative = 'true';
                                const parts = e.target.src.split('/uploads/');
                                if (parts[1]) {
                                  e.target.src = `/uploads/${parts[1]}`;
                                  return;
                                }
                              }
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
                              {prod.dimensions}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="table-badge" style={{ background: 'var(--bg-sand)', color: 'var(--color-espresso)' }}>
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
                        {prod.seatingCapacity}
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
                            to={`/product/${prod._id}`}
                            target="_blank"
                            className="btn-icon-table"
                            title="View on site"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="btn-icon-table"
                            title="Edit Sofa Details"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="btn-icon-table delete"
                            title="Delete Sofa"
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

        {/* TAB 3: PROMOTIONAL OFFERS */}
        {activeTab === 'offers' && (
          <div>
            <div className="dashboard-control-bar">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-espresso)' }}>
                Website Promotional Offers &amp; Banners
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
                    <th>Offer Title</th>
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
                          {off.description?.substring(0, 75)}...
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
                          {off.isActive ? 'Live on Homepage' : 'Draft / Inactive'}
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

        {/* TAB 4: CUSTOMER ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredEnquiries.map((enq) => {
                const details = enq.customizationDetails || {};
                return (
                  <div
                    key={enq._id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-espresso)' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

                    {/* Customer Contact Links */}
                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${enq.phone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.88rem', fontWeight: 600 }}
                      >
                        <Phone size={15} />
                        <span>{enq.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.customerName}, this is myKouch regarding your sofa enquiry for "${enq.product}".`)}`}
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

                    {/* Customization Details Grid */}
                    {(details.sofaType || details.preferredSize || details.fabricPreference || details.preferredColor) && (
                      <div style={{ background: 'var(--bg-sand-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.84rem' }}>
                        {details.sofaType && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Sofa Type:</span>
                            <strong>{details.sofaType}</strong>
                          </div>
                        )}
                        {details.seatingPreference && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Seating:</span>
                            <strong>{details.seatingPreference}</strong>
                          </div>
                        )}
                        {details.fabricPreference && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Fabric:</span>
                            <strong>{details.fabricPreference}</strong>
                          </div>
                        )}
                        {details.preferredColor && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Color:</span>
                            <strong>{details.preferredColor}</strong>
                          </div>
                        )}
                        {details.preferredSize && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Size:</span>
                            <strong>{details.preferredSize}</strong>
                          </div>
                        )}
                        {details.roomDimensions && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Room Size:</span>
                            <strong>{details.roomDimensions}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {enq.message && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-espresso)', background: '#FAF8F5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', margin: 0, fontStyle: 'italic' }}>
                        "{enq.message}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD/EDIT PRODUCT MODAL ================= */}
      {isProductModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Edit Sofa Product' : 'Add New Sofa to Catalog'}
              </h2>
              <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Sofa Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. myKouch Tuscany Velvet Sectional"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seating Capacity</label>
                  <input
                    type="text"
                    value={productForm.seatingCapacity}
                    onChange={(e) => setProductForm({ ...productForm, seatingCapacity: e.target.value })}
                    placeholder="e.g. 6 Seater or 3 + 1 + 1"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Direct Factory Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 54999"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Showroom Price (Optional)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 78999"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dimensions</label>
                <input
                  type="text"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  placeholder='e.g. 108" L x 72" W x 34" H'
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sofa Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe comfort, tufting, upholstery, foam density..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Image Upload Area */}
              <div className="form-group" style={{ background: 'var(--bg-sand-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-medium)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={16} />
                  <span>Upload Sofa Photo (Direct from Computer)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Uploading image to server...</p>}

                {productForm.images && productForm.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto' }}>
                    {productForm.images.map((img, i) => (
                      <img
                        key={i}
                        src={getImageUrl(img)}
                        alt=""
                        style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                        onError={(e) => {
                          if (!e.target.dataset.failed) {
                            e.target.dataset.failed = 'true';
                            e.target.src = '/assets/sofas/drawing_room_1_2.jpg';
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Available Colors (Comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Emerald Teal, Ivory Cream, Royal Navy"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge Text</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller, New Arrival, Luxury Edition"
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
                  <span>Mark as New Arrival (Shows on Homepage)</span>
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
                  <span>Active &amp; Published</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-light">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Sofa'}</span>
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
                  placeholder="e.g. Festive Living Room Comfort Fest"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Hook</label>
                <input
                  type="text"
                  value={offerForm.subtitle}
                  onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                  placeholder="Factory-Direct Sofa Event • Handcrafted in Bhubaneswar"
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
                  placeholder="Details of the discount, included consultation, room measurements..."
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
                  <span>Publish &amp; Show Live on Homepage</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
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
    </div>
  );
}
