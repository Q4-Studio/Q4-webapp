import { useEffect } from 'react';
import { DARK_BACKGROUND, LIGHT_BACKGROUND } from '../data/lightRoutes';

/**
 * Sfondo del documento e colore della barra del browser per la rotta
 * corrente. Le pagine chiare (elenco in data/lightRoutes.ts, lo stesso del
 * prerender) hanno html e body bianchi e theme-color bianco; le scure
 * #050505, così overscroll e barra del browser non mostrano il bianco sotto
 * una pagina nera (né il nero sotto una chiara). Chiamato una volta in App.
 */
export function useDocumentTheme(light: boolean): void {
  useEffect(() => {
    const color = light ? LIGHT_BACKGROUND : DARK_BACKGROUND;
    const { documentElement: html, body } = document;
    html.style.backgroundColor = color;
    body.style.backgroundColor = color;
    html.classList.toggle('bg-white', light);
    html.classList.toggle('bg-[#050505]', !light);
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [light]);
}
