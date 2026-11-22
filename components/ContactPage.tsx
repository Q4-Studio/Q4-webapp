import React from 'react';
import { Bot, Globe, Mail, MessageSquare, Search, Server } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import { OkIcon, PaperBlock } from './home2/primitives';
import { IconBox } from './ResourceCard';
import { CompanyCard, contactPageCopy as copy } from '../data/companyPages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Contatti sul sistema chiaro (mockup Contatti.html). Testi e prezzi   */
/* da data/companyPages.ts, gli stessi del mirror statico e del         */
/* markdown in scripts/prerender.ts. Il form vero (#contatti) e il      */
/* footer chiaro stanno in App.tsx, subito dopo la chiusura.            */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const CARD_TITLE_STYLE: React.CSSProperties = { fontSize: 'clamp(1.4rem, 1.9vw, 1.9rem)', letterSpacing: '-0.035em', lineHeight: 1.08 };

const goToForm = (location: string, label: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
  trackCtaClick({ cta_location: location, cta_label: label, cta_destination: '#contatti' });
  if (scrollToId('contatti', 'center')) event.preventDefault();
};

/** Card del mockup: fondo carta, icona in alto, titolo e testo in basso; link se ha href. */
const InfoCard: React.FC<{ card: CompanyCard; icon: IconType; delay: number; minHeight: number }> = ({ card, icon, delay, minHeight }) => {
  const body = (
    <>
      <IconBox icon={icon} />
      <div className="mt-auto">
        <h3 style={CARD_TITLE_STYLE}>{card.title}</h3>
        <p className="mt-3 text-base leading-[1.55]">{card.text}</p>
      </div>
    </>
  );
  return (
    <Reveal delay={delay} className="h-full">
      {card.href ? (
        <a
          href={card.href}
          onClick={card.href.startsWith('/') ? onInternalLink(card.href) : undefined}
          className="bc h-full gap-6 no-underline"
          style={{ minHeight }}
        >
          {body}
        </a>
      ) : (
        <div className="flex h-full flex-col gap-6 rounded-[32px] bg-[#f7f5fb] px-7 py-8 md:p-11" style={{ minHeight }}>
          {body}
        </div>
      )}
    </Reveal>
  );
};

const CHANNEL_ICONS: IconType[] = [Mail, MessageSquare, Globe];
const START_ICONS: IconType[] = [Search, Server, Bot];

const ContactPage: React.FC = () => {
  const pageUrl = `${siteUrl}/contact`;
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: copy.metaTitle,
    url: pageUrl,
    mainEntity: { '@id': `${siteUrl}/#organization` },
  };

  return (
    <section className="relative">
      <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      <SubHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />

      {/* Come ci trovi: testo a sinistra, anteprima del form a destra. Il form
          vero è la sezione #contatti in fondo: il bottone porta lì. */}
      <section className="px-6 pb-24 pt-24 md:pb-[160px] md:pt-[160px]" aria-labelledby="come-ci-trovi">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" id="come-ci-trovi" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>{copy.find.title}</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">{copy.find.lead}</Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="mock grid gap-[22px] bg-white p-7 md:p-11">
              <div className="grid gap-[22px]" aria-hidden="true">
                {copy.find.formFields.map((field, i) => (
                  <div key={field}>
                    <p className="mb-2.5 text-[16px] font-semibold text-[#0a0a0a]">{field}</p>
                    <div className="rounded-2xl bg-white" style={{ height: i === copy.find.formFields.length - 1 ? 140 : 56, boxShadow: '0 0 0 1px rgba(10,10,10,.1)' }} />
                  </div>
                ))}
              </div>
              <a href="#contatti" onClick={goToForm('contact_page_preview', copy.find.formCta)} className="btn btn-dark justify-center">
                {copy.find.formCta}
              </a>
            </div>
          </Reveal>
        </PaperBlock>
      </section>

      {/* Canali diretti */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="canali-diretti">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="canali-diretti" className="h-l mb-16 max-w-[1100px] md:mb-[120px]">{copy.channels.title}</Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {copy.channels.items.map((card, i) => (
              <InfoCard key={card.title} card={card} icon={CHANNEL_ICONS[i] ?? Mail} delay={i * 0.1} minHeight={260} />
            ))}
          </div>
        </div>
      </section>

      {/* Cosa scrivere per una risposta utile */}
      <section className="px-6 pb-24 md:pb-[160px]" aria-labelledby="cosa-scrivere">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" id="cosa-scrivere" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>{copy.brief.title}</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">{copy.brief.lead}</Reveal>
          </div>
          <Reveal delay={0.12}>
            <ul className="mock m-0 list-none p-0">
              {copy.brief.items.map((item) => (
                <li key={item.label} className="ev flex-wrap">
                  <OkIcon />
                  {item.label}
                  <em style={{ whiteSpace: 'normal', textAlign: 'right' }}>{item.hint}</em>
                </li>
              ))}
            </ul>
          </Reveal>
        </PaperBlock>
      </section>

      {/* Punti di partenza: prezzi e tempi dai pacchetti di data/servicePages.ts */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="punti-di-partenza">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="punti-di-partenza" className="h-l mb-16 max-w-[1100px] md:mb-[120px]">{copy.startingPoints.title}</Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {copy.startingPoints.items.map((card, i) => (
              <InfoCard key={card.title} card={card} icon={START_ICONS[i] ?? Search} delay={i * 0.1} minHeight={280} />
            ))}
          </div>
        </div>
      </section>

      <CloseCta
        size="l"
        title={copy.close.title}
        lead={copy.close.lead}
        cta={{ label: copy.close.cta, href: '#contatti', onClick: goToForm('contact_page', copy.close.cta) }}
      />
    </section>
  );
};

export default ContactPage;
