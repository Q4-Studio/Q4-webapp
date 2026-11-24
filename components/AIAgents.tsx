import React, { useEffect } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import { Bullets, OkIcon } from './home2/primitives';
import { aiAgentsFaqs, aiAgentsOffer, aiAgentsPackages, type AIAgentsPackage } from '../data/servicePages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink, scrollToId } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Pagina "Agenti AI e automazioni" sul sistema chiaro (mockup         */
/* "Agenti AI e automazioni"): hero scuro con aurora, poi sezioni su   */
/* bianco, bento dei tre pacchetti, FAQ, approfondimenti e chiusura.   */
/* Classi .home-light in index.css; reveal allo scroll via <Reveal>.   */
/* ------------------------------------------------------------------ */

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Agenti AI e Automazioni per PMI',
  description: 'Automazioni WhatsApp, CRM e assistenti virtuali con setup e canone pubblici per attività ripetitive B2B.',
  provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
  areaServed: 'IT',
  url: `${siteUrl}/agenti-ai`,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Pacchetti automazioni AI',
    itemListElement: aiAgentsPackages.map(aiAgentsOffer),
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Agenti AI', item: `${siteUrl}/agenti-ai` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: aiAgentsFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
};

const process = [
  { n: '01', title: 'Racconto del problema', desc: "Ci descrivi l'attività che oggi fa una persona a mano. Se non rientra in un pacchetto chiaro, te lo diciamo prima di iniziare, non a metà progetto." },
  { n: '02', title: 'Setup', desc: "Colleghiamo i sistemi che già usi (CRM, gestionale, WhatsApp) e configuriamo l'automazione sul processo reale, non su un caso generico." },
  { n: '03', title: 'Canone e assistenza', desc: 'Un canone mensile copre monitoraggio e aggiornamenti quando le piattaforme cambiano le regole. Disdetta libera, nessun vincolo pluriennale.' },
];

const related = [
  { tag: 'Prima', title: 'Prima le automazioni: hai già il tracciamento a posto?', desc: 'Il tracciamento viene prima di tutto il resto.', href: '/tracciamento-server-side' },
  { tag: 'Guida', title: 'Automazione WhatsApp nei processi aziendali', desc: 'Dal messaggio in arrivo al dato nel CRM.', href: '/risorse/whatsapp-automation-lead-b2b' },
  { tag: 'Guida', title: 'Second Brain aziendale: un agente AI per la conoscenza', desc: "La conoscenza dell'azienda, interrogabile.", href: '/risorse/second-brain-aziendale-agente-ai' },
];

const HERO_WORDS = ['Automazioni', 'concrete,', 'su', 'problemi', 'che', 'racconti', 'in', 'una', 'frase.'];

/** Setup e canone letti dal pacchetto (data/servicePages.ts). */
const Meta: React.FC<{ pack: AIAgentsPackage }> = ({ pack }) => (
  <div className="meta">
    <div><small>{pack.setup.label}</small><p className="price">{pack.setup.value}</p></div>
    <div><small>{pack.fee.label}</small><p className="price">{pack.fee.value}</p></div>
  </div>
);

/** "2 settimane" → "2": il numero grande, "settimane" in piccolo accanto.
 *  Il tracking negativo del display è in em del <p>: ereditato come px dallo
 *  span piccolo schiacciava "settimane". Con background-clip: text il
 *  tracking negativo taglia anche l'ultimo glifo, da cui il padding destro. */
const TimingCard: React.FC<{ timing: string; delay?: number }> = ({ timing, delay }) => {
  const value = timing.replace(/\s*settimane$/, '');
  return (
    <Reveal as="article" delay={delay} className="bc ov items-center justify-center text-center" style={{ minHeight: 240, background: '#f7f5fb' }}>
      <div className="dots" aria-hidden="true" />
      <p className="disp relative" style={{ fontSize: 'clamp(3.5rem, 5vw, 5rem)', letterSpacing: '-0.04em' }}>
        <span className="grad" style={{ paddingRight: '0.08em' }}>{value}</span>
        <span className="grad" style={{ fontSize: '.4em', letterSpacing: '-0.01em', paddingRight: '0.1em' }}>settimane</span>
      </p>
      <p className="relative mt-2.5 font-medium" style={{ color: '#0a0a0a' }}>per il setup</p>
    </Reveal>
  );
};

const [assistant, crm, whatsapp] = aiAgentsPackages;

