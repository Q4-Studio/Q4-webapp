import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight, Bot, Target, Database, MessageCircle, BarChart3, Zap } from 'lucide-react';
import MagneticButton from '../MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Sfera neurale 3D — canvas 2D con proiezione prospettica.            */
/* I punti sono distribuiti su una sfera di Fibonacci; gli archi tra   */
/* punti vicini sono precalcolati (la rotazione è rigida, le distanze  */
/* non cambiano) così il render resta O(n) per frame.                  */
/* ------------------------------------------------------------------ */

type Vec3 = { x: number; y: number; z: number };

const buildSphere = (count: number) => {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  // Archi tra punti angolarmente vicini
  const edges: [number, number][] = [];
  const threshold = 0.32;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
        edges.push([i, j]);
      }
    }
  }
  return { pts, edges };
};

const NeuralSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { pts, edges } = buildSphere(300);

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let running = true;
    let visible = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Rotazione continua + inclinazione guidata dal mouse (con inerzia)
    let rotY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };

    // Sinapsi: archi che lampeggiano brevemente
    type Synapse = { edge: number; t: number };
    let synapses: Synapse[] = [];

    const projected: { x: number; y: number; s: number; z: number }[] = pts.map(() => ({ x: 0, y: 0, s: 0, z: 0 }));

    const render = () => {
      if (!running) return;
      frame = requestAnimationFrame(render);
      if (!visible) return;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const cx = isMobile ? width * 0.5 : width * 0.72;
      const cy = isMobile ? height * 0.34 : height * 0.46;
      const radius = isMobile ? Math.min(width, height) * 0.36 : Math.min(width, height) * 0.34;
      const fov = 3.2;

      rotY += reduced ? 0 : 0.0022;
      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;

      const cosY = Math.cos(rotY + tiltY);
      const sinY = Math.sin(rotY + tiltY);
      const cosX = Math.cos(tiltX * 0.6 - 0.18);
      const sinX = Math.sin(tiltX * 0.6 - 0.18);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // rotazione Y poi X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const scale = fov / (fov + z2);
        projected[i].x = cx + x1 * radius * scale;
        projected[i].y = cy + y2 * radius * scale;
        projected[i].s = scale;
        projected[i].z = z2;
      }

      // Archi
      ctx.lineWidth = 0.6;
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.z + pb.z) / 2; // -1 (davanti) → 1 (dietro)
        const alpha = Math.max(0, 0.16 * (1 - (depth + 1) / 2) + 0.015);
        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Sinapsi lampeggianti
      if (!reduced && synapses.length < 9 && Math.random() < 0.09) {
        synapses.push({ edge: Math.floor(Math.random() * edges.length), t: 0 });
      }
      synapses = synapses.filter((s) => s.t < 1);
      for (const s of synapses) {
        s.t += 0.018;
        const [a, b] = edges[s.edge];
        const pa = projected[a];
        const pb = projected[b];
        const pulse = Math.sin(Math.PI * s.t);
        ctx.strokeStyle = `rgba(165, 180, 252, ${0.75 * pulse})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
        ctx.lineWidth = 0.6;
        // scintilla che percorre l'arco
        const sx = pa.x + (pb.x - pa.x) * s.t;
        const sy = pa.y + (pb.y - pa.y) * s.t;
        ctx.fillStyle = `rgba(199, 210, 254, ${pulse})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Punti
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const depthAlpha = Math.max(0.05, (p.s - 0.7) * 1.4);
        ctx.fillStyle = `rgba(148, 163, 255, ${Math.min(0.85, depthAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, 1.7 * p.s), 0, Math.PI * 2);
        ctx.fill();
      }

      // Nucleo luminoso
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.5);
      core.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
      core.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('visibilitychange', onVisibility);
    render();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

/* ------------------------------------------------------------------ */
/* Ticker di parole chiave in fondo all'hero                           */
/* ------------------------------------------------------------------ */

const tickerItems = [
  { label: 'LEAD GENERATION B2B', icon: <Target className="w-3.5 h-3.5" /> },
  { label: 'AGENTI AI', icon: <Bot className="w-3.5 h-3.5" /> },
  { label: 'META ADS', icon: <Zap className="w-3.5 h-3.5" /> },
  { label: 'CRM AUTOMATION', icon: <Database className="w-3.5 h-3.5" /> },
  { label: 'WHATSAPP FOLLOW-UP', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { label: 'DIGITAL ANALYTICS', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

const HeroTicker: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const singleWidth = track.scrollWidth / 3;
    const tween = gsap.fromTo(track, { x: 0 }, { x: -singleWidth, duration: 26, ease: 'none', repeat: -1 });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-white/5 py-4 overflow-hidden bg-[#050505]/60 backdrop-blur-sm">
      <div ref={trackRef} className="flex whitespace-nowrap items-center gap-10 text-[11px] font-mono tracking-[0.25em] text-gray-500">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-indigo-500/70">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const Hero2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Split manuale dei titoli in caratteri (word-safe)
      const splitChars = (el: HTMLElement | null) => {
        const targets: HTMLElement[] = [];
        if (!el) return targets;
        const original = el.innerText;
        el.innerHTML = '';
        original.split(' ').forEach((word, i, arr) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          word.split('').forEach((char) => {
            const c = document.createElement('span');
            c.innerText = char;
            c.style.display = 'inline-block';
            c.style.opacity = '0';
            wordSpan.appendChild(c);
            targets.push(c);
          });
          el.appendChild(wordSpan);
          if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
        });
        return targets;
      };

      const chars1 = splitChars(line1Ref.current);

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(containerRef.current, { opacity: 1, duration: 0.4 })
        .fromTo(eyebrowRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(
          chars1,
          { y: 110, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.022, duration: 0.9, ease: 'back.out(1.6)' },
          '-=0.4'
        )
        // La riga con gradiente non viene splittata in caratteri: figli con
        // opacity/transform rompono background-clip:text. Reveal come blocco.
        .fromTo(
          line2Ref.current,
          { y: 90, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0% -20% 0%)', duration: 1.1, ease: 'power4.out' },
          '-=0.55'
        )
        .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo(canvasWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, '-=1.2');

      // Parallasse allo scroll: livelli che scorrono a velocità diverse
      gsap.to(canvasWrapRef.current, {
        yPercent: 22,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(ghostRef.current, {
        yPercent: -38,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(contentRef.current, {
        yPercent: 12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '75% top', scrub: true },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    document.querySelector('section:has(form)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const goToAgents = () => {
    window.history.pushState(null, '', '/agenti-ai');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-[#050505] opacity-0">
      {/* Sfera neurale */}
      <div ref={canvasWrapRef} className="absolute inset-0 z-0">
        <NeuralSphere />
      </div>

      {/* Ghost text in parallasse */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute -right-8 bottom-[-6%] z-0 select-none pointer-events-none font-bold leading-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(180px, 32vw, 480px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(129, 140, 248, 0.08)',
        }}
      >
        Q4
      </div>

      {/* Vignettatura laterale per leggibilità */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#050505] via-transparent to-transparent md:via-[#050505]/30" />

      <div ref={contentRef} className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div ref={eyebrowRef} className="flex items-center gap-3 text-indigo-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          Studio di consulenza — Reggio Emilia · Verona
        </div>

        <h1
          className="font-bold tracking-tighter leading-[0.95] text-white"
          style={{ fontSize: 'clamp(44px, 9vw, 132px)', perspective: '800px' }}
        >
          <span ref={line1Ref} className="block">Il tuo AI</span>
          <span
            ref={line2Ref}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
          >
            Marketing Partner.
          </span>
        </h1>

        <p ref={subRef} className="mt-8 text-lg md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
          Applichiamo l&apos;intelligenza artificiale al marketing: campagne che convertono, automazioni che
          inseguono ogni lead e agenti AI che alleggeriscono i processi del tuo team.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-5">
          <MagneticButton onClick={scrollToForm} className="text-white">
            Inizia il percorso
            <ArrowUpRight className="w-5 h-5" />
          </MagneticButton>
          <button
            onClick={goToAgents}
            className="group flex items-center gap-2 text-sm font-mono tracking-widest text-gray-400 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-0 uppercase"
          >
            Scopri gli Agenti AI
            <ArrowDownRight className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* HUD angoli */}
      <div className="absolute top-24 left-6 z-[5] hidden md:block font-mono text-[10px] tracking-[0.3em] text-gray-600 select-none" aria-hidden="true">
        [ SYS.ONLINE ]
      </div>
      <div className="absolute top-24 right-6 z-[5] hidden md:block font-mono text-[10px] tracking-[0.3em] text-gray-600 select-none" aria-hidden="true">
        44.69°N — 10.63°E
      </div>

      <HeroTicker />
    </div>
  );
};

export default Hero2;
