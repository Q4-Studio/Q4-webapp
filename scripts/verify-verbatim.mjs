// Confronto verbatim tra il copy hard-coded nei componenti React interessati
// dalla code review (Hero2, HomeSeoContent, AIAgents) e il testo effettivamente
// emesso dal prerender in dist/. Non è un tool generico di diffing HTML: cerca,
// per ciascuna stringa attesa, la sua presenza letterale (dopo normalizzazione
// whitespace) nel file dist corrispondente e segnala ogni assenza.
import { readFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

function decodeEntities(s) {
  return s
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function norm(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ');
}

let failures = 0;
let checks = 0;

function check(label, haystack, needle) {
  checks++;
  const h = norm(decodeEntities(stripTags(haystack)));
  const n = norm(needle);
  if (!h.includes(n)) {
    failures++;
    console.log(`❌ MISMATCH [${label}]\n   atteso: "${n}"\n`);
  } else {
    console.log(`✅ ${label}`);
  }
}

// ---------------------------------------------------------------------------
// Home (Hero2.tsx + HomeSeoContent.tsx) -> dist/index.html
// ---------------------------------------------------------------------------
const home = readFileSync(join(distDir, 'index.html'), 'utf-8');

check('Hero2 kicker', home, 'Bring AI&Tech to Marketing');
check('Hero2 h1 (line 1)', home, 'Il tuo AI');
check('Hero2 h1 (line 2)', home, 'Marketing Partner.');
check(
  'Hero2 subtitle',
  home,
  'Lo studio di consulenza che porta AI e le ultime tecnologie nel tuo marketing.'
);

check('HomeSeoContent h2 Metodo', home, 'Consulenza B2B Lead Generation su Meta');
check(
  'HomeSeoContent para 1',
  home,
  "La B2B Lead Generation su Meta è un sistema di acquisizione contatti pensato per trasformare Facebook e Instagram in canali di crescita misurabile anche per aziende con cicli di vendita complessi. Il nostro ruolo non è comportarci da agenzia che esegue campagne a volume, ma da consulenti che affiancano marketing e sales nella costruzione di un funnel più leggibile, tracciabile e sostenibile."
);
check(
  'HomeSeoContent para 2',
  home,
  "Partiamo dall'analisi del processo commerciale: chi è il cliente giusto, proposta di valore, segmentazione, creatività, domande qualificanti, instradamento al CRM e tempi di risposta ai contatti. Poi traduciamo questa diagnosi in una struttura Meta Ads che ottimizza per qualità del contatto e probabilità di diventare cliente, non solo per costo per contatto."
);
check('HomeSeoContent card 1 title', home, 'Diagnosi prima delle campagne');
check(
  'HomeSeoContent card 1 body',
  home,
  'Audit di funnel, audience, offerta e gestione lead prima di aumentare budget o test creativi.'
);
check('HomeSeoContent card 2 title', home, 'Sistema, non singola ads');
check(
  'HomeSeoContent card 2 body',
  home,
  'Campagne, CRM e follow-up vengono progettati insieme per ridurre dispersione e tempi morti.'
);
check('HomeSeoContent card 3 title', home, 'Governance dei KPI');
check(
  'HomeSeoContent card 3 body',
  home,
  'Misuriamo contatti che diventano davvero clienti, appuntamenti e opportunità generate, non solo il costo per contatto e numeri di facciata.'
);
check('HomeSeoContent Focus consulenziale label', home, 'Focus consulenziale');
check('HomeSeoContent Focus item 1', home, "Audit e priorità operative prima dell'execution.");
check(
  'HomeSeoContent Focus item 2',
  home,
  'Affiancamento a marketing e sales nella lettura dei dati.'
);
check(
  'HomeSeoContent Focus item 3',
  home,
  'Documentazione di naming, eventi e criteri di qualificazione.'
);

// ---------------------------------------------------------------------------
// AIAgents.tsx -> dist/agenti-ai/index.html
// ---------------------------------------------------------------------------
const agents = readFileSync(join(distDir, 'agenti-ai', 'index.html'), 'utf-8');

const useCases = [
  {
    tab: 'Ordini',
    title: 'Gli ordini arrivano da WhatsApp ed email. Entrano nel gestionale da soli.',
    today:
      'Oggi qualcuno legge il messaggio, cerca il cliente, controlla i codici, riscrive tutto nel gestionale. Dieci minuti a ordine, errori di battitura inclusi.',
    withAgent: [
      'Legge messaggi, email e allegati appena arrivano',
      'Riconosce cliente, codici, quantità e date di consegna',
      "Crea la bozza d'ordine nel gestionale con i prezzi corretti",
      'Chiede conferma a una persona solo quando serve',
    ],
    impact: 'Da 10 minuti a 40 secondi per ordine',
  },
  {
    tab: 'Preventivi',
    title: 'Il preventivo parte in giornata, mentre il cliente è ancora interessato.',
    today:
      'Oggi la richiesta resta in inbox finché il titolare o il tecnico non ha mezzora libera. Intanto il cliente chiede anche ai concorrenti.',
    withAgent: [
      'Estrae le specifiche dalla richiesta e dagli allegati',
      'Recupera listini, distinte e offerte simili già fatte',
      "Compila l'offerta sul tuo template, con i tuoi margini",
      'Una persona revisiona e invia: il lavoro noioso è già fatto',
    ],
    impact: 'Risposta al cliente in giornata',
  },
  {
    tab: 'Lead e vendite',
    title: 'Ogni contatto viene qualificato e richiamato mentre è ancora caldo.',
    today:
      'Oggi i lead delle campagne finiscono in un foglio o in una casella email. Chi può li richiama "appena ha un attimo". Spesso troppo tardi.',
    withAgent: [
      'Riceve il lead da form, campagne o LinkedIn',
      "Arricchisce i dati dell'azienda e applica i tuoi criteri di priorità",
      'Lo assegna al commerciale giusto nel CRM, con il contesto già pronto',
      'Prepara il primo messaggio e i promemoria di follow-up',
    ],
    impact: 'Primo contatto in minuti: il tasso di risposta cambia',
  },
  {
    tab: 'Assistenza clienti',
    title: "«Dov'è il mio ordine?» riceve risposta subito, anche alle 21.",
    today:
      'Oggi le stesse dieci domande (stato ordine, tempi, documenti, resi) interrompono il team decine di volte al giorno.',
    withAgent: [
      'Risponde su WhatsApp ed email alle domande ricorrenti',
      'Controlla lo stato reale di ordini e spedizioni nel gestionale',
      'Gestisce il primo livello e passa i casi delicati a una persona',
      'Tiene traccia di tutto: nessuna richiesta si perde',
    ],
    impact: 'Clienti seguiti 24/7, team interrotto molto meno',
  },
  {
    tab: 'Amministrazione',
    title: 'Fatture, DDT e documenti letti, controllati e registrati.',
    today:
      'Oggi i documenti dei fornitori arrivano via email e qualcuno li ricopia a mano, riga per riga, sperando di non sbagliare un importo.',
    withAgent: [
      'Legge fatture, DDT e conferme appena arrivano',
      'Controlla che importi e quantità tornino con gli ordini',
      'Prepara le registrazioni nel gestionale',
      'Segnala solo le anomalie da verificare',
    ],
    impact: 'Meno ore di data entry, meno errori a fine mese',
  },
  {
    tab: 'Report e controllo',
    title: 'Il lunedì mattina trovi il report già pronto, con i numeri che contano.',
    today:
      "Oggi capire come sta andando l'azienda richiede una caccia al tesoro tra gestionale, CRM, fogli Excel ed estratti banca.",
    withAgent: [
      'Raccoglie i dati da gestionale, CRM e fogli condivisi',
      'Calcola i tuoi indicatori: vendite, margini, consegne, incassi',
      'Prepara un report leggibile, sempre uguale, sempre puntuale',
      'Evidenzia gli scostamenti che meritano una decisione',
    ],
    impact: 'Decisioni prese su numeri aggiornati',
  },
];

for (const uc of useCases) {
  check(`AIAgents useCase[${uc.tab}] title`, agents, uc.title);
  check(`AIAgents useCase[${uc.tab}] today`, agents, uc.today);
  uc.withAgent.forEach((step, i) =>
    check(`AIAgents useCase[${uc.tab}] withAgent[${i}]`, agents, step)
  );
  check(`AIAgents useCase[${uc.tab}] impact`, agents, uc.impact);
}

const aiAgentsFaqs = [
  [
    'Quanto costa un agente AI?',
    "Dipende dal processo e dai sistemi da collegare. Per questo il percorso parte dalla mappatura: prima di investire sai esattamente quanto costa il progetto pilota e quante ore di lavoro può restituirti. Niente canoni a sorpresa, niente preventivi al buio.",
  ],
  [
    'In quanto tempo vedo i primi risultati?',
    'Il primo agente lavora su un processo reale entro 6–8 settimane dal via. Non partiamo mai da un progetto enorme: partiamo da un processo solo, misurabile, e allarghiamo solo quando funziona.',
  ],
  [
    "E se l'agente sbaglia?",
    "Dove conta, l'agente propone e una persona conferma: definiamo insieme cosa può fare in autonomia e cosa deve passare da un controllo umano. Ogni azione resta tracciata, quindi puoi sempre verificare cosa ha fatto e perché.",
  ],
  [
    'I dati della mia azienda dove finiscono?',
    'Restano nei tuoi sistemi: gestionale, CRM ed email rimangono la fonte dei dati. Definiamo permessi e accessi prima di partire e lavoriamo in conformità al GDPR. Nessun dato viene usato per addestrare modelli pubblici.',
  ],
  [
    'Il mio team non è tecnico. Ce la facciamo?',
    "Sì, ed è il punto: il team continua a usare WhatsApp, email e gestionale come sempre, perché è l'agente che si adatta ai vostri strumenti. La formazione la facciamo noi, sul vostro caso concreto.",
  ],
  [
    'È un chatbot?',
    "No. Un chatbot risponde a domande. Un agente lavora: legge documenti, aggiorna il gestionale, prepara ordini e preventivi, passa la palla a una persona quando serve. La chat è solo uno dei canali da cui riceve il lavoro.",
  ],
];

for (const [q, a] of aiAgentsFaqs) {
  check(`AIAgents FAQ question "${q}"`, agents, q);
  check(`AIAgents FAQ answer "${q}"`, agents, a);
}

console.log(`\n${checks - failures}/${checks} controlli superati.`);
if (failures > 0) {
  console.log(`\n${failures} MISMATCH TROVATI.`);
  process.exit(1);
} else {
  console.log('\nZero differenze sui blocchi controllati.');
}
