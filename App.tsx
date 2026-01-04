import React, { useState, useEffect } from 'react';
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
import { BlogPost } from './types/blog';

type Page = 'home' | 'blog' | 'blog-article' | '404';

// Blog posts data (shared between Blog and BlogArticle)
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'algoritmo-andromeda-meta-creativita-leva-competitiva',
    title: 'Algoritmo Andromeda di Meta: la creatività come leva competitiva',
    excerpt: 'Nel nuovo scenario Ads guidato dall\'algoritmo Andromeda, la creatività diventa la vera leva competitiva. Scopri come Meta ha rivoluzionato il targeting privilegiando la rilevanza contestuale.',
    content: `
# Algoritmo Andromeda di Meta: la creatività come leva competitiva

Nel nuovo scenario Ads, guidato dall'algoritmo **Andromeda di Meta**, la creatività diventa la vera **leva competitiva**.

Andromeda, infatti, non privilegia più il targeting selettivo, ma premia la **rilevanza contestuale**, la **qualità del messaggio** e la **capacità di generare interazioni autentiche**.

## Come funziona Andromeda

Il sistema sfrutta l'**intelligenza artificiale** per combinare automaticamente centinaia di varianti creative — immagini, video e testo — adattandole dinamicamente ai **comportamenti** e agli **interessi dell'utente** in tempo reale.

In questo contesto, la creatività non è più solo estetica, ma un **elemento tattico di targeting**, in grado di "auto-selezionare" il pubblico più reattivo attraverso segnali di engagement.

## Cosa cambia per gli advertiser

1. **Focus sulla qualità creativa**: Non basta più targetizzare bene, serve creare contenuti che generano interazioni autentiche
2. **Test continui**: L'algoritmo premia chi testa multiple varianti creative
3. **Rilevanza contestuale**: Il messaggio giusto al momento giusto conta più del pubblico "perfetto"
4. **Performance-driven**: I segnali di engagement determinano chi vede le tue ads

## Il nostro approccio

In Q4 Studio, sfruttiamo Andromeda creando **decine di varianti creative** per ogni campagna, lasciando che sia l'algoritmo a identificare le combinazioni vincenti per ogni micro-segmento di pubblico.

Il risultato? **CPL più bassi** e **conversion rate più alti**, perché ogni utente vede esattamente il messaggio più rilevante per lui.
    `,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    category: 'Meta Advertising',
    date: '2025-01-04',
    readTime: '5 min',
    author: {
      name: 'Nicolò Pozzato',
      image: '/team/nicolo.jpg'
    }
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');

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
          setCurrentPage('404');
        }
      } else if (hash === 'blog') {
        setCurrentPage('blog');
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
  }, []);

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
          <Blog onArticleClick={(slug) => navigateTo('blog-article', slug)} />
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

      {currentPage === '404' && (
        <NotFound />
      )}

    </main>
  );
};

export default App;
