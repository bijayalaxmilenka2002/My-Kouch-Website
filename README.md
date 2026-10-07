# myKouch™ — Handcrafted Luxury Sofas • Factory-Direct Showcase

> **"Comfort That Feels Like Home"**  
> Premium bespoke sofas, velvet L-shaped sectionals, 3+1+1 living room suites, and motorized recliners handcrafted directly at our factory in Bhubaneswar, Odisha.

---

## 🌟 Overview

**myKouch** (by *MB Maaarketing*) is a factory-direct luxury sofa manufacturer and showroom platform. Built from the ground up for discerning homeowners and interior designers, myKouch eliminates distributor markups by building custom living room seating directly in Sunderipada, Bhubaneswar with treated seasoned Sal wood frames, 40-density high-resilience foam, and 100+ imported luxury fabrics.

---

## 🚀 Key Features

- **🛋️ Interactive Sofa Catalog & Filters**:
  - Filter by Category (L-Shaped Sectionals, Sofa Combos, 3-Seater Sofas, Recliners, 2-Seaters).
  - Filter by Seating Capacity (2-Seater, 3-Seater, 5-Seater Suite, 6-7 Seater, Single Recliner).
  - Instant Search & Multi-criteria Sorting (Price Low-to-High, High-to-Low, Highest Rated, Featured).
  - Responsive collapsible mobile filter drawer with active filter badges.

- **🎨 Real-Time Color Swatches & Image Switching**:
  - Interactive color theme picker (Emerald Velvet, Champagne Beige, Royal Taupe, Charcoal Heather, Nordic Mist, Midnight Navy, etc.) that instantly switches the high-resolution gallery stage image.

- **📐 Custom Sofa Builder & Enquire Modal**:
  - Direct factory customizer allowing customers to specify room dimensions, foam firmness, chaise orientation (LHS/RHS), and fabric preferences.
  - Direct 1-tap WhatsApp consultation (`+91 80933 76990`) pre-populated with customer and product details.

- **⚡ Flash Sale Ribbon & Promotional Offers**:
  - Eye-catching banner section with Wakefit-inspired arched photo collage and direct scroll-to-offer anchor navigation.

- **🎠 Continuous Autoplay Smooth Stepping Carousel**:
  - Seamless auto-rotating showcase for customer favorites and bestsellers with pause-on-hover and touch swipe support.

- **📱 Complete Mobile & Multi-Device Responsiveness**:
  - Mobile-first adaptive layout optimized for all screen sizes (320px to 4K displays).
  - Off-canvas navigation drawer with touch gestures.
  - No horizontal wobble or overflow (`viewport-fit=cover` and safe area insets for iOS devices).

- **🔍 Comprehensive SEO & Google Rich Snippets**:
  - **Dynamic Route SEO**: Auto-updating `document.title`, `<meta name="description">`, `<meta name="keywords">`, `<link rel="canonical">`, OpenGraph, and Twitter Cards.
  - **JSON-LD Schema Markup**:
    - `schema.org/FurnitureStore` with Bhubaneswar factory and showroom geocoordinates, address, telephone, and business hours.
    - `schema.org/Product` with live pricing, INR currency, stock availability, ratings, and image arrays.
    - `schema.org/WebSite` sitelinks search box integration.
  - Search engine directives in `robots.txt` and fully mapped `sitemap.xml`.

- **🔐 Owner Management Portal**:
  - Secure JWT-authenticated dashboard (`/owner/login` → `/owner/dashboard`).
  - Add, edit, or delete sofa models with multi-image uploads.
  - Manage active promotional discounts and banner headlines.
  - Real-time customer enquiry tracking and WhatsApp lead conversion status.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router 7, Vanilla CSS Design System, Lucide React Icons |
| **Backend** | Node.js (ES Modules), Express.js 4, Mongoose 8, JWT Auth, Multer, CORS |
| **Database** | MongoDB Atlas (Cloud Cluster) / Local MongoDB |
| **Hosting Targets** | **Vercel** (Frontend) & **Render** (Backend API) |

---

## 📂 Project Structure

```
My-Kouch-Website/
├── client/                     # Frontend React + Vite Application
│   ├── public/
│   │   ├── assets/             # Brand logos and high-resolution sofa imagery
│   │   ├── robots.txt          # Search engine crawler directives
│   │   └── sitemap.xml         # XML Sitemap for search engines
│   ├── src/
│   │   ├── components/         # Navbar, Hero, Modals, SEO, Carousels, ProductCard
│   │   ├── context/            # AuthContext, SofaContext
│   │   ├── pages/              # HomePage, CollectionsPage, ProductDetailPage, About, Contact, Owner
│   │   ├── services/           # Fetch API service layer
│   │   └── styles/             # Vanilla CSS design tokens, components.css, index.css
│   ├── index.html              # Core HTML with SEO schemas & Google Fonts
│   ├── package.json
│   ├── vercel.json             # Vercel SPA routing rewrites
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── config/                 # MongoDB Mongoose connection
│   ├── controllers/            # Auth, Product, Offer, Enquiry controllers
│   ├── middleware/             # JWT auth verification, error handler
│   ├── models/                 # User, Product, Offer, Enquiry schemas
│   ├── routes/                 # Express route definitions
│   ├── seed/                   # Database seeders
│   ├── uploads/                # Local media upload storage
│   ├── package.json
│   └── server.js               # Express entrypoint & CORS configuration
│
├── .gitignore                  # Git ignore rules (node_modules, .env, dist)
└── README.md                   # Project documentation
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB instance

### 2. Clone Repository
```bash
git clone https://github.com/bijayalaxmilenka2002/My-Kouch-Website.git
cd My-Kouch-Website
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` (refer to `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mykouch?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

*(Optional) Seed sample products:*
```bash
node seed/seedData.js
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file in `client/` (optional for local dev, uses Vite proxy by default):
```env
VITE_API_URL=http://localhost:5000
```

Start Vite dev server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🚢 Deployment Guide

### A. Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `bijayalaxmilenka2002/My-Kouch-Website`.
3. Configure service settings:
   - **Name**: `mykouch-backend` (or your preferred name)
   - **Region**: Singapore or Frankfurt (choose closest to India)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in Render:
   - `PORT`: `5000` (or leave default, Render sets this automatically)
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/mykouch?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.
6. Once deployed, copy your Render service URL:  
   `https://mykouch-backend.onrender.com`

---

### B. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Import repository `bijayalaxmilenka2002/My-Kouch-Website`.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable** in Vercel:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://mykouch-backend.onrender.com` *(your Render backend URL)*
5. Click **Deploy**.
6. Vercel will build and assign a production URL (e.g. `https://my-kouch-website.vercel.app`).
7. *(Optional)* Update `CLIENT_URL` in your Render backend settings to your new Vercel domain to lock down CORS.

---

## 📍 Contact & Showroom Locations

- **Showroom**: MB Maaarketing, AM42, Bhimatangi, Near Amabus Stop, Bhubaneswar, Odisha - 751002
- **Factory**: MB Maaarketing Factory, Plot No-401, Jagannath Bihar, Sunderipada, Bhubaneswar - 751002
- **Direct Phone / WhatsApp**: +91 80933 76990
- **Hours**: Mon – Sun: 10:00 AM – 9:00 PM

---

## 📄 License
Private & Proprietary © 2026 myKouch™ / MB Maaarketing. All rights reserved.
