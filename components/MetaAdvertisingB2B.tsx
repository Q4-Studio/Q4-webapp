import React from 'react';
import { ArrowRight, ArrowUpRight, Bot, ChartColumn, Database, Layers, MessageSquare, Plus, RefreshCw, Search, Server, Target } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import { Bullets, NoteCard, PAPER_BG, PaperBlock } from './home2/primitives';
import { metaAdvertisingFaqs } from '../data/servicePages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Pagina "Meta Ads B2B" sul sistema chiaro (mockup "Meta Ads B2B"):   */
/* hero scuro con aurora, manifesto, tre cifre, metodo, blocco carta   */
/* con il funnel, flusso dal click al segnale, bento agenti AI, FAQ e  */
/* chiusura verso il tracciamento. Classi .home-light in index.css;    */
/* reveal allo scroll via <Reveal>.                                    */
/* ------------------------------------------------------------------ */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: metaAdvertisingFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Meta Advertising B2B Lead Generation',
  description: 'Consulenza Meta Ads per aziende B2B: campagne orientate alla qualità del contatto, tracciamento server-side e segnali CRM.',
  provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
  areaServed: 'IT',
  url: `${siteUrl}/meta-advertising-b2b`,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Meta Advertising B2B', item: `${siteUrl}/meta-advertising-b2b` },
  ],
};

const HERO_WORDS = ['Meta', 'Ads', 'B2B,', 'con', 'il', 'tracciamento', 'fatto', 'bene', 'a', 'monte.'];

const figures = [
  { value: '2', desc: 'Piattaforme: Meta Ads e Google Ads, con lo stesso approccio.', delay: 0 },
  { value: '3', desc: 'Segnali di qualità verso l’algoritmo: domanda qualificante, risposta, stage commerciale.', delay: 0.1 },
  { value: '3', desc: 'KPI di business: clienti, appuntamenti, opportunità. Non il costo per contatto.', delay: 0.2 },
];

const method = [
  { icon: Search, title: 'Diagnosi prima delle campagne', desc: 'Audit di funnel, audience, offerta e gestione lead prima di aumentare budget o test creativi.', delay: 0 },
  { icon: Layers, title: 'Sistema, non singola ads', desc: 'Campagne, CRM e follow-up progettati insieme per ridurre dispersione e tempi morti.', delay: 0.12 },
  { icon: ChartColumn, title: 'Governance dei KPI', desc: 'Misuriamo contatti che diventano clienti, appuntamenti e opportunità, non solo costo per contatto.', delay: 0.2 },
];

const funnel = [
  { label: 'Contatti', width: '100%', background: '#c4b5fd' },
  { label: 'Qualificati', width: '72%', background: '#a78bfa' },
  { label: 'Appuntamenti', width: '46%', background: '#9333ea' },
  { label: 'Clienti', width: '26%', background: '#581c87' },
];

const flow = [
  { icon: Target, title: 'Annuncio', desc: 'Meta o Google, sul cliente giusto.', delay: 0 },
  { icon: MessageSquare, title: 'Form qualificante', desc: 'Domande che filtrano.', delay: 0.12 },
  { icon: Database, title: 'CRM', desc: 'Instradamento e follow-up.', delay: 0.2 },
  { icon: Server, title: 'Server-side', desc: 'Eventi di qualità inviati.', delay: 0 },
  { icon: ChartColumn, title: 'Ottimizzazione', desc: 'L’algoritmo cerca chi compra.', delay: 0.12 },
];

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const IconBox: React.FC<{ icon: IconType }> = ({ icon: Icon }) => (
  <span className="ico" aria-hidden="true">
    <Icon className="h-7 w-7" strokeWidth={1.7} />
  </span>
);

const AgentCard: React.FC<{ icon: IconType; title: string; desc: string; items: string[]; background: string; delay?: number }> = ({ icon, title, desc, items, background, delay }) => (
  <Reveal as="article" delay={delay} className="bc" style={{ minHeight: 640, paddingBottom: 110, background }}>
    <div style={{ marginBottom: 28 }}><IconBox icon={icon} /></div>
    <h3>{title}</h3>
    <p className="d">{desc}</p>
    <Bullets items={items} />
  </Reveal>
);

