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

const AIAgents: React.FC = () => {
  const scrollToPackages = () => document.getElementById('pacchetti-automazioni')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () => document.querySelector('section:has(form)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return <article className="relative overflow-hidden bg-[#050505] px-6 pb-24 pt-40 text-white">
    <SEOHead title="Agenti AI e Automazioni per PMI | Q4 Studio" description="Automazioni WhatsApp, CRM e assistenti virtuali con tempi, setup e canoni pubblici. Soluzioni concrete per le attività ripetitive delle PMI." url={`${siteUrl}/agenti-ai`} />
    <div className="pointer-events-none absolute right-[-15%] top-10 h-[720px] w-[720px] rounded-full bg-purple-900/15 blur-[170px]" />
    <div className="relative z-10 mx-auto max-w-6xl">
      <header className="mb-24 max-w-5xl"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-purple-300">Automazioni · setup e canone chiari</p><h1 className="mb-7 text-[clamp(44px,7vw,88px)] font-bold leading-[0.98] tracking-[-0.045em]">Automazioni concrete, su problemi che racconti in una frase.</h1><p className="max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">Assistenti sul sito, follow-up nel CRM e richieste WhatsApp già strutturate. Sai prima cosa serve, quanto tempo richiede e quanto costa.</p><button onClick={scrollToPackages} className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Vedi i pacchetti <ArrowRight className="h-4 w-4" /></button></header>

      <section id="pacchetti-automazioni" className="border-t border-white/10 py-20"><div className="mb-12 max-w-3xl"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Tre punti di partenza</p><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Scegli il lavoro ripetitivo da togliere al team.</h2></div><div className="space-y-6">{packages.map((pack, index) => <article key={pack.title} className={`rounded-[2rem] border p-7 md:p-10 ${index === 2 ? 'border-purple-400/30 bg-purple-400/[0.05]' : 'border-white/10 bg-white/[0.025]'}`}><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-purple-300">{pack.icon}</span><h3 className="mb-5 text-3xl font-bold tracking-[-0.02em]">{pack.title}</h3><p className="mb-5 leading-relaxed text-gray-300"><strong className="text-white">Il problema:</strong> {pack.problem}</p>{pack.description && <p className="leading-relaxed text-gray-300"><strong className="text-white">Cosa fa:</strong> {pack.description}</p>}{pack.actions && <div><p className="mb-3 font-semibold">Cosa fa</p><ul className="space-y-2">{pack.actions.map(item => <li key={item} className="flex gap-3 text-gray-300"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-purple-300" />{item}</li>)}</ul></div>}</div><div className="rounded-3xl border border-white/10 bg-black/25 p-6"><p className="mb-4 font-semibold">Cosa serve da te</p><ul className="mb-7 space-y-3">{pack.requirements.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-300" />{item}</li>)}</ul><div className="flex items-center gap-2 border-t border-white/10 pt-5 text-gray-300"><Clock className="h-4 w-4 text-indigo-300" /><span>{pack.timing}</span></div><p className="mt-5 text-xl font-bold text-purple-200">{pack.price}</p>{pack.pilot && <p className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/[0.07] p-4 text-sm leading-relaxed text-purple-100"><strong>Pilot pubblico.</strong> {pack.pilot}</p>}</div></div></article>)}</div></section>

      <section className="rounded-[2.5rem] border border-purple-400/20 bg-purple-400/[0.05] p-8 text-center md:p-14"><h2 className="mb-5 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Quale attività stai ancora facendo a mano?</h2><p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">Raccontala in una frase. Ti diciamo se uno di questi pacchetti è il punto di partenza giusto.</p><button onClick={scrollToContact} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Scrivici <ArrowRight className="h-4 w-4" /></button></section>
    </div>
  </article>;
};

export default AIAgents;
