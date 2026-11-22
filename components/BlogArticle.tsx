import React, { useEffect, useMemo } from 'react';
import { ListTree } from 'lucide-react';
import { BlogPost } from '../types/blog';
import BlogSchema from './BlogSchema';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import BlogCard from './BlogCard';
import { blogArticleCopy as copy, blogAuthors, blogPath, formatPostDate, relatedPosts } from '../data/extraPages';
import { siteUrl } from '../data/seoPages';
import { ArticleBlock, inlineTokens, parseArticle } from '../lib/blogMarkdown';
import { trackCtaClick } from '../utils/dataLayer';
import { scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Articolo del blog sul sistema chiaro (nessun mockup: composto con i  */
/* pezzi dell'articolo risorsa, vedi remaining-light-pages.md): hero    */
/* scuro corto con categoria, titolo, autore, data e tempo di lettura;  */
/* copertina; indice e prosa `.prose-light`; card autore; articoli      */
/* correlati e chiusura. Form contatti e footer chiari in App.tsx.      */
/* Il markdown si analizza in lib/blogMarkdown.ts (lo stesso del        */
/* prerender).                                                         */
/* ------------------------------------------------------------------ */

interface BlogArticleProps {
  post: BlogPost;
  posts: BlogPost[];
}

const avatarFallback = (name: string, size: number) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=9333ea&color=fff&size=${size}`;

const renderInline = (value: string, keyPrefix: string): React.ReactNode[] =>
  inlineTokens(value).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.type === 'strong') return <strong key={key}>{token.text}</strong>;
    if (token.type === 'code') return <code key={key}>{token.text}</code>;
    if (token.type === 'link') {
      return (
        <a key={key} href={token.href} {...(token.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {token.code ? <code>{token.text}</code> : token.text}
        </a>
      );
    }
    return <React.Fragment key={key}>{token.text}</React.Fragment>;
  });

const renderBlock = (block: ArticleBlock, index: number, prefix = 'b'): React.ReactNode => {
  const key = `${prefix}-${index}`;
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 3 ? 'h3' : 'h2';
      // h1 nel markdown: l'h1 della pagina è nell'hero, qui diventa un h2.
      return <Tag key={key} id={block.id} tabIndex={block.id ? -1 : undefined}>{renderInline(block.text, key)}</Tag>;
    }
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return <Tag key={key}>{block.items.map((item, i) => <li key={i}>{renderInline(item, `${key}-${i}`)}</li>)}</Tag>;
    }
    case 'quote':
      return <blockquote key={key}>{block.blocks.map((inner, i) => renderBlock(inner, i, key))}</blockquote>;
    case 'image':
      return (
        <figure key={key}>
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
          {block.alt && <figcaption>{block.alt}</figcaption>}
        </figure>
      );
    case 'code':
      return <pre key={key}><code>{block.text}</code></pre>;
    case 'table':
      return (
        <div key={key} className="tbl">
          <table>
            <thead><tr>{block.header.map((cell, i) => <th key={i} scope="col">{renderInline(cell, `${key}-h${i}`)}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{renderInline(cell, `${key}-${r}-${c}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    default:
      return <p key={key}>{renderInline(block.text, key)}</p>;
  }
};

