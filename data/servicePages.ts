/* ------------------------------------------------------------------ */
/* Dati condivisi delle pagine servizio (pacchetti e FAQ). Unica fonte  */
/* per i componenti React (AIAgents, ServerSideTracking) e per          */
/* scripts/prerender.ts (HTML statico, schema JSON-LD, file .md).       */
/* ------------------------------------------------------------------ */

export interface Faq {
  question: string;
  answer: string;
}

export interface PriceItem {
  label: string;
  value: string;
}

export interface AIAgentsPackage {
  title: string;
  problem: string;
  actions?: string[];
  description?: string;
  requirements: string[];
  timing: string;
  setup: PriceItem;
  fee: PriceItem;
  /** Stringa per lo schema Offer, derivata da setup e canone. */
  price: string;
  /** Testo del pilot pubblico, senza i tempi (stanno in `timing`). */
  pilot?: string;
}

type AIAgentsPackageInput = Omit<AIAgentsPackage, 'price'>;

// "Setup 490 € · canone 59 €/mese", "Setup da 490 € · canone da 150 €/mese".
const withPrice = (pack: AIAgentsPackageInput): AIAgentsPackage => ({
  ...pack,
  price: `${pack.setup.label} ${pack.setup.value} · ${pack.fee.label.toLowerCase()} ${pack.fee.value}`,
});

export const aiAgentsPackages: AIAgentsPackage[] = [
  {
    title: 'Assistente virtuale sul sito',
    problem: 'Le stesse domande arrivano per telefono e mail, e fuori orario non risponde nessuno.',
    requirements: ['Sito accessibile', 'Elenco delle domande frequenti', 'Tono di voce', 'Un referente per la validazione delle risposte'],
    timing: '2 settimane',
    setup: { label: 'Setup', value: '490 €' },
    fee: { label: 'Canone', value: '59 €/mese' },
  },
  {
    title: 'Automazioni CRM e follow-up',
    problem: 'I lead non vengono ricontattati e il follow-up dipende da chi si ricorda.',
    actions: ['Lead da form, campagne o LinkedIn', 'Assegnato al commerciale giusto', 'Primo messaggio e promemoria pronti'],
    requirements: ['CRM esistente o incluso', 'Numero WhatsApp business', 'Elenco dei momenti di contatto da automatizzare'],
    timing: '2–3 settimane',
    setup: { label: 'Setup da', value: '490 €' },
    fee: { label: 'Canone da', value: '150 €/mese' },
  },
  {
    title: 'Richieste WhatsApp che arrivano già compilate',
    problem: 'I clienti ti scrivono in tre messaggi disordinati e qualcuno deve leggere, capire e ridigitare tutto a mano. Intanto il lead ha già chiesto un preventivo a qualcun altro.',
    description: 'Legge i messaggi, estrae ciò che serve, lo scrive nel CRM e risponde in meno di un minuto. Se manca un dato lo chiede; se non è certo, lo segnala invece di inventarlo.',
    requirements: ['Un numero WhatsApp collegabile alla piattaforma, dedicato se oggi usi WhatsApp Business dal cellulare', "L'elenco delle informazioni che ti servono per rispondere", 'Una persona che valida i primi giorni'],
    timing: '4–6 settimane',
    setup: { label: 'Setup', value: '990 €' },
    fee: { label: 'Canone', value: '200 €/mese' },
    pilot: 'Per i primi due clienti il setup costa 490 € invece di 990 €, in cambio del diritto di raccontare il progetto come caso studio e di una call di feedback dopo il primo mese.',
  },
].map(withPrice);

export const aiAgentsFaqs: Faq[] = [
  { question: 'Cosa succede se il mio problema non rientra in uno di questi tre pacchetti?', answer: "Te lo diciamo subito, prima di prendere un impegno. Non costruiamo pacchetti su misura solo per vendere qualcosa: se non è un buon caso d'uso per l'automazione, meglio saperlo in anticipo." },
  { question: 'Serve già un CRM per iniziare?', answer: "Per l'assistente virtuale no. Per le automazioni CRM e follow-up serve un CRM esistente, oppure lo includiamo nel setup: dipende da cosa usi già in azienda." },
  { question: 'Posso disdire il canone quando voglio?', answer: 'Sì, nessun vincolo pluriennale. Il canone copre monitoraggio e aggiornamenti quando le piattaforme (WhatsApp, CRM, i modelli AI sottostanti) cambiano le regole.' },
  { question: 'Quanto dura davvero il setup?', answer: "Varia per pacchetto: 2 settimane per l'assistente sul sito, 2-3 per le automazioni CRM, 4-6 per le richieste WhatsApp strutturate. Sono tempi reali, non stime commerciali: dipendono dalla complessità del processo che colleghiamo." },
];

