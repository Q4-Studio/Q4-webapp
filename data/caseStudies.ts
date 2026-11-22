export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudyIntroBlock {
  paragraph: string;
  /** Assente quando non esiste un URL verificato a cui rimandare (es. cliente senza sito pubblico noto): meglio nessun link che uno indovinato. */
  link?: CaseStudyLink;
}

export interface CaseStudyDemoVideo {
  heading: string;
  /** Sorgente WebM (VP9), elencata per prima nel markup: il browser sceglie il primo
   *  <source> che supporta. Nessun audio: il video è decorativo per costruzione. */
  webmSrc: string;
  /** Sorgente MP4 (H.264), fallback per i browser senza supporto WebM. */
  mp4Src: string;
  /** Poster WebP (primo fotogramma), mostrato prima del caricamento e come fallback
   *  statico per prefers-reduced-motion. Generato da scripts/optimize-images.mjs. */
  poster: string;
  /** Dimensioni reali del video/poster (no CLS). */
  width: number;
  height: number;
  /** Usato come alt del poster e come aria-label del video. */
  alt: string;
  caption: string;
}

export interface CaseStudyDataRow {
  label: string;
  value: string;
}

/** Blocco di dati aggiuntivo (per browser, per evento, consenso…): numeri grandi e/o righe etichetta → valore. */
export interface CaseStudyDataBlock {
  heading: string;
  intro?: string;
  stats?: CaseStudyStat[];
  rows?: CaseStudyDataRow[];
  note?: string;
  /** Fonte e periodo del blocco, mostrati sotto i numeri. */
  source?: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  /** Assente quando non esiste un URL verificato del cliente: mai indovinare un dominio. */
  clientUrl?: string;
  /** Data di pubblicazione della pagina (non della campagna), usata nello schema Article. */
  datePublished: string;
  /** Ultimo aggiornamento dei contenuti; schema Article e sitemap usano `dateModified ?? datePublished`. */
  dateModified?: string;
  metaTitle: string;
  description: string;
  /** Categoria editoriale visibile nell'indice dei casi studio. */
  category: 'Tracciamento e dati' | 'Automazioni' | 'Siti e sviluppo';
  kicker: string;
  title: string;
  subheadline: string;
  /** WebP full-size, mostrato nella pagina. Generato da scripts/optimize-images.mjs. */
  coverImage: string;
  /** WebP a ~836px, variante mobile servita via srcset. */
  coverImageMobile: string;
  coverImageAlt: string;
  coverImageWidth: number;
  coverImageHeight: number;
  /** JPG per og:image/twitter:image/schema: formato universalmente supportato dai crawler social. */
  ogImage: string;
  ogImageWidth: number;
  ogImageHeight: number;
  intro: CaseStudyIntroBlock[];
  challenge: {
    heading: string;
    paragraphs: string[];
  };
  work: {
    heading: string;
    intro: string;
    items: string[];
  };
  results: {
    heading: string;
    intro: string;
    /** Assenti quando il risultato è qualitativo e non c'è una metrica reale da mostrare: mai inventare numeri. */
    stats?: CaseStudyStat[];
    note: string;
  };
  /** Blocchi di dati oltre al risultato principale. Assenti quando non ci sono altri numeri verificati. */
  data?: CaseStudyDataBlock[];
  whyItMatters: {
    heading: string;
    paragraphs: string[];
  };
  /** Fonti dei numeri (strumento e periodo), elencate a fine pagina. */
  sources?: string[];
  cta?: { heading: string; body: string; label: string; href: string };
  /** Tag di servizi/tecnologie coinvolte, mostrati come pillole a fine pagina. */
  services: string[];
  /** Video loop opzionale, mostrato come dimostrazione del sito realizzato (non tutti i casi studio ne hanno uno). */
  demoVideo?: CaseStudyDemoVideo;
}

export const siteUrl = 'https://www.q4.studio';
export const caseStudiesPath = '/casi-studio';

// Fonte dei numeri Candiani: fonti originali di Q4 Studio conservate fuori dal
// repository (D-022, D-024): Requests Analytics del container server-side,
// 90 giorni fino al 20 nov 2026; Meta Gestione eventi, 23 ott–19 nov 2026.
// Aggiornare prima lì, poi qui: pagine, home e prerender leggono questi valori.
const candianiWindowLabel = '90 giorni';
const candianiWindowEnd = '20 novembre 2026';
export const candianiFigures = {
  recovered: '752.423',
  trackingPrevention: '671.779',
  adBlockers: '80.644',
  requests: '1.966.768',
  share: '38,3%',
  windowLabel: candianiWindowLabel,
  windowEnd: candianiWindowEnd,
  /** "90 giorni fino al 20 novembre 2026": finestra dei dati del container, usata in fonti e testi. */
  window: `${candianiWindowLabel} fino al ${candianiWindowEnd}`,
};

