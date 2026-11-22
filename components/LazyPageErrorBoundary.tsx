import React from 'react';
import { Sentry } from '../lib/sentry';

interface LazyPageErrorBoundaryProps {
  children: React.ReactNode;
}

interface LazyPageErrorBoundaryState {
  hasError: boolean;
}

// Rete di sicurezza per le pagine caricate con lazy(): se un chunk fallisce
// a caricarsi o va in errore durante il render, senza questo boundary React
// smonta tutto l'albero e la pagina resta vuota. Qui invece mostriamo un
// fallback minimo e cliccabile, sul sistema chiaro come il resto del sito.
class LazyPageErrorBoundary extends React.Component<LazyPageErrorBoundaryProps, LazyPageErrorBoundaryState> {
  state: LazyPageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Errore nel caricamento della pagina:', error);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="home-light relative flex min-h-screen w-full items-center justify-center px-6 pt-28 text-center">
          <div className="max-w-xl">
            <h1 style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.5rem)', letterSpacing: '-0.045em', lineHeight: 1.02 }}>Qualcosa non ha funzionato.</h1>
            <p className="mt-6 text-[19px] leading-[1.6]">
              Questa pagina non si è caricata correttamente. Riprova dalla home, oppure scrivici direttamente.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/" className="btn btn-dark">Torna alla home</a>
              <a href="/#contatti" className="btn border border-black/15 text-[#0a0a0a] hover:border-black/40">Contattaci</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyPageErrorBoundary;
