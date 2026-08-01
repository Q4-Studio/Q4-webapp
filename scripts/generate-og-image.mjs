/**
 * Genera public/og-image.jpg (1200x630), l'anteprima social del sito.
 * Sharp non è una dipendenza del progetto: si esegue on demand con
 *   npm install --no-save --no-package-lock sharp && node scripts/generate-og-image.mjs
 * Da rilanciare solo se cambia il posizionamento in headline.
 */
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.28" r="0.6">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="55%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#050505"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Ghost "Q4" come nell'hero del sito -->
  <text x="1135" y="545" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="390"
        font-weight="700" fill="none" stroke="#818cf8" stroke-opacity="0.10" stroke-width="2">Q4</text>

  <!-- Wordmark -->
  <text x="80" y="112" font-family="Segoe UI, Arial, sans-serif" font-size="24" letter-spacing="9"
        fill="#ffffff" font-weight="600">Q4 STUDIO</text>
  <rect x="80" y="132" width="64" height="2" fill="url(#bar)"/>

  <!-- Headline -->
  <text x="80" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="#ffffff">Il tuo AI</text>
  <text x="80" y="392" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="url(#grad)">Marketing Partner.</text>

  <!-- Subline -->
  <text x="80" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="#9ca3af">Agenti AI, automazioni e tecnologia</text>
  <text x="80" y="510" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="#9ca3af">applicata al marketing delle PMI italiane.</text>

  <!-- Footer -->
  <text x="80" y="576" font-family="Segoe UI, Arial, sans-serif" font-size="19" letter-spacing="4" fill="#6b7280">REGGIO EMILIA</text>
  <text x="1120" y="576" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="19" letter-spacing="4" fill="#818cf8">q4.studio</text>

  <rect x="0" y="0" width="1200" height="4" fill="url(#bar)"/>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile('public/og-image.jpg');

const m = await sharp('public/og-image.jpg').metadata();
console.log('OK', m.width + 'x' + m.height, m.size + ' bytes');
