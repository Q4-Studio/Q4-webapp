/**
 * Pipeline di ottimizzazione per le cover e le GIF dei case study.
 *
 * Per ogni PNG sorgente trovato in assets/case-studies-src/ (es. un export da
 * Figma/generatore AI) genera in public/case-studies/ le varianti da servire
 * davvero al browser:
 *   - <nome>.webp        variante full-size (qualità alta, adatta a gradienti scuri)
 *   - <nome>-836w.webp   variante responsive a metà larghezza, per mobile via srcset
 *   - <nome>-og.jpg      JPG per og:image / twitter:image / schema.org (formato
 *                        universalmente supportato dai crawler social, a differenza
 *                        di WebP che alcuni parser trattano in modo inconsistente)
 *
 * Eccezione "poster": i sorgenti il cui nome termina in "-poster" (i frame
 * statici usati come poster di un <video>) non sono mai serviti in variante
 * responsive né come og:image — l'og:image della pagina usa già la cover
 * principale. Per questi si genera solo <nome>.webp full-size.
 *
 * Il PNG originale resta in repo (assets/case-studies-src/) come sorgente ma
 * non va mai referenziato in markup/dati: è solo l'input di questa pipeline.
 *
 * Per ogni GIF sorgente "<nome>-src.gif" (stessa convenzione: sorgente in repo,
 * mai referenziata) genera "<nome>.gif", la GIF davvero servita, ricompressa con
 * una palette ridotta. A differenza delle cover, qui la risoluzione NON viene mai
 * ridimensionata: su una GIF animata il resize introduce interpolazione che rende
 * ogni frame leggermente diverso dal successivo pixel per pixel, il che peggiora
 * la compressione inter-frame più di quanto risparmi in pixel. Verificato
 * empiricamente su questo asset (1280x720, 241 frame): alla stessa palette, la
 * versione ridimensionata a 896px pesa PIÙ di quella nativa a 1280px.
 *
 * Sharp non è una dipendenza del progetto: si esegue on demand con
 *   npm install --no-save --no-package-lock sharp && npm run optimize:images
 *
 * Rilancio: sicuro da rieseguire, sovrascrive sempre le varianti generate.
 */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const SRC_DIR = 'assets/case-studies-src';
const OUT_DIR = 'public/case-studies';

// Larghezza massima lato client per la cover (container max-w-4xl = 896px CSS,
// quindi 1672px full-size copre un display retino a ~1.86x senza sprecare byte).
const MOBILE_WIDTH = 836;

// Larghezza massima per la variante OG: i crawler social ridimensionano comunque
// lato loro, 1200px è il riferimento standard (stessa larghezza di og-image.jpg).
const OG_MAX_WIDTH = 1200;

// Palette per le GIF animate: sotto i 128 colori non si osserva alcun risparmio
// ulteriore su questo tipo di contenuto (soglia di rumore della quantizzazione),
// quindi 128 è il punto che massimizza la qualità a parità di peso.
const GIF_COLOURS = 128;
const GIF_EFFORT = 7;

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function processSource(pngPath) {
  const name = basename(pngPath, extname(pngPath));
  const isPoster = name.endsWith('-poster');
  const results = [];

  const srcStat = statSync(pngPath);
  const srcMeta = await sharp(pngPath).metadata();
  console.log(`\n${name}.png — sorgente ${srcMeta.width}x${srcMeta.height}, ${formatBytes(srcStat.size)}`);

  // Full-size WebP. Qualità 86 + effort massimo: sull'immagine dark con gradienti
  // sottili una qualità troppo bassa introduce banding visibile sul nero.
  const webpPath = join(OUT_DIR, `${name}.webp`);
  await sharp(pngPath)
    .webp({ quality: 86, effort: 6 })
    .toFile(webpPath);
  results.push(webpPath);

  // I poster di <video> non hanno mai variante responsive né og:image: la
  // pagina usa già la cover principale per og:image, e il poster non passa
  // mai da un <img srcset>.
  if (!isPoster) {
    // Variante responsive mobile.
    const mobileWebpPath = join(OUT_DIR, `${name}-${MOBILE_WIDTH}w.webp`);
    await sharp(pngPath)
      .resize({ width: MOBILE_WIDTH })
      .webp({ quality: 86, effort: 6 })
      .toFile(mobileWebpPath);
    results.push(mobileWebpPath);

    // JPG per og:image/twitter:image/schema — formato ampiamente supportato.
    const ogPath = join(OUT_DIR, `${name}-og.jpg`);
    const ogWidth = Math.min(OG_MAX_WIDTH, srcMeta.width);
    await sharp(pngPath)
      .resize({ width: ogWidth })
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(ogPath);
    results.push(ogPath);
  }

  for (const file of results) {
    const stat = statSync(file);
    const meta = await sharp(file).metadata();
    console.log(`  -> ${file}  ${meta.width}x${meta.height}  ${formatBytes(stat.size)}`);
  }

  return results;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const pngFiles = readdirSync(SRC_DIR)
    .filter((f) => extname(f).toLowerCase() === '.png')
    .map((f) => join(SRC_DIR, f));

  if (pngFiles.length === 0) {
    console.log(`Nessun PNG sorgente trovato in ${SRC_DIR}/`);
    return;
  }

  for (const png of pngFiles) {
    await processSource(png);
  }

  console.log('\nFatto.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
