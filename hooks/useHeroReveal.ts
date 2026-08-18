import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Stagger d'ingresso per le hero delle pagine servizio: eyebrow, h1,
 * sottotitolo, CTA e visual entrano in sequenza (y 20 -> 0, opacity 0 -> 1,
 * ~0.55s, stagger ~0.07, power2.out).
 *
 * Requisito di sicurezza: lo stato "nascosto" viene applicato SOLO da JS,
 * mai in CSS statico. Con JS disabilitato il contenuto è quindi visibile
 * da subito. Se GSAP lancia un errore, o semplicemente non completa, un
 * failsafe ripristina gli stili inline dopo 1.5s: queste sono pagine SEO
 * prerenderizzate, un testo invisibile è un esito peggiore di nessuna
 * animazione (vedi il down della schermata nera su /agenti-ai).
 *
 * Uso: `const reveal = useHeroReveal(4)` poi `<h1 ref={reveal(1)}>`, con gli
 * indici nell'ordine visivo desiderato dello stagger.
 */
export function useHeroReveal<T extends HTMLElement = HTMLElement>(count: number) {
  const nodesRef = useRef<(T | null)[]>(Array(count).fill(null));

  const register = (index: number) => (el: T | null) => {
    nodesRef.current[index] = el;
  };

  useEffect(() => {
    const targets = nodesRef.current.filter((el): el is T => el !== null);
    if (targets.length === 0) return;

    const clearInlineStyles = () => {
      targets.forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    };

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return; // contenuto già visibile, nessuna animazione da giocare

    // Failsafe: qualunque cosa succeda (GSAP non caricato, eccezione,
    // timeline che non parte), tra 1.5s gli stili inline sono comunque puliti.
    const failsafeId = window.setTimeout(clearInlineStyles, 1500);

    try {
      gsap.set(targets, { y: 20, opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        onComplete: () => window.clearTimeout(failsafeId),
      });
    } catch {
      clearInlineStyles();
      window.clearTimeout(failsafeId);
    }

    return () => window.clearTimeout(failsafeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return register;
}

export default useHeroReveal;
