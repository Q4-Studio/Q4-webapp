import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
  };
}

// Immagine di default e relativi metadati dichiarati staticamente in index.html.
// Quando SEOHead riceve un'altra immagine (es. la copertina di un articolo) non
// possiamo conoscerne le dimensioni reali lato client: meglio rimuovere questi
// tag piuttosto che lasciare quelli, sbagliati, dell'immagine di default.
const DEFAULT_OG_IMAGE = 'https://www.q4.studio/og-image.jpg';
const DEFAULT_OG_IMAGE_WIDTH = '1200';
const DEFAULT_OG_IMAGE_HEIGHT = '630';
const DEFAULT_OG_IMAGE_TYPE = 'image/jpeg';
const DEFAULT_OG_IMAGE_ALT = 'Q4 Studio — Il tuo AI Marketing Partner';

/**
 * Component to dynamically update meta tags for SEO
 * Use this component to set page-specific SEO meta tags
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Q4 Studio | AI Marketing Partner per PMI B2B',
  description = 'Studio di consulenza per crescita B2B: AI applicata al marketing, lead generation automatizzata e agenti AI che alleggeriscono i processi aziendali.',
  image = DEFAULT_OG_IMAGE,
  url = 'https://www.q4.studio/',
  type = 'website',
  noIndex = false,
  article
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Remove a meta tag entirely (used when a value would otherwise be false/stale)
    const removeMetaTag = (property: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      document.querySelector(`meta[${attribute}="${property}"]`)?.remove();
    };

    // Update robots meta tag
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('title', title);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // og:image:width/height/type/alt sono dichiarati in index.html per l'immagine
    // di default. Se l'immagine cambia (es. copertina di un articolo), quei
    // valori non sono più veri: li aggiorniamo solo quando torniamo all'immagine
    // di default, altrimenti li rimuoviamo (dimensioni/tipo reali non noti lato
    // client) e usiamo il title come alt, più sensato del generico "Q4 Studio".
    if (image === DEFAULT_OG_IMAGE) {
      updateMetaTag('og:image:width', DEFAULT_OG_IMAGE_WIDTH, true);
      updateMetaTag('og:image:height', DEFAULT_OG_IMAGE_HEIGHT, true);
      updateMetaTag('og:image:type', DEFAULT_OG_IMAGE_TYPE, true);
      updateMetaTag('og:image:alt', DEFAULT_OG_IMAGE_ALT, true);
    } else {
      removeMetaTag('og:image:width', true);
      removeMetaTag('og:image:height', true);
      removeMetaTag('og:image:type', true);
      updateMetaTag('og:image:alt', title, true);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', url);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // If article, add article-specific meta tags
    if (type === 'article' && article) {
      if (article.publishedTime) {
        updateMetaTag('article:published_time', article.publishedTime, true);
      }
      if (article.author) {
        updateMetaTag('article:author', article.author, true);
      }
      if (article.section) {
        updateMetaTag('article:section', article.section, true);
      }
    }
  }, [title, description, image, url, type, noIndex, article]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
