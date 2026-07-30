import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Punto di inizio/fine del reveal rispetto al viewport. */
  start?: string;
  end?: string;
  as?: 'p' | 'h2' | 'h3' | 'span';
}

/**
 * Testo che si "accende" parola per parola mentre lo scroll avanza.
 * Stesso effetto del manifesto, riusabile nelle intro di sezione.
 */
const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  className,
  style,
  start = 'top 82%',
  end = 'bottom 55%',
  as = 'p',
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Con prefers-reduced-motion il testo resta leggibile fin da subito:
    // niente split in parole, niente opacity 0.14 agganciata allo scroll.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      el.innerHTML = '';
      const words: HTMLElement[] = [];
      text.split(' ').forEach((word, i, arr) => {
        const span = document.createElement('span');
        span.innerText = word;
        span.style.display = 'inline-block';
        span.style.opacity = '0.14';
        el.appendChild(span);
        words.push(span);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.6,
        ease: 'none',
        scrollTrigger: { trigger: el, start, end, scrub: 0.4 },
      });
    }, el);

    return () => ctx.revert();
  }, [text, start, end]);

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {text}
    </Tag>
  );
};

export default ScrollRevealText;
