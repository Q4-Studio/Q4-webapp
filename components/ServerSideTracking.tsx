import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Plus } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import TrackingLossCalculator from './TrackingLossCalculator';
import { Bullets, NoteCard, OkIcon, PaperBlock } from './home2/primitives';
import { trackingFaqs, trackingOffer, trackingPackages, trackingSchemaFaqs, type TrackingPackage } from '../data/servicePages';
import { siteUrl } from '../data/seoPages';
import { candianiFigures } from '../data/caseStudies';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Pagina "Tracciamento server-side" sul sistema chiaro (mockup        */
/* "Tracciamento server-side"): hero scuro, "Cosa sta succedendo" con  */
/* il confronto 40/90, blocco carta "Come lo risolviamo", risposta     */
/* ad blocker con quattro righe, bento dei pacchetti, chiusura          */
/* Candiani, FAQ, approfondimenti e chiusura con CTA audit.            */
/* ------------------------------------------------------------------ */

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Tracciamento Server-Side per Meta e Google',
  description: 'Container server-side, Consent Mode v2, Conversions API e Enhanced Conversions per recuperare i segnali di conversione persi da browser e ad blocker.',
  provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
  areaServed: 'IT',
  url: `${siteUrl}/tracciamento-server-side`,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Pacchetti tracciamento server-side',
    itemListElement: trackingPackages.map(trackingOffer),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  // FAQ visibili + domanda ad blocker in seconda posizione (data/servicePages.ts).
  mainEntity: trackingSchemaFaqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Tracciamento Server-Side', item: `${siteUrl}/tracciamento-server-side` },
  ],
};

const steps = [
  { n: '01', title: 'Audit', desc: 'Audit di eventi, consenso, browser e CRM.' },
  { n: '02', title: 'Configurazione', desc: 'Configurazione del container e delle integrazioni API.' },
  { n: '03', title: 'Deduplicazione', desc: 'Deduplicazione e test con eventi reali.' },
  { n: '04', title: 'Monitoraggio', desc: 'Monitoraggio e documentazione per il team.' },
];

const related = [
  { tag: 'Guida', title: 'Tracking server-side e deduplicazione degli eventi', desc: 'Come evitare di contare due volte la stessa conversione.', href: '/risorse/tracking-server-side-deduplicazione-eventi' },
  { tag: 'Dopo', title: 'Dopo il tracciamento: agenti AI e automazioni', desc: 'Con i dati a posto, si può automatizzare.', href: '/agenti-ai' },
];

const HERO_WORDS = ['Il', 'tuo', 'account', 'pubblicitario', 'vede', 'meno', 'conversioni', 'di', 'quelle', 'che', 'fai.'];

/** Barra che si riempie da sinistra quando entra in viewport. */
const Bar: React.FC<{ width: string; background: string }> = ({ width, background }) => {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Stato iniziale applicato prima del primo paint: niente barra piena che
    // sparisce e si riempie di nuovo.
    const tween = gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.4,
      ease: 'power3.out',
      immediateRender: true,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'transform' });
    };
  }, []);
  return (
    <div className="bar">
      <i ref={ref} style={{ width, background }} />
    </div>
  );
};

const Comparison: React.FC = () => (
  <Reveal delay={0.12} className="mock p-8 md:p-10">
    <p className="mb-7 text-sm text-gray-500">Esempio</p>
    <div className="mb-2.5 flex items-baseline justify-between">
      <span className="font-semibold text-[#0a0a0a]">Account pubblicitario</span>
      <span className="disp text-4xl">40</span>
    </div>
    <Bar width="44%" background="#0a0a0a" />
    <div className="mb-2.5 mt-9 flex items-baseline justify-between">
      <span className="font-semibold text-[#0a0a0a]">Gestionale</span>
      <span className="disp text-4xl">90</span>
    </div>
    <Bar width="100%" background="linear-gradient(90deg, #818cf8, #9333ea)" />
  </Reveal>
);

const PackageColumn: React.FC<{ pack: TrackingPackage; offset?: string; delay?: number; children: React.ReactNode; background?: string }> = ({ pack, offset = '', delay = 0, children, background }) => (
  <div className={`flex min-w-0 flex-1 flex-col ${offset}`}>
    <Reveal as="article" delay={delay} className="bc" style={{ minHeight: 700, paddingBottom: 120, background }}>
      <h3>{pack.title}</h3>
      <p className="d">{pack.timing}</p>
      <Bullets items={pack.items} />
      <div className="meta">
        <div><small>{pack.priceLabel}</small><p className="price">{pack.price}</p></div>
      </div>
    </Reveal>
    {children}
  </div>
);

const DOC_LINK = 'relative underline decoration-white/40 underline-offset-4 hover:text-white';

