#!/usr/bin/env bash
# Aggiorna la cover dei due articoli su Supabase alle illustrazioni servite da
# public/blog/. Da lanciare DOPO il deploy in produzione della PR #68, altrimenti
# il blog live mostra cover rotte (l'URL è assoluto su www.q4.studio).
#   set -a && . ./.env.local && set +a && bash scripts/blog-cover-swap.sh
set -euo pipefail
U=$(grep -E "^VITE_SUPABASE_URL=" .env.local | cut -d= -f2-)
patch() {
  curl -s -X PATCH "$U/rest/v1/blog_posts?slug=eq.$1" \
    -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=representation" \
    -d "{\"cover_image\":\"https://www.q4.studio/blog/$2.jpg\"}"
  echo
}
patch server-side-tagging-pmi server-side-tagging-pmi
patch perche-google-ads-non-traccia-tutte-le-conversioni google-ads-conversioni
