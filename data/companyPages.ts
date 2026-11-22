import { aiAgentsPackages, euroAmount, formatEuro, formatNumber, sitesStartingPrice, trackingPackages } from './servicePages';

/* ------------------------------------------------------------------ */
/* Testi e dati delle pagine aziendali chiare: /contact (Contatti.html), */
/* /about (About.html) e /privacy (Privacy.html). Unica fonte per i      */
/* componenti React (ContactPage, AboutPage, Privacy) e per              */
/* scripts/prerender.ts (mirror statico e markdown). I prezzi arrivano   */
/* dai pacchetti di data/servicePages.ts, mai scritti a mano qui.        */
/* ------------------------------------------------------------------ */

/** Recapiti e dati legali reali (gli stessi dello schema Organization). */
export const company = {
  name: 'Q4 Studio',
  legalName: 'Q4 Studio di Sebastiano Riva',
  city: 'Reggio Emilia',
  region: 'Emilia-Romagna',
  vatId: 'IT03033250352',
  /** P.IVA senza prefisso paese, come nel testo legale della privacy. */
  vatNumber: '03033250352',
  email: 'info@q4.studio',
  phone: '+39 338 357 6286',
  phoneHref: 'tel:+393383576286',
  linkedin: 'https://www.linkedin.com/company/q4studio',
  instagram: 'https://www.instagram.com/q4.studio',
  founder: 'Sebastiano Riva',
  founderRole: 'Fondatore, Q4 Studio',
  /** Foto del fondatore già pubblicata in public/team (sezione team della vecchia home). */
  founderPhoto: '/team/sebastiano.webp',
};

