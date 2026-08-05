import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEOHead from './SEOHead';
import { siteUrl } from '../data/seoPages';

const packages = [
  { title: 'Audit tracciamento', price: '490 €', timing: '3-5 giorni lavorativi', items: ['Verifica di cosa viene tracciato e cosa si perde oggi', 'Confronto tra dati piattaforma e dati reali', 'Analisi del Consent Mode e della configurazione attuale', 'Documento con le priorità di intervento'], note: 'Il documento resta tuo. Se decidi di non procedere, hai comunque una mappa di cosa sistemare.' },
  { title: 'Setup server-side', price: 'da 1.500 €', timing: 'circa una giornata di lavoro per siti non-ecommerce, 1-3 giornate per ecommerce', items: ['Container server-side su infrastruttura dedicata', 'Consent Mode v2 configurato e verificato', 'Conversions API Meta ed Enhanced Conversions Google', 'Eventi personalizzati sui passaggi che contano', "Documentazione di eventi e naming, che resta all'azienda"] },
  { title: 'Infrastruttura e lettura dati', price: 'da 100 €/mese', timing: 'Disdetta libera. Nessun vincolo di durata.', items: ['Container monitorato, con alert se qualcosa si interrompe', 'Aggiornamenti quando le piattaforme cambiano le regole', 'Report mensile con la lettura dei dati, non solo i numeri'] },
];

const faqs = [
  ["Cos'è il tracciamento server-side, in parole semplici?", 'Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.'],
  ['Quanto costa e quanto tempo serve?', "L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese."],
  ['Il tracciamento server-side è conforme al GDPR?', 'È lo strumento che rende la conformità più gestibile, non meno: il consenso viene rispettato a monte tramite Consent Mode v2 e i dati passano da un’infrastruttura che controlliamo. Non siamo consulenti legali e non forniamo pareri: implementiamo quello che il tuo DPO o consulente privacy definisce.'],
  ['Serve cambiare qualcosa sul mio sito?', "Nell'implementazione standard no: il container gira su un sottodominio del tuo sito e il codice esistente resta. In alcuni casi serve un intervento sul tema o sui template, e te lo diciamo dopo l'audit."],
  ['Lavori anche con la mia agenzia?', 'Sì. Molte agenzie non hanno un tecnico interno per questa parte: possiamo lavorare direttamente con loro.'],
];

const ServerSideTracking: React.FC = () => {
  const requestAudit = () => document.querySelector('section:has(form)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return <article className="relative overflow-hidden bg-[#050505] px-6 pb-24 pt-40 text-white">
    <SEOHead title="Tracciamento Server-Side per Meta e Google | Q4 Studio" description="Recuperiamo i segnali di conversione che browser e ad blocker bloccano. Setup server-side, Consent Mode v2, Conversions API. Audit da 490 €." url={`${siteUrl}/tracciamento-server-side`} />
    <div className="pointer-events-none absolute right-[-15%] top-20 h-[700px] w-[700px] rounded-full bg-cyan-900/15 blur-[170px]" />
    <div className="relative z-10 mx-auto max-w-6xl">
      <header className="mb-24 max-w-5xl">
        <p className="mb-5 text-sm uppercase tracking-[0.08em] text-cyan-300">Tracciamento server-side · Meta e Google</p>
        <h1 className="mb-7 text-[clamp(44px,7vw,92px)] font-bold leading-[0.98] tracking-[-0.045em]">Il tuo account pubblicitario vede meno conversioni di quelle che fai.</h1>
        <p className="text-xl text-gray-300 md:text-2xl">Non è un problema di campagne. È un problema di raccolta dati.</p>
      </header>

      <section className="grid gap-12 border-t border-white/10 py-20 lg:grid-cols-2 lg:gap-20"><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Cosa sta succedendo</h2><div className="space-y-5 text-lg leading-relaxed text-gray-300"><p>Safari e Firefox limitano i cookie di terze parti. Gli ad blocker bloccano i pixel. Il consenso negato interrompe la raccolta. Il risultato è che Meta e Google vedono una parte delle tue conversioni, e ottimizzano su quella parte.</p><p>Se il tuo account dice 40 conversioni e il tuo gestionale dice 90, non è un errore di lettura: è il tracciamento che non arriva.</p></div></section>
      <section className="grid gap-12 border-t border-white/10 py-20 lg:grid-cols-2 lg:gap-20"><h2 className="text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Come lo risolviamo</h2><div className="space-y-5 text-lg leading-relaxed text-gray-300"><p>Spostiamo la raccolta dati dal browser a un container server-side su infrastruttura dedicata. I segnali passano da lì, vengono normalizzati e inviati alle piattaforme via API server-to-server.</p><p>Aggiungiamo i segnali che contano davvero: non l&apos;invio del form, ma la qualificazione, la risposta del prospect, l&apos;avanzamento nel CRM. Sono i segnali che l&apos;algoritmo usa per cercare persone simili a chi compra, non a chi compila.</p></div></section>

      <section className="border-t border-white/10 py-20"><p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-300">Prezzi pubblici</p><h2 className="mb-12 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">I pacchetti</h2><div className="grid gap-5 lg:grid-cols-3">{packages.map((pack, i) => <article key={pack.title} className={`rounded-[2rem] border p-7 ${i === 1 ? 'border-cyan-400/30 bg-cyan-400/[0.05]' : 'border-white/10 bg-white/[0.025]'}`}><p className="mb-3 text-sm text-gray-500">{pack.timing}</p><h3 className="mb-2 text-2xl font-bold">{pack.title}</h3><p className="mb-7 text-3xl font-bold text-cyan-200">{pack.price}</p><ul className="space-y-3">{pack.items.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />{item}</li>)}</ul>{pack.note && <p className="mt-7 border-t border-white/10 pt-5 text-sm leading-relaxed text-gray-400">{pack.note}</p>}</article>)}</div></section>

      <section className="grid gap-12 border-t border-white/10 py-20 lg:grid-cols-[1fr_0.8fr] lg:gap-20"><div><p className="mb-5 text-sm uppercase tracking-[0.08em] text-cyan-300">Un caso reale</p><h2 className="mb-6 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Oltre un milione di segnali recuperati.</h2><p className="text-lg leading-relaxed text-gray-300">Su Candiani Denim abbiamo recuperato oltre un milione di segnali di conversione in 90 giorni, di cui 963.652 bloccati dai sistemi di tracking prevention dei browser e 69.043 dagli ad blocker.</p></div><a href="/casi-studio/candiani-denim-tracking-server-side" className="self-end rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-xl font-semibold text-indigo-200 hover:border-indigo-400/40">Leggi il caso studio completo <ArrowRight className="ml-2 inline h-5 w-5" /></a></section>

      <section className="border-t border-white/10 py-20"><h2 className="mb-10 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Domande frequenti</h2><div className="space-y-4">{faqs.map(([q,a]) => <details key={q} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><summary className="cursor-pointer text-xl font-semibold">{q}</summary><p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{a}</p></details>)}</div></section>

      <section className="rounded-[2.5rem] border border-cyan-400/20 bg-cyan-400/[0.05] p-8 text-center md:p-14"><h2 className="mb-5 text-[clamp(32px,5vw,58px)] font-bold tracking-[-0.035em]">Non sai se il tuo tracciamento è a posto?</h2><p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">L&apos;audit da 490 € ti dà una risposta documentata in cinque giorni.</p><button onClick={requestAudit} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">Richiedi l&apos;audit <ArrowRight className="h-4 w-4" /></button></section>
    </div>
  </article>;
};

export default ServerSideTracking;
