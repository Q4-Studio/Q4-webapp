import posthog from 'posthog-js';
import type { CaptureResult } from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

interface ExceptionFrame {
  in_app?: boolean;
}

interface ExceptionItem {
  stacktrace?: { frames?: ExceptionFrame[] };
}

// Drop exceptions that have no first-party stack frame. Scripts that the
// browser or an in-app webview injects (for example the Facebook in-app
// browser) throw on our page but carry no frame from our own code, so they
// add noise to error tracking without pointing at a real bug in the site.
function dropForeignExceptions(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== '$exception') return event;

  const exceptions = event.properties?.$exception_list as ExceptionItem[] | undefined;
  if (!Array.isArray(exceptions)) return event;

  const hasFirstPartyFrame = exceptions.some((exception) =>
    exception?.stacktrace?.frames?.some((frame) => frame?.in_app === true),
  );

  return hasFirstPartyFrame ? event : null;
}

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = !posthogKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
    throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    before_send: dropForeignExceptions,
  });
}

export default posthog;
