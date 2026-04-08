// I valori sono codificati in Base64 - non appaiono mai in chiaro nell'HTML/JS bundle come stringhe leggibili
// Nota: questa tecnica riduce significativamente lo scraping automatico, non è sicurezza assoluta
// Nota: decode() usa atob() che è disponibile solo nel browser - chiamarla sempre dentro useEffect

export const OBFUSCATED = {
  // btoa('+39 334 920 0353') = 'KzM5IDMzNCA5MjAgMDM1Mw=='
  phone: 'KzM5IDMzNCA5MjAgMDM1Mw==',
  // btoa('info@q4.studio') = 'aW5mb0BxNC5zdHVkaW8='
  email: 'aW5mb0BxNC5zdHVkaW8=',
};

export function decode(encoded: string): string {
  return atob(encoded);
}
