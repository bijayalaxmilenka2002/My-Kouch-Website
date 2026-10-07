import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = "myKouch™ | Handcrafted Luxury Sofas • Bhubaneswar's Premium Sofa Factory";
const DEFAULT_DESCRIPTION = "myKouch crafts bespoke luxury sofas, premium velvet L-shaped sectionals, 3+1+1 living room suites, and motorized recliners directly at our factory in Bhubaneswar. Custom dimensions, 100+ fabrics, and 10-year warranty.";
const DEFAULT_IMAGE = "https://mykouch.com/assets/sofas/aurum_luxe_tufted_sectional.jpg";
const BASE_URL = "https://mykouch.com";

/**
 * Reusable SEO Manager component for React Router
 * Updates document.title, meta tags, OpenGraph, Twitter cards, canonical link,
 * and page-specific JSON-LD schemas dynamically.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}${location.search}`;

  useEffect(() => {
    // 1. Title
    const formattedTitle = title
      ? `${title} | myKouch™ Bhubaneswar`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to set or update meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
    setMetaTag('property', 'og:site_name', 'myKouch Luxury Sofas');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);

    // 6. JSON-LD Dynamic Schema
    let scriptTag = document.getElementById('route-schema-jsonld');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'route-schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up route-specific schema when component unmounts
      const tag = document.getElementById('route-schema-jsonld');
      if (tag) tag.remove();
    };
  }, [title, description, keywords, image, type, schema, currentUrl]);

  return null;
}
