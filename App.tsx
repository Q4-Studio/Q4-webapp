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
import { getBlogPosts, isSupabaseConfigured } from './lib/supabase';
import { getSeoPageBySlug, resourcesPath } from './data/seoPages';
import { getCaseStudyBySlug, caseStudiesPath } from './data/caseStudies';

const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const NotFound = lazy(() => import('./components/NotFound'));
const Privacy = lazy(() => import('./components/Privacy'));
const AppSupport = lazy(() => import('./components/AppSupport'));
const SeoDirectory = lazy(() => import('./components/SeoDirectory'));
const SeoLandingPage = lazy(() => import('./components/SeoLandingPage'));
const AIAgents = lazy(() => import('./components/AIAgents'));
const CaseStudiesIndex = lazy(() => import('./components/CaseStudiesIndex'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const ServerSideTracking = lazy(() => import('./components/ServerSideTracking'));
const TechnicalPartner = lazy(() => import('./components/TechnicalPartner'));
const MetaAdvertisingB2B = lazy(() => import('./components/MetaAdvertisingB2B'));
const SitesWebAI = lazy(() => import('./components/SitesWebAI'));

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'app-support' | 'directory' | 'seo-page' | 'agenti-ai' | 'tracking' | 'sites' | 'technical-partner' | 'meta-advertising' | 'case-studies' | 'case-study' | '404';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [currentSeoSlug, setCurrentSeoSlug] = useState<string>('');
  const [currentCaseStudySlug, setCurrentCaseStudySlug] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const previousRouteRef = useRef<string | null>(null);

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
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (query.matches) setMobileMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Fetch blog posts from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoadingBlog(false);
      return;
    }

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

  // Route public pages with real paths.
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash.slice(1); // Remove #
      const route = `${path}#${hash}`;

      if (path === '/tracciamento-server-side') {
        setCurrentPage('tracking');
      } else if (path === '/siti-web-ai') {
        setCurrentPage('sites');
      } else if (path === '/partner-tecnico') {
        setCurrentPage('technical-partner');
      } else if (path === '/meta-advertising-b2b') {
        setCurrentPage('meta-advertising');
      } else if (path === '/agenti-ai') {
        setCurrentPage('agenti-ai');
        setCurrentSeoSlug('');
      } else if (path === caseStudiesPath) {
        setCurrentPage('case-studies');
        setCurrentCaseStudySlug('');
      } else if (path.startsWith(`${caseStudiesPath}/`)) {
        const slug = path.replace(`${caseStudiesPath}/`, '');
        if (getCaseStudyBySlug(slug)) {
          setCurrentCaseStudySlug(slug);
          setCurrentPage('case-study');
        } else {
          setCurrentPage('404');
        }
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
      } else if (hash === '404') {
        setCurrentPage('404');
      } else if (path === '/' && (hash === '' || hash === 'home')) {
        setCurrentPage('home');
      } else if (path !== '/') {
        setCurrentPage('404');
      } else {
        setCurrentPage('home');
      }
      // Il fetch del blog aggiorna questo effect per risolvere le rotte degli
      // articoli. Scorriamo in alto solo quando cambia davvero l'URL, altrimenti
      // un aggiornamento dati riporterebbe l'utente in cima mentre legge.
      if (previousRouteRef.current !== route) {
        previousRouteRef.current = route;
        if (path === '/' && hash === 'contatti') {
          const scrollWhenReady = (attemptsLeft: number) => {
            const contactSection = document.getElementById('contatti');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (attemptsLeft > 0) {
              setTimeout(() => scrollWhenReady(attemptsLeft - 1), 100);
            }
          };
          setTimeout(() => scrollWhenReady(20), 100);
        } else {
          window.scrollTo({ top: 0 });
        }
      }
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
    } else if (page === 'tracking') {
      window.history.pushState(null, '', '/tracciamento-server-side');
      setCurrentPage('tracking');
      window.scrollTo({ top: 0 });
    } else if (page === 'sites') {
      window.history.pushState(null, '', '/siti-web-ai');
      setCurrentPage('sites');
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
      const contactForm = document.getElementById('contatti');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (attemptsLeft > 0) {
        setTimeout(() => trySmoothScroll(attemptsLeft - 1), 100);
      }
    };

    if (currentPage !== 'home') {
      window.history.pushState(null, '', '/#contatti');
      setCurrentPage('home');
      setTimeout(() => trySmoothScroll(20), 100);
    } else {
      if (window.location.hash !== '#contatti') {
        window.history.pushState(null, '', '/#contatti');
      }
      trySmoothScroll(20);
    }
  };

  const currentArticle = currentArticleSlug ? getBlogPostBySlug(currentArticleSlug) : null;
  const currentSeoPage = currentSeoSlug ? getSeoPageBySlug(currentSeoSlug) : null;
  const currentCaseStudy = currentCaseStudySlug ? getCaseStudyBySlug(currentCaseStudySlug) : null;

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
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2.5">
          {currentPage !== 'home' && <button onClick={() => navigateTo('home')} className="text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer border-0 bg-transparent text-white/80 hover:bg-white/20 hover:text-white">HOME</button>}
          <button onClick={() => navigateTo('tracking')} className={`text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${currentPage === 'tracking' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'}`}>TRACCIAMENTO</button>
          <button onClick={() => navigateTo('sites')} className={`text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${currentPage === 'sites' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'}`}>SITI</button>
          <button
            onClick={() => navigateTo('agenti-ai')}
              className={`text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${
              currentPage === 'agenti-ai' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            AGENTI AI
          </button>
          {/* Link reale ai casi studio: vale anche come link interno per i crawler */}
          <a
            href={caseStudiesPath}
            className={`text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer ${
              currentPage === 'case-studies' || currentPage === 'case-study' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            CASI STUDIO
          </a>
          <button onClick={() => navigateTo('blog')} className={`text-sm font-medium px-3 py-2.5 rounded-full transition-colors cursor-pointer border-0 ${currentPage === 'blog' || currentPage === 'blog-article' ? 'bg-white text-gray-900' : 'bg-transparent text-white/80 hover:bg-white/20 hover:text-white'}`}>BLOG</button>
        </div>

        <div className="flex items-center gap-3">
          {/* CTA "Contatti": sempre visibile, anche su mobile — prima era
              hidden sotto lg e raggiungibile solo aprendo il menu hamburger. */}
          <a
            href="/#contatti"
            onClick={(event) => { event.preventDefault(); scrollToContact(); }}
            className="inline-flex text-sm md:text-base font-semibold px-4 py-2.5 md:px-7 md:py-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer border-0 whitespace-nowrap"
          >
            Contatti
          </a>

          {/* Hamburger mobile: stessa area del logo, area di tap >= 44x44px */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls={MOBILE_MENU_PANEL_ID}
            className="lg:hidden flex h-11 w-11 items-center justify-center cursor-pointer bg-transparent border-0"
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
        onNavigateHome={() => navigateTo('home')}
        onNavigateAgents={() => navigateTo('agenti-ai')}
        onNavigateBlog={() => navigateTo('blog')}
        onContact={scrollToContact}
        showHomeLink={currentPage !== 'home'}
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

          {currentPage === 'tracking' && (
            <><ServerSideTracking /><ContactForm subject="Audit tracciamento" /><Footer /></>
          )}

          {currentPage === 'sites' && (
            <><SitesWebAI /><ContactForm subject="Sito web AI" headerTitle="Parliamo del tuo prossimo sito." headerDescription="Raccontaci cosa deve fare, per chi e perché adesso." /><Footer /></>
          )}

          {currentPage === 'technical-partner' && <TechnicalPartner />}

          {currentPage === 'meta-advertising' && (
            <><MetaAdvertisingB2B /><Footer /></>
          )}

          {currentPage === 'seo-page' && currentSeoPage && (
            <>
              <SeoLandingPage page={currentSeoPage} />
              <Footer />
            </>
          )}

          {currentPage === 'case-studies' && (
            <>
              <CaseStudiesIndex />
              <Footer />
            </>
          )}

          {currentPage === 'case-study' && currentCaseStudy && (
            <>
              <CaseStudyPage study={currentCaseStudy} />
              <Footer />
            </>
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
