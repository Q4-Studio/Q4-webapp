import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Bot, Check, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Card servizio con spotlight che segue il cursore                    */
/* ------------------------------------------------------------------ */

type Service = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  points: string[];
  linkLabel?: string;
};

const services: Service[] = [
  {
    icon: <Target className="w-10 h-10 text-cyan-400" />,
    title: 'B2B Lead Generation',
    desc: 'Un sistema di acquisizione completo: posizionamento, offerta, Meta Advertising, tracking, CRM e follow-up. Non guardiamo solo il costo per lead, ma la qualità commerciale e la pipeline.',
    points: ['Meta Ads su ICP e offerta', 'Tracking e analytics avanzato', 'CRM, qualifica e follow-up', 'Ottimizzazione su MQL e SQL'],
  },
  {
    icon: <Bot className="w-10 h-10 text-purple-400" />,
    title: 'Agenti AI & Automazioni',
    desc: "Agenti su misura per sales, back office, customer care e processi interni. Partiamo dall'audit operativo, integriamo gli strumenti già in uso e accompagniamo il team nell'adozione.",
    points: ['Audit e mappatura dei processi', 'Agenti costruiti sul caso reale', 'Integrazione con gestionale e CRM', 'Formazione e adozione del team'],
    linkLabel: 'Approfondisci gli Agenti AI',
  },
];

const SpotlightCard: React.FC<{ service: Service }> = ({ service }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  };

  const goToAgents = () => {
    window.history.pushState(null, '', '/agenti-ai');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      className="service-card group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-9 md:p-12 overflow-hidden hover:border-indigo-500/30 transition-colors duration-500"
      style={{ ['--sx' as string]: '50%', ['--sy' as string]: '50%' }}
    >
      {/* Spotlight che segue il mouse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(520px circle at var(--sx) var(--sy), rgba(99,102,241,0.10), transparent 65%)' }}
      />
      <div className="relative z-10">
        <div className="mb-7">{service.icon}</div>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
        <p className="text-gray-400 leading-relaxed mb-8">{service.desc}</p>
        <ul className="space-y-3">
          {service.points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-sm text-gray-300">
              <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-indigo-300" />
              </span>
              {point}
            </li>
          ))}
        </ul>
        {service.linkLabel && (
          <button
            onClick={goToAgents}
            className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {service.linkLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Metriche animate                                                    */
/* ------------------------------------------------------------------ */

const stats = [
  { value: 60, suffix: ' s', prefix: '≤ ', label: 'primo contatto al lead' },
  { value: 40, suffix: ' s', prefix: '', label: 'per processare un ordine' },
  { value: 24, suffix: '/7', prefix: '', label: 'follow-up sempre attivo' },
  { value: 100, suffix: '%', prefix: '', label: 'lead tracciati nel CRM' },
];

const methodSteps = [
  { n: '01', title: 'Diagnosi', desc: 'Mappiamo business, funnel, processi e dati. Capiamo dove si perde valore e quale leva ha più impatto.' },
  { n: '02', title: 'Progetto', desc: 'Definiamo architettura, metriche e responsabilità. Campagne, CRM e agenti pensati come un unico sistema.' },
  { n: '03', title: 'Implementazione', desc: 'Mettiamo online, formiamo il team e miglioriamo sui dati reali. Utile, misurabile, adottato.' },
];

const Services2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.services-reveal', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.service-card', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 78%' },
        y: 90,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Contatori
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.innerText = `${el.dataset.prefix ?? ''}${Math.round(obj.v)}${el.dataset.suffix ?? ''}`;
          },
        });
      });

      gsap.from('.method-step', {
        scrollTrigger: { trigger: '.method-grid', start: 'top 82%' },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 px-6 bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <span className="services-reveal text-indigo-500 font-mono tracking-[0.3em] mb-6 block text-xs md:text-sm uppercase">
            04 — Servizi
          </span>
          <h2 className="services-reveal text-4xl md:text-6xl font-bold leading-tight mb-6">
            Due leve.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Un unico sistema.</span>
          </h2>
          <p className="services-reveal text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Acquisizione B2B da un lato, automazione intelligente dall&apos;altro. Studiamo il processo, definiamo le
            priorità e costruiamo sistemi misurabili.
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service) => (
            <SpotlightCard key={service.title} service={service} />
          ))}
        </div>

        {/* Metriche */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#070707] p-8 md:p-10 text-center">
              <p
                className="stat-value text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2"
                data-value={stat.value}
                data-prefix={stat.prefix}
                data-suffix={stat.suffix}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {stat.prefix}0{stat.suffix}
              </p>
              <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Metodo */}
        <div className="method-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {methodSteps.map((step) => (
            <div key={step.n} className="method-step relative pt-8 border-t border-white/10">
              <span className="absolute -top-px left-0 w-12 h-px bg-gradient-to-r from-indigo-400 to-purple-400" />
              <span className="font-mono text-sm text-indigo-400 tracking-widest">{step.n}</span>
              <h3 className="text-xl font-bold mt-3 mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services2;
