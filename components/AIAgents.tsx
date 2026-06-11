import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronDown,
<<<<<<< codex/ai-agents-redesign
  Clock,
  Database,
  Euro,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  Inbox,
  Lock,
=======
  ClipboardList,
  Database,
  FileSpreadsheet,
  FileText,
  Globe,
  Headphones,
>>>>>>> main
  Mail,
  MessageCircle,
  Package,
  Phone,
<<<<<<< codex/ai-agents-redesign
  PhoneMissed,
=======
>>>>>>> main
  PlugZap,
  Receipt,
  Rocket,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
<<<<<<< codex/ai-agents-redesign
  UserX,
=======
>>>>>>> main
} from 'lucide-react';
import SEOHead from './SEOHead';
import MagneticButton from './MagneticButton';
import { siteUrl } from '../data/seoPages';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Dati                                                                */
/* ------------------------------------------------------------------ */

// Scenari simulati nel pannello "agente al lavoro" dell'hero
const feedScenarios = [
  {
    source: 'WhatsApp · Cliente',
    sourceIcon: <MessageCircle className="w-4 h-4" />,
    trigger: '«Ciao, mi servono 40 cartoni del codice FR-200 entro venerdì»',
    steps: [
      'Riconosce un ordine nel messaggio',
      'Verifica codice e disponibilità nel gestionale',
      "Prepara la bozza d'ordine con i prezzi da listino",
      'Invia il riepilogo al commerciale per conferma',
    ],
<<<<<<< codex/ai-agents-redesign
    result: "Bozza d'ordine pronta in 40 secondi",
=======
    result: 'Ordine pronto in 40 secondi, senza copia-incolla',
>>>>>>> main
  },
  {
    source: 'Email · info@',
    sourceIcon: <Mail className="w-4 h-4" />,
    trigger: '«Potete quotarmi 3 lavorazioni come da disegno allegato?»',
    steps: [
      "Apre l'allegato ed estrae le specifiche",
      'Recupera listini e preventivi simili già fatti',
      "Compila l'offerta sul template aziendale",
      'La lascia in bozza, pronta da revisionare',
    ],
<<<<<<< codex/ai-agents-redesign
    result: 'Bozza di preventivo pronta in 2 minuti',
=======
    result: 'Bozza di preventivo in 2 minuti invece che in 3 giorni',
>>>>>>> main
  },
  {
    source: 'Sito · Form contatti',
    sourceIcon: <Globe className="w-4 h-4" />,
    trigger: '«Vorrei informazioni per la mia azienda (32 dipendenti)»',
    steps: [
      "Arricchisce i dati dell'azienda da fonti pubbliche",
      'Qualifica il contatto secondo i tuoi criteri',
      'Lo assegna al commerciale giusto nel CRM',
      "Prepara l'email di primo contatto",
    ],
<<<<<<< codex/ai-agents-redesign
    result: 'Primo contatto inviato dopo 5 minuti',
=======
    result: 'Follow-up partito in 5 minuti, non in 2 giorni',
>>>>>>> main
  },
];

