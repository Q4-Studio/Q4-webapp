// I valori sono codificati in Base64 - non appaiono mai in chiaro nell'HTML/JS bundle come stringhe leggibili
// Nota: questa tecnica riduce significativamente lo scraping automatico, non è sicurezza assoluta
// Nota: decode() usa atob() che è disponibile solo nel browser - chiamarla sempre dentro useEffect

export const OBFUSCATED = {
  // btoa('+39 375 114 6803') = 'KzM5IDM3NSAxMTQgNjgwMw=='
  phone: 'KzM5IDM3NSAxMTQgNjgwMw==',
  // btoa('info@q4.studio') = 'aW5mb0BxNC5zdHVkaW8='
  email: 'aW5mb0BxNC5zdHVkaW8=',
};

export function decode(encoded: string): string {
  return atob(encoded);
}
