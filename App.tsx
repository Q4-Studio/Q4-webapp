import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Marquee from './components/Marquee';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import CookieBanner from './components/CookieBanner';
import SEOHead from './components/SEOHead';
import HomeV2 from './components/home2/HomeV2';
import MobileMenu, { MOBILE_MENU_PANEL_ID } from './components/MobileMenu';
import { BlogPost } from './types/blog';
import { getBlogPosts } from './lib/supabase';
import { getSeoPageBySlug, resourcesPath } from './data/seoPages';

const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const NotFound = lazy(() => import('./components/NotFound'));
const DashboardLogin = lazy(() => import('./components/DashboardLogin'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Privacy = lazy(() => import('./components/Privacy'));
const AppSupport = lazy(() => import('./components/AppSupport'));
const SeoDirectory = lazy(() => import('./components/SeoDirectory'));
const SeoLandingPage = lazy(() => import('./components/SeoLandingPage'));
const AIAgents = lazy(() => import('./components/AIAgents'));

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'dashq4login' | 'dashboard' | 'app-support' | 'directory' | 'seo-page' | 'agenti-ai' | '404';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [currentSeoSlug, setCurrentSeoSlug] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Chiude il menu e riporta il focus sull'hamburger che lo aveva aperto:
  // senza questo, con tastiera/screen reader il focus si perde in cima al
  // documento (di solito sul <body>) invece di restare su un elemento noto.
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    hamburgerButtonRef.current?.focus();
  };

  // Chiude il menu mobile quando cambia pagina o quando il viewport supera md
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (query.matches) setMobileMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

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

  // Route public pages with real paths; keep hash routes only for legacy dashboard UI.
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash.slice(1); // Remove #

      if (path === '/agenti-ai') {
        setCurrentPage('agenti-ai');
        setCurrentSeoSlug('');
      } else if (path === '/directory') {
        setCurrentPage('directory');
        setCurrentSeoSlug('');
      } else if (path === resourcesPath) {
        setCurrentPage('directory');
        setCurrentSeoSlug('');
      } else if (path.startsWith(`${resourcesPath}/`) || path.startsWith('/seo/')) {
        const slug = path.startsWith(`${resourcesPath}/`)
          ? path.replace(`${resourcesPath}/`, '')
          : path.replace('/seo/', '');
        if (getSeoPageBySlug(slug)) {
          setCurrentSeoSlug(slug);
          setCurrentPage('seo-page');
        } else {
          setCurrentPage('404');
        }
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
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
      } else if (path === '/blog') {
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
      } else if (path === '/' && (hash === '' || hash === 'home')) {
        setCurrentPage('home');
      } else if (path !== '/') {
        setCurrentPage('404');
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0 });
    };

    handleRouteChange(); // Initial load
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [blogPosts, isLoadingBlog]);

  const navigateTo = (page: Page, slug?: string) => {
    if (page === 'blog-article' && slug) {
      window.history.pushState(null, '', `/blog/${slug}`);
      setCurrentArticleSlug(slug);
      setCurrentPage('blog-article');
      window.scrollTo({ top: 0 });
    } else if (page === 'blog') {
      window.history.pushState(null, '', '/blog');
      setCurrentPage('blog');
      window.scrollTo({ top: 0 });
    } else if (page === 'home') {
      window.history.pushState(null, '', '/');
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'agenti-ai') {
      window.history.pushState(null, '', '/agenti-ai');
      setCurrentPage('agenti-ai');
      window.scrollTo({ top: 0 });
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = page;
    }
  };

  // Scrolla alla sezione del form contatti. Se non siamo in home, naviga prima
  // lì e poi attende (con qualche retry) che la sezione sia nel DOM prima di
  // scrollare: un singolo setTimeout(100ms) può scattare prima che HomeV2
  // abbia finito di montarsi, perdendo lo scroll.
  const scrollToContact = () => {
    const trySmoothScroll = (attemptsLeft: number) => {
      const contactForm = document.querySelector('section:has(form)');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (attemptsLeft > 0) {
        setTimeout(() => trySmoothScroll(attemptsLeft - 1), 100);
      }
    };

    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => trySmoothScroll(20), 100);
    } else {
      trySmoothScroll(20);
    }
  };

  const currentArticle = currentArticleSlug ? getBlogPostBySlug(currentArticleSlug) : null;
  const currentSeoPage = currentSeoSlug ? getSeoPageBySlug(currentSeoSlug) : null;

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
      {/* Navbar overlay - simplified for immersive feel. Sempre "fixed": su
          mobile prima non lo era (si perdeva scrollando), ma ora che esiste
          un menu da raggiungere da ovunque deve restare ancorata come su desktop.
          Niente più mix-blend-difference: logo/voci hanno ora sfondi propri
          (pillola) e su blend-difference risulterebbero con colori sbagliati.
          Tutte le pagine sono a fondo scuro, quindi restano leggibili anche senza. */}
      <nav className="fixed top-0 left-0 w-full z-[70] p-6 sm:p-7 flex justify-between items-center">
        <img
          src="/logo.webp"
          alt="Q4 Studio"
          width={130}
          height={40}
          loading="eager"
          fetchPriority="high"
          className="h-10 md:h-14 w-auto cursor-pointer"
          onClick={() => navigateTo('home')}
        />

        {/* Pillola centrale flottante con le voci di menu (solo desktop), centrata
            in assoluto sulla nav indipendentemente dalla larghezza di logo/CTA */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2.5">
          <button
            onClick={() => navigateTo('agenti-ai')}
            className={`text-base font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${
              currentPage === 'agenti-ai' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            AGENTI AI
          </button>
          <button
            onClick={() => navigateTo('blog')}
            className={`text-base font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${
              currentPage === 'blog' || currentPage === 'blog-article' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            BLOG
          </button>
          {/* Link reale all'hub risorse: vale anche come link interno per i crawler */}
          <a
            href={resourcesPath}
            className={`text-base font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer ${
              currentPage === 'directory' || currentPage === 'seo-page' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            RISORSE
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* CTA "Scrivici": pillola bianca piena, visibile da md in su */}
          <button
            onClick={scrollToContact}
            className="hidden md:inline-flex text-base font-semibold px-7 py-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer border-0"
          >
            Scrivici
          </button>

          {/* Hamburger mobile: stessa area del logo, area di tap >= 44x44px */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls={MOBILE_MENU_PANEL_ID}
            className="md:hidden flex h-11 w-11 items-center justify-center cursor-pointer bg-transparent border-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Pannello del menu mobile: reso FUORI dalla <nav> (che ora non usa più
          mix-blend-difference, ma manteniamo comunque la separazione strutturale). */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onNavigateAgents={() => navigateTo('agenti-ai')}
        onNavigateBlog={() => navigateTo('blog')}
        onContact={scrollToContact}
      />

      {/* Mentre il menu mobile è aperto, il resto dell'app (cursore custom,
          cookie banner, contenuto di pagina) viene reso `inert`: non è più
          raggiungibile da tastiera/screen reader, anche se resta visibile
          sotto il pannello. La <nav> resta fuori da questo wrapper perché
          l'hamburger, che serve a chiudere il menu, deve restare cliccabile. */}
      <div inert={mobileMenuOpen}>
        <CustomCursor />
        <CookieBanner />

        {/* Page Routing */}
        {currentPage === 'home' && <HomeV2 />}

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

          {currentPage === 'directory' && (
            <>
              <SeoDirectory />
              <Footer />
            </>
          )}

          {currentPage === 'agenti-ai' && (
            <>
              <AIAgents />
              <Marquee />
              <ContactForm />
              <Footer />
            </>
          )}

          {currentPage === 'seo-page' && currentSeoPage && (
            <>
              <SeoLandingPage page={currentSeoPage} />
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
      </div>

    </main>
  );
};

export default App;