// Casi d'uso per reparto (selettore interattivo)
const useCases = [
  {
    id: 'ordini',
    tab: 'Ordini',
    icon: <Package className="w-5 h-5" />,
    title: 'Gli ordini arrivano da WhatsApp ed email. Entrano nel gestionale da soli.',
    today:
      "Oggi qualcuno legge il messaggio, cerca il cliente, controlla i codici, riscrive tutto nel gestionale. Dieci minuti a ordine, errori di battitura inclusi.",
    withAgent: [
      'Legge messaggi, email e allegati appena arrivano',
      'Riconosce cliente, codici, quantità e date di consegna',
      "Crea la bozza d'ordine nel gestionale con i prezzi corretti",
      'Chiede conferma a una persona solo quando serve',
    ],
    tools: ['WhatsApp', 'Email', 'Gestionale / ERP'],
    impact: 'Da 10 minuti a 40 secondi per ordine',
  },
  {
    id: 'preventivi',
    tab: 'Preventivi',
    icon: <FileText className="w-5 h-5" />,
<<<<<<< codex/ai-agents-redesign
    title: 'Il preventivo parte in giornata, mentre il cliente è ancora interessato.',
=======
    title: 'Il preventivo parte in giornata, non quando qualcuno trova il tempo.',
>>>>>>> main
    today:
      'Oggi la richiesta resta in inbox finché il titolare o il tecnico non ha mezzora libera. Intanto il cliente chiede anche ai concorrenti.',
    withAgent: [
      'Estrae le specifiche dalla richiesta e dagli allegati',
      'Recupera listini, distinte e offerte simili già fatte',
      "Compila l'offerta sul tuo template, con i tuoi margini",
      'Una persona revisiona e invia: il lavoro noioso è già fatto',
    ],
    tools: ['Email', 'Listini / Excel', 'Storico offerte'],
<<<<<<< codex/ai-agents-redesign
    impact: 'Risposta al cliente in giornata',
=======
    impact: 'Risposta al cliente in ore, non in giorni',
>>>>>>> main
  },
  {
    id: 'lead',
    tab: 'Lead e vendite',
    icon: <Target className="w-5 h-5" />,
    title: 'Ogni contatto viene qualificato e richiamato mentre è ancora caldo.',
    today:
      'Oggi i lead delle campagne finiscono in un foglio o in una casella email. Chi può li richiama "appena ha un attimo". Spesso troppo tardi.',
    withAgent: [
      'Riceve il lead da form, campagne o LinkedIn',
      "Arricchisce i dati dell'azienda e applica i tuoi criteri di priorità",
      'Lo assegna al commerciale giusto nel CRM, con il contesto già pronto',
      'Prepara il primo messaggio e i promemoria di follow-up',
    ],
    tools: ['Form sito', 'Meta / LinkedIn', 'CRM'],
    impact: 'Primo contatto in minuti: il tasso di risposta cambia',
  },
  {
    id: 'clienti',
    tab: 'Assistenza clienti',
    icon: <Headphones className="w-5 h-5" />,
    title: '«Dov\'è il mio ordine?» riceve risposta subito, anche alle 21.',
    today:
<<<<<<< codex/ai-agents-redesign
      'Oggi le stesse dieci domande (stato ordine, tempi, documenti, resi) interrompono il team decine di volte al giorno.',
=======
      'Oggi le stesse dieci domande — stato ordine, tempi, documenti, resi — interrompono il team decine di volte al giorno.',
>>>>>>> main
    withAgent: [
      'Risponde su WhatsApp ed email alle domande ricorrenti',
      'Controlla lo stato reale di ordini e spedizioni nel gestionale',
      'Gestisce il primo livello e passa i casi delicati a una persona',
      'Tiene traccia di tutto: nessuna richiesta si perde',
    ],
    tools: ['WhatsApp', 'Email', 'Gestionale / ERP'],
    impact: 'Clienti seguiti 24/7, team interrotto molto meno',
  },
  {
    id: 'amministrazione',
    tab: 'Amministrazione',
    icon: <Receipt className="w-5 h-5" />,
    title: 'Fatture, DDT e documenti letti, controllati e registrati.',
    today:
      'Oggi i documenti dei fornitori arrivano via email e qualcuno li ricopia a mano, riga per riga, sperando di non sbagliare un importo.',
    withAgent: [
      'Legge fatture, DDT e conferme appena arrivano',
      'Controlla che importi e quantità tornino con gli ordini',
      'Prepara le registrazioni nel gestionale',
      'Segnala solo le anomalie da verificare',
    ],
    tools: ['Email / PEC', 'Gestionale / ERP', 'Fogli di calcolo'],
    impact: 'Meno ore di data entry, meno errori a fine mese',
  },
  {
    id: 'report',
    tab: 'Report e controllo',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Il lunedì mattina trovi il report già pronto, con i numeri che contano.',
    today:
      'Oggi capire come sta andando l\'azienda richiede una caccia al tesoro tra gestionale, CRM, fogli Excel ed estratti banca.',
    withAgent: [
      'Raccoglie i dati da gestionale, CRM e fogli condivisi',
      'Calcola i tuoi indicatori: vendite, margini, consegne, incassi',
      'Prepara un report leggibile, sempre uguale, sempre puntuale',
      'Evidenzia gli scostamenti che meritano una decisione',
    ],
    tools: ['Gestionale / ERP', 'CRM', 'Excel / Sheets'],
<<<<<<< codex/ai-agents-redesign
    impact: 'Decisioni prese su numeri aggiornati',
=======
    impact: 'Decisioni sui numeri veri, non sulle sensazioni',
>>>>>>> main
  },
];

