import React from 'react';
import { ArrowRight, Bot, Check, PanelsTopLeft, Server, Target } from 'lucide-react';

const services = [
  {
    icon: <Server className="h-9 w-9 text-cyan-300" />,
    title: 'Tracciamento e dati',
    desc: "Il pezzo tecnico che quasi nessuna agenzia sa fare. Server-side, Consent Mode, segnali dal CRM alle campagne. Dati completi e conformi, che l'algoritmo può davvero usare.",
    points: ['Container server-side su infrastruttura dedicata', 'Consent Mode v2 e conformità', 'Conversions API e Enhanced Conversions', 'Documentazione di eventi e naming'],
    price: 'Audit da 490 € · Setup da 1.500 €',
    href: '/tracciamento-server-side',
    accent: 'cyan',
  },
  {
    icon: <PanelsTopLeft className="h-9 w-9 text-emerald-300" />,
    title: 'Siti web con AI',
    desc: 'Siti e landing page con direzione umana e strumenti AI. Asset su misura, video e movimento quando servono a raccontare meglio il progetto.',
    points: ['Sviluppo web con strumenti AI', 'Asset AI creati per il progetto', 'Video animati e sezioni con scroll animation', 'Produzione foto e video reali quando serve'],
    price: 'Progetti da 2.999 €',
    href: '/siti-web-ai',
    accent: 'emerald',
  },
  {
    icon: <Bot className="h-9 w-9 text-purple-300" />,
    title: 'Automazioni e agenti AI',
    desc: 'Automazioni su problemi precisi, con setup e canone chiari. Richieste inbound strutturate, follow-up automatici, dati che non si ridigitano più.',
    points: ['Estrazione strutturata da WhatsApp ed email', 'Follow-up automatici multicanale', 'Integrazione con CRM e gestionale', 'Revisione umana dove il dato è incerto'],
    price: 'Setup da 490 € · Canone da 59 a 200 €/mese',
    href: '/agenti-ai',
    accent: 'purple',
  },
];

const stats = [
  { value: '1.032.695', label: 'segnali di conversione recuperati in 90 giorni (Candiani Denim)' },
  { value: '963.652', label: 'bloccati dalla tracking prevention del browser (Candiani Denim)' },
  { value: '≤ 60 s', label: 'tempo di primo contatto nel nostro sistema di lead generation' },
  { value: '8 h', label: 'tempo tipico di setup del tracciamento server-side' },
];

const method = [
  { n: '01', title: 'Audit', desc: 'Guardiamo come funziona oggi il pezzo che non funziona. Prezzo fisso, 3-5 giorni, e il documento resta tuo anche se ci fermiamo qui.' },
  { n: '02', title: 'Implementazione', desc: 'Tempi noti, prezzo noto, nessuna sorpresa a metà progetto.' },
  { n: '03', title: 'Manutenzione', desc: 'Quello che costruiamo resta monitorato e funzionante. Canone mensile, disdetta libera.' },
];

const Services2: React.FC = () => (
  <section id="services" className="relative border-t border-white/5 bg-[#050505] px-6 py-32 text-white md:py-44">
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 max-w-3xl md:mb-20">
        <p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Servizi tecnici</p>
        <h2 className="mb-6 text-[clamp(32px,5vw,64px)] font-bold leading-[1.08] tracking-[-0.035em]">Tre servizi, un unico sistema.</h2>
        <p className="text-lg leading-relaxed text-gray-400 md:text-xl">Rendiamo affidabili i dati, costruiamo il punto di arrivo e automatizziamo il lavoro che viene dopo. Tre linee tecniche, progettate per funzionare insieme.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="group rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-7 transition-colors hover:border-indigo-400/30 md:p-10">
            <div className="mb-7">{service.icon}</div>
            <h3 className="mb-4 text-3xl font-bold tracking-[-0.02em]">{service.title}</h3>
            <p className="mb-7 leading-relaxed text-gray-400">{service.desc}</p>
            <ul className="mb-8 space-y-3">
              {service.points.map((point) => <li key={point} className="flex items-start gap-3 text-gray-200"><Check className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-300" />{point}</li>)}
            </ul>
            <a href={service.href} className="inline-flex items-center gap-2 font-semibold text-indigo-200 transition-colors hover:text-white">{service.price}<ArrowRight className="h-4 w-4" /></a>
          </article>
        ))}
      </div>

      <article className="mt-6 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:flex-row md:items-center md:justify-between md:p-9">
        <div className="flex max-w-3xl items-start gap-5">
          <Target className="mt-1 h-8 w-8 flex-shrink-0 text-blue-300" />
          <div><p className="mb-2 text-xs uppercase tracking-[0.12em] text-blue-300">Servizio complementare</p><h3 className="mb-2 text-2xl font-bold">Meta Advertising</h3><p className="leading-relaxed text-gray-400">Campagne B2B su Meta, gestite da chi sa anche sistemare il tracciamento a monte. Servizio disponibile per clienti già seguiti sul tecnico.</p></div>
        </div>
        <a href="/meta-advertising-b2b" className="inline-flex flex-shrink-0 items-center gap-2 font-semibold text-blue-200 hover:text-white">Approfondisci <ArrowRight className="h-4 w-4" /></a>
      </article>

      <div className="mt-24 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => <div key={stat.label} className="bg-[#070707] p-8"><p className="mb-3 text-[clamp(28px,4vw,46px)] font-bold tabular-nums text-indigo-200">{stat.value}</p><p className="text-sm leading-relaxed text-gray-500">{stat.label}</p></div>)}
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
        {method.map((step) => <div key={step.n} className="border-t border-white/10 pt-7"><span className="text-sm text-indigo-400">{step.n}</span><h3 className="mb-3 mt-3 text-2xl font-bold">{step.title}</h3><p className="leading-relaxed text-gray-400">{step.desc}</p></div>)}
      </div>
    </div>
  </section>
);

export default Services2;