export interface TrackingPackage {
  title: string;
  price: string;
  /** true = prezzo "a partire da" (etichetta "Prezzo da", schema "da …"). */
  priceFrom: boolean;
  /** Derivata da priceFrom. */
  priceLabel: string;
  timing: string;
  items: string[];
  note?: string;
}

type TrackingPackageInput = Omit<TrackingPackage, 'priceLabel'>;

export const trackingPackages: TrackingPackage[] = ([
  { title: 'Audit tracciamento', price: '490 €', priceFrom: false, timing: '3-5 giorni lavorativi', items: ['Verifica di cosa viene tracciato e cosa si perde oggi', 'Confronto tra dati piattaforma e dati reali', 'Analisi del Consent Mode e della configurazione attuale', 'Documento con le priorità di intervento'], note: 'Il documento resta tuo. Se decidi di non procedere, hai comunque una mappa di cosa sistemare.' },
  { title: 'Setup server-side', price: '1.500 €', priceFrom: true, timing: 'Circa una giornata di lavoro per siti non-ecommerce, 1-3 giornate per ecommerce.', items: ['Container server-side su infrastruttura dedicata', 'Consent Mode v2 configurato e verificato', 'Conversions API Meta ed Enhanced Conversions Google', 'Eventi personalizzati sui passaggi che contano', "Documentazione di eventi e naming, che resta all'azienda"], note: 'Disdetta libera. Nessun vincolo di durata.' },
  { title: 'Infrastruttura e lettura dati', price: '100 €/mese', priceFrom: true, timing: 'Il container resta attivo e monitorato nel tempo.', items: ['Container monitorato, con alert se qualcosa si interrompe', 'Aggiornamenti quando le piattaforme cambiano le regole', 'Report mensile con la lettura dei dati, non solo i numeri'] },
] as TrackingPackageInput[]).map((pack) => ({ ...pack, priceLabel: pack.priceFrom ? 'Prezzo da' : 'Prezzo' }));

/** Prezzo per lo schema Offer: "da 1.500 €" se priceFrom, altrimenti "490 €". */
export const trackingOfferPrice = (pack: TrackingPackage): string => (pack.priceFrom ? `da ${pack.price}` : pack.price);

/** FAQ visibili della pagina tracciamento (quelle del mockup). */
export const trackingFaqs: Faq[] = [
  { question: "Cos'è il tracciamento server-side, in parole semplici?", answer: 'Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.' },
  { question: 'Quanto costa e quanto tempo serve?', answer: "L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese." },
  { question: 'Il tracciamento server-side è conforme al GDPR?', answer: "Sì, e in più permette di ottenere più dati. Con il server-side si lavora sul dato a monte, prima che arrivi alle piattaforme, elaborandolo e anonimizzandolo. Alcuni cookie che in un setup solo client side richiederebbero un consenso specifico possono invece partire di default, e le piattaforme ricevono più informazioni: sempre in accordo con il DPO e dopo la valutazione del nostro consulente legale. A questo si aggiunge Consent Mode v2, che fa seguire i dati alle scelte di consenso dell'utente." },
  { question: 'Serve cambiare qualcosa sul mio sito?', answer: "Nell'implementazione standard no: il container gira su un sottodominio del tuo sito e il codice esistente resta. In alcuni casi serve un intervento sul tema o sui template, e te lo diciamo dopo l'audit." },
  { question: 'Lavori anche con la mia agenzia?', answer: 'Sì. Molte agenzie non hanno un tecnico interno per questa parte: possiamo lavorare direttamente con loro, anche in white label.' },
];

/**
 * La domanda sugli ad blocker non è tra le FAQ del mockup ma resta nello
 * schema FAQPage (seconda posizione): la risposta è la sezione "Come
 * recuperare le conversioni bloccate dagli ad blocker", e
 * scripts/verify-agentic.mjs la richiede nel JSON-LD.
 */
export const adBlockerFaq: Faq = {
  question: 'Come recuperare i dati di conversione bloccati dagli ad blocker?',
  answer: 'Prima si verifica quali eventi mancano e perché. Poi si configura una raccolta server-side con gli eventi e il consenso corretti, si inviano i segnali a Meta o Google tramite API e si deduplicano gli eventi inviati sia dal browser sia dal server. Il server-side riduce alcune perdite tecniche, ma non aggira consenso o regole privacy.',
};

/** Ordine delle FAQ nello schema FAQPage del tracciamento. */
export const trackingSchemaFaqs: Faq[] = [trackingFaqs[0], adBlockerFaq, ...trackingFaqs.slice(1)];
