const STORAGE_KEY = 'q4_attribution';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
}

function readStored(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStored(data: Attribution) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage non disponibile (privacy mode, cookie bloccati): nessuna
    // persistenza, ma non deve bloccare la navigazione né il form.
  }
}

/**
 * Da chiamare una volta per caricamento pagina (vedi App.tsx). Aggiorna UTM e
 * click id con quelli presenti nell'URL corrente (utile quando lo stesso lead
 * torna da una campagna diversa), mantenendo però landing page e referrer del
 * primo arrivo in sessione: sono il "first touch" e non vanno sovrascritti da
 * una navigazione interna successiva.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const next = readStored();

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) next[key] = value;
  });

  if (!next.landing_page) next.landing_page = window.location.href;
  if (!next.referrer) next.referrer = document.referrer || 'direct';

  writeStored(next);
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  return readStored();
}

/**
 * Client ID di GA4 dal cookie _ga (formato GA1.2.<client_id_part1>.<part2>).
 * Permette di ritrovare in GA4 la sessione esatta di un lead arrivato dal CRM,
 * senza mai inviare dati personali a Google.
 */
export function getGaClientId(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_ga=([^;]+)/);
  if (!match) return undefined;
  const parts = match[1].split('.');
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : undefined;
}

/**
 * Session ID di GA4 dal cookie di sessione _ga_<stream-id> (formato
 * GS1.1.<session_id>.<numero_sessione>...). Il nome del cookie dipende dallo
 * stream configurato in GTM, quindi lo individuiamo per prefisso invece di
 * hardcodare l'ID di misurazione.
 */
export function getGaSessionId(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)(_ga_[^=]+)=([^;]+)/);
  if (!match) return undefined;
  const parts = match[2].split('.');
  return parts.length >= 3 ? parts[2] : undefined;
}
