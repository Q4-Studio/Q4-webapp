import React from 'react';
import { ArrowRight, BarChart3, GitBranch, Target } from 'lucide-react';
import SEOHead from './SEOHead';
import HeroVisual, { HeroAmbient } from './HeroVisual';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { useHeroReveal } from '../hooks/useHeroReveal';

export const metaAdvertisingFaqs = [
  { question: "In pratica, cos'è la B2B Lead Generation su Meta?", answer: "È l'uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate sul profilo del cliente giusto, messaggio, form, CRM e segnali di qualità." },
  { question: 'Perché collegare Meta Ads, CRM e automazioni?', answer: "Perché il CRM restituisce segnali più utili dell'invio form. Quando questi dati rientrano nel modello di ottimizzazione, le campagne possono cercare contatti più vicini al valore commerciale reale." },
];

const MetaAdvertisingB2B: React.FC = () => {
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

  // Ordine dello stagger d'ingresso: eyebrow, h1, sottotitolo, visual.
  const reveal = useHeroReveal<HTMLElement>(4);

  return <article className="relative overflow-hidden bg-[#050505] px-6 pb-28 pt-32 text-white md:pt-36">
    <SEOHead title="Meta Ads B2B e Lead Generation su Facebook e Instagram | Q4 Studio" description="Consulenza Meta Advertising per aziende B2B: campagne orientate alla qualità del contatto, tracciamento server-side e segnali dal CRM." url={`${siteUrl}/meta-advertising-b2b`} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="mx-auto max-w-6xl">
      <header className="relative mb-16 md:mb-20">
        <HeroAmbient variant="meta" />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p ref={reveal(0)} className="eyebrow mb-5 text-blue-300">Meta Advertising · B2B</p>
            <h1 ref={reveal(1)} className="hero-h1 mb-6 font-bold">Meta Ads B2B, con il tracciamento fatto bene a monte.</h1>
            <div ref={reveal(2)} className="hero-subhead space-y-4 text-gray-300">
              <p>Le campagne Meta per il B2B funzionano quando l&apos;obiettivo non è il costo per contatto ma la probabilità che quel contatto diventi cliente. Perché questo succeda, l&apos;algoritmo deve ricevere segnali corretti: ed è la parte che quasi nessuno sistema prima di aumentare il budget.</p>
              <p>Seguiamo un numero limitato di progetti Meta B2B, di norma per aziende con cui lavoriamo già sul lato tecnico.</p>
            </div>
          </div>
          <div ref={reveal(3)}>
            <HeroVisual variant="meta" />
          </div>
        </div>
      </header>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:p-10"><div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Metodo</p><h2 className="section-h2 font-bold">Consulenza B2B Lead Generation su Meta</h2></div><div className="space-y-5 text-lg leading-relaxed text-gray-300"><p>La B2B Lead Generation su Meta è un sistema di acquisizione contatti pensato per trasformare Facebook e Instagram in canali di crescita misurabile anche per aziende con cicli di vendita complessi. Il nostro ruolo non è comportarci da agenzia che esegue campagne a volume, ma da consulenti che affiancano marketing e sales nella costruzione di un funnel più leggibile, tracciabile e sostenibile.</p><p>Partiamo dall&apos;analisi del processo commerciale: chi è il cliente giusto, proposta di valore, segmentazione, creatività, domande qualificanti, instradamento al CRM e tempi di risposta ai contatti. Poi traduciamo questa diagnosi in una struttura Meta Ads che ottimizza per qualità del contatto e probabilità di diventare cliente, non solo per costo per contatto.</p></div></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[[Target,'Diagnosi prima delle campagne','Audit di funnel, audience, offerta e gestione lead prima di aumentare budget o test creativi.'],[GitBranch,'Sistema, non singola ads','Campagne, CRM e follow-up vengono progettati insieme per ridurre dispersione e tempi morti.'],[BarChart3,'Governance dei KPI','Misuriamo contatti che diventano davvero clienti, appuntamenti e opportunità generate, non solo il costo per contatto e numeri di facciata.']].map(([Icon,title,text]) => { const I = Icon as typeof Target; return <div key={String(title)} className="rounded-3xl border border-white/10 bg-[#080808] p-6"><I className="mb-5 h-7 w-7 text-indigo-300" /><h3 className="mb-4 text-xl font-semibold">{String(title)}</h3><p className="leading-relaxed text-gray-400">{String(text)}</p></div>; })}</div></section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-[2rem] border border-white/10 bg-blue-950/20 p-7 md:p-9"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-blue-300">Meta Ads Advisory</p><h2 className="mb-6 text-3xl font-bold">Meta Ads orientate alla qualità</h2><div className="space-y-4 text-lg leading-relaxed text-gray-300"><p>Lavoriamo come consulenti operativi sulle campagne Meta B2B: audit account, architettura delle campagne, piano test creativo, tracking server-side e lettura dei dati commerciali. L&apos;obiettivo è aiutare il team a capire cosa sta generando opportunità reali e cosa sta solo gonfiando il volume dei lead.</p><p>L&apos;algoritmo di Meta dà sempre più valore ai segnali di conversione ad alta intenzione. Per questo allineiamo campagne e CRM su eventi come completamento di domande qualificanti, risposta del prospect e progressione nello stage commerciale.</p></div></article><article className="rounded-[2rem] border border-white/10 bg-purple-950/20 p-7 md:p-9"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-purple-300">AI Process Consulting</p><h2 className="mb-6 text-3xl font-bold">Agenti AI sul processo sales</h2><div className="space-y-4 text-lg leading-relaxed text-gray-300"><p>Gli Agenti AI non sono chatbot generici. Li disegniamo insieme al team, partendo da regole operative, tono di voce, CRM e punti di frizione nel processo commerciale. Il risultato è un supporto che qualifica, prioritizza e prepara il lavoro umano invece di sostituirlo.</p><p>Nei progetti più maturi, l&apos;integrazione Meta Ads + Agenti AI riduce i tempi di prima risposta, aumenta la precisione nel routing e rende il funnel meno dipendente da interventi manuali ripetitivi.</p></div></article></section>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:p-10"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-cyan-300">Misurazione</p><h2 className="mb-6 section-h2 font-bold">Risultati misurabili, leggibili dal team</h2><div className="max-w-4xl space-y-5 text-lg leading-relaxed text-gray-300"><p>Ogni attività viene valutata su metriche operative e metriche di business. Questo approccio evita il classico problema delle campagne che sembrano funzionare ma non producono vendite.</p><p>Nei progetti B2B monitoriamo nel tempo quanti contatti diventano davvero clienti e confrontiamo i dati prima e dopo integrazione CRM, instradamento e automazioni. Quando i segnali sono più puliti, il team capisce meglio quali campagne generano conversazioni commerciali reali e quali portano solo volume.</p></div></section>

      <section className="mt-16"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-blue-300">FAQ</p><h2 className="mb-9 section-h2 font-bold">Domande frequenti su Meta Ads B2B</h2><div className="space-y-4">{metaAdvertisingFaqs.map((faq) => <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><summary className="cursor-pointer text-xl font-semibold">{faq.question}</summary><p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{faq.answer}</p></details>)}</div></section>

      <section className="mt-16 rounded-[2.5rem] border border-blue-400/20 bg-blue-400/[0.05] p-8 text-center md:p-14"><h2 className="mb-7 section-h2 font-bold">Il tracciamento viene prima delle campagne. Parti dall&apos;audit.</h2><a href="/tracciamento-server-side" onClick={() => trackCtaClick({ cta_location: 'meta_advertising_b2b_page', cta_label: 'Vedi il tracciamento e i prezzi', cta_destination: '/tracciamento-server-side' })} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Vedi il tracciamento e i prezzi <ArrowRight className="h-4 w-4" /></a></section>
    </div>
  </article>;
};

export default MetaAdvertisingB2B;
