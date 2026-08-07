import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, ListTree } from 'lucide-react';
import { BlogPost } from '../types/blog';
import BlogSchema from './BlogSchema';
import SEOHead from './SEOHead';

interface BlogArticleProps {
  post: BlogPost;
  onBack: () => void;
}

interface TocItem {
  id: string;
  level: 2 | 3;
  label: string;
}

type ArticleBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string; id?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] };

const plainText = (value: string): string => value
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/`([^`]+)`/g, '$1')
  .trim();

const headingSlug = (value: string): string => plainText(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'sezione';

const parseArticle = (content: string): { blocks: ArticleBlock[]; toc: TocItem[] } => {
  const blocks: ArticleBlock[] = [];
  const toc: TocItem[] = [];
  const headingCounts = new Map<string, number>();
  let listItems: string[] = [];
  let listOrdered = false;

  const flushList = () => {
    if (listItems.length) blocks.push({ type: 'list', ordered: listOrdered, items: listItems });
    listItems = [];
  };

  for (const rawLine of content.trim().split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    const unorderedItem = line.match(/^[-*]\s+(.+)$/);

    if (heading) {
      flushList();
      const level = heading[1].length as 1 | 2 | 3;
      const text = heading[2];
      if (level === 2 || level === 3) {
        const base = headingSlug(text);
        const occurrence = (headingCounts.get(base) || 0) + 1;
        headingCounts.set(base, occurrence);
        const id = occurrence === 1 ? base : `${base}-${occurrence}`;
        blocks.push({ type: 'heading', level, text, id });
        toc.push({ id, level, label: plainText(text) });
      } else {
        blocks.push({ type: 'heading', level, text });
      }
      continue;
    }

    if (orderedItem || unorderedItem) {
      const ordered = Boolean(orderedItem);
      const item = (orderedItem || unorderedItem)?.[1];
      if (!item) continue;
      if (listItems.length && ordered !== listOrdered) flushList();
      listOrdered = ordered;
      listItems.push(item);
      continue;
    }

    flushList();
    if (line) blocks.push({ type: 'paragraph', text: line });
  }

  flushList();
  return { blocks, toc };
};

const safeLink = (href: string): { href: string; external: boolean } | null => {
  const value = href.trim();
  if ((value.startsWith('/') && !value.startsWith('//')) || /^#[a-z0-9][a-z0-9_-]*$/i.test(value)) {
    return { href: value, external: false };
  }
  if (value.startsWith('https://') || value.startsWith('mailto:')) {
    return { href: value, external: value.startsWith('https://') };
  }
  return null;
};

const renderInline = (value: string, keyPrefix: string): React.ReactNode[] => {
  const tokens = value.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  return tokens.filter(Boolean).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={key} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={key} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.92em] text-indigo-100">{token.slice(1, -1)}</code>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const destination = safeLink(link[2]);
      if (!destination) return <React.Fragment key={key}>{link[1]}</React.Fragment>;
      return (
        <a
          key={key}
          href={destination.href}
          {...(destination.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-indigo-300 underline decoration-indigo-400/40 underline-offset-4 transition-colors hover:text-indigo-200 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
        >
          {link[1]}
        </a>
      );
    }

    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
};

const BlogArticle: React.FC<BlogArticleProps> = ({ post, onBack }) => {
  const articleRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parsedArticle = useMemo(() => parseArticle(post.content), [post.content]);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) window.scrollTo({ top: 0 });

    if (!articleRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        headerRef.current,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', immediateRender: true }
      );
      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, delay: 0.18, ease: 'power2.out', immediateRender: true }
      );
    }, articleRef);

    let frame = 0;
    if (targetId) {
      frame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, [post, parsedArticle.toc]);

  const scrollToHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const heading = document.getElementById(id);
    if (!heading) return;
    event.preventDefault();
    window.history.pushState(null, '', `#${id}`);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    heading.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    heading.focus({ preventScroll: true });
  };

  const navigateToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, '', '/#contatti');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderBlock = (block: ArticleBlock, index: number) => {
    if (block.type === 'heading') {
      const shared = { id: block.id, tabIndex: block.id ? -1 : undefined };
      if (block.level === 1) {
        return <h1 key={index} className="mb-5 mt-12 text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.025em]">{renderInline(block.text, `h1-${index}`)}</h1>;
      }
      if (block.level === 2) {
        return <h2 key={index} {...shared} className="scroll-mt-28 mb-5 mt-14 text-[clamp(1.65rem,3.5vw,2.25rem)] font-bold leading-[1.18] tracking-[-0.02em] text-indigo-200 outline-none">{renderInline(block.text, `h2-${index}`)}</h2>;
      }
      return <h3 key={index} {...shared} className="scroll-mt-28 mb-4 mt-9 text-[clamp(1.25rem,2.5vw,1.55rem)] font-bold leading-[1.3] text-purple-200 outline-none">{renderInline(block.text, `h3-${index}`)}</h3>;
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`${block.ordered ? 'list-decimal' : 'list-disc'} mb-7 ml-6 space-y-3 marker:text-indigo-400`}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-2 text-[1.0625rem] leading-[1.72] text-gray-300 md:text-lg">
              {renderInline(item, `list-${index}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>
      );
    }

    return (
      <p key={index} className="mb-6 text-[1.0625rem] leading-[1.72] text-gray-300 md:text-lg">
        {renderInline(block.text, `p-${index}`)}
      </p>
    );
  };

  return (
    <article ref={articleRef} className="relative min-h-screen overflow-hidden bg-[#050505] px-6 pb-24 pt-36 text-white md:pb-32 md:pt-44">
      <BlogSchema post={post} />
      <SEOHead
        title={`${post.title} | Q4 Studio Blog`}
        description={post.excerpt}
        image={post.coverImage}
        url={`https://www.q4.studio/blog/${post.slug}`}
        type="article"
        article={{ publishedTime: post.date, author: post.author.name, section: post.category }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(800px,160vw)] w-[min(800px,160vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl">
          <button onClick={onBack} className="group mb-8 flex items-center gap-2 text-gray-400 transition-colors hover:text-indigo-300">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Torna al Blog</span>
          </button>

          <div ref={headerRef}>
            <div className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-4 py-1">
              <span className="text-sm font-medium text-indigo-300">{post.category}</span>
            </div>
            <h1 className="mb-7 max-w-4xl text-[clamp(2.35rem,5.5vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em]">
              {post.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-white/10 pb-8 text-gray-400">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full object-cover object-top"
                  onError={(event) => {
                    event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=96`;
                  }}
                />
                <div>
                  <p className="font-medium text-white">{post.author.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime} di lettura</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-14 h-[clamp(260px,48vw,460px)] overflow-hidden rounded-3xl">
              <img src={post.coverImage} alt={post.title} loading="eager" fetchPriority="high" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div ref={contentRef} className="grid items-start gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
          <aside>
            <nav aria-labelledby="article-toc-title" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:sticky lg:top-28">
              <div className="mb-4 flex items-center gap-2 text-indigo-200">
                <ListTree className="h-4 w-4" aria-hidden="true" />
                <h2 id="article-toc-title" className="text-sm font-semibold uppercase tracking-[0.12em]">In questa pagina</h2>
              </div>
              {parsedArticle.toc.length ? (
                <ol className="space-y-2 border-l border-white/10 pl-4">
                  {parsedArticle.toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => scrollToHeading(event, item.id)}
                        className="block py-1 text-sm leading-snug text-gray-400 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : <p className="text-sm leading-relaxed text-gray-500">Lettura continua</p>}
            </nav>
          </aside>

          <div className="min-w-0 max-w-[70ch]">
            {parsedArticle.blocks.map(renderBlock)}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 p-8 md:mt-20">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <img
              src={post.author.image}
              alt={post.author.name}
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-full object-cover object-top"
              onError={(event) => {
                event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=160`;
              }}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2 text-2xl font-bold leading-tight">{post.author.name}</h2>
              <p className="leading-relaxed text-gray-400">Vuoi applicare questi principi al tuo progetto? Raccontaci dove oggi perdi dati, tempo o opportunità.</p>
            </div>
            <a
              href="/#contatti"
              onClick={navigateToContact}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
            >
              Contattaci <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticle;
