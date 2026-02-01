import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import Services from './components/Services';
import Team from './components/Team';
import Marquee from './components/Marquee';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Blog from './components/Blog';
import BlogArticle from './components/BlogArticle';
import NotFound from './components/NotFound';
import DashboardLogin from './components/DashboardLogin';
import Dashboard from './components/Dashboard';
import Privacy from './components/Privacy';
import CookieBanner from './components/CookieBanner';
import { BlogPost } from './types/blog';
import { getBlogPosts } from './lib/supabase';

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'dashq4login' | 'dashboard' | '404';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  // Fetch blog posts from Supabase on mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoadingBlog(true);
        setBlogError(null);
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        setBlogError('Impossibile caricare gli articoli del blog. Riprova più tardi.');
      } finally {
        setIsLoadingBlog(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Get blog post by slug
  const getBlogPostBySlug = (slug: string) => {
    return blogPosts.find(post => post.slug === slug);
  };

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #

      if (hash.startsWith('blog/')) {
        const slug = hash.replace('blog/', '');
        const post = getBlogPostBySlug(slug);
        if (post) {
          setCurrentArticleSlug(slug);
          setCurrentPage('blog-article');
        } else {
          // Only set 404 if we've finished loading posts
          if (!isLoadingBlog) {
            setCurrentPage('404');
          }
        }
      } else if (hash === 'blog') {
        setCurrentPage('blog');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'dashq4login') {
        setCurrentPage('dashq4login');
      } else if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === '404') {
        setCurrentPage('404');
      } else if (hash === '' || hash === 'home') {
        setCurrentPage('home');
      } else {
        setCurrentPage('404');
      }
      window.scrollTo({ top: 0 });
    };

    handleHashChange(); // Initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [blogPosts, isLoadingBlog]);

  const navigateTo = (page: Page, slug?: string) => {
    if (page === 'blog-article' && slug) {
      window.location.hash = `blog/${slug}`;
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }
  };

  const currentArticle = currentArticleSlug ? getBlogPostBySlug(currentArticleSlug) : null;

  return (
    <main className="w-full min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white cursor-none">
      <SpeedInsights />
      {/* Navbar overlay - simplified for immersive feel */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <img
          src="/logo.png"
          alt="Q4 Studio"
          className="h-8 md:h-10 w-auto cursor-pointer"
          onClick={() => navigateTo('home')}
        />
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigateTo('blog')}
            className="text-sm font-mono hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-0"
          >
            BLOG
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'home') {
                navigateTo('home');
                setTimeout(() => {
                  const contactForm = document.querySelector('section:has(form)');
                  contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              } else {
                const contactForm = document.querySelector('section:has(form)');
                contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="text-sm font-mono hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-0"
          >
            CONTATTACI
          </button>
        </div>
      </nav>

      <CustomCursor />
      <CookieBanner />

      {/* Page Routing */}
      {currentPage === 'home' && (
        <>
          <Hero />
          <ValueProposition />
          <Services />
          <Team />
          <Marquee />
          <ContactForm />
          <Footer />
        </>
      )}

      {currentPage === 'blog' && (
        <>
          <Blog
            posts={blogPosts}
            isLoading={isLoadingBlog}
            error={blogError}
            onArticleClick={(slug) => navigateTo('blog-article', slug)}
          />
          <Footer />
        </>
      )}

      {currentPage === 'blog-article' && currentArticle && (
        <>
          <BlogArticle
            post={currentArticle}
            onBack={() => navigateTo('blog')}
          />
          <Footer />
        </>
      )}

      {currentPage === 'privacy' && (
        <>
          <Privacy />
          <Footer />
        </>
      )}

      {currentPage === 'dashq4login' && (
        <DashboardLogin
          onLoginSuccess={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onLogout={() => navigateTo('dashq4login')}
        />
      )}

      {currentPage === '404' && (
        <NotFound />
      )}

    </main>
  );
};

export default App;
