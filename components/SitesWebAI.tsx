import React from 'react';
import { ArrowUpRight, Check, Compass, Flag, Layers, LayoutGrid, Plus, Sparkles } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { useLightDocument } from '../hooks/useLightDocument';

/* ------------------------------------------------------------------ */
/* Pagina "Siti web con AI" sul sistema chiaro (mockup "Siti web con   */
/* AI"): hero scuro con aurora, manifesto, quattro cifre, bento dei    */
/* linguaggi, blocco carta landing page, caso GP Meccatronica, tre     */
/* fasi, cosa serve, FAQ e chiusura. Classi .home-light in index.css;  */
/* reveal allo scroll via <Reveal>.                                    */
/* ------------------------------------------------------------------ */

/** FAQ del mockup: stessi testi del contenuto statico in scripts/prerender.ts. */
const faqs = [
  {
    question: 'Il sito viene generato automaticamente dall’AI?',
    answer: 'No. L’AI accelera parti della produzione, ma direzione, struttura, messaggio, scelte visive e controllo finale restano umani. È fatto con l’AI, non dall’AI.',
  },
  {
    question: 'Quanto costa un sito web con Q4 Studio?',
    answer: 'I progetti partono da 2.999 €. Il preventivo dipende dal tipo di sito, dai contenuti e dalla produzione necessaria: definiamo il progetto prima di iniziare.',
  },
  {
    question: 'Quanto tempo serve per una landing page?',
    answer: 'Una landing page può essere pronta in una settimana. Per siti più articolati, tempi e fasi vengono definiti sul progetto.',
  },
  {
    question: 'Potete occuparvi anche di foto e video reali?',
    answer: 'Sì. Quando il progetto lo richiede, la produzione di foto e video reali può rientrare nella realizzazione, insieme ad asset creati con l’AI, video animati e sezioni con animazioni allo scroll.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Siti web con AI per aziende B2B',
  description: 'Progettazione e sviluppo di siti e landing page B2B con direzione umana e strumenti AI.',
  provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
  areaServed: 'IT',
  url: `${siteUrl}/siti-web-ai`,
  offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2999', description: 'Prezzo di partenza' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Siti Web AI', item: `${siteUrl}/siti-web-ai` },
  ],
};

const HERO_WORDS = ['Fatto', 'con', 'l’AI,', 'non', 'dall’AI.'];

const figures = [
  { value: '2.999 €', desc: 'Prezzo di partenza dei progetti. Il preventivo si definisce sul progetto.', delay: 0 },
  { value: '7 giorni', desc: 'Per una landing page, quando serve portare online un’offerta.', delay: 0.12 },
  { value: '3 fasi', desc: 'Direzione, produzione, consegna. Non un modulo da compilare.', delay: 0.2 },
  { value: '1 referente', desc: 'Una persona sola che valida le scelte, senza rincorrere pareri.', delay: 0 },
];

const phases = [
  { icon: Compass, title: '01 · Direzione', desc: 'Una call per capire cosa deve fare il sito, per chi e cosa deve far ricordare. Da qui esce una struttura, non un elenco di pagine.', delay: 0 },
  { icon: Layers, title: '02 · Produzione', desc: 'Testo, asset visivi, motion e sviluppo. L’AI accelera le parti dove ha senso; direzione e gusto restano nostri.', delay: 0.12 },
  { icon: Flag, title: '03 · Consegna', desc: 'Sito pubblicato, ottimizzato e documentato: sai cosa c’è dentro e chi lo aggiorna dopo.', delay: 0.2 },
];

const caseChips = ['Rebranding', 'Web design', 'Sviluppo sito', 'Art direction', 'Motion design', 'Asset AI', 'SEO'];

const caseSteps = ['Infrastruttura del sito', 'Creazione degli asset', 'Creazione dei copy', 'Ottimizzazione SEO', 'Redirect dal vecchio sito al nuovo'];

