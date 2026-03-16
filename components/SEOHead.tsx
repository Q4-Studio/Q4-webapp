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

/**
 * Component to dynamically update meta tags for SEO
 * Use this component to set page-specific SEO meta tags
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Q4 Studio | B2B Lead Generation e Agenti AI | Meta Advertising Specialist',
  description = 'Specialisti in Lead Generation B2B su Meta (Facebook & Instagram) e Agenti AI personalizzati. Aumenta i contatti qualificati e automatizza i processi del tuo business con l\'algoritmo Andromeda di Meta.',
  image = 'https://q4studio.it/og-image.jpg',
  url = 'https://q4studio.it/',
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
