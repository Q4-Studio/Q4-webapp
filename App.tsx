import React from 'react';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import Services from './components/Services';
import Team from './components/Team';
import Marquee from './components/Marquee';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Optional: Custom cursor implementation could go here, 
  // but for performance we relied on the Hero grid warping.
  
  return (
    <main className="w-full min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar overlay - simplified for immersive feel */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <img
          src="/logo.png"
          alt="Q4 Studio"
          className="h-8 md:h-10 w-auto cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <button
          onClick={() => {
            const contactForm = document.querySelector('section:has(form)');
            contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="hidden md:block text-sm font-mono hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-0"
        >
          CONTATTACI
        </button>
      </nav>

      <Hero />
      <ValueProposition />
      <Services />
      <Team />
      <Marquee />
      <ContactForm />
      <Footer />
      
    </main>
  );
};

export default App;