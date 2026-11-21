import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import CookieBanner from './components/CookieBanner';
import LazyPageErrorBoundary from './components/LazyPageErrorBoundary';
import SEOHead from './components/SEOHead';
import HomeV2 from './components/home2/HomeV2';
import MobileMenu, { MOBILE_MENU_PANEL_ID } from './components/MobileMenu';
import { BlogPost } from './types/blog';
import { getBlogPosts, isSupabaseConfigured } from './lib/supabase';
import { getSeoPageBySlug, resourcesPath } from './data/seoPages';
import { getCaseStudyBySlug, caseStudiesPath } from './data/caseStudies';
import { captureAttribution } from './utils/attribution';
import { trackCtaClick } from './utils/dataLayer';

const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const NotFound = lazy(() => import('./components/NotFound'));
const Privacy = lazy(() => import('./components/Privacy'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
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

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'about' | 'contact' | 'app-support' | 'directory' | 'seo-page' | 'agenti-ai' | 'tracking' | 'sites' | 'technical-partner' | 'meta-advertising' | 'case-studies' | 'case-study' | '404';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [currentSeoSlug, setCurrentSeoSlug] = useState<string>('');
  const [currentCaseStudySlug, setCurrentCaseStudySlug] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // La nav è sempre chiara (pillola bianca, voci scure). Cambia solo ciò che
  // sta fuori dalla pillola: sopra l'hero scuro della home e sulle pagine
  // ancora scure logo, hamburger e "Contatti" sono bianchi; scorrendo oltre
  // l'hero della home diventano neri, perché sotto c'è il fondo bianco. Idem
  // con il menu mobile aperto: il pannello è bianco e sta sotto la nav.
  const [navOnLight, setNavOnLight] = useState(false);
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

  // Cattura UTM/click id/landing page/referrer per il contact form (vedi utils/attribution.ts).
  useEffect(() => {
    captureAttribution();
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
      } else if (path === '/about') {
        // Pagine "trust anchor" servite anche come HTML statico prerenderato:
        // qui gestiamo solo la navigazione client-side (pushState).
        setCurrentPage('about');
      } else if (path === '/contact') {
        setCurrentPage('contact');
      } else if (path === '/privacy') {
        setCurrentPage('privacy');
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

  useEffect(() => {
    if (currentPage !== 'home') {
      setNavOnLight(false);
      return;
    }
    const update = () => {
      const hero = document.getElementById('hero');
      const threshold = hero ? hero.offsetHeight - 80 : window.innerHeight - 80;
      setNavOnLight(window.scrollY > threshold);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [currentPage]);

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

  const handleContactCtaClick = (location: string, label: string) => {
    trackCtaClick({ cta_location: location, cta_label: label, cta_destination: '#contatti' });
    scrollToContact();
  };

  const currentArticle = currentArticleSlug ? getBlogPostBySlug(currentArticleSlug) : null;
  const currentSeoPage = currentSeoSlug ? getSeoPageBySlug(currentSeoSlug) : null;
  const currentCaseStudy = currentCaseStudySlug ? getCaseStudyBySlug(currentCaseStudySlug) : null;

  const navItemClass = (active: boolean) =>
    `text-[15px] font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer border-0 whitespace-nowrap ${
      active ? 'bg-[#0a0a0a] text-white' : 'bg-transparent text-gray-700 hover:bg-black/5 hover:text-[#0a0a0a]'
    }`;

  const navItems: Array<{ label: string; active: boolean; href?: string; onClick?: () => void }> = [
    ...(currentPage !== 'home' ? [{ label: 'Home', active: false, onClick: () => navigateTo('home') }] : []),
    { label: 'Tracciamento', active: currentPage === 'tracking', onClick: () => navigateTo('tracking') },
    { label: 'Siti web', active: currentPage === 'sites', onClick: () => navigateTo('sites') },
    { label: 'Agenti AI', active: currentPage === 'agenti-ai', onClick: () => navigateTo('agenti-ai') },
    // Link reale ai casi studio: vale anche come link interno per i crawler
    { label: 'Casi studio', active: currentPage === 'case-studies' || currentPage === 'case-study', href: caseStudiesPath },
    { label: 'Blog', active: currentPage === 'blog' || currentPage === 'blog-article', onClick: () => navigateTo('blog') },
  ];

  return (
    <main className="w-full min-h-screen bg-white text-white selection:bg-purple-600 selection:text-white cursor-none">
      <SpeedInsights />
      {currentPage === 'app-support' && (
        <SEOHead
          title="Supporto App Q4 CRM"
          description="Pagina di supporto per l'app Q4 CRM. Contattaci per assistenza."
          noIndex={true}
        />
      )}
      {/* Navbar fissa e chiara su tutte le pagine: pillola bianca con voci
          scure. Logo, hamburger e "Contatti" seguono `navOnLight`: bianchi
          sopra l'hero scuro della home e sulle pagine ancora scure, neri una
          volta superato l'hero della home (sotto c'è il bianco). */}
      <nav className="fixed top-0 left-0 w-full z-[70] p-6 sm:p-7 flex justify-between items-center">
        <img
          src="/logo.webp"
          alt="Q4 Studio"
          width={130}
          height={40}
          loading="eager"
          fetchPriority="high"
          className={`h-10 md:h-12 w-auto cursor-pointer transition-[filter] duration-300 ${navOnLight || mobileMenuOpen ? 'brightness-0' : ''}`}
          onClick={() => navigateTo('home')}
        />

        {/* Pillola centrale chiara con le voci di menu (solo desktop), centrata
            in assoluto sulla nav indipendentemente dalla larghezza di logo/CTA */}
        <div className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border bg-white/90 backdrop-blur-md px-2.5 py-2 transition-shadow duration-300 ${navOnLight ? 'border-black/10 shadow-[0_10px_40px_-20px_rgba(10,10,10,0.35)]' : 'border-white/40'}`}>
          {navItems.map((item) =>
            item.href ? (
              <a key={item.label} href={item.href} className={navItemClass(item.active)}>
                {item.label}
              </a>
            ) : (
              <button key={item.label} type="button" onClick={item.onClick} className={navItemClass(item.active)}>
                {item.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* CTA "Contatti": sempre visibile, anche su mobile. */}
          <a
            href="/#contatti"
            onClick={(event) => { event.preventDefault(); handleContactCtaClick('header_nav', 'Contatti'); }}
            className={`inline-flex text-sm md:text-base font-semibold px-4 py-2.5 md:px-6 md:py-3 rounded-full transition-colors duration-300 cursor-pointer border-0 whitespace-nowrap ${navOnLight || mobileMenuOpen ? 'bg-[#0a0a0a] text-white hover:bg-purple-700' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
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
            className={`lg:hidden flex h-11 w-11 items-center justify-center cursor-pointer bg-transparent border-0 transition-colors duration-300 ${navOnLight || mobileMenuOpen ? 'text-[#0a0a0a]' : 'text-white'}`}
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
        onContact={() => handleContactCtaClick('mobile_menu', 'Contatti')}
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

        <LazyPageErrorBoundary>
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

          {currentPage === 'about' && (
            <>
              <AboutPage />
              <Footer />
            </>
          )}

          {currentPage === 'contact' && (
            <>
              <ContactPage />
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
            <div className="home-light relative w-full">
              <AIAgents />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'tracking' && (
            <div className="home-light relative w-full">
              <ServerSideTracking />
              <ContactForm subject="Audit tracciamento" showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'sites' && (
            <div className="home-light relative w-full">
              <SitesWebAI />
              <ContactForm subject="Sito web AI" showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'technical-partner' && <TechnicalPartner />}

          {currentPage === 'meta-advertising' && (
            <div className="home-light relative w-full">
              <MetaAdvertisingB2B />
              <Footer showCta={false} tone="light" />
            </div>
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
        </LazyPageErrorBoundary>
      </div>

    </main>
  );
};

export default App;
