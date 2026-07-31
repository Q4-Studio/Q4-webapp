import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { resourcesPath } from '../data/seoPages';

export const MOBILE_MENU_PANEL_ID = 'mobile-menu-panel';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAgents: () => void;
  onNavigateBlog: () => void;
  onContact: () => void;
}

/**
 * Menu mobile a schermo intero, montato come sibling della <nav> (che usa
 * mix-blend-difference): reso qui evita che il pannello erediti quel blend
 * mode e diventi illeggibile.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigateAgents, onNavigateBlog, onContact }) => {
  const firstItemRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  // Chiusura con tasto ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Blocca lo scroll della pagina solo mentre il menu è aperto (non tocca altri
  // overflow globali, così ScrollTrigger non perde le sue misurazioni).
  // Su iOS Safari l'overflow sul solo body non basta: serve anche su html.
  useEffect(() => {
    if (!isOpen) return;
    const { body, documentElement: html } = document;
    const previousBody = body.style.overflow;
    const previousHtml = html.style.overflow;
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousBody;
      html.style.overflow = previousHtml;
    };
  }, [isOpen]);

  // Sposta il focus sul primo link quando il menu si apre (accessibilità tastiera)
  useEffect(() => {
    if (isOpen) firstItemRef.current?.focus();
  }, [isOpen]);

  const items: Array<{ label: string; onClick?: () => void; href?: string }> = [
    { label: 'Agenti AI', onClick: onNavigateAgents },
    { label: 'Blog', onClick: onNavigateBlog },
    { label: 'Risorse', href: resourcesPath },
  ];

  return (
    <div
      id={MOBILE_MENU_PANEL_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Menu di navigazione"
      aria-hidden={!isOpen}
      // Da chiuso il pannello resta nel DOM per l'animazione: `inert` evita che
      // le sue voci restino raggiungibili da tastiera e screen reader.
      inert={!isOpen}
      // Sotto la <nav> (z-70), così l'hamburger/X resta sempre visibile e toccabile.
      className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 motion-reduce:transition-none motion-reduce:duration-0 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Pannello */}
      <div
        className={`relative h-full w-full overflow-y-auto overscroll-contain px-6 pt-28 pb-12 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Navigazione principale">
          {items.map((item, i) => {
            const commonClasses =
              'group flex items-center justify-between border-b border-white/10 py-6 text-left text-[28px] uppercase tracking-[0.12em] text-gray-200 transition-colors hover:text-indigo-300 focus-visible:text-indigo-300 focus-visible:outline-none bg-transparent';
            const arrow = (
              <ArrowUpRight className="w-6 h-6 flex-shrink-0 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-indigo-400" />
            );

            if (item.href) {
              return (
                <a
                  key={item.label}
                  ref={(el) => { if (i === 0) firstItemRef.current = el; }}
                  href={item.href}
                  onClick={onClose}
                  className={commonClasses}
                >
                  <span>{item.label}</span>
                  {arrow}
                </a>
              );
            }

            return (
              <button
                key={item.label}
                ref={(el) => { if (i === 0) firstItemRef.current = el; }}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onClose();
                }}
                className={commonClasses}
              >
                <span>{item.label}</span>
                {arrow}
              </button>
            );
          })}
        </nav>

        {/* CTA "Scrivici": pillola bianca evidenziata, in fondo alle voci */}
        <button
          type="button"
          onClick={() => {
            onContact();
            onClose();
          }}
          className="mt-8 w-full rounded-full bg-white px-6 py-4 text-center text-base uppercase tracking-[0.12em] text-[#050505] transition-colors hover:bg-gray-200 cursor-pointer border-0"
        >
          Scrivici
        </button>

        <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-gray-600">
          Q4 Studio · Reggio Emilia
        </p>
      </div>
    </div>
  );
};

export default MobileMenu;
