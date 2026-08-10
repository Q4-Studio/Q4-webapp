import React from 'react';
import { ArrowRight, Bot, CheckCircle2, Clock, MessageCircle, RefreshCw } from 'lucide-react';
import SEOHead from './SEOHead';
import { siteUrl } from '../data/seoPages';

const packages = [
  {
    icon: <Bot className="h-7 w-7" />,
    title: 'Assistente virtuale sul sito',
    problem: 'Le stesse domande arrivano per telefono e mail, e fuori orario non risponde nessuno.',
    requirements: ['Sito accessibile', 'Elenco delle domande frequenti', 'Tono di voce', 'Un referente per la validazione delle risposte'],
    timing: '2 settimane',
    price: 'Setup 490 € · canone 59 €/mese',
  },
  {
    icon: <RefreshCw className="h-7 w-7" />,
    title: 'Automazioni CRM e follow-up',
    problem: 'I lead non vengono ricontattati e il follow-up dipende da chi si ricorda.',
    actions: ['Riceve il lead da form, campagne o LinkedIn', 'Lo assegna al commerciale giusto nel CRM, con il contesto già pronto', 'Prepara il primo messaggio e i promemoria di follow-up'],
    requirements: ['CRM esistente o incluso', 'Numero WhatsApp business', 'Elenco dei momenti di contatto da automatizzare'],
    timing: '2-3 settimane',
    price: 'Setup da 490 € · canone da 150 €/mese',
  },
  {
    icon: <MessageCircle className="h-7 w-7" />,
    title: 'Richieste WhatsApp che arrivano già compilate',
    problem: 'I clienti ti scrivono su WhatsApp in tre messaggi disordinati, e qualcuno deve leggere, capire e ridigitare tutto a mano. Nel frattempo passano ore, e il lead ha già chiesto un preventivo a qualcun altro.',
    description: "Legge i messaggi in arrivo, estrae le informazioni che ti servono per rispondere — nel caso di un preventivo: cosa, dove, quando, quanto — le scrive nel CRM e manda una prima risposta in meno di un minuto. Se manca un'informazione, la chiede. Quando il dato non è certo, segnala invece di inventare.",
    requirements: ['Un numero WhatsApp collegabile alla piattaforma. Se oggi rispondi dal tuo cellulare con WhatsApp Business, serve un numero dedicato: te lo spieghiamo prima di partire, non dopo.', 'L’elenco delle informazioni che ti servono per rispondere a una richiesta', 'Una persona che valida i primi giorni di funzionamento'],
    timing: "4-6 settimane dall'avvio",
    price: 'Setup 990 € · canone 200 €/mese',
    pilot: 'Per i primi due clienti: setup 490 € invece di 990 €, in cambio del diritto di raccontare il progetto come caso studio e di una call di feedback dopo il primo mese.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Agenti AI e Automazioni per PMI',
  description: 'Automazioni WhatsApp, CRM e assistenti virtuali con setup e canone pubblici per attività ripetitive B2B.',
  provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
  areaServed: 'IT',
  url: `${siteUrl}/agenti-ai`,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Pacchetti automazioni AI',
    itemListElement: packages.map((pack) => ({ '@type': 'Offer', name: pack.title, price: pack.price })),
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Agenti AI', item: `${siteUrl}/agenti-ai` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
};

const process = [
  { n: '01', title: 'Racconto del problema', desc: 'Ci descrivi l\'attività che oggi fa una persona a mano. Se non rientra in un pacchetto chiaro, te lo diciamo prima di iniziare, non a metà progetto.' },
  { n: '02', title: 'Setup', desc: 'Colleghiamo i sistemi che già usi (CRM, gestionale, WhatsApp) e configuriamo l\'automazione sul processo reale, non su un caso generico.' },
  { n: '03', title: 'Canone e assistenza', desc: 'Un canone mensile copre monitoraggio e aggiornamenti quando le piattaforme cambiano le regole. Disdetta libera, nessun vincolo pluriennale.' },
];

const faqs = [
  { question: 'Cosa succede se il mio problema non rientra in uno di questi tre pacchetti?', answer: "Te lo diciamo subito, prima di prendere un impegno. Non costruiamo pacchetti su misura solo per vendere qualcosa: se non è un buon caso d'uso per l'automazione, meglio saperlo in anticipo." },
  { question: 'Serve già un CRM per iniziare?', answer: "Per l'assistente virtuale no. Per le automazioni CRM e follow-up serve un CRM esistente, oppure lo includiamo nel setup: dipende da cosa usi già in azienda." },
  { question: 'Posso disdire il canone quando voglio?', answer: 'Sì, nessun vincolo pluriennale. Il canone copre monitoraggio e aggiornamenti quando le piattaforme (WhatsApp, CRM, i modelli AI sottostanti) cambiano le regole.' },
  { question: 'Quanto dura davvero il setup?', answer: "Varia per pacchetto: 2 settimane per l'assistente sul sito, 2-3 per le automazioni CRM, 4-6 per le richieste WhatsApp strutturate. Sono tempi reali, non stime commerciali: dipendono dalla complessità del processo che colleghiamo." },
];

const AIAgents: React.FC = () => {
  const scrollToPackages = () => document.getElementById('pacchetti-automazioni')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () => document.querySelector('section:has(form)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return <article className="relative overflow-hidden bg-[#050505] px-6 pb-24 pt-40 text-white">
    <SEOHead title="Agenti AI e Automazioni per PMI | Q4 Studio" description="Automazioni WhatsApp, CRM e assistenti virtuali con tempi, setup e canoni pubblici. Soluzioni concrete per le attività ripetitive delle PMI." url={`${siteUrl}/agenti-ai`} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="pointer-events-none absolute right-[-15%] top-10 h-[720px] w-[720px] rounded-full bg-purple-900/15 blur-[170px]" />
    <div className="relative z-10 mx-auto max-w-6xl">
      <header className="mb-24 max-w-5xl"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-purple-300">Automazioni · setup e canone chiari</p><h1 className="mb-7 text-[clamp(44px,7vw,88px)] font-bold leading-[0.98] tracking-[-0.045em]">Automazioni concrete, su problemi che racconti in una frase.</h1><p className="max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">Assistenti sul sito, follow-up nel CRM e richieste WhatsApp già strutturate. Sai prima cosa serve, quanto tempo richiede e quanto costa.</p><button onClick={scrollToPackages} className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Vedi i pacchetti <ArrowRight className="h-4 w-4" /></button></header>

      <section className="grid gap-12 border-t border-white/10 py-20 lg:grid-cols-2 lg:gap-20"><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Non trasformazione digitale. Un problema alla volta.</h2><div className="space-y-5 text-lg leading-relaxed text-gray-300"><p>Non vendiamo progetti di "digital transformation" con output vago e tempi lunghi. Ogni pacchetto qui sotto risolve un'attività specifica che oggi fa una persona a mano, con un prezzo di setup e un canone dichiarati prima di iniziare.</p><p>Se il problema che ci racconti non rientra in uno di questi tre, te lo diciamo subito: non costruiamo un pacchetto su misura solo per vendere qualcosa. Automazioni e agenti AI vengono dopo il tracciamento, non prima: senza dati affidabili su cosa funziona, automatizzare un processo rotto lo rende solo più veloce a rompersi.</p></div></section>

      <section className="border-t border-white/10 py-20"><div className="mb-12 max-w-3xl"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Come lavoriamo</p><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Tre passaggi, non un progetto a tempo indeterminato.</h2></div><div className="grid gap-8 md:grid-cols-3">{process.map((step) => <div key={step.n} className="border-t border-white/10 pt-7"><span className="text-sm text-purple-400">{step.n}</span><h3 className="mb-3 mt-3 text-2xl font-bold">{step.title}</h3><p className="leading-relaxed text-gray-400">{step.desc}</p></div>)}</div></section>

      <section id="pacchetti-automazioni" className="border-t border-white/10 py-20"><div className="mb-12 max-w-3xl"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Tre punti di partenza</p><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Scegli il lavoro ripetitivo da togliere al team.</h2></div><div className="space-y-6">{packages.map((pack, index) => <article key={pack.title} className={`rounded-[2rem] border p-7 md:p-10 ${index === 2 ? 'border-purple-400/30 bg-purple-400/[0.05]' : 'border-white/10 bg-white/[0.025]'}`}><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-purple-300">{pack.icon}</span><h3 className="mb-5 text-3xl font-bold tracking-[-0.02em]">{pack.title}</h3><p className="mb-5 leading-relaxed text-gray-300"><strong className="text-white">Il problema:</strong> {pack.problem}</p>{pack.description && <p className="leading-relaxed text-gray-300"><strong className="text-white">Cosa fa:</strong> {pack.description}</p>}{pack.actions && <div><p className="mb-3 font-semibold">Cosa fa</p><ul className="space-y-2">{pack.actions.map(item => <li key={item} className="flex gap-3 text-gray-300"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-purple-300" />{item}</li>)}</ul></div>}</div><div className="rounded-3xl border border-white/10 bg-black/25 p-6"><p className="mb-4 font-semibold">Cosa serve da te</p><ul className="mb-7 space-y-3">{pack.requirements.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-300" />{item}</li>)}</ul><div className="flex items-center gap-2 border-t border-white/10 pt-5 text-gray-300"><Clock className="h-4 w-4 text-indigo-300" /><span>{pack.timing}</span></div><p className="mt-5 text-xl font-bold text-purple-200">{pack.price}</p>{pack.pilot && <p className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/[0.07] p-4 text-sm leading-relaxed text-purple-100"><strong>Pilot pubblico.</strong> {pack.pilot}</p>}</div></div></article>)}</div></section>

      <section className="border-t border-white/10 py-20"><h2 className="mb-10 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Domande frequenti</h2><div className="space-y-4">{faqs.map((faq) => <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><summary className="cursor-pointer text-xl font-semibold">{faq.question}</summary><p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{faq.answer}</p></details>)}</div></section>

      <section className="border-t border-white/10 py-20"><h2 className="mb-8 text-2xl font-bold">Approfondisci</h2><div className="grid gap-4 md:grid-cols-3"><a href="/tracciamento-server-side" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300 hover:border-purple-400/40 hover:text-white">Prima le automazioni: hai già il tracciamento a posto? <ArrowRight className="ml-1 inline h-4 w-4" /></a><a href="/risorse/whatsapp-automation-lead-b2b" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300 hover:border-purple-400/40 hover:text-white">Automazione WhatsApp nei processi aziendali <ArrowRight className="ml-1 inline h-4 w-4" /></a><a href="/risorse/second-brain-aziendale-agente-ai" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300 hover:border-purple-400/40 hover:text-white">Second Brain aziendale: un agente AI per la conoscenza <ArrowRight className="ml-1 inline h-4 w-4" /></a></div></section>

      <section className="rounded-[2.5rem] border border-purple-400/20 bg-purple-400/[0.05] p-8 text-center md:p-14"><h2 className="mb-5 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Quale attività stai ancora facendo a mano?</h2><p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">Raccontala in una frase. Ti diciamo se uno di questi pacchetti è il punto di partenza giusto.</p><button onClick={scrollToContact} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Scrivici <ArrowRight className="h-4 w-4" /></button></section>
    </div>
  </article>;
};

export default AIAgents;
