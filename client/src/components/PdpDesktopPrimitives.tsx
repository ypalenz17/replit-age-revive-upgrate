import type { ReactNode } from 'react';

const BASE_DARK = '#0A1220';
const SECONDARY_DARK = '#101B2D';
const LIGHT = '#F4F1EA';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ar-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

export function PdpHeroShell({
  mediaPanel,
  buyBox,
  mediaBg = '#f0f0ec',
  buyBoxBg = BASE_DARK,
  splitRatio = '6.5/5.5',
}: {
  mediaPanel: ReactNode;
  buyBox: ReactNode;
  mediaBg?: string;
  buyBoxBg?: string;
  splitRatio?: '6.5/5.5' | '6/6';
}) {
  return (
    <section className="relative pt-16 lg:pt-0 overflow-hidden" style={{ backgroundColor: buyBoxBg }}>
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute top-0 left-0 h-full" style={{ backgroundColor: mediaBg, width: splitRatio === '6/6' ? '50%' : '54.17%' }} />
        <div className="absolute top-0 right-0 h-full" style={{ backgroundColor: buyBoxBg, width: splitRatio === '6/6' ? '50%' : '45.83%' }} />
      </div>

      <div className="hidden lg:block relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-10 pt-24 xl:pt-8 pb-8">
          <div
            className="rounded-[28px] overflow-hidden grid min-h-[720px] xl:min-h-[760px]"
            style={{
              gridTemplateColumns: splitRatio === '6/6' ? '1fr 1fr' : '1.18fr 1fr',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }}
          >
            <div className="relative flex items-center justify-center" style={{ backgroundColor: mediaBg }}>
              <div className="w-full h-full flex items-center justify-center p-12 xl:p-14">
                {mediaPanel}
              </div>
            </div>
            <div className="relative flex flex-col justify-center" style={{ backgroundColor: buyBoxBg }}>
              <div className="px-12 xl:px-14 py-12 xl:py-14">
                {buyBox}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden relative z-10">
        <div style={{ backgroundColor: mediaBg }}>
          <div className="py-4 px-5 md:px-8">
            {mediaPanel}
          </div>
        </div>
        <div className="px-5 md:px-10 pt-5 pb-8 text-white" style={{ backgroundColor: buyBoxBg }}>
          {buyBox}
        </div>
      </div>
    </section>
  );
}

