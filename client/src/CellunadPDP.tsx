import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Star,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteNavbar from './components/SiteNavbar';
import Footer from './components/Footer';
import { PRODUCT_IMAGES, PRODUCT_DETAIL_DATA } from './productData';
import { useCart } from './cartStore';
import { ImageCarousel, ModalFacts } from './ProductDetail';
import type { ProductDetailData } from './ProductDetail';

gsap.registerPlugin(ScrollTrigger);

const BASE_DARK = '#0A1220';
const SECONDARY_DARK = '#101B2D';
const LIGHT = '#F4F1EA';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ar-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

function StickyMobileBuyBar({ data, onAdd }: { data: ProductDetailData; onAdd: () => void }) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > 380;
      if (show && !rendered) setRendered(true);
      setVisible(show);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [rendered]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] lg:hidden transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ background: 'rgba(10,18,32,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-3 gap-4 safe-bottom">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/45 truncate">CELLUNAD+</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[16px] font-sans font-semibold text-white">${data.priceOneTime.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-white/30">/30 days</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className={`shrink-0 px-6 min-h-[44px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[10px] tracking-[0.10em] hover:brightness-110 active:scale-[0.97] transition-all ${focusRing}`}
          style={{ boxShadow: '0 0 16px rgba(45,212,191,0.15)' }}
          data-testid="sticky-add-to-cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function CellunadPDP({ data, slug }: { data: ProductDetailData; slug: string }) {
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const cart = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cn-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          opacity: 0, y: 20, duration: 0.8, ease: 'power3.out'
        });
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const images = PRODUCT_IMAGES.cellunad;
  const accentColor = data.accentText;

  const handleAddToCart = () => {
    cart.addItem({
      slug,
      name: data.name,
      image: images[0],
      price: data.priceOneTime,
      isSubscribe: false,
    });
  };

  const addStackItem = (stackSlug: string) => {
    const stackData = PRODUCT_DETAIL_DATA[stackSlug as keyof typeof PRODUCT_DETAIL_DATA];
    const stackImages = PRODUCT_IMAGES[stackSlug as keyof typeof PRODUCT_IMAGES];
    if (!stackData) return;
    cart.addItem({
      slug: stackSlug,
      name: stackData.name,
      image: stackImages?.[0] || '/images/product-bottle_1.jpg',
      price: stackData.priceSubscribe,
      isSubscribe: true,
      frequency: stackSlug === 'cellunova' ? '7-day cycle' : 'Delivered monthly',
    });
  };

  const savings = data.priceOneTime - data.priceSubscribe;

  return (
    <div ref={containerRef} className="min-h-screen font-sans antialiased selection:bg-blue-400/20 selection:text-white" style={{ backgroundColor: BASE_DARK }}>
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />
      <SiteNavbar />

      {/* ─── 1. HERO / BUY BOX ─── */}
      <section className="relative pt-16 lg:pt-0 overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-0 left-0 w-1/2 h-full" style={{ backgroundColor: '#f0f0ec' }} />
          <div className="absolute top-0 right-0 w-1/2 h-full" style={{ backgroundColor: BASE_DARK }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="lg:bg-transparent">
            <div className="lg:py-24 lg:pr-10 lg:px-0">
              <div className="hidden lg:block px-5 md:px-8">
                <ImageCarousel images={images} accent={data.accent} lightMode />
              </div>
              <div className="lg:hidden">
                <div className="py-4 px-5 md:px-8" style={{ backgroundColor: '#f0f0ec' }}>
                  <ImageCarousel images={images} accent={data.accent} lightMode />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:py-24 lg:pl-10 px-5 md:px-10 lg:px-0 text-white">
            <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-5 pt-5 lg:pt-0 pb-8 lg:pb-0">
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em]" style={{ color: accentColor }}>Daily NAD+ Foundation</p>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[0.06em] bg-blue-400/10 text-blue-300/80 border border-blue-400/15" data-testid="start-here-badge">Start Here</span>
                </div>
                <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
                  CELLUNAD+
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(data.rating);
                      const partial = !filled && i < data.rating;
                      return (
                        <span key={i} className="relative inline-block" style={{ width: 13, height: 13 }}>
                          <Star size={13} className="text-white/15 absolute inset-0" />
                          {(filled || partial) && (
                            <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? '100%' : `${(data.rating % 1) * 100}%` }}>
                              <Star size={13} className="text-amber-400/80 fill-amber-400/80" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-[12px] lg:text-[13px] text-white/40 font-sans">{data.rating} ({data.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              <p className="text-[14px] lg:text-[15px] text-white/55 font-sans leading-relaxed max-w-md">
                500 mg Nicotinamide Riboside with methylation and mitochondrial cofactor support. Non-stimulant daily formula for NAD+ pathway support.*
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">NR 500 mg</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">TMG 250 mg</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">R-Lipoic Acid 200 mg</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">Non-Stimulant</span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-[26px] font-sans font-semibold text-white tracking-tight">${data.priceOneTime.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-sans font-medium" style={{ color: accentColor }}>Subscribe: ${data.priceSubscribe.toFixed(2)}/mo</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(96,165,250,0.08)', color: accentColor }}>Save ${savings.toFixed(2)}</span>
                </div>
                <p className="text-[12px] text-white/35 font-sans">30-day supply · 2 capsules daily · Free US shipping</p>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 bg-ar-teal text-[#0A1220] rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 min-h-[50px] ${focusRing}`}
                style={{ boxShadow: '0 2px 16px rgba(45,212,191,0.2)' }}
                data-testid="hero-add-to-cart"
              >
                Add to Cart -- ${data.priceOneTime.toFixed(2)}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1 text-[10px] text-white/30 font-mono uppercase tracking-[0.06em]">
                {['30-day guarantee', 'Free shipping', 'Cancel anytime'].map((item, i) => (
                  <span key={item} className="flex items-center">
                    <span className="whitespace-nowrap">{item}</span>
                    {i < 2 && <span className="w-px h-[10px] bg-white/10 mx-3 shrink-0" />}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {['500 mg NR', 'Third-party tested', 'Fully disclosed label', 'No proprietary blends'].map((label) => (
                    <p key={label} className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/35">{label}</p>
                  ))}
                </div>
                <button
                  onClick={() => setIsFactsOpen(true)}
                  className={`text-[11px] font-mono uppercase tracking-[0.08em] text-white/40 hover:text-white/65 transition-colors ${focusRing} rounded`}
                  data-testid="view-supplement-facts"
                >
                  Supplement Facts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST STRIP — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Quality Standards</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>
              Built on transparency.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: 'cGMP Manufactured', desc: 'Produced in FDA-registered, cGMP-certified facilities.' },
              { title: 'Third-Party Tested', desc: 'Independent verification of purity, potency, and contaminants.' },
              { title: 'Full Label Disclosure', desc: 'Every ingredient and dose listed. No proprietary blends.' },
              { title: 'No Artificial Fillers', desc: 'Clean formulation. No unnecessary additives or excipients.' },
              { title: 'Vegan Formula', desc: 'Plant-based capsules. No animal-derived ingredients.' },
              { title: 'CoA by Lot', desc: 'Certificate of Analysis available for every production lot.' },
            ].map((item, i) => (
              <div
                key={i}
                className="cn-reveal bg-white rounded-lg px-5 py-5 md:py-6 border border-[#0A1220]/[0.05]"
                style={{ boxShadow: '0 1px 2px rgba(10,18,32,0.03)' }}
                data-testid={`trust-badge-${i}`}
              >
                <p className="text-[13px] md:text-[14px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{item.title}</p>
                <p className="mt-1.5 text-[12px] font-sans text-[#0A1220]/40 leading-[1.5]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. WHY START HERE — Secondary dark ─── */}
      <section className="cn-reveal py-[72px] md:py-[100px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Where to Begin</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)' }}>
              The daily foundation most people start with.
            </h2>
            <p className="mt-4 text-[14px] text-white/40 font-sans leading-relaxed max-w-[480px] mx-auto">
              NAD+ supports cellular energy, DNA maintenance, and metabolic resilience. It declines with age. CELLUNAD+ is built to support that pathway every day.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { num: '01', text: 'Designed as the daily foundation of the Age Revive system' },
              { num: '02', text: 'Supports NAD+ biosynthesis with a clinically studied 500 mg NR dose' },
              { num: '03', text: 'Includes methylation and mitochondrial cofactors most NR products leave out' },
              { num: '04', text: 'Non-stimulant -- supports energy metabolism, not temporary alertness' },
              { num: '05', text: 'Pairs naturally with CELLUBIOME or CELLUNOVA when you want to expand later' },
            ].map((item, i) => (
              <div
                key={i}
                className="cn-reveal flex items-start gap-4 px-5 py-4 md:px-6 md:py-5 rounded-lg border border-white/[0.05]"
                style={{ backgroundColor: '#15202F' }}
                data-testid={`start-here-${i}`}
              >
                <span className="font-mono text-[10px] font-bold text-ar-teal/50 tracking-[0.10em] mt-0.5 shrink-0">{item.num}</span>
                <span className="text-[14px] font-sans text-white/55 leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHY IT'S DIFFERENT — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">What Makes It Different</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>
              Not just another NR capsule.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {[
              { title: 'Clinically Studied NR Dose', body: '500 mg Nicotinamide Riboside -- the dose used in published NAD+ research. Not a micro-dosed token amount.' },
              { title: 'Methylation Co-Factor Support', body: 'NAD+ metabolism interacts with methylation pathways. CELLUNAD+ includes TMG, P-5-P, 5-MTHF, and Methylcobalamin to keep these pathways balanced.' },
              { title: 'Mitochondrial Cofactor Support', body: '200 mg R-Lipoic Acid supports mitochondrial oxidative balance. Apigenin supports NAD+ conservation. Most NR products skip both.' },
              { title: 'Full Transparency', body: 'Every ingredient, every dose, printed on the label. No proprietary blends. No mystery formulas. Certificate of Analysis available by lot.' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-6 md:p-7 border border-[#0A1220]/[0.05]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
                <h3 className="text-[15px] md:text-[16px] font-head font-normal uppercase tracking-[-0.01em]" style={{ color: BASE_DARK }}>{card.title}</h3>
                <p className="mt-3 text-[13px] font-sans text-[#0A1220]/50 leading-[1.6]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. CO-FACTORS / FORMULA ARCHITECTURE — Secondary dark ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Formula Architecture</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
              Why co-factors matter.
            </h2>
            <p className="mt-4 text-[14px] text-white/40 font-sans leading-relaxed max-w-[500px] mx-auto">
              Most NAD+ products deliver NR alone. CELLUNAD+ pairs it with the co-factors your cells need to metabolize NAD+ efficiently.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { layer: 'NAD+ Foundation', compound: 'Nicotinamide Riboside -- 500 mg', why: 'Clinically studied precursor. Cells use NR to synthesize NAD+, which supports energy production, DNA repair, and sirtuin activity.' },
              { layer: 'Methylation Balance', compound: 'TMG 250 mg + B6, Folate, B12', why: 'NAD+ biosynthesis consumes methyl groups. TMG and activated B vitamins replenish methylation capacity so NAD+ production does not deplete other pathways.' },
              { layer: 'Mitochondrial Cofactor', compound: 'R-Lipoic Acid -- 200 mg', why: 'Supports mitochondrial oxidative balance. Works alongside NAD+-dependent metabolic processes inside the mitochondria.' },
              { layer: 'NAD+ Conservation', compound: 'Apigenin -- 100 mg', why: 'Helps preserve NAD+ by supporting CD38 modulation. Keeps more of the NAD+ your body produces available for cellular use.' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 md:p-7 border rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(244,241,234,0.06)' }}
                data-testid={`cofactor-${i}`}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-[11px] font-bold text-ar-teal/50 tracking-[0.10em] mt-0.5 shrink-0">0{i + 1}</span>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="text-[15px] md:text-[16px] font-head font-normal uppercase tracking-[-0.02em] text-[#F4F1EA]/90">{item.layer}</h4>
                      <span className="font-mono text-[10px] text-ar-teal/60 tracking-[0.06em]">{item.compound}</span>
                    </div>
                    <p className="text-[13px] md:text-[14px] text-[#F4F1EA]/45 leading-[1.65] font-sans">{item.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. INGREDIENTS — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Supplement Facts</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              What's inside
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-[#0A1220]/[0.06] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
            <div className="px-6 md:px-8 pt-6 md:pt-7 pb-3 border-b border-[#0A1220]/[0.06]">
              <p className="text-[12px] font-sans text-[#0A1220]/40">Serving Size: {data.supplementFacts.servingSize} · Servings Per Container: {data.supplementFacts.servingsPerContainer}</p>
            </div>
            <div className="divide-y divide-[#0A1220]/[0.06]">
              {data.supplementFacts.items.map((item, i) => (
                <div key={i} className="px-6 md:px-8 py-3 flex justify-between items-baseline gap-4">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[14px] font-sans text-[#0A1220]/70">{item.name}</span>
                    <span className="text-[13px] font-sans font-semibold text-[#0A1220]/80">{item.amount}</span>
                  </div>
                  <span className="text-[12px] font-mono text-[#0A1220]/30 shrink-0">{item.dv || '†'}</span>
                </div>
              ))}
            </div>
            <div className="px-6 md:px-8 py-4 border-t border-[#0A1220]/[0.06] bg-[#0A1220]/[0.015]">
              <p className="text-[11px] font-sans text-[#0A1220]/35 leading-[1.5]">
                † Daily Value not established. Other Ingredients: {data.supplementFacts.otherIngredients}
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsFactsOpen(true)}
              className={`text-[11px] font-mono uppercase tracking-[0.10em] text-[#0A1220]/35 hover:text-[#0A1220]/60 transition-colors ${focusRing} rounded px-2`}
              data-testid="view-full-label"
            >
              View Full Supplement Facts →
            </button>
          </div>
        </div>
      </section>

      {/* ─── MID-PAGE CTA — Base dark ─── */}
      <section className="py-[56px] md:py-[72px] px-6 text-white" style={{ backgroundColor: BASE_DARK }}>
        <div className="max-w-md mx-auto text-center">
          <p className="text-[14px] font-sans text-white/45 leading-relaxed mb-5">
            500 mg NR + methylation co-factors + mitochondrial support. Non-stimulant. Fully transparent.
          </p>
          <button
            onClick={handleAddToCart}
            className={`px-10 min-h-[48px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] hover:brightness-110 active:scale-[0.97] transition-all ${focusRing}`}
            style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.18)' }}
            data-testid="mid-add-to-cart"
          >
            Add to Cart -- ${data.priceOneTime.toFixed(2)}
          </button>
          <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.06em] text-white/20">or ${data.priceSubscribe.toFixed(2)}/mo with subscription</p>
        </div>
      </section>

      {/* ─── 7. SCIENCE — Secondary dark ─── */}
      {(() => {
        const sci = data.scienceSection as any;
        return (
          <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 md:mb-14">
                <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">The Science</span>
                <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
                  {sci.headline}
                </h2>
              </div>

              <div className="max-w-[640px] mx-auto space-y-5">
                {sci.paragraphs.map((p: string, i: number) => (
                  <p key={i} className="text-[14px] md:text-[15px] text-[#F4F1EA]/50 leading-[1.65] font-sans" dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                {sci.microProof && (
                  <p className="text-[12px] font-mono uppercase tracking-[0.06em] text-[#F4F1EA]/25 pt-3">{sci.microProof}</p>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── 8. HOW TO USE — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">How to Use</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-tight" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>Simple daily routine</h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.05]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
              <p className="text-[17px] text-[#0A1220]/70 font-sans font-medium leading-relaxed text-center mb-6">Take 2 capsules daily. With or without food.</p>
              <div className="space-y-3 pt-4 border-t border-[#0A1220]/[0.06]">
                {[
                  'Consistency matters more than exact timing.',
                  'This is not a stimulant -- it supports cellular energy pathways, not temporary alertness.',
                  'Designed for daily use. Most people evaluate results after 8-12 weeks.',
                  'Stacks cleanly with CELLUBIOME for gut-mitochondria support.',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                    <span className="text-[13px] text-[#0A1220]/45 font-sans leading-snug">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. RESULTS OVER TIME — Secondary dark ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Results Over Time</span>
            <h2 className="font-head font-normal tracking-[-0.03em] uppercase leading-[0.95] text-white" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
              What consistent use looks like
            </h2>
            <p className="text-[13px] text-white/35 font-sans">{(data as any).timelineSubline}</p>
          </div>

          <div className="flex justify-center gap-1.5 md:gap-2 mb-8">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.06em] transition-all min-h-[34px] px-3.5 md:px-5 py-1.5 rounded-full whitespace-nowrap ${focusRing}`}
                style={activeTimeline === i
                  ? { background: LIGHT, color: BASE_DARK }
                  : { background: 'transparent', color: 'rgba(244,241,234,0.35)', border: '1px solid rgba(244,241,234,0.1)' }
                }
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="border border-white/[0.06] rounded-xl p-7 md:p-9 min-h-[180px]" style={{ backgroundColor: '#15202F' }}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] mb-5 text-white/60">{data.benefitsTimeline[activeTimeline].time}</h3>
            <ul className="space-y-3.5">
              {data.benefitsTimeline[activeTimeline].items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[14px] text-white/50 font-sans leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {(data as any).timelineConfidence && (
            <p className="text-center text-[11px] font-sans text-white/20 mt-5">{(data as any).timelineConfidence}</p>
          )}
        </div>
      </section>

      {/* ─── 10. WHO IT'S FOR — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Best For</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>
              CELLUNAD+ is designed for
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              'Adults looking for a daily NAD+ foundation product',
              'People who want non-stimulant cellular energy support',
              'Those prioritizing long-term mitochondrial function',
              'People who want a more complete formula than NR alone',
              'Anyone starting the Age Revive system for the first time',
              'Those who may later pair it with CELLUBIOME or CELLUNOVA',
            ].map((item, i) => (
              <div
                key={i}
                className="cn-reveal bg-white rounded-lg px-5 py-4 border border-[#0A1220]/[0.05]"
                style={{ boxShadow: '0 1px 2px rgba(10,18,32,0.03)' }}
                data-testid={`best-for-${i}`}
              >
                <span className="text-[13px] font-sans text-[#0A1220]/60 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. COMPARISON — Secondary dark ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Compare</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
              How CELLUNAD+ compares
            </h2>
          </div>

          <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#15202F' }}>
            <div className="grid grid-cols-2">
              <div className="px-5 md:px-7 py-4 border-b border-white/[0.06]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-ar-teal">CELLUNAD+</span>
              </div>
              <div className="px-5 md:px-7 py-4 border-b border-white/[0.06] border-l border-white/[0.06]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-white/25">Generic NAD+</span>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-5 md:px-7 py-5 space-y-3">
                {data.comparison.us.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                    <span className="text-[13px] font-sans text-white/55 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 md:px-7 py-5 space-y-3 border-l border-white/[0.06]">
                {data.comparison.them.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-white/15 shrink-0 mt-2" />
                    <span className="text-[13px] font-sans text-white/25 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12. PAIRS WELL WITH — Light ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">The System</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              Optional next steps
            </h2>
            <p className="mt-3 text-[13px] text-[#0A1220]/40 font-sans">Start with CELLUNAD+. Add more when you are ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.stack.map((item, i) => (
              <div
                key={i}
                className="cn-reveal bg-white rounded-xl p-6 md:p-7 space-y-3 border border-[#0A1220]/[0.05] hover:border-[#0A1220]/[0.12] transition-colors"
                style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
              >
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-[16px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>{item.name}</h4>
                  <span className="font-mono text-[9px] px-2.5 py-1 rounded uppercase shrink-0 text-[#0A1220]/30 border border-[#0A1220]/[0.08]">{item.role}</span>
                </div>
                <p className="text-[13px] text-[#0A1220]/45 font-sans leading-relaxed">{item.add}</p>
                <p className="text-[10px] font-mono text-[#0A1220]/25 uppercase tracking-[0.10em]">{item.when}</p>
                <div className="flex gap-3 pt-1">
                  <a
                    href={`/product/${item.slug}`}
                    className={`flex-1 py-2.5 border border-[#0A1220]/[0.10] rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.06em] hover:bg-[#0A1220]/[0.03] transition-colors text-center min-h-[38px] flex items-center justify-center text-[#0A1220]/40 hover:text-[#0A1220]/60 ${focusRing}`}
                    data-testid={`stack-view-${item.slug}`}
                  >
                    Learn More
                  </a>
                  <button
                    onClick={() => addStackItem(item.slug)}
                    className={`flex-1 py-2.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition-all min-h-[38px] bg-ar-teal text-[#0A1220] hover:brightness-110 active:scale-[0.97] ${focusRing}`}
                    data-testid={`stack-add-${item.slug}`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 13. FAQ — Secondary dark ─── */}
      <section className="cn-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Common Questions</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
              Before you start
            </h2>
          </div>

          <div className="border-t border-white/[0.06]">
            {data.faq.map((item, i) => (
              <div key={i} className="border-b border-white/[0.06]">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className={`w-full flex items-center justify-between py-5 md:py-6 text-left gap-6 min-h-[56px] ${focusRing} rounded`}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="text-[14px] md:text-[15px] font-sans font-semibold text-white/70 leading-snug">{item.q}</span>
                  <ChevronDown size={16} className={`shrink-0 text-white/20 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: faqOpen === i ? '400px' : '0', opacity: faqOpen === i ? 1 : 0 }}
                >
                  <p className="pb-6 text-[14px] font-sans text-white/40 leading-[1.65] pr-8">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 14. FINAL CTA — Base dark ─── */}
      <section className="relative py-[88px] md:py-[120px] px-6 text-white overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-[0.92]" style={{ fontSize: 'clamp(1.7rem, 5.5vw, 3rem)' }}>
            Start with the daily
            <br />
            <span className="text-white/30">NAD+ foundation.</span>
          </h2>
          <p className="mt-5 text-[14px] font-sans text-white/35 max-w-[36ch] mx-auto leading-[1.6]">
            500 mg NR. Methylation co-factors. Mitochondrial support. Non-stimulant. Fully disclosed. One daily protocol.
          </p>
          <div className="mt-7">
            <button
              onClick={handleAddToCart}
              className={`group relative px-10 min-h-[50px] inline-flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] overflow-hidden hover:scale-[1.02] active:scale-[0.97] transition-transform ${focusRing}`}
              style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.2), 0 0 24px rgba(45,212,191,0.06)' }}
              data-testid="final-add-to-cart"
            >
              <span className="relative z-10">Add to Cart -- ${data.priceOneTime.toFixed(2)}</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.06em] text-white/20">2 capsules daily · Non-stimulant · Fully disclosed</p>
          <div className="mt-3">
            <a href="/shop" className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/30 hover:text-white/50 transition-colors" data-testid="link-browse-products">
              Browse all products →
            </a>
          </div>
        </div>
      </section>

      <div className="px-6" style={{ backgroundColor: BASE_DARK }}>
        <div className="max-w-2xl mx-auto"><div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" /></div>
      </div>

      <div className="py-8 px-6 text-white" style={{ backgroundColor: BASE_DARK }}>
        <p className="font-mono text-[10px] text-white/15 uppercase tracking-[0.08em] leading-relaxed text-center max-w-3xl mx-auto">
          * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      <div style={{ backgroundColor: BASE_DARK }}>
        <Footer />
      </div>

      <StickyMobileBuyBar data={data} onAdd={handleAddToCart} />
    </div>
  );
}
