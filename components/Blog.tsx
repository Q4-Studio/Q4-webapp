import React from 'react';
import { BlogPost } from '../types/blog';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import BlogCard from './BlogCard';
import { blogIndexCopy as copy, blogPath } from '../data/extraPages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Indice del blog sul sistema chiaro (nessun mockup: composto con i    */
/* pezzi di /risorse e /casi-studio, vedi remaining-light-pages.md):    */
/* hero scuro corto, griglia di card con copertina e chiusura. Form     */
/* contatti e footer chiari in App.tsx. Gli articoli arrivano da App.   */
/* ------------------------------------------------------------------ */

interface BlogProps {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

const LINK_CLASS = 'text-[#0a0a0a] underline decoration-purple-400 underline-offset-4 hover:text-purple-700';

const Blog: React.FC<BlogProps> = ({ posts, isLoading, error }) => {
  const pageUrl = `${siteUrl}${blogPath}`;
  const { close, empty } = copy;

  return (
    <section className="relative">
      <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={pageUrl} />

      <SubHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />

      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[160px] md:pt-[160px]" aria-labelledby="blog-articoli">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="blog-articoli" className="h-l" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{copy.listTitle}</Reveal>

          {isLoading && (
            <p role="status" className="mt-12 text-[19px] md:mt-16">{copy.loading}</p>
          )}

          {error && !isLoading && (
            <p role="alert" className="mt-12 text-[19px] text-red-800 md:mt-16">{error}</p>
          )}

          {!isLoading && !error && posts.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} delay={(i % 3) * 0.1} />
              ))}
            </div>
          )}

          {/* Stato vuoto: Supabase non configurato o nessun articolo pubblicato. */}
          {!isLoading && !error && posts.length === 0 && (
            <Reveal className="bc static mt-12 max-w-[760px] md:mt-16">
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{empty.title}</h3>
              <p className="d">
                {empty.text}{' '}
                {empty.links.map((link, i) => (
                  <React.Fragment key={link.href}>
                    {i > 0 && ' · '}
                    <a href={link.href} onClick={onInternalLink(link.href)} className={LINK_CLASS}>{link.label}</a>
                  </React.Fragment>
                ))}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <CloseCta
        size="l"
        title={close.title}
        lead={close.lead}
        cta={{
          label: close.cta,
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'blog_index', cta_label: close.cta, cta_destination: '#contatti' });
            if (scrollToId('contatti', 'center')) event.preventDefault();
          },
        }}
      />
    </section>
  );
};

export default Blog;
