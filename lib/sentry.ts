import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

/** Host di produzione: solo da qui gli eventi finiscono nel progetto Sentry. */
const PRODUCTION_HOST = 'www.q4.studio';

// Sentry si accende solo con il DSN E sul dominio di produzione. Il DSN da
// solo non basta: una build con `.env.local` servita in locale o su una
// anteprima (Tailscale, Vercel preview) riporterebbe al progetto di
// produzione errori che non sono del sito (chunk vecchi, script Vercel
// assenti). Eccezione: VITE_SENTRY_FORCE=1 per provare Sentry fuori dal
// dominio.
const onProductionHost = typeof window !== 'undefined' && window.location.hostname === PRODUCTION_HOST;
export const isSentryEnabled = Boolean(dsn) && (onProductionHost || import.meta.env.VITE_SENTRY_FORCE === '1');

if (isSentryEnabled) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || undefined,
    sendDefaultPii: false,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    // Performance: 20% delle sessioni basta per un sito vetrina.
    tracesSampleRate: 0.2,
    tracePropagationTargets: [/^\//],
    // Replay solo quando c'è un errore, mai in sessioni normali.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
      // Rumore noto da estensioni browser e da bot
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      /^Script error\.?$/,
      /chrome-extension:\/\//,
      /moz-extension:\/\//,
    ],
  });
}

/** Evento di business (non un errore): finisce in Sentry come messaggio info. */
export function trackEvent(name: string, data: Record<string, unknown> = {}): void {
  if (!isSentryEnabled) return;
  Sentry.captureMessage(name, { level: 'info', extra: data, tags: { kind: 'event' } });
}

export { Sentry };
