import React from 'react';
import { resourceGroups, resourcesIndexCopy, resourcesPath, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import SubHero from './home2/SubHero';
import ResourceCard from './ResourceCard';
import { trackCtaClick } from '../utils/dataLayer';
import { scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Indice delle risorse sul sistema chiaro (mockup Risorse.html): hero  */
/* scuro corto, card per ogni risorsa raggruppate per pagina hub del    */
/* cluster (il mockup ha una griglia unica, vedi D-033) e chiusura.     */
/* Form contatti e footer chiari stanno in App.tsx.                     */
/* ------------------------------------------------------------------ */

const SeoDirectory: React.FC = () => {
  const pageUrl = `${siteUrl}${resourcesPath}`;

  // Schema JSON-LD solo nello <head> del mirror statico (scripts/prerender.ts): qui
  // un secondo blocco identico finirebbe nel DOM dopo il mount (D-052).
  const { close } = resourcesIndexCopy;

  return (
    <section className="relative">
      <SEOHead title={resourcesIndexCopy.metaTitle} description={resourcesIndexCopy.metaDescription} url={pageUrl} />

      <SubHero kicker={resourcesIndexCopy.kicker} title={resourcesIndexCopy.title} lead={resourcesIndexCopy.lead} />

      {/* Card raggruppate per pagina hub: intestazione h2 per gruppo, h3 per risorsa. */}
      <div className="px-6 pb-24 pt-24 md:px-12 md:pb-[160px] md:pt-[160px]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-24 md:gap-[140px]">
          {resourceGroups.map((group) => (
            <section key={group.id} aria-labelledby={`risorse-${group.id}`}>
              <Reveal as="h2" id={`risorse-${group.id}`} className="h-l" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {group.hub.label}.
              </Reveal>
              <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {group.pages.map((page, i) => (
                  <ResourceCard key={page.slug} page={page} delay={(i % 3) * 0.1} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <CloseCta
        size="l"
        title={close.title}
        lead={close.lead}
        cta={{
          label: close.cta,
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'resources_index', cta_label: close.cta, cta_destination: '#contatti' });
            if (scrollToId('contatti', 'center')) event.preventDefault();
          },
        }}
      />
    </section>
  );
};

export default SeoDirectory;
