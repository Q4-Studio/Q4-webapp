import React, { useEffect, useRef } from 'react';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import Services from './components/Services';
import Marquee from './components/Marquee';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Optional: Custom cursor implementation could go here, 
  // but for performance we relied on the Hero grid warping.
  
  return (
    <main className="w-full min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar overlay - simplified for immersive feel */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-bold tracking-tighter font-['Space_Grotesk']">
            Q4 STUDIO<span className="text-indigo-500">.</span>
        </div>
        <a href="mailto:info@q4.studio" className="hidden md:block text-sm font-mono hover:text-indigo-400 transition-colors">
            CONTATTACI
        </a>
      </nav>

      <Hero />
      <ValueProposition />
      <Services />
      <Marquee />
      <Footer />
      
    </main>
  );
};

export default App;