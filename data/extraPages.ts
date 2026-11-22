import { caseStudiesPath } from './caseStudies';
import { resourcesPath } from './seoPages';
import { euroAmount, formatEuro, trackingPackage } from './servicePages';

/* ------------------------------------------------------------------ */
/* Testi delle pagine chiare senza mockup del cliente: blog (indice e   */
/* articolo), partner tecnico e 404. Unica fonte per i componenti React */
/* (Blog, BlogArticle, TechnicalPartner, NotFound) e per               */
/* scripts/prerender.ts (mirror statico e markdown). I prezzi arrivano  */
/* dai pacchetti di data/servicePages.ts, mai scritti a mano qui.       */
/* Le scelte fatte senza mockup sono in                                 */
/* docs/specs/remaining-light-pages.md, da confermare con Q4 Studio.    */
/* ------------------------------------------------------------------ */

const trackingAudit = trackingPackage('Audit tracciamento');
const trackingSetup = trackingPackage('Setup server-side');
/** Esempio di rivendita del partner: il margine si ricava dal prezzo del setup. */
const PARTNER_RESALE_EXAMPLE = 2500;
const partnerMargin = PARTNER_RESALE_EXAMPLE - euroAmount(trackingSetup.price);

/* ----------------------------------- Blog ---------------------------------- */

export const blogPath = '/blog';

export const blogIndexCopy = {
  metaTitle: 'Blog Q4 Studio | Guide Meta Advertising e AI Automation',
  metaDescription: 'Scopri strategie avanzate di Lead Generation B2B con Meta Ads, case study e guide pratiche su agenti AI. Il blog di Q4 Studio per far crescere il tuo business.',
  mdTitle: 'Blog Q4 Studio',
  mdDescription: 'Guide pratiche, case study e strategie su Meta Advertising, tracciamento server-side e agenti AI per PMI B2B.',
  kicker: 'Blog',
  title: 'Guide pratiche su dati, tracciamento e automazioni.',
  lead: 'Cosa cambia nel tracciamento, nel consenso e nelle automazioni, spiegato per chi gestisce campagne e dati in una PMI.',
  listTitle: 'Ultimi articoli.',
  readMore: "Leggi l'articolo",
  loading: 'Caricamento articoli…',
  error: 'Impossibile caricare gli articoli del blog. Riprova più tardi.',
  empty: {
    title: 'Nessun articolo pubblicato al momento.',
    text: 'Nel frattempo trovi guide e progetti reali nelle risorse e nei casi studio.',
    links: [
      { label: 'Risorse', href: resourcesPath },
      { label: 'Casi studio', href: caseStudiesPath },
    ],
  },
  close: {
    title: 'Qualcosa non torna nei tuoi dati?',
    lead: 'Raccontaci cosa vedi tra piattaforme e gestionale. Ti diciamo da dove partire.',
    cta: 'Scrivici',
  },
};

export const blogArticleCopy = {
  tocTitle: 'In questa pagina',
  tocEmpty: 'Lettura continua',
  readTimeSuffix: 'di lettura',
  authorKicker: 'Scritto da',
  relatedTitle: 'Altri articoli.',
  close: blogIndexCopy.close,
};

/**
 * Dati aggiuntivi dello schema Person per autore noto: solo dati reali e
 * verificabili. Un autore che non è qui resta senza jobTitle/sameAs.
 * Usati da BlogSchema, dalla card autore e dal prerender.
 */
export const blogAuthors: Record<string, { jobTitle: string; sameAs: string[] }> = {
  'Sebastiano Riva': {
    jobTitle: 'Fondatore, Q4 Studio',
    sameAs: ['https://www.linkedin.com/company/q4studio/about/'],
  },
};

/** "2026-08-18" → "18 agosto 2026" (o "18 ago 2026" con `short`). */
export const formatPostDate = (date: string, short = false): string =>
  // timeZone UTC: "2026-01-05" è letto come mezzanotte UTC; formattato nel fuso
  // locale diventerebbe il 4 gennaio a ovest di Greenwich.
  new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' });

interface RelatedCandidate { slug: string; category: string; date: string }

/** Fino a 3 articoli correlati: prima la stessa categoria, poi i più recenti. */
export const relatedPosts = <T extends RelatedCandidate>(post: T, posts: T[], limit = 3): T[] => {
  const others = posts.filter((p) => p.slug !== post.slug);
  const byDate = (a: T, b: T) => b.date.localeCompare(a.date);
  const same = others.filter((p) => p.category === post.category).sort(byDate);
  const rest = others.filter((p) => p.category !== post.category).sort(byDate);
  return [...same, ...rest].slice(0, limit);
};

/* ------------------------------ Partner tecnico ----------------------------- */

const BOOKING_URL = 'https://calendar.notion.so/meet/sebastianor/tg3rl4yct';

