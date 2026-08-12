import React, { useEffect, useRef } from 'react';
import { ArrowRight, Camera, Film, Layers3, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from './SEOHead';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Il sito viene generato automaticamente dall’AI?',
    answer: 'No. L’AI accelera parti della produzione, ma direzione, struttura, messaggio, scelte visive e controllo finale restano umani. È fatto con l’AI, non dall’AI.',
  },
  {
    question: 'Quanto costa un sito web con Q4 Studio?',
    answer: 'I progetti partono da 2.999 €. Il preventivo dipende dal tipo di sito, dai contenuti e dalla produzione necessaria: definiamo il progetto prima di iniziare, senza trasformarlo in un elenco rigido di moduli.',
  },
  {
    question: 'Quanto tempo serve per una landing page?',
    answer: 'Una landing page può essere pronta in una settimana. Per siti più articolati, tempi e fasi vengono definiti sul progetto.',
  },
  {
    question: 'Potete occuparvi anche di foto e video reali?',
    answer: 'Sì. Quando il progetto lo richiede, la produzione di foto e video reali può rientrare nella realizzazione del sito, insieme ad asset creati con l’AI, video animati e sezioni con animazioni allo scroll.',
  },
];

const capabilities = [
  {
    icon: Sparkles,
    index: '01',
    title: 'Asset che non arrivano da una banca immagini',
    copy: 'Creiamo visual, texture e composizioni su misura con strumenti AI, poi li dirigiamo e rifiniamo dentro un’identità coerente.',
  },
  {
    icon: Film,
    index: '02',
    title: 'Il movimento fa parte del racconto',
    copy: 'Video animati e sezioni che reagiscono allo scroll possono guidare la lettura, spiegare un servizio e rendere il sito riconoscibile.',
  },
  {
    icon: Camera,
    index: '03',
    title: 'Quando serve, la produzione è reale',
    copy: 'Foto e video originali possono entrare nello stesso progetto. AI e produzione sul campo non sono alternative: sono strumenti diversi della stessa direzione.',
  },
];

const BrowserStudy: React.FC = () => (
  <div className="sites-browser relative mx-auto w-full max-w-[660px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#090b0f] shadow-[0_45px_140px_-45px_rgba(34,211,238,0.28)]">
    <div className="flex h-12 items-center gap-2 border-b border-white/10 px-5" aria-hidden="true">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      <span className="ml-4 h-5 flex-1 rounded-full border border-white/10 bg-white/[0.03]" />
    </div>
    <div className="relative aspect-[4/3] overflow-hidden p-6 sm:p-9">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
      <div className="sites-scan absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_18px_rgba(103,232,249,0.75)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="h-2 w-20 rounded-full bg-white/80" />
          <div className="flex gap-4 text-[9px] uppercase tracking-[0.16em] text-white/40"><span>Idea</span><span>Direzione</span><span>Codice</span></div>
        </div>
        <div className="max-w-md">
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-cyan-300">Human directed / AI accelerated</p>
          <p className="text-[clamp(30px,6vw,62px)] font-bold leading-[0.9] tracking-[-0.055em]">Non un template.<br /><span className="text-white/35">Un punto di vista.</span></p>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-end gap-5">
          <div className="space-y-2"><div className="h-1.5 w-full rounded-full bg-white/10" /><div className="h-1.5 w-3/5 rounded-full bg-white/10" /></div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 text-xs text-cyan-200">Q4</div>
        </div>
      </div>
    </div>
  </div>
);

