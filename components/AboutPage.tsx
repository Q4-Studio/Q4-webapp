import React from 'react';
import { FileText, ShieldCheck, Sparkles } from 'lucide-react';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import CloseCta from './home2/CloseCta';
import { OkIcon, PaperBlock } from './home2/primitives';
import { IconBox } from './ResourceCard';
import { aboutPageCopy as copy, company } from '../data/companyPages';
import { siteUrl } from '../data/seoPages';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Chi siamo sul sistema chiaro (mockup About.html). Testi, prezzi e    */
/* dati aziendali da data/companyPages.ts, gli stessi del mirror        */
/* statico e del markdown. Form contatti e footer chiari in App.tsx.    */
/* ------------------------------------------------------------------ */

const PRINCIPLE_ICONS = [FileText, Sparkles, ShieldCheck];
const CARD_TITLE_STYLE: React.CSSProperties = { fontSize: 'clamp(1.6rem, 2.3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.05 };
const LINK_CLASS = 'text-[#0a0a0a] underline decoration-purple-400 underline-offset-4 hover:text-purple-700';

const AboutPage: React.FC = () => {
  const pageUrl = `${siteUrl}/about`;
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: copy.metaTitle,
    url: pageUrl,
    mainEntity: { '@id': `${siteUrl}/#organization` },
  };
  const { founder, principles, figures, companyData, close } = copy;

  return (
    <section className="relative">
      <SEOHead title={copy.metaTitle} description={copy.metaDescription} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      <SubHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />

      {/* Il fondatore: testo a sinistra, card con foto, nome e ruolo a destra. */}
      <section className="px-6 pb-24 pt-24 md:pb-[160px] md:pt-[160px]" aria-labelledby="fondatore">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" id="fondatore" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>{founder.title}</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">{founder.text}</Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="mock flex items-center gap-6 p-7 md:gap-7 md:p-11">
              <img
                src={company.founderPhoto}
                alt={`${company.founder}, fondatore di Q4 Studio`}
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 flex-none rounded-full object-cover object-top md:h-24 md:w-24"
              />
              <div className="min-w-0">
                <p className="m-0 text-[22px] font-semibold tracking-[-0.03em] text-[#0a0a0a] md:text-[26px]">{company.founder}</p>
                <p className="m-0 mt-1.5 text-[16px]">{company.founderRole}</p>
              </div>
            </div>
          </Reveal>
        </PaperBlock>
      </section>

      {/* Tre principi */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-labelledby="principi">
        <div className="mx-auto max-w-[1440px]">
          <Reveal as="h2" id="principi" className="h-l max-w-[1100px]">{principles.title}</Reveal>
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-[120px] lg:grid-cols-3">
            {principles.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="flex min-h-[320px] flex-col gap-7 rounded-[32px] bg-[#f7f5fb] px-7 py-8 md:min-h-[360px] md:p-11">
                <IconBox icon={PRINCIPLE_ICONS[i] ?? FileText} />
                <div className="mt-auto">
                  <h3 style={CARD_TITLE_STYLE}>{item.title}</h3>
                  <p className="mt-3.5 text-base leading-[1.6]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fila di cifre: i prezzi pubblici di partenza */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]" aria-label="Prezzi pubblici">
        <ul className="mx-auto m-0 grid max-w-[1440px] list-none grid-cols-1 gap-10 p-0 md:grid-cols-3 md:gap-6">
          {figures.map((figure, i) => (
            <li key={figure.caption} className="m-0">
              <Reveal delay={i * 0.1} className="py-2 pl-8" style={{ borderLeft: '1px solid rgba(10,10,10,.12)' }}>
                <p className="disp m-0 whitespace-nowrap" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', letterSpacing: '-0.06em' }}>{figure.value}</p>
                <p className="m-0 mt-4 max-w-[260px] text-[16px] leading-[1.5]">{figure.caption}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Dati aziendali */}
      <section className="px-6 pb-24 md:pb-[160px]" aria-labelledby="dati-aziendali">
        <PaperBlock className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" id="dati-aziendali" className="h-l" style={{ fontSize: 'clamp(2.75rem, 5.6vw, 5.5rem)' }}>{companyData.title}</Reveal>
            <Reveal as="p" className="lead mt-7 max-w-[560px] text-gray-700">{companyData.lead}</Reveal>
            <Reveal as="p" delay={0.08} className="mt-6 max-w-[560px] text-[19px] leading-[1.6] text-gray-700">
              Profili verificati:{' '}
              {companyData.profiles.map((profile, i) => (
                <React.Fragment key={profile.href}>
                  {i > 0 && ' · '}
                  <a
                    href={profile.href}
                    {...(profile.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onInternalLink(profile.href) })}
                    className={LINK_CLASS}
                  >
                    {profile.label}
                  </a>
                </React.Fragment>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <dl className="mock m-0">
              {companyData.rows.map((row) => (
                <div key={row.label} className="ev flex-wrap">
                  <OkIcon />
                  <dt>{row.label}</dt>
                  <dd className="m-0 ml-auto text-right" style={{ fontSize: 16, color: 'var(--mute)' }}>
                    {row.href ? <a href={row.href} className="hover:text-purple-700">{row.value}</a> : row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </PaperBlock>
      </section>

      <CloseCta
        size="l"
        title={close.title}
        lead={close.lead}
        cta={{
          label: close.cta,
          href: close.href,
          onClick: () => trackCtaClick({ cta_location: 'about_page', cta_label: close.cta, cta_destination: close.href }),
        }}
      />
    </section>
  );
};

export default AboutPage;
