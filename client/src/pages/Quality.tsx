import { useEffect } from 'react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from '../components/Footer';

const STANDARDS = [
  { title: 'GMP Certified', desc: 'All products manufactured in GMP (Good Manufacturing Practice) certified facilities meeting FDA regulatory standards.' },
  { title: 'Third-Party Tested', desc: 'Independent laboratory testing for purity, potency, heavy metals, microbials, and contaminants on every batch.' },
  { title: 'No Proprietary Blends', desc: 'Every ingredient and its exact dose is fully disclosed. No hidden formulas, no label manipulation.' },
  { title: 'Standardized Extracts', desc: 'Where applicable, we use standardized extracts (e.g., 50% EGCG, ≥99% Urolithin A) for consistent potency.' },
  { title: 'Bioavailability Enhanced', desc: 'Strategic use of BioPerine and enteric coating technology to optimize absorption and targeted delivery.' },
  { title: 'Clinically Relevant Dosing', desc: 'Ingredient doses are set at levels supported by published research, not minimum effective quantities for label claims.' },
];

export default function Quality() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[92%] max-w-6xl flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-8 bg-transparent border border-transparent rounded-full px-6 py-3">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert" />
          </a>
          <div className="hidden md:flex items-center gap-8 font-mono font-medium text-[12px] uppercase tracking-[0.2em]">
            <a href="/" className="text-white/60 hover:text-ar-teal transition-all">Home</a>
            <a href="/shop" className="text-white/60 hover:text-ar-teal transition-all">Shop</a>
            <a href="/science" className="text-white/60 hover:text-ar-teal transition-all">Science</a>
            <a href="/quality" className="text-ar-teal transition-all">Quality</a>
            <a href="/faq" className="text-white/60 hover:text-ar-teal transition-all">FAQ</a>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.18em]">Standards</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h1 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Age Revive
            <br />
            <span className="italic text-white/50">Quality.</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Transparency is a baseline, not a differentiator. Every formula is built on standardized dosing, clinical-grade sourcing, and third-party verification.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {STANDARDS.map((s) => (
              <div key={s.title} className="border border-white/[0.08] rounded-2xl p-6 space-y-3 bg-white/[0.02]">
                <h3 className="font-head text-lg uppercase tracking-[-0.02em]">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
