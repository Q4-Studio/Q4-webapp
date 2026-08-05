import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const containerId = 'GTM-TS9PFGLR';

const findIndexFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findIndexFiles(path);
    return entry.name === 'index.html' ? [path] : [];
  });

const count = (text, needle) => text.split(needle).length - 1;
const failures = [];
const files = findIndexFiles(distDir);

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const headStart = html.indexOf('<head>');
  const headEnd = html.indexOf('</head>');
  const bodyStart = html.indexOf('<body>');

  if (headStart === -1 || headEnd === -1 || headEnd <= headStart) {
    failures.push(`${file}: missing or malformed <head>`);
    continue;
  }
  if (bodyStart === -1) {
    failures.push(`${file}: missing <body>`);
    continue;
  }

  const head = html.slice(headStart, headEnd);
  const body = html.slice(bodyStart);
  const noscriptImmediatelyAfterBody = new RegExp(
    `<body>\\s*<!-- Google Tag Manager \\(noscript\\) -->\\s*<noscript><iframe src="https://www\\.googletagmanager\\.com/ns\\.html\\?id=${containerId}"`
  ).test(body);

  if (count(head, 'https://www.googletagmanager.com/gtm.js?id=') !== 1) {
    failures.push(`${file}: expected exactly one GTM head loader`);
  }
  if (count(head, containerId) !== 1) {
    failures.push(`${file}: expected the GTM container exactly once in <head>`);
  }
  if (count(body, `https://www.googletagmanager.com/ns.html?id=${containerId}`) !== 1) {
    failures.push(`${file}: expected exactly one GTM noscript iframe`);
  }
  if (!noscriptImmediatelyAfterBody) {
    failures.push(`${file}: expected the GTM noscript block immediately after <body>`);
  }
}

if (files.length === 0) failures.push('No dist/**/index.html files found');

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified GTM coverage in ${files.length} generated HTML files.`);
