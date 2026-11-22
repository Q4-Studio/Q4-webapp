import React from 'react';
import { ArrowUpRight, Bot, Clock, Plus, Target, Users } from 'lucide-react';
import {
  asHeading,
  asSentence,
  clusterHub,
  getRelatedSeoPages,
  resourceArticleCopy as copy,
  resourceKicker,
  resourcesPath,
  SeoPage,
  siteUrl
} from '../data/seoPages';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import SubHero from './home2/SubHero';
import { OkIcon, PaperBlock } from './home2/primitives';
import ResourceCard, { IconBox } from './ResourceCard';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Articolo risorsa sul sistema chiaro (mockup Articolo.html): hero     */
/* scuro corto, risposta diretta, per chi/problema/risultato, dati,     */
/* approfondimenti, confronto, come interveniamo, FAQ, argomenti        */
/* correlati e chiusura. Form contatti e footer chiari in App.tsx.      */
/* ------------------------------------------------------------------ */

interface SeoLandingPageProps {
  page: SeoPage;
}

const CARD_TITLE_STYLE: React.CSSProperties = { fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 };

const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ page }) => {
  const pageUrl = `${siteUrl}${resourcesPath}/${page.slug}`;
  const hub = clusterHub[page.cluster];
  const relatedPages = getRelatedSeoPages(page);

  // Schema JSON-LD solo nello <head> del mirror statico (scripts/prerender.ts): qui
  // un secondo blocco identico finirebbe nel DOM dopo il mount (D-052).

  const profile = [
    { icon: Users, title: copy.audience, text: page.audience },
    { icon: Clock, title: copy.pain, text: page.pain },
    { icon: Target, title: copy.proof, text: page.proof },
  ];

  return (
    <article className="relative">
      <SEOHead title={page.metaTitle} description={page.description} url={pageUrl} type="article" />

      <SubHero kicker={resourceKicker(page)} title={page.title} lead={page.description} minHeightClass="min-h-[560px] md:min-h-[680px]">
        {/* Link spoke→hub: ogni risorsa porta alla pagina di offerta del suo cluster. */}
        <a
          href={hub.path}
          onClick={(event) => {
            trackCtaClick({ cta_location: 'resource_page_hero', cta_label: copy.heroCta, cta_destination: hub.path });
            onInternalLink(hub.path)(event);
          }}
          className="btn btn-white"
        >
          {copy.heroCta}
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </a>
      </SubHero>

      {/* Risposta diretta: blocco carta con la risposta in una card bianca. */}
      <section className="px-6 pb-24 pt-24 md:pb-[160px] md:pt-[160px]">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" className="h-l" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{copy.directAnswer}</Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="mock p-7 md:p-11">
              <div className="mb-6"><IconBox icon={Bot} /></div>
              <p className="m-0 text-[20px] font-medium leading-[1.55] text-[#0a0a0a]">{page.directAnswer}</p>
            </div>
          </Reveal>
        </PaperBlock>
      </section>

      {/* Per chi, problema, risultato */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">{copy.profile}</Reveal>
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-[120px] lg:grid-cols-3">
            {profile.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="bc static min-h-[360px] gap-7">
                <IconBox icon={item.icon} />
                <div className="mt-auto">
                  <h3 style={CARD_TITLE_STYLE}>{item.title}</h3>
                  <p className="mt-3.5 text-base leading-[1.6]">{asSentence(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dati e risultati: non previsti dal mockup, nello stile della fila
          di cifre (colonne con filo a sinistra) che occupa questo punto. */}
      {page.dataPoints.length > 0 && (
        <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
          <div className="mx-auto max-w-[1440px]">
            <Reveal as="h2" className="h-l max-w-[1100px]" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>{copy.dataPoints}</Reveal>
            <ul className="mt-16 grid list-none grid-cols-1 gap-10 p-0 md:mt-20 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              {page.dataPoints.map((point, i) => (
                <li key={point} className="m-0">
                  <Reveal delay={(i % 4) * 0.1} className="h-full py-2 pl-8" style={{ borderLeft: '1px solid rgba(10,10,10,.12)' }}>
                    <p className="m-0 text-[19px] font-medium leading-[1.55] text-[#0a0a0a]">{asSentence(point)}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Approfondimenti: righe titolo | testo */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l mb-16 max-w-[1100px] md:mb-24">{copy.clusters}</Reveal>
          <div style={{ borderBottom: '1px solid rgba(10,10,10,.09)' }}>
            {page.clusters.map((cluster) => (
              <Reveal key={cluster.keyword} className="grid grid-cols-1 gap-5 py-10 md:py-14 lg:grid-cols-[420px_1fr] lg:gap-[72px]" style={{ borderTop: '1px solid rgba(10,10,10,.09)' }}>
                <h3 style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.08 }}>{cluster.heading}</h3>
                <p className="m-0 max-w-[760px] text-[19px] leading-[1.7]">{cluster.content}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Confronto: tabella in una card bianca, scorrevole in orizzontale su mobile */}
      {page.comparisonTable && (
        <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
          <div className="mx-auto max-w-[1440px]">
            <Reveal as="h2" className="h-l mb-16 max-w-[1100px] md:mb-24">{asHeading(page.comparisonTable.title || copy.comparison)}</Reveal>
            <Reveal className="mock overflow-x-auto p-2">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    {page.comparisonTable.headers.map((header) => (
                      <th key={header} scope="col" className="whitespace-nowrap px-6 py-[22px] text-[16px] font-medium text-[#6b7280]">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.rows.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(10,10,10,.08)' }}>
                      {row.map((cell, j) => (
                        j === 0
                          ? <th key={j} scope="row" className="min-w-[180px] p-6 text-[19px] font-semibold leading-[1.45] text-[#0a0a0a]">{cell}</th>
                          : <td key={j} className="min-w-[180px] p-6 text-[19px] leading-[1.45] text-[#0a0a0a]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>
      )}

      {/* Come interveniamo: blocco carta con soluzione e passaggi */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>{copy.services}</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">{asSentence(page.solution)}</Reveal>
          </div>
          <Reveal delay={0.12}>
            {/* Righe ferme (`.ev.static`): niente evidenziazione ciclica, che
                nel mockup della home simula eventi in arrivo, non passaggi. */}
            <ol className="mock m-0 list-none p-0">
              {page.services.map((service, i) => (
                <li key={service} className="ev static">
                  <OkIcon />
                  {service}
                  <em>{i + 1}</em>
                </li>
              ))}
            </ol>
          </Reveal>
        </PaperBlock>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">{copy.faq}</Reveal>
          <Reveal delay={0.12} className="mt-16 md:mt-[120px]">
            {page.faqs.map((faq, i) => (
              <details key={faq.question} className="f" open={i === 0}>
                <summary>
                  <h3>{faq.question}</h3>
                  <span className="pl" aria-hidden="true"><Plus className="h-[18px] w-[18px]" /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Argomenti correlati */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l mb-16 max-w-[1100px] md:mb-[120px]">{copy.related}</Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPages.map((related, i) => (
              <ResourceCard key={related.slug} page={related} delay={i * 0.1} minHeight={240} />
            ))}
          </div>
        </div>
      </section>

      <CloseCta
        size="l"
        title={copy.close.title}
        lead={copy.close.lead}
        cta={{
          label: copy.close.cta,
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'resource_page', cta_label: copy.close.cta, cta_destination: '#contatti' });
            if (scrollToId('contatti', 'center')) event.preventDefault();
          },
        }}
      />
    </article>
  );
};

export default SeoLandingPage;