const SitesWebAI: React.FC = () => {
  const pageRef = useRef<HTMLElement>(null);
  const scrollToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    trackCtaClick({ cta_location: 'sites_web_ai_page', cta_label: event.currentTarget.textContent?.trim() || 'CTA', cta_destination: '#contatti' });
    document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.sites-hero-reveal', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' });
      gsap.utils.toArray<HTMLElement>('.sites-reveal').forEach((element) => {
        gsap.fromTo(element, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: element, start: 'top 82%', once: true } });
      });
      gsap.to('.sites-browser', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.sites-browser-wrap', start: 'top bottom', end: 'bottom top', scrub: true } });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Siti web con AI per aziende B2B',
    description: 'Progettazione e sviluppo di siti e landing page B2B con direzione umana e strumenti AI.',
    provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
    areaServed: 'IT',
    url: `${siteUrl}/siti-web-ai`,
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2999', description: 'Prezzo di partenza' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  };

  return (
    <article ref={pageRef} className="relative overflow-hidden bg-[#050505] px-6 pb-24 pt-36 text-white md:pt-44">
      <SEOHead title="Siti web con AI per aziende B2B | Q4 Studio" description="Siti e landing page B2B fatti con l’AI, non dall’AI: asset su misura, motion e produzione foto-video. Progetti da 2.999 €." url={`${siteUrl}/siti-web-ai`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[760px] w-[min(1100px,150vw)] -translate-x-1/2 rounded-full bg-cyan-900/10 blur-[170px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="grid min-h-[72vh] items-center gap-14 pb-28 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="max-w-4xl">
            <p className="sites-hero-reveal mb-6 text-xs uppercase tracking-[0.16em] text-cyan-300">Siti web · direzione umana · strumenti AI</p>
            <h1 className="sites-hero-reveal mb-8 text-[clamp(48px,7.2vw,104px)] font-bold leading-[0.9] tracking-[-0.055em]">Fatto con l’AI,<br /><span className="font-normal italic text-white/35" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>non dall’AI.</span></h1>
            <p className="sites-hero-reveal max-w-2xl text-xl leading-relaxed text-gray-300 md:text-2xl">Progettiamo siti e landing page con una direzione precisa. L’AI ci permette di produrre immagini, movimento e varianti più velocemente; non decide cosa dire, cosa mostrare o perché.</p>
            <div className="sites-hero-reveal mt-10 flex flex-wrap items-center gap-5">
              <a href="#contatti" onClick={scrollToContact} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505] transition-colors hover:bg-cyan-100">Parlaci del tuo sito <ArrowRight className="h-4 w-4" /></a>
              <span className="text-sm text-gray-400">Progetti da <strong className="text-white">2.999 €</strong></span>
            </div>
          </div>
          <div className="sites-browser-wrap sites-hero-reveal relative py-8"><BrowserStudy /></div>
        </header>

        <section className="sites-reveal grid gap-10 border-y border-white/10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Una distinzione importante</p>
          <div><h2 className="mb-7 text-[clamp(34px,5vw,64px)] font-bold leading-[1.03] tracking-[-0.04em]">L’AI abbassa il costo della produzione. Non il livello delle scelte.</h2><div className="max-w-3xl space-y-5 text-lg leading-relaxed text-gray-300"><p>Un sito non diventa efficace perché una macchina ha generato una pagina. Serve capire cosa deve far ricordare, quale percorso deve costruire e dove deve portare chi lo visita.</p><p>Usiamo l’AI nel processo creativo e tecnico, sotto direzione umana. Il risultato non è “un sito AI”: è un sito riconoscibile, costruito con più possibilità a disposizione.</p></div></div>
        </section>

        <section className="py-28 md:py-36">
          <div className="sites-reveal mb-14 max-w-4xl"><p className="mb-5 text-xs uppercase tracking-[0.16em] text-indigo-300">Più linguaggi, nello stesso progetto</p><h2 className="text-[clamp(36px,5.8vw,72px)] font-bold leading-[1] tracking-[-0.045em]">Il sito può fare più che mettere testo sopra una foto.</h2></div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, index, title, copy }) => <article key={index} className="sites-reveal group relative min-h-[380px] bg-[#080808] p-8 md:p-10"><div className="mb-20 flex items-center justify-between"><span className="text-xs text-gray-600">{index} / 03</span><Icon className="h-7 w-7 text-cyan-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3" /></div><h3 className="mb-5 text-3xl font-bold leading-tight tracking-[-0.025em]">{title}</h3><p className="leading-relaxed text-gray-400">{copy}</p></article>)}
          </div>
        </section>

        <section className="sites-reveal grid gap-10 rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/[0.045] p-8 md:p-14 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div><p className="mb-5 text-xs uppercase tracking-[0.16em] text-cyan-300">Landing page</p><h2 className="mb-6 text-[clamp(36px,5.2vw,68px)] font-bold leading-[1] tracking-[-0.045em]">Una pagina può essere pronta in una settimana.</h2><p className="max-w-2xl text-lg leading-relaxed text-gray-300">Quando serve portare online un’offerta o una campagna senza aspettare un sito completo, concentriamo direzione, contenuto e sviluppo in una singola esperienza.</p></div>
          <div className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"><p className="mb-2 text-sm uppercase tracking-[0.12em] text-gray-500">Siti web</p><p className="text-4xl font-bold text-white">da 2.999 €</p><p className="mt-4 text-sm leading-relaxed text-gray-400">Forma, tempi e produzione vengono definiti sul progetto.</p></div>
        </section>

        <section className="py-28 md:py-36">
          <div className="sites-reveal grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div><p className="mb-5 text-xs uppercase tracking-[0.16em] text-indigo-300">Caso studio</p><h2 className="mb-6 text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-0.04em]">GP Meccatronica, dal rebranding al sito in movimento.</h2><p className="mb-8 text-lg leading-relaxed text-gray-300">Una direzione visiva scura e tecnica, motion design e asset generati con l’AI per accompagnare il traffico delle campagne ADV.</p><a href="/casi-studio/gp-meccatronica-sito-web" className="inline-flex items-center gap-2 font-semibold text-cyan-200 hover:text-white">Leggi il caso studio <ArrowRight className="h-4 w-4" /></a></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10"><img src="/case-studies/gp-meccatronica-hero.webp" srcSet="/case-studies/gp-meccatronica-hero-836w.webp 836w, /case-studies/gp-meccatronica-hero.webp 1672w" sizes="(min-width: 1024px) 55vw, 100vw" alt="GP Meccatronica: autobus scuro con fari accesi, overlay di dati tecnici blu" width="1672" height="941" loading="lazy" decoding="async" className="aspect-video h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" /></div>
          </div>
        </section>

        <section className="sites-reveal border-t border-white/10 py-24"><div className="mb-12 max-w-3xl"><p className="mb-5 text-xs uppercase tracking-[0.16em] text-indigo-300">FAQ</p><h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-[-0.04em]">Domande prima di partire.</h2></div><div className="grid gap-4 lg:grid-cols-2">{faqs.map((faq) => <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 open:border-cyan-300/25"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-xl font-semibold"><span>{faq.question}</span><span className="text-cyan-300 transition-transform group-open:rotate-45">+</span></summary><p className="mt-5 leading-relaxed text-gray-300">{faq.answer}</p></details>)}</div></section>

        <section className="sites-reveal rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 text-center md:p-16"><Layers3 className="mx-auto mb-7 h-8 w-8 text-cyan-300" /><h2 className="mx-auto mb-6 max-w-4xl text-[clamp(38px,5.8vw,72px)] font-bold leading-[1] tracking-[-0.045em]">Il prossimo sito non deve sembrare il precedente.</h2><p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-gray-300">Raccontaci cosa deve fare, per chi e perché adesso. Partiamo da lì.</p><a href="#contatti" onClick={scrollToContact} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505] hover:bg-cyan-100">Parlaci del progetto <ArrowRight className="h-4 w-4" /></a></section>
      </div>

      <style>{`
        .sites-scan { animation: sites-scan 5s ease-in-out infinite; }
        @keyframes sites-scan { 0%, 100% { transform: translateY(12px); opacity: 0; } 12% { opacity: .8; } 88% { opacity: .8; } 100% { transform: translateY(470px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .sites-scan { animation: none; top: 48%; opacity: .45; } }
      `}</style>
    </article>
  );
};

export default SitesWebAI;
