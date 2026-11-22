import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import { PaperBlock } from './home2/primitives';
import { technicalPartnerCopy as copy } from '../data/extraPages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';

/* ------------------------------------------------------------------ */
/* Partner tecnico white label sul sistema chiaro (nessun mockup:       */
/* composto con i pezzi delle pagine servizio, vedi                     */
/* remaining-light-pages.md): hero scuro corto con i due CTA, problema  */
/* in carta, passaggi a righe, garanzia, card dei servizi con i prezzi  */
/* dei pacchetti, prezzo e chi sono, chiusura. Testi da                 */
/* data/extraPages.ts (gli stessi del mirror statico). Form contatti e  */
/* footer chiari in App.tsx.                                            */
/* ------------------------------------------------------------------ */

const SECTION_TITLE_STYLE: React.CSSProperties = { fontSize: 'clamp(2.5rem, 5vw, 5rem)' };
const CARD_TITLE_STYLE: React.CSSProperties = { fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 };

const track = (label: string, destination: string) => () =>
  trackCtaClick({ cta_location: 'technical_partner_page', cta_label: label, cta_destination: destination });

const TechnicalPartner: React.FC = () => {
  const { book, mail, problem, process, guarantee, services, pricing, about, close } = copy;

  return (
    <article className="relative">
      <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={`${siteUrl}${copy.path}`} noIndex />

      <SubHero kicker={copy.kicker} title={copy.title} lead={copy.lead}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={book.href} target="_blank" rel="noopener noreferrer" onClick={track(book.label, book.href)} className="btn btn-white justify-center">
            {book.label}
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href={mail.href} onClick={track(mail.label, mail.href)} className="btn btn-glass justify-center">
            {mail.label}
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </SubHero>

      {/* Il problema che conosci: titolo a sinistra, testo a destra, in carta. */}
      <section className="px-6 pb-24 pt-24 md:pb-[160px] md:pt-[160px]" aria-labelledby="partner-problema">
        <PaperBlock className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal as="h2" id="partner-problema" className="h-l" style={SECTION_TITLE_STYLE}>{problem.title}</Reveal>
          <div className="grid gap-6">
            {problem.paragraphs.map((text, i) => (
              <Reveal key={text} as="p" delay={i * 0.08} className="lead m-0 max-w-[620px] text-gray-700">{text}</Reveal>
            ))}
          </div>
        </PaperBlock>
      </section>

      {/* Come funziona: righe numerate come i passaggi delle pagine servizio. */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="partner-processo">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="partner-processo" className="h-l">{process.title}</Reveal>
          <div className="mt-20 md:mt-[80px]">
            {process.steps.map((step) => (
              <Reveal key={step.n} as="article" className="row">
                <span className="tm">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="lead mt-12 max-w-[760px] text-gray-700 md:mt-16">{process.note}</Reveal>
        </div>
      </section>

      {/* La garanzia: blocco carta con la frase in grande. */}
      <section className="px-6 pb-24 md:pb-[160px]" aria-labelledby="partner-garanzia">
        <PaperBlock>
          <Reveal as="p" className="m-0 text-[17px] font-medium text-purple-700">{guarantee.kicker}</Reveal>
          <Reveal as="h2" id="partner-garanzia" className="mt-6 max-w-[1100px]" style={{ fontSize: 'clamp(2.25rem, 4.4vw, 4.5rem)', letterSpacing: '-0.05em', lineHeight: 1 }}>
            {guarantee.title}
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-24">
            {guarantee.paragraphs.map((text, i) => (
              <Reveal key={text} as="p" delay={i * 0.08} className="lead m-0 max-w-[560px] text-gray-700">{text}</Reveal>
            ))}
          </div>
        </PaperBlock>
      </section>

      {/* Cosa faccio: card con prezzo e tempi dei pacchetti, se ci sono. */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="partner-servizi">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="partner-servizi" className="h-l">{services.title}</Reveal>
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-[100px] md:grid-cols-2">
            {services.items.map((item, i) => (
              <Reveal key={item.title} as="article" delay={(i % 2) * 0.1} className="bc h-full">
                <h3 style={CARD_TITLE_STYLE}>{item.title}</h3>
                <p className="d">{item.text}</p>
                {item.price && (
                  <div className="meta">
                    <div>
                      <small>{item.priceLabel}</small>
                      <p className="price m-0">{item.price}</p>
                    </div>
                    {item.timing && <p className="m-0 max-w-[340px] text-[16px] leading-[1.5]">{item.timing}</p>}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sul prezzo / Chi sono: due colonne di testo. */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" className="h-l" style={SECTION_TITLE_STYLE}>{pricing.title}</Reveal>
            <Reveal as="p" className="lead mt-8 max-w-[620px] text-gray-700">{pricing.text}</Reveal>
          </div>
          <div>
            <Reveal as="h2" className="h-l" style={SECTION_TITLE_STYLE}>{about.title}</Reveal>
            {about.paragraphs.map((text, i) => (
              <Reveal key={text} as="p" delay={i * 0.08} className="lead mt-8 max-w-[620px] text-gray-700">{text}</Reveal>
            ))}
          </div>
        </div>
      </section>

      <CloseCta
        size="l"
        title={close.title}
        lead={close.lead}
        cta={{ label: book.label, href: book.href, external: true, onClick: track(book.label, book.href) }}
      />
    </article>
  );
};

export default TechnicalPartner;
