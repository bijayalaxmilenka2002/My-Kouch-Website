import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SofaProvider } from './context/SofaContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomSofaModal from './components/CustomSofaModal';
import EnquiryContactModal from './components/EnquiryContactModal';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import CollectionsPage from './pages/CollectionsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BecomeDealerPage from './pages/BecomeDealerPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOwnerRoute = location.pathname.startsWith('/owner');

  // When someone refreshes the page, redirect to home page
  React.useEffect(() => {
    try {
      const navEntries = window.performance?.getEntriesByType?.('navigation') || [];
      const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
      const isLegacyReload = window.performance?.navigation?.type === 1;

      if ((isReload || isLegacyReload) && !location.pathname.startsWith('/owner') && (location.pathname !== '/' || location.search !== '' || location.hash !== '')) {
        navigate('/', { replace: true });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Classy scroll-triggered reveal observer
  React.useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    });

    const observePending = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      elements.forEach((el) => observer.observe(el));
    };

    observePending();

    // Re-check for dynamically loaded components / images
    const t1 = setTimeout(observePending, 250);
    const t2 = setTimeout(observePending, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {/* Show public header on non-owner routes */}
      {!isOwnerRoute && <Navbar />}

      {/* Global Custom Sofa Builder Modal */}
      <CustomSofaModal />

      {/* Global Enquiry & Contact Modal */}
      <EnquiryContactModal />

      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionsPage />} />
          <Route path="/category/:slug" element={<CollectionsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/become-a-dealer" element={<BecomeDealerPage />} />
          <Route path="/dealer" element={<BecomeDealerPage />} />
          <Route path="/dealers" element={<BecomeDealerPage />} />

          {/* Owner Portal Routes */}
          <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Show public footer on non-owner routes */}
      {!isOwnerRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SofaProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </SofaProvider>
    </AuthProvider>
  );
}
