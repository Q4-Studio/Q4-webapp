import React from 'react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import { company, cookieSections, LegalBlock, LegalSection, LegalText, privacyPageCopy as copy, privacySections } from '../data/companyPages';
import { siteUrl } from '../data/seoPages';

/* ------------------------------------------------------------------ */
/* Privacy e cookie sul sistema chiaro (mockup Privacy.html): hero      */
/* corto, poi "Privacy Policy." e "Cookie Policy." in righe titolo |    */
/* testo. Il testo legale (vincolante) sta in data/companyPages.ts ed è */
/* lo stesso del mirror statico e del markdown. Nessun form: solo il    */
/* footer chiaro (App.tsx).                                             */
/* ------------------------------------------------------------------ */

const LINK_CLASS = 'text-[#0a0a0a] underline decoration-purple-400 underline-offset-4 hover:text-purple-700';

const Rich: React.FC<{ text: LegalText }> = ({ text }) => (
  <>
    {text.map((part, i) => {
      if (typeof part === 'string') return <React.Fragment key={i}>{part}</React.Fragment>;
      if ('b' in part) return <strong key={i} className="font-semibold text-[#0a0a0a]">{part.b}</strong>;
      if ('a' in part) return <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{part.a}</a>;
      return <a key={i} href={`mailto:${company.email}`} className={LINK_CLASS}>{company.email}</a>;
    })}
  </>
);

const Block: React.FC<{ block: LegalBlock }> = ({ block }) => {
  switch (block.kind) {
    case 'p':
      return <p className="m-0"><Rich text={block.text} /></p>;
    case 'note':
      return <p className="m-0 text-[16px] font-semibold uppercase tracking-[0.08em] text-purple-700">{block.text}</p>;
    case 'list':
      return (
        <ul className="bul" style={{ marginTop: 0 }}>
          {block.items.map((item, i) => <li key={i}><span><Rich text={item} /></span></li>)}
        </ul>
      );
    case 'cookie':
      return (
        <div className="mock overflow-hidden">
          <p className="m-0 px-5 pb-1 pt-4 font-semibold text-[#0a0a0a]">{block.name}</p>
          <dl className="dr">
            {block.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    default:
      return null;
  }
};

const LegalRows: React.FC<{ id: string; title: string; sections: LegalSection[] }> = ({ id, title, sections }) => (
  <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby={id}>
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" id={id} className="h-l mb-16 max-w-[1100px] md:mb-24">{title}</Reveal>
      <div style={{ borderBottom: '1px solid rgba(10,10,10,.09)' }}>
        {sections.map((section) => (
          <Reveal key={section.title} className="grid grid-cols-1 gap-5 py-10 md:py-14 lg:grid-cols-[420px_1fr] lg:gap-[72px]" style={{ borderTop: '1px solid rgba(10,10,10,.09)' }}>
            <h3 style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.08 }}>{section.title}</h3>
            <div className="grid max-w-[760px] gap-5 text-[19px] leading-[1.7]">
              {section.blocks.map((block, i) => <Block key={i} block={block} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Privacy: React.FC = () => (
  <section className="relative">
    <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={`${siteUrl}/privacy`} />
    <SubHero kicker={copy.kicker} title={copy.title} lead={`${copy.lead} Ultimo aggiornamento: ${copy.lastUpdated}.`} />
    <div className="pt-24 md:pt-[200px]">
      <LegalRows id="privacy-policy" title={copy.privacyTitle} sections={privacySections} />
      <LegalRows id="cookie-policy" title={copy.cookieTitle} sections={cookieSections} />
    </div>
  </section>
);

export default Privacy;
