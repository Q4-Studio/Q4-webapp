import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MagneticButtonProps } from '../types';

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  strength = 30 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(button, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 1,
        ease: "power3.out"
      });

      gsap.to(text, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 1,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
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