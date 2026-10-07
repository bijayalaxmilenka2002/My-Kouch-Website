import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures user scrolls to top of page on route transition,
 * unless navigating to an explicit #anchor hash.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [pathname, hash]);

  return null;
}