// Sistemi collegabili (mappa radiale)
const integrations = [
  { name: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { name: 'Email / PEC', icon: <Mail className="w-4 h-4" /> },
  { name: 'Gestionale / ERP', icon: <Database className="w-4 h-4" /> },
  { name: 'CRM', icon: <Users className="w-4 h-4" /> },
  { name: 'Excel / Sheets', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { name: 'Calendario', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Sito e form', icon: <Globe className="w-4 h-4" /> },
  { name: 'Centralino', icon: <Phone className="w-4 h-4" /> },
];

// Percorso consulenziale
const methodSteps = [
  {
    icon: <Search className="w-6 h-6" />,
    phase: 'Tappa 01',
    duration: '1–2 settimane',
    title: 'Mappatura dei processi',
    description:
<<<<<<< codex/ai-agents-redesign
      'Entriamo in azienda e parliamo sia con la direzione sia con chi fa il lavoro ogni giorno. Mappiamo dove si perde tempo e quali dati avete già.',
=======
      'Entriamo in azienda e parliamo con chi fa il lavoro, non solo con la direzione. Mappiamo dove si perde tempo e quali dati avete già.',
>>>>>>> main
    deliverable:
      'La lista dei processi automatizzabili, ordinata per impatto, con la stima delle ore recuperabili.',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    phase: 'Tappa 02',
    duration: '4–6 settimane',
    title: 'Primo agente al lavoro',
    description:
      'Partiamo dal processo con il miglior rapporto tra impatto e semplicità. Costruiamo l\'agente insieme alle persone che lo useranno ogni giorno.',
    deliverable:
      'Un agente funzionante su un processo reale, testato con i vostri dati veri.',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    phase: 'Tappa 03',
    duration: '2–3 settimane',
    title: 'Messa in produzione',
    description:
      'Integrazione completa con i vostri strumenti, regole chiare su cosa l\'agente fa da solo e cosa passa da una persona, formazione del team.',
    deliverable:
      'Il team usa l\'agente in autonomia e sa esattamente quando e come intervenire.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    phase: 'Tappa 04',
    duration: 'Continuativo',
    title: 'Crescita e controllo',
    description:
      'Monitoriamo i risultati, correggiamo dove serve ed estendiamo il lavoro ad altri processi, uno alla volta.',
    deliverable:
      'Un report mensile con ore recuperate, errori evitati e prossimi passi proposti.',
  },
];

// Frasi in cui l'imprenditore può riconoscersi
const signals = [
<<<<<<< codex/ai-agents-redesign
  { icon: <Clock className="w-5 h-5" />, quote: '«Faccio prima a farlo io che a spiegarlo a qualcuno»' },
  { icon: <FileText className="w-5 h-5" />, quote: '«Il preventivo è partito dopo quattro giorni. Il cliente aveva già firmato con altri»' },
  { icon: <Inbox className="w-5 h-5" />, quote: '«Metà giornata se ne va tra email, gestionale e fogli Excel»' },
  { icon: <UserX className="w-5 h-5" />, quote: '«Se manca lei, nessuno sa dove trovare le informazioni»' },
  { icon: <PhoneMissed className="w-5 h-5" />, quote: '«I lead arrivano, ma li richiamiamo quando abbiamo tempo»' },
  { icon: <BarChart3 className="w-5 h-5" />, quote: '«Ogni fine mese è una caccia ai dati per capire come stiamo andando»' },
];

// Icone per gli strumenti collegati nei casi d'uso
const toolIcons: Record<string, React.ReactNode> = {
  'WhatsApp': <MessageCircle className="w-3.5 h-3.5" />,
  'Email': <Mail className="w-3.5 h-3.5" />,
  'Email / PEC': <Mail className="w-3.5 h-3.5" />,
  'Gestionale / ERP': <Database className="w-3.5 h-3.5" />,
  'CRM': <Users className="w-3.5 h-3.5" />,
  'Listini / Excel': <FileSpreadsheet className="w-3.5 h-3.5" />,
  'Fogli di calcolo': <FileSpreadsheet className="w-3.5 h-3.5" />,
  'Excel / Sheets': <FileSpreadsheet className="w-3.5 h-3.5" />,
  'Storico offerte': <FileText className="w-3.5 h-3.5" />,
  'Form sito': <Globe className="w-3.5 h-3.5" />,
  'Meta / LinkedIn': <Target className="w-3.5 h-3.5" />,
};

// FAQ in linguaggio da imprenditore
const faqs = [
  {
    icon: <Euro className="w-4 h-4" />,
=======
  '«Faccio prima a farlo io che a spiegarlo a qualcuno.»',
  '«Il preventivo è partito dopo quattro giorni. Il cliente aveva già firmato con altri.»',
  '«Metà giornata se ne va tra email, gestionale e fogli Excel.»',
  '«Se manca lei, nessuno sa dove trovare le informazioni.»',
  '«I lead arrivano, ma li richiamiamo quando abbiamo tempo.»',
  '«Ogni fine mese è una caccia ai dati per capire come stiamo andando.»',
];

// FAQ in linguaggio da imprenditore
const faqs = [
  {
>>>>>>> main
    question: 'Quanto costa un agente AI?',
    answer:
      "Dipende dal processo e dai sistemi da collegare. Per questo il percorso parte dalla mappatura: prima di investire sai esattamente quanto costa il progetto pilota e quante ore di lavoro può restituirti. Niente canoni a sorpresa, niente preventivi al buio.",
  },
  {
<<<<<<< codex/ai-agents-redesign
    icon: <Clock className="w-4 h-4" />,
=======
>>>>>>> main
    question: 'In quanto tempo vedo i primi risultati?',
    answer:
      'Il primo agente lavora su un processo reale entro 6–8 settimane dal via. Non partiamo mai da un progetto enorme: partiamo da un processo solo, misurabile, e allarghiamo solo quando funziona.',
  },
  {
<<<<<<< codex/ai-agents-redesign
    icon: <ShieldCheck className="w-4 h-4" />,
=======
>>>>>>> main
    question: "E se l'agente sbaglia?",
    answer:
      "Dove conta, l'agente propone e una persona conferma: definiamo insieme cosa può fare in autonomia e cosa deve passare da un controllo umano. Ogni azione resta tracciata, quindi puoi sempre verificare cosa ha fatto e perché.",
  },
  {
<<<<<<< codex/ai-agents-redesign
    icon: <Lock className="w-4 h-4" />,
=======
>>>>>>> main
    question: 'I dati della mia azienda dove finiscono?',
    answer:
      'Restano nei tuoi sistemi: gestionale, CRM ed email rimangono la fonte dei dati. Definiamo permessi e accessi prima di partire e lavoriamo in conformità al GDPR. Nessun dato viene usato per addestrare modelli pubblici.',
  },
  {
<<<<<<< codex/ai-agents-redesign
    icon: <GraduationCap className="w-4 h-4" />,
    question: 'Il mio team non è tecnico. Ce la facciamo?',
    answer:
      'Sì, ed è il punto: il team continua a usare WhatsApp, email e gestionale come sempre, perché è l\'agente che si adatta ai vostri strumenti. La formazione la facciamo noi, sul vostro caso concreto.',
  },
  {
    icon: <Bot className="w-4 h-4" />,
=======
    question: 'Il mio team non è tecnico. Ce la facciamo?',
    answer:
      'Sì, ed è il punto: il team continua a usare WhatsApp, email e gestionale come sempre. È l\'agente che si adatta ai vostri strumenti, non il contrario. La formazione la facciamo noi, sul vostro caso concreto.',
  },
  {
>>>>>>> main
    question: 'È un chatbot?',
    answer:
      "No. Un chatbot risponde a domande. Un agente lavora: legge documenti, aggiorna il gestionale, prepara ordini e preventivi, passa la palla a una persona quando serve. La chat è solo uno dei canali da cui riceve il lavoro.",
  },
];

/* ------------------------------------------------------------------ */
/* Hero: pannello "agente al lavoro"                                   */
/* ------------------------------------------------------------------ */

const LiveAgentPanel: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  // progress: 0 = solo messaggio in arrivo, 1..n = step visibili, n+1 = esito visibile
  const [progress, setProgress] = useState(reducedMotion ? feedScenarios[0].steps.length + 1 : 0);

  const scenario = feedScenarios[scenarioIndex];
  const totalSteps = scenario.steps.length + 1;

  useEffect(() => {
    if (reducedMotion) return;

    if (progress < totalSteps) {
      const delay = progress === 0 ? 1400 : 1000;
      const timer = setTimeout(() => setProgress((p) => p + 1), delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setScenarioIndex((s) => (s + 1) % feedScenarios.length);
      setProgress(0);
    }, 4200);
    return () => clearTimeout(timer);
  }, [progress, totalSteps, reducedMotion]);

  return (
<<<<<<< codex/ai-agents-redesign
    <div className="relative rounded-[1.75rem] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur overflow-hidden shadow-[0_40px_120px_-40px_rgba(168,85,247,0.25)]">
=======
    <div className="relative rounded-[1.75rem] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur overflow-hidden shadow-[0_40px_120px_-40px_rgba(16,185,129,0.25)]">
>>>>>>> main
      {/* Barra superiore */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
<<<<<<< codex/ai-agents-redesign
            <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
          </span>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-violet-300">Agente al lavoro</span>
=======
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-300">Agente al lavoro</span>
>>>>>>> main
        </div>
        <span className="text-xs font-mono text-gray-600">q4 · operations</span>
      </div>

      <div className="p-6 min-h-[400px] flex flex-col">
        {/* Messaggio in arrivo */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 mb-5">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            {scenario.sourceIcon}
            <span className="text-xs font-mono uppercase tracking-widest">{scenario.source}</span>
          </div>
          <p className="text-gray-200 leading-relaxed">{scenario.trigger}</p>
        </div>

        {/* Step dell'agente */}
        <div className="flex-1 space-y-2.5">
          {scenario.steps.map((step, i) => {
            const visible = progress >= i + 1;
            return (
              <div
                key={`${scenarioIndex}-${i}`}
                className="flex items-start gap-3 transition-all duration-500"
                style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
              >
<<<<<<< codex/ai-agents-redesign
                <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-violet-400" />
=======
                <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-400" />
>>>>>>> main
                <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
              </div>
            );
          })}

          {/* Indicatore "sta lavorando" */}
          {!reducedMotion && progress < totalSteps && (
            <div className="flex items-center gap-2 pl-7 pt-1">
<<<<<<< codex/ai-agents-redesign
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70 animate-bounce [animation-delay:300ms]" />
=======
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 animate-bounce [animation-delay:300ms]" />
>>>>>>> main
            </div>
          )}
        </div>

        {/* Esito */}
        <div
<<<<<<< codex/ai-agents-redesign
          className="mt-5 rounded-2xl border border-violet-400/25 bg-violet-400/[0.07] p-4 transition-all duration-500"
=======
          className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4 transition-all duration-500"
>>>>>>> main
          style={{
            opacity: progress >= totalSteps ? 1 : 0,
            transform: progress >= totalSteps ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
<<<<<<< codex/ai-agents-redesign
          <p className="text-violet-200 font-medium text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {scenario.result}
          </p>
=======
          <p className="text-emerald-200 font-medium text-sm">✓ {scenario.result}</p>
>>>>>>> main
        </div>

        {/* Indicatori scenario */}
        <div className="flex items-center gap-2 mt-5 justify-center">
          {feedScenarios.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
<<<<<<< codex/ai-agents-redesign
                i === scenarioIndex ? 'w-8 bg-violet-400' : 'w-3 bg-white/15'
=======
                i === scenarioIndex ? 'w-8 bg-emerald-400' : 'w-3 bg-white/15'
>>>>>>> main
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pagina                                                              */
/* ------------------------------------------------------------------ */

const AIAgents: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const casePanelRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Animazioni di reveal allo scroll
  useEffect(() => {
    if (!pageRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.from(group.children, {
          scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        });
      });

      // La linea del percorso si disegna mentre scorri
      if (timelineLineRef.current) {
        gsap.from(timelineLineRef.current, {
          scrollTrigger: {
            trigger: timelineLineRef.current.parentElement,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
          scaleY: 0,
          transformOrigin: 'top center',
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Transizione del pannello casi d'uso al cambio di tab
  useEffect(() => {
    if (!casePanelRef.current || reducedMotion) return;
    gsap.fromTo(
      casePanelRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [activeCase, reducedMotion]);

  const scrollToContact = () => {
    const contactForm = document.querySelector('section:has(form)');
    contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const currentCase = useCases[activeCase];

  return (
    <div ref={pageRef} className="relative overflow-hidden bg-[#050505] text-white">
      <SEOHead
        title="Agenti AI per aziende | Consulenza e sviluppo su misura | Q4 Studio"
        description="Agenti AI che leggono email e WhatsApp, inseriscono ordini nel gestionale, preparano preventivi e qualificano i lead. Q4 Studio ti affianca dalla mappatura dei processi alla messa in produzione."
        url={`${siteUrl}/agenti-ai`}
      />

      {/* Animazione del flusso sulle linee della mappa integrazioni */}
      <style>{`
        @keyframes q4-dash-flow { to { stroke-dashoffset: -40; } }
        .q4-flow-line { stroke-dasharray: 4 10; animation: q4-dash-flow 2.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .q4-flow-line { animation: none; } }
      `}</style>

      {/* ============================== HERO ============================== */}
      <section className="relative px-6 pt-36 pb-24 lg:min-h-screen flex items-center">
        <div className="absolute inset-0 pointer-events-none">
<<<<<<< codex/ai-agents-redesign
          <div className="absolute right-[-10%] top-[10%] h-[640px] w-[640px] rounded-full bg-violet-500/[0.07] blur-[140px]" />
=======
          <div className="absolute right-[-10%] top-[10%] h-[640px] w-[640px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
>>>>>>> main
          <div className="absolute left-[-15%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-indigo-600/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
<<<<<<< codex/ai-agents-redesign
            <div className="flex items-center gap-2 text-violet-300 font-mono text-sm tracking-[0.3em] uppercase mb-7">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
=======
            <div className="flex items-center gap-2 text-emerald-300 font-mono text-sm tracking-[0.3em] uppercase mb-7">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
>>>>>>> main
              Agenti AI · consulenza e sviluppo
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tighter mb-8">
              Agenti AI su misura per togliere al tuo team il lavoro che un software può fare meglio.
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl">
              Leggono email e WhatsApp, inseriscono gli ordini nel gestionale, preparano i preventivi,
              qualificano i lead e rispondono ai clienti. Tu mantieni il controllo:{' '}
              <span className="text-white">l'agente propone, le persone decidono.</span>
            </p>

<<<<<<< codex/ai-agents-redesign
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gray-600 mr-1">
                Lavora dentro:
              </span>
              {[
                { icon: <MessageCircle className="w-4 h-4" />, label: 'WhatsApp' },
                { icon: <Mail className="w-4 h-4" />, label: 'Email' },
                { icon: <Database className="w-4 h-4" />, label: 'Gestionale' },
                { icon: <Users className="w-4 h-4" />, label: 'CRM' },
                { icon: <FileSpreadsheet className="w-4 h-4" />, label: 'Excel' },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300"
                >
                  <span className="text-violet-300">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>

=======
>>>>>>> main
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <MagneticButton
                onClick={scrollToContact}
                className="text-base md:text-lg px-8 py-4 font-semibold"
              >
<<<<<<< codex/ai-agents-redesign
                <span>Parliamone: 30 minuti senza impegno</span>
=======
                <span>Parliamone — 30 minuti, senza impegno</span>
>>>>>>> main
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <a
                href="#cosa-fa"
<<<<<<< codex/ai-agents-redesign
                className="text-sm font-mono text-gray-500 hover:text-violet-300 transition-colors uppercase tracking-widest"
=======
                className="text-sm font-mono text-gray-500 hover:text-emerald-300 transition-colors uppercase tracking-widest"
>>>>>>> main
              >
                Vedi cosa fa, in concreto ↓
              </a>
            </div>
          </div>

          <LiveAgentPanel reducedMotion={reducedMotion} />
        </div>
      </section>

      {/* ====================== COSA FA, IN CONCRETO ====================== */}
      <section id="cosa-fa" className="relative px-6 py-28 border-t border-white/5 bg-[#070707]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16" data-reveal>
<<<<<<< codex/ai-agents-redesign
            <span className="text-violet-300 font-mono tracking-widest text-sm uppercase mb-5 block">
=======
            <span className="text-emerald-300 font-mono tracking-widest text-sm uppercase mb-5 block">
>>>>>>> main
              Cosa fa, in concreto
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Scegli un processo.{' '}
<<<<<<< codex/ai-agents-redesign
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400">
=======
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400">
>>>>>>> main
                Guarda cosa cambia.
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Ogni agente nasce da un processo vero: come lo gestisci oggi, cosa fa l'agente al posto
              del team e dove resta il controllo delle persone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Selettore reparti */}
            <div
              className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0"
              data-reveal
            >
              {useCases.map((useCase, index) => (
                <button
                  key={useCase.id}
                  onClick={() => setActiveCase(index)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-left whitespace-nowrap lg:whitespace-normal transition-all duration-300 cursor-pointer flex-shrink-0 lg:flex-shrink ${
                    activeCase === index
<<<<<<< codex/ai-agents-redesign
                      ? 'border-violet-400/40 bg-violet-400/[0.08] text-white'
=======
                      ? 'border-emerald-400/40 bg-emerald-400/[0.08] text-white'
>>>>>>> main
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/25 hover:text-gray-200'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 transition-colors ${
<<<<<<< codex/ai-agents-redesign
                      activeCase === index ? 'bg-violet-400/15 text-violet-300' : 'bg-white/[0.05] text-gray-500'
=======
                      activeCase === index ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.05] text-gray-500'
>>>>>>> main
                    }`}
                  >
                    {useCase.icon}
                  </span>
                  <span className="font-medium">{useCase.tab}</span>
                </button>
              ))}
            </div>

            {/* Pannello dettaglio */}
            <div
              ref={casePanelRef}
              className="rounded-[1.75rem] border border-white/10 bg-[#0A0A0A] p-7 md:p-10 overflow-hidden relative"
            >
<<<<<<< codex/ai-agents-redesign
              <div className="absolute top-0 right-0 w-72 h-72 bg-violet-400/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
=======
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
>>>>>>> main

              <h3 className="text-2xl md:text-4xl font-bold leading-snug mb-8 relative z-10">
                {currentCase.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
<<<<<<< codex/ai-agents-redesign
                  <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
=======
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-4 block">
>>>>>>> main
                    Oggi, senza agente
                  </span>
                  <p className="text-gray-400 leading-relaxed">{currentCase.today}</p>
                </div>

<<<<<<< codex/ai-agents-redesign
                <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-6">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-violet-300/80 mb-4">
                    <Bot className="w-4 h-4" />
=======
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-300/80 mb-4 block">
>>>>>>> main
                    Con l'agente
                  </span>
                  <ul className="space-y-3">
                    {currentCase.withAgent.map((step) => (
                      <li key={step} className="flex items-start gap-3">
<<<<<<< codex/ai-agents-redesign
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-violet-400" />
=======
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-400" />
>>>>>>> main
                        <span className="text-sm text-gray-300 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-600 mr-1">
                    Si collega a:
                  </span>
                  {currentCase.tools.map((tool) => (
                    <span
                      key={tool}
<<<<<<< codex/ai-agents-redesign
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
                    >
                      <span className="text-violet-300">{toolIcons[tool]}</span>
=======
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
                    >
>>>>>>> main
                      {tool}
                    </span>
                  ))}
                </div>
<<<<<<< codex/ai-agents-redesign
                <p className="md:ml-auto text-sm font-medium text-violet-300 flex items-center gap-2">
=======
                <p className="md:ml-auto text-sm font-medium text-emerald-300 flex items-center gap-2">
>>>>>>> main
                  <TrendingUp className="w-4 h-4" />
                  {currentCase.impact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== INTEGRAZIONI ========================== */}
      <section className="relative px-6 py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div data-reveal>
            <span className="text-indigo-400 font-mono tracking-widest text-sm uppercase mb-5 block">
              Integrazioni
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Si collega agli strumenti che usi già.
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Nessuna piattaforma nuova da imparare, nessun cambio di gestionale. L'agente entra nei
              flussi esistenti: legge da dove arrivano le informazioni e scrive dove servono.
            </p>

            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 flex-shrink-0">
                <PlugZap className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold mb-1">Usate un software particolare?</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Se ha un'API, un'esportazione o anche solo una casella email, lo colleghiamo. Lo
                  verifichiamo insieme nella fase di mappatura, prima di qualsiasi investimento.
                </p>
              </div>
            </div>
          </div>

          {/* Mappa radiale (desktop) */}
          <div className="relative hidden md:block aspect-square max-w-[600px] mx-auto w-full" data-reveal>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
              {integrations.map((_, i) => {
                const angle = (i / integrations.length) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + 41 * Math.cos(angle);
                const y = 50 + 41 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="rgba(99,102,241,0.35)"
                    strokeWidth="0.35"
                    className="q4-flow-line"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                );
              })}
              <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
            </svg>

            {/* Nodo centrale */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
<<<<<<< codex/ai-agents-redesign
              <div className="rounded-3xl border border-violet-400/30 bg-[#0A0A0A] px-7 py-6 text-center shadow-[0_0_80px_-20px_rgba(168,85,247,0.45)]">
                <Bot className="w-9 h-9 text-violet-300 mx-auto mb-2" />
=======
              <div className="rounded-3xl border border-emerald-400/30 bg-[#0A0A0A] px-7 py-6 text-center shadow-[0_0_80px_-20px_rgba(16,185,129,0.45)]">
                <Bot className="w-9 h-9 text-emerald-300 mx-auto mb-2" />
>>>>>>> main
                <p className="font-bold text-lg leading-none mb-1.5">Agente Q4</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-gray-500">
                  legge · decide · agisce
                </p>
              </div>
            </div>

            {/* Satelliti */}
            {integrations.map((system, i) => {
              const angle = (i / integrations.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + 41 * Math.cos(angle);
              const y = 50 + 41 * Math.sin(angle);
              return (
                <div
                  key={system.name}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 whitespace-nowrap hover:border-indigo-400/40 transition-colors">
                    <span className="text-indigo-300">{system.icon}</span>
                    <span className="text-sm font-medium text-gray-200">{system.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Griglia integrazioni (mobile) */}
          <div className="grid grid-cols-2 gap-3 md:hidden" data-reveal-group>
            {integrations.map((system) => (
              <div
                key={system.name}
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0A0A0A] px-4 py-3.5"
              >
                <span className="text-indigo-300 flex-shrink-0">{system.icon}</span>
                <span className="text-sm font-medium text-gray-200">{system.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= METODO / PERCORSO ========================= */}
      <section className="relative px-6 py-28 border-t border-white/5 bg-[#070707]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14">
          <div className="lg:sticky lg:top-32 self-start" data-reveal>
            <span className="text-indigo-400 font-mono tracking-widest text-sm uppercase mb-5 block">
              Il nostro metodo
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Non ti vendiamo un software.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Ti affianchiamo finché funziona.
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Siamo uno studio di consulenza: prima capiamo come lavora la tua azienda, poi
              costruiamo. Ogni tappa ha una durata, un obiettivo e un risultato concreto che ti porti
<<<<<<< codex/ai-agents-redesign
              a casa, anche se decidi di fermarti lì.
=======
              a casa — anche se decidi di fermarti lì.
>>>>>>> main
            </p>
            <div className="flex items-center gap-3 text-gray-500">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                Nessun vincolo lungo: si prosegue solo se i numeri della tappa precedente lo
                giustificano.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-10">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10">
              <div
                ref={timelineLineRef}
<<<<<<< codex/ai-agents-redesign
                className="absolute inset-0 bg-gradient-to-b from-indigo-400 via-purple-400 to-violet-400"
=======
                className="absolute inset-0 bg-gradient-to-b from-indigo-400 via-purple-400 to-emerald-400"
>>>>>>> main
              />
            </div>

            <div className="space-y-8">
              {methodSteps.map((step) => (
                <div key={step.title} className="relative" data-reveal>
                  <span className="absolute -left-10 top-7 flex h-[31px] w-[31px] items-center justify-center rounded-full border border-white/15 bg-[#0A0A0A]">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  </span>

                  <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-7 hover:border-indigo-400/30 transition-colors duration-500">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-300">
                          {step.icon}
                        </span>
                        <div>
                          <span className="block text-xs font-mono uppercase tracking-widest text-gray-600">
                            {step.phase}
                          </span>
                          <span className="text-sm text-gray-400">{step.duration}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-5">{step.description}</p>

                    <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.06] p-4">
<<<<<<< codex/ai-agents-redesign
                      <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-300/80 mb-1.5">
                        <FileCheck className="w-4 h-4" />
=======
                      <span className="text-xs font-mono uppercase tracking-widest text-indigo-300/80 mb-1.5 block">
>>>>>>> main
                        Cosa ti porti a casa
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed">{step.deliverable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TI RICONOSCI? ========================= */}
      <section className="relative px-6 py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14" data-reveal>
<<<<<<< codex/ai-agents-redesign
            <span className="text-violet-300 font-mono tracking-widest text-sm uppercase mb-5 block">
=======
            <span className="text-emerald-300 font-mono tracking-widest text-sm uppercase mb-5 block">
>>>>>>> main
              Ti suona familiare?
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Le frasi che sentiamo in ogni prima call.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-group>
<<<<<<< codex/ai-agents-redesign
            {signals.map((signal) => (
              <div
                key={signal.quote}
                className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-7 hover:border-violet-400/30 transition-colors duration-500"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 border border-violet-400/20 text-violet-300 mb-4">
                  {signal.icon}
                </span>
                <p className="text-lg text-gray-300 leading-relaxed font-medium">{signal.quote}</p>
=======
            {signals.map((quote) => (
              <div
                key={quote}
                className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-7 hover:border-emerald-400/30 transition-colors duration-500"
              >
                <ClipboardList className="w-5 h-5 text-emerald-400/60 mb-4" />
                <p className="text-lg text-gray-300 leading-relaxed font-medium">{quote}</p>
>>>>>>> main
              </div>
            ))}
          </div>

          <p className="text-gray-500 mt-10 text-lg" data-reveal>
            Se ti sei riconosciuto in almeno una frase, c'è un processo che vale la pena mappare.{' '}
            <button
              onClick={scrollToContact}
<<<<<<< codex/ai-agents-redesign
              className="text-violet-300 hover:text-violet-200 transition-colors underline underline-offset-4 cursor-pointer"
=======
              className="text-emerald-300 hover:text-emerald-200 transition-colors underline underline-offset-4 cursor-pointer"
>>>>>>> main
            >
              Raccontacelo
            </button>
            .
          </p>
<<<<<<< codex/ai-agents-redesign
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      <section className="relative px-6 py-28 border-t border-white/5 bg-[#070707]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center" data-reveal>
            <span className="text-indigo-400 font-mono tracking-widest text-sm uppercase mb-5 block">
              Domande frequenti
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Le domande che ci fanno tutti gli imprenditori.
            </h2>
          </div>

          <div className="space-y-3" data-reveal-group>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen ? 'border-indigo-400/30 bg-indigo-500/[0.04]' : 'border-white/10 bg-[#0A0A0A]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3 font-semibold text-lg">
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          isOpen
                            ? 'bg-indigo-500/15 border-indigo-400/30 text-indigo-300'
                            : 'bg-white/[0.04] border-white/10 text-gray-500'
                        }`}
                      >
                        {faq.icon}
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-300' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

=======
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      <section className="relative px-6 py-28 border-t border-white/5 bg-[#070707]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center" data-reveal>
            <span className="text-indigo-400 font-mono tracking-widest text-sm uppercase mb-5 block">
              Domande frequenti
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Le domande che ci fanno tutti gli imprenditori.
            </h2>
          </div>

          <div className="space-y-3" data-reveal-group>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen ? 'border-indigo-400/30 bg-indigo-500/[0.04]' : 'border-white/10 bg-[#0A0A0A]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-300' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

>>>>>>> main
      {/* ============================ CTA FINALE ============================ */}
      <section className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[760px] rounded-full bg-indigo-600/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center" data-reveal>
<<<<<<< codex/ai-agents-redesign
          <span className="text-violet-300 font-mono tracking-widest text-sm uppercase mb-6 block">
=======
          <span className="text-emerald-300 font-mono tracking-widest text-sm uppercase mb-6 block">
>>>>>>> main
            Il primo passo
          </span>
          <h2 className="text-4xl md:text-7xl font-bold leading-tight mb-8">
            Porta un processo che ti ruba tempo.{' '}
<<<<<<< codex/ai-agents-redesign
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400">
=======
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-400 to-indigo-400">
>>>>>>> main
              Ne usciamo con un piano.
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            In 30 minuti analizziamo insieme dove oggi si perde tempo, quali dati avete già e quale
            agente può generare il primo risultato misurabile. Senza impegno e senza slide.
          </p>
          <MagneticButton onClick={scrollToContact} className="text-base md:text-lg px-9 py-4 font-semibold">
            <span>Prenota la chiamata</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
};

export default AIAgents;
