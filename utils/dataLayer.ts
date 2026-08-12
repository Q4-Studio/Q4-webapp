/**
 * Invia un evento al dataLayer di GTM/GA4. Inizializza l'array se GTM non è
 * ancora partito (in index.html il container carica in modo lazy dopo
 * l'evento 'load'): il push resta in coda e viene letto da GTM al suo avvio.
 */
export function pushDataLayerEvent(event: string, data: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

interface CtaClickParams {
  /** Sezione/pagina che contiene il CTA (es. 'header_nav', 'footer', 'case_study_detail'). */
  cta_location: string;
  /** Testo del bottone/link, per distinguere più CTA nella stessa location. */
  cta_label: string;
  /** Href o azione di destinazione, quando nota. */
  cta_destination?: string;
  [key: string]: unknown;
}

/** Evento 'cta_click': bottoni e link che portano verso il contact form o verso
 * un'azione di conversione (booking esterno, mailto, pagina servizio). */
export function trackCtaClick(params: CtaClickParams): void {
  pushDataLayerEvent('cta_click', {
    page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...params
  });
}

interface CaseStudyClickParams {
  case_study_slug: string;
  case_study_client: string;
  /** Dove è stato cliccato: 'case_studies_index', 'case_study_detail', ecc. */
  cta_location: string;
  [key: string]: unknown;
}

/** Evento 'view_case_study': click su una card/link che porta a un caso studio. */
export function trackCaseStudyClick(params: CaseStudyClickParams): void {
  pushDataLayerEvent('view_case_study', {
    page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...params
  });
}
