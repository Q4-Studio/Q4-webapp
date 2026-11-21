import React from 'react';
import { Plus } from 'lucide-react';
import Reveal from './home2/Reveal';

/**
 * FAQ della home. Stessi testi dello schema FAQPage in index.html e del
 * contenuto statico in scripts/prerender.ts: se cambiano qui, cambiano lì.
 */
export const homeFaqs = [
  { question: "Cos'è il tracciamento server-side, in parole semplici?", answer: 'Invece di far inviare i dati dal browser del visitatore a Meta e Google, li raccoglie un server controllato da Q4. Gli ad blocker e la tracking prevention incontrano meno ostacoli, e le piattaforme ricevono conversioni più complete.' },
  { question: 'Quanto costa e quanto tempo serve?', answer: "L'audit parte da 490 €, il setup da 1.500 €. Un setup server-side tipico richiede circa 8 ore di lavoro." },
  { question: 'Il tracciamento server-side è conforme al GDPR?', answer: "Sì, e in più permette di ottenere più dati. Con il server-side si lavora sul dato a monte, prima che arrivi alle piattaforme, elaborandolo e anonimizzandolo. Alcuni cookie che in un setup solo client side richiederebbero un consenso specifico possono invece partire di default, e le piattaforme ricevono più informazioni: sempre in accordo con il DPO e dopo la valutazione del nostro consulente legale. A questo si aggiunge Consent Mode v2, che fa seguire i dati alle scelte di consenso dell'utente." },
  { question: 'Che tipo di automazioni fate, concretamente?', answer: "Automatizziamo il CRM: il lead entra in automatico, riceve un primo contatto su WhatsApp e via email e viene seguito con follow-up programmati per 7 giorni. Il team commerciale è avvisato quando c'è qualcosa da fare, il cliente riceve le sue notifiche, e l'appuntamento finisce in calendario." },
  { question: "Quanto costa e quanto tempo serve per un'automazione?", answer: 'Le automazioni partono in due settimane. Il setup parte da 490 €, il canone va da 59 a 200 € al mese.' },
  { question: "Cos'è un agente AI e cosa può fare per la mia azienda?", answer: "Un agente AI svolge compiti ripetitivi seguendo le regole e i dati della tua azienda. Un esempio: gli ordini arrivano sia via mail sia da software diversi, e l'agente li legge, li traduce in un formato unico e li invia in automatico al gestionale dell'azienda di produzione. Più flussi, un solo canale. Lo stesso approccio vale per le vendite, il back office e l'assistenza clienti." },
  { question: 'Lavorate anche con la mia agenzia?', answer: 'Sì. Realizziamo tracciamenti e automazioni anche in white label per altre agenzie.' },
  { question: 'Lavorate solo in Emilia?', answer: "No. La nostra sede è a Reggio Emilia, dove possiamo incontrare anche i clienti, ma siamo un team in remoto e abituati a lavorare così. Oltre il 90% dei nostri clienti è fuori dall'Emilia, e alcuni anche fuori dall'Unione Europea: ne abbiamo uno in Arabia Saudita." },
];

const HomeSeoContent: React.FC = () => (
  <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[140px]">
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
      <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
        {homeFaqs.map((faq, i) => (
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
);

export default HomeSeoContent;
