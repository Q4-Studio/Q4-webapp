/* ------------------------------------------------------------------ */
/* Parser markdown degli articoli del blog (contenuto da Supabase).     */
/* Unico per components/BlogArticle.tsx (React) e scripts/prerender.ts  */
/* (mirror statico): stessi blocchi, stessi id dei titoli, stesse       */
/* regole sui link. Niente HTML grezzo: solo i costrutti qui sotto.     */
/* ------------------------------------------------------------------ */

export interface TocItem {
  id: string;
  level: 2 | 3;
  label: string;
}

export type ArticleBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string; id?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; blocks: ArticleBlock[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'code'; text: string }
  | { type: 'table'; header: string[]; rows: string[][] };

export const plainText = (value: string): string => value
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/`([^`]+)`/g, '$1')
  .trim();

export const headingSlug = (value: string): string => plainText(value)
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'sezione';

/** Link ammessi: path interni, ancore, https e mailto. Il resto diventa testo. */
export const safeLink = (href: string): { href: string; external: boolean } | null => {
  const value = href.trim();
  if ((value.startsWith('/') && !value.startsWith('//')) || /^#[a-z0-9][a-z0-9_-]*$/i.test(value)) {
    return { href: value, external: false };
  }
  if (value.startsWith('https://') || value.startsWith('mailto:')) {
    return { href: value, external: value.startsWith('https://') };
  }
  return null;
};

/** Immagini ammesse: path interni e https. */
const safeImage = (src: string): string | null => {
  const value = src.trim();
  return (value.startsWith('/') && !value.startsWith('//')) || value.startsWith('https://') ? value : null;
};

export type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string; external: boolean; code?: boolean };

/** Grassetto, codice e link inline. */
export const inlineTokens = (value: string): InlineToken[] => value
  .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  .filter(Boolean)
  .map((token): InlineToken => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) return { type: 'strong', text: token.slice(2, -2) };
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) return { type: 'code', text: token.slice(1, -1) };
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const destination = safeLink(link[2]);
      // [`ad_user_data`](url): testo del link in codice, senza i backtick.
      const code = /^`[^`]+`$/.test(link[1]);
      const text = code ? link[1].slice(1, -1) : link[1];
      return destination ? { type: 'link', text, ...destination, code } : { type: code ? 'code' : 'text', text };
    }
    return { type: 'text', text: token };
  });

const tableCells = (line: string): string[] => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
const isTableDivider = (line: string): boolean => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(line.trim());

const parseBlocks = (lines: string[], toc: TocItem[] | null, headingCounts: Map<string, number>): ArticleBlock[] => {
  const blocks: ArticleBlock[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  const flushList = () => {
    if (listItems.length) blocks.push({ type: 'list', ordered: listOrdered, items: listItems });
    listItems = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();

    // Blocco di codice recintato: tutto fino alla chiusura, testo letterale.
    if (line.startsWith('```')) {
      flushList();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }

    // Citazione: righe consecutive con ">", contenuto analizzato come blocchi.
    if (line.startsWith('>')) {
      flushList();
      const inner: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        inner.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: 'quote', blocks: parseBlocks(inner, null, headingCounts) });
      continue;
    }

    // Tabella: riga di intestazione seguita dalla riga di separazione.
    if (line.includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      flushList();
      const header = tableCells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().includes('|')) {
        rows.push(tableCells(lines[i]));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
    if (image) {
      flushList();
      const src = safeImage(image[2]);
      if (src) blocks.push({ type: 'image', alt: image[1], src });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length as 1 | 2 | 3;
      const text = heading[2];
      if ((level === 2 || level === 3) && toc) {
        const base = headingSlug(text);
        const occurrence = (headingCounts.get(base) || 0) + 1;
        headingCounts.set(base, occurrence);
        const id = occurrence === 1 ? base : `${base}-${occurrence}`;
        blocks.push({ type: 'heading', level, text, id });
        toc.push({ id, level, label: plainText(text) });
      } else {
        blocks.push({ type: 'heading', level, text });
      }
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    const unorderedItem = line.match(/^[-*]\s+(.+)$/);
    if (orderedItem || unorderedItem) {
      const ordered = Boolean(orderedItem);
      const item = (orderedItem || unorderedItem)?.[1];
      if (!item) continue;
      if (listItems.length && ordered !== listOrdered) flushList();
      listOrdered = ordered;
      listItems.push(item);
      continue;
    }

    flushList();
    if (line) blocks.push({ type: 'paragraph', text: line });
  }

  flushList();
  return blocks;
};

/** Blocchi dell'articolo e indice dei titoli h2/h3 (con id univoci). */
export const parseArticle = (content: string): { blocks: ArticleBlock[]; toc: TocItem[] } => {
  const toc: TocItem[] = [];
  const blocks = parseBlocks(content.trim().split(/\r?\n/), toc, new Map());
  return { blocks, toc };
};
