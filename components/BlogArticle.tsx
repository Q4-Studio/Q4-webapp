import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Calendar, Clock, ArrowLeft, Linkedin } from 'lucide-react';
import { BlogPost } from '../types/blog';
import BlogSchema from './BlogSchema';
import SEOHead from './SEOHead';

interface BlogArticleProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogArticle: React.FC<BlogArticleProps> = ({ post, onBack }) => {
  const articleRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (!articleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out'
      });
    }, articleRef);

    return () => ctx.revert();
  }, [post]);

  // Simple markdown renderer
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ol key={`list-${key++}`} className="list-decimal list-inside space-y-2 mb-6 text-gray-300">
            {currentList.map((item, i) => (
              <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        );
        currentList = [];
      }
    };

    lines.forEach((line, i) => {
      // H1
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${key++}`} className="text-4xl md:text-5xl font-bold mb-6 mt-8">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // H2
      else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${key++}`} className="text-3xl md:text-4xl font-bold mb-4 mt-8 text-indigo-300">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // H3
      else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${key++}`} className="text-2xl font-bold mb-3 mt-6 text-purple-300">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Ordered list
      else if (/^\d+\.\s/.test(line)) {
        const text = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(text);
      }
      // Empty line
      else if (line.trim() === '') {
        flushList();
      }
      // Paragraph
      else if (line.trim() !== '') {
        flushList();
        // Handle bold text **text**
        const html = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        elements.push(
          <p key={`p-${key++}`} className="text-lg text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <article ref={articleRef} className="relative pt-32 pb-20 px-6 bg-[#050505] text-white min-h-screen">
      {/* SEO: Schema.org BlogPosting structured data */}
      <BlogSchema post={post} />

      {/* SEO: Dynamic meta tags */}
      <SEOHead
        title={`${post.title} | Q4 Studio Blog`}
        description={post.excerpt}
        image={post.coverImage}
        url={`https://www.q4.studio/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.date,
          author: post.author.name,
          section: post.category
        }}
      />

      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Torna al Blog</span>
        </button>

        {/* Article Header */}
        <div ref={headerRef}>
          {/* Category Badge */}
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-6">
            <span className="text-indigo-300 text-sm font-medium">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={post.author.image}
                alt={post.author.name}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=96`;
                }}
              />
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} di lettura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>
        </div>

        {/* Article Content */}
        <div ref={contentRef} className="prose prose-invert prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Author CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={post.author.image}
              alt={post.author.name}
              loading="lazy"
              decoding="async"
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=160`;
              }}
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">{post.author.name}</h3>
              <p className="text-gray-400">
                Vuoi approfondire queste strategie per il tuo business? Contattaci per una consulenza personalizzata.
              </p>
            </div>
            <button
              onClick={() => {
                window.location.hash = 'home';
                setTimeout(() => {
                  const contactForm = document.querySelector('section:has(form)');
                  contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300 whitespace-nowrap"
            >
              Contattaci
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticle;
