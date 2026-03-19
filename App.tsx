import React, { lazy, Suspense, useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Team from './components/Team';
import Marquee from './components/Marquee';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import CookieBanner from './components/CookieBanner';
import SEOHead from './components/SEOHead';
import HomeSeoContent from './components/HomeSeoContent';
import { BlogPost } from './types/blog';
import { getBlogPosts } from './lib/supabase';

const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const NotFound = lazy(() => import('./components/NotFound'));
const DashboardLogin = lazy(() => import('./components/DashboardLogin'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Privacy = lazy(() => import('./components/Privacy'));
const AppSupport = lazy(() => import('./components/AppSupport'));

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'dashq4login' | 'dashboard' | 'app-support' | '404';

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
      } else if (hash === 'app-support') {
        setCurrentPage('app-support');
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
      {currentPage === 'app-support' && (
        <SEOHead
          title="Supporto App Q4 CRM"
          description="Pagina di supporto per l'app Q4 CRM. Contattaci per assistenza."
          noIndex={true}
        />
      )}
      {/* Navbar overlay - simplified for immersive feel */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <img
          src="/logo.webp"
          alt="Q4 Studio"
          width={130}
          height={40}
          loading="eager"
          fetchPriority="high"
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
          <SEOHead
            title="Q4 Studio | B2B Lead Generation & Agenti AI"
            description="Specialisti in Lead Generation B2B su Meta Ads e Agenti AI personalizzati. Aumenta i contatti qualificati e automatizza i processi con l'algoritmo Andromeda."
            url="https://q4.studio/"
          />
          <section className="sr-only">
            <h1>Agenzia di B2B Lead Generation su Meta Ads e Agenti AI Personalizzati</h1>
          </section>
          <Hero />
          <ValueProposition />
          <Services />
          <HowItWorks />
          <Team />
          <Marquee />
          <HomeSeoContent />
          <ContactForm />
          <Footer />
        </>
      )}

      <Suspense fallback={null}>
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

        {currentPage === 'app-support' && (
          <>
            <AppSupport />
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
      </Suspense>

    </main>
  );
};

export default App;
