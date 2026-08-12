// Cluster keyword da SEO_GUIDE.md: A = tracciamento server-side (hub
// /tracciamento-server-side), C/D = automazioni CRM/WhatsApp e agenti AI
// (hub /agenti-ai, venduti insieme come "automazioni e agenti AI" sullo
// stesso cliente). Usato per link "Pagine correlate" cluster-aware e per il
// link mandatorio spoke→hub, invece di scegliere pagine a caso.
export type SeoCluster = 'A' | 'C' | 'D';

export const clusterHub: Record<SeoCluster, { path: string; label: string }> = {
  A: { path: '/tracciamento-server-side', label: 'Tracciamento server-side' },
  C: { path: '/agenti-ai', label: 'Agenti AI e automazioni' },
  D: { path: '/agenti-ai', label: 'Agenti AI e automazioni' },
};

export interface SeoPage {
  slug: string;
  cluster: SeoCluster;
  // Data reale dell'ultima modifica di contenuto di questa pagina, per il
  // <lastmod> della sitemap. Aggiornare a mano quando si cambia il testo di
  // questa pagina — NON usare la data di build, che si resetta ad ogni
  // deploy anche se il contenuto non è cambiato (finding SEO audit 2026-08).
  lastModified: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  audience: string;
  pain: string;
  solution: string;
  proof: string;
  directAnswer: string;
  clusters: Array<{
    keyword: string;
    heading: string;
    content: string;
  }>;
  comparisonTable?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
  dataPoints: string[];
  services: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// Data reale di ultima modifica per le pagine bespoke/indice (home, offerta,
// indici). Aggiornare a mano quando si cambia il contenuto della pagina
// corrispondente — non usare la data di build in scripts/prerender.ts, che
// si resetta ad ogni deploy anche a contenuto invariato.
export const pageLastModified: Record<string, string> = {
  '/': '2026-08-09',
  '/agenti-ai': '2026-08-09',
  '/tracciamento-server-side': '2026-08-09',
  '/siti-web-ai': '2026-08-09',
  '/meta-advertising-b2b': '2026-08-07',
  '/partner-tecnico': '2026-08-07',
  '/casi-studio': '2026-08-05',
  '/risorse': '2026-08-09',
  '/blog': '2026-08-07',
};

export const siteUrl = 'https://www.q4.studio';
export const resourcesPath = '/risorse';

export const seoPages: SeoPage[] = [
  {
    slug: 'agenti-ai-per-lead-generation',
    cluster: 'D',
    lastModified: '2026-08-09',
    title: 'Agenti AI per i Processi Commerciali e Operativi',
    metaTitle: 'Agenti AI per Processi Commerciali | Q4 Studio',
    description: 'Agenti AI che qualificano le richieste, preparano una prima risposta e aggiornano i sistemi aziendali, per alleggerire il lavoro ripetitivo di commerciali e back office.',
    keyword: 'agenti ai processi commerciali',
    audience: 'aziende che ricevono richieste e contatti ma perdono tempo in attività ripetitive: leggere messaggi, verificare informazioni, aggiornare gestionale e CRM',
    pain: 'molte ore del team commerciale e operativo se ne vanno in attività meccaniche, invece che nelle trattative e nelle decisioni che contano davvero',
    solution: 'progettiamo agenti AI collegati a CRM, gestionale, email e messaggistica che leggono le richieste, verificano le informazioni, preparano una prima risposta o azione e aggiornano i sistemi, lasciando alle persone solo le decisioni che richiedono giudizio',
    proof: 'nei processi automatizzati il tempo dedicato ad attività ripetitive si riduce in modo netto, e il team può concentrarsi sulle richieste che meritano davvero attenzione umana',
    directAnswer: 'Gli Agenti AI per i processi commerciali e operativi sono sistemi che leggono le richieste in arrivo, verificano le informazioni necessarie, preparano una prima risposta o azione e aggiornano CRM e gestionale, passando alle persone solo i casi che richiedono una decisione.',
    clusters: [
      {
        keyword: 'chatbot vs agenti ai processi aziendali',
        heading: 'Chatbot vs Agenti AI nei processi aziendali',
        content: 'I chatbot tradizionali seguono script rigidi e spesso non capiscono richieste fuori schema. Gli Agenti AI usano modelli linguistici avanzati per capire il contesto, leggere una richiesta reale e agire di conseguenza: aggiornare un ordine, preparare una risposta, aprire una pratica. La differenza conta soprattutto quando le richieste sono tante e ripetitive: un agente che capisce il contesto evita che il cliente debba ripetersi o aspettare inutilmente.'
      },
      {
        keyword: 'come lavora un agente ai sui processi aziendali',
        heading: 'Come lavora un Agente AI sui processi aziendali',
        content: 'L\'agente osserva una richiesta (email, messaggio, form) e la confronta con le informazioni disponibili in azienda: anagrafica cliente, storico, listini, stato di un ordine. Le regole su cosa può fare da solo e cosa deve passare a una persona vengono definite insieme al team che oggi gestisce quel processo, e tradotte in istruzioni e in una base di conoscenza aziendale. L\'output è un\'azione già pronta - una risposta, un aggiornamento, una bozza - che una persona controlla prima che diventi definitiva.'
      },
      {
        keyword: 'automazione ai processi commerciali',
        heading: 'Automazione AI nei processi commerciali',
        content: 'L\'automazione nei processi commerciali non sostituisce chi vende: toglie le attività che consumano tempo senza richiedere esperienza specifica. Rispondere a domande informative, verificare disponibilità, preparare documentazione, aggiornare lo stato di una trattativa nel CRM sono operazioni che si possono automatizzare senza perdere il controllo. Il commerciale resta al centro delle conversazioni che contano.'
      },
      {
        keyword: 'costo agente ai per aziende',
        heading: 'Quanto costa un Agente AI per aziende',
        content: 'Il costo dipende dalla complessità del processo, dai sistemi da collegare e dal volume di richieste da gestire. In genere il primo agente su un processo reale richiede 2-4 settimane di lavoro insieme al team che lo conosce meglio. I costi di gestione mensile (piattaforma, monitoraggio) sono una frazione del tempo che oggi viene dedicato manualmente alle stesse attività. Il ritorno si misura in ore recuperate e in errori evitati, non in un numero unico e generico.'
      }
    ],
    comparisonTable: {
      title: 'Confronto approcci alla gestione delle richieste',
      headers: ['Approccio', 'Tempo di risposta', 'Coerenza', 'Scalabilità', 'Costo mensile'],
      rows: [
        ['Gestione manuale', 'Ore-giorni', 'Variabile', 'Bassa', 'Alto'],
        ['Chatbot base', 'Immediata', 'Scarsa', 'Media', 'Basso'],
        ['Agente AI su misura', 'Immediata', 'Alta', 'Alta', 'Medio'],
        ['Outsourcing / call center', 'Ore', 'Media', 'Media', 'Medio-alto']
      ]
    },
    dataPoints: [
      'Riduzione del tempo dedicato ad attività ripetitive quando l\'agente gestisce prima lettura e prima risposta',
      'Aggiornamento automatico di CRM e gestionale ad ogni richiesta gestita',
      'Risposta disponibile 24/7 senza personale aggiuntivo',
      'Setup tipico: 2-4 settimane di lavoro congiunto con il team che conosce il processo'
    ],
    services: ['Mappatura del processo', 'Base di conoscenza aziendale', 'Integrazione CRM e gestionale', 'Monitoraggio e controllo umano'],
    faqs: [
      {
        question: 'Un agente AI sostituisce le persone del team?',
        answer: 'No. L\'obiettivo è togliere le attività ripetitive e lasciare alle persone le decisioni e le conversazioni che richiedono giudizio.'
      },
      {
        question: 'Serve avere già un CRM o un gestionale?',
        answer: 'Non sempre, ma un sistema esistente rende più semplice l\'integrazione e migliora la qualità dei dati che l\'agente usa.'
      },
      {
        question: 'L\'agente può sbagliare?',
        answer: 'Può capitare. Per questo prevediamo controllo umano sulle azioni più delicate e una revisione periodica di come lavora l\'agente. Migliora con il tempo e con il feedback.'
      },
      {
        question: 'Su quali canali può operare?',
        answer: 'In genere email, WhatsApp, sito web e i sistemi aziendali già in uso. Valutiamo altri canali in base al processo.'
      }
    ]
  },
  {
    slug: 'agente-vocale-ai-aziende',
    cluster: 'D',
    lastModified: '2026-08-09',
    title: 'Agente Vocale AI per Aziende',
    metaTitle: 'Agente Vocale AI per aziende | Q4 Studio',
    description: 'Agenti vocali AI per qualificare richieste, rispondere al telefono, fissare appuntamenti e supportare team commerciali e customer care.',
    keyword: 'agente vocale ai aziende',
    audience: 'aziende che ricevono molte chiamate, richieste ripetitive o lead da qualificare prima del passaggio al team umano',
    pain: 'telefonate perse, tempi di risposta variabili e informazioni raccolte in modo incoerente riducono qualità del servizio',
    solution: 'progettiamo agenti vocali collegati a script, knowledge base, CRM e calendari, con escalation umana e controllo delle conversazioni',
    proof: 'un agente vocale è utile quando gestisce task ripetibili, raccoglie dati strutturati e passa al team solo i casi che richiedono giudizio',
    directAnswer: 'Un agente vocale AI per aziende risponde o effettua chiamate seguendo regole operative, raccoglie informazioni, qualifica richieste, aggiorna il CRM e passa a un operatore umano quando la conversazione supera i limiti previsti.',
    clusters: [
      { keyword: 'voice ai lead qualification', heading: 'Voice AI per qualifica lead', content: 'La voice AI può contattare lead appena acquisiti, verificare interesse, zona, disponibilità e requisiti minimi. Il valore sta nel trasformare una telefonata ripetitiva in dati ordinati nel CRM.' },
      { keyword: 'agente vocale crm', heading: 'Agente vocale collegato al CRM', content: 'Il collegamento al CRM permette di leggere schede cliente, aggiornare stati, creare note e assegnare attività. Senza integrazione, l\'agente resta un front-end conversazionale poco utile.' },
      { keyword: 'ai voice appointment setting', heading: 'Fissare appuntamenti con AI vocale', content: 'Quando il flusso è chiaro, l\'agente può proporre slot disponibili, confermare appuntamenti e inviare promemoria. Le regole di escalation evitano conversazioni fuori perimetro.' },
      { keyword: 'agente vocale italiano', heading: 'Agente vocale AI in italiano', content: 'Per il mercato italiano sono fondamentali tono, chiarezza, gestione delle pause e trasparenza. L\'agente deve dichiarare il proprio ruolo e rispettare consenso, privacy e finalità del contatto.' }
    ],
    comparisonTable: {
      title: 'Agente vocale AI vs operatore umano',
      headers: ['Aspetto', 'Agente vocale AI', 'Operatore umano'],
      rows: [
        ['Task ripetitivi', 'Molto adatto', 'Costoso su grandi volumi'],
        ['Empatia complessa', 'Limitata', 'Forte'],
        ['Aggiornamento CRM', 'Automatico se integrato', 'Manuale o semi-manuale'],
        ['Escalation', 'Regole definite', 'Giudizio diretto']
      ]
    },
    dataPoints: ['Ideale per richieste ripetitive e qualifica iniziale', 'Richiede script, knowledge base e regole di escalation', 'Funziona meglio se collegato a CRM e calendario', 'Va monitorato con review conversazioni e soglie di qualità'],
    services: ['Disegno flussi vocali', 'Knowledge base e script', 'Integrazione CRM/calendario', 'Monitoraggio e handoff umano'],
    faqs: [
      { question: 'Un agente vocale AI può chiamare i lead?', answer: 'Si, se il contesto, il consenso e le regole operative sono corretti. Il flusso va progettato per essere trasparente e utile.' },
      { question: 'Può sostituire il centralino?', answer: 'Può gestire una parte delle richieste ripetitive, ma conviene mantenere escalation umana per casi complessi o sensibili.' },
      { question: 'Si integra con il CRM?', answer: 'Si, quando il CRM espone API, webhook o automazioni. L\'integrazione è una parte centrale del progetto.' },
      { question: 'Serve una voce personalizzata?', answer: 'Dipende dal brand e dal caso d\'uso. Prima definiamo obiettivo, tono e limiti, poi scegliamo la soluzione vocale.' }
    ]
  },
  {
    slug: 'centralino-ai',
    cluster: 'D',
    lastModified: '2026-08-09',
    title: 'Centralino AI per Aziende',
    metaTitle: 'Centralino AI per aziende | Q4 Studio',
    description: 'Centralino AI per rispondere, classificare chiamate, raccogliere dati e smistare richieste verso team commerciali, customer care o back office.',
    keyword: 'centralino ai',
    audience: 'aziende con molte chiamate in ingresso, richieste ripetitive o necessità di smistamento più ordinato',
    pain: 'chiamate perse, trasferimenti manuali e note incomplete creano ritardi e peggiorano la qualità del servizio',
    solution: 'configuriamo un centralino AI con flussi conversazionali, regole di routing, integrazione CRM e passaggio a operatore umano',
    proof: 'un centralino AI funziona quando riduce attrito operativo senza nascondere i limiti dell\'automazione',
    directAnswer: 'Un centralino AI risponde alle chiamate, identifica motivo del contatto, raccoglie dati essenziali, aggiorna sistemi interni e smista la richiesta al reparto corretto, mantenendo escalation umana per casi complessi.',
    clusters: [
      { keyword: 'centralino virtuale ai', heading: 'Centralino virtuale AI', content: 'Un centralino virtuale AI non è solo una voce automatica: deve riconoscere intenzioni, applicare regole e scrivere dati nei sistemi aziendali. Il valore dipende dall\'integrazione con processi reali.' },
      { keyword: 'ai receptionist aziende', heading: 'AI receptionist per aziende', content: 'Un AI receptionist può gestire richieste semplici, raccogliere informazioni e prenotare callback. È utile per ridurre chiamate perse e rendere più ordinato il primo contatto.' },
      { keyword: 'smistamento chiamate ai', heading: 'Smistamento chiamate con AI', content: 'Lo smistamento automatico funziona quando i reparti, le priorità e le eccezioni sono chiari. Ogni chiamata può generare una nota o attività nel CRM.' },
      { keyword: 'centralino ai crm', heading: 'Centralino AI e CRM', content: 'Collegare il centralino al CRM consente di riconoscere clienti, creare ticket, aggiornare stati e mantenere storico delle richieste.' }
    ],
    comparisonTable: {
      title: 'Quando usare un centralino AI',
      headers: ['Scenario', 'Adatto?', 'Nota'],
      rows: [
        ['Richieste ripetitive', 'Si', 'Informazioni, orari, stato richieste'],
        ['Qualifica commerciale', 'Si', 'Serve script e CRM'],
        ['Assistenza delicata', 'Con cautela', 'Escalation umana rapida'],
        ['Vendita complessa', 'Supporto', 'Meglio passaggio al sales']
      ]
    },
    dataPoints: ['Riduce chiamate perse se configurato come primo livello', 'Richiede regole chiare di routing ed escalation', 'Può generare note e attività nel CRM', 'Va testato su casi reali prima di scalare'],
    services: ['Analisi chiamate', 'Progettazione flussi', 'Routing reparti', 'Integrazione CRM e ticket'],
    faqs: [
      { question: 'Il centralino AI risponde 24/7?', answer: 'Può farlo, ma bisogna definire quali richieste gestisce fuori orario e quando promette una richiamata.' },
      { question: 'Può passare la chiamata a un umano?', answer: 'Si, l\'escalation è una parte fondamentale del progetto.' },
      { question: 'Registra le chiamate?', answer: 'Dipende dalla configurazione e dagli obblighi privacy. Valutiamo informativa, consenso e conservazione dati.' },
      { question: 'È adatto a piccole aziende?', answer: 'Si, se il volume o la ripetitività delle chiamate giustifica il setup.' }
    ]
  },
  {
    slug: 'riattivazione-database-clienti-ai',
    cluster: 'C',
    lastModified: '2026-08-09',
    title: 'Riattivazione del Database Clienti con l\'AI',
    metaTitle: 'Riattivazione Database Clienti con AI | Q4 Studio',
    description: 'Usiamo l\'AI sui dati già presenti in azienda per far ripartire relazioni commerciali ferme, con segmentazione, messaggi mirati e automazioni di contatto.',
    keyword: 'riattivazione database clienti ai',
    audience: 'aziende con un CRM, un gestionale o semplici elenchi di clienti e contatti storici che non vengono più lavorati',
    pain: 'informazioni preziose restano ferme in un file o in un CRM: contatti mai richiamati, clienti che non sentiamo da tempo, preventivi dimenticati',
    solution: 'analizziamo i dati già presenti in azienda, li segmentiamo per storico e interesse, e costruiamo messaggi e automazioni per far ripartire il contatto nel modo più naturale possibile',
    proof: 'i dati che un\'azienda ha già raccolto nel tempo sono spesso la fonte di opportunità più sottovalutata, perché richiedono ordine più che nuovo budget',
    directAnswer: 'La riattivazione del database clienti con l\'AI usa i dati già presenti in azienda - contatti, storico, preventivi fermi - per segmentare, scrivere messaggi mirati e automatizzare il contatto, così le relazioni ferme possono ripartire senza dover cercare nuovi contatti da zero.',
    clusters: [
      { keyword: 'perché riattivare il database aziendale', heading: 'Perché riattivare il database invece di cercarne uno nuovo', content: 'Molte aziende investono per acquisire nuovi contatti mentre il database esistente resta inutilizzato: clienti storici, preventivi mai chiusi, richieste ricevute e mai seguite fino in fondo. Riattivare questi dati costa meno che acquisirne di nuovi e spesso porta a risultati più rapidi, perché si parte da una relazione già esistente.' },
      { keyword: 'ai per segmentare i dati aziendali', heading: 'Come l\'AI aiuta a segmentare i dati', content: 'L\'AI può leggere note, storico degli acquisti e segnali disponibili nei sistemi aziendali per suggerire a chi vale la pena scrivere per primo e con quale messaggio. Non sostituisce la strategia commerciale: rende più gestibile lavorare un database ampio senza passare mesi a leggerlo a mano.' },
      { keyword: 'email e whatsapp per riattivare i clienti', heading: 'Email e WhatsApp per far ripartire il contatto', content: 'Email e WhatsApp lavorano bene insieme: l\'email è adatta a contenuti più lunghi e contestualizzati, WhatsApp a promemoria e coordinamento veloce. La scelta del canale dipende dal consenso raccolto e dal tipo di relazione con il contatto.' },
      { keyword: 'pulizia e ordine del database clienti', heading: 'Prima di riattivare: pulizia del database', content: 'Prima di scrivere a chiunque serve verificare consensi, duplicati e dati mancanti. Un database disordinato produce messaggi sbagliati e automazioni poco affidabili. La pulizia iniziale è spesso il lavoro più utile, anche se meno visibile, di tutto il progetto.' }
    ],
    comparisonTable: {
      title: 'Segmenti tipici di un database da riattivare',
      headers: ['Segmento', 'Obiettivo', 'Output'],
      rows: [
        ['Clienti inattivi', 'Recuperare la relazione', 'Contatto diretto o nuova proposta'],
        ['Contatti mai richiamati', 'Capire se l\'interesse esiste ancora', 'Qualifica aggiornata'],
        ['Preventivi fermi', 'Sbloccare una decisione', 'Follow-up mirato'],
        ['Richieste passate', 'Capire il momento giusto', 'Nuova priorità nel CRM']
      ]
    },
    dataPoints: ['Prima fase: pulizia e segmentazione dei dati esistenti', 'Messaggi diversi in base a storico, interesse e consenso raccolto', 'L\'AI aiuta a classificare priorità e proporre bozze di messaggio, sempre con controllo umano', 'Il lavoro sui dati esistenti spesso costa meno che acquisire nuovi contatti'],
    services: ['Audit e pulizia del database', 'Segmentazione dei contatti', 'Sequenze email/WhatsApp', 'Classificazione AI e follow-up'],
    faqs: [
      { question: 'Si può riattivare un database vecchio?', answer: 'Si, ma prima vanno verificati consensi, qualità dei dati e pertinenza del messaggio.' },
      { question: 'L\'AI scrive i messaggi al posto nostro?', answer: 'Può proporre bozze e varianti, sempre con revisione umana e nel rispetto del tono del brand.' },
      { question: 'Funziona anche con clienti già acquisiti?', answer: 'Si, spesso i clienti inattivi sono il segmento con più valore, se l\'offerta è pertinente.' },
      { question: 'Quali canali si usano?', answer: 'Email, WhatsApp, telefono e attività nel CRM, scelti in base a consenso e contesto.' }
    ]
  },
  {
    slug: 'chatbot-cliniche-studi-medici',
    cluster: 'D',
    lastModified: '2026-08-09',
    title: 'Chatbot AI per Cliniche e Studi Medici',
    metaTitle: 'Chatbot AI per cliniche e studi medici | Q4 Studio',
    description: 'Chatbot AI per cliniche e studi medici: risposte informative, triage amministrativo, prenotazioni e gestione richieste con escalation umana.',
    keyword: 'chatbot cliniche studi medici',
    audience: 'cliniche, poliambulatori e studi medici che ricevono molte richieste ripetitive da sito, WhatsApp o telefono',
    pain: 'segreterie sovraccariche, richieste incomplete e tempi di risposta variabili peggiorano esperienza paziente e organizzazione interna',
    solution: 'progettiamo chatbot con knowledge base verificata, limiti chiari, raccolta dati amministrativi, prenotazioni e passaggio alla segreteria',
    proof: 'nel sanitario l\'AI deve restare entro confini informativi e amministrativi, con controllo umano e attenzione a privacy e responsabilità',
    directAnswer: 'Un chatbot AI per cliniche e studi medici risponde a domande amministrative, raccoglie dati per prenotazioni, orienta verso il reparto corretto e passa alla segreteria quando la richiesta è clinica, urgente o fuori perimetro.',
    clusters: [
      { keyword: 'chatbot prenotazioni studio medico', heading: 'Chatbot per prenotazioni', content: 'Il chatbot può raccogliere preferenze, dati di contatto, prestazione richiesta e disponibilità, poi creare una richiesta ordinata per la segreteria o collegarsi a un calendario.' },
      { keyword: 'ai receptionist clinica', heading: 'AI receptionist per cliniche', content: 'Un AI receptionist aiuta a gestire richieste ripetitive come orari, servizi, documenti da portare e preparazione amministrativa. Le domande cliniche devono andare a personale qualificato.' },
      { keyword: 'chatbot sanitario privacy', heading: 'Privacy e limiti nel sanitario', content: 'Nel contesto sanitario servono informativa, minimizzazione dati, limiti chiari e procedure di escalation. Il chatbot non deve fare diagnosi o sostituire personale medico.' },
      { keyword: 'whatsapp chatbot studio medico', heading: 'Chatbot WhatsApp per studio medico', content: 'WhatsApp può essere utile per promemoria e richieste amministrative, ma va gestito con attenzione a consenso, contenuto dei messaggi e dati personali.' }
    ],
    comparisonTable: {
      title: 'Cosa può e non può fare',
      headers: ['Richiesta', 'Gestione chatbot', 'Escalation'],
      rows: [
        ['Orari e servizi', 'Si', 'Solo se dubbia'],
        ['Prenotazione', 'Si, raccolta dati', 'Segreteria o calendario'],
        ['Sintomi o urgenze', 'No diagnosi', 'Indicazioni di contatto umano'],
        ['Referti e dati sensibili', 'Con cautela', 'Procedure dedicate']
      ]
    },
    dataPoints: ['Knowledge base verificata con la struttura', 'Confini chiari tra informazione amministrativa e contenuto clinico', 'Escalation alla segreteria per richieste sensibili o complesse', 'Integrazione possibile con form, calendario, CRM o gestionale'],
    services: ['Audit richieste pazienti', 'Knowledge base sanitaria', 'Chatbot sito/WhatsApp', 'Escalation e integrazioni'],
    faqs: [
      { question: 'Il chatbot può dare consigli medici?', answer: 'No. Deve restare su informazioni amministrative e orientamento generale, passando al personale qualificato quando serve.' },
      { question: 'Può aiutare la segreteria?', answer: 'Si, raccoglie richieste ordinate, risponde a domande ripetitive e riduce messaggi incompleti.' },
      { question: 'È compatibile con la privacy?', answer: 'Va progettato con attenzione a informativa, consenso, minimizzazione dati e conservazione. La configurazione dipende dal caso specifico.' },
      { question: 'Si può integrare con WhatsApp?', answer: 'Si, quando il canale è gestito con consenso e regole precise sui dati trattati.' }
    ]
  },
  {
    slug: 'crm-automation-meta-ads',
    cluster: 'C',
    lastModified: '2026-08-09',
    title: 'Integrazione e Automazione dei Dati Aziendali',
    metaTitle: 'Integrazione Dati e Automazione CRM | Q4 Studio',
    description: 'Colleghiamo CRM, gestionale, advertising e altri sistemi aziendali per avere dati coerenti e processi automatizzati, senza lavoro manuale duplicato.',
    keyword: 'integrazione dati aziendali crm',
    audience: 'aziende che usano più strumenti (CRM, gestionale, advertising, moduli web) con dati sparsi e poco collegati tra loro',
    pain: 'quando i sistemi non si parlano, qualcuno deve copiare i dati a mano da uno strumento all\'altro, con ritardi ed errori',
    solution: 'colleghiamo i sistemi aziendali con automazioni che sincronizzano i dati in tempo reale, così ogni strumento - CRM, gestionale, advertising, sito - lavora sulle stesse informazioni aggiornate',
    proof: 'quando i dati sono collegati, ogni sistema, advertising incluso, può usare informazioni più affidabili per funzionare meglio',
    directAnswer: 'L\'integrazione e automazione dei dati aziendali collega CRM, gestionale, sito e canali di advertising in un unico flusso, così le informazioni restano coerenti ovunque e ogni sistema, pubblicità inclusa, lavora su dati reali invece che su semplici moduli compilati.',
    clusters: [
      {
        keyword: 'perché collegare i sistemi aziendali',
        heading: 'Perché collegare i sistemi aziendali',
        content: 'Quando CRM, gestionale, sito e strumenti di advertising lavorano separati, ogni cambiamento va aggiornato a mano in più posti: un rischio concreto di errori e ritardi. Collegare i sistemi con automazioni evita le doppie battiture, riduce gli errori e permette a ogni strumento di lavorare su dati aggiornati in tempo reale.'
      },
      {
        keyword: 'automazione dati tra crm e advertising',
        heading: 'Automazione dei dati tra CRM e advertising',
        content: 'Quando il CRM comunica con le piattaforme di advertising, queste ricevono informazioni più utili del semplice modulo compilato: per esempio se un contatto è diventato un cliente vero o no. Questo aiuta le piattaforme a cercare persone più simili a chi ha davvero comprato, invece di ottimizzare solo sul numero di moduli inviati.'
      },
      {
        keyword: 'smistamento automatico dei contatti',
        heading: 'Smistamento automatico dei contatti',
        content: 'Il routing automatico assegna ogni nuovo contatto alla persona giusta in base a criteri come zona, tipo di richiesta o carico di lavoro. Senza questo passaggio, i contatti finiscono in un elenco comune e il tempo di presa in carico si allunga. Con l\'automazione, il contatto arriva già assegnato, con una notifica immediata.'
      },
      {
        keyword: 'tempi di risposta ai contatti',
        heading: 'Perché contano i tempi di risposta',
        content: 'Rispondere velocemente a chi ha appena scritto o compilato un modulo fa una differenza enorme: un contatto lasciato senza risposta per ore perde interesse o si rivolge altrove. Automatizzare la prima risposta e la notifica al team interno è uno dei modi più semplici per migliorare i risultati senza aumentare il lavoro manuale.'
      }
    ],
    comparisonTable: {
      title: 'Confronto livelli di integrazione dei sistemi',
      headers: ['Livello', 'Dati condivisi', 'Affidabilità', 'Complessità', 'Beneficio'],
      rows: [
        ['Sistemi separati', 'Nessuno', 'Bassa', 'Bassa', 'Limitato'],
        ['Sincronizzazione base', 'Contatti, ordini', 'Media', 'Media', 'Buono'],
        ['Integrazione completa', 'Contatti, stati, valore reale', 'Alta', 'Media-alta', 'Ottimo']
      ]
    },
    dataPoints: [
      'L\'integrazione tra sistemi riduce il lavoro manuale di copia e incolla dei dati',
      'Il tempo di presa in carico di un contatto si riduce quando lo smistamento è automatico',
      'I sistemi di advertising lavorano meglio quando ricevono segnali di qualità, non solo moduli compilati',
      'Un\'integrazione base richiede in genere 2-3 giorni, una completa 1-2 settimane'
    ],
    services: ['Mappatura dei sistemi in uso', 'Sincronizzazione dati', 'Smistamento automatico', 'Automazioni di follow-up'],
    faqs: [
      {
        question: 'Perché collegare CRM, gestionale e advertising?',
        answer: 'Perché ogni sistema funziona meglio quando riceve dati aggiornati e affidabili, non solo un modulo compilato.'
      },
      {
        question: 'Quali strumenti potete integrare?',
        answer: 'Valutiamo caso per caso. In genere lavoriamo con sistemi che espongono API, webhook o automazioni.'
      },
      {
        question: 'Quanto tempo richiede l\'integrazione?',
        answer: 'Un\'integrazione base richiede 2-3 giorni di lavoro. Un\'integrazione completa, con più sistemi collegati, richiede 1-2 settimane.'
      },
      {
        question: 'Serve un tecnico interno?',
        answer: 'Non necessariamente. Ci occupiamo noi della parte tecnica, ma è utile un referente che conosca i processi e i dati aziendali.'
      }
    ]
  },
  {
    slug: 'whatsapp-automation-lead-b2b',
    cluster: 'C',
    lastModified: '2026-08-09',
    title: 'Automazione WhatsApp nei Processi Aziendali',
    metaTitle: 'Automazione WhatsApp per Aziende | Q4 Studio',
    description: 'Automazioni WhatsApp collegate ai sistemi aziendali per gestire richieste, ordini, assistenza e smistamento senza perdere tempo prezioso.',
    keyword: 'automazione whatsapp aziende',
    audience: 'aziende che ricevono su WhatsApp richieste, ordini o domande di assistenza e vogliono gestirle in modo più rapido e ordinato',
    pain: 'quando le risposte arrivano in ritardo o si perdono tra le chat, il cliente si sente trascurato e il team perde traccia di cosa è stato fatto',
    solution: 'colleghiamo WhatsApp ai sistemi aziendali (CRM, gestionale) con automazioni che rispondono subito alle richieste ricorrenti, raccolgono le informazioni utili e passano alla persona giusta quando serve',
    proof: 'ridurre il tempo tra richiesta e prima risposta è uno dei modi più rapidi per migliorare la percezione del servizio e la velocità dei processi',
    directAnswer: 'L\'automazione WhatsApp per le aziende collega la chat ai sistemi interni per rispondere subito alle richieste più comuni, raccogliere le informazioni utili su ordini o assistenza e passare al collega giusto quando è necessario un intervento umano.',
    clusters: [
      {
        keyword: 'whatsapp business api aziende',
        heading: 'WhatsApp Business API per le aziende',
        content: 'L\'API di WhatsApp Business permette alle aziende di collegare la chat ai propri sistemi: inviare messaggi automatici, ricevere richieste strutturate, integrare CRM e gestionale. A differenza dell\'app WhatsApp Business normale, l\'API supporta l\'invio programmato di messaggi e la gestione di più numeri e più operatori insieme. È lo strumento giusto quando i volumi di richieste rendono la chat manuale difficile da gestire.'
      },
      {
        keyword: 'crm automation whatsapp aziende',
        heading: 'Automatizzare le richieste su WhatsApp collegando il CRM',
        content: 'Una automazione WhatsApp risponde subito alle domande più frequenti (orari, stato di un ordine, disponibilità), raccoglie le informazioni necessarie per una richiesta più complessa e la gira alla persona giusta con già tutti i dati pronti. Il flusso si adatta al tipo di richiesta: chi scrive per un ordine non deve rispondere alle stesse domande di chi scrive per assistenza. Quando WhatsApp è collegato al CRM, ogni conversazione aggiorna da sola la scheda del contatto - nuovo messaggio, stato della richiesta, esito - così il commerciale trova già tutto pronto senza dover copiare nulla a mano.'
      },
      {
        keyword: 'whatsapp ordini e assistenza aziende',
        heading: 'WhatsApp per ordini e assistenza',
        content: 'Molte aziende ricevono ordini e richieste di assistenza direttamente su WhatsApp, spesso in modo disordinato. Un flusso automatico può raccogliere i dati dell\'ordine, verificarli con il gestionale e creare una bozza pronta per la conferma, oppure guidare il cliente verso l\'informazione che cerca senza attendere una persona libera.'
      },
      {
        keyword: 'whatsapp vs email aziende',
        heading: 'WhatsApp ed email nei processi aziendali',
        content: 'L\'email resta il canale giusto per documentazione, proposte e comunicazioni formali. WhatsApp ha tassi di apertura molto più alti e tempi di risposta molto più brevi, quindi funziona meglio per richieste rapide, promemoria e coordinamento. I processi più efficaci usano entrambi i canali, ciascuno dove rende di più.'
      }
    ],
    comparisonTable: {
      title: 'Confronto canali per la gestione delle richieste',
      headers: ['Canale', 'Tasso apertura', 'Tempo di risposta', 'Adatto a'],
      rows: [
        ['Email', '20-30%', 'Ore-giorni', 'Documentazione, proposte'],
        ['WhatsApp', '90%+', 'Minuti', 'Richieste rapide, ordini, assistenza'],
        ['Telefono', 'N/A', 'Immediato', 'Casi complessi, urgenze']
      ]
    },
    dataPoints: [
      'Tasso di apertura dei messaggi WhatsApp: oltre il 90%',
      'Tempo medio di risposta su WhatsApp molto più basso rispetto all\'email',
      'Le automazioni riducono i tempi morti tra richiesta e prima risposta',
      'Utile per coordinare ordini, assistenza e promemoria quando il consenso e il tono restano corretti'
    ],
    services: ['Flussi WhatsApp automatici', 'Integrazione CRM/gestionale', 'Smistamento richieste', 'Passaggio al team umano'],
    faqs: [
      {
        question: 'WhatsApp va bene per gestire richieste aziendali?',
        answer: 'Si, se usato con consenso, tono corretto e messaggi utili. Non deve mai diventare invasivo.'
      },
      {
        question: 'Le automazioni WhatsApp si integrano con il CRM che già uso?',
        answer: 'Si, quando il CRM espone API o automazioni: la conversazione aggiorna da sola scheda contatto, stato della richiesta ed eventuali attività di follow-up, senza copia manuale dei dati.'
      },
      {
        question: 'Serve l\'API ufficiale di WhatsApp?',
        answer: 'Si, per automazioni strutturate serve la WhatsApp Business API. Ci occupiamo noi della configurazione e dell\'approvazione dei modelli di messaggio.'
      },
      {
        question: 'I clienti trovano invasivo ricevere messaggi automatici?',
        answer: 'Dipende da tono e frequenza. I messaggi utili (conferma richiesta, aggiornamento stato) sono percepiti positivamente; limitiamo sempre il numero di messaggi e lasciamo spazio al passaggio a una persona.'
      }
    ]
  },
  {
    slug: 'tracking-server-side-deduplicazione-eventi',
    cluster: 'A',
    lastModified: '2026-08-09',
    title: 'Tracking Server-Side e Deduplicazione degli Eventi',
    metaTitle: 'Tracking Server-Side e Deduplicazione Eventi | Q4 Studio',
    description: 'Come funziona il tracking server-side, perché senza deduplicazione degli eventi i numeri di conversione si gonfiano. Q4 Studio è Stape Partner.',
    keyword: 'tracking server-side deduplicazione eventi',
    audience: 'aziende che investono in advertising digitale (Meta, Google) e vedono i numeri di conversione non coincidere tra piattaforme pubblicitarie, analytics e CRM',
    pain: 'i browser bloccano sempre più script e cookie eseguiti lato client (cioè direttamente nel browser dell\'utente), quindi una parte delle conversioni reali non viene registrata; se poi si aggiunge un tracciamento server-side senza gestirlo bene, lo stesso evento rischia di essere contato due volte, gonfiando i numeri nella direzione opposta',
    solution: 'configuriamo il tracciamento server-side (una raccolta dati che passa da un server anziché solo dal browser dell\'utente) e impostiamo la deduplicazione degli eventi tra le due fonti, così ogni conversione viene contata una sola volta ed è più resistente ai blocchi di ad blocker e browser orientati alla privacy',
    proof: 'siamo Stape Partner per il server-side tagging: la configurazione tecnica corretta non è un dettaglio, è quello che decide se i numeri su cui l\'azienda decide il budget sono affidabili o no',
    directAnswer: 'Il tracking server-side raccoglie i dati di navigazione e conversione tramite un server intermedio invece che solo dal browser dell\'utente, riducendo l\'impatto di ad blocker e browser privacy-first. La deduplicazione degli eventi assicura che la stessa conversione, se arriva sia dal client che dal server, venga contata una sola volta invece di gonfiare i numeri nei report.',
    clusters: [
      { keyword: 'cosa cambia rispetto al tracciamento tradizionale', heading: 'Tracciamento client-side vs server-side: cosa cambia', content: 'Il tracciamento tradizionale (client-side) invia i dati direttamente dal browser dell\'utente alla piattaforma pubblicitaria, tramite pixel e script che ad blocker, Safari ITP e Firefox ETP possono bloccare in parte. Il tracciamento server-side sposta questa raccolta su un server, spesso collegato a un dominio proprio del sito, rendendo la trasmissione dei dati meno dipendente dai blocchi impostati nel browser. Non è una soluzione magica: resta comunque soggetto a consenso e alle regole privacy, ma riduce la perdita di segnali dovuta ai soli blocchi tecnici.' },
      { keyword: 'cos\'è la deduplicazione degli eventi', heading: 'Cos\'è la deduplicazione degli eventi e perché serve', content: 'Quando lo stesso evento (per esempio un acquisto) viene inviato sia dal browser sia dal server, la piattaforma pubblicitaria rischia di registrarlo due volte se non riceve un\'indicazione che si tratta dello stesso evento. La deduplicazione risolve questo problema assegnando a ogni evento un identificativo univoco, condiviso tra le due fonti: la piattaforma lo riconosce e conta l\'evento una sola volta. Senza questo passaggio, i dati di conversione risultano gonfiati e le decisioni sul budget pubblicitario si basano su numeri sbagliati.' },
      { keyword: 'perché i dati di advertising non tornano con il crm', heading: 'Perché i numeri di advertising non coincidono con il CRM', content: 'Capita spesso che i numeri di conversione mostrati da Meta o Google non coincidano con quelli reali nel CRM aziendale. Le cause più comuni sono opposte tra loro: da un lato il blocco di cookie e script fa sottostimare le conversioni reali; dall\'altro un tracciamento server-side aggiunto senza deduplicazione le sovrastima. Il modo corretto di leggere questi numeri è confrontarli sempre con i dati reali del CRM, non fidarsi solo di quello che mostra la piattaforma pubblicitaria.' },
      { keyword: 'stape partner server-side tagging', heading: 'Perché lavoriamo con Stape per il server-side tagging', content: 'Il server-side tagging richiede un\'infrastruttura tecnica da configurare e mantenere: un container che riceve i dati, li elabora e li inoltra correttamente alle piattaforme di advertising e analytics. Q4 Studio è Stape Partner, e usa questa infrastruttura per configurare il tracciamento server-side dei clienti in modo affidabile, mantenendo la deduplicazione degli eventi e monitorando che i dati restino coerenti nel tempo.' }
    ],
    comparisonTable: {
      title: 'Tracciamento client-side vs server-side',
      headers: ['Aspetto', 'Client-side', 'Server-side'],
      rows: [
        ['Sensibilità a blocchi browser e ad blocker', 'Alta', 'Bassa'],
        ['Dominio da cui parte la richiesta dati', 'Dominio della piattaforma', 'Dominio proprio del sito'],
        ['Rischio doppio conteggio', 'Nullo (unica fonte)', 'Presente se manca la deduplicazione'],
        ['Manutenzione richiesta', 'Bassa', 'Richiede configurazione e monitoraggio nel tempo']
      ]
    },
    dataPoints: [
      'Il tracciamento client-side perde eventi quando ad blocker, Safari ITP o Firefox ETP bloccano script e cookie',
      'La deduplicazione confronta un identificativo univoco (event ID) tra evento client-side e server-side per contarlo una sola volta',
      'Senza deduplicazione, lo stesso evento può comparire due volte nei report advertising, gonfiando i risultati',
      'Q4 Studio è Stape Partner per la configurazione e la manutenzione del server-side tagging'
    ],
    services: ['Audit del tracciamento esistente', 'Configurazione server-side tagging (Stape)', 'Deduplicazione degli eventi tra client e server', 'Verifica e monitoraggio continuo dei dati raccolti'],
    faqs: [
      { question: 'Il tracking server-side sostituisce completamente quello client-side?', answer: 'No, di solito lavorano insieme: il client-side resta utile per segnali immediati, il server-side aggiunge affidabilità contro i blocchi. La deduplicazione evita che lo stesso evento venga contato due volte.' },
      { question: 'Cosa serve per attivare il tracking server-side?', answer: 'Un dominio proprio da collegare al container server-side, accesso agli strumenti di advertising e analytics già in uso, e una configurazione tecnica che curiamo noi come Stape Partner.' },
      { question: 'La deduplicazione richiede modifiche al sito?', answer: 'Serve identificare ogni evento con lo stesso identificativo sia lato client sia lato server: normalmente si interviene sul codice di tracciamento esistente, senza toccare il resto del sito.' },
      { question: 'Il server-side tagging risolve da solo i problemi di privacy?', answer: 'No. Gli obblighi su consenso, informativa e conservazione dei dati restano gli stessi: cambia dove viene elaborato il dato, non le regole sulla privacy da rispettare.' }
    ]
  },
  {
    slug: 'reminder-automatici-appuntamenti-no-show',
    cluster: 'C',
    lastModified: '2026-08-09',
    title: 'Reminder Automatici per Ridurre i Mancati Appuntamenti',
    metaTitle: 'Reminder Automatici contro i No-Show | Q4 Studio',
    description: 'Sequenze di reminder automatici su WhatsApp, email e SMS collegate a calendario e gestionale, con conferma e disdetta gestite senza intervento manuale.',
    keyword: 'reminder automatici appuntamenti no-show',
    audience: 'studi medici e odontoiatrici, centri estetici, officine e studi di consulenza che lavorano su appuntamenti fissati in agenda',
    pain: 'ogni appuntamento non disdetto in tempo utile è uno slot che nessun altro cliente può occupare, con perdita di fatturato e agenda disorganizzata; richiamare tutti a mano richiede tempo che raramente la segreteria ha davvero',
    solution: 'colleghiamo calendario e gestionale a sequenze automatiche di promemoria su WhatsApp, email e SMS, che permettono di confermare o disdire senza una telefonata e liberano lo slot in tempo utile per essere riassegnato',
    proof: 'un promemoria automatico arriva sempre, anche quando la segreteria è al telefono con qualcun altro, e la conferma o la disdetta aggiornano subito l\'agenda',
    directAnswer: 'I reminder automatici per ridurre i no-show sono sequenze di messaggi su WhatsApp, email e SMS collegate al calendario e al gestionale: ricordano l\'appuntamento, permettono di confermare o disdire con un click e liberano lo slot in tempo utile per essere riassegnato, senza che qualcuno debba telefonare manualmente ogni cliente.',
    clusters: [
      { keyword: 'perché si perdono appuntamenti senza reminder', heading: 'Perché nascono i mancati appuntamenti', content: 'Molti no-show non nascono da cattiva volontà: la persona si dimentica, non ha un modo semplice per disdire con anticipo, oppure il promemoria arriva troppo tardi o non arriva affatto. La segreteria, quando c\'è, spesso non ha il tempo di richiamare uno per uno tutti gli appuntamenti del giorno dopo, soprattutto nei momenti di maggior carico.' },
      { keyword: 'whatsapp email sms per promemoria appuntamenti', heading: 'WhatsApp, email e SMS: quale canale usare', content: 'WhatsApp funziona bene per la rapidità e per un tasso di apertura molto alto rispetto ad altri canali. L\'email resta utile per dettagli più lunghi, come indicazioni o documenti da portare. L\'SMS è un buon canale di riserva per chi non usa WhatsApp o non controlla spesso la posta. Una sequenza tipica prevede un primo promemoria alcuni giorni prima e uno il giorno prima, con la possibilità di confermare o disdire in entrambi.' },
      { keyword: 'conferma e disdetta automatica appuntamenti', heading: 'Conferma e disdetta gestite in automatico', content: 'Il messaggio di promemoria include un modo semplice per confermare o disdire, per esempio un link o un pulsante. Quando il cliente risponde, il sistema aggiorna da solo calendario e gestionale, senza che una persona debba intervenire manualmente: se disdice, lo slot risulta libero e può essere proposto a un altro cliente in lista d\'attesa.' },
      { keyword: 'reminder appuntamenti studio medico centro estetico officina', heading: 'Settori dove il reminder automatico fa la differenza', content: 'Negli studi medici e odontoiatrici ogni visita saltata è tempo specialistico non recuperabile. Nei centri estetici i trattamenti sono spesso prenotati con giorni o settimane di anticipo, e un\'assenza dell\'ultimo momento è difficile da rimpiazzare. Nelle officine, tagliandi e revisioni occupano una postazione per ore. Negli studi di consulenza, un appuntamento saltato significa un\'ora di lavoro specializzato non recuperata.' }
    ],
    comparisonTable: {
      title: 'Gestione dei promemoria: manuale vs automatica',
      headers: ['Aspetto', 'Promemoria manuale', 'Reminder automatico'],
      rows: [
        ['Chi se ne occupa', 'Segreteria o titolare, quando ha tempo', 'Sistema collegato a calendario e gestionale'],
        ['Copertura', 'Solo gli appuntamenti che si riesce a richiamare', 'Ogni appuntamento, sempre'],
        ['Conferma o disdetta', 'Richiede una telefonata di rientro', 'Gestita dal cliente con un click'],
        ['Aggiornamento agenda', 'Manuale, spesso in ritardo', 'Immediato']
      ]
    },
    dataPoints: [
      'WhatsApp ha un tasso di apertura dei messaggi molto più alto rispetto a email e SMS, utile per far leggere il promemoria in tempo',
      'La sequenza tipica prevede un promemoria alcuni giorni prima e uno il giorno prima dell\'appuntamento',
      'La disdetta gestita in automatico libera lo slot in tempo utile per riassegnarlo a un altro cliente',
      'Il collegamento a calendario e gestionale evita che qualcuno debba aggiornare l\'agenda a mano dopo ogni conferma o disdetta'
    ],
    services: ['Mappatura del processo di prenotazione', 'Sequenze di promemoria multicanale', 'Integrazione con calendario e gestionale', 'Gestione automatica di conferme e disdette'],
    faqs: [
      { question: 'Il reminder automatico elimina del tutto i no-show?', answer: 'Li riduce, non li azzera: alcune assenze restano imprevedibili. L\'obiettivo è dare a tutti la possibilità di confermare o disdire in tempo utile, così lo slot libero può essere riassegnato.' },
      { question: 'Serve un calendario o un gestionale specifico?', answer: 'Serve un sistema che permetta di leggere e aggiornare gli appuntamenti, come un calendario digitale o il gestionale già in uso. Valutiamo l\'integrazione caso per caso.' },
      { question: 'Su quali canali arrivano i promemoria?', answer: 'In genere WhatsApp ed email, con l\'SMS come alternativa per chi non ha WhatsApp. La combinazione dipende dai contatti disponibili e dal consenso raccolto.' },
      { question: 'È adatto anche a piccole strutture con pochi appuntamenti al giorno?', answer: 'Si, il beneficio è proporzionale al valore di ogni slot occupato: anche poche assenze evitate al mese possono giustificare il progetto.' }
    ]
  },
  {
    slug: 'second-brain-aziendale-agente-ai',
    cluster: 'D',
    lastModified: '2026-08-09',
    title: 'Second Brain Aziendale: un Agente AI per la Conoscenza dell\'Azienda',
    metaTitle: 'Second Brain Aziendale con Agenti AI | Q4 Studio',
    description: 'Un agente AI che indicizza documenti, email, offerte e procedure aziendali e risponde al team citando la fonte, senza dipendere dalla memoria delle persone.',
    keyword: 'second brain aziendale agente ai',
    audience: 'aziende dove documenti, email, offerte e procedure sono sparsi tra cartelle, caselle di posta e strumenti diversi, e la stessa domanda finisce sempre per essere fatta a chi "sa dove trovare le cose"',
    pain: 'quando un\'informazione vive solo nella memoria di poche persone o in file sparsi, il team perde tempo a cercarla, la richiede più volte alle stesse persone e si blocca quando quella persona è assente o lascia l\'azienda',
    solution: 'costruiamo un agente AI che indicizza (cioè legge, organizza e rende ricercabile) i documenti, le email, le offerte e le procedure già esistenti in azienda, e risponde alle domande del team indicando la fonte esatta da cui arriva la risposta',
    proof: 'un agente che indica da dove arriva la risposta restituisce fiducia in quello che dice, cosa che un semplice elenco di file trovati da una ricerca non garantisce da solo',
    directAnswer: 'Un Second Brain aziendale è un agente AI che indicizza - cioè legge e rende ricercabili - documenti, email, offerte, procedure e altra conoscenza già presente in azienda, e risponde alle domande del team indicando da quale documento arriva la risposta, riducendo il tempo perso a cercare informazioni e la dipendenza dalla memoria delle singole persone.',
    clusters: [
      { keyword: 'dove si perde la conoscenza in azienda', heading: 'Dove si perde la conoscenza aziendale', content: 'La conoscenza operativa di un\'azienda vive spesso in luoghi diversi e poco collegati: cartelle condivise disordinate, email di singole persone, procedure mai scritte o scritte una volta e mai aggiornate, offerte rifatte da zero perché nessuno ritrova la precedente. Il problema si aggrava quando una persona chiave è in ferie, malata o lascia l\'azienda: la conoscenza che aveva in testa va persa o va ricostruita a fatica.' },
      { keyword: 'come funziona un agente ai che risponde con le fonti', heading: 'Come funziona un agente che risponde citando la fonte', content: 'L\'agente legge i documenti aziendali - PDF, email, offerte passate, procedure interne - e li indicizza, cioè li organizza in modo che diventino ricercabili per contenuto e non solo per nome del file. Quando qualcuno fa una domanda, l\'agente recupera i passaggi rilevanti e costruisce una risposta diretta, indicando il documento (e dove possibile la sezione) da cui l\'ha presa, così chi riceve la risposta può verificarla invece di doversi fidare a scatola chiusa.' },
      { keyword: 'differenza tra motore di ricerca interno e agente ai', heading: 'Motore di ricerca interno vs agente AI aziendale', content: 'Un motore di ricerca interno restituisce un elenco di documenti che contengono una parola chiave: tocca comunque aprirli e leggerli per trovare la risposta. Un agente AI aziendale, invece, legge il contenuto di quei documenti e restituisce direttamente la risposta, citando la fonte. Il passaggio in più - aprire e leggere i file uno a uno - è proprio quello che si elimina.' },
      { keyword: 'cosa indicizzare per un second brain aziendale', heading: 'Cosa indicizzare per iniziare', content: 'Conviene partire da un perimetro ristretto: un\'area già ragionevolmente organizzata, per esempio le offerte commerciali oppure le procedure tecniche di un reparto. Si allarga il perimetro solo dopo che il primo agente ha dimostrato di rispondere in modo utile e verificabile, ed è il team a fidarsi delle risposte che riceve.' }
    ],
    comparisonTable: {
      title: 'Come si cerca un\'informazione in azienda',
      headers: ['Metodo', 'Dove cerca', 'Tipo di risposta', 'Verificabile'],
      rows: [
        ['Chiedere a chi "sa"', 'Nella sua memoria', 'Dipende da chi risponde e da quando', 'Difficile'],
        ['Cartelle e email condivise', 'File sparsi in più strumenti', 'Nessuna: bisogna aprire i file uno a uno', 'Si, ma richiede tempo'],
        ['Motore di ricerca interno', 'Indice per parole chiave', 'Elenco di documenti da controllare', 'Si, ma serve leggerli'],
        ['Agente AI (Second Brain)', 'Documenti indicizzati e collegati', 'Risposta diretta con la fonte citata', 'Si, in un solo passaggio']
      ]
    },
    dataPoints: [
      'L\'agente indicizza documenti, email, offerte e procedure già esistenti, senza richiedere che vengano riscritti da zero',
      'Ogni risposta indica la fonte esatta - il documento o la sezione - così chi la riceve può verificarla',
      'Il perimetro iniziale tipico è un\'area sola, per esempio offerte commerciali o procedure tecniche, per poi allargarsi quando il team si fida delle risposte',
      'Riduce la dipendenza dalla memoria delle singole persone, utile soprattutto quando qualcuno è assente o lascia l\'azienda'
    ],
    services: ['Mappatura delle fonti di conoscenza aziendale', 'Indicizzazione di documenti, email e procedure', 'Agente AI con risposte e citazione della fonte', 'Formazione del team all\'uso quotidiano'],
    faqs: [
      { question: 'Il Second Brain sostituisce le persone che oggi rispondono alle domande?', answer: 'No, toglie il lavoro ripetitivo di cercare e ripetere le stesse informazioni, lasciando alle persone i casi che richiedono giudizio o conoscenza non ancora documentata.' },
      { question: 'Serve riscrivere tutte le procedure aziendali prima di iniziare?', answer: 'No. L\'agente parte dai documenti già esistenti, anche se disordinati; il primo passo è mappare cosa c\'è già e scegliere un perimetro iniziale ristretto.' },
      { question: 'Come fa a sapere se una risposta è affidabile?', answer: 'Ogni risposta indica la fonte da cui arriva, così chi la riceve può controllare il documento originale invece di fidarsi a scatola chiusa.' },
      { question: 'Quanto tempo serve per avere un primo perimetro funzionante?', answer: 'Dipende da quanti documenti e sistemi sono coinvolti; in genere si parte da un\'area ristretta e già abbastanza ordinata, in linea con i tempi di setup di altri progetti di agenti AI su misura.' }
    ]
  }
];

export const getSeoPageBySlug = (slug: string) => seoPages.find((page) => page.slug === slug);
