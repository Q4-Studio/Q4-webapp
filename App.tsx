import React, { lazy, Suspense, useState, useEffect, useRef, useTransition } from 'react';
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
import { clientsPath } from './data/clientsPage';
import { captureAttribution } from './utils/attribution';
import { trackCtaClick } from './utils/dataLayer';
import { onInternalLink, scrollToId, scrollToTop } from './utils/navigate';
import { blogIndexCopy } from './data/extraPages';

/** Hash che sono rotte (pagine aperte come `/#privacy`), non sezioni da raggiungere. */
const HASH_ROUTES = new Set(['', 'home', 'privacy', 'app-support', '404', 'contatti']);

const Blog = lazy(() => import('./components/Blog'));
const BlogArticle = lazy(() => import('./components/BlogArticle'));
const NotFound = lazy(() => import('./components/NotFound'));
const Privacy = lazy(() => import('./components/Privacy'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const AppSupport = lazy(() => import('./components/AppSupport'));
const SeoDirectory = lazy(() => import('./components/SeoDirectory'));
const SeoLandingPage = lazy(() => import('./components/SeoLandingPage'));
// Le pagine principali hanno il loader condiviso: dopo il primo paint i loro
// chunk vengono scaricati in anticipo (vedi l'effetto di prefetch), così il
// passaggio di pagina non lascia lo schermo bianco su reti lente.
const loadAIAgents = () => import('./components/AIAgents');
const loadCaseStudiesIndex = () => import('./components/CaseStudiesIndex');
const loadCaseStudyPage = () => import('./components/CaseStudyPage');
const loadServerSideTracking = () => import('./components/ServerSideTracking');
const loadMetaAdvertisingB2B = () => import('./components/MetaAdvertisingB2B');
const loadSitesWebAI = () => import('./components/SitesWebAI');
const AIAgents = lazy(loadAIAgents);
const CaseStudiesIndex = lazy(loadCaseStudiesIndex);
const CaseStudyPage = lazy(loadCaseStudyPage);
const ServerSideTracking = lazy(loadServerSideTracking);
const TechnicalPartner = lazy(() => import('./components/TechnicalPartner'));
// Clienti: solo dal footer, niente prefetch.
const ClientsPage = lazy(() => import('./components/ClientsPage'));
const MetaAdvertisingB2B = lazy(loadMetaAdvertisingB2B);
const SitesWebAI = lazy(loadSitesWebAI);

/**
 * Schermo di attesa mentre arriva il chunk di una pagina: fondo carta e riga
 * che scorre (il logo è quello della nav, sopra). `home-light` fa trattare il
 * loader come fondo chiaro alla nav; `data-page-loader` lo distingue da una
 * pagina chiara vera (vedi l'effetto di `navOnLight`). Con `delayed` (cambio
 * rotta in transizione) compare solo dopo ~150 ms: sui cambi istantanei non
 * lampeggia.
 */
const PageLoader: React.FC<{ delayed?: boolean }> = ({ delayed }) => (
  <div
    className={`home-light fixed inset-0 z-[60] ${delayed ? 'q4-pageloader-delayed' : ''}`}
    style={{ background: '#f7f5fb' }}
    role="status"
    aria-live="polite"
    data-page-loader=""
  >
    <span className="sr-only">Caricamento pagina…</span>
    <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden">
      <div className="q4-pageloader-bar h-full w-1/3 bg-gradient-to-r from-indigo-400 via-purple-500 to-purple-700" />
    </div>
  </div>
);

type Page = 'home' | 'blog' | 'blog-article' | 'privacy' | 'about' | 'contact' | 'app-support' | 'directory' | 'seo-page' | 'agenti-ai' | 'tracking' | 'sites' | 'technical-partner' | 'meta-advertising' | 'case-studies' | 'case-study' | 'clients' | '404';

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
  // sta fuori dalla pillola: sopra gli hero scuri (#hero) logo, hamburger e
  // "Contatti" sono bianchi; scorrendo oltre
  // l'hero delle pagine chiare diventano neri, perché sotto c'è il bianco. Idem
  // con il menu mobile aperto: il pannello è bianco e sta sotto la nav.
  const [navOnLight, setNavOnLight] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const previousRouteRef = useRef<string | null>(null);
  // Cambio rotta in transizione: se il chunk della pagina è già in cache la
  // pagina cambia subito, senza passare dal fallback di Suspense; se no resta
  // la pagina corrente e compare il loader (ritardato) finché arriva.
  const [isPending, startTransition] = useTransition();

  // Chiude il menu e riporta il focus sull'hamburger che lo aveva aperto:
  // senza questo, con tastiera/screen reader il focus si perde in cima al
  // documento (di solito sul <body>) invece di restare su un elemento noto.
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    hamburgerButtonRef.current?.focus();
  };

  // Chiude il menu mobile quando cambia pagina o quando il viewport supera md
  // Prefetch dei chunk delle pagine principali quando il browser è libero.
  useEffect(() => {
    const run = () => {
      [loadServerSideTracking, loadSitesWebAI, loadAIAgents, loadCaseStudiesIndex, loadCaseStudyPage, loadMetaAdvertisingB2B].forEach((load) => {
        load().catch(() => {});
      });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 2500);
    return () => window.clearTimeout(id);
  }, []);

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
        setBlogError(blogIndexCopy.error);
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
    // `inTransition`: false al primo caricamento (deve comparire subito la
    // pagina giusta, non restare sulla home in attesa del chunk), true per
    // popstate/hashchange (navigazione SPA, anche da goTo/onInternalLink).
    const handleRouteChange = (inTransition: boolean) => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash.slice(1); // Remove #
      const route = `${path}#${hash}`;

      const applyRoute = () => {
      if (path === '/tracciamento-server-side') {
        setCurrentPage('tracking');
      } else if (path === '/siti-web-ai') {
        setCurrentPage('sites');
      } else if (path === '/partner-tecnico') {
        setCurrentPage('technical-partner');
      } else if (path === '/meta-advertising-b2b') {
        setCurrentPage('meta-advertising');
      } else if (path === clientsPath) {
        setCurrentPage('clients');
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
      };
      if (inTransition) startTransition(applyRoute);
      else applyRoute();
      // Il fetch del blog aggiorna questo effect per risolvere le rotte degli
      // articoli. Scorriamo in alto solo quando cambia davvero l'URL, altrimenti
      // un aggiornamento dati riporterebbe l'utente in cima mentre legge.
      if (previousRouteRef.current !== route) {
        const previousPath = previousRouteRef.current?.split('#')[0];
        previousRouteRef.current = route;
        // Id della sezione nell'hash; un hash malformato (`%E0`) vale come nessuno.
        let targetId = '';
        try {
          targetId = decodeURIComponent(hash);
        } catch {
          targetId = '';
        }
        // #contatti su qualsiasi path: le pagine chiare hanno il form in fondo.
        if (hash === 'contatti') {
          const scrollWhenReady = (attemptsLeft: number) => {
            if (!scrollToId('contatti') && attemptsLeft > 0) {
              setTimeout(() => scrollWhenReady(attemptsLeft - 1), 100);
            }
          };
          setTimeout(() => scrollWhenReady(20), 100);
        } else if (previousPath === path && targetId && !HASH_ROUTES.has(hash) && scrollToId(targetId)) {
          // Cambia solo l'hash sullo stesso path (Indietro/Avanti tra i titoli
          // dell'indice dell'articolo): si va alla sezione, non in cima.
        } else {
          window.scrollTo({ top: 0 });
        }
      }
    };

    handleRouteChange(false); // Initial load
    const onNavigation = () => handleRouteChange(true);
    window.addEventListener('hashchange', onNavigation);
    window.addEventListener('popstate', onNavigation);
    return () => {
      window.removeEventListener('hashchange', onNavigation);
      window.removeEventListener('popstate', onNavigation);
    };
  }, [blogPosts, isLoadingBlog]);

  useEffect(() => {
    // Gira su tutte le pagine. Con #hero (home e pagine chiare con hero
    // scuro): chiaro oltre l'hero. Senza #hero: chiaro se la pagina è
    // dentro .home-light (oggi tutte le pagine hanno un hero scuro).
    // L'altezza dell'hero può cambiare senza scroll né resize (font che
    // arrivano, barra URL mobile): la osserviamo con un ResizeObserver,
    // agganciato appena #hero esiste. Le pagine lazy montano dopo l'effetto:
    // un MutationObserver sul body ricalcola quando arrivano (1 volta per
    // frame) e si stacca appena la pagina chiara (#hero o .home-light, non il
    // loader) è nel DOM; al cambio rotta l'effetto riparte e lo riaggancia.
    let cancelled = false;
    let observedHero: HTMLElement | null = null;
    let rafId = 0;
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => update()) : null;
    function update() {
      if (cancelled) return;
      const hero = document.getElementById('hero');
      if (resizeObserver && hero !== observedHero) {
        if (observedHero) resizeObserver.unobserve(observedHero);
        if (hero) resizeObserver.observe(hero);
        observedHero = hero;
      }
      if (hero) {
        setNavOnLight(window.scrollY > hero.offsetHeight - 80);
      } else {
        setNavOnLight(document.querySelector('.home-light') !== null);
      }
      if (hero || document.querySelector('.home-light:not([data-page-loader])')) {
        mutationObserver?.disconnect();
      }
    }
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };
    const mutationObserver = typeof MutationObserver !== 'undefined' ? new MutationObserver(scheduleUpdate) : null;
    mutationObserver?.observe(document.body, { childList: true, subtree: true });
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update).catch(() => {});
    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [currentPage, currentArticleSlug, currentSeoSlug, currentCaseStudySlug]);

  const navigateTo = (page: Page, slug?: string) => {
    const paths: Partial<Record<Page, string>> = {
      blog: '/blog',
      home: '/',
      'agenti-ai': '/agenti-ai',
      tracking: '/tracciamento-server-side',
      sites: '/siti-web-ai',
    };
    const path = page === 'blog-article' && slug ? `/blog/${slug}` : paths[page];
    if (path) {
      window.history.pushState(null, '', path);
      startTransition(() => {
        if (page === 'blog-article' && slug) setCurrentArticleSlug(slug);
        setCurrentPage(page);
      });
      // Home: scorrimento morbido (rispetta prefers-reduced-motion); le altre pagine saltano in cima.
      scrollToTop(page === 'home');
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = page;
    }
  };

  // Scrolla alla sezione del form contatti. Se la pagina corrente ha già
  // #contatti (le pagine chiare hanno il form in fondo) resta lì; altrimenti
  // naviga in home e attende (con qualche retry) che la sezione sia nel DOM:
  // un singolo setTimeout(100ms) può scattare prima che HomeV2 sia montata.
  const scrollToContact = () => {
    const trySmoothScroll = (attemptsLeft: number) => {
      if (!scrollToId('contatti', 'center') && attemptsLeft > 0) {
        setTimeout(() => trySmoothScroll(attemptsLeft - 1), 100);
      }
    };

    if (document.getElementById('contatti')) {
      // Hash sul path corrente: /agenti-ai#contatti, non /#contatti.
      if (window.location.hash !== '#contatti') {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}#contatti`);
      }
      trySmoothScroll(0);
    } else {
      window.history.pushState(null, '', '/#contatti');
      setCurrentPage('home');
      setTimeout(() => trySmoothScroll(20), 100);
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
          sopra gli hero scuri, neri una volta
          superato l'hero delle pagine chiare (sotto c'è il bianco). */}
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
              <a key={item.label} href={item.href} onClick={onInternalLink(item.href)} className={navItemClass(item.active)}>
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
        {isPending && <PageLoader delayed />}
        <Suspense fallback={<PageLoader />}>
          {currentPage === 'blog' && (
            <div className="home-light relative w-full">
              <Blog posts={blogPosts} isLoading={isLoadingBlog} error={blogError} />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {/* Articolo: form generico, senza oggetto. `subject` rende la richiesta
              una "service inquiry" negli analytics, e un articolo non è un servizio (D-055). */}
          {currentPage === 'blog-article' && currentArticle && (
            <div className="home-light relative w-full">
              <BlogArticle post={currentArticle} posts={blogPosts} />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {/* Privacy: nessun form (il mockup non lo prevede), solo il footer chiaro. */}
          {currentPage === 'privacy' && (
            <div className="home-light relative w-full">
              <Privacy />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'about' && (
            <div className="home-light relative w-full">
              <AboutPage />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {/* Contatti: il form è la sezione #contatti della pagina, dopo la chiusura. */}
          {currentPage === 'contact' && (
            <div className="home-light relative w-full">
              <ContactPage />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {/* Supporto app: ha il suo form di supporto, niente form contatti. */}
          {currentPage === 'app-support' && (
            <div className="home-light relative w-full">
              <AppSupport />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'directory' && (
            <div className="home-light relative w-full">
              <SeoDirectory />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
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

          {/* Clienti: pagina del footer, form generico e footer chiaro come le altre. */}
          {currentPage === 'clients' && (
            <div className="home-light relative w-full">
              <ClientsPage />
              <ContactForm showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'technical-partner' && (
            <div className="home-light relative w-full">
              <TechnicalPartner />
              <ContactForm subject="Partner tecnico" showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'meta-advertising' && (
            <div className="home-light relative w-full">
              <MetaAdvertisingB2B />
              <ContactForm subject="Advertising" showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'seo-page' && currentSeoPage && (
            <div className="home-light relative w-full">
              <SeoLandingPage page={currentSeoPage} />
              {/* L'oggetto della richiesta è la risorsa da cui arriva il contatto. */}
              <ContactForm subject={currentSeoPage.title} showHeader={false} tone="light" />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'case-studies' && (
            <div className="home-light relative w-full">
              <CaseStudiesIndex />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === 'case-study' && currentCaseStudy && (
            <div className="home-light relative w-full">
              <CaseStudyPage study={currentCaseStudy} />
              <Footer showCta={false} tone="light" />
            </div>
          )}

          {currentPage === '404' && (
            <div className="home-light relative w-full">
              <NotFound />
              <Footer showCta={false} tone="light" />
            </div>
          )}
        </Suspense>
        </LazyPageErrorBoundary>
      </div>

    </main>
  );
};

export default App;
