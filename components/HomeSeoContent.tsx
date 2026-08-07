import React from 'react';
import { ChevronDown } from 'lucide-react';

export const homeFaqs = [
  { question: "Cos'è il tracciamento server-side, in parole semplici?", answer: 'Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.' },
  { question: 'Quanto costa e quanto tempo serve?', answer: "L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese." },
  { question: 'Il tracciamento server-side è conforme al GDPR?', answer: 'È lo strumento che rende la conformità più gestibile, non meno: il consenso viene rispettato a monte tramite Consent Mode v2 e i dati passano da un’infrastruttura che controlliamo. Non siamo consulenti legali e non forniamo pareri: implementiamo quello che il tuo DPO o consulente privacy definisce.' },
  { question: 'Che tipo di automazioni fate, concretamente?', answer: 'Automazioni su problemi precisi, non progetti di trasformazione digitale. Per esempio: le richieste che arrivano su WhatsApp e finiscono nel CRM già strutturate, con una prima risposta automatica in meno di un minuto. Oppure un assistente sul sito che risponde alle domande frequenti anche fuori orario. Ogni pacchetto ha un prezzo di setup e un canone dichiarati.' },
  { question: 'Lavorate anche con la mia agenzia?', answer: 'Sì, ed è una parte importante di quello che facciamo. Molte agenzie non hanno un tecnico interno per il tracciamento server-side o per le integrazioni: lavoriamo direttamente con loro, in white label. Il cliente resta dell’agenzia.' },
  { question: 'Lavorate solo in Emilia?', answer: 'Il lavoro tecnico si fa in remoto, quindi seguiamo aziende in tutta Italia. Sui progetti che richiedono presenza — advertising, consulenza continuativa — lavoriamo soprattutto tra Reggio Emilia, Modena e Parma.' },
  { question: 'Come si inizia?', answer: 'Con l’audit del tracciamento, che costa 490 € e dura 3-5 giorni. È il modo più economico per capire cosa non funziona senza impegnarsi su un progetto. Il documento che ne esce resta tuo anche se poi non procediamo.' },
  { question: 'Meta Ads funziona anche per aziende B2B con cicli di vendita lunghi?', answer: 'Sì, se l’obiettivo non è solo il costo per lead. Ne parliamo nel dettaglio nella pagina dedicata.', href: '/meta-advertising-b2b' },
];

const HomeSeoContent: React.FC = () => (
  <section id="faq" className="relative mx-auto max-w-5xl overflow-hidden px-6 py-28 text-gray-200">
    <div className="mb-10">
      <p className="mb-5 text-sm uppercase tracking-[0.08em] text-indigo-400">FAQ</p>
      <h2 className="mb-6 text-[clamp(32px,5vw,64px)] font-bold leading-[1.08] tracking-[-0.035em] text-white">Domande frequenti</h2>
      <p className="max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">Risposte chiare su come lavoriamo, cosa costa e come si inizia.</p>
    </div>
    <div className="space-y-4">
      {homeFaqs.map((faq) => (
        <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 open:border-indigo-400/40 open:bg-indigo-500/[0.06]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
            <h3 className="text-xl font-semibold leading-tight text-white md:text-2xl">{faq.question}</h3>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-indigo-300 transition-transform group-open:rotate-180"><ChevronDown className="h-5 w-5" /></span>
          </summary>
          <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">
            {faq.answer}{faq.href && <> <a href={faq.href} className="font-medium text-indigo-300 underline decoration-indigo-400/40 underline-offset-4 hover:text-indigo-200">Approfondisci</a></>}
          </p>
        </details>
      ))}
    </div>
  </section>
);

export default HomeSeoContent;
