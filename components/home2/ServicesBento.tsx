import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Calendar } from 'lucide-react';
import Reveal from './Reveal';
import { OkIcon } from './primitives';
import { onInternalLink } from '../../utils/navigate';
import { homePriceRows } from '../../data/servicePages';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* "Tre servizi, un unico sistema." Bento a tre colonne sfalsate:      */
/* tracciamento + "8 ore", automazioni + "60 s", siti + advertising.   */
/* ------------------------------------------------------------------ */

/**
 * Numero che conta da 0 al valore quando entra in viewport. Lo span animato
 * è aria-hidden; lo screen reader legge il valore finale (`srText`) in sr-only.
 */
const Counter: React.FC<{ to: number; srText: string; className?: string }> = ({ to, srText, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  // useLayoutEffect: lo 0 va scritto prima del primo paint, altrimenti si
  // vede il valore finale che poi salta a 0 e riparte.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(to);
      return;
    }
    el.textContent = '0';
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: to,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(counter.v));
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = String(to);
    };
  }, [to]);

  // Valore finale già nel markup: leggibile anche senza JavaScript.
  return (
    <>
      <span ref={ref} className={className} aria-hidden="true">{to}</span>
      <span className="sr-only">{srText}</span>
    </>
  );
};

const PriceRow: React.FC<{ items: Array<{ label: string; value: string }> }> = ({ items }) => (
  <div className="mt-9 flex flex-wrap gap-10">
    {items.map((item) => (
      <div key={item.label}>
        <p className="mb-2 text-sm text-gray-500">{item.label}</p>
        <p className="price">{item.value}</p>
      </div>
    ))}
  </div>
);

const CardLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} onClick={onInternalLink(href)} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a0a0a] hover:text-purple-700">
    {label}
    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
  </a>
);

