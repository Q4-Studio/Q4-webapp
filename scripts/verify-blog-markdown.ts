// Controllo rapido del parser markdown del blog (lib/blogMarkdown.ts) sulle
// tabelle: un `---` nudo non è una divisoria e un paragrafo con `|` dopo la
// tabella non ne diventa una riga. Gira in `npm run build`.
import { parseArticle } from '../lib/blogMarkdown.ts';
import assert from 'node:assert/strict';
const types = (md: string) => parseArticle(md).blocks.map((b) => b.type);
// 1. '---' nudo sotto una riga con '|': niente tabella
assert.deepEqual(types('Prezzo | durata\n---\nTesto'), ['paragraph', 'paragraph', 'paragraph']);
// 2. tabella normale
const t = parseArticle('| A | B |\n| --- | :-: |\n| 1 | 2 |\n| 3 | 4 |').blocks[0];
assert.equal(t.type, 'table'); assert.deepEqual((t as any).rows, [['1', '2'], ['3', '4']]);
// 3. paragrafo con '|' dopo la tabella: non è una riga
assert.deepEqual(types('| A | B |\n|---|---|\n| 1 | 2 |\nPiano base | piano pro a confronto'), ['table', 'paragraph']);
// 4. tabella senza pipe iniziale: righe con lo stesso numero di celle
const t2 = parseArticle('A | B\n--- | ---\n1 | 2\nfrase con | due | pipe').blocks;
assert.equal(t2[0].type, 'table'); assert.equal((t2[0] as any).rows.length, 1); assert.equal(t2[1].type, 'paragraph');
// 5. divisoria senza trattini
assert.deepEqual(types('A | B\n| : |'), ['paragraph', 'paragraph']);
console.log('blogMarkdown: ok');
