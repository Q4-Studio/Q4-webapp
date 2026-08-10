import React, { useEffect } from 'react';
import { BlogPost } from '../types/blog';

interface BlogSchemaProps {
  post: BlogPost;
}

// Dati aggiuntivi per il Person schema, per autore noto. Solo dati reali e
// verificabili (nessun profilo personale inventato) — se un autore non è in
// questa mappa, il Person schema resta senza jobTitle/sameAs invece di
// fabbricare un link.
const AUTHOR_INFO: Record<string, { jobTitle: string; sameAs: string[] }> = {
  'Sebastiano Riva': {
    jobTitle: 'Fondatore, Q4 Studio',
    sameAs: ['https://www.linkedin.com/company/q4studio/about/'],
  },
};

/**
 * Component that injects Schema.org BlogPosting structured data
 * for individual blog articles to improve SEO
 */
const BlogSchema: React.FC<BlogSchemaProps> = ({ post }) => {
  useEffect(() => {
    // Le pagine prerenderizzate (scripts/prerender.ts → generateBlogArticleHtml)
    // scrivono già un BlogPosting nello <head> statico per gli articoli noti a
    // build time. Se questo componente iniettasse comunque il suo, la pagina
    // finirebbe con due schema BlogPosting dopo l'hydration. Controlliamo prima
    // se ce n'è già uno server-rendered per questo articolo.
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    const alreadyPresent = Array.from(existingSchemas).some((script) => {
      try {
        const parsed = JSON.parse(script.textContent || '');
        return parsed['@type'] === 'BlogPosting';
      } catch {
        return false;
      }
    });
    if (alreadyPresent) return;

    // Create schema script element
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.coverImage,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Person",
        "name": post.author.name,
        "image": post.author.image,
        ...(AUTHOR_INFO[post.author.name] || {})
      },
      "publisher": {
        "@type": "Organization",
        "name": "Q4 Studio",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.q4.studio/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.q4.studio/blog/${post.slug}`
      },
      "articleSection": post.category,
      "keywords": [
        "tracciamento server-side",
        "automazioni ai",
        "agenti ai",
        post.category.toLowerCase()
      ],
      "inLanguage": "it-IT",
      "timeRequired": post.readTime
    };

    // Create and inject script tag
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(schema);
    scriptTag.id = `blog-schema-${post.slug}`;

    // Add to head
    document.head.appendChild(scriptTag);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(`blog-schema-${post.slug}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [post]);

  // This component doesn't render anything visible
  return null;
};

export default BlogSchema;