const FunnelMock: React.FC = () => (
  <div className="mock p-7 md:p-9">
    <p className="mb-6 text-[13px] text-gray-500">Schema illustrativo del funnel</p>
    {/* Etichetta fuori dalla barra (testo scuro, larghezza fissa): sulle
        barre strette il testo bianco non ci stava su mobile. */}
    {funnel.map((step) => (
      <div key={step.label} className="mb-3.5 flex items-center gap-4">
        <span className="w-[120px] shrink-0 text-[15px] font-semibold text-[#0a0a0a]">{step.label}</span>
        <div className="min-w-0 flex-1">
          <div className="h-14 rounded-2xl" style={{ width: step.width, background: step.background }} aria-hidden="true" />
        </div>
      </div>
    ))}
  </div>
);

const MetaAdvertisingB2B: React.FC = () => {

  const scrollToMethod = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToId('metodo')) event.preventDefault();
  };

  return (
    <article className="relative">
      <SEOHead title="Meta Ads B2B e Lead Generation su Facebook e Instagram | Q4 Studio" description="Consulenza Meta Advertising per aziende B2B: campagne orientate alla qualità del contatto, tracciamento server-side e segnali dal CRM." url={`${siteUrl}/meta-advertising-b2b`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero scuro: id="hero" fa restare bianchi logo e hamburger della nav
          finché non si scorre oltre (vedi App.tsx). */}
      <header id="hero" className="dark-block relative flex min-h-[640px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[780px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-24 pt-36 md:px-12 md:pt-40">
          <h1 className="h-sub max-w-[1250px]">
            {HERO_WORDS.map((word, i) => (
              <React.Fragment key={`${word}-${i}`}>
                <span className="w" style={{ animationDelay: `${(0.15 + i * 0.07).toFixed(2)}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w-block lead mt-12 max-w-[640px] text-gray-300" style={{ animationDelay: '1.05s' }}>
            Le campagne B2B funzionano quando l’obiettivo non è il costo per contatto ma la probabilità che quel contatto diventi cliente. Per questo l’algoritmo deve ricevere segnali corretti, ed è la parte che quasi nessuno sistema prima di aumentare il budget.
          </p>
          <div className="w-block mt-12" style={{ animationDelay: '1.20s' }}>
            <a
              href="#metodo"
              onClick={(event) => {
                trackCtaClick({ cta_location: 'meta_advertising_b2b_page', cta_label: 'Vedi il metodo', cta_destination: '#metodo' });
                scrollToMethod(event);
              }}
              className="btn btn-white"
            >
              Vedi il metodo
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Manifesto */}
      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[140px] md:pt-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1200px]">Non campagne a volume. Un sistema leggibile.</Reveal>
          <div className="ml-auto mt-20 max-w-[640px] md:mt-[80px]">
            <Reveal as="p" className="lead max-w-[560px]">Lavoriamo su lead generation e high ticket, con Meta Ads e Google Ads. Il nostro ruolo è affiancare marketing e sales nella costruzione di un funnel tracciabile e sostenibile, anche per cicli di vendita complessi.</Reveal>
            <Reveal as="p" delay={0.12} className="lead mt-7 max-w-[560px]">Partiamo dal processo commerciale: cliente giusto, proposta di valore, segmentazione, creatività, domande qualificanti, instradamento al CRM e tempi di risposta.</Reveal>
          </div>
        </div>
      </section>

      {/* Tre cifre */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 md:grid-cols-3 md:gap-6">
          {figures.map((figure) => (
            <Reveal key={figure.desc} delay={figure.delay} className="py-2 pl-8" style={{ borderLeft: '1px solid rgba(10,10,10,.12)' }}>
              <p className="disp" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', letterSpacing: '-0.06em' }}>{figure.value}</p>
              <p className="mt-4 max-w-[240px] text-[15px] leading-normal">{figure.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Il metodo */}
      <section id="metodo" className="scroll-mt-24 px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Il metodo.</Reveal>
          <div className="mt-20 grid grid-cols-1 gap-6 md:mt-[80px] md:grid-cols-3">
            {method.map((item) => (
              <Reveal key={item.title} delay={item.delay} className="flex min-h-[360px] flex-col gap-7 rounded-[32px] bg-[#f7f5fb] px-7 py-8 md:p-11">
                <IconBox icon={item.icon} />
                <div className="mt-auto">
                  <h3 style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{item.title}</h3>
                  <p className="mt-3.5 text-base leading-[1.6]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Il costo per contatto: blocco carta arrotondato con il funnel */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
          <div>
            <Reveal as="h2" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>Il costo per contatto non dice chi compra.</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">Ottimizzare sul costo per lead porta volume, ma non dice quanti contatti diventano clienti. Noi allineiamo campagne e CRM su eventi come domande qualificanti completate, risposta del prospect e avanzamento nello stage commerciale: sono i segnali ad alta intenzione a cui l’algoritmo dà sempre più valore.</Reveal>
          </div>
          <Reveal delay={0.12}>
            <FunnelMock />
          </Reveal>
        </PaperBlock>
      </section>

      {/* Dal click al segnale: cinque passaggi in fila, in colonna sotto lg */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Dal click al segnale.</Reveal>
          <div className="mt-20 flex flex-col items-center gap-3 md:mt-[80px] lg:flex-row lg:items-start">
            {flow.map((step, i) => (
              <React.Fragment key={step.title}>
                {i > 0 && (
                  <div className="flex-none rotate-90 text-[#a855f7] lg:mt-[18px] lg:rotate-0" aria-hidden="true">
                    <ArrowRight className="h-[30px] w-[30px]" strokeWidth={1.7} />
                  </div>
                )}
                <Reveal delay={step.delay} className="flex min-w-0 flex-1 flex-col items-center gap-5 text-center">
                  <IconBox icon={step.icon} />
                  <div>
                    <p className="text-xl font-semibold" style={{ color: '#0a0a0a', letterSpacing: '-0.02em' }}>{step.title}</p>
                    <p className="mt-2 text-sm leading-normal">{step.desc}</p>
                  </div>
                </Reveal>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Agenti AI sul processo sales: bento a tre colonne sfalsate */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Agenti AI sul processo sales.</Reveal>

          <div className="mt-20 flex flex-col gap-6 md:mt-[80px] lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-1 flex-col">
              <AgentCard
                icon={Bot}
                title="Non chatbot generici"
                desc="Li disegniamo con il team, partendo da regole operative, tono di voce, CRM e punti di frizione."
                items={['Qualificano e danno priorità ai contatti', 'Preparano il lavoro umano, non lo sostituiscono']}
                background={PAPER_BG}
              />
              <NoteCard text="Meno tempo alla prima risposta." minHeight={220} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col lg:mt-[120px]">
              <AgentCard
                icon={RefreshCw}
                title="Meta Ads + agenti"
                desc="Nei progetti più maturi l’integrazione riduce i tempi di prima risposta e rende il funnel meno manuale."
                items={['Routing più preciso', 'Meno interventi ripetitivi']}
                background="linear-gradient(150deg, #f7f5fb 0%, #efe7fb 100%)"
                delay={0.12}
              />
              <Reveal as="article" delay={0.12} className="bc ov dark-block justify-end text-white" style={{ minHeight: 260, background: '#050505' }}>
                <div className="aur" aria-hidden="true" style={{ width: 360, height: 360, background: 'rgba(147,51,234,.5)', right: -100, top: -140, filter: 'blur(80px)' }} />
                <p className="d relative text-gray-300" style={{ marginTop: 0 }}>Funnel meno dipendente dal manuale.</p>
              </Reveal>
            </div>

            <div className="flex min-w-0 flex-1 flex-col lg:mt-10">
              <AgentCard
                icon={ChartColumn}
                title="Risultati leggibili"
                desc="Metriche operative e metriche di business, valutate insieme."
                items={['Confronto prima e dopo integrazione CRM', 'Quali campagne generano conversazioni reali']}
                background="#f7f5fb"
                delay={0.2}
              />
              <NoteCard text="Evitiamo le campagne che sembrano funzionare ma non vendono." delay={0.2} minHeight={220} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
          <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
            {metaAdvertisingFaqs.map((faq, i) => (
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

      {/* Chiusura: il CTA del mockup porta alla pagina del tracciamento. */}
      <CloseCta
        size="l"
        title="Il tracciamento viene prima delle campagne."
        lead="Parti dall’audit."
        cta={{
          label: 'Vedi il tracciamento e i prezzi',
          href: '/tracciamento-server-side',
          onClick: () => trackCtaClick({ cta_location: 'meta_advertising_b2b_page', cta_label: 'Vedi il tracciamento e i prezzi', cta_destination: '/tracciamento-server-side' }),
        }}
      />
    </article>
  );
};

export default MetaAdvertisingB2B;