/** Testi dell'hero dell'indice casi studio: componente e mirror statico del prerender. */
export const caseStudiesIndexCopy = {
  kicker: 'Casi studio',
  title: 'Progetti reali, dati reali.',
  lead: 'Come lavoriamo con i clienti Q4 Studio: cosa abbiamo trovato, cosa abbiamo costruito e cosa è cambiato, con i numeri veri di ogni progetto.',
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'candiani-denim-tracking-server-side',
    client: 'Candiani Denim',
    clientUrl: 'https://www.candianidenim.com/',
    datePublished: '2026-08-01',
    dateModified: '2026-11-21',
    metaTitle: 'Candiani Denim: tracking server-side per Meta Ads | Q4 Studio',
    description: `Come abbiamo potenziato il tracciamento Meta di Candiani Denim con Meta Conversion API, deduplicazione eventi e server-side tagging, recuperando ${candianiFigures.recovered} segnali in ${candianiFigures.windowLabel}.`,
    category: 'Tracciamento e dati',
    kicker: 'Caso studio · Tracking server-side',
    title: 'Candiani Denim',
    subheadline: 'Prima di aumentare il budget, abbiamo sistemato il tracciamento.',
    coverImage: '/case-studies/candiani-denim-server-side-tracking-hero.webp',
    coverImageMobile: '/case-studies/candiani-denim-server-side-tracking-hero-836w.webp',
    coverImageAlt: 'Candiani Denim: tracking server-side, linee dati blu su denim',
    coverImageWidth: 1672,
    coverImageHeight: 941,
    ogImage: '/case-studies/candiani-denim-server-side-tracking-hero-og.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 675,
    intro: [
      {
        paragraph: 'Candiani Denim è un’azienda del denim italiano attiva da oltre 85 anni, ancora a gestione familiare. Produce tessuti in una filiera integrata tra Milano e le Alpi, con investimenti su innovazione e sostenibilità.',
        link: { label: 'Candiani Denim', href: 'https://www.candianidenim.com/' }
      },
      {
        paragraph: 'Il denim Candiani è stato usato in collaborazioni con Pangaia, Velasca, Vibram e Triarchy.',
        link: { label: 'Le collaborazioni ufficiali', href: 'https://www.candianidenim.com/en/hub-activism/high-end-denim-candianis-luxury-collaborations/249' }
      }
    ],
    challenge: {
      heading: 'La sfida',
      paragraphs: [
        'Da marzo ad agosto abbiamo gestito le campagne Meta di Candiani Denim con obiettivo awareness.',
        'Prima di alzare il budget e passare a campagne di conversione, dovevamo sistemare i dati. Il Pixel Meta era già installato, ma il tracciamento perdeva eventi: browser, ad blocker e sistemi di prevenzione del tracking bloccavano una parte dei segnali.'
      ]
    },
    work: {
      heading: 'Il lavoro',
      intro: 'Abbiamo lavorato insieme all’agenzia tecnica che segue il sito di Candiani, su questi punti:',
      items: [
        'Potenziamento del Pixel Meta con eventi custom',
        'Implementazione della Meta Conversion API',
        'Deduplicazione tra eventi browser e server',
        'Configurazione del container server-side su infrastruttura dedicata',
        'Verifica del cookie banner e della Consent Mode',
        'Controllo dei segnali disponibili prima di passare alle campagne di conversione'
      ]
    },
    results: {
      heading: 'Il risultato',
      intro: `In ${candianiFigures.windowLabel}, fino al ${candianiFigures.windowEnd}, su ${candianiFigures.requests} richieste gestite dal container server-side, il tracciamento server-side ha recuperato:`,
      stats: [
        { value: candianiFigures.trackingPrevention, label: 'recuperate dalla tracking prevention dei browser' },
        { value: candianiFigures.adBlockers, label: 'recuperate dagli ad blocker' },
        { value: candianiFigures.recovered, label: `segnali recuperati in totale (${candianiFigures.share} delle richieste)` }
      ],
      note: 'Senza la configurazione server-side questi dati sarebbero andati persi, inclusi eventi e-commerce come visualizzazioni prodotto, aggiunte al carrello, inizio checkout e acquisti.'
    },
    data: [
      {
        heading: 'Più conversioni per Meta, evento per evento',
        intro: 'Con l’API Conversions attiva accanto al pixel, Meta registra più conversioni di quante ne vedrebbe dal solo browser. Più si scende nel funnel, più il recupero pesa.',
        stats: [
          { value: '+9,2%', label: 'visualizzazioni di contenuti (ViewContent), su 97.652 eventi' },
          { value: '+46,2%', label: 'aggiunte al carrello (AddToCart), su 1.934 eventi' },
          { value: '+133,3%', label: 'inizi di acquisto (InitiateCheckout), su 1.236 eventi' }
        ],
        source: 'Meta Gestione eventi, Pixel di Candiani Denim, 23 ottobre – 19 novembre 2026: “conversioni aggiuntive registrate dall’API Conversions rispetto al solo pixel”.'
      },
      {
        heading: 'Cosa recupera, evento per evento',
        intro: `Richieste GA4 passate dal container in ${candianiFigures.windowLabel} e quante di queste il browser o un ad blocker avrebbero bloccato (somma di tracking prevention e ad blocker).`,
        rows: [
          { label: 'PageView · 356.380 richieste', value: '146.310 recuperate (41,1%)' },
          { label: 'ViewItem · 132.729 richieste', value: '55.955 recuperate (42,2%)' },
          { label: 'AddToCart · 1.591 richieste', value: '687 recuperate (43,2%)' },
          { label: 'BeginCheckout · 1.148 richieste', value: '523 recuperate (45,6%)' },
          { label: 'Purchase · 135 richieste', value: '79 recuperate (58,5%)' }
        ],
        note: 'Gli eventi vicini all’acquisto sono quelli che si perdono di più: oltre la metà degli acquisti sarebbe rimasta invisibile alle piattaforme.',
        source: `Analytics del container server-side di candianidenim.com, ${candianiFigures.window}, richieste GA4 per evento.`
      },
      {
        heading: 'Dove si perdono i dati: per browser',
        intro: 'Gli ad blocker pesano soprattutto su Chrome; su Safari il problema è la tracking prevention integrata nel browser.',
        rows: [
          { label: 'Safari (mobile e desktop) · 672K richieste', value: '1,04% recuperato dagli ad blocker' },
          { label: 'Chrome (mobile e desktop) · 576K richieste', value: '8,34% recuperato dagli ad blocker' },
          { label: 'Altri (Brave, Edge, Firefox…) · 719K richieste', value: '3,56% recuperato dagli ad blocker' }
        ],
        source: `Analytics del container server-side, ${candianiFigures.window}, richieste per browser.`
      },
      {
        heading: 'Bot fuori, consenso dentro',
        intro: 'Il container filtra il traffico dei bot prima che arrivi alle piattaforme e fa seguire ai dati le scelte di consenso dell’utente (Consent Mode v2).',
        stats: [
          { value: '17,84%', label: 'delle richieste GA (245.945 su 1.378.470) riconosciute come bot e scartate' },
          { value: '42,29%', label: 'delle PageView con consenso dato (150.698); 57,71% con opt-out (205.679)' },
          { value: '62,96%', label: 'degli acquisti con consenso dato (85); 37,04% con opt-out (50)' }
        ],
        source: `Analytics del container server-side, ${candianiFigures.window}, richieste da bot e per scelta di consenso (richieste GA4).`
      }
    ],
    whyItMatters: {
      heading: 'Perché conta',
      paragraphs: [
        'Ogni segnale non tracciato è un’informazione che l’algoritmo non ha. Su un budget pubblicitario a cinque cifre, ottimizzare su dati parziali significa pagare per raggiungere le persone sbagliate.'
      ]
    },
    sources: [
      `Analytics del container server-side di candianidenim.com, periodo di ${candianiFigures.window}.`,
      'Meta Gestione eventi, Pixel di Candiani Denim, 23 ottobre – 19 novembre 2026.',
      'Screenshot originali e valori estratti conservati da Q4 Studio, disponibili su richiesta.'
    ],
    cta: {
      heading: 'Quanti segnali stanno perdendo le tue campagne?',
      body: 'L’audit di tracciamento ti dà una risposta documentata e una mappa di cosa sistemare.',
      label: 'Vedi il tracciamento e i prezzi',
      href: '/tracciamento-server-side'
    },
    services: ['Meta Pixel', 'Meta Conversion API', 'Server-side tagging', 'Deduplicazione eventi', 'Consent Mode']
  },
  {
    slug: 'gp-meccatronica-sito-web',
    client: 'GP Meccatronica',
    clientUrl: 'https://www.gpmeccatronica.it/',
    datePublished: '2026-08-01',
    metaTitle: 'GP Meccatronica: sito web e rebranding | Q4 Studio',
    description: 'Il rebranding e il nuovo sito di GP Meccatronica: motion design e asset AI per un’azienda B2B di assistenza autobus, officina e mezzi pesanti a Campogalliano (MO).',
    category: 'Siti e sviluppo',
    kicker: 'Caso studio · Sito web e rebranding',
    title: 'GP Meccatronica',
    subheadline: 'Con le campagne ADV in arrivo, il sito doveva farsi notare, non solo elencare i servizi.',
    coverImage: '/case-studies/gp-meccatronica-hero.webp',
    coverImageMobile: '/case-studies/gp-meccatronica-hero-836w.webp',
    coverImageAlt: 'GP Meccatronica: autobus scuro con fari accesi, overlay di dati tecnici blu',
    coverImageWidth: 1672,
    coverImageHeight: 941,
    ogImage: '/case-studies/gp-meccatronica-hero-og.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 675,
    intro: [
      {
        paragraph: 'GP Meccatronica ha sede a Campogalliano, in provincia di Modena, e lavora con autobus, mezzi pesanti e flotte aziendali: assistenza autobus, officina auto e furgoni, climatizzazione, tachigrafi VDO, impianti antincendio, taratura tachigrafi e noleggio auto e van.',
        link: { label: 'GP Meccatronica', href: 'https://www.gpmeccatronica.it/' }
      },
      {
        paragraph: 'Il sito arriva insieme al rebranding che abbiamo curato per l’azienda: fa parte della stessa nuova identità, non è un progetto a sé.'
      }
    ],
    challenge: {
      heading: 'La sfida',
      paragraphs: [
        'Anche un’azienda B2B ha bisogno di farsi riconoscere. Per GP Meccatronica contava ancora di più, perché dopo il lancio abbiamo affiancato il sito con campagne ADV: chi arriva sul sito non lo trova per caso, e deve ricordarselo.',
        'Il rischio era il solito di questo settore: un sito che elenca i servizi senza lasciare il segno in chi lo visita.'
      ]
    },
    work: {
      heading: 'Il lavoro',
      intro: 'Il rebranding ha definito la direzione visiva: scura, tecnica, con motion design e asset generati con l’AI. La parte tecnica l’abbiamo seguita noi:',
      items: [
        'Infrastruttura del sito',
        'Creazione degli asset',
        'Creazione dei copy',
        'Ottimizzazione per i motori di ricerca',
        'Redirect delle pagine indicizzate dal vecchio sito al nuovo'
      ]
    },
    demoVideo: {
      heading: 'Il sito in movimento',
      webmSrc: '/case-studies/gp-meccatronica-hero-loop.webm',
      mp4Src: '/case-studies/gp-meccatronica-hero-loop.mp4',
      poster: '/case-studies/gp-meccatronica-hero-loop-poster.webp',
      width: 1280,
      height: 720,
      alt: 'Autobus scuro con fari accesi e overlay di dati tecnici blu, loop della home di GP Meccatronica',
      caption: 'Loop dalla home: i fari dell’autobus che si accendono, l’apertura della pagina.'
    },
    results: {
      heading: 'Il risultato',
      intro: 'GP Meccatronica ha un sito che rappresenta la nuova identità del rebranding e accompagna il traffico delle campagne ADV, senza limitarsi a elencare i servizi.',
      note: 'Una presenza digitale più riconoscibile, coerente con il nuovo posizionamento dell’azienda e pronta a raccontarne il valore fin dal primo contatto.'
    },
    whyItMatters: {
      heading: 'Perché conta',
      paragraphs: [
        'Fino a qualche anno fa, un livello di motion design e animazioni come questo richiedeva un team dedicato e un investimento pesante. Con gli strumenti AI quella soglia si è abbassata: resta un lavoro serio, non il sito da poche centinaia di euro, ma il budget a cinque cifre di un tempo non serve più.',
        'Per un’azienda B2B che sta anche investendo in ADV, questo conta: il sito è spesso il primo punto di contatto reale con chi non conosce ancora GP Meccatronica, ed è lì che si decide se un visitatore se lo ricorda o lo dimentica subito dopo.'
      ]
    },
    cta: {
      heading: 'Pronto a crescere? Parla con un esperto',
      body: 'Raccontaci la tua sfida.',
      label: 'Pronto a crescere? Parla con un esperto',
      href: '/siti-web-ai'
    },
    services: ['Rebranding', 'Web design', 'Sviluppo sito web', 'Art direction', 'Motion design', 'Asset AI', 'SEO']
  }
];

export const getCaseStudyBySlug = (slug: string) => caseStudies.find((study) => study.slug === slug);
