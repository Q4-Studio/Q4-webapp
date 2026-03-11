import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDownRight } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for orbital spheres
  const orbitRef1 = useRef<HTMLDivElement>(null);
  const orbitRef2 = useRef<HTMLDivElement>(null);
  const orbitRef3 = useRef<HTMLDivElement>(null);
  const orbitRef4 = useRef<HTMLDivElement>(null);
  const orbitRef5 = useRef<HTMLDivElement>(null);
  const orbitRef6 = useRef<HTMLDivElement>(null);

  // Particle System Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    // Adjust density based on screen size
    const particleCount = Math.min(Math.floor((width * height) / 12000), 100); 

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, // Slower, more organic drift
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction (Repel/Disturb effect)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          const angle = Math.atan2(dy, dx);
          
          // Gentle push
          p.x += Math.cos(angle) * force * 0.5;
          p.y += Math.sin(angle) * force * 0.5;
        }

        // Wrap around screen
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw Particle
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`; // Indigo tint
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw Connections (Cybernetic network effect)
        // Connect particles that are close to each other
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          const connectDist = 120;

          if (dist2 < connectDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist2 / connectDist) * 0.15})`; // Fade line based on distance
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Grid Warp Effect + Orbital Sphere Magnetic Interaction
      const handleMouseMove = (e: MouseEvent) => {
        if(!gridRef.current) return;
        const xPos = (e.clientX / window.innerWidth - 0.5);
        const yPos = (e.clientY / window.innerHeight - 0.5);

        // 3D Perspective Grid Warp
        gsap.to(gridRef.current, {
          rotationX: -yPos * 25, // Vertical tilt
          rotationY: xPos * 25,  // Horizontal tilt
          backgroundPosition: `${50 - xPos * 20}% ${50 - yPos * 20}%`, // Move texture opposite to tilt for depth
          transformPerspective: 1000,
          duration: 2,
          ease: "power3.out"
        });

        gsap.to(shapeRef.current, {
          rotationY: xPos * 30,
          rotationX: -yPos * 30,
          duration: 2,
          ease: "power3.out"
        });

        // Magnetic interaction with orbital spheres - ENHANCED
        const orbitRefs = [orbitRef1, orbitRef2, orbitRef3, orbitRef4, orbitRef5, orbitRef6];
        orbitRefs.forEach((ref) => {
          if (!ref.current) return;

          const rect = ref.current.getBoundingClientRect();
          const sphereX = rect.left + rect.width / 2;
          const sphereY = rect.top + rect.height / 2;

          const dx = e.clientX - sphereX;
          const dy = e.clientY - sphereY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 280; // Even larger interaction radius

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);

            // Push away from cursor (repel effect) - ULTRA STRONG
            const offsetX = -Math.cos(angle) * force * 120;
            const offsetY = -Math.sin(angle) * force * 120;

            gsap.to(ref.current, {
              x: offsetX,
              y: offsetY,
              scale: 1 + force * 0.8,
              duration: 0.15,
              ease: "power4.out"
            });
          } else {
            // Return to original position
            gsap.to(ref.current, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)"
            });
          }
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Manual SplitText Implementation (Word-safe)
      let animationTargets: HTMLElement[] = [];
      
      if (titleRef.current) {
        // Reset in case of re-renders (though useEffect runs once due to [])
        const originalText = titleRef.current.innerText; 
        titleRef.current.innerHTML = '';
        
        const words = originalText.split(' ');
        
        words.forEach((word, i) => {
          // Create a wrapper for the word to ensure proper line breaks
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          
          word.split('').forEach((char) => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.style.display = 'inline-block';
            charSpan.style.opacity = '0';
            // Set initial state via CSS styles for cleanliness, 
            // but GSAP will handle the 'from' state as well.
            wordSpan.appendChild(charSpan);
            animationTargets.push(charSpan);
          });

          titleRef.current?.appendChild(wordSpan);
          
          if (i < words.length - 1) {
            // Add a space between words
            const space = document.createTextNode(' ');
            titleRef.current?.appendChild(space);
          }
        });
      }

      // Intro Timeline
      const tl = gsap.timeline();

      tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
        .fromTo(animationTargets, 
          { 
            y: 100, 
            opacity: 0, 
            rotateX: -90 
          },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0, 
            stagger: 0.02, 
            duration: 1, 
            ease: "back.out(1.7)" 
          }
        )
        .fromTo(subRef.current, 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }, 
          "-=0.5"
        )
        .fromTo(shapeRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
          "-=1"
        );

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#050505] opacity-0">
      {/* Background Particles Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
      />

      {/* Background Grid */}
      <div 
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none scale-[1.5]"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Orbital System */}
      <div className="absolute right-[10%] top-[20%] z-0 hidden lg:block perspective-1000">
        <div ref={shapeRef} className="w-96 h-96 relative preserve-3d">
          {/* Central Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full shadow-[0_0_60px_30px_rgba(99,102,241,0.4)] z-20" />

          {/* Orbit Rings */}
          <div className="absolute inset-0 border border-indigo-500/20 rounded-full" />
          <div className="absolute inset-8 border border-purple-500/15 rounded-full" />
          <div className="absolute inset-16 border border-white/10 rounded-full" />

          {/* Orbiting Elements - Meta (Blue) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-[spin_12s_linear_infinite]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-[orbit-fade_12s_ease-in-out_infinite]">
              <div ref={orbitRef1} className="w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_20px_8px_rgba(59,130,246,0.5)] flex items-center justify-center transition-all duration-300">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Orbiting Elements - AI (Purple) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-[spin_8s_linear_infinite_reverse]">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 animate-[orbit-fade_8s_ease-in-out_infinite]">
              <div ref={orbitRef2} className="w-6 h-6 bg-purple-500 rounded-full shadow-[0_0_20px_8px_rgba(168,85,247,0.5)] flex items-center justify-center transition-all duration-300">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Secondary Orbit - Lead Gen (Cyan) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] animate-[spin_15s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-[orbit-fade_15s_ease-in-out_infinite]">
              <div ref={orbitRef3} className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_6px_rgba(34,211,238,0.4)] transition-all duration-300" />
            </div>
          </div>

          {/* Secondary Orbit - Automation (Pink) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] animate-[spin_10s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-[orbit-fade_10s_ease-in-out_infinite]">
              <div ref={orbitRef4} className="w-4 h-4 bg-pink-400 rounded-full shadow-[0_0_15px_6px_rgba(244,114,182,0.4)] transition-all duration-300" />
            </div>
          </div>

          {/* Tertiary Small Orbits (Data Points) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] animate-[spin_20s_linear_infinite]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-[orbit-fade_20s_ease-in-out_infinite]">
              <div ref={orbitRef5} className="w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_10px_4px_rgba(165,180,252,0.3)] transition-all duration-300" />
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] animate-[spin_18s_linear_infinite_reverse]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-[orbit-fade_18s_ease-in-out_infinite]">
              <div ref={orbitRef6} className="w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_10px_4px_rgba(216,180,254,0.3)] transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl px-6 w-full">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Performance, Non Promesse
          </div>

          <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tighter text-white mix-blend-difference">
            Meta + AI
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-light mt-2">
            Lead Generation che converte. Agenti che scalano.
          </p>

          <p ref={subRef} className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed mt-8">
            Specialisti in Lead Generation B2B su Meta e Agenti AI personalizzati. Due servizi distinti, stesso obiettivo: eliminare inefficienze e moltiplicare i risultati del tuo business.
          </p>
          
          <div className="mt-8 flex items-center gap-4">
             <button
               onClick={() => {
                 const nextSection = document.querySelector('section');
                 nextSection?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center animate-bounce mt-10 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-300 cursor-pointer group"
               aria-label="Scorri per esplorare"
             >
               <ArrowDownRight className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
             </button>
             <button
               onClick={() => {
                 const nextSection = document.querySelector('section');
                 nextSection?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="mt-10 text-sm text-gray-500 font-mono hover:text-indigo-400 transition-colors cursor-pointer"
             >
               SCORRI PER ESPLORARE
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;