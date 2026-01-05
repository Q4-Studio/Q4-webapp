import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactForm: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Get webhook URL from environment variable or use placeholder
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || '';

      if (!webhookUrl) {
        console.warn('VITE_WEBHOOK_URL not configured. Form data:', formData);
        // Simulate success for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'Q4 Studio Website'
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-[#050505] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-500 font-mono tracking-widest mb-4 block">CONTATTACI</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Iniziamo a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Scalare</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Raccontaci la tua sfida. Ti mostreremo come automatizzare la crescita del tuo business B2B.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Nome e Cognome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email Aziendale *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="mario@azienda.it"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
                Cellulare *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-300">
                Azienda *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Nome dell'azienda"
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Raccontaci del tuo business e degli obiettivi di crescita..."
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Messaggio inviato con successo! Ti contatteremo presto.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Errore nell'invio. Riprova o contattaci direttamente via email.</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-colors duration-300 rounded-full group border border-white/20 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    Invia Richiesta
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Oppure scrivici direttamente a{' '}
          <a href="mailto:info@q4.studio" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            info@q4.studio
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactForm;
