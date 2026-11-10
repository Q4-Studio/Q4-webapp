import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

// Senza DSN Sentry resta spento: in locale e nelle preview Vercel non vogliamo
// rumore. In produzione la variabile va impostata su Vercel.
export const isSentryEnabled = Boolean(dsn);

if (dsn) {
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
