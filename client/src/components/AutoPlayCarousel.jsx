import React, { useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LuxuryImageCard from './LuxuryImageCard';

export default function AutoPlayCarousel({
  products = [],
  loading = false,
  emptyMessage = 'Loading handcrafted sofa designs...',
  ariaLabel = 'Continuous Sofa Carousel',
}) {
  // Ensure every single item has a 100% unique image (no repeated images anywhere)
  const uniqueList = useMemo(() => {
    if (!products || products.length === 0) return [];
    const seenImages = new Set();
    const result = [];

    for (const p of products) {
      const imgKey = p.images && p.images[0] ? p.images[0] : p._id;
      if (!seenImages.has(imgKey)) {
        seenImages.add(imgKey);
        result.push(p);
      }
    }
    return result;
  }, [products]);

  const containerRef = useRef(null);
  const accumulatedScroll = useRef(0);
  const isPausedRef = useRef(false);
  const userInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  // Smooth continuous autoplay via requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current;
    if (!container || uniqueList.length === 0) return;

    let animId;
    const speed = 0.8; // Smooth luxury drift speed (pixels per frame)

    const step = () => {
      if (!isPausedRef.current && !userInteractingRef.current) {
        accumulatedScroll.current += speed;

        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll > 5) {
          // When reaching the end of the unique list, loop back seamlessly to start
          if (accumulatedScroll.current >= maxScroll) {
            accumulatedScroll.current = 0;
            container.scrollLeft = 0;
          } else {
            container.scrollLeft = accumulatedScroll.current;
          }
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [uniqueList]);

  // Pause when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        isPausedRef.current = true;
      } else {
        isPausedRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Sync scroll position on manual user scroll
  const handleScroll = () => {
    if (userInteractingRef.current && containerRef.current) {
      accumulatedScroll.current = containerRef.current.scrollLeft;
    }
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    if (containerRef.current) {
      accumulatedScroll.current = containerRef.current.scrollLeft;
    }
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
    userInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    userInteractingRef.current = false;
    if (containerRef.current) {
      accumulatedScroll.current = containerRef.current.scrollLeft;
    }
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 1200);
  };

  // Next Button: Smooth step forward
  const handleNext = () => {
    if (!containerRef.current) return;
    const slide = containerRef.current.querySelector('.carousel-slide');
    const step = slide ? slide.offsetWidth + 24 : 364;

    const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    if (containerRef.current.scrollLeft >= maxScroll - 5) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      accumulatedScroll.current = 0;
    } else {
      containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
      accumulatedScroll.current = containerRef.current.scrollLeft + step;
    }
  };

  // Prev Button: Smooth step backward
  const handlePrev = () => {
    if (!containerRef.current) return;
    const slide = containerRef.current.querySelector('.carousel-slide');
    const step = slide ? slide.offsetWidth + 24 : 364;

    if (containerRef.current.scrollLeft <= 5) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      containerRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      accumulatedScroll.current = maxScroll;
    } else {
      containerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
      accumulatedScroll.current = containerRef.current.scrollLeft - step;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        {emptyMessage}
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={ariaLabel}
    >
      <div className="carousel-wrapper">
        <button
          onClick={handlePrev}
          className="carousel-nav-btn prev"
          aria-label="Previous Sofa"
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
          onClick={handleNext}
          className="carousel-nav-btn next"
          aria-label="Next Sofa"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
