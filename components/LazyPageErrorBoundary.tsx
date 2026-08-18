import React from 'react';

interface LazyPageErrorBoundaryProps {
  children: React.ReactNode;
}

interface LazyPageErrorBoundaryState {
  hasError: boolean;
}

// Rete di sicurezza per le pagine caricate con lazy(): se un chunk fallisce
// a caricarsi o va in errore durante il render, senza questo boundary React
// smonta tutto l'albero e la pagina resta nera. Qui invece mostriamo un
// fallback minimo, cliccabile, invece di una pagina bianca o nera.
class LazyPageErrorBoundary extends React.Component<LazyPageErrorBoundaryProps, LazyPageErrorBoundaryState> {
  state: LazyPageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Errore nel caricamento della pagina:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] px-6 text-center text-white">
          <div className="max-w-xl">
            <h1 className="mb-5 text-3xl font-bold tracking-[-0.02em] md:text-4xl">Qualcosa non ha funzionato.</h1>
            <p className="mb-8 leading-relaxed text-gray-400">
              Questa pagina non si è caricata correttamente. Riprova dalla home, oppure scrivici direttamente.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-[#050505]">
                Torna alla home
              </a>
              <a href="/#contatti" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:border-white/40">
                Contattaci
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyPageErrorBoundary;