const AIAgents: React.FC = () => {

  // Alias della vecchia ancora: #pacchetti-automazioni ora è #pacchetti.
  useEffect(() => {
    if (window.location.hash !== '#pacchetti-automazioni') return;
    const id = window.setTimeout(() => {
      scrollToId('pacchetti');
    }, 100);
    return () => window.clearTimeout(id);
  }, []);

  const scrollTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToId(id, id === 'contatti' ? 'center' : 'start')) event.preventDefault();
  };

  return (
    <article className="relative">
      <SEOHead title="Agenti AI e Automazioni per PMI | Q4 Studio" description="Automazioni WhatsApp, CRM e assistenti virtuali con tempi, setup e canoni pubblici. Soluzioni concrete per le attività ripetitive delle PMI." url={`${siteUrl}/agenti-ai`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero scuro: id="hero" fa restare bianchi logo e hamburger della nav
          finché non si scorre oltre (vedi App.tsx). */}
      <header id="hero" className="dark-block relative flex min-h-[640px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[780px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-24 pt-36 md:px-12 md:pt-40">
          <h1 className="h-sub max-w-[1250px]">
            {HERO_WORDS.map((word, i) => (
              <React.Fragment key={word}>
                <span className="w" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w-block lead mt-12 max-w-[620px] text-gray-300" style={{ animationDelay: '1.1s' }}>
            Assistenti sul sito, follow-up nel CRM e richieste WhatsApp già strutturate. Sai prima cosa serve, quanto tempo richiede e quanto costa.
          </p>
          <div className="w-block mt-12" style={{ animationDelay: '1.25s' }}>
            <a
              href="#pacchetti"
              onClick={(event) => {
                trackCtaClick({ cta_location: 'agenti_ai_page', cta_label: 'Vedi i pacchetti', cta_destination: '#pacchetti' });
                scrollTo('pacchetti')(event);
              }}
              className="btn btn-white"
            >
              Vedi i pacchetti
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Un problema alla volta */}
      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[140px] md:pt-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Un problema alla volta.</Reveal>
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-[80px] md:grid-cols-2 md:gap-24">
            <Reveal as="p" className="lead max-w-[560px]">Non vendiamo progetti di "digital transformation" con output vago e tempi lunghi. Ogni pacchetto risolve un'attività specifica che oggi fa una persona a mano, con un prezzo di setup e un canone dichiarati prima di iniziare.</Reveal>
            <Reveal as="p" delay={0.12} className="lead max-w-[560px]">Se il problema che ci racconti non rientra in uno di questi tre, te lo diciamo subito: non costruiamo un pacchetto su misura solo per vendere qualcosa. Automazioni e agenti AI vengono dopo il tracciamento, non prima: senza dati affidabili su cosa funziona, automatizzare un processo rotto lo rende solo più veloce a rompersi.</Reveal>
          </div>
        </div>
      </section>

      {/* Tre passaggi */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Tre passaggi.</Reveal>
          <div className="mt-20 md:mt-[80px]">
            {process.map((step) => (
              <Reveal key={step.n} as="article" className="row">
                <span className="tm">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pacchetti: bento a tre colonne sfalsate */}
      <section id="pacchetti" className="scroll-mt-24 px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l max-w-[1100px]">Scegli il lavoro ripetitivo da togliere al team.</Reveal>

          <div className="mt-20 flex flex-col gap-6 md:mt-[80px] lg:flex-row lg:items-start">
            {/* Colonna 1: assistente virtuale */}
            <div className="flex min-w-0 flex-1 flex-col">
              <Reveal as="article" className="bc" style={{ minHeight: 760, paddingBottom: 120, background: 'linear-gradient(170deg, #f7f5fb 0%, #efe7fb 100%)' }}>
                <h3>{assistant.title}</h3>
                <p className="d"><strong style={{ color: '#0a0a0a' }}>Il problema.</strong> {assistant.problem}</p>
                <Bullets items={assistant.requirements} />
                <div className="mock chat mt-8 p-5" aria-hidden="true">
                  <div className="bub">Domanda frequente, anche fuori orario</div>
                  <div className="bub me">Risposta nel tuo tono di voce, validata da te</div>
                </div>
                <Meta pack={assistant} />
              </Reveal>
              <TimingCard timing={assistant.timing} />
            </div>

            {/* Colonna 2: automazioni CRM */}
            <div className="flex min-w-0 flex-1 flex-col lg:mt-[120px]">
              <Reveal as="article" delay={0.12} className="bc" style={{ minHeight: 760, paddingBottom: 120, background: 'linear-gradient(150deg, #f7f5fb 0%, #ecdffb 100%)' }}>
                <h3>{crm.title}</h3>
                <p className="d"><strong style={{ color: '#0a0a0a' }}>Il problema.</strong> {crm.problem}</p>
                <div className="mock mt-8">
                  {crm.actions!.map((action) => (
                    <div key={action} className="ev"><OkIcon />{action}</div>
                  ))}
                </div>
                <Bullets items={crm.requirements} />
                <Meta pack={crm} />
              </Reveal>
              <TimingCard timing={crm.timing} delay={0.12} />
            </div>

            {/* Colonna 3: richieste WhatsApp + sconto caso studio */}
            <div className="flex min-w-0 flex-1 flex-col lg:mt-10">
              <Reveal as="article" delay={0.2} className="bc" style={{ minHeight: 760, paddingBottom: 120 }}>
                <h3>{whatsapp.title}</h3>
                <p className="d"><strong style={{ color: '#0a0a0a' }}>Il problema.</strong> {whatsapp.problem}</p>
                <p className="d" style={{ marginTop: 12 }}>{whatsapp.description}</p>
                <div className="mock chat mt-7 p-5" aria-hidden="true">
                  <div className="bub">Ciao, vorrei un preventivo</div>
                  <div className="bub">è per un capannone a Modena</div>
                  <div className="chips mt-1.5">
                    <span className="chip">Cosa</span><span className="chip">Dove</span><span className="chip">Quando</span><span className="chip">Quanto</span>
                  </div>
                  <div className="bub me">Prima risposta in meno di un minuto</div>
                </div>
                <Bullets items={whatsapp.requirements} />
                <Meta pack={whatsapp} />
              </Reveal>
              {/* Sconto caso studio: setup ridotto in cambio del racconto del progetto,
                  con prezzo, condizioni e tempi separati così che si leggano a colpo d'occhio.
                  Niente "offerta di lancio" o "primi clienti": non deve sembrare un servizio nuovo. */}
              {whatsapp.pilot && (
                <Reveal as="article" delay={0.2} className="bc ov dark-block justify-end text-white" style={{ minHeight: 300, background: '#050505' }}>
                  <div className="aur" aria-hidden="true" style={{ width: 360, height: 360, background: 'rgba(147,51,234,.5)', right: -100, top: -140, filter: 'blur(80px)' }} />
                  <p className="relative m-0 text-[17px] font-medium text-purple-300">{whatsapp.pilot.title}</p>
                  <h3 className="relative mt-3" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)' }}>
                    Setup a {whatsapp.pilot.setup} invece di {whatsapp.pilot.listSetup} se raccontiamo il tuo progetto
                  </h3>
                  <p className="d relative text-gray-300" style={{ marginTop: 18 }}>Cosa chiediamo in cambio:</p>
                  <ul className="relative mt-3 list-none space-y-2.5 p-0 text-[19px] leading-[1.5] text-white">
                    {whatsapp.pilot.terms.map((term) => (
                      <li key={term} className="flex gap-3"><OkIcon />{term}</li>
                    ))}
                  </ul>
                  <p className="relative mt-6 border-t border-white/15 pt-5 text-[17px] text-gray-300">Tempi di setup: {whatsapp.timing}, gli stessi del prezzo pieno.</p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
          <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
            {aiAgentsFaqs.map((faq, i) => (
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

      {/* Approfondisci */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" className="h-l">Approfondisci</Reveal>
          <div className="mt-20 md:mt-[80px]">
            {related.map((item) => (
              <Reveal key={item.href} as="div" className="row">
                <span className="tm">{item.tag}</span>
                <h3><a href={item.href} onClick={onInternalLink(item.href)} className="no-underline hover:text-purple-700">{item.title}</a></h3>
                <p>{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CloseCta
        size="l"
        title="Quale attività stai ancora facendo a mano?"
        lead="Raccontala in una frase. Ti diciamo se uno di questi pacchetti è il punto di partenza giusto."
        cta={{
          label: 'Scrivici',
          href: '#contatti',
          onClick: (event) => {
            trackCtaClick({ cta_location: 'agenti_ai_page', cta_label: 'Scrivici', cta_destination: '#contatti' });
            scrollTo('contatti')(event);
          },
        }}
      />
    </article>
  );
};

export default AIAgents;