export const technicalPartnerCopy = {
  path: '/partner-tecnico',
  metaTitle: 'Partner tecnico white label per agenzie | Q4 Studio',
  metaDescription: 'Tracciamento server-side, Consent Mode, automazioni e integrazioni CRM in white label per agenzie.',
  kicker: 'White label · per agenzie',
  title: 'Sono il tecnico che la tua agenzia non ha in casa.',
  lead: 'Tracciamento server-side, Consent Mode, automazioni, integrazioni CRM. Lavoro white label: il cliente resta tuo, io non lo contatto mai.',
  book: { label: 'Prenota trenta minuti', href: BOOKING_URL },
  mail: { label: 'Scrivimi', href: 'mailto:sebastiano@q4.studio' },
  problem: {
    title: 'Il problema che conosci.',
    paragraphs: [
      'Il cliente ti scrive che Meta dice 40 conversioni e il suo gestionale ne dice 90. Tu sai che è il tracciamento. Ma sistemare un container server-side, la Consent Mode e le Conversions API non è il lavoro per cui hai assunto il tuo team.',
      "Così la conversazione si ripete ogni mese, e ogni mese il cliente si fida un po' meno dei numeri che gli porti.",
    ],
  },
  process: {
    title: 'Come funziona.',
    steps: [
      { n: '01', title: 'Mi giri il problema.', text: 'Una call di trenta minuti con te, senza il cliente.' },
      { n: '02', title: 'Ti dico tempi e prezzo.', text: 'Fisso, non a ore.' },
      { n: '03', title: 'Lavoro.', text: 'Con i tuoi accessi o con quelli del cliente, come preferisci.' },
      { n: '04', title: 'Ti consegno.', text: "Documentazione inclusa, così il tuo team capisce cosa c'è." },
    ],
    note: 'Se serve, sto in call col cliente presentato come tuo tecnico. Se preferisci che non compaia, non compaio.',
  },
  guarantee: {
    kicker: 'La garanzia che conta',
    title: 'Non contatto i tuoi clienti. Non li aggiungo su LinkedIn. Non li ricontatto quando il progetto finisce.',
    paragraphs: [
      'Se vuoi, lo mettiamo per scritto.',
      'So che il rischio che ti preoccupa non è il costo: è che il fornitore tecnico diventi il tuo concorrente. Non è il mio modello: io vivo di lavoro tecnico, non di gestione clienti.',
    ],
  },
  services: {
    title: 'Cosa faccio.',
    items: [
      { title: 'Tracciamento server-side', text: 'Container, Consent Mode v2, Conversions API, Enhanced Conversions.', priceLabel: trackingSetup.priceLabel, price: trackingSetup.price, timing: trackingSetup.timing },
      { title: 'Audit tracciamento', text: 'Utile da rivendere al cliente come primo passo.', priceLabel: trackingAudit.priceLabel, price: trackingAudit.price, timing: trackingAudit.timing },
      { title: 'Automazioni e integrazioni', text: 'Richieste inbound strutturate, follow-up, collegamenti CRM.', priceLabel: 'Prezzo', price: 'Setup + canone' },
      { title: 'Siti e landing', text: 'Quando serve il pezzo che manca.' },
    ] as Array<{ title: string; text: string; priceLabel?: string; price?: string; timing?: string }>,
  },
  pricing: {
    title: 'Sul prezzo.',
    text: `Non sono un freelance a basso costo, e probabilmente non ti serve. Il mio prezzo è pensato perché tu lo ricarichi: se rivendi un setup a ${formatEuro(PARTNER_RESALE_EXAMPLE)} e il tuo costo è ${trackingSetup.price}, hai marginato ${formatEuro(partnerMargin)} su un lavoro che non sapevi fare.`,
  },
  about: {
    title: 'Chi sono.',
    paragraphs: [
      "Sebastiano, Reggio Emilia. Vengo dal marketing (l'ho studiato e l'ho fatto per anni) e sono tecnico. È una combinazione poco comune, ed è il motivo per cui capisco cosa ti serve senza che debba spiegarmelo due volte.",
      "Lavoro già con un'agenzia in questo modo: ore prepagate più progetti a prezzo fisso.",
    ],
  },
  close: {
    title: 'Trenta minuti, senza il cliente.',
    lead: 'Mi racconti il problema, ti dico tempi e prezzo.',
  },
};

/* ------------------------------------ 404 ----------------------------------- */

export const notFoundCopy = {
  metaTitle: 'Pagina non trovata | Q4 Studio',
  metaDescription: 'La pagina che stai cercando non esiste o è stata spostata.',
  kicker: 'Errore 404',
  title: 'Pagina non trovata.',
  lead: 'La pagina che stai cercando non esiste o è stata spostata. Riparti da una delle pagine principali.',
  home: 'Torna alla home',
  back: 'Torna indietro',
  linksTitle: 'Da dove ripartire.',
  links: [
    { label: 'Tracciamento server-side', text: 'Pacchetti, tempi e prezzi del tracciamento.', href: '/tracciamento-server-side' },
    { label: 'Siti web con AI', text: 'Siti e landing page B2B su misura.', href: '/siti-web-ai' },
    { label: 'Agenti AI e automazioni', text: 'Automazioni per CRM, WhatsApp e assistenti.', href: '/agenti-ai' },
    { label: 'Casi studio', text: 'Progetti raccontati con dati reali.', href: caseStudiesPath },
    { label: 'Risorse', text: 'Guide su tracciamento, automazioni e agenti AI.', href: resourcesPath },
    { label: 'Blog', text: 'Articoli su dati, consenso e campagne.', href: blogPath },
  ],
  /** Puntatori per agenti e crawler finiti su un URL morto. */
  machineLinks: [
    { label: 'sitemap.xml', text: 'elenco completo degli URL pubblicati', href: '/sitemap.xml' },
    { label: 'llms.txt', text: 'guida al sito per agenti AI', href: '/llms.txt' },
  ],
};
