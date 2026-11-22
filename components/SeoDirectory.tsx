import React from 'react';
import { resourceGroups, resourcePagesInOrder, resourcesIndexCopy, resourcesPath, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import ResourceCard from './ResourceCard';
import { trackCtaClick } from '../utils/dataLayer';
import { scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Indice delle risorse sul sistema chiaro (mockup Risorse.html): hero  */
/* scuro corto, card per ogni risorsa raggruppate per pagina hub del    */
/* cluster (il mockup ha una griglia unica, vedi D-033) e chiusura.     */
/* Form contatti e footer chiari stanno in App.tsx.                     */
/* ------------------------------------------------------------------ */

const TITLE_WORDS = resourcesIndexCopy.title.split(' ');

const SeoDirectory: React.FC = () => {
  const pageUrl = `${siteUrl}${resourcesPath}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Risorse Q4 Studio',
    itemListElement: resourcePagesInOrder.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.title,
      url: `${pageUrl}/${page.slug}`
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Risorse', item: pageUrl }
    ]
  };

  const { close } = resourcesIndexCopy;

  return (
    <section className="relative">
      <SEOHead title={resourcesIndexCopy.metaTitle} description={resourcesIndexCopy.metaDescription} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero scuro corto: id="hero" tiene bianchi logo e hamburger della nav. */}
      <header id="hero" className="dark-block relative flex min-h-[520px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[640px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-40">
          <p className="w-block text-[17px] font-medium text-purple-300" style={{ animationDelay: '0.05s' }}>{resourcesIndexCopy.kicker}</p>
          <h1 className="h-sub mt-8 max-w-[1250px]">
            {TITLE_WORDS.map((word, i) => (
              <React.Fragment key={`${word}-${i}`}>
                <span className="w" style={{ animationDelay: `${(0.15 + i * 0.07).toFixed(2)}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w-block lead mt-12 max-w-[640px] text-gray-300" style={{ animationDelay: '0.84s' }}>
            {resourcesIndexCopy.lead}
          </p>
        </div>
      </header>

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