const BlogArticle: React.FC<BlogArticleProps> = ({ post, posts }) => {
  const parsedArticle = useMemo(() => parseArticle(post.content), [post.content]);
  const related = useMemo(() => relatedPosts(post, posts), [post, posts]);
  const pageUrl = `${siteUrl}${blogPath}/${post.slug}`;
  const author = blogAuthors[post.author.name];

  // BlogPosting da BlogSchema; BreadcrumbList solo nel mirror statico
  // (scripts/prerender.ts), come prima del restyle: niente doppioni.

  // Link diretto a una sezione (/blog/slug#titolo): ci scorriamo dopo il render.
  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId || targetId === 'contatti') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [post.slug]);

  const scrollToHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const heading = document.getElementById(id);
    if (!heading) return;
    event.preventDefault();
    window.history.pushState(null, '', `#${id}`);
    scrollToId(id);
    heading.focus({ preventScroll: true });
  };

  const { close } = copy;

  return (
    <article className="relative">
      <BlogSchema post={post} />
      <SEOHead
        title={`${post.title} | Q4 Studio Blog`}
        description={post.excerpt}
        image={post.coverImage}
        url={pageUrl}
        type="article"
        article={{ publishedTime: post.date, author: post.author.name, section: post.category }}
      />

      <SubHero kicker={<span className="chip">{post.category}</span>} title={post.title} lead={post.excerpt}>
        <div className="flex items-center gap-4">
          <img
            src={post.author.image}
            alt=""
            width={56}
            height={56}
            decoding="async"
            className="h-14 w-14 flex-none rounded-full object-cover object-top"
            onError={(event) => { event.currentTarget.src = avatarFallback(post.author.name, 112); }}
          />
          <div className="min-w-0 text-[16px] leading-[1.5] text-gray-300">
            <p className="m-0 font-semibold text-white">{post.author.name}</p>
            <p className="m-0">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readTime} {copy.readTimeSuffix}
            </p>
          </div>
        </div>
      </SubHero>

      <div className="px-6 pt-16 md:px-12 md:pt-24">
        <img
          src={post.coverImage}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="mx-auto block aspect-video w-full max-w-[1200px] rounded-[28px] object-cover md:rounded-[40px]"
        />
      </div>

      {/* Indice a sinistra (sticky da lg), prosa a destra a ~760px. */}
      <div className="px-6 pb-24 pt-16 md:px-12 md:pb-[140px] md:pt-24">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[260px_minmax(0,760px)] lg:justify-between">
          <aside>
            <nav aria-labelledby="article-toc-title" className="toc rounded-[24px] bg-[#f7f5fb] p-6 lg:sticky lg:top-28">
              <div className="mb-3 flex items-center gap-2 text-[#7e22ce]">
                <ListTree className="h-5 w-5" aria-hidden="true" />
                <h2 id="article-toc-title" className="text-[16px] font-semibold" style={{ color: '#7e22ce', letterSpacing: 0, lineHeight: 1.4 }}>{copy.tocTitle}</h2>
              </div>
              {parsedArticle.toc.length ? (
                <ol className="m-0 list-none border-l border-black/10 p-0 pl-4">
                  {parsedArticle.toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                      <a href={`#${item.id}`} onClick={(event) => scrollToHeading(event, item.id)}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              ) : <p className="m-0 text-[16px]">{copy.tocEmpty}</p>}
            </nav>
          </aside>

          <div className="min-w-0">
            <div className="prose-light">
              {parsedArticle.blocks.map((block, index) => renderBlock(block, index))}
            </div>

            {/* Card autore: foto, nome e ruolo (solo autori noti in blogAuthors). */}
            <div className="mock mt-16 flex max-w-[760px] items-center gap-6 p-7 md:p-9">
              <img
                src={post.author.image}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 flex-none rounded-full object-cover object-top md:h-20 md:w-20"
                onError={(event) => { event.currentTarget.src = avatarFallback(post.author.name, 160); }}
              />
              <div className="min-w-0">
                <p className="m-0 text-[16px] text-[#6b7280]">{copy.authorKicker}</p>
                <p className="m-0 mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[#0a0a0a]">{post.author.name}</p>
                {author && <p className="m-0 mt-1 text-[16px]">{author.jobTitle}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="altri-articoli">
          <div className="mx-auto max-w-[1440px]">
            <Reveal as="h2" id="altri-articoli" className="h-l" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{copy.relatedTitle}</Reveal>
            <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => <BlogCard key={item.id} post={item} delay={i * 0.1} />)}
            </div>
          </div>
        </section>
      )}

      <CloseCta
        size="l"
        title={close.title}
        lead={close.lead}
        cta={{
          label: close.cta,
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'blog_article', cta_label: close.cta, cta_destination: '#contatti' });
            if (scrollToId('contatti', 'center')) event.preventDefault();
          },
        }}
      />
    </article>
  );
};

export default BlogArticle;
