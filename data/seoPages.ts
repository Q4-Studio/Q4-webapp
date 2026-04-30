export interface SeoPage {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  audience: string;
  pain: string;
  solution: string;
  proof: string;
  services: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const siteUrl = 'https://q4studio.it';

export const seoPages: SeoPage[] = [
  {
    slug: 'b2b-lead-generation-meta-ads',
    title: 'B2B Lead Generation su Meta Ads',
    metaTitle: 'B2B Lead Generation Meta Ads | Q4 Studio',
    description: 'Campagne Meta Ads per aziende B2B che vogliono generare lead qualificati, non solo contatti a basso costo.',
    keyword: 'b2b lead generation meta ads',
    audience: 'aziende B2B con cicli commerciali complessi, ticket medio alto e bisogno di qualificare meglio la domanda',
    pain: 'molte campagne producono lead economici ma poco lavorabili, con CRM incompleti, follow-up lenti e segnali di conversione deboli',
    solution: 'costruiamo audience, messaggi, form e tracking intorno al profilo cliente ideale, poi ottimizziamo sugli eventi che anticipano MQL, SQL e pipeline reale',
    proof: 'nei progetti con integrazione CRM corretta misuriamo in media un +40% di lead qualificati nei primi 90 giorni',
    services: ['Audit account Meta', 'Architettura campagne full funnel', 'Creatività e offerte B2B', 'Tracking CRM e conversion API'],
    faqs: [
      {
        question: 'Meta Ads funziona per il B2B?',
        answer: 'Si, quando la strategia non cerca solo volume. Serve allineare ICP, messaggio, domande qualificanti e segnali CRM.'
      },
      {
        question: 'Quale KPI guardate oltre al CPL?',
        answer: 'Monitoriamo MQL rate, SQL rate, velocità di contatto, appuntamenti generati e valore pipeline attribuibile.'
      }
    ]
  },
  {
    slug: 'meta-ads-b2b-verona',
    title: 'Meta Ads B2B a Verona',
    metaTitle: 'Meta Ads B2B Verona | Q4 Studio',
    description: 'Gestione Meta Ads B2B per aziende di Verona che vogliono acquisire contatti qualificati e opportunità commerciali misurabili.',
    keyword: 'meta ads b2b verona',
    audience: 'PMI e aziende industriali di Verona che vendono servizi, consulenza o prodotti con trattativa commerciale',
    pain: 'il traffico generico consuma budget e lascia al team sales contatti freddi o fuori target',
    solution: 'progettiamo campagne localizzate, landing angle e automazioni di follow-up per trasformare l\'interesse in conversazioni commerciali',
    proof: 'Q4 Studio lavora da Verona e Reggio Emilia con focus verticale su acquisizione B2B e automazioni AI',
    services: ['Strategia Meta locale', 'Lead form qualificanti', 'Follow-up WhatsApp/email', 'Dashboard KPI commerciali'],
    faqs: [
      {
        question: 'Lavorate solo con aziende di Verona?',
        answer: 'No, lavoriamo in tutta Italia, ma la presenza locale aiuta nei progetti dove serve maggiore vicinanza operativa.'
      },
      {
        question: 'Potete integrare il CRM esistente?',
        answer: 'Si, l\'integrazione CRM e il routing dei lead sono parte del setup quando servono segnali commerciali affidabili.'
      }
    ]
  },
  {
    slug: 'agenti-ai-per-lead-generation',
    title: 'Agenti AI per Lead Generation',
    metaTitle: 'Agenti AI per Lead Generation | Q4 Studio',
    description: 'Agenti AI personalizzati per qualificare lead, accelerare il follow-up e ridurre il lavoro manuale del team commerciale.',
    keyword: 'agenti ai lead generation',
    audience: 'aziende che ricevono lead ma perdono opportunità per tempi di risposta lenti, processi manuali o qualificazione incoerente',
    pain: 'un lead caldo perde valore se non viene qualificato, assegnato e contattato rapidamente con il messaggio corretto',
    solution: 'disegniamo agenti AI collegati a CRM, email e canali di messaggistica per verificare requisiti, prioritizzare contatti e attivare follow-up contestuali',
    proof: 'nei funnel maturi l\'automazione può ridurre fino al 35% i tempi medi di prima risposta',
    services: ['Mappatura processo sales', 'Prompt e knowledge base aziendale', 'Integrazione CRM', 'Monitoraggio conversazioni e handoff umano'],
    faqs: [
      {
        question: 'Un agente AI sostituisce il team sales?',
        answer: 'No. L\'obiettivo è togliere attività ripetitive e portare al commerciale contatti più ordinati e prioritizzati.'
      },
      {
        question: 'Serve avere già un CRM?',
        answer: 'Non sempre, ma un CRM migliora controllo, misurazione e qualità dei dati usati dall\'agente.'
      }
    ]
  },
  {
    slug: 'crm-automation-meta-ads',
    title: 'CRM Automation per Meta Ads',
    metaTitle: 'CRM Automation Meta Ads | Q4 Studio',
    description: 'Automazioni CRM per sincronizzare lead Meta Ads, follow-up e segnali di qualità verso le campagne.',
    keyword: 'crm automation meta ads',
    audience: 'team marketing e sales che vogliono collegare campagne Meta, CRM e pipeline commerciale',
    pain: 'senza dati puliti il sistema ottimizza su invii form, non su opportunità reali',
    solution: 'strutturiamo eventi, naming convention, routing e feedback loop per rimandare a Meta segnali di qualità più utili del semplice lead',
    proof: 'la sincronizzazione CRM migliora la qualità del modello di ottimizzazione e rende più leggibile il contributo delle campagne alla pipeline',
    services: ['Conversion API', 'Routing lead', 'SLA di contatto', 'Report MQL/SQL/revenue'],
    faqs: [
      {
        question: 'Perché collegare CRM e Meta Ads?',
        answer: 'Perché Meta apprende meglio quando riceve segnali legati alla qualità commerciale, non solo alla compilazione del form.'
      },
      {
        question: 'Quali CRM potete integrare?',
        answer: 'Valutiamo caso per caso. In genere lavoriamo con CRM e strumenti che espongono API, webhook o automazioni native.'
      }
    ]
  },
  {
    slug: 'whatsapp-automation-lead-b2b',
    title: 'WhatsApp Automation per Lead B2B',
    metaTitle: 'WhatsApp Automation Lead B2B | Q4 Studio',
    description: 'Automazioni WhatsApp per rispondere prima, qualificare meglio e aumentare il tasso di appuntamento dei lead B2B.',
    keyword: 'whatsapp automation lead b2b',
    audience: 'aziende B2B che vogliono ridurre la latenza tra acquisizione lead e primo contatto utile',
    pain: 'quando il follow-up arriva tardi, il prospect dimentica la richiesta o viene intercettato da competitor più rapidi',
    solution: 'impostiamo sequenze WhatsApp collegate al CRM, con domande qualificanti, reminder e passaggio al commerciale nel momento giusto',
    proof: 'il miglioramento della velocità di contatto è uno dei driver più rapidi per aumentare appuntamenti e qualità pipeline',
    services: ['Sequenze WhatsApp', 'Qualifica automatica', 'Reminder appuntamenti', 'Handoff al sales'],
    faqs: [
      {
        question: 'WhatsApp va bene per lead B2B?',
        answer: 'Si, se usato con consenso, tono professionale e messaggi utili. Non deve diventare spam.'
      },
      {
        question: 'Si integra con Meta Lead Ads?',
        answer: 'Si, il lead può attivare un flusso di follow-up e aggiornare il CRM in tempo reale.'
      }
    ]
  },
  {
    slug: 'algoritmo-andromeda-meta-b2b',
    title: 'Algoritmo Andromeda Meta per B2B',
    metaTitle: 'Algoritmo Andromeda Meta B2B | Q4 Studio',
    description: 'Come usare l\'algoritmo Andromeda di Meta per migliorare qualità dei lead, creatività e segnali di conversione B2B.',
    keyword: 'algoritmo andromeda meta b2b',
    audience: 'aziende e marketer B2B che vogliono rendere Meta Ads più prevedibile e meno dipendente da test casuali',
    pain: 'l\'algoritmo distribuisce budget in base ai segnali che riceve: se i segnali sono deboli, anche l\'ottimizzazione resta debole',
    solution: 'allineiamo creatività, evento di conversione e dati CRM per dare al sistema segnali più vicini al valore commerciale reale',
    proof: 'quando i segnali sono coerenti, le campagne tendono a trovare utenti con maggiore probabilità di avanzare nel funnel',
    services: ['Audit segnali di conversione', 'Creative testing', 'Event taxonomy', 'Ottimizzazione su qualità lead'],
    faqs: [
      {
        question: 'Andromeda cambia il modo di fare advertising B2B?',
        answer: 'Rende ancora più importante la qualità dei segnali e delle creatività, perché il sistema deve capire quali utenti hanno valore reale.'
      },
      {
        question: 'Serve più budget per sfruttarlo?',
        answer: 'Non necessariamente. Serve prima una struttura dati e creativa più chiara, poi il budget può scalare con meno dispersione.'
      }
    ]
  }
];

export const getSeoPageBySlug = (slug: string) => seoPages.find((page) => page.slug === slug);
