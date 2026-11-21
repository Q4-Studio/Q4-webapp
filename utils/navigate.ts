import type React from 'react';

/** Navigazione SPA: aggiorna l'URL e avvisa il router di App.tsx (che ascolta popstate). */
export const goTo = (path: string) => {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event('popstate'));
};

/**
 * onClick per i link interni: l'href resta nel markup (SEO, apri in nuova
 * scheda), ma il click normale non ricarica l'app. `after` gira prima della
 * navigazione (es. tracciamento del CTA).
 */
export const onInternalLink =
  (path: string, after?: () => void) =>
  (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    after?.();
    goTo(path);
  };

/**
 * Scorre all'elemento con quell'id. Con prefers-reduced-motion niente
 * animazione. Ritorna false se l'elemento non c'è (il chiamante decide).
 */
export const scrollToId = (id: string, block: ScrollLogicalPosition = 'start'): boolean => {
  const target = document.getElementById(id);
  if (!target) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block });
  return true;
};
