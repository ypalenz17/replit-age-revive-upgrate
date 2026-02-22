import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from '../components/Footer';

const QUESTIONS = [
  {
    q: 'What is the Age Revive protocol?',
    a: 'The Age Revive protocol is a three-product system targeting cellular energy, gut–mitochondria signaling, and autophagy. CELLUNAD+ and CELLUBIOME are taken daily, while CELLUNOVA is cycled for 7 consecutive days per month.',
  },
  {
    q: 'Do I need to take all three products?',
    a: 'Each product works independently, but they are designed as an integrated system. CELLUNAD+ is the daily NAD+ backbone, CELLUBIOME targets the gut–mito axis, and CELLUNOVA provides periodic cellular cleanup support.',
  },
  {
    q: 'Why is CELLUNOVA a 7-day cycle?',
    a: 'CELLUNOVA is designed as a cyclical protocol, not a daily supplement. The 7-day on / 23-day off cadence is intentional — the off-cycle is part of the protocol design, allowing the body\'s natural cellular maintenance processes to respond.',
  },
  {
    q: 'Are your products third-party tested?',
    a: 'Yes. All Age Revive products are manufactured in GMP-certified facilities and undergo third-party testing for purity, potency, and contaminants. No proprietary blends are used.',
  },
  {
    q: 'What does "protocol-grade" mean?',
    a: 'Protocol-grade means every ingredient is dosed at clinically relevant levels, sourced for standardized potency, and designed as part of a defined system — not a standalone multivitamin or generic blend.',
  },
  {
    q: 'Can I take these with other supplements?',
    a: 'Consult your healthcare provider before combining with other supplements or medications, especially if you have existing health conditions.',
  },
  {
    q: 'What is the recommended order to start?',
    a: 'Start with CELLUNAD+ as your daily NAD+ foundation. Add CELLUBIOME for gut–mitochondria support. Once established, introduce CELLUNOVA as your monthly 7-day renewal cycle.',
  },
  {
    q: 'Are there any allergens?',
    a: 'CELLUNOVA contains wheat (spermidine source from wheat germ). Check individual product labels for full allergen information. All products are free from artificial colors, flavors, and preservatives.',
  },
];

export default function FAQ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-[150] bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert" />
          </a>
          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            <a href="/" className="text-white/55 hover:text-teal-300 transition-colors" data-testid="nav-link-home">Home</a>
            <a href="/shop" className="text-white/55 hover:text-teal-300 transition-colors" data-testid="nav-link-shop">Shop</a>
            <a href="/science" className="text-white/55 hover:text-teal-300 transition-colors" data-testid="nav-link-science">Science</a>
            <a href="/quality" className="text-white/55 hover:text-teal-300 transition-colors" data-testid="nav-link-quality">Quality</a>
            <a href="/faq" className="text-teal-300 transition-colors" data-testid="nav-link-faq">FAQ</a>
          </div>
          <a href="/shop" className="flex items-center gap-2 px-4 sm:px-5 min-h-[44px] bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] hover:bg-ar-teal/90 transition-colors" data-testid="nav-shop-cta">Shop</a>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.22em]">Support</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h1 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Frequently Asked
            <br />
            <span className="text-white/55">Questions.</span>
          </h1>
        </div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {QUESTIONS.map((item, i) => (
            <div key={i} className="border border-white/[0.08] rounded-xl bg-white/[0.04] overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left min-h-[44px]"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="font-medium text-white/80 pr-4">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-white/40 shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
