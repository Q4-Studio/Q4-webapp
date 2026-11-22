/* ------------------------------------------------------------------ */
/* Dati condivisi delle pagine servizio (pacchetti, prezzi e FAQ).     */
/* Unica fonte per i componenti React (home, AIAgents,                  */
/* ServerSideTracking, SitesWebAI) e per scripts/prerender.ts (HTML     */
/* statico, schema JSON-LD, file .md).                                  */
/* ------------------------------------------------------------------ */

export interface Faq {
  question: string;
  answer: string;
}

export interface PriceItem {
  label: string;
  value: string;
}

/** "1.500 €" → 1500, "100 €/mese" → 100: importo numerico per lo schema Offer. */
export const euroAmount = (value: string): number => Number(value.replace(/[^\d]/g, ''));

/** Separatore delle migliaia sempre presente ("5.000"): Intl it-IT non lo mette sotto le 10.000. */
export const formatNumber = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const formatEuro = (n: number): string => `${formatNumber(n)} €`;

type PriceSpec = Record<string, unknown>;

/** Specifica di prezzo schema.org: prezzo esatto o minimo ("da …"), mensile se `monthly`. */
const priceSpecification = (amount: number, from: boolean, extra: PriceSpec = {}, monthly = false): PriceSpec => ({
  '@type': monthly ? 'UnitPriceSpecification' : 'PriceSpecification',
  ...extra,
  ...(from ? { minPrice: amount } : { price: amount }),
  priceCurrency: 'EUR',
  ...(monthly ? { unitCode: 'MON', unitText: 'mese' } : {}),
});

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

const isFrom = (item: PriceItem) => / da$/i.test(item.label);

/** Offer schema.org di un pacchetto automazioni: setup (prezzo dell'offerta) e canone mensile. */
export const aiAgentsOffer = (pack: AIAgentsPackage) => {
  const setupAmount = euroAmount(pack.setup.value);
  const setupFrom = isFrom(pack.setup);
  return {
    '@type': 'Offer',
    name: pack.title,
    description: pack.price,
    ...(setupFrom ? {} : { price: setupAmount }),
    priceCurrency: 'EUR',
    priceSpecification: [
      priceSpecification(setupAmount, setupFrom, { name: 'Setup' }),
      priceSpecification(euroAmount(pack.fee.value), isFrom(pack.fee), { name: 'Canone' }, true),
    ],
  };
};

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
  { title: 'Setup server-side', price: '1.500 €', priceFrom: true, timing: 'Circa una giornata di lavoro per siti non-ecommerce, 1-3 giornate per ecommerce.', items: ['Container server-side su infrastruttura dedicata', 'Consent Mode v2 configurato e verificato', 'Conversions API Meta ed Enhanced Conversions Google', 'Eventi personalizzati sui passaggi che contano', "Documentazione di eventi e naming, che resta all'azienda"] },
  { title: 'Infrastruttura e lettura dati', price: '100 €/mese', priceFrom: true, timing: 'Il container resta attivo e monitorato nel tempo.', items: ['Container monitorato, con alert se qualcosa si interrompe', 'Aggiornamenti quando le piattaforme cambiano le regole', 'Report mensile con la lettura dei dati, non solo i numeri'], note: 'Disdetta libera. Nessun vincolo di durata.' },
] as TrackingPackageInput[]).map((pack) => ({ ...pack, priceLabel: pack.priceFrom ? 'Prezzo da' : 'Prezzo' }));

/** Pacchetto del tracciamento per titolo (non per posizione nell'elenco). */
export const trackingPackage = (title: 'Audit tracciamento' | 'Setup server-side' | 'Infrastruttura e lettura dati'): TrackingPackage => {
  const pack = trackingPackages.find((p) => p.title === title);
  if (!pack) throw new Error(`Pacchetto tracciamento mancante: ${title}`);
  return pack;
};

/** Prezzo con il "da" dei prezzi di partenza: "da 1.500 €" oppure "490 €". */
export const priceWithFrom = (pack: Pick<TrackingPackage, 'price' | 'priceFrom'>): string => (pack.priceFrom ? `da ${pack.price}` : pack.price);

/**
 * Offer schema.org di un pacchetto tracciamento: `price` numerico per i
 * prezzi fissi, `priceSpecification.minPrice` per quelli "da …".
 */
export const trackingOffer = (pack: TrackingPackage) => {
  const amount = euroAmount(pack.price);
  const monthly = pack.price.includes('/mese');
  if (!pack.priceFrom && !monthly) return { '@type': 'Offer', name: pack.title, price: amount, priceCurrency: 'EUR' };
  return {
    '@type': 'Offer',
    name: pack.title,
    ...(pack.priceFrom ? {} : { price: amount }),
    priceCurrency: 'EUR',
    priceSpecification: priceSpecification(amount, pack.priceFrom, {}, monthly),
  };
};

