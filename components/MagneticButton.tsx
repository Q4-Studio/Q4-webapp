import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MagneticButtonProps } from '../types';

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  strength = 0.4 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    // Con "riduci movimento" attivo il bottone resta fermo: nessun ascoltatore.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // quickTo: un solo tween riutilizzato per proprietà, invece di crearne
    // due nuovi a ogni mousemove.
    const quick = { duration: 1, ease: "power3.out" };
    const buttonX = gsap.quickTo(button, "x", quick);
    const buttonY = gsap.quickTo(button, "y", quick);
    const textX = gsap.quickTo(text, "x", quick);
    const textY = gsap.quickTo(text, "y", quick);

    let leaveTween: gsap.core.Tween | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Il tween elastico del rientro scriverebbe x/y dopo i quickTo (è stato
      // creato dopo): va fermato appena il mouse torna sul bottone.
      leaveTween?.kill();
      leaveTween = null;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // strength è il fattore del bottone; il testo si muove di un quarto.
      buttonX(x * strength);
      buttonY(y * strength);
      textX(x * (strength / 4));
      textY(y * (strength / 4));
    };

    const handleMouseLeave = () => {
      leaveTween?.kill();
      leaveTween = gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      leaveTween?.kill();
      gsap.killTweensOf([button, text]);
      gsap.set([button, text], { clearProps: 'transform' });
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-colors duration-300 rounded-full group ${className}`}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
      <span className="absolute inset-0 w-full h-full border border-white/20 rounded-full group-hover:border-transparent transition-colors duration-300"></span>
      <span ref={textRef} className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;
