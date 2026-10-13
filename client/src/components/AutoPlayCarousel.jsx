import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LuxuryImageCard from './LuxuryImageCard';

export default function AutoPlayCarousel({
  products = [],
  loading = false,
  emptyMessage = 'Loading handcrafted sofa designs...',
  intervalTime = 3200,
  ariaLabel = 'Top Selling Products Carousel',
}) {
  const containerRef = useRef(null);
  const isPausedRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const timerRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Ensure every item has a unique image/id
  const uniqueList = useMemo(() => {
    if (!products || products.length === 0) return [];
    const seen = new Set();
    const result = [];

    for (const p of products) {
      const key = p.images && p.images[0] ? p.images[0] : (p._id || p.slug);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(p);
      }
    }
    return result;
  }, [products]);

  // Smooth slide step forward
  const advanceSlide = useCallback(() => {
    const container = containerRef.current;
    if (!container || isPausedRef.current) return;

    const slide = container.querySelector('.carousel-slide');
    const step = slide ? slide.offsetWidth + 24 : 364;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (maxScroll <= 10) return; // All cards fit in viewport

    isAutoScrollingRef.current = true;
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 700);

    if (container.scrollLeft >= maxScroll - 25) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  }, []);

  // Timer controls
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      advanceSlide();
    }, intervalTime);
  }, [advanceSlide, intervalTime]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start autoplay on mount / when products load
  useEffect(() => {
    if (uniqueList.length <= 1) return;

    isPausedRef.current = false;
    startTimer();

    return () => {
      pauseTimer();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [uniqueList, startTimer, pauseTimer]);

  // Pause when browser tab is hidden to save battery & prevent queueing
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        pauseTimer();
      } else {
        isPausedRef.current = false;
        startTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [startTimer, pauseTimer]);

  // Temporarily pause on manual touch / scroll and resume after pause
  const handleUserActivity = () => {
    isPausedRef.current = true;
    pauseTimer();

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
      startTimer();
    }, 2800);
  };

  const handleScroll = () => {
    if (!isAutoScrollingRef.current) {
      handleUserActivity();
    }
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    pauseTimer();
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    startTimer();
  };

  const handleNext = () => {
    handleUserActivity();
    const container = containerRef.current;
    if (!container) return;
    const slide = container.querySelector('.carousel-slide');
    const step = slide ? slide.offsetWidth + 24 : 364;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScroll - 25) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    handleUserActivity();
    const container = containerRef.current;
    if (!container) return;
    const slide = container.querySelector('.carousel-slide');
    const step = slide ? slide.offsetWidth + 24 : 364;

    if (container.scrollLeft <= 25) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  if (loading && uniqueList.length === 0) {
    return (
      <div className="carousel-skeleton-wrap" style={{ display: 'flex', gap: '1.5rem', overflow: 'hidden', padding: '1rem 0' }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 320px',
              height: '380px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(90deg, #F5EFE6 0%, #EFE8DD 50%, #F5EFE6 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (uniqueList.length === 0) {
    return null;
  }

  return (
    <div
      className="autoplay-carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleUserActivity}
      onTouchEnd={handleUserActivity}
      onWheel={handleUserActivity}
      aria-label={ariaLabel}
    >
      <div className="carousel-wrapper">
        <button
          type="button"
          onClick={handlePrev}
          className="carousel-nav-btn prev"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <div
          className="carousel-track-container"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className="carousel-track">
            {uniqueList.map((product) => (
              <div
                key={product._id || product.slug}
                className="carousel-slide"
              >
                <LuxuryImageCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="carousel-nav-btn next"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
