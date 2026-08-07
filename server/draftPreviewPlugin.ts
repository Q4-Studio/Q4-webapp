import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import type { Plugin } from 'vite';

const PREVIEW_ROOT = '/__draft-preview';
const COOKIE_NAME = '__Host-q4_blog_preview';
const SESSION_TTL_SECONDS = 30 * 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_FAILURES = 5;
const MAX_BODY_BYTES = 4 * 1024;

interface DraftListPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  updated_at: string;
}

interface DraftPost extends DraftListPost {
  content: string;
  cover_image: string;
  read_time: string;
  author_name: string;
}

interface PreviewConfig {
  previewOrigin: string;
  previewHost: string;
  supabaseUrl: string;
  supabaseSecretKey: string;
  previewKey: string;
  sessionSecret: string;
}

interface RateLimitEntry {
  failures: number;
  resetAt: number;
}

class RequestBodyTooLargeError extends Error {
  constructor() {
    super('request-body-too-large');
    this.name = 'RequestBodyTooLargeError';
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeImageUrl(value: string): string | null {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function renderInlineMarkdown(value: string): string {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const decodedHref = href.replace(/&amp;/g, '&');
    const isLocalPath = decodedHref.startsWith('/') && !decodedHref.startsWith('//');
    if (!isLocalPath && !decodedHref.startsWith('https://')) return label;
    return `<a href="${escapeHtml(decodedHref)}" rel="noreferrer">${label}</a>`;
  });
  return html;
}

function renderMarkdown(content: string): string {
  const output: string[] = [];
  let listType: 'ol' | 'ul' | null = null;

  const closeList = () => {
    if (listType) output.push(`</${listType}>`);
    listType = null;
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    const unordered = line.match(/^[-*]\s+(.+)$/);

    if (ordered || unordered) {
      const nextType = ordered ? 'ol' : 'ul';
      const item = ordered?.[1] ?? unordered?.[1];
      if (!item) continue;
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        output.push(`<${nextType}>`);
      }
      output.push(`<li>${renderInlineMarkdown(item)}</li>`);
      continue;
    }

    closeList();
    if (!line) continue;
    if (line.startsWith('### ')) output.push(`<h3>${renderInlineMarkdown(line.slice(4))}</h3>`);
    else if (line.startsWith('## ')) output.push(`<h2>${renderInlineMarkdown(line.slice(3))}</h2>`);
    else if (line.startsWith('# ')) output.push(`<h1>${renderInlineMarkdown(line.slice(2))}</h1>`);
    else if (line.startsWith('> ')) output.push(`<blockquote>${renderInlineMarkdown(line.slice(2))}</blockquote>`);
    else output.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }
  closeList();
  return output.join('\n');
}

