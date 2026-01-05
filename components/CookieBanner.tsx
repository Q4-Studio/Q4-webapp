import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load existing preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);

    // Here you would initialize/disable analytics and marketing scripts
    if (prefs.analytics) {
      // Initialize GA4
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Initialize Meta Pixel
      console.log('Marketing enabled');
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    saveConsent(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    saveConsent(necessaryOnly);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-6xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {!showSettings ? (
            // Main Banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Questo sito utilizza cookie
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">
                    Utilizziamo cookie tecnici, analytics (Google Analytics 4) e di marketing (Meta Pixel) per migliorare la tua esperienza
                    e mostrarti contenuti personalizzati. Puoi scegliere quali cookie accettare.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-white hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
                    >
                      Accetta tutto
                    </button>

                    <button
                      onClick={acceptNecessaryOnly}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Solo necessari
                    </button>

                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Personalizza
                    </button>
                  </div>

                  <p className="text-gray-500 text-xs mt-4">
                    Cliccando "Accetta tutto" acconsenti all'uso di tutti i cookie. Leggi la nostra{' '}
                    <a
                      href="/#privacy"
                      className="text-indigo-400 hover:underline"
                      onClick={() => setShowBanner(false)}
                    >
                      Privacy & Cookie Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Preferenze Cookie
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Cookie Necessari</h4>
                    <p className="text-sm text-gray-400">
                      Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Cookie Analytics</h4>
                    <p className="text-sm text-gray-400">
                      Google Analytics 4 per statistiche anonime di utilizzo del sito.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-indigo-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Cookie di Marketing</h4>
                    <p className="text-sm text-gray-400">
                      Meta Pixel per tracciamento conversioni e remarketing su Facebook/Instagram.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-indigo-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveCustom}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-white hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
                >
                  Salva preferenze
                </button>

                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300"
                >
                  Annulla
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-4">
                Per maggiori informazioni consulta la nostra{' '}
                <a
                  href="/#privacy"
                  className="text-indigo-400 hover:underline"
                  onClick={() => setShowBanner(false)}
                >
                  Privacy & Cookie Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CookieBanner;
