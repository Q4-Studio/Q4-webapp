import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Send, CheckCircle, AlertCircle, Smartphone, HelpCircle, MessageSquare, Mail } from 'lucide-react';

const SUPPORT_WEBHOOK_URL = import.meta.env.VITE_APP_SUPPORT_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/YoRWq5tyW2U6PsMmbr5e/webhook-trigger/124c9122-ea5c-4be6-bdbd-64927a29e776';

const AppSupport: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(formRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch(SUPPORT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'Q4 CRM App - Support Page'
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div ref={containerRef} className="relative pt-32 pb-20 px-6 bg-[#050505] text-white min-h-screen">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <Smartphone className="w-12 h-12 text-indigo-400" />
          </div>
          <span className="text-indigo-500 font-mono tracking-widest mb-4 block">SUPPORTO APP</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Supporto{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Q4 CRM
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hai bisogno di aiuto con l'app Q4 CRM? Siamo qui per supportarti.
            Compila il modulo sottostante e ti risponderemo il prima possibile.
          </p>
        </div>

        {/* FAQ quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Problemi di accesso</h3>
              <p className="text-sm text-gray-400">Difficoltà con login o password? Indica il tuo account nel messaggio.</p>
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Bug o malfunzionamenti</h3>
              <p className="text-sm text-gray-400">Descrivi il problema e il dispositivo utilizzato per un supporto rapido.</p>
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <Mail className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Richieste generali</h3>
              <p className="text-sm text-gray-400">Per qualsiasi altra domanda sull'app, il tuo team Q4 Studio è disponibile.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10" />

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Invia una richiesta di supporto</h2>
          </div>

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
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="mario@esempio.it"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
                Telefono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
                Tipo di problema *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="" disabled>Seleziona il tipo di problema</option>
                <option value="Problemi di accesso">Problemi di accesso / Login</option>
                <option value="Bug o malfunzionamento">Bug o malfunzionamento</option>
                <option value="Richiesta funzionalità">Richiesta nuova funzionalità</option>
                <option value="Domanda sull'app">Domanda sull'app</option>
                <option value="Account e abbonamento">Account e abbonamento</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
              Descrizione del problema *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Descrivi il problema in dettaglio. Se possibile includi: il dispositivo utilizzato (iPhone/Android), la versione dell'app e i passi per riprodurre il problema..."
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Richiesta inviata con successo! Il nostro team ti risponderà entro 24 ore.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Errore nell'invio. Riprova o contattaci direttamente tramite l'app.</span>
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
          Q4 Studio · Supporto App CRM · Il tuo team risponde entro 24 ore nei giorni lavorativi
        </p>
      </div>
    </div>
  );
};

export default AppSupport;
