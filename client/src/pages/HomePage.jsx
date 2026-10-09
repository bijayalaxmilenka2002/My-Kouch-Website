import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import TopSellingSection from '../components/TopSellingSection';
import NewArrivalsSection from '../components/NewArrivalsSection';
import OfferBanner from '../components/OfferBanner';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import AboutSection from '../components/AboutSection';
import { getProducts, getActiveOffer, getTestimonials } from '../services/api';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

export default function HomePage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [activeOffer, setActiveOffer] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, offerRes, testRes] = await Promise.all([
          getProducts({ isActive: 'true' }).catch(() => null),
          getActiveOffer().catch(() => ({ offer: null })),
          getTestimonials().catch(() => ({ testimonials: [] })),
        ]);

        if (prodRes?.products && prodRes.products.length > 0) {
          setProducts(prodRes.products);
        } else {
          try {
            const localCustomRaw = localStorage.getItem('mykouch_custom_products');
            if (localCustomRaw) {
              const localCustom = JSON.parse(localCustomRaw);
              if (Array.isArray(localCustom) && localCustom.length > 0) {
                setProducts(localCustom.filter((p) => p.isActive !== false));
              }
            }
          } catch (e) {
            // ignore
          }
        }
        if (offerRes?.offer) {
          setActiveOffer(offerRes.offer);
        }
        if (testRes?.testimonials) {
          setTestimonials(testRes.testimonials);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const location = useLocation();

  // Smooth auto-scroll to #offers when URL has #offers
  useEffect(() => {
    if (location.hash === '#offers' || window.location.hash === '#offers') {
      const scrollToOffers = () => {
        const el = document.getElementById('offers');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      scrollToOffers();
      const t1 = setTimeout(scrollToOffers, 150);
      const t2 = setTimeout(scrollToOffers, 500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [location.hash, location.pathname, activeOffer]);

  return (
    <div>
      <SEO
        title="Handcrafted Luxury Sofas • Bhubaneswar's Premium Sofa Factory"
        description="myKouch crafts bespoke luxury sofas, velvet L-shaped sectionals, 3+1+1 living room suites, and motorized recliners directly at our factory in Bhubaneswar. Custom dimensions, 100+ fabrics, and 10-year Sal wood warranty."
      />
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Sofa Category Discovery */}
      <CategorySection />

      {/* 3. Top Selling Products Carousel */}
      <TopSellingSection products={products} loading={loading} />

      {/* 4. Owner Managed New Arrivals Section */}
      <NewArrivalsSection products={products} loading={loading} />

      {/* 5. The Sofa Buying Journey / Process (How To Get Your Dream Sofa) */}
      <HowItWorks />

      {/* 6. Owner Managed Active Offer Banner */}
      <OfferBanner offer={activeOffer} />

      {/* 7. Craftsmanship & Brand Story */}
      <AboutSection />

      {/* 8. Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}
