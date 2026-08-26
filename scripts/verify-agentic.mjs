// Verifica post-build dei segnali "agentic readiness" per q4.studio.
// Esegue controlli statici sull'output di dist/ e su vercel.json, così una
// regressione (es. H1 mancante, 404 senza link di recovery, mancanza di
// varianti markdown) fallisce il build invece di passare inosservata.
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

let failures = 0;
function check(name, ok, detail = '') {
  if (ok) {
    console.log(`  ✅ ${name}`);
  } else {
    failures += 1;
    console.error(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function stripToText(html) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const noStyle = noScript.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const noTags = noStyle.replace(/<[^>]+>/g, ' ');
  return noTags.replace(/\s+/g, ' ').trim();
}

function findMdFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findMdFiles(full, acc);
    else if (entry.endsWith('.md')) acc.push(full);
  }
  return acc;
}

// 1. Homepage: H1 + testo senza JS >= 500 caratteri
{
  const home = join(distDir, 'index.html');
  const ok = existsSync(home);
  let hasH1 = false, len = 0;
  if (ok) {
    const html = readFileSync(home, 'utf-8');
    hasH1 = /<h1[^>]*>/.test(html);
    len = stripToText(html).length;
  }
  check('homepage ha almeno un <h1>', hasH1);
  check('homepage testo grezzo >= 500 caratteri', len >= 500, `trovati ${len} caratteri`);
}

