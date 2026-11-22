import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'p' | 'h2' | 'h3' | 'span';
  /** Ritardo in secondi, per scalare più blocchi vicini (rv2/rv3 del mockup). */
  delay?: number;
  id?: string;
}

const HIDDEN = { y: 64, opacity: 0 };

/**
 * Blocco che entra dal basso quando arriva in viewport (il `.rv` del mockup).
 * Lo stato nascosto viene applicato in useLayoutEffect, prima del primo
 * paint: così il contenuto non compare visibile per un istante per poi
 * sparire e rientrare (lo sfarfallio del primo caricamento). L'ingresso è
 * guidato da IntersectionObserver, che non dipende da misure prese troppo
 * presto; se l'observer manca o non scatta, un timer di sicurezza mostra
 * comunque il blocco.
 */
const Reveal: React.FC<RevealProps> = ({ children, className, style, as = 'div', delay = 0, id }) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    gsap.set(el, HIDDEN);
    let tween: gsap.core.Tween | undefined;
    let done = false;

    const show = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      window.clearTimeout(failSafe);
      tween = gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        overwrite: true,
        // A fine ingresso togliamo gli stili inline: un transform residuo
        // vincerebbe sull'hover CSS delle card (.bc).
        onComplete: () => {
          gsap.set(el, { clearProps: 'opacity,transform' });
        },
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show();
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);

    // Rete di sicurezza: se l'elemento è in viewport ma l'observer non ha
    // ancora chiamato (webview sospese, tab in background), lo mostriamo.
    const failSafe = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) show();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
      tween?.kill();
      gsap.set(el, { clearProps: 'opacity,transform' });
    };
  }, [delay]);

  const Tag = as;
  return (
    // data-reveal: in stampa index.css annulla lo stato nascosto (@media print).
    <Tag ref={ref as React.Ref<never>} id={id} className={className} style={style} data-reveal="">
      {children}
    </Tag>
  );
};

export default Reveal;
