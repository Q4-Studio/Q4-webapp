import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, HelpCircle, MessageSquare, Mail } from 'lucide-react';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import { PaperBlock } from './home2/primitives';
import { IconBox } from './ResourceCard';
import { lightFormClasses as t } from './ContactForm';
import posthog from '../lib/posthog';
import { Sentry } from '../lib/sentry';

const SUPPORT_WEBHOOK_URL = import.meta.env.VITE_APP_SUPPORT_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/YoRWq5tyW2U6PsMmbr5e/webhook-trigger/124c9122-ea5c-4be6-bdbd-64927a29e776';

const TOPICS = [
  { icon: HelpCircle, title: 'Problemi di accesso', text: 'Difficoltà con login o password? Indica il tuo account nel messaggio.' },
  { icon: MessageSquare, title: 'Bug o malfunzionamenti', text: 'Descrivi il problema e il dispositivo utilizzato per un supporto rapido.' },
  { icon: Mail, title: 'Richieste generali', text: "Per qualsiasi altra domanda sull'app, il tuo team Q4 Studio è disponibile." },
];

/* ------------------------------------------------------------------ */
/* Supporto app Q4 CRM (/#app-support, noindex) sul sistema chiaro      */
/* (nessun mockup, vedi remaining-light-pages.md): hero scuro corto,    */
/* tre card per tipo di richiesta e form di supporto in carta, con le   */
/* classi del form contatti chiaro. Footer chiaro in App.tsx.           */
/* ------------------------------------------------------------------ */

const AppSupport: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
        posthog.capture('support_request_submitted');
      } else {
        setSubmitStatus('error');
        posthog.capture('support_request_submission_failed', { failure_type: 'http_error' });
        Sentry.captureMessage('support_request_submission_failed', {
          level: 'error',
          tags: { form: 'app_support', failure_type: 'http_error' },
          extra: { status: response.status },
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      posthog.capture('support_request_submission_failed', { failure_type: 'network_error' });
      Sentry.captureException(error, { tags: { form: 'app_support', failure_type: 'network_error' } });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const inputClass = t.input;
  const labelClass = t.label;

  return (
    <section className="relative">
      <SubHero
        kicker="Supporto app"
        title="Supporto Q4 CRM."
        lead="Hai bisogno di aiuto con l'app Q4 CRM? Compila il modulo qui sotto e ti risponderemo il prima possibile."
      />

      {/* Tre tipi di richiesta, in card come le altre pagine chiare. */}
      <section className="px-6 pb-16 pt-24 md:px-12 md:pb-24 md:pt-[160px]" aria-label="Tipi di richiesta">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 lg:grid-cols-3">
          {TOPICS.map((topic, i) => (
            <Reveal key={topic.title} as="article" delay={i * 0.1} className="bc h-full gap-6" style={{ minHeight: 260 }}>
              <IconBox icon={topic.icon} />
              <div className="mt-auto">
                <h2 style={{ fontSize: 'clamp(1.4rem, 1.9vw, 1.9rem)', letterSpacing: '-0.035em', lineHeight: 1.08 }}>{topic.title}</h2>
                <p className="mt-3 text-[15px] leading-[1.55]">{topic.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form di supporto in un blocco carta. */}
      <section className="px-6 pb-24 md:pb-[160px]" aria-labelledby="supporto-form">
        <PaperBlock padding="px-5 py-14 md:px-20 md:py-[100px]">
          <h2 id="supporto-form" className="h-l" style={{ fontSize: 'clamp(2.25rem, 4.4vw, 4.5rem)' }}>Invia una richiesta di supporto.</h2>
          <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-[960px] rounded-3xl bg-white p-6 shadow-[0_30px_70px_-30px_rgba(76,29,149,0.35)] md:mt-16 md:p-12">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>Nome e Cognome *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className={inputClass} placeholder="Mario Rossi" />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className={inputClass} placeholder="mario@esempio.it" />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>Telefono</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" className={inputClass} placeholder="+39 123 456 7890" />
              </div>
              <div>
                <label htmlFor="subject" className={labelClass}>Tipo di problema *</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={`${inputClass} appearance-none`}>
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
              <label htmlFor="message" className={labelClass}>Descrizione del problema *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Descrivi il problema in dettaglio. Se possibile includi: il dispositivo utilizzato (iPhone/Android), la versione dell'app e i passi per riprodurre il problema..."
              />
            </div>

            {submitStatus === 'success' && (
              <div role="status" className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${t.success}`}>
                <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>Richiesta inviata con successo! Il nostro team ti risponderà entro 24 ore.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div role="alert" className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${t.error}`}>
                <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>Errore nell'invio. Riprova o contattaci direttamente tramite l'app.</span>
              </div>
            )}

            <div className="flex justify-center">
              <button type="submit" disabled={isSubmitting} className="btn btn-dark disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? 'Invio in corso…' : 'Invia la richiesta'}
                {!isSubmitting && <Send className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[16px]">
            Q4 Studio · Supporto App CRM · Il tuo team risponde entro 24 ore nei giorni lavorativi
          </p>
        </PaperBlock>
      </section>
    </section>
  );
};

export default AppSupport;
