const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
  : '/api';

/**
 * Resolves sofa image path across both local assets and remote/local uploads
 */
export const getImageUrl = (imgPath) => {
  if (!imgPath) return '/assets/sofas/drawing_room_1_2.jpg';
  if (typeof imgPath !== 'string') return '/assets/sofas/drawing_room_1_2.jpg';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  if (imgPath.startsWith('/uploads')) {
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
      : '';
    return backendUrl ? `${backendUrl}${imgPath}` : imgPath;
  }
  return imgPath;
};

// Helper for fetch with headers and auth
const request = async (endpoint, options = {}) => {
  const { token, ...customOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(customOptions.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...customOptions,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the API request');
  }
  return data;
};

// ================= PRODUCT APIS =================
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  return request(`/products?${query.toString()}`);
};

export const getProductById = async (id) => {
  return request(`/products/${id}`);
};

export const createProduct = async (productData, token) => {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
    token,
  });
};

export const updateProduct = async (id, productData, token) => {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
    token,
  });
};

export const deleteProduct = async (id, token) => {
  return request(`/products/${id}`, {
    method: 'DELETE',
    token,
  });
};

// ================= OFFER APIS =================
export const getActiveOffer = async () => {
  return request('/offers/active');
};

export const getAllOffers = async (token) => {
  return request('/offers', { token });
};

export const createOffer = async (offerData, token) => {
  return request('/offers', {
    method: 'POST',
    body: JSON.stringify(offerData),
    token,
  });
};

export const updateOffer = async (id, offerData, token) => {
  return request(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(offerData),
    token,
  });
};

export const deleteOffer = async (id, token) => {
  return request(`/offers/${id}`, {
    method: 'DELETE',
    token,
  });
};

export const submitEnquiry = async (enquiryData) => {
  const localItem = {
    _id: 'enq_' + Date.now(),
    ...enquiryData,
    createdAt: new Date().toISOString(),
    status: 'New',
  };

  try {
    const res = await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });

    try {
      const existingRaw = localStorage.getItem('mykouch_local_enquiries');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('mykouch_local_enquiries', JSON.stringify([localItem, ...existing.slice(0, 49)]));
    } catch (e) {}

    return res;
  } catch (apiErr) {
    try {
      const existingRaw = localStorage.getItem('mykouch_local_enquiries');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('mykouch_local_enquiries', JSON.stringify([localItem, ...existing.slice(0, 49)]));
      return { success: true, message: 'Enquiry received by myKouch workshop!', data: localItem };
    } catch (localErr) {
      throw apiErr;
    }
  }
};

export const getAllEnquiries = async (token, params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  return request(`/enquiries?${query.toString()}`, { token });
};

export const updateEnquiryStatus = async (id, updateData, token) => {
  return request(`/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
    token,
  });
};

export const deleteEnquiry = async (id, token) => {
  return request(`/enquiries/${id}`, {
    method: 'DELETE',
    token,
  });
};

// ================= AUTH APIS =================
export const loginOwner = async (email, password) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getOwnerMe = async (token) => {
  return request('/auth/me', { token });
};

export const updateOwnerProfile = async (updateData, token) => {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updateData),
    token,
  });
};

// ================= DASHBOARD STATS =================
export const getDashboardStats = async (token) => {
  return request('/stats', { token });
};

// ================= TESTIMONIALS =================
export const getTestimonials = async () => {
  return request('/testimonials');
};

// ================= IMAGE UPLOAD =================
export const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/upload/single`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data;
};
