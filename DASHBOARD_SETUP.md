# Dashboard Setup Guide

Guida completa per configurare il sistema di gestione blog Q4 Studio.

---

## Indice

1. [Configurazione Supabase Auth](#configurazione-supabase-auth)
2. [Creazione Utenti Collaboratori](#creazione-utenti-collaboratori)
3. [Test del Sistema](#test-del-sistema)
4. [Troubleshooting](#troubleshooting)

---

## Configurazione Supabase Auth

### Step 1: Abilita Email Provider

1. **Accedi al Dashboard Supabase**
   - Vai su [https://app.supabase.com](https://app.supabase.com)
   - Seleziona il tuo progetto Q4 Studio

2. **Naviga in Authentication**
   - Sidebar → Authentication → Providers

3. **Configura Email Provider**
   - Trova "Email" nella lista dei provider
   - Click su "Email" per espandere
   - **Abilita** il provider
   - **Importante**: Disabilita "Confirm email" per testing
     - Questo permette login immediato senza conferma email
     - Puoi riabilitarlo in produzione se necessario

4. **Salva le modifiche**
   - Click "Save"

### Step 2: Verifica RLS Policies

Le policies sono già configurate tramite `supabase-schema.sql`, ma verifica:

1. **Naviga in Database**
   - Sidebar → Database → Tables
   - Seleziona tabella `blog_posts`

2. **Controlla Policies**
   - Tab "Policies"
   - Dovresti vedere:
     - ✅ "Allow public read access to published posts"
     - ✅ "Allow authenticated users full access"

3. **Se mancano, esegui di nuovo lo script**
   ```sql
   -- In SQL Editor
   -- Copia e incolla da supabase-schema.sql le parti delle policies
   ```

---

## Creazione Utenti Collaboratori

### Metodo 1: Invite User (Consigliato)

1. **Naviga in Authentication**
   - Sidebar → Authentication → Users

2. **Invita nuovo utente**
   - Click pulsante "Invite user"
   - Inserisci **email** del collaboratore
   - Lascia vuoto il campo password (verrà generata temporanea)

3. **L'utente riceve email**
   - Il collaboratore riceve email di invito
   - Click sul link nell'email
   - Setta la propria password
   - Login completato!

### Metodo 2: Add User Manualmente

1. **Naviga in Authentication**
   - Sidebar → Authentication → Users

2. **Aggiungi utente**
   - Click pulsante "Add user" → "Create new user"
   - Inserisci **email**: `collaboratore@esempio.com`
   - Inserisci **password temporanea**: `TempPassword123!`
   - **Deseleziona** "Auto Confirm User" (se presente)

3. **Invia credenziali**
   - Comunica email e password al collaboratore
   - Es. via chat privata o email cifrata

4. **Primo login collaboratore**
   - Visita `yoursite.com/#dashq4login`
   - Login con credenziali fornite
   - Suggerisci di cambiare password nelle impostazioni

### Utenti Suggeriti

Per il team Q4 Studio:

```
1. Nicolò Pozzato
   Email: nicolo@q4studio.com

2. Sebastiano Zanardo
   Email: sebastiano@q4studio.com

3. Lorenzo Bianchi
   Email: lorenzo@q4studio.com
```

---

## Test del Sistema

### Test 1: Login Flow

1. **Apri una finestra in incognito**
   - Questo simula un utente non autenticato

2. **Visita la pagina di login**
   ```
   http://localhost:5173/#dashq4login
   ```
   (In produzione: `yoursite.com/#dashq4login`)

3. **Prova login con credenziali errate**
   - Email: `wrong@email.com`
   - Password: `wrongpassword`
   - **Risultato atteso**: Messaggio errore "Credenziali non valide"

4. **Login con credenziali corrette**
   - Email: `collaboratore@esempio.com`
   - Password: `TempPassword123!`
   - **Risultato atteso**:
     - Redirect automatico a `/#dashboard`
     - Visualizzazione lista articoli

### Test 2: Creazione Articolo

1. **Dalla dashboard, click "Nuovo Articolo"**

2. **Compila il form**
   ```
   Titolo: Test Articolo Dashboard
   Categoria: Meta Advertising
   Estratto: Questo è un articolo di test
   Contenuto:
   # Titolo Test

   Questo è il contenuto dell'articolo in **markdown**.

   ## Sezione 2

   Altro testo qui.

   Cover Image URL: https://images.unsplash.com/photo-1516321318423-f06f85e504b3
   Tempo lettura: 3 min
   Autore: Nicolò Pozzato
   ```

3. **Click "Anteprima"**
   - Verifica rendering markdown corretto
   - Verifica immagine cover visibile

4. **Click "Salva"**
   - **Risultato atteso**:
     - Redirect a lista articoli
     - Nuovo articolo visibile nella lista

5. **Verifica sul blog pubblico**
   - Vai su `/#blog`
   - L'articolo dovrebbe apparire nella grid

### Test 3: Modifica Articolo

1. **Dalla dashboard, click "Modifica" su un articolo**

2. **Cambia il titolo**
   - Es: "Test Articolo Dashboard MODIFICATO"

3. **Click "Salva"**
   - **Risultato atteso**: Titolo aggiornato in lista

4. **Verifica sul blog pubblico**
   - Vai su `/#blog`
   - Verifica che il titolo sia aggiornato

### Test 4: Eliminazione Articolo

1. **Dalla dashboard, click "Elimina" sull'articolo di test**

2. **Conferma eliminazione**
   - Appare dialog di conferma
   - Click "OK"

3. **Verifica**
   - **Risultato atteso**: Articolo rimosso dalla lista

### Test 5: Persistenza Session

1. **Dopo login, chiudi il browser**

2. **Riapri browser e vai su `/#dashboard`**
   - **Risultato atteso**: Ancora autenticato, no redirect a login

3. **Click "Esci"**
   - **Risultato atteso**: Redirect a `/#dashq4login`

4. **Prova ad accedere a `/#dashboard` senza login**
   - **Risultato atteso**: Redirect automatico a `/#dashq4login`

---

## Troubleshooting

### Problema: "Credenziali non valide" con password corretta

**Cause possibili**:
1. Email non confermata
2. Utente non esistente in Supabase

**Soluzione**:
```
1. Dashboard Supabase → Authentication → Users
2. Trova l'utente nella lista
3. Verifica che "Email Confirmed" sia true
4. Se false, click sui 3 puntini → "Confirm email"
```

### Problema: "Forbidden use of secret API key in browser"

**Causa**: Stai usando `service_role` key invece di `anon` key

**Soluzione**:
```
1. Apri .env.local
2. Verifica che VITE_SUPABASE_ANON_KEY inizi con "eyJ..."
3. NON deve iniziare con "sb_secret_..."
4. Se necessario, copia la chiave corretta da:
   Dashboard Supabase → Settings → API → "anon public" key
```

### Problema: Non riesco a salvare articoli

**Causa possibile**: RLS policies non configurate

**Soluzione**:
```sql
-- SQL Editor su Supabase
-- Esegui queste policies:

CREATE POLICY "Allow authenticated users full access"
  ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');
```

### Problema: Immagine cover non si vede

**Cause possibili**:
1. URL immagine errato
2. CORS non configurato
3. Immagine richiede autenticazione

**Soluzione**:
```
1. Usa servizi pubblici come:
   - Unsplash: https://unsplash.com
   - Pexels: https://pexels.com

2. Assicurati che l'URL sia diretto all'immagine:
   ✅ https://images.unsplash.com/photo-xxx.jpg
   ❌ https://unsplash.com/photos/xxx
```

### Problema: Articolo salvato ma non appare sul blog pubblico

**Causa**: Campo `published` è false

**Soluzione temporanea**:
```sql
-- SQL Editor su Supabase
UPDATE blog_posts
SET published = true
WHERE slug = 'slug-articolo';
```

**Soluzione permanente**:
- Implementare toggle published/draft nel DashboardEditor
- Per ora tutti gli articoli sono pubblicati di default

### Problema: Session scade troppo velocemente

**Soluzione**:
```
1. Dashboard Supabase → Authentication → Settings
2. JWT Expiry: Imposta a 604800 (7 giorni)
3. Refresh Token Lifetime: 2592000 (30 giorni)
4. Save changes
```

### Problema: Collaboratore non riceve email di invito

**Soluzioni**:
```
1. Controlla spam/promozioni
2. Verifica SMTP configurato su Supabase
3. Usa "Add user" con password manuale come alternativa
```

---

## Prossimi Passi

Dopo aver configurato tutto:

1. ✅ Crea account per tutti i collaboratori
2. ✅ Testa login e creazione articolo per ogni account
3. ✅ Crea 2-3 articoli di test
4. ✅ Verifica che appaiano sul blog pubblico
5. ✅ Condividi la route `/#dashq4login` con il team
6. 🎉 Sistema pronto per uso produzione!

---

## Note di Sicurezza

- ⚠️ **NON condividere** la route `/#dashq4login` pubblicamente
- ⚠️ Usa password forti per gli account collaboratori
- ⚠️ Monitora regolarmente gli accessi in Supabase → Authentication → Users
- ⚠️ In produzione, considera di abilitare "Confirm email"
- ⚠️ Backup regolari del database (Supabase li fa automaticamente)

---

Per supporto tecnico, consulta [ARCHITECTURE.md](./ARCHITECTURE.md) o contatta il team dev.