const ServicesBento: React.FC = () => (
  <section id="servizi" className="px-6 pb-24 md:px-12 md:pb-[160px]">
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" className="h-l max-w-[1100px]">Tre servizi, un unico sistema.</Reveal>

      <div className="mt-20 flex flex-col gap-6 md:mt-[80px] lg:flex-row lg:items-start">
        {/* Colonna 1: tracciamento */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Reveal as="article" className="bc" style={{ minHeight: 660, paddingBottom: 110, background: 'linear-gradient(170deg, #f7f5fb 0%, #efe7fb 100%)' }}>
            <h3>Tracciamento e dati</h3>
            <p className="d">Audit del setup attuale, container server-side, eventi documentati e segnali che tornano alle campagne. Un setup server-side tipico richiede 8 ore.</p>
            <PriceRow items={homePriceRows.tracking} />
            <CardLink href="/tracciamento-server-side" label="Pacchetti e prezzi" />
            <div className="mock relative mt-auto pt-0" style={{ marginTop: 'auto' }}>
              <div className="ev"><OkIcon />Lead · Conversions API<em>inviato</em></div>
              <div className="ev"><OkIcon />Acquisto · Enhanced Conversions<em>inviato</em></div>
              <div className="ev"><OkIcon />Form · Consent Mode v2<em>rispettato</em></div>
              <div className="ev"><OkIcon />Vendita · CRM → Google Ads<em>sincronizzato</em></div>
            </div>
          </Reveal>
          <Reveal as="article" className="bc ov items-center justify-center text-center text-white" style={{ minHeight: 300, background: 'linear-gradient(160deg, #9333ea, #6366f1)' }}>
            <p className="disp" style={{ fontSize: 'clamp(4.5rem, 7vw, 7rem)', letterSpacing: '-0.06em', color: '#fff' }}>
              <Counter to={8} srText="8 ore" />
              <span className="ml-1.5" style={{ fontSize: '.4em' }} aria-hidden="true">ore</span>
            </p>
            <p className="mt-3 font-medium text-white">per un setup server-side tipico</p>
          </Reveal>
        </div>

        {/* Colonna 2: automazioni */}
        <div className="flex min-w-0 flex-1 flex-col lg:mt-[120px]">
          <Reveal as="article" id="agenti" delay={0.12} className="bc" style={{ minHeight: 660, paddingBottom: 110, background: 'linear-gradient(150deg, #f7f5fb 0%, #ecdffb 100%)' }}>
            <h3>Automazioni e agenti AI</h3>
            <p className="d">Il CRM lavora da solo: contatto su WhatsApp ed email, follow-up, notifiche al team commerciale e al cliente. Partono in due settimane.</p>
            <PriceRow items={homePriceRows.automations} />
            <CardLink href="/agenti-ai" label="Vedi le automazioni" />
            <div className="mock relative" style={{ marginTop: 'auto' }}>
              <div className="ev"><OkIcon />Nuovo lead nel CRM<em>2 secondi</em></div>
              <div className="ev"><OkIcon />WhatsApp ed email al lead<em>60 secondi</em></div>
              <div className="ev"><OkIcon />Team commerciale avvisato<em>notifica</em></div>
              <div className="ev">
                <span className="ok" aria-hidden="true"><Calendar className="h-3 w-3" strokeWidth={2.5} /></span>
                Appuntamento in calendario<em>confermato</em>
              </div>
            </div>
          </Reveal>
          <Reveal as="article" className="bc ov items-center justify-center text-center" style={{ minHeight: 300, background: '#f7f5fb' }}>
            <div className="dots" aria-hidden="true" />
            <p className="disp relative" style={{ fontSize: 'clamp(4.5rem, 7vw, 7rem)', letterSpacing: '-0.06em' }}>
              <Counter to={60} srText="60 secondi" className="grad" />
              <span className="grad ml-1" style={{ fontSize: '.4em' }} aria-hidden="true">s</span>
            </p>
            <p className="relative mt-3 font-medium" style={{ color: '#0a0a0a' }}>primo contatto con il lead</p>
          </Reveal>
        </div>

        {/* Colonna 3: siti e advertising */}
        <div className="flex min-w-0 flex-1 flex-col lg:mt-10">
          <Reveal as="article" delay={0.2} className="bc" style={{ minHeight: 540, paddingBottom: 110 }}>
            <h3>Siti web con AI</h3>
            <p className="d">Veloci, e misurabili fin dal primo giorno.</p>
            <p className="price pt-7">{homePriceRows.sites}</p>
            <CardLink href="/siti-web-ai" label="Come lavoriamo sui siti" />
            <div className="mock px-4 pb-5 pt-4" style={{ marginTop: 'auto' }} aria-hidden="true">
              <div className="mb-3.5 flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-200" />
                <span className="h-2 w-2 rounded-full bg-gray-200" />
                <span className="h-2 w-2 rounded-full bg-gray-200" />
              </div>
              <div className="h-[110px] rounded-xl" style={{ background: 'linear-gradient(135deg, #818cf8, #a855f7 60%, #9333ea)' }} />
              <div className="mt-4 h-2.5 w-[70%] rounded-md bg-gray-200" />
              <div className="mt-2.5 h-2.5 w-[48%] rounded-md bg-gray-100" />
            </div>
          </Reveal>
          <Reveal as="article" className="bc ov dark-block justify-end text-white" style={{ minHeight: 340, background: '#050505' }}>
            <div className="aur" aria-hidden="true" style={{ width: 420, height: 420, background: 'rgba(147,51,234,.45)', right: -120, top: -160, filter: 'blur(90px)' }} />
            <h3 className="relative">Advertising</h3>
            <p className="d relative text-gray-300">Campagne Google Ads e Meta Ads che partono da dati tracciati bene, per lead generation e servizi high ticket.</p>
            <a href="/meta-advertising-b2b" onClick={onInternalLink('/meta-advertising-b2b')} className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-purple-300">
              Approfondisci
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default ServicesBento;