const ServerSideTracking: React.FC = () => {

  const scrollTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToId(id, id === 'contatti' ? 'center' : 'start')) event.preventDefault();
  };

  return (
    <article className="relative">
      <SEOHead title="Tracciamento Server-Side per Meta e Google | Q4 Studio" description="Recuperiamo i segnali di conversione che browser e ad blocker bloccano. Setup server-side, Consent Mode v2, Conversions API. Audit da 490 €." url={`${siteUrl}/tracciamento-server-side`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero scuro: id="hero" tiene bianchi logo e hamburger della nav
          finché non si scorre oltre (vedi App.tsx). */}
      <header id="hero" className="dark-block relative flex min-h-[640px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[780px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-24 pt-36 md:px-12 md:pt-40">
          <h1 className="h-sub max-w-[1250px]">
            {HERO_WORDS.map((word, i) => (
              <React.Fragment key={word}>
                <span className="w" style={{ animationDelay: `${0.15 + i * 0.07}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w-block lead mt-12 max-w-[620px] text-gray-300" style={{ animationDelay: '1.1s' }}>
            Non è un problema di campagne. È un problema di raccolta dati.
          </p>
          <div className="w-block mt-12" style={{ animationDelay: '1.25s' }}>
            <a
              href="#pacchetti"
              onClick={(event) => {
                trackCtaClick({ cta_location: 'server_side_tracking_page', cta_label: 'Vedi i pacchetti', cta_destination: '#pacchetti' });
                scrollTo('pacchetti')(event);
              }}
              className="btn btn-white"
            >
              Vedi i pacchetti
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Cosa sta succedendo */}
      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[140px] md:pt-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Cosa sta succedendo.</Reveal>
          <div className="mt-20 grid grid-cols-1 items-start gap-12 md:mt-[80px] md:grid-cols-2 md:gap-24">
            <div>
              <Reveal as="p" className="lead max-w-[560px]">Safari e Firefox limitano i cookie di terze parti. Gli ad blocker bloccano i pixel. Il consenso negato interrompe la raccolta. Il risultato è che Meta e Google vedono una parte delle tue conversioni, e ottimizzano su quella parte.</Reveal>
              <Reveal as="p" delay={0.12} className="lead mt-7 max-w-[560px]">Se il tuo account dice 40 conversioni e il tuo gestionale dice 90, non è un errore di lettura: è il tracciamento che non arriva.</Reveal>
            </div>
            <Comparison />
          </div>
        </div>
      </section>

      {/* Stima dei segnali persi: calcolatore lato client */}
      <TrackingLossCalculator />

      {/* Come lo risolviamo: blocco carta arrotondato */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <PaperBlock>
          <Reveal as="h2" className="h-l max-w-[1000px]">Come lo risolviamo.</Reveal>
          <div className="mt-16 grid grid-cols-1 items-start gap-12 md:mt-[72px] md:grid-cols-2 md:gap-24">
            <div>
              <Reveal as="p" className="lead max-w-[560px] text-gray-700">Spostiamo la raccolta dati dal browser a un container server-side su infrastruttura dedicata. I segnali passano da lì, vengono normalizzati e inviati alle piattaforme via API server-to-server.</Reveal>
              <Reveal as="p" delay={0.12} className="lead mt-7 max-w-[560px] text-gray-700">Aggiungiamo i segnali che contano davvero: non l'invio del form, ma la qualificazione, la risposta del prospect, l'avanzamento nel CRM. Sono i segnali che l'algoritmo usa per cercare persone simili a chi compra, non a chi compila.</Reveal>
            </div>
            <Reveal delay={0.12} className="mock">
              <div className="ev"><OkIcon />Lead qualificato · Conversions API<em>inviato</em></div>
              <div className="ev"><OkIcon />Risposta del prospect · Enhanced Conversions<em>inviato</em></div>
              <div className="ev"><OkIcon />Avanzamento nel CRM · Meta e Google<em>sincronizzato</em></div>
              <div className="ev"><OkIcon />Consent Mode v2<em>rispettato</em></div>
            </Reveal>
          </div>
        </PaperBlock>
      </section>

      {/* Risposta tecnica: ad blocker */}
      <section id="ad-blocker-conversioni" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Come recuperare le conversioni bloccate dagli ad blocker.</Reveal>
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-[80px] md:grid-cols-2 md:gap-24">
            <Reveal as="p" className="lead max-w-[560px]">Non si recuperano installando un altro pixel. Prima si confrontano dati della piattaforma, analytics, CRM e processo commerciale per capire quali eventi mancano. Poi si sposta la raccolta compatibile con il consenso su un container server-side e si inviano a Meta o Google gli eventi che descrivono davvero il percorso del lead.</Reveal>
            <Reveal as="p" delay={0.12} className="lead max-w-[560px]">Se un evento parte sia dal browser sia dal server, deve avere lo stesso identificativo: la deduplicazione evita che una conversione venga contata due volte. Il server-side riduce alcune perdite tecniche, ma non bypassa consenso, informativa o regole privacy.</Reveal>
          </div>
          <div className="mt-24 md:mt-[96px]">
            {steps.map((step) => (
              <Reveal key={step.n} as="article" className="row">
                <span className="tm">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pacchetti */}
      <section id="pacchetti" className="scroll-mt-24 px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">I pacchetti.</Reveal>
          <div className="mt-20 flex flex-col gap-6 md:mt-[80px] lg:flex-row lg:items-start">
            <PackageColumn pack={trackingPackages[0]} background="linear-gradient(170deg, #f7f5fb 0%, #efe7fb 100%)">
              <NoteCard text={trackingPackages[0].note!} />
            </PackageColumn>
            <PackageColumn pack={trackingPackages[1]} offset="lg:mt-[120px]" delay={0.12} background="linear-gradient(150deg, #f7f5fb 0%, #ecdffb 100%)">
              <NoteCard text={trackingPackages[1].note!} delay={0.12} />
            </PackageColumn>
            <PackageColumn pack={trackingPackages[2]} offset="lg:mt-10" delay={0.2}>
              <Reveal as="article" delay={0.2} className="bc ov dark-block justify-end text-white" style={{ minHeight: 300, background: '#050505' }}>
                <div className="aur" aria-hidden="true" style={{ width: 360, height: 360, background: 'rgba(147,51,234,.5)', right: -100, top: -140, filter: 'blur(80px)' }} />
                <p className="d relative text-gray-300" style={{ marginTop: 0 }}>
                  Documentazione ufficiale:{' '}
                  <a href="https://developers.google.com/tag-platform/tag-manager/server-side" target="_blank" rel="noopener noreferrer" className={DOC_LINK}>Google Tag Manager server-side</a>,{' '}
                  <a href="https://developers.facebook.com/docs/marketing-api/conversions-api/" target="_blank" rel="noopener noreferrer" className={DOC_LINK}>Meta Conversions API</a>,{' '}
                  <a href="https://support.google.com/google-ads/answer/9888656" target="_blank" rel="noopener noreferrer" className={DOC_LINK}>Google Enhanced Conversions</a>.
                </p>
              </Reveal>
            </PackageColumn>
          </div>
        </div>
      </section>

      {/* Caso reale: blocco scuro allineato a sinistra. Numeri da candianiFigures. */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <div className="close dark-block px-7 py-24 md:px-12 md:py-[100px]">
          <div className="aur aur-1 opacity-80" aria-hidden="true" />
          <div className="aur aur-2 opacity-80" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1440px]">
            <Reveal as="h2" style={{ fontSize: 'clamp(3rem, 11vw, 11.5rem)', letterSpacing: '-0.06em', lineHeight: 0.92 }}>{candianiFigures.recovered} segnali recuperati in {candianiFigures.windowLabel}.</Reveal>
            <Reveal as="p" delay={0.12} className="lead mt-14 max-w-[720px] text-gray-300">{`Su Candiani Denim abbiamo recuperato ${candianiFigures.recovered} segnali di conversione in ${candianiFigures.windowLabel}, di cui ${candianiFigures.trackingPrevention} bloccati dai sistemi di tracking prevention dei browser e ${candianiFigures.adBlockers} dagli ad blocker.`}</Reveal>
            <Reveal delay={0.2} className="mt-12">
              <a
                href="/casi-studio/candiani-denim-tracking-server-side"
                onClick={onInternalLink('/casi-studio/candiani-denim-tracking-server-side', () =>
                  trackCtaClick({ cta_location: 'server_side_tracking_page', cta_label: 'Leggi il caso studio completo', cta_destination: '/casi-studio/candiani-denim-tracking-server-side' }),
                )}
                className="btn btn-white"
              >
                Leggi il caso studio completo
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
          <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
            {trackingFaqs.map(({ question, answer }, i) => (
              <details key={question} className="f" open={i === 0}>
                <summary>
                  <h3>{question}</h3>
                  <span className="pl" aria-hidden="true"><Plus className="h-[18px] w-[18px]" /></span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Approfondisci */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Approfondisci</Reveal>
          <div className="mt-20 md:mt-[80px]">
            {related.map((item) => (
              <Reveal key={item.href} as="div" className="row">
                <span className="tm">{item.tag}</span>
                <h3><a href={item.href} onClick={onInternalLink(item.href)} className="no-underline hover:text-purple-700">{item.title}</a></h3>
                <p>{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CloseCta
        size="l"
        title="Non sai se il tuo tracciamento è a posto?"
        lead="L'audit da 490 € ti dà una risposta documentata in cinque giorni."
        cta={{
          label: "Richiedi l'audit",
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'server_side_tracking_page', cta_label: "Richiedi l'audit", cta_destination: '#contatti' });
            scrollTo('contatti')(event);
          },
        }}
      />
    </article>
  );
};

export default ServerSideTracking;
