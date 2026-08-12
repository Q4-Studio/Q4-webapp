import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { OBFUSCATED, decode } from '../utils/obfuscate';
import { getAttribution, getGaClientId, getGaSessionId } from '../utils/attribution';
import { pushDataLayerEvent } from '../utils/dataLayer';

gsap.registerPlugin(ScrollTrigger);

interface ContactFormProps {
  /** Mostra l'intestazione "Iniziamo a Crescere" sopra il form (default true). */
  showHeader?: boolean;
  /** Contesto opzionale mostrato nel form e inviato al webhook. */
  subject?: string;
  /** Testi opzionali per contestualizzare l'intestazione su una pagina servizio. */
  headerTitle?: string;
  headerDescription?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ showHeader = true, subject, headerTitle, headerDescription }) => {
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
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(decode(OBFUSCATED.email));
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // fromTo + immediateRender:false + once: se lo ScrollTrigger non scatta
      // (misure prese prima che il layout si assestasse) il contenuto resta
      // visibile invece di restare bloccato a opacity 0; una volta acceso non
      // si rispegne più tornando indietro con lo scroll.
      gsap.fromTo(
        sectionRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
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

    // Un solo event_id per il lead, condiviso tra il webhook CRM e il dataLayer:
    // permette di far quadrare la riga nel CRM con l'evento GA4 (e in futuro con
    // una eventuale Conversions API) senza mandare dati personali a Google.
    const eventId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const attribution = getAttribution();
    const gaClientId = getGaClientId();
    const gaSessionId = getGaSessionId();

    const notifyGa4 = () => {
      pushDataLayerEvent('generate_lead', {
        event_id: eventId,
        form_name: subject ? 'contact_form_context' : 'contact_form',
        lead_company: formData.company,
        page_url: window.location.href,
        ...attribution
      });
    };

    try {
      // Get webhook URL from environment variable or use placeholder
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || '';
      const submissionPayload = {
        ...formData,
        ...(subject ? { subject } : {}),
        timestamp: new Date().toISOString(),
        source: 'Q4 Studio Website',
        event_id: eventId,
        page_url: window.location.href,
        ...attribution,
        ...(gaClientId ? { ga_client_id: gaClientId } : {}),
        ...(gaSessionId ? { ga_session_id: gaSessionId } : {})
      };

      if (!webhookUrl) {
        console.warn('VITE_WEBHOOK_URL not configured. Form data:', submissionPayload);
        // Simulate success for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        notifyGa4();
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        notifyGa4();
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
    <section id="contatti" ref={sectionRef} className={`${showHeader ? 'py-32' : 'pt-4 pb-32'} scroll-mt-28 px-6 bg-[#050505] text-white`}>
      <div className="max-w-4xl mx-auto">
        {showHeader && (
          <div className="text-center mb-16">
            <span className="text-indigo-500 text-sm tracking-[0.08em] mb-5 block">CONTATTACI</span>
            <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">
              {headerTitle ?? <>Iniziamo a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Crescere</span></>}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {headerDescription ?? 'Raccontaci la tua sfida. Ti mostreremo come automatizzare la crescita del tuo business B2B.'}
            </p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10" />

          {subject && (
            <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-5 py-4">
              <span className="block text-[11px] uppercase tracking-[0.08em] text-cyan-300">Richiesta</span>
              <strong className="mt-1 block text-lg text-white">{subject}</strong>
            </div>
          )}

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
          {email && (
            <a href={`mailto:${email}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
              {email}
            </a>
          )}
        </p>
      </div>
    </section>
  );
};

export default ContactForm;
