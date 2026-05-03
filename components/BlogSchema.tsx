import React, { useEffect } from 'react';
import { BlogPost } from '../types/blog';

interface BlogSchemaProps {
  post: BlogPost;
}

/**
 * Component that injects Schema.org BlogPosting structured data
 * for individual blog articles to improve SEO
 */
const BlogSchema: React.FC<BlogSchemaProps> = ({ post }) => {
  useEffect(() => {
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
        "image": post.author.image
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
        "meta advertising",
        "lead generation",
        "b2b marketing",
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
