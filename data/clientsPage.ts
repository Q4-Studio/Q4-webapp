import { caseStudiesPath, getCaseStudyBySlug } from './caseStudies';

/* ------------------------------------------------------------------ */
/* Testi e clienti della pagina /clienti (mockup "Clienti" di Q4       */
/* Studio). Unica fonte per components/ClientsPage.tsx e per il mirror */
/* statico e il markdown di scripts/prerender.ts. La pagina sta solo   */
/* nel footer, non nel menu principale.                                */
/* ------------------------------------------------------------------ */

export const clientsPath = '/clienti';

export interface Client {
  name: string;
  /** Cosa abbiamo fatto: l'etichetta che compare al passaggio sulla card. */
  work: string;
  /**
   * Logo raster in public/clienti (WebP con trasparenza) e larghezza
   * relativa alla card, come nel mockup; chi non ce l'ha usa il logo
   * vettoriale di components/clients/ClientLogos.tsx (`vector`).
   */
  logo?: { src: string; width: number; height: number; widthPercent: number; dark?: boolean };
  vector?: 'qor' | 'trenove' | 'ergootto' | 'morinat';
  /** Slug di un caso studio pubblicato (data/caseStudies.ts): la card diventa un link. */
  caseStudy?: string;
}

/** Percorso del caso studio di un cliente; uno slug sconosciuto ferma la build (prerender). */
export const clientHref = (client: Client): string => {
  if (!client.caseStudy || !getCaseStudyBySlug(client.caseStudy)) {
    throw new Error(`Clienti: caso studio "${client.caseStudy}" non trovato per ${client.name}`);
  }
  return `${caseStudiesPath}/${client.caseStudy}`;
};

const raster = (slug: string, width: number, height: number, widthPercent: number, dark = false): Client['logo'] => ({
  src: `/clienti/${slug}.webp`,
  width,
  height,
  widthPercent,
  dark,
});

export const clients: Client[] = [
  { name: 'Candiani Denim', work: 'Tracking & Advertising', logo: raster('candiani-denim', 640, 269, 50), caseStudy: 'candiani-denim-tracking-server-side' },
  { name: 'Laika', work: 'LinkedIn & Advertising', logo: raster('laika', 640, 89, 52) },
  { name: 'QOR', work: 'Social Media & Advertising', vector: 'qor' },
  { name: 'GP Meccatronica', work: 'Rebranding & Sito Web', logo: raster('gp-meccatronica', 720, 148, 58), caseStudy: 'gp-meccatronica-sito-web' },
  { name: 'MES Connettori', work: 'LinkedIn & Sviluppo Web', logo: raster('mes-connettori', 640, 308, 50) },
  { name: 'Trenove', work: 'Ufficio Marketing Esterno', vector: 'trenove' },
  { name: 'STC', work: 'LinkedIn & Sviluppo Web', logo: raster('stc', 300, 229, 36) },
  { name: 'R&R Auto', work: 'Sito Web', logo: raster('rr-auto', 420, 420, 46) },
  // Logo scuro su fondo chiaro: filtro diverso a riposo (`.ph.dk` del mockup).
  { name: 'Bioshift', work: 'Consulenza Email Automation', logo: raster('bioshift', 700, 359, 58, true) },
  { name: 'Reggiana Gourmet', work: 'Social Media Management', logo: raster('reggiana-gourmet', 700, 405, 62) },
  { name: 'Cuore Domani', work: 'Social Media Management', logo: raster('cuore-domani', 640, 397, 50) },
  { name: 'Ergootto', work: 'Sito Web', vector: 'ergootto' },
  { name: 'James Academy', work: 'Consulenza Web e Social', logo: raster('james-academy', 640, 160, 62) },
  { name: 'Mya Natura', work: 'E-commerce', logo: raster('mya-natura', 520, 492, 30) },
  { name: 'Morinat', work: 'Consulenza Web', vector: 'morinat' },
  { name: 'Sidewall', work: 'Sito Web', logo: raster('sidewall', 640, 131, 62) },
  { name: 'Rari Tendaggi', work: 'Sito Web', logo: raster('rari-tendaggi', 600, 128, 58) },
  { name: 'Interno 9', work: 'Sito Web', logo: raster('interno-9', 560, 521, 36) },
  { name: 'Casale', work: 'Sito Web', logo: raster('casale', 640, 271, 62) },
];

export const clientsCopy = {
  metaTitle: 'Clienti | Q4 Studio',
  metaDescription: 'Le aziende con cui Q4 Studio ha lavorato, attuali e passate: tracciamento, advertising, siti web, automazioni e social media.',
  title: 'Le aziende con cui abbiamo lavorato.',
  lead: 'Clienti attuali e passati, compresi i progetti seguiti come freelance prima di Q4 Studio. Passa sopra un logo per vedere cosa abbiamo fatto.',
  heroCta: 'Parla con noi',
  listTitle: 'Chi si è fidato di noi.',
  /** Ultima card della griglia: invito scuro verso il form contatti. */
  nextCard: { title: 'Il prossimo logo potrebbe essere il tuo.', cta: 'Parliamone' },
  close: {
    title: 'Qual è il problema da risolvere?',
    lead: 'Una frase basta per iniziare.',
    cta: 'Scrivici',
  },
};
