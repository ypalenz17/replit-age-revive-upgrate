import { useEffect } from 'react';
import { Link } from 'wouter';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from '../components/Footer';

const HALLMARKS = [
  { title: 'Genomic Stability', protocol: 'CELLUNAD+', desc: 'DNA maintenance pathways drive daily cellular resilience and repair.', tags: ['NAD+', 'Sirtuins'] },
  { title: 'Telomere Integrity', protocol: 'CELLUNAD+', desc: 'Telomere biology supports healthy cellular aging and replication fidelity.', tags: ['NMN', 'Longevity'] },
  { title: 'Epigenetic Signaling', protocol: 'CELLUBIOME', desc: 'Gut-derived metabolites modulate gene expression and energy homeostasis.', tags: ['Methylation', 'Gut Axis'] },
  { title: 'Nutrient Sensing', protocol: 'CELLUNOVA', desc: 'Cellular maintenance signals activated through cyclical fasting-mimetic design.', tags: ['AMPK', 'mTOR'] },
  { title: 'Mitochondrial Function', protocol: 'CELLUBIOME', desc: 'Mitochondrial renewal signaling powers cellular energy efficiency.', tags: ['Mitophagy', 'ATP'] },
  { title: 'Cellular Senescence', protocol: 'CELLUNOVA', desc: 'Periodic senolytic cycles support cellular cleanup and tissue renewal.', tags: ['Fisetin', 'Quercetin'] },
];

export default function Science() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[92%] max-w-6xl flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-8 bg-transparent border border-transparent rounded-full px-6 py-3">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert" />
          </a>
          <div className="hidden md:flex items-center gap-8 font-mono font-medium text-[10px] uppercase tracking-[0.2em]">
            <a href="/" className="text-white/60 hover:text-ar-teal transition-all">Home</a>
            <a href="/shop" className="text-white/60 hover:text-ar-teal transition-all">Shop</a>
            <a href="/science" className="text-ar-teal transition-all">Science</a>
            <a href="/quality" className="text-white/60 hover:text-ar-teal transition-all">Quality</a>
            <a href="/faq" className="text-white/60 hover:text-ar-teal transition-all">FAQ</a>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.22em]">Scientific Rationale</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h1 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Age Revive
            <br />
            <span className="italic text-white/50">Science.</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Every ingredient is chosen for its mechanistic evidence, not marketing trends. We publish full dosing, sourcing, and rationale.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-head text-2xl uppercase tracking-[-0.03em] mb-10 text-white/80">Hallmarks of Aging</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {HALLMARKS.map((h) => (
              <div key={h.title} className="border border-white/[0.08] rounded-2xl p-6 space-y-3 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <h3 className="font-head text-lg uppercase tracking-[-0.02em]">{h.title}</h3>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ar-teal">{h.protocol}</p>
                <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
                <div className="flex gap-2">
                  {h.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-head text-2xl uppercase tracking-[-0.03em] text-white/80">The Systems Axis</h2>
          <div className="space-y-6 text-white/50 leading-relaxed">
            <p>The Age Revive protocol addresses aging through three coordinated biological layers, each targeting distinct but interconnected cellular mechanisms.</p>
            <div className="border border-white/[0.08] rounded-2xl p-6 bg-white/[0.02] space-y-4">
              <h3 className="font-head text-lg uppercase text-white/70">NAD+ Metabolism</h3>
              <p>Nicotinamide Riboside (NR) serves as a precursor to NAD+, essential for energy metabolism, DNA repair, and sirtuin activation. Supported by TMG and methylated B vitamins for complete pathway coverage.</p>
            </div>
            <div className="border border-white/[0.08] rounded-2xl p-6 bg-white/[0.02] space-y-4">
              <h3 className="font-head text-lg uppercase text-white/70">Gut–Mitochondria Signaling</h3>
              <p>Urolithin A supports mitophagy (mitochondrial recycling) while tributyrin provides butyrate for gut barrier integrity. Enteric-coated for precision delivery beyond the upper GI.</p>
            </div>
            <div className="border border-white/[0.08] rounded-2xl p-6 bg-white/[0.02] space-y-4">
              <h3 className="font-head text-lg uppercase text-white/70">Autophagy & Cellular Maintenance</h3>
              <p>Cyclical 7-day protocols with polyphenols (fisetin, quercetin, resveratrol) and cellular cofactors (PQQ, spermidine) support periodic cellular cleanup. The off-cycle is part of the design.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
