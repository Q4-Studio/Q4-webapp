import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'p' | 'h2' | 'h3' | 'span';
  /** Ritardo in secondi, per scalare più blocchi vicini (rv2/rv3 del mockup). */
  delay?: number;
  id?: string;
}

/**
 * Blocco che entra dal basso quando arriva in viewport (il `.rv` del mockup).
 * Il mockup usa `animation-timeline: view()`, che Safari e Firefox non
 * supportano in modo uniforme: qui si usa ScrollTrigger come nel resto del
 * sito. fromTo + immediateRender:false + once: se il trigger non scatta il
 * contenuto resta visibile, e una volta acceso non si rispegne.
 */
const Reveal: React.FC<RevealProps> = ({ children, className, style, as = 'div', delay = 0, id }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      el,
      { y: 64, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'opacity,transform' });
    };
  }, [delay]);

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
};

export default Reveal;