/** Prezzo di partenza dei siti web ("da 2.999 €" in home e pagina siti). */
export const sitesStartingPrice = '2.999 €';

/** Offer schema.org della pagina siti: prezzo di partenza come minPrice. */
export const sitesOffer = {
  '@type': 'Offer',
  description: 'Prezzo di partenza',
  priceCurrency: 'EUR',
  priceSpecification: priceSpecification(euroAmount(sitesStartingPrice), true),
};

/**
 * Prezzi delle card servizi in home, derivati dai pacchetti: tracciamento
 * (audit e setup), automazioni (setup minimo e forchetta dei canoni), siti.
 */
const trackingAudit = trackingPackage('Audit tracciamento');
const trackingSetup = trackingPackage('Setup server-side');
const setupAmounts = aiAgentsPackages.map((pack) => euroAmount(pack.setup.value));
const feeAmounts = aiAgentsPackages.map((pack) => euroAmount(pack.fee.value));
/**
 * Prezzi derivati dei pacchetti automazioni: setup minimo ("490 €") e
 * forchetta dei canoni ("59" e "200", senza unità). Usati dalla home e
 * dalle pagine aziendali (data/companyPages.ts).
 */
export const automationsPricing = {
  setupFrom: formatEuro(Math.min(...setupAmounts)),
  feeMin: formatNumber(Math.min(...feeAmounts)),
  feeMax: formatNumber(Math.max(...feeAmounts)),
};
export const homePriceRows = {
  tracking: [
    { label: 'Audit da', value: trackingAudit.price }, // dicitura del mockup della home (D-027)
    { label: trackingSetup.priceFrom ? 'Setup da' : 'Setup', value: trackingSetup.price },
  ] as PriceItem[],
  automations: [
    { label: 'Setup da', value: automationsPricing.setupFrom },
    { label: 'Canone', value: `${automationsPricing.feeMin}–${automationsPricing.feeMax} €/mese` },
  ] as PriceItem[],
  sites: `da ${sitesStartingPrice}`,
};

/** "Audit 490 € · Setup da 1.500 €": riga prezzi per HTML statico e markdown. */
export const priceRowText = (items: PriceItem[]): string => items.map((item) => `${item.label} ${item.value}`).join(' · ');

/** FAQ GDPR, identica in home e nella pagina tracciamento (testo da decidere con Q4 Studio). */
export const gdprFaq: Faq = {
  question: 'Il tracciamento server-side è conforme al GDPR?',
  answer: "Sì, e in più permette di ottenere più dati. Con il server-side si lavora sul dato a monte, prima che arrivi alle piattaforme, elaborandolo e anonimizzandolo. Alcuni cookie che in un setup solo client side richiederebbero un consenso specifico possono invece partire di default, e le piattaforme ricevono più informazioni: sempre in accordo con il DPO e dopo la valutazione del nostro consulente legale. A questo si aggiunge Consent Mode v2, che fa seguire i dati alle scelte di consenso dell'utente.",
};

/** FAQ visibili della pagina tracciamento (quelle del mockup). */
export const trackingFaqs: Faq[] = [
  { question: "Cos'è il tracciamento server-side, in parole semplici?", answer: 'Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.' },
  { question: 'Quanto costa e quanto tempo serve?', answer: "L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese." },
  gdprFaq,
  { question: 'Serve cambiare qualcosa sul mio sito?', answer: "Nell'implementazione standard no: il container gira su un sottodominio del tuo sito e il codice esistente resta. In alcuni casi serve un intervento sul tema o sui template, e te lo diciamo dopo l'audit." },
  { question: 'Lavori anche con la mia agenzia?', answer: 'Sì. Molte agenzie non hanno un tecnico interno per questa parte: possiamo lavorare direttamente con loro, anche in white label.' },
];

/**
 * La domanda sugli ad blocker non era tra le FAQ del mockup: dal 2026-11-22
 * è visibile in seconda posizione (D-029) e, come prima, sta nello schema
 * FAQPage, dove scripts/verify-agentic.mjs la richiede.
 */
export const adBlockerFaq: Faq = {
  question: 'Come recuperare i dati di conversione bloccati dagli ad blocker?',
  answer: 'Prima si verifica quali eventi mancano e perché. Poi si configura una raccolta server-side con gli eventi e il consenso corretti, si inviano i segnali a Meta o Google tramite API e si deduplicano gli eventi inviati sia dal browser sia dal server. Il server-side riduce alcune perdite tecniche, ma non aggira consenso o regole privacy.',
};
trackingFaqs.splice(1, 0, adBlockerFaq);

