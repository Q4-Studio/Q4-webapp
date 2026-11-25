import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import { ErgoottoLogo, MorinatLogo, QORLogo, TrenoveLogo } from './clients/ClientLogos';
import { clientHref, clients, clientsCopy as copy, clientsPath, type Client } from '../data/clientsPage';
import { siteUrl } from '../data/seoPages';
import { trackCaseStudyClick, trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Pagina "Clienti" sul sistema chiaro (mockup Clienti di Q4 Studio):  */
/* hero scuro corto senza kicker con CTA "Parla con noi", griglia di   */
/* card logo `.ct` (quattro colonne, due sotto i 1000px) che al        */
/* passaggio diventano bianche, colorano il logo e mostrano cosa       */
/* abbiamo fatto; ultima card scura verso il form; chiusura. Testi e   */
/* clienti in data/clientsPage.ts (gli stessi del mirror statico).     */
/* Form contatti e footer chiari in App.tsx. Raggiungibile solo dal    */
/* footer, non dal menu principale.                                    */
/* ------------------------------------------------------------------ */

const VECTOR_LOGOS: Record<NonNullable<Client['vector']>, React.FC> = {
  qor: QORLogo,
  trenove: TrenoveLogo,
  ergootto: ErgoottoLogo,
  morinat: MorinatLogo,
};

const CTA_LOCATION = 'clients_page';

const scrollToContact = (label: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
  trackCtaClick({ cta_location: CTA_LOCATION, cta_label: label, cta_destination: '#contatti' });
  if (scrollToId('contatti', 'center')) event.preventDefault();
};

const ClientLogo: React.FC<{ client: Client }> = ({ client }) => {
  if (client.vector) {
    const Logo = VECTOR_LOGOS[client.vector];
    return <Logo />;
  }
  if (!client.logo) return null;
  const { src, width, height, widthPercent, dark } = client.logo;
  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`ph${dark ? ' dk' : ''}`}
      style={{ width: `${widthPercent}%` }}
    />
  );
};

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
  const inner = (
    <>
      <div className="lgw">
        <ClientLogo client={client} />
      </div>
      <span className="sr-only">{client.name}</span>
      <div className="lab">
        <span>{client.work}</span>
        {client.caseStudy && <ArrowUpRight aria-hidden="true" />}
      </div>
    </>
  );

  if (client.caseStudy) {
    const href = clientHref(client);
    return (
      <a
        href={href}
        className="ct"
        onClick={(event) => {
          trackCaseStudyClick({ case_study_slug: client.caseStudy, case_study_client: client.name, cta_location: CTA_LOCATION });
          onInternalLink(href)(event);
        }}
      >
        {inner}
      </a>
    );
  }
  // Card senza link: non è focusabile (il tabindex del mockup creava fermate
  // di tabulazione senza azione); nome ed etichetta sono comunque nel DOM
  // per gli screen reader, e su touch la fascia è sempre in vista.
  return <div className="ct">{inner}</div>;
};

const ClientsPage: React.FC = () => (
  <article className="relative">
    <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={`${siteUrl}${clientsPath}`} />

    <SubHero title={copy.title} lead={copy.lead}>
      <a href="#contatti" onClick={scrollToContact(copy.heroCta)} className="btn btn-white">
        {copy.heroCta}
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </a>
    </SubHero>

    <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[240px] md:pt-[220px]" aria-labelledby="clienti-elenco">
      <div className="mx-auto max-w-[1440px]">
        <Reveal as="h2" id="clienti-elenco" className="h-l mb-16 max-w-[1100px] md:mb-[120px]">{copy.listTitle}</Reveal>
        <ul className="cl m-0 list-none p-0">
          {clients.map((client, i) => (
            <Reveal key={client.name} as="li" delay={(i % 4) * 0.1}>
              <ClientCard client={client} />
            </Reveal>
          ))}
          <Reveal as="li" delay={(clients.length % 4) * 0.1}>
            <a href="#contatti" onClick={scrollToContact(copy.nextCard.cta)} className="ct ct-cta">
              <div className="flex h-full w-full flex-col justify-between gap-5 text-left">
                <span className="disp">{copy.nextCard.title}</span>
                <span className="flex items-center gap-2.5 font-semibold text-purple-200">
                  {copy.nextCard.cta}
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </a>
          </Reveal>
        </ul>
      </div>
    </section>

    <CloseCta
      size="l"
      title={copy.close.title}
      lead={copy.close.lead}
      cta={{ label: copy.close.cta, href: '#contatti', onClick: scrollToContact(copy.close.cta) }}
    />
  </article>
);

export default ClientsPage;