const PAPER_BG = 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)';
const CARD_TITLE: React.CSSProperties = { fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' };

const OkIcon: React.FC = () => (
  <span className="ok" aria-hidden="true">
    <Check className="h-3 w-3" strokeWidth={3} />
  </span>
);

const IconBox: React.FC<{ icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }> = ({ icon: Icon }) => (
  <span className="ico" aria-hidden="true">
    <Icon className="h-7 w-7" strokeWidth={1.7} />
  </span>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="bul">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

const LanguageCard: React.FC<{ icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; desc: string; items: string[]; background: string; delay?: number }> = ({ icon, title, desc, items, background, delay }) => (
  <Reveal as="article" delay={delay} className="bc" style={{ minHeight: 640, paddingBottom: 110, background }}>
    <div style={{ marginBottom: 28 }}><IconBox icon={icon} /></div>
    <h3>{title}</h3>
    <p className="d">{desc}</p>
    <Bullets items={items} />
  </Reveal>
);

const NoteCard: React.FC<{ text: string; delay?: number }> = ({ text, delay }) => (
  <Reveal as="article" delay={delay} className="bc ov justify-center" style={{ minHeight: 220, background: '#f7f5fb' }}>
    <p className="d m-0 font-medium" style={{ color: '#0a0a0a', marginTop: 0 }}>{text}</p>
  </Reveal>
);

const BrowserMock: React.FC = () => (
  <div className="mock overflow-hidden" aria-hidden="true">
    <div className="flex items-center gap-2 px-[18px] py-3.5" style={{ borderBottom: '1px solid rgba(10,10,10,.08)' }}>
      <i className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
      <i className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
      <i className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
      <span className="ml-3.5 flex h-[26px] flex-1 items-center rounded-full bg-[#f3f4f6] px-3.5 text-xs text-gray-500">tuosito.it</span>
    </div>
    <div className="relative h-[340px] overflow-hidden bg-[#050505]">
      <div className="aur" style={{ width: 300, height: 300, background: 'rgba(99,102,241,.6)', left: -60, top: -90, filter: 'blur(70px)' }} />
      <div className="aur" style={{ width: 320, height: 320, background: 'rgba(147,51,234,.6)', right: -80, bottom: -110, filter: 'blur(70px)' }} />
      <div className="absolute left-9 right-9 top-11">
        <div className="h-3 w-[110px] rounded-md" style={{ background: 'rgba(255,255,255,.35)' }} />
        <div className="mt-[26px] h-[34px] w-[78%] rounded-[10px] bg-white" />
        <div className="mt-3 h-[34px] w-[56%] rounded-[10px] bg-white" />
        <div className="mt-7 h-3 w-[64%] rounded-md" style={{ background: 'rgba(255,255,255,.3)' }} />
        <div className="mt-[30px] h-[46px] w-[150px] rounded-full" style={{ background: 'linear-gradient(120deg, #818cf8, #a855f7 55%, #9333ea)' }} />
      </div>
    </div>
  </div>
);

const SitesWebAI: React.FC = () => {
  useLightDocument();

  const scrollToContact = (label: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    trackCtaClick({ cta_location: 'sites_web_ai_page', cta_label: label, cta_destination: '#contatti' });
    document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <article className="relative">
      <SEOHead title="Siti web con AI per aziende B2B | Q4 Studio" description="Siti e landing page B2B fatti con l’AI, non dall’AI: asset su misura, motion e produzione foto-video. Progetti da 2.999 €." url={`${siteUrl}/siti-web-ai`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero scuro: id="hero" fa restare bianchi logo e hamburger della nav
          finché non si scorre oltre (vedi App.tsx). */}
      <header id="hero" className="relative flex min-h-[640px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[780px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-24 pt-36 md:px-12 md:pt-40">
          <h1 className="h-sub max-w-[1250px] text-white" style={{ color: '#fff' }}>
            {HERO_WORDS.map((word, i) => (
              <React.Fragment key={word}>
                <span className="w" style={{ animationDelay: `${(0.15 + i * 0.07).toFixed(2)}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w lead mt-12 max-w-[640px] text-gray-300" style={{ animationDelay: '0.7s' }}>
            Progettiamo siti e landing page con una direzione precisa. L’AI ci permette di produrre immagini, movimento e varianti più velocemente; non decide cosa dire, cosa mostrare o perché.
          </p>
          <div className="w mt-12" style={{ animationDelay: '0.85s' }}>
            <a href="#contatti" onClick={scrollToContact('Progetti da 2.999 €')} className="btn btn-white">
              Progetti da 2.999 €
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Manifesto */}
      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[140px] md:pt-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1200px]">L’AI abbassa il costo della produzione. Non il livello delle scelte.</Reveal>
          <div className="ml-auto mt-20 max-w-[640px] md:mt-[80px]">
            <Reveal as="p" className="lead max-w-[560px]">Un sito non diventa efficace perché una macchina ha generato una pagina. Serve capire cosa deve far ricordare, quale percorso deve costruire e dove deve portare chi lo visita.</Reveal>
            <Reveal as="p" delay={0.12} className="lead mt-7 max-w-[560px]">Usiamo l’AI nel processo creativo e tecnico, sotto direzione umana. Il risultato non è “un sito AI”: è un sito riconoscibile, costruito con più possibilità a disposizione.</Reveal>
          </div>
        </div>
      </section>

      {/* Quattro cifre */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
          {figures.map((figure) => (
            <Reveal key={figure.value} delay={figure.delay} className="py-2 pl-8" style={{ borderLeft: '1px solid rgba(10,10,10,.12)' }}>
              <p className="disp" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', letterSpacing: '-0.06em' }}>{figure.value}</p>
              <p className="mt-4 max-w-[240px] text-[15px] leading-normal">{figure.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Più linguaggi: bento a tre colonne sfalsate */}
      <section id="servizi" className="scroll-mt-24 px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Più linguaggi, nello stesso progetto.</Reveal>

          <div className="mt-20 flex flex-col gap-6 md:mt-[80px] md:flex-row md:items-start">
            <div className="flex min-w-0 flex-1 flex-col">
              <LanguageCard
                icon={Sparkles}
                title="Asset su misura"
                desc="Visual, texture e composizioni che non arrivano da una banca immagini."
                items={['Creati con strumenti AI e diretti da noi', 'Rifiniti dentro un’identità coerente']}
                background={PAPER_BG}
              />
              <NoteCard text="Niente stock, niente pagine che sembrano già viste." />
            </div>

            <div className="flex min-w-0 flex-1 flex-col md:mt-[120px]">
              <LanguageCard
                icon={LayoutGrid}
                title="Il movimento racconta"
                desc="Video animati e sezioni che reagiscono allo scroll guidano la lettura e spiegano un servizio."
                items={['Rendono il sito riconoscibile', 'Fanno parte della struttura, non sono decorazione']}
                background="linear-gradient(150deg, #f7f5fb 0%, #efe7fb 100%)"
                delay={0.12}
              />
              <Reveal as="article" delay={0.12} className="bc ov justify-end text-white" style={{ minHeight: 260, background: '#050505' }}>
                <div className="aur" aria-hidden="true" style={{ width: 360, height: 360, background: 'rgba(147,51,234,.5)', right: -100, top: -140, filter: 'blur(80px)' }} />
                <p className="d relative text-gray-300" style={{ marginTop: 0 }}>Quando serve, la produzione è reale: foto e video originali entrano nello stesso progetto.</p>
              </Reveal>
            </div>

            <div className="flex min-w-0 flex-1 flex-col md:mt-10">
              <LanguageCard
                icon={Compass}
                title="Direzione umana"
                desc="Struttura, messaggio, scelte visive e controllo finale restano nostri."
                items={['L’AI accelera dove ha senso', 'Una call per capire cosa deve fare il sito']}
                background="#f7f5fb"
                delay={0.2}
              />
              <NoteCard text="AI e produzione sul campo non sono alternative: sono strumenti della stessa direzione." delay={0.2} />
            </div>
          </div>
        </div>
      </section>

      {/* Landing page in una settimana: blocco carta arrotondato */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 py-20 md:rounded-[56px] md:px-20 md:py-[100px]" style={{ background: PAPER_BG }}>
          <div className="dots" aria-hidden="true" />
          <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
            <div>
              <Reveal as="h2" className="h-l" style={CARD_TITLE}>Una pagina può essere pronta in una settimana.</Reveal>
              <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">Quando serve portare online un’offerta o una campagna senza aspettare un sito completo, concentriamo direzione, contenuto e sviluppo in una singola esperienza. Siti web da 2.999 €: forma, tempi e produzione si definiscono sul progetto.</Reveal>
            </div>
            <Reveal delay={0.12}>
              <BrowserMock />
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="chip">Direzione</span>
                <span className="chip">Contenuto</span>
                <span className="chip">Sviluppo</span>
                <span className="chip" style={{ background: '#9333ea', color: '#fff' }}>Online</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Caso studio GP Meccatronica: blocco scuro */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <div className="close px-7 py-24 md:px-20 md:py-[120px]">
          <div className="aur aur-1 opacity-80" aria-hidden="true" />
          <div className="aur aur-2 opacity-80" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1440px]">
            <p className="text-base font-medium" style={{ color: '#d8b4fe' }}>Caso studio · Rebranding e sito web</p>
            <Reveal as="h2" className="mt-6" style={{ color: '#fff', fontSize: 'clamp(3.2rem, 8.5vw, 9rem)', letterSpacing: '-0.06em', lineHeight: 0.92 }}>GP Meccatronica, dal rebranding al sito in movimento.</Reveal>
            <div className="mt-16 grid grid-cols-1 items-start gap-12 md:mt-24 md:grid-cols-2 md:gap-24">
              <div>
                <Reveal as="p" className="lead max-w-[560px] text-gray-300">Una direzione visiva scura e tecnica, motion design e asset generati con l’AI per accompagnare il traffico delle campagne ADV. Il sito arriva insieme al rebranding: fa parte della stessa identità.</Reveal>
                <Reveal delay={0.12} className="mt-10 flex flex-wrap gap-2.5">
                  {caseChips.map((chip) => (
                    <span key={chip} className="chip" style={{ background: 'rgba(255,255,255,.1)', color: '#e9d5ff' }}>{chip}</span>
                  ))}
                </Reveal>
                <Reveal delay={0.2} className="mt-12">
                  <a href="/casi-studio/gp-meccatronica-sito-web" className="btn btn-white">
                    Leggi il caso studio
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Reveal>
              </div>
              <Reveal delay={0.12} className="mock" style={{ background: 'rgba(255,255,255,.06)', boxShadow: '0 0 0 1px rgba(255,255,255,.12)' }}>
                {caseSteps.map((step) => (
                  <div key={step} className="ev" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.12)' }}><OkIcon />{step}</div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Tre fasi */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Tre fasi, non un modulo da compilare.</Reveal>
          <div className="mt-20 grid grid-cols-1 gap-6 md:mt-[80px] md:grid-cols-3">
            {phases.map((phase) => (
              <Reveal key={phase.title} delay={phase.delay} className="flex min-h-[360px] flex-col gap-7 rounded-[32px] bg-[#f7f5fb] px-7 py-8 md:p-11">
                <IconBox icon={phase.icon} />
                <div className="mt-auto">
                  <h3 style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{phase.title}</h3>
                  <p className="mt-3.5 text-base leading-[1.6]">{phase.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa serve da te: blocco carta arrotondato */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 py-20 md:rounded-[56px] md:px-20 md:py-[100px]" style={{ background: PAPER_BG }}>
          <div className="dots" aria-hidden="true" />
          <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
            <div>
              <Reveal as="h2" className="h-l" style={CARD_TITLE}>Cosa serve da te.</Reveal>
              <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">Se manca del materiale, lo produciamo insieme. Il resto lo mettiamo noi.</Reveal>
            </div>
            <Reveal delay={0.12} className="mock">
              <div className="ev"><OkIcon />Un obiettivo chiaro<em>cosa deve far fare il sito</em></div>
              <div className="ev"><OkIcon />Materiale esistente<em>logo, foto, testi, guideline</em></div>
              <div className="ev"><OkIcon />Un referente unico<em>valida le scelte</em></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
          <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
            {faqs.map((faq, i) => (
              <details key={faq.question} className="f" open={i === 0}>
                <summary>
                  <h3>{faq.question}</h3>
                  <span className="pl" aria-hidden="true"><Plus className="h-[18px] w-[18px]" /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <CloseCta
        size="l"
        title="Il prossimo sito non deve sembrare il precedente."
        lead="Raccontaci cosa deve fare, per chi e perché adesso. Partiamo da lì."
        cta={{ label: 'Parlaci del progetto', href: '#contatti', onClick: scrollToContact('Parlaci del progetto') }}
      />
    </article>
  );
};

export default SitesWebAI;