/** Le FAQ dello schema FAQPage del tracciamento coincidono con quelle visibili. */
export const trackingSchemaFaqs: Faq[] = trackingFaqs;

/** FAQ della pagina Meta Ads B2B (mockup), usate anche da FAQPage e prerender. */
export const metaAdvertisingFaqs: Faq[] = [
  {
    question: 'In pratica, cos’è la B2B Lead Generation su Meta?',
    answer: 'È l’uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate su cliente giusto, messaggio, form, CRM e segnali di qualità.',
  },
  {
    question: 'Perché collegare Meta Ads, CRM e automazioni?',
    answer: 'Perché il CRM restituisce segnali più utili dell’invio form. Quando rientrano nel modello di ottimizzazione, le campagne cercano contatti più vicini al valore commerciale reale.',
  },
  {
    question: 'Lavorate anche con Google Ads?',
    answer: 'Sì. Lead generation e high ticket si gestiscono su Meta Ads e Google Ads, con lo stesso approccio: segnali puliti e lettura dei dati commerciali.',
  },
];

/** FAQ della pagina siti (mockup), usate anche da FAQPage, prerender e markdown. */
export const sitesWebAiFaqs: Faq[] = [
  {
    question: 'Il sito viene generato automaticamente dall’AI?',
    answer: 'No. L’AI accelera parti della produzione, ma direzione, struttura, messaggio, scelte visive e controllo finale restano umani. È fatto con l’AI, non dall’AI.',
  },
  {
    question: 'Quanto costa un sito web con Q4 Studio?',
    answer: `I progetti partono da ${sitesStartingPrice}. Il preventivo dipende dal tipo di sito, dai contenuti e dalla produzione necessaria: definiamo il progetto prima di iniziare.`,
  },
  {
    question: 'Quanto tempo serve per una landing page?',
    answer: 'Una landing page può essere pronta in una settimana. Per siti più articolati, tempi e fasi vengono definiti sul progetto.',
  },
  {
    question: 'Potete occuparvi anche di foto e video reali?',
    answer: 'Sì. Quando il progetto lo richiede, la produzione di foto e video reali può rientrare nella realizzazione, insieme ad asset creati con l’AI, video animati e sezioni con animazioni allo scroll.',
  },
];

/**
 * FAQ della home: unica fonte per components/HomeSeoContent.tsx, lo schema
 * FAQPage di dist/index.html (generato dal prerender) e l'HTML statico e il
 * markdown della home in scripts/prerender.ts.
 */
export const homeFaqs: Faq[] = [
  { question: "Cos'è il tracciamento server-side, in parole semplici?", answer: 'Invece di far inviare i dati dal browser del visitatore a Meta e Google, li raccoglie un server controllato da Q4. Gli ad blocker e la tracking prevention incontrano meno ostacoli, e le piattaforme ricevono conversioni più complete.' },
  { question: 'Quanto costa e quanto tempo serve?', answer: "L'audit parte da 490 €, il setup da 1.500 €. Un setup server-side tipico richiede circa 8 ore di lavoro." },
  gdprFaq,
  { question: 'Che tipo di automazioni fate, concretamente?', answer: "Automatizziamo il CRM: il lead entra in automatico, riceve un primo contatto su WhatsApp e via email e viene seguito con follow-up programmati per 7 giorni. Il team commerciale è avvisato quando c'è qualcosa da fare, il cliente riceve le sue notifiche, e l'appuntamento finisce in calendario." },
  { question: "Quanto costa e quanto tempo serve per un'automazione?", answer: 'Le automazioni partono in due settimane. Il setup parte da 490 €, il canone va da 59 a 200 € al mese.' },
  { question: "Cos'è un agente AI e cosa può fare per la mia azienda?", answer: "Un agente AI svolge compiti ripetitivi seguendo le regole e i dati della tua azienda. Un esempio: gli ordini arrivano sia via mail sia da software diversi, e l'agente li legge, li traduce in un formato unico e li invia in automatico al gestionale dell'azienda di produzione. Più flussi, un solo canale. Lo stesso approccio vale per le vendite, il back office e l'assistenza clienti." },
  { question: 'Lavorate anche con la mia agenzia?', answer: 'Sì. Realizziamo tracciamenti e automazioni anche in white label per altre agenzie.' },
  { question: 'Lavorate solo in Emilia?', answer: "No. La nostra sede è a Reggio Emilia, dove possiamo incontrare anche i clienti, ma siamo un team in remoto e abituati a lavorare così. Oltre il 90% dei nostri clienti è fuori dall'Emilia, e alcuni anche fuori dall'Unione Europea: ne abbiamo uno in Arabia Saudita." },
];

/** Schema FAQPage da un elenco di FAQ (componenti e prerender). */
export const faqPageSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
});