function secureEqual(left: string, right: string): boolean {
  const leftDigest = createHash('sha256').update(left).digest();
  const rightDigest = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function signSession(expiresAt: number, secret: string): string {
  const payload = `${expiresAt}.${randomBytes(18).toString('base64url')}`;
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function isValidSession(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const expiresAtRaw = parts[0];
  const nonce = parts[1];
  const suppliedSignature = parts[2];
  if (!expiresAtRaw || !nonce || !suppliedSignature) return false;
  if (!/^\d+$/.test(expiresAtRaw) || !/^[A-Za-z0-9_-]+$/.test(nonce)) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;
  const payload = `${expiresAtRaw}.${nonce}`;
  const expectedSignature = createHmac('sha256', secret).update(payload).digest('base64url');
  return secureEqual(suppliedSignature, expectedSignature);
}

function parseCookies(header: string | undefined): Record<string, string> {
  return Object.fromEntries(
    (header || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([name, value]) => Boolean(name && value))
      .map(([name, ...value]) => [name, value.join('=')])
  );
}

function securityHeaders(response: ServerResponse): void {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; img-src 'self' https: data:; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
  );
}

function sendHtml(response: ServerResponse, status: number, body: string): void {
  securityHeaders(response);
  response.statusCode = status;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(body);
}

function sendRedirect(response: ServerResponse, location: string): void {
  securityHeaders(response);
  response.statusCode = 303;
  response.setHeader('Location', location);
  response.end();
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet"><title>${escapeHtml(title)}</title>
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#050505;color:#f5f5f5}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 50% 0,#202052 0,transparent 36rem),#050505;min-height:100vh}main{width:min(840px,calc(100% - 32px));margin:auto;padding:56px 0 96px}a{color:#b9b9ff}nav{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:48px}.brand{font-weight:800;color:white;text-decoration:none;letter-spacing:.04em}.muted,small{color:#aaa}.panel,.card{border:1px solid #292929;background:rgba(17,17,17,.88);border-radius:18px;padding:24px}.card{display:block;color:inherit;text-decoration:none;margin:14px 0}.card:hover{border-color:#6767d8}h1{font-size:clamp(2rem,7vw,4rem);line-height:1.04}h2{font-size:1.8rem;margin-top:2.2em}h3{font-size:1.35rem;margin-top:1.8em}p,li{color:#d0d0d0;font-size:1.08rem;line-height:1.75}blockquote{border-left:3px solid #7777ef;margin-left:0;padding-left:20px;color:#ddd}code{background:#1d1d1d;border-radius:5px;padding:.12em .35em}img.cover{display:block;width:100%;max-height:440px;object-fit:cover;border-radius:18px;margin:28px 0}input{width:100%;font:inherit;color:white;background:#0d0d0d;border:1px solid #333;border-radius:10px;padding:13px}button{font:inherit;font-weight:700;color:#111;background:white;border:0;border-radius:999px;padding:12px 22px;cursor:pointer}form{display:grid;gap:14px}.meta{display:flex;gap:10px;flex-wrap:wrap;color:#aaa}.error{color:#ffb4b4}.badge{display:inline-block;color:#c8c8ff;background:#24244a;padding:5px 10px;border-radius:999px;font-size:.82rem}
</style></head><body><main>${body}</main></body></html>`;
}

function loginPage(errorMessage = ''): string {
  return layout('Anteprima bozze · Q4 Studio', `
    <nav><span class="brand">Q4 STUDIO</span><span class="badge">DEV ONLY</span></nav>
    <section class="panel"><h1>Anteprima bozze</h1><p class="muted">Accesso temporaneo in sola lettura.</p>
    ${errorMessage ? `<p class="error" role="alert">${escapeHtml(errorMessage)}</p>` : ''}
    <form method="post" action="${PREVIEW_ROOT}/login">
      <label for="key">Chiave di anteprima</label><input id="key" name="key" type="password" required autocomplete="current-password">
      <div><button type="submit">Accedi</button></div>
    </form></section>`);
}

function listPage(posts: DraftListPost[]): string {
  const cards = posts.length
    ? posts.map((post) => `<a class="card" href="${PREVIEW_ROOT}/post/${encodeURIComponent(post.slug)}"><span class="badge">BOZZA</span><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.excerpt)}</p><small>${escapeHtml(post.category)} · ${escapeHtml(post.date)} · aggiornato ${escapeHtml(post.updated_at)}</small></a>`).join('')
    : '<section class="panel"><p>Nessuna bozza disponibile.</p></section>';
  return layout('Bozze · Q4 Studio', `<nav><a class="brand" href="${PREVIEW_ROOT}/">Q4 STUDIO</a><form method="post" action="${PREVIEW_ROOT}/logout"><button type="submit">Esci</button></form></nav><h1>Bozze non pubblicate</h1><p class="muted">Vista strettamente in sola lettura. Creazione, modifiche e pubblicazione seguono il flusso controllato di Codex lato server.</p>${cards}`);
}

function detailPage(post: DraftPost): string {
  const cover = safeImageUrl(post.cover_image);
  return layout(`${post.title} · Bozza`, `<nav><a class="brand" href="${PREVIEW_ROOT}/">← Tutte le bozze</a><span class="badge">BOZZA · NOINDEX</span></nav><article><p class="meta"><span>${escapeHtml(post.category)}</span><span>·</span><span>${escapeHtml(post.date)}</span><span>·</span><span>${escapeHtml(post.read_time)}</span></p><h1>${escapeHtml(post.title)}</h1><p class="muted">${escapeHtml(post.excerpt)}</p>${cover ? `<img class="cover" src="${escapeHtml(cover)}" alt="">` : ''}<div>${renderMarkdown(post.content)}</div><hr><p class="muted">${escapeHtml(post.author_name)} · aggiornata ${escapeHtml(post.updated_at)}</p></article>`);
}

async function readFormBody(request: IncomingMessage): Promise<URLSearchParams> {
  return await new Promise((resolve, reject) => {
    const contentLength = request.headers['content-length'];
    if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_BODY_BYTES) {
      // Keep the connection reusable without retaining the oversized payload.
      request.once('error', () => undefined);
      request.resume();
      reject(new RequestBodyTooLargeError());
      return;
    }

    let settled = false;
    let receivedBytes = 0;
    const chunks: Buffer[] = [];

    const cleanup = () => {
      request.off('data', onData);
      request.off('end', onEnd);
      request.off('aborted', onAborted);
      request.off('error', onError);
    };
    const fail = (error: Error, drain = false) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (drain) {
        // `resume` discards future chunks inside Node's bounded stream buffers;
        // no more bytes are appended to our application-owned array.
        request.once('error', () => undefined);
        request.resume();
      }
      reject(error);
    };
    const onData = (chunk: Buffer) => {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      receivedBytes += buffer.length;
      if (receivedBytes > MAX_BODY_BYTES) {
        chunks.length = 0;
        fail(new RequestBodyTooLargeError(), true);
        return;
      }
      chunks.push(buffer);
    };
    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(new URLSearchParams(Buffer.concat(chunks, receivedBytes).toString('utf8')));
    };
    const onAborted = () => fail(new Error('request-aborted'));
    const onError = () => fail(new Error('request-stream-error'));

    request.on('data', onData);
    request.once('end', onEnd);
    request.once('aborted', onAborted);
    request.once('error', onError);
  });
}

function isLoopbackAddress(address: string | undefined): boolean {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function getRateLimitIdentity(request: IncomingMessage): string {
  const peerAddress = request.socket.remoteAddress;
  if (!isLoopbackAddress(peerAddress)) return `peer:${peerAddress || 'unknown'}`;

  // Tailscale Serve strips spoofed incoming identity headers and adds this one
  // for user-owned tailnet requests. Trust it only across the loopback proxy
  // boundary. Tagged devices do not receive the header and deliberately share
  // the fallback bucket with direct local requests.
  const tailscaleLoginHeader = request.headers['tailscale-user-login'];
  const tailscaleLogin = Array.isArray(tailscaleLoginHeader)
    ? tailscaleLoginHeader[0]
    : tailscaleLoginHeader;
  if (!tailscaleLogin) return 'trusted-loopback-proxy:global';
  return `tailscale-user:${createHash('sha256').update(tailscaleLogin).digest('hex')}`;
}

function loadPreviewConfig(env: Record<string, string>): PreviewConfig | null {
  const previewHostValue = env.BLOG_PREVIEW_HOST;
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseSecretKey = env.SUPABASE_SECRET_KEY;
  const previewKey = env.BLOG_PREVIEW_KEY;
  const sessionSecret = env.BLOG_PREVIEW_SESSION_SECRET;
  if (!previewHostValue || !supabaseUrl || !supabaseSecretKey || !previewKey || !sessionSecret) return null;
  try {
    const previewUrl = new URL(previewHostValue);
    if (!['http:', 'https:'].includes(previewUrl.protocol) || previewUrl.pathname !== '/' || previewUrl.search || previewUrl.hash) return null;
    const isLoopback = previewUrl.hostname === 'localhost' || previewUrl.hostname === '127.0.0.1';
    if (previewUrl.protocol !== 'https:' && !isLoopback) return null;
    if (previewKey.length < 16 || sessionSecret.length < 32) return null;
    return { previewOrigin: previewUrl.origin, previewHost: previewUrl.host, supabaseUrl, supabaseSecretKey, previewKey, sessionSecret };
  } catch {
    return null;
  }
}

export function draftPreviewPlugin(env: Record<string, string>): Plugin {
  const config = loadPreviewConfig(env);
  const rateLimits = new Map<string, RateLimitEntry>();

  return {
    name: 'q4-draft-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url || '/', 'http://vite.internal');
        if (!requestUrl.pathname.startsWith(PREVIEW_ROOT)) return next();
        if (!config) return sendHtml(response, 503, layout('Anteprima non configurata', '<section class="panel"><h1>Anteprima non configurata</h1><p>Controlla le variabili locali richieste.</p></section>'));

        const host = request.headers.host || '';
        const origin = request.headers.origin;
        if (host !== config.previewHost || (origin && origin !== config.previewOrigin)) {
          return sendHtml(response, 403, layout('Accesso negato', '<section class="panel"><h1>Accesso negato</h1></section>'));
        }
        if (!['GET', 'HEAD', 'POST'].includes(request.method || '')) {
          response.setHeader('Allow', 'GET, HEAD, POST');
          return sendHtml(response, 405, layout('Metodo non consentito', '<section class="panel"><h1>Metodo non consentito</h1></section>'));
        }
        if (request.method === 'POST' && origin !== config.previewOrigin) {
          return sendHtml(response, 403, layout('Origine non valida', '<section class="panel"><h1>Origine non valida</h1></section>'));
        }

        const cookies = parseCookies(request.headers.cookie);
        const authenticated = isValidSession(cookies[COOKIE_NAME], config.sessionSecret);

        if (requestUrl.pathname === `${PREVIEW_ROOT}/login` && request.method === 'POST') {
          const rateLimitIdentity = getRateLimitIdentity(request);
          const now = Date.now();
          for (const [identity, entry] of rateLimits) {
            if (entry.resetAt <= now) rateLimits.delete(identity);
          }
          const current = rateLimits.get(rateLimitIdentity);
          const rate = !current || current.resetAt <= now ? { failures: 0, resetAt: now + RATE_LIMIT_WINDOW_MS } : current;
          if (rate.failures >= RATE_LIMIT_MAX_FAILURES) {
            response.setHeader('Retry-After', String(Math.ceil((rate.resetAt - now) / 1000)));
            return sendHtml(response, 429, loginPage('Troppi tentativi. Riprova più tardi.'));
          }
          try {
            if (!(request.headers['content-type'] || '').toLowerCase().startsWith('application/x-www-form-urlencoded')) {
              return sendHtml(response, 415, loginPage('Formato della richiesta non valido.'));
            }
            const form = await readFormBody(request);
            if (!secureEqual(form.get('key') || '', config.previewKey)) {
              rate.failures += 1;
              rateLimits.set(rateLimitIdentity, rate);
              return sendHtml(response, 401, loginPage('Chiave non valida.'));
            }
          } catch (error) {
            if (error instanceof RequestBodyTooLargeError) {
              return sendHtml(response, 413, loginPage('Richiesta troppo grande.'));
            }
            return sendHtml(response, 400, loginPage('Richiesta non valida.'));
          }
          rateLimits.delete(rateLimitIdentity);
          const session = signSession(Date.now() + SESSION_TTL_SECONDS * 1000, config.sessionSecret);
          response.setHeader('Set-Cookie', `${COOKIE_NAME}=${session}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Strict`);
          return sendRedirect(response, `${PREVIEW_ROOT}/`);
        }

        if (requestUrl.pathname === `${PREVIEW_ROOT}/logout` && request.method === 'POST') {
          response.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`);
          return sendRedirect(response, `${PREVIEW_ROOT}/`);
        }

        if (!authenticated) {
          if (request.method !== 'GET' && request.method !== 'HEAD') return sendHtml(response, 401, loginPage());
          return sendHtml(response, 401, loginPage());
        }

        const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        });
        if (requestUrl.pathname === `${PREVIEW_ROOT}/` && (request.method === 'GET' || request.method === 'HEAD')) {
          const listFields = 'slug,title,excerpt,category,date,updated_at';
          const { data, error } = await supabase.from('blog_posts').select(listFields).eq('published', false).order('updated_at', { ascending: false });
          if (error) return sendHtml(response, 502, layout('Errore anteprima', '<section class="panel"><h1>Bozze non disponibili</h1><p>Verifica la configurazione Supabase locale.</p></section>'));
          return sendHtml(response, 200, listPage((data || []) as DraftListPost[]));
        }

        const detailMatch = requestUrl.pathname.match(new RegExp(`^${PREVIEW_ROOT}/post/([^/]+)$`));
        if (detailMatch && (request.method === 'GET' || request.method === 'HEAD')) {
          const encodedSlug = detailMatch[1];
          if (!encodedSlug) return sendHtml(response, 400, layout('Slug non valido', '<section class="panel"><h1>Slug non valido</h1></section>'));
          let slug: string;
          try { slug = decodeURIComponent(encodedSlug); } catch { return sendHtml(response, 400, layout('Slug non valido', '<section class="panel"><h1>Slug non valido</h1></section>')); }
          const detailFields = 'slug,title,excerpt,content,cover_image,category,date,read_time,author_name,updated_at';
          const { data, error } = await supabase.from('blog_posts').select(detailFields).eq('published', false).eq('slug', slug).maybeSingle();
          if (error) return sendHtml(response, 502, layout('Errore anteprima', '<section class="panel"><h1>Bozza non disponibile</h1></section>'));
          if (!data) return sendHtml(response, 404, layout('Bozza non trovata', '<section class="panel"><h1>Bozza non trovata</h1></section>'));
          return sendHtml(response, 200, detailPage(data as DraftPost));
        }

        return sendHtml(response, 404, layout('Non trovato', '<section class="panel"><h1>Non trovato</h1></section>'));
      });
    },
  };
}
