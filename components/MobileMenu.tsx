import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { caseStudiesPath } from '../data/caseStudies';

export const MOBILE_MENU_PANEL_ID = 'mobile-menu-panel';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateAgents: () => void;
  onNavigateBlog: () => void;
  onContact: () => void;
  showHomeLink: boolean;
}

/**
 * Menu mobile a schermo intero, montato come sibling della <nav> (che usa
 * mix-blend-difference): reso qui evita che il pannello erediti quel blend
 * mode e diventi illeggibile.
 */
/** Seleziona gli elementi focusabili (nell'ordine del DOM) dentro un contenitore. */
const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigateHome, onNavigateAgents, onNavigateBlog, onContact, showHomeLink }) => {
  const firstItemRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Chiusura con tasto ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: mentre il menu è aperto, Tab e Shift+Tab restano dentro al
  // pannello. Il resto dell'app viene reso `inert` da App.tsx, ma un handler
  // esplicito è comunque necessario perché Tab dall'ultimo elemento del
  // pannello altrimenti uscirebbe verso il browser (barra indirizzi ecc.),
  // da cui poi rientrerebbe in un punto imprevisto della pagina.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panel.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

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
    ...(showHomeLink ? [{ label: 'Home', onClick: onNavigateHome }] : []),
    { label: 'Tracciamento', href: '/tracciamento-server-side' },
    { label: 'Siti web', href: '/siti-web-ai' },
    { label: 'Agenti AI', onClick: onNavigateAgents },
    { label: 'Casi Studio', href: caseStudiesPath },
    { label: 'Blog', onClick: onNavigateBlog },
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
      className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 motion-reduce:transition-none motion-reduce:duration-0 ${
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
        ref={panelRef}
        className={`relative h-full w-full overflow-y-auto overscroll-contain px-6 pt-28 pb-12 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Navigazione principale">
          {items.map((item, i) => {
            const commonClasses =
              'group flex items-center justify-between border-b border-white/10 py-6 text-left text-[28px] uppercase leading-[1.15] tracking-[-0.02em] text-gray-200 transition-colors hover:text-indigo-300 focus-visible:text-indigo-300 focus-visible:outline-none bg-transparent';
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
        <a
          href="/#contatti"
          onClick={(event) => {
            event.preventDefault();
            onContact();
            onClose();
          }}
          className="mt-8 w-full rounded-full bg-white px-6 py-4 text-center text-base uppercase tracking-normal text-[#050505] transition-colors hover:bg-gray-200 cursor-pointer border-0"
        >
          Contatti
        </a>

        <p className="mt-10 text-[11px] uppercase tracking-[0.08em] text-gray-600">
          Q4 Studio · Reggio Emilia
        </p>
      </div>
    </div>
  );
};

export default MobileMenu;
