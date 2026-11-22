import React from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Bot, FileText, LayoutTemplate, Search, Server } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import { IconBox } from './ResourceCard';
import { notFoundCopy as copy } from '../data/extraPages';
import { siteUrl } from '../data/seoPages';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* 404 sul sistema chiaro (nessun mockup, vedi                          */
/* remaining-light-pages.md): hero scuro corto con i due bottoni e card */
/* verso le pagine principali, più sitemap e llms.txt per gli agenti.   */
/* Stessi link del mirror statico dist/404.html (scripts/prerender.ts). */
/* Footer chiaro in App.tsx, niente form.                               */
/* ------------------------------------------------------------------ */

const ICONS = [Server, LayoutTemplate, Bot, FileText, Search, BookOpen];
const LINK_CLASS = 'text-[#0a0a0a] underline decoration-purple-400 underline-offset-4 hover:text-purple-700';

const NotFound: React.FC = () => (
  <section className="relative">
    <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={`${siteUrl}/404`} noIndex />

    <SubHero kicker={copy.kicker} title={copy.title} lead={copy.lead}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a href="/" onClick={onInternalLink('/')} className="btn btn-white justify-center">
          {copy.home}
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </a>
        <button type="button" onClick={() => window.history.back()} className="btn btn-glass justify-center">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          {copy.back}
        </button>
      </div>
    </SubHero>

    <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[160px] md:pt-[160px]" aria-labelledby="ripartire">
      <div className="mx-auto max-w-[1440px]">
        <Reveal as="h2" id="ripartire" className="h-l" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{copy.linksTitle}</Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {copy.links.map((link, i) => (
            <Reveal key={link.href} delay={(i % 3) * 0.1} className="h-full">
              <a href={link.href} onClick={onInternalLink(link.href)} className="bc h-full gap-6 no-underline" style={{ minHeight: 260 }}>
                <IconBox icon={ICONS[i] ?? Search} />
                <div className="mt-auto">
                  <h3 style={{ fontSize: 'clamp(1.4rem, 1.9vw, 1.9rem)', letterSpacing: '-0.035em', lineHeight: 1.08 }}>{link.label}</h3>
                  <p className="mt-3 text-[15px] leading-[1.55]">{link.text}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <ul className="m-0 mt-12 grid list-none gap-2 p-0 text-[16px] md:mt-16">
          {copy.machineLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={LINK_CLASS}>{link.label}</a> — {link.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </section>
);

export default NotFound;
