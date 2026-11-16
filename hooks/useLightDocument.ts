import { useEffect } from 'react';

/**
 * Le pagine del sistema chiaro schiariscono html e body finché sono montate,
 * così overscroll e aree fuori dalle sezioni non mostrano il nero del resto
 * del sito. Al cambio pagina il colore precedente viene ripristinato.
 */
export function useLightDocument(): void {
  useEffect(() => {
    const { documentElement: html, body } = document;
    const previousHtml = html.style.backgroundColor;
    const previousBody = body.style.backgroundColor;
    html.style.backgroundColor = '#ffffff';
    body.style.backgroundColor = '#ffffff';
    return () => {
      html.style.backgroundColor = previousHtml;
      body.style.backgroundColor = previousBody;
    };
  }, []);
}
