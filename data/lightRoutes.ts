import { caseStudiesPath } from './caseStudies';

/* ------------------------------------------------------------------ */
/* Rotte del sistema chiaro (.home-light). Unica fonte di verità per    */
/* App.tsx (sfondo di html e meta theme-color al cambio rotta) e per    */
/* scripts/prerender.ts (classe di <html>, theme-color e mirror statico */
/* chiaro). Tutte le altre rotte sono scure.                            */
/* ------------------------------------------------------------------ */

export const LIGHT_ROUTES = ['/', '/agenti-ai', '/tracciamento-server-side', '/siti-web-ai', '/meta-advertising-b2b', caseStudiesPath];

export const LIGHT_BACKGROUND = '#ffffff';
export const DARK_BACKGROUND = '#050505';

/** true per le rotte chiare: elenco sopra più ogni /casi-studio/<slug>. */
export const isLightRoute = (pathname: string): boolean => {
  const path = pathname.replace(/\/$/, '') || '/';
  return LIGHT_ROUTES.includes(path) || path.startsWith(`${caseStudiesPath}/`);
};