const [trackingAudit, trackingSetup] = trackingPackages;
const setupAmounts = aiAgentsPackages.map((pack) => euroAmount(pack.setup.value));
const feeAmounts = aiAgentsPackages.map((pack) => euroAmount(pack.fee.value));
/** "Da 1.500 €" per i prezzi "da", "490 €" per quelli fissi. */
const priceText = (price: string, from: boolean) => (from ? `Da ${price}` : price);
const sentence = (text: string) => (/[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

/* --------------------------------- Contatti ------------------------------- */

export interface CompanyCard {
  title: string;
  text: string;
  /** Link della card: mailto/tel o pagina interna. Senza href la card non è un link. */
  href?: string;
}

export const contactPageCopy = {
  metaTitle: 'Contatti | Q4 Studio',
  metaDescription: `Contatta Q4 Studio: ${company.email}, ${company.phone}, form sul sito. Sede a ${company.city}, risposta entro un giorno lavorativo.`,
  mdDescription: `Contatta Q4 Studio via email, telefono o form: sede a ${company.city}, risposta entro un giorno lavorativo.`,
  kicker: 'Contatti',
  title: 'Parla con Q4 Studio.',
  lead: 'Scrivici o chiamaci: rispondiamo entro un giorno lavorativo. Nessun obbligo dopo il primo contatto.',
  find: {
    title: 'Come ci trovi.',
    lead: `Racconta il problema in una frase: ti rispondiamo con il punto di partenza giusto. Riceviamo su appuntamento a ${company.city}; il lavoro tecnico si fa in remoto per aziende in tutta Italia.`,
    /** Anteprima del form (le etichette del mockup); il form vero è la sezione #contatti. */
    formFields: ['Nome e azienda', 'Email o telefono', 'Qual è il problema, in una frase?'],
    formCta: 'Compila il modulo',
  },
  channels: {
    title: 'Canali diretti.',
    items: [
      { title: 'Email', text: company.email, href: `mailto:${company.email}` },
      { title: 'Telefono e WhatsApp', text: company.phone, href: company.phoneHref },
      { title: 'Sede', text: `${company.city}, su appuntamento` },
    ] as CompanyCard[],
  },
  brief: {
    title: 'Cosa scrivere per una risposta utile.',
    lead: 'Con queste informazioni la prima risposta include già un’indicazione di pacchetto, prezzo e tempistica.',
    items: [
      { label: 'Il problema concreto', hint: 'es. conversioni, lead, sito' },
      { label: 'Gli strumenti che usi', hint: 'CRM, gestionale, WhatsApp' },
      { label: 'I tempi previsti', hint: 'quando serve' },
    ],
  },
  startingPoints: {
    title: 'Punti di partenza.',
    items: [
      {
        title: trackingAudit!.title,
        text: `${priceText(trackingAudit!.price, trackingAudit!.priceFrom)}, ${trackingAudit!.timing}. Il documento resta tuo anche se non procedi.`,
        href: '/tracciamento-server-side',
      },
      {
        title: trackingSetup!.title,
        text: `${priceText(trackingSetup!.price, trackingSetup!.priceFrom)}. ${sentence(trackingSetup!.timing)}`,
        href: '/tracciamento-server-side',
      },
      {
        title: 'Automazioni e agenti AI',
        text: `Setup da ${formatEuro(Math.min(...setupAmounts))}, canone da ${formatNumber(Math.min(...feeAmounts))} a ${formatNumber(Math.max(...feeAmounts))} €/mese.`,
        href: '/agenti-ai',
      },
    ] as CompanyCard[],
  },
  close: {
    title: 'Qual è il problema da risolvere?',
    lead: 'Una frase basta per iniziare.',
    cta: 'Scrivici',
  },
};

/* --------------------------------- Chi siamo ------------------------------ */

export const aboutPageCopy = {
  metaTitle: 'Chi siamo | Q4 Studio',
  metaDescription: `Q4 Studio è uno studio tecnico con sede a ${company.city}: tracciamento server-side, automazioni CRM e agenti AI per PMI italiane. P.IVA ${company.vatId}.`,
  mdDescription: `Q4 Studio è uno studio tecnico con sede a ${company.city} guidato da ${company.founder}: tracciamento server-side, automazioni CRM e agenti AI per PMI italiane.`,
  kicker: 'Chi siamo',
  title: `Uno studio tecnico con sede a ${company.city}.`,
  lead: 'Risolviamo i problemi tecnici che stanno sotto al marketing: tracciamento server-side, Consent Mode v2, automazioni CRM e WhatsApp, agenti AI e siti web prodotti con strumenti AI sotto direzione umana.',
  founder: {
    title: 'Il fondatore.',
    text: `Q4 Studio è guidato da ${company.founder}, che viene dal marketing (studiato e fatto per anni) ed è anche tecnico. Per questo i progetti partono dal problema commerciale e arrivano fino all’implementazione tecnica, senza passaggi intermedi che perdono informazioni.`,
  },
  principles: {
    title: 'Tre principi, ogni progetto.',
    items: [
      {
        title: 'Prezzi pubblici',
        text: `Audit del tracciamento ${trackingAudit!.price}, setup server-side ${trackingSetup!.priceFrom ? 'da ' : ''}${trackingSetup!.price}, siti web da ${sitesStartingPrice}. Canoni dichiarati prima di iniziare.`,
      },
      {
        title: 'Fatto con l’AI, non dall’AI',
        text: 'L’AI accelera produzione e sviluppo, ma direzione, struttura e messaggio restano decisioni umane.',
      },
      {
        title: 'Mai inventare dati',
        text: 'Non deduciamo prezzi, risultati o garanzie non pubblicati. Gli unici numeri validi sono quelli nelle nostre pagine e nei casi studio con metriche reali.',
      },
    ],
  },
  /** Fila di cifre sotto i principi: i tre prezzi pubblici di partenza. */
  figures: [
    { value: trackingAudit!.price, caption: `Audit del tracciamento, ${trackingAudit!.timing}.` },
    { value: trackingSetup!.price, caption: `Setup server-side, ${trackingSetup!.priceFrom ? 'prezzo di partenza' : 'prezzo fisso'}.` },
    { value: sitesStartingPrice, caption: 'Siti web con AI, prezzo di partenza.' },
  ],
  companyData: {
    title: 'Dati aziendali.',
    lead: `Il lavoro tecnico si fa in remoto per aziende in tutta Italia; i progetti che richiedono presenza si svolgono soprattutto tra ${company.city}, Modena e Parma.`,
    rows: [
      { label: 'Ragione sociale', value: company.legalName },
      { label: 'Sede', value: `${company.city} (${company.region})` },
      { label: 'Partita IVA', value: company.vatId },
      { label: 'Email', value: company.email, href: `mailto:${company.email}` },
      { label: 'Telefono', value: company.phone, href: company.phoneHref },
    ] as Array<{ label: string; value: string; href?: string }>,
    profiles: [
      { label: 'LinkedIn', href: company.linkedin, external: true },
      { label: 'Instagram', href: company.instagram, external: true },
      { label: 'Casi studio con dati reali', href: '/casi-studio', external: false },
    ],
  },
  close: {
    title: 'Parliamo del tuo problema.',
    lead: 'Rispondiamo entro un giorno lavorativo.',
    cta: 'Contatti',
    href: '/contact',
  },
};

/* ------------------------------ Privacy e cookie --------------------------- */
// Testo legale vincolante: è quello della pagina privacy precedente, parola per
// parola, diviso nelle righe del mockup. Non riassumerlo né accorciarlo.

/** Frammenti di testo: stringa semplice, grassetto, link esterno o email del titolare. */
export type LegalInline = string | { b: string } | { a: string; href: string } | { email: true };
export type LegalText = LegalInline[];
export type LegalBlock =
  | { kind: 'p'; text: LegalText }
  | { kind: 'list'; items: LegalText[] }
  /** Riga breve in evidenza sopra il testo (es. "Consenso richiesto"). */
  | { kind: 'note'; text: string }
  | { kind: 'cookie'; name: string; rows: Array<[string, string]> };
export interface LegalSection {
  title: string;
  blocks: LegalBlock[];
}

export const privacyPageCopy = {
  metaTitle: 'Privacy & Cookie Policy | Q4 Studio',
  metaDescription: 'Privacy policy e cookie policy di Q4 Studio: dati raccolti, finalità, base giuridica, conservazione e diritti dell\'interessato ai sensi del GDPR.',
  kicker: 'Legale',
  title: 'Privacy & Cookie Policy.',
  lastUpdated: '5 gennaio 2025',
  lead: 'Come raccogliamo, usiamo e proteggiamo i dati personali di chi visita q4.studio.',
  privacyTitle: 'Privacy Policy.',
  cookieTitle: 'Cookie Policy.',
};

export const privacySections: LegalSection[] = [
  {
    title: '1. Titolare del trattamento',
    blocks: [
      { kind: 'p', text: [`${company.name} — P.IVA ${company.vatNumber}`] },
      { kind: 'p', text: ['Email: ', { email: true }] },
    ],
  },
  {
    title: '2. Dati raccolti',
    blocks: [
      { kind: 'p', text: ['Raccogliamo i seguenti dati personali:'] },
      {
        kind: 'list',
        items: [
          [{ b: 'Dati di contatto:' }, ' nome, cognome, email, telefono, azienda (tramite form di contatto)'],
          [{ b: 'Dati di navigazione:' }, ' indirizzo IP, browser, dispositivo, pagine visitate (tramite Google Analytics 4)'],
          [{ b: 'Cookie di terze parti:' }, ' Meta Pixel per tracciamento pubblicitario'],
        ],
      },
    ],
  },
  {
    title: '3. Finalità del trattamento',
    blocks: [
      { kind: 'p', text: ['I dati personali sono trattati per:'] },
      {
        kind: 'list',
        items: [
          ['Rispondere alle richieste di contatto e preventivi'],
          ['Analizzare il traffico del sito web e migliorare l\'esperienza utente (Google Analytics 4)'],
          ['Campagne pubblicitarie su Meta (Facebook/Instagram) tramite Meta Pixel'],
          ['Adempimenti fiscali e contabili'],
        ],
      },
    ],
  },
  {
    title: '4. Base giuridica',
    blocks: [
      { kind: 'p', text: ['Il trattamento dei dati è basato su:'] },
      {
        kind: 'list',
        items: [
          [{ b: 'Consenso dell\'interessato' }, ' (art. 6.1.a GDPR) per cookie analytics e marketing'],
          [{ b: 'Esecuzione di misure precontrattuali' }, ' (art. 6.1.b GDPR) per richieste di preventivo'],
          [{ b: 'Legittimo interesse' }, ' (art. 6.1.f GDPR) per analisi statistiche anonime'],
        ],
      },
    ],
  },
  {
    title: '5. Conservazione dei dati',
    blocks: [
      { kind: 'p', text: ['I dati personali sono conservati per:'] },
      {
        kind: 'list',
        items: [
          [{ b: 'Dati di contatto:' }, ' 24 mesi dalla richiesta'],
          [{ b: 'Dati analytics:' }, ' 26 mesi (retention automatica GA4)'],
          [{ b: 'Cookie:' }, ' massimo 12 mesi'],
        ],
      },
    ],
  },
  {
    title: '6. Diritti dell’interessato',
    blocks: [
      { kind: 'p', text: ['Ai sensi del GDPR, hai diritto a:'] },
      {
        kind: 'list',
        items: [
          ['Accedere ai tuoi dati personali'],
          ['Rettificare dati inesatti'],
          ['Richiedere la cancellazione ("diritto all\'oblio")'],
          ['Limitare il trattamento'],
          ['Opporti al trattamento'],
          ['Portabilità dei dati'],
          ['Revocare il consenso in qualsiasi momento'],
        ],
      },
      { kind: 'p', text: ['Per esercitare i tuoi diritti, contattaci all\'email ', { email: true }] },
    ],
  },
];

export const cookieSections: LegalSection[] = [
  {
    title: 'Cosa sono i cookie',
    blocks: [
      { kind: 'p', text: ['I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell\'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva.'] },
    ],
  },
  {
    title: 'Cookie tecnici',
    blocks: [
      { kind: 'note', text: 'Nessun consenso richiesto' },
      { kind: 'p', text: ['Cookie necessari al funzionamento del sito, non richiedono consenso esplicito.'] },
      { kind: 'cookie', name: 'cookie_consent', rows: [['Finalità', 'Memorizza le preferenze sui cookie'], ['Durata', '12 mesi']] },
    ],
  },
  {
    title: 'Cookie analytics',
    blocks: [
      { kind: 'note', text: 'Consenso richiesto' },
      { kind: 'p', text: ['Utilizzati per raccogliere informazioni aggregate sull\'uso del sito.'] },
      {
        kind: 'cookie',
        name: 'Google Analytics 4 (_ga, _ga_*, _gid)',
        rows: [['Finalità', 'Statistiche anonime di utilizzo'], ['Durata', '2 anni (_ga), 24 ore (_gid)'], ['Terza parte', 'Google LLC']],
      },
    ],
  },
  {
    title: 'Cookie di marketing',
    blocks: [
      { kind: 'note', text: 'Consenso richiesto' },
      { kind: 'p', text: ['Utilizzati per tracciare i visitatori attraverso i siti web per mostrare annunci pertinenti.'] },
      {
        kind: 'cookie',
        name: 'Meta Pixel (_fbp, _fbc, fr)',
        rows: [['Finalità', 'Tracciamento conversioni e remarketing su Facebook/Instagram'], ['Durata', '90 giorni'], ['Terza parte', 'Meta Platforms, Inc.']],
      },
    ],
  },
  {
    title: 'Gestione dei cookie',
    blocks: [
      { kind: 'p', text: ['Puoi gestire le tue preferenze sui cookie tramite il banner presente sul sito o direttamente dalle impostazioni del tuo browser:'] },
      {
        kind: 'list',
        items: [
          [{ a: 'Google Chrome', href: 'https://support.google.com/chrome/answer/95647' }],
          [{ a: 'Mozilla Firefox', href: 'https://support.mozilla.org/it/kb/Gestione%20dei%20cookie' }],
          [{ a: 'Safari', href: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac' }],
          [{ a: 'Microsoft Edge', href: 'https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }],
        ],
      },
    ],
  },
  {
    title: 'Link utili',
    blocks: [
      {
        kind: 'list',
        items: [
          [{ a: 'Privacy Policy Google Analytics', href: 'https://policies.google.com/privacy' }],
          [{ a: 'Privacy Policy Meta', href: 'https://www.facebook.com/privacy/policy/' }],
          [{ a: 'Garante Privacy - Cookie', href: 'https://www.garanteprivacy.it/cookie' }],
        ],
      },
    ],
  },
  {
    title: 'Domande',
    blocks: [
      { kind: 'p', text: ['Per qualsiasi domanda relativa alla privacy o ai cookie, contattaci: ', { email: true }] },
    ],
  },
];

/** Testo semplice di un frammento legale (per markdown e controlli). */
export const legalPlainText = (text: LegalText): string =>
  text.map((part) => (typeof part === 'string' ? part : 'b' in part ? part.b : 'a' in part ? part.a : company.email)).join('');

