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

export interface CaseStudy {
  slug: string;
  client: string;
  /** Assente quando non esiste un URL verificato del cliente: mai indovinare un dominio. */
  clientUrl?: string;
  /** Data di pubblicazione della pagina (non della campagna), usata nello schema Article. */
  datePublished: string;
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
  whyItMatters: {
    heading: string;
    paragraphs: string[];
  };
  cta?: { heading: string; body: string; label: string; href: string };
  /** Tag di servizi/tecnologie coinvolte, mostrati come pillole a fine pagina. */
  services: string[];
  /** Video loop opzionale, mostrato come dimostrazione del sito realizzato (non tutti i casi studio ne hanno uno). */
  demoVideo?: CaseStudyDemoVideo;
}

export const siteUrl = 'https://www.q4.studio';
export const caseStudiesPath = '/casi-studio';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'candiani-denim-tracking-server-side',
    client: 'Candiani Denim',
    clientUrl: 'https://www.candianidenim.com/',
    datePublished: '2026-08-01',
    metaTitle: 'Candiani Denim: tracking server-side per Meta Ads | Q4 Studio',
    description: 'Come abbiamo potenziato il tracciamento Meta di Candiani Denim con Meta Conversion API, deduplicazione eventi e server-side tagging Stape, recuperando oltre un milione di segnali in 90 giorni.',
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
        'Configurazione server-side con Stape',
        'Verifica del cookie banner e della Consent Mode',
        'Controllo dei segnali disponibili prima di passare alle campagne di conversione'
      ]
    },
    results: {
      heading: 'Il risultato',
      intro: 'In uno snapshot di 90 giorni, il tracciamento server-side ha recuperato:',
      stats: [
        { value: '963.652', label: 'richieste bloccate dai sistemi di tracking prevention' },
        { value: '69.043', label: 'richieste bloccate dagli ad blocker' },
        { value: '1.032.695', label: 'segnali recuperati in totale' }
      ],
      note: 'Senza la configurazione server-side questi dati sarebbero andati persi, inclusi eventi e-commerce come visualizzazioni prodotto, aggiunte al carrello, inizio checkout e acquisti.'
    },
    whyItMatters: {
      heading: 'Perché conta',
      paragraphs: [
        'Ogni segnale non tracciato è un’informazione che l’algoritmo non ha. Su un budget pubblicitario a cinque cifre, ottimizzare su dati parziali significa pagare per raggiungere le persone sbagliate.'
      ]
    },
    cta: {
      heading: 'Quanti segnali stanno perdendo le tue campagne?',
      body: 'L’audit di tracciamento ti dà una risposta documentata e una mappa di cosa sistemare.',
      label: 'Vedi il tracciamento e i prezzi',
      href: '/tracciamento-server-side'
    },
    services: ['Meta Pixel', 'Meta Conversion API', 'Server-side tagging (Stape)', 'Deduplicazione eventi', 'Consent Mode']
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
