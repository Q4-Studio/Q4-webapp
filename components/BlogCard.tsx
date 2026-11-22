import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './home2/Reveal';
import { BlogPost } from '../types/blog';
import { blogIndexCopy, blogPath, formatPostDate } from '../data/extraPages';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Card di un articolo del blog: stessa card `.bc` con copertina 16:9   */
/* dell'indice dei casi studio, con chip categoria, data e tempo di     */
/* lettura, titolo ed estratto. Usata dall'indice e dai correlati.      */
/* ------------------------------------------------------------------ */

const BlogCard: React.FC<{ post: BlogPost; delay?: number; headingLevel?: 'h2' | 'h3' }> = ({ post, delay = 0, headingLevel = 'h3' }) => {
  const href = `${blogPath}/${post.slug}`;
  const Heading = headingLevel;
  return (
    <Reveal as="article" delay={delay} className="bc h-full" style={{ padding: 0 }}>
      <a href={href} onClick={onInternalLink(href)} className="group flex h-full flex-col no-underline">
        {/* La copertina è decorativa: titolo ed estratto sono già nel link. */}
        <img src={post.coverImage} alt="" loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
        <div className="flex flex-1 flex-col p-7 md:p-9">
          <span className="chip self-start">{post.category}</span>
          <Heading className="mt-6" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', letterSpacing: '-0.035em', lineHeight: 1.08 }}>{post.title}</Heading>
          <p className="m-0 mt-3 text-[16px] text-[#6b7280]">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readTime}
          </p>
          <p className="d line-clamp-3">{post.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[17px] font-semibold text-[#0a0a0a] group-hover:text-purple-700">
            {blogIndexCopy.readMore}
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </a>
    </Reveal>
  );
};

export default BlogCard;
