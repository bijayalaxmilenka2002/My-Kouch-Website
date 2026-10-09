# myKouch™ • Handcrafted Luxury Sofas, Mattresses & Beddings

> **"Comfort That Feels Like Home"**  
> Premium bespoke living room seating, orthopedic hybrid mattresses, and designer pillows handcrafted factory-direct in Bhubaneswar, Odisha.

[![Live Website](https://img.shields.io/badge/Website-mykouch.com-C05621?style=for-the-badge&logo=google-chrome&logoColor=white)](https://mykouch.com)
[![Hostinger](https://img.shields.io/badge/Hosting-Hostinger%20Cloud-673DE6?style=for-the-badge&logo=hostinger&logoColor=white)](https://hpanel.hostinger.com)
[![Backend](https://img.shields.io/badge/Backend-Render-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://mykouch-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/bijayalaxmilenka2002/My-Kouch-Website)

---

## 🌐 Official Live Deployments & Endpoints

| Service | Live URL | Description |
| :--- | :--- | :--- |
| 🛋️ **Customer Website** | **[https://mykouch.com](https://mykouch.com)** | Official luxury furniture showroom & catalog |
| 🔐 **Owner Portal** | **[https://mykouch.com/owner/login](https://mykouch.com/owner/login)** | Secure administrative portal for inventory & offers |
| ⚡ **Backend REST API** | **[https://mykouch-backend.onrender.com](https://mykouch-backend.onrender.com)** | Node.js / Express backend server on Render |
| 🩺 **API Health Check** | **[https://mykouch-backend.onrender.com/api/health](https://mykouch-backend.onrender.com/api/health)** | Live server & MongoDB Atlas connectivity status |
| 📁 **GitHub Repository** | **[bijayalaxmilenka2002/My-Kouch-Website](https://github.com/bijayalaxmilenka2002/My-Kouch-Website)** | Main source code repository |

### 🔑 Owner Portal Credentials:
- **Login URL:** [https://mykouch.com/owner/login](https://mykouch.com/owner/login)
- **Admin Email:** `admin@mykouch.in`
- **Password:** `MyKouch@2026`

---

## 🌟 Brand Overview

**myKouch** (by *MB Marketing*) is a factory-direct luxury furniture and bedding manufacturer based in Bhubaneswar, Odisha. We eliminate distributor and middleman markups by crafting bespoke home comfort products directly at our Sunderipada workshop using seasoned termite-treated Sal wood, 40-density high-resilience foam, zero-motion pocket springs, and 100+ premium upholstery fabrics.

---

## 🛋️ Core Product Pillars

1. **Luxury Sofas & Living Room Suites:**
   - L-Shaped Sectionals, 3+1+1 Suites, Recliners, Chesterfield 3-Seaters, and Studio 2-Seaters.
   - 10-year structural frame warranty with customizable dimensions and orientation (LHS/RHS).
2. **Orthopedic Mattresses & Beddings:**
   - Dual-comfort memory foam cores, euro-top pocket spring hybrid mattresses, waterproof protectors, and Japanese foldaway futons.
3. **Plush Pillows & Decorative Cushions:**
   - Orthopedic cervical memory pillows, luxury throw cushions (bouclé, velvet, jacquard), and premium bedding accessories.

---

## 🚀 Recent Upgrades & Architectural Enhancements

### 1. Typography & Navigation Redesign
- Upgraded navigation font to **Plus Jakarta Sans** (weights 500, 600, 700, 800) with refined letter-spacing and Title Case styling.
- Added smooth gradient underline indicators (`linear-gradient(90deg, #C05621, #E07A3E)`).
- **Sticky Navbar on Scroll-Up:** Automatically reveals a sleek, frosted glass sticky header when scrolling upward from anywhere on the page, with zero layout shift (`overflow-x: clip`).

### 2. Real-Time Owner Portal ➔ MongoDB Atlas ➔ Live Client Sync
- **Dynamic Offer Synchronization:** Setting or editing a promotional offer in the Owner Portal immediately updates MongoDB Atlas and broadcasts across client tabs via `storage` and custom `mykouch_sync` event listeners.
- **Resilient Product Schema:** Relaxed rigid category enums to allow infinite custom product categories, automated discount percentage calculation, and fallback upserting so new drafts never fail validation.
- **Immediate Live Reflection:** Products added or updated by the owner appear in real-time across the Home Page showcases, Collections catalog, and Product Detail views.

### 3. Production Deployment Architecture
- **Frontend on Hostinger Cloud:** Built with Vite v6 and deployed under `mykouch.com` with Apache `.htaccess` rewrite rules for single-page application (SPA) routing.
- **Backend on Render:** Node.js Express server running 24/7 at `https://mykouch-backend.onrender.com`, connected to a dedicated MongoDB Atlas cluster with automatic connection pooling.
- **CORS & Environment Configuration:** Fully configured with `VITE_API_URL` pointing to the live Render backend, allowing secure authenticated requests between `mykouch.com` and the API.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router DOM 7, Lucide Icons, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js, JWT Authentication, Multer, Bcrypt.js, CORS |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Typography** | Plus Jakarta Sans, Outfit, Cormorant Garamond, Playfair Display |
| **Hosting** | Hostinger Cloud (Frontend & DNS) + Render Cloud (Backend REST API) |

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/bijayalaxmilenka2002/My-Kouch-Website.git
cd My-Kouch-Website
```

### 2. Setup & run Backend
```bash
cd server
npm install
node server.js
```
*Backend runs on `http://localhost:5000`*

### 3. Setup & run Frontend
```bash
cd ../client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 4. Build for Production
```bash
cd client
npm run build
```
*Generates optimized production bundle in `client/dist`*

---

## 📞 Factory & Showroom Contact

- **Factory Workshop:** Sunderipada, Bhubaneswar, Odisha, India (751002)
- **Showroom:** Rasulgarh / Cuttack Road, Bhubaneswar
- **Direct WhatsApp / Call:** +91 80933 76990
- **Official Email:** `contact@mykouch.in`
- **Owner Admin Email:** `admin@mykouch.in`

---

*© 2026 myKouch™ (MB Marketing). Handcrafted with pride in Bhubaneswar.*