// 2. Identità Organization nello schema JSON-LD (home + una pagina prerenderata)
{
  const home = join(distDir, 'index.html');
  const prerendered = join(distDir, 'tracciamento-server-side', 'index.html');
  const homeHtml = existsSync(home) ? readFileSync(home, 'utf-8') : '';
  const preHtml = existsSync(prerendered) ? readFileSync(prerendered, 'utf-8') : '';
  const hasOrgType = (s) => /"@type"\s*:\s*\[?\s*"?Organization/.test(s) || /"@type"\s*:\s*"Organization"/.test(s);
  const hasContact = (s) => /"contactPoint"/.test(s) && /"email"\s*:\s*"info@q4\.studio"/.test(s);
  const hasAddress = (s) => /"@type"\s*:\s*"PostalAddress"/.test(s) && /Reggio Emilia/.test(s);
  check('homepage JSON-LD contiene Organization', hasOrgType(homeHtml));
  check('homepage JSON-LD ha contactPoint+email', hasContact(homeHtml));
  check('homepage JSON-LD ha address (PostalAddress)', hasAddress(homeHtml));
  check('pagina prerenderata ha Organization', hasOrgType(preHtml));
}

// 3. 404: status reale gestito da Vercel, body con link di recovery
{
  const f = join(distDir, '404.html');
  const ok = existsSync(f);
  let hasLinks = false, hasSitemap = false, hasLlms = false;
  if (ok) {
    const html = readFileSync(f, 'utf-8');
    hasLinks = /href="\/"|href="\/tracciamento-server-side"|href="\/casi-studio"/.test(html);
    hasSitemap = /href="\/sitemap\.xml"/.test(html);
    hasLlms = /href="\/llms\.txt"/.test(html);
  }
  check('404.html esiste', ok);
  check('404.html ha link di recovery verso pagine reali', hasLinks);
  check('404.html linka sitemap.xml', hasSitemap);
  check('404.html linka llms.txt', hasLlms);
}

// 4. Trust anchor pages: /about /contact /privacy con H1 + >= 500 caratteri
for (const page of ['about', 'contact', 'privacy']) {
  const f = join(distDir, page, 'index.html');
  const ok = existsSync(f);
  let hasH1 = false, len = 0;
  if (ok) {
    const html = readFileSync(f, 'utf-8');
    hasH1 = /<h1[^>]*>/.test(html);
    len = stripToText(html).length;
  }
  check(`/${page} ha <h1>`, hasH1);
  check(`/${page} testo >= 500 caratteri`, len >= 500, `trovati ${len}`);
}

// 5. Risorse geo-prioritarie: ordine e contenuto minimo sono intenzionali.
// Reggio Emilia viene prima di Parma e Modena nell'array seoPages e quindi
// nella directory generata, nell'indice e nei link correlati.
{
  const resources = [
    {
      slug: 'raccolta-dati-marketing-reggio-emilia',
      phrases: ['Raccolta Dati Marketing a Reggio Emilia', 'Risposta diretta', 'audit del tracciamento']
    },
    {
      slug: 'automazioni-crm-pmi-parma',
      phrases: ['Automazioni CRM per PMI a Parma', 'software CRM', 'setup parte da 490']
    },
    {
      slug: 'tracking-server-side-modena',
      phrases: ['Tracking Server-Side a Modena', 'sGTM', 'ad blocker']
    },
  ];
  for (const resource of resources) {
    const f = join(distDir, 'risorse', resource.slug, 'index.html');
    const html = existsSync(f) ? readFileSync(f, 'utf-8') : '';
    check(`/risorse/${resource.slug} esiste`, Boolean(html));
    for (const phrase of resource.phrases) {
      check(`/risorse/${resource.slug} contiene "${phrase}"`, html.includes(phrase));
    }
  }
  const index = existsSync(join(distDir, 'risorse', 'index.html'))
    ? readFileSync(join(distDir, 'risorse', 'index.html'), 'utf-8')
    : '';
  const positions = resources.map(({ slug }) => index.indexOf(`/risorse/${slug}`));
  check('indice /risorse elenca Reggio prima di Parma e Modena', positions.every((p) => p >= 0) && positions[0] < positions[1] && positions[1] < positions[2]);
}

// 6. Il contenuto ad-blocker deve essere presente nelle rappresentazioni
// HTML statica, FAQ JSON-LD e Markdown della pagina di servizio.
{
  const htmlPath = join(distDir, 'tracciamento-server-side', 'index.html');
  const html = existsSync(htmlPath) ? readFileSync(htmlPath, 'utf-8') : '';
  const mdPath = join(distDir, 'md', 'tracciamento-server-side.md');
  const md = existsSync(mdPath) ? readFileSync(mdPath, 'utf-8') : '';
  check('tracking HTML contiene la risposta ad-blocker', html.includes('Come recuperare le conversioni bloccate dagli ad blocker'));
  check('tracking FAQ JSON-LD contiene la domanda ad-blocker', html.includes('Come recuperare i dati di conversione bloccati dagli ad blocker?'));
  check('tracking Markdown contiene la risposta ad-blocker', md.includes('Come recuperare le conversioni bloccate dagli ad blocker'));
  check('tracking HTML cita documentazione Google e Meta', html.includes('developers.google.com/tag-platform/tag-manager/server-side') && html.includes('developers.facebook.com/docs/marketing-api/conversions-api/'));
}

// 7. llms.txt: sezione when-to-use e le tre nuove risorse
{
  const f = join(distDir, 'llms.txt');
  const ok = existsSync(f);
  let hasWhen = false;
  let hasNewResources = false;
  if (ok) {
    const txt = readFileSync(f, 'utf-8');
    hasWhen = /Quando rivolgersi a Q4 Studio|When to use Q4 Studio/i.test(txt);
    hasNewResources = ['raccolta-dati-marketing-reggio-emilia', 'automazioni-crm-pmi-parma', 'tracking-server-side-modena']
      .every((slug) => txt.includes(`/risorse/${slug}`));
  }
  check('llms.txt ha sezione when-to-use', ok && hasWhen);
  check('llms.txt elenca le tre risorse geo-prioritarie', ok && hasNewResources);
}

// 8. Varianti markdown: ogni route in vercel.json mappata su file .md esistente
{
  const v = JSON.parse(readFileSync(join(distDir, '..', 'vercel.json'), 'utf-8'));
  const mdFiles = new Set(findMdFiles(join(distDir, 'md')));
  const redirects = v.redirects || [];
  const mdRedirects = redirects.filter((r) =>
    Array.isArray(r.has) &&
    r.has.some((h) => h.type === 'header' && /text\/markdown/.test(h.value || ''))
  );
  // Le route con parametro (:slug) non hanno un file concreto: i relativi .md
  // sono generati per singolo slug reale (verificati separatamente sotto).
  const concrete = mdRedirects.filter((r) => !r.destination.includes(':'));
  const expected = concrete.map((r) => join(distDir, r.destination.replace(/^\//, '')));
  const allPresent = expected.every((p) => mdFiles.has(p));
  check(
    `varianti markdown presenti per tutte le route concrete (${concrete.length})`,
    allPresent,
    allPresent ? '' : `mancanti: ${expected.filter((p) => !mdFiles.has(p)).join(', ')}`
  );
  // Verifica che i .md per gli slug reali esistano per ciascun prefisso dinamico.
  const slugPrefixes = mdRedirects
    .filter((r) => r.destination.includes(':'))
    .map((r) => r.destination.replace(/^\/md\//, '').split('/:')[0]);
  const slugOk = slugPrefixes.every((prefix) => {
    const dir = join(distDir, 'md', prefix);
    // Se la directory non esiste, non ci sono slug da generare (es. nessun
    // articolo di blog pubblicato al momento della build): è accettabile.
    return !existsSync(dir) || readdirSync(dir).some((n) => n.endsWith('.md'));
  });
  check('varianti markdown per slug dinamici presenti', slugOk);

  const mdList = [...mdFiles];
  const enough = mdList.length > 0 && mdList.every((p) => readFileSync(p, 'utf-8').length >= 200);
  check('ogni variante markdown ha >= 200 caratteri', enough);
}

// 9. vercel.json: header Vary: Accept globale
{
  const v = JSON.parse(readFileSync(join(distDir, '..', 'vercel.json'), 'utf-8'));
  const headers = v.headers || [];
  const global = headers.find((h) => h.source === '/(.*)');
  const hasVary = !!global && global.headers.some((h) => h.key === 'Vary' && /Accept/.test(h.value) && /Accept-Encoding/.test(h.value));
  check('vercel.json imposta Vary: Accept', hasVary);
}

if (failures > 0) {
  console.error(`\n❌ verify-agentic: ${failures} controllo/i fallito/i`);
  process.exit(1);
}
console.log('\n✅ verify-agentic: tutti i controlli passati');
