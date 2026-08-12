// Notifica IndexNow (Bing, Yandex, Seznam, Naver, Yep) che gli URL del sito
// sono stati aggiunti o aggiornati, per un'indicizzazione più rapida.
//
// Da eseguire DOPO un deploy reale su Vercel (non in locale, non in CI prima
// del deploy): l'API di IndexNow notifica i motori di ricerca che devono
// ricrawlare questi URL — non ha senso chiamarla se il sito live non
// corrisponde ancora a dist/sitemap.xml.
//
// Uso:
//   npm run indexnow:ping                # tutti gli URL della sitemap
//   npm run indexnow:ping -- /blog/nuovo-articolo   # solo URL specifici
//
// La chiave è pubblica per design (va ospitata come file statico sul sito
// per provare il possesso del dominio) — non è un segreto da proteggere.

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const HOST = 'www.q4.studio';
const KEY = 'aaa6052477661f9542db6021c269f0e8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function urlsFromSitemap() {
  const sitemapPath = join(distDir, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    console.error('❌ dist/sitemap.xml non trovato. Esegui prima `npm run build`.');
    process.exit(1);
  }
  const xml = readFileSync(sitemapPath, 'utf-8');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const explicitUrls = process.argv.slice(2);
  const urlList = explicitUrls.length > 0
    ? explicitUrls.map((path) => (path.startsWith('http') ? path : `https://${HOST}${path}`))
    : urlsFromSitemap();

  console.log(`→ Notifico IndexNow per ${urlList.length} URL...`);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  if (response.ok) {
    console.log(`✅ IndexNow: notifica accettata (status ${response.status}).`);
  } else {
    console.error(`⚠️  IndexNow: risposta ${response.status} ${response.statusText}`);
    console.error(await response.text().catch(() => ''));
    process.exit(1);
  }
}

main();
