import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Cookie, Eye, Mail, FileText } from 'lucide-react';
import { OBFUSCATED, decode } from '../utils/obfuscate';

const Privacy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(decode(OBFUSCATED.email));
  }, []);

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

      gsap.from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative pt-32 pb-20 px-6 bg-[#050505] text-white min-h-screen">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Privacy & Cookie Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ultimo aggiornamento: 5 Gennaio 2025
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-12">
          {/* Privacy Policy */}
          <section className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-indigo-400" />
              <h2 className="text-3xl font-bold text-indigo-300">Privacy Policy</h2>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Titolare del Trattamento</h3>
                <p>
                  Q4 Studio - P.IVA 05018960236<br />
                  Email: {email && <a href={`mailto:${email}`} className="text-indigo-400 hover:underline">{email}</a>}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Dati Raccolti</h3>
                <p className="mb-3">Raccogliamo i seguenti dati personali:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dati di contatto:</strong> nome, cognome, email, telefono, azienda (tramite form di contatto)</li>
                  <li><strong>Dati di navigazione:</strong> indirizzo IP, browser, dispositivo, pagine visitate (tramite Google Analytics 4)</li>
                  <li><strong>Cookie di terze parti:</strong> Meta Pixel per tracciamento pubblicitario</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Finalità del Trattamento</h3>
                <p className="mb-3">I dati personali sono trattati per:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Rispondere alle richieste di contatto e preventivi</li>
                  <li>Analizzare il traffico del sito web e migliorare l'esperienza utente (Google Analytics 4)</li>
                  <li>Campagne pubblicitarie su Meta (Facebook/Instagram) tramite Meta Pixel</li>
                  <li>Adempimenti fiscali e contabili</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Base Giuridica</h3>
                <p>
                  Il trattamento dei dati è basato su:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li><strong>Consenso dell'interessato</strong> (art. 6.1.a GDPR) per cookie analytics e marketing</li>
                  <li><strong>Esecuzione di misure precontrattuali</strong> (art. 6.1.b GDPR) per richieste di preventivo</li>
                  <li><strong>Legittimo interesse</strong> (art. 6.1.f GDPR) per analisi statistiche anonime</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Conservazione dei Dati</h3>
                <p>
                  I dati personali sono conservati per:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li><strong>Dati di contatto:</strong> 24 mesi dalla richiesta</li>
                  <li><strong>Dati analytics:</strong> 26 mesi (retention automatica GA4)</li>
                  <li><strong>Cookie:</strong> massimo 12 mesi</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6. Diritti dell'Interessato</h3>
                <p className="mb-3">Ai sensi del GDPR, hai diritto a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accedere ai tuoi dati personali</li>
                  <li>Rettificare dati inesatti</li>
                  <li>Richiedere la cancellazione ("diritto all'oblio")</li>
                  <li>Limitare il trattamento</li>
                  <li>Opporti al trattamento</li>
                  <li>Portabilità dei dati</li>
                  <li>Revocare il consenso in qualsiasi momento</li>
                </ul>
                <p className="mt-4">
                  Per esercitare i tuoi diritti, contattaci all'email{' '}
                  {email && (
                    <a href={`mailto:${email}`} className="text-indigo-400 hover:underline">
                      {email}
                    </a>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Policy */}
          <section className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-purple-300">Cookie Policy</h2>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cosa sono i Cookie</h3>
                <p>
                  I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell'utente,
                  dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cookie Utilizzati</h3>

                {/* Cookie Tecnici */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-300 mb-2">Cookie Tecnici (Nessun consenso richiesto)</h4>
                  <p className="mb-3">
                    Cookie necessari al funzionamento del sito, non richiedono consenso esplicito.
                  </p>
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-4">
                    <p className="text-sm">
                      <strong>cookie_consent</strong><br />
                      Finalità: Memorizza le preferenze sui cookie<br />
                      Durata: 12 mesi
                    </p>
                  </div>
                </div>

                {/* Cookie Analytics */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-300 mb-2">Cookie Analytics (Consenso richiesto)</h4>
                  <p className="mb-3">
                    Utilizzati per raccogliere informazioni aggregate sull'uso del sito.
                  </p>
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm">
                        <strong>Google Analytics 4 (_ga, _ga_*, _gid)</strong><br />
                        Finalità: Statistiche anonime di utilizzo<br />
                        Durata: 2 anni (_ga), 24 ore (_gid)<br />
                        Terza parte: Google LLC
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cookie Marketing */}
                <div>
                  <h4 className="text-lg font-semibold text-indigo-300 mb-2">Cookie di Marketing (Consenso richiesto)</h4>
                  <p className="mb-3">
                    Utilizzati per tracciare i visitatori attraverso i siti web per mostrare annunci pertinenti.
                  </p>
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-4">
                    <p className="text-sm">
                      <strong>Meta Pixel (_fbp, _fbc, fr)</strong><br />
                      Finalità: Tracciamento conversioni e remarketing su Facebook/Instagram<br />
                      Durata: 90 giorni<br />
                      Terza parte: Meta Platforms, Inc.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Gestione dei Cookie</h3>
                <p className="mb-3">
                  Puoi gestire le tue preferenze sui cookie tramite il banner presente sul sito o
                  direttamente dalle impostazioni del tuo browser:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Microsoft Edge</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Link Utili</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      Privacy Policy Google Analytics
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      Privacy Policy Meta
                    </a>
                  </li>
                  <li>
                    <a href="https://www.garanteprivacy.it/cookie" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      Garante Privacy - Cookie
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold">Hai domande?</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Per qualsiasi domanda relativa alla privacy o ai cookie, contattaci:
            </p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
              >
                {email}
              </a>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
