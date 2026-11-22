import { caseStudiesPath } from './caseStudies';
import { resourcesPath } from './seoPages';

/* ------------------------------------------------------------------ */
/* Rotte del sistema chiaro (.home-light). Unica fonte di verità per    */
/* App.tsx (sfondo di html e meta theme-color al cambio rotta) e per    */
/* scripts/prerender.ts (classe di <html>, theme-color e mirror         */
/* statico). Dal 2026-11-22 (D-045) nessuna rotta è più scura: blog,    */
/* partner tecnico, supporto app e 404 sono passati al sistema chiaro,  */
/* quindi `isLightRoute` vale sempre true. L'elenco e la funzione       */
/* restano il punto unico da cambiare se una rotta tornasse scura.      */
/* ------------------------------------------------------------------ */

export const LIGHT_ROUTES = ['/', '/agenti-ai', '/tracciamento-server-side', '/siti-web-ai', '/meta-advertising-b2b', '/partner-tecnico', caseStudiesPath, resourcesPath, '/directory', '/blog', '/about', '/contact', '/privacy'];

/** Prefissi delle pagine di dettaglio chiare: casi studio, risorse (anche il vecchio alias /seo/) e articoli del blog. */
export const LIGHT_ROUTE_PREFIXES = [`${caseStudiesPath}/`, `${resourcesPath}/`, '/seo/', '/blog/'];

/** Tema dei path non elencati: 404, privacy e supporto app aperti come hash. Chiaro da D-045. */
export const UNLISTED_ROUTES_LIGHT = true;

export const LIGHT_BACKGROUND = '#ffffff';
export const DARK_BACKGROUND = '#050505';

/**
 * true per le rotte chiare. Oggi tutte: le rotte elencate sopra, le pagine
 * sotto i prefissi e anche i path sconosciuti (404) e le pagine aperte come
 * hash (/#privacy, /#app-support).
 */
export const isLightRoute = (pathname: string): boolean => {
  const path = pathname.replace(/\/$/, '') || '/';
  const listed = LIGHT_ROUTES.includes(path) || LIGHT_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
  return listed || UNLISTED_ROUTES_LIGHT;
};
