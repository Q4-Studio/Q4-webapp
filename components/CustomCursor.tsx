import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't render custom cursor on mobile/touch devices
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // quickTo: un tween riutilizzato per proprietà invece di due tween nuovi
    // a ogni mousemove.
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const followerX = gsap.quickTo(follower, 'x', { duration: 0.5, ease: 'power2.out' });
    const followerY = gsap.quickTo(follower, 'y', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      // Cursore principale (segue direttamente) e follower (con ritardo)
      cursorX(e.clientX);
      cursorY(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    };

    const INTERACTIVE = 'a, button, [role="button"], .cursor-pointer';

    // Scala con quickTo come il movimento: un solo tween riutilizzato, niente
    // allocazioni a ogni passaggio sopra un elemento.
    const scaleTo = gsap.quickTo([cursor, follower], 'scale', { duration: 0.3, ease: 'power2.out' });

    // Un solo ascoltatore delegato su document: funziona anche con i link
    // montati dopo un cambio pagina della SPA (prima querySelectorAll al mount).
    // La scala deriva solo da dove sta il puntatore adesso: così elementi
    // interattivi annidati e link smontati da una navigazione (nessun mouseout)
    // non lasciano il cursore ingrandito.
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
      scaleTo(target ? 1.5 : 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.killTweensOf([cursor, follower]);
    };
  }, []);

  // Don't render on mobile
  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isMobile) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-500 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.6)',
          willChange: 'transform'
        }}
      />

      {/* Follower Circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-indigo-400/50 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
    </>
  );
};

export default CustomCursor;