export function PdpSectionRow({
  eyebrow,
  heading,
  intro,
  children,
  bg = LIGHT,
  dark = false,
  tight = false,
  className = '',
  sectionId,
}: {
  eyebrow: string;
  heading: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  bg?: string;
  dark?: boolean;
  tight?: boolean;
  className?: string;
  sectionId?: string;
}) {
  const textColor = dark ? 'text-white' : '';
  const eyebrowColor = dark ? 'text-ar-teal/80' : 'text-ar-teal';
  const headColor = dark ? 'text-white' : '';
  const introColor = dark ? 'text-white/45' : 'text-[#0A1220]/50';
  const py = tight
    ? 'py-[64px] md:py-[88px] lg:py-[72px] xl:py-[72px]'
    : 'py-[72px] md:py-[100px] lg:py-[88px] xl:py-[88px]';

  return (
    <section
      id={sectionId}
      className={`${py} px-6 md:px-8 ${textColor} ${className}`}
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-5xl lg:max-w-[1360px] mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-4 xl:col-span-4 mb-10 md:mb-12 lg:mb-0">
            <div className="text-center lg:text-left lg:sticky lg:top-28">
              <span className={`font-mono text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.20em] ${eyebrowColor}`}>{eyebrow}</span>
              <h2
                className={`mt-3 lg:mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95] ${headColor}`}
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: dark ? undefined : BASE_DARK }}
              >
                {heading}
              </h2>
              {intro && (
                <p className={`mt-4 text-[14px] lg:text-[16px] font-sans leading-relaxed ${introColor} max-w-[480px] lg:max-w-none`}>
                  {intro}
                </p>
              )}
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PdpCenteredSection({
  eyebrow,
  heading,
  children,
  bg = LIGHT,
  dark = false,
  tight = false,
  maxWidth = '1360px',
  className = '',
}: {
  eyebrow?: string;
  heading?: ReactNode;
  children: ReactNode;
  bg?: string;
  dark?: boolean;
  tight?: boolean;
  maxWidth?: string;
  className?: string;
}) {
  const textColor = dark ? 'text-white' : '';
  const eyebrowColor = dark ? 'text-ar-teal/80' : 'text-ar-teal';
  const py = tight
    ? 'py-[56px] md:py-[72px] lg:py-[64px]'
    : 'py-[72px] md:py-[100px] lg:py-[88px]';

  return (
    <section className={`${py} px-6 md:px-8 ${textColor} ${className}`} style={{ backgroundColor: bg }}>
      <div className="mx-auto" style={{ maxWidth }}>
        {(eyebrow || heading) && (
          <div className="text-center mb-10 md:mb-12 lg:mb-10">
            {eyebrow && <span className={`font-mono text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.20em] ${eyebrowColor}`}>{eyebrow}</span>}
            {heading && (
              <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: dark ? '#fff' : BASE_DARK }}>
                {heading}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PdpSupplementFactsShell({
  eyebrow,
  heading,
  intro,
  onViewFacts,
  factsTable,
  dark = true,
  bg = SECONDARY_DARK,
}: {
  eyebrow: string;
  heading: ReactNode;
  intro: ReactNode;
  onViewFacts: () => void;
  factsTable: ReactNode;
  dark?: boolean;
  bg?: string;
}) {
  const textColor = dark ? 'text-white' : '';
  const eyebrowColor = dark ? 'text-ar-teal/80' : 'text-ar-teal';
  const headColor = dark ? 'text-white' : '';
  const introColor = dark ? 'text-white/45' : 'text-[#0A1220]/50';
  const linkColor = dark ? 'text-white/35 hover:text-white/55' : 'text-[#0A1220]/40 hover:text-[#0A1220]/65';

  return (
    <section className={`py-[72px] md:py-[110px] lg:py-[88px] px-6 md:px-8 ${textColor}`} style={{ backgroundColor: bg }}>
      <div className="max-w-5xl lg:max-w-[1360px] mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-4 mb-10 md:mb-12 lg:mb-0">
            <div className="text-center lg:text-left lg:sticky lg:top-28">
              <span className={`font-mono text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.20em] ${eyebrowColor}`}>{eyebrow}</span>
              <h2
                className={`mt-3 lg:mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95] ${headColor}`}
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: dark ? undefined : BASE_DARK }}
              >
                {heading}
              </h2>
              <p className={`mt-4 text-[14px] lg:text-[16px] font-sans leading-relaxed ${introColor}`}>
                {intro}
              </p>
              <button
                onClick={onViewFacts}
                className={`mt-5 text-[11px] font-mono uppercase tracking-[0.10em] ${linkColor} transition-colors ${focusRing} rounded hidden lg:inline-flex items-center gap-1.5`}
              >
                View Full Supplement Facts →
              </button>
            </div>
          </div>
          <div className="lg:col-span-8">
            {factsTable}
            <div className="text-center mt-6 lg:hidden">
              <button
                onClick={onViewFacts}
                className={`text-[11px] font-mono uppercase tracking-[0.10em] ${linkColor} transition-colors ${focusRing} rounded`}
              >
                View Full Supplement Facts →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PdpFaqShell({
  heading,
  intro,
  links,
  children,
  bg = LIGHT,
  dark = false,
}: {
  heading: ReactNode;
  intro?: ReactNode;
  links?: ReactNode;
  children: ReactNode;
  bg?: string;
  dark?: boolean;
}) {
  const eyebrowColor = dark ? 'text-ar-teal/80' : 'text-ar-teal';
  const introColor = dark ? 'text-white/40' : 'text-[#0A1220]/45';

  return (
    <section className={`py-[72px] md:py-[110px] lg:py-[88px] px-6 md:px-8 ${dark ? 'text-white' : ''}`} style={{ backgroundColor: bg }}>
      <div className="max-w-2xl lg:max-w-[1360px] mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-start">
          <div className="lg:col-span-4 mb-10 md:mb-12 lg:mb-0">
            <div className="text-center lg:text-left lg:sticky lg:top-28">
              <span className={`font-mono text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.20em] ${eyebrowColor}`}>Common Questions</span>
              <h2
                className="mt-3 lg:mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: dark ? '#fff' : BASE_DARK }}
              >
                {heading}
              </h2>
              {intro && <p className={`mt-4 text-[14px] lg:text-[16px] font-sans leading-relaxed ${introColor}`}>{intro}</p>}
              {links && <div className="hidden lg:block mt-6">{links}</div>}
            </div>
          </div>
          <div className="lg:col-span-8">
            {children}
            {links && <div className="lg:hidden mt-6 text-center">{links}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PdpFinalCtaBand({
  heading,
  sub,
  cta,
  footerNote,
  browseLink,
  bg = BASE_DARK,
}: {
  heading: ReactNode;
  sub: ReactNode;
  cta: ReactNode;
  footerNote?: string;
  browseLink?: ReactNode;
  bg?: string;
}) {
  return (
    <section className="relative py-[72px] md:py-[88px] lg:py-[64px] px-6 text-white overflow-hidden" style={{ backgroundColor: bg }}>
      <div className="max-w-2xl lg:max-w-3xl mx-auto text-center relative z-10">
        {heading}
        {sub}
        <div className="mt-7 lg:mt-6">{cta}</div>
        {footerNote && <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.06em] text-white/20">{footerNote}</p>}
        {browseLink && <div className="mt-3">{browseLink}</div>}
      </div>
    </section>
  );
}

export function PdpComparisonShell({
  eyebrow,
  heading,
  children,
  bg = LIGHT,
  dark = false,
}: {
  eyebrow: string;
  heading: ReactNode;
  children: ReactNode;
  bg?: string;
  dark?: boolean;
}) {
  const eyebrowColor = dark ? 'text-ar-teal/80' : 'text-ar-teal';

  return (
    <section className={`py-[72px] md:py-[110px] lg:py-[88px] px-6 md:px-8 ${dark ? 'text-white' : ''}`} style={{ backgroundColor: bg }}>
      <div className="max-w-3xl lg:max-w-[1180px] mx-auto">
        <div className="text-center lg:text-left mb-10 md:mb-14 lg:mb-10">
          <span className={`font-mono text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.20em] ${eyebrowColor}`}>{eyebrow}</span>
          <h2
            className="mt-3 lg:mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: dark ? '#fff' : BASE_DARK }}
          >
            {heading}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export { BASE_DARK, SECONDARY_DARK, LIGHT, focusRing };
