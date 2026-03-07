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
import {
  PdpHeroShell,
  PdpSectionRow,
  PdpCenteredSection,
  PdpSupplementFactsShell,
  PdpFaqShell,
  PdpFinalCtaBand,
  PdpComparisonShell,
  BASE_DARK,
  SECONDARY_DARK,
  LIGHT,
  focusRing,
} from './components/PdpDesktopPrimitives';

gsap.registerPlugin(ScrollTrigger);

function StickyMobileBuyBar({ price, onAdd }: { price: number; onAdd: () => void }) {
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
      style={{ background: 'rgba(10,18,32,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-3 gap-4 safe-bottom">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/45 truncate">CELLUNOVA · 7-Day Cycle</p>
          <span className="text-[16px] font-sans font-semibold text-white">${price.toFixed(2)}</span>
        </div>
        <button
          onClick={onAdd}
          className={`shrink-0 px-5 min-h-[44px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[10px] tracking-[0.08em] hover:brightness-110 active:scale-[0.97] transition-all ${focusRing}`}
          style={{ boxShadow: '0 0 16px rgba(45,212,191,0.15)' }}
          data-testid="sticky-add-to-cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function HeroBuyBox({ data, savings, onAdd, onViewFacts }: { data: ProductDetailData; savings: number; onAdd: () => void; onViewFacts: () => void }) {
  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="space-y-2 lg:space-y-3">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em] text-ar-teal">Periodic Cellular Renewal</p>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[0.06em] bg-ar-teal/10 text-ar-teal border border-ar-teal/20" data-testid="protocol-badge">7-Day Cycle</span>
        </div>
        <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
          CELLUNOVA
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
        7-day monthly protocol for autophagy-related support and mitochondrial resilience. {data.supplementFacts.items.length} fully disclosed compounds. Not a daily supplement.*
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">7 Days On / 23 Days Off</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">{data.supplementFacts.items.length} Compounds</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">Fully Disclosed</span>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-baseline gap-3">
          <span className="text-[26px] font-sans font-semibold text-white tracking-tight">${data.priceOneTime.toFixed(2)}</span>
          <span className="text-[12px] text-white/30 font-sans">/ 7-day cycle</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-sans font-medium text-ar-teal">Subscribe: ${data.priceSubscribe.toFixed(2)}/mo</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2 py-0.5 rounded bg-ar-teal/10 text-ar-teal">Save ${savings.toFixed(2)}</span>
        </div>
        <p className="text-[12px] text-white/35 font-sans">7-day supply · 5 capsules daily for 7 days · Ships monthly</p>
      </div>

      <button
        onClick={onAdd}
        className={`w-full py-3.5 bg-ar-teal text-[#0A1220] rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center min-h-[50px] ${focusRing}`}
        style={{ boxShadow: '0 2px 16px rgba(45,212,191,0.2)' }}
        data-testid="hero-add-to-cart"
      >
        Add to Cart -- ${data.priceOneTime.toFixed(2)}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1 text-[10px] text-white/30 font-mono uppercase tracking-[0.06em]">
        {['Ships monthly', 'Cancel anytime', 'Free US shipping'].map((item, i) => (
          <span key={item} className="flex items-center">
            <span className="whitespace-nowrap">{item}</span>
            {i < 2 && <span className="w-px h-[10px] bg-white/10 mx-3 shrink-0" />}
          </span>
        ))}
      </div>

      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {['Full label disclosure', 'Third-party tested', 'No proprietary blends', '5 capsules / 7 days'].map((label) => (
            <p key={label} className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/35">{label}</p>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewFacts}
            className={`text-[11px] font-mono uppercase tracking-[0.08em] text-white/40 hover:text-white/65 transition-colors ${focusRing} rounded`}
            data-testid="view-supplement-facts"
          >
            Supplement Facts →
          </button>
          <span className="text-[10px] font-mono text-amber-400/50 uppercase tracking-[0.06em]">Contains wheat</span>
        </div>
      </div>
    </div>
  );
}

export default function CellunovaPDP({ data, slug }: { data: ProductDetailData; slug: string }) {
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const cart = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cv-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          opacity: 0, y: 20, duration: 0.8, ease: 'power3.out'
        });
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const images = PRODUCT_IMAGES.cellunova;

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
      frequency: 'Delivered monthly',
    });
  };

  const savings = data.priceOneTime - data.priceSubscribe;

  return (
    <div ref={containerRef} className="min-h-screen font-sans antialiased selection:bg-teal-400/20 selection:text-white" style={{ backgroundColor: BASE_DARK }}>
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />
      <SiteNavbar />

      {/* ─── 1. HERO / BUY BOX ─── */}
      <PdpHeroShell
        splitRatio="6/6"
        mediaPanel={<ImageCarousel images={images} accent={data.accent} lightMode />}
        buyBox={
          <HeroBuyBox
            data={data}
            savings={savings}
            onAdd={handleAddToCart}
            onViewFacts={() => setIsFactsOpen(true)}
          />
        }
      />

      {/* ─── 2. WHAT MAKES IT DIFFERENT — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="What makes it different"
        heading="Why this is not a daily longevity blend."
        intro="CELLUNOVA is a defined 7-day monthly protocol. The time between cycles is part of the design."
        bg={LIGHT}
        className="cv-reveal"
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {[
            { title: '7-day monthly cycle', desc: 'Designed for a defined 7-day window, not everyday use.' },
            { title: 'Not a daily baseline', desc: 'Meant to layer onto the daily foundation, not replace it.' },
            { title: 'Fully disclosed doses', desc: 'Every ingredient and dose is listed for direct evaluation.' },
            { title: 'Periodic protocol logic', desc: 'Format and cadence are part of what makes it distinct.' },
            { title: 'Mitochondrial resilience included', desc: 'Formula goes beyond single-theme autophagy positioning.' },
            { title: 'Contains wheat', desc: 'Spermidine is sourced from wheat germ and should be checked before use.' },
          ].map((item, i) => (
            <div
              key={i}
              className="cv-reveal bg-white rounded-lg lg:rounded-xl px-5 py-5 lg:px-6 lg:py-7 border border-[#0A1220]/[0.06]"
              style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
              data-testid={`trust-badge-${i}`}
            >
              <p className="text-[13px] lg:text-[14px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{item.title}</p>
              <p className="mt-1.5 text-[12px] lg:text-[13px] font-sans text-[#0A1220]/50 leading-[1.5]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-lg px-5 py-4 border border-amber-500/15" style={{ boxShadow: '0 1px 2px rgba(10,18,32,0.03)' }}>
          <p className="text-[12px] font-sans text-[#0A1220]/55 leading-[1.6]">
            <span className="font-semibold text-[#0A1220]/70">Before you start:</span> Contains wheat (from wheat germ derived spermidine). Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.
          </p>
        </div>
      </PdpSectionRow>

      {/* ─── 3. WHO IT'S FOR — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="Best For"
        heading="CELLUNOVA is designed for"
        bg={SECONDARY_DARK}
        dark
        className="cv-reveal"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {[
            'Adults looking to add periodic cellular renewal support to a daily longevity routine',
            'Those running structured protocols who want a dedicated monthly reset cycle',
            'People who already take CELLUNAD+ or CELLUBIOME and want to layer periodic support',
            'Those interested in autophagy and senescence research compounds at fully disclosed doses',
          ].map((item, i) => (
            <div
              key={i}
              className="cv-reveal flex items-start gap-4 px-5 py-4 lg:px-7 lg:py-6 rounded-lg lg:rounded-xl border border-white/[0.06]"
              style={{ backgroundColor: '#15202F' }}
              data-testid={`best-for-${i}`}
            >
              <span className="font-mono text-[10px] font-bold text-ar-teal/50 tracking-[0.10em] mt-0.5 shrink-0">0{i + 1}</span>
              <span className="text-[14px] font-sans text-white/55 leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="px-5 py-4 rounded-lg border border-white/[0.06]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[11px] font-mono uppercase tracking-[0.10em] text-white/40 mb-2">Not ideal for</p>
            <p className="text-[13px] font-sans text-white/40 leading-snug">Those looking for a daily baseline product. CELLUNOVA is a periodic protocol — not a daily supplement.</p>
          </div>
          <div className="px-5 py-4 rounded-lg border border-white/[0.06]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[11px] font-mono uppercase tracking-[0.10em] text-white/40 mb-2">Starting out?</p>
            <p className="text-[13px] font-sans text-white/40 leading-snug">Consider <a href="/product/cellunad" className="text-ar-teal/70 hover:text-ar-teal transition-colors">CELLUNAD+</a> as your daily foundation first.</p>
          </div>
        </div>
      </PdpSectionRow>

      {/* ─── 4. WHO IT'S FOR removed, kept in section 3 ─── */}

      {/* ─── 5. FORMULA ARCHITECTURE — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="Formula Architecture"
        heading={<>Three layers. One 7-day cycle.</>}
        intro="CELLUNOVA combines autophagy-related support, senescence-research context, and mitochondrial resilience in a defined monthly format."
        bg={SECONDARY_DARK}
        dark
        className="cv-reveal"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {(data.ingredientGroups || []).map((group, i) => (
            <div
              key={i}
              className="rounded-xl p-6 lg:p-7 border border-white/[0.06] flex flex-col"
              style={{ backgroundColor: '#15202F' }}
              data-testid={`formula-layer-${i}`}
            >
              <div className="mb-3">
                <h4 className="text-[15px] lg:text-[16px] font-head font-normal uppercase tracking-[-0.01em] text-white/90">{group.category}</h4>
                <span className="font-mono text-[10px] text-ar-teal/70 tracking-[0.06em]">{group.totalDose}</span>
              </div>
              <p className="text-[13px] font-sans text-white/40 leading-[1.6] mb-4">{group.desc}</p>
              <div className="space-y-1.5 mt-auto">
                {group.ingredients.map((ing, j) => (
                  <p key={j} className="text-[13px] font-sans text-white/55 py-0.5">{ing}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 6. SUPPLEMENT FACTS — LIGHT ─── */}
      <PdpSupplementFactsShell
        eyebrow="Supplement Facts"
        heading="What's inside."
        intro={<>{data.supplementFacts.items.length} compounds, fully disclosed. Every ingredient listed for direct evaluation.</>}
        onViewFacts={() => setIsFactsOpen(true)}
        dark={false}
        bg={LIGHT}
        factsTable={
          <div className="bg-white rounded-xl border border-[#0A1220]/[0.06] overflow-hidden lg:max-w-[900px]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
            <div className="px-6 lg:px-8 pt-6 lg:pt-7 pb-3 border-b border-[#0A1220]/[0.06]">
              <p className="text-[12px] font-sans text-[#0A1220]/40">Serving Size: {data.supplementFacts.servingSize} · Servings Per Container: {data.supplementFacts.servingsPerContainer}</p>
            </div>
            <div className="divide-y divide-[#0A1220]/[0.06]">
              {data.supplementFacts.items.map((item, i) => (
                <div key={i} className="px-6 lg:px-8 py-3 flex justify-between items-baseline gap-4">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[14px] font-sans text-[#0A1220]/70">{item.name}</span>
                    <span className="text-[13px] font-sans font-semibold text-[#0A1220]/80">{item.amount}</span>
                  </div>
                  <span className="text-[12px] font-mono text-[#0A1220]/30 shrink-0">{item.dv || '†'}</span>
                </div>
              ))}
            </div>
            <div className="px-6 lg:px-8 py-4 border-t border-[#0A1220]/[0.06] bg-[#0A1220]/[0.015]">
              <p className="text-[11px] font-sans text-[#0A1220]/35 leading-[1.5]">
                † Daily Value not established. Other Ingredients: {data.supplementFacts.otherIngredients}
              </p>
              {data.supplementFacts.allergenNote && (
                <p className="text-[11px] font-sans text-[#0A1220]/50 font-semibold mt-1">Allergen: {data.supplementFacts.allergenNote}</p>
              )}
            </div>
          </div>
        }
      />

      {/* ─── MID-PAGE CTA — BASE_DARK ─── */}
      <PdpCenteredSection bg={BASE_DARK} dark tight maxWidth="480px">
        <div className="text-center">
          <p className="text-[14px] font-sans text-white/45 leading-relaxed mb-5">
            {data.supplementFacts.items.length} compounds. 7-day protocol. Full-dose disclosure. Monthly cycle.
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
      </PdpCenteredSection>

      {/* ─── 7. HOW TO USE — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="Routine"
        heading="How to use it."
        bg={LIGHT}
        className="cv-reveal"
      >
        <div>
          <div className="bg-white rounded-xl p-6 lg:p-8 border border-[#0A1220]/[0.06]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
            <p className="text-[17px] text-[#0A1220]/70 font-sans font-medium leading-relaxed text-center lg:text-left mb-6">Take 5 capsules daily for 7 consecutive days.</p>
            <div className="space-y-3 pt-4 border-t border-[#0A1220]/[0.06]">
              {[
                'This is a periodic cycle, not a daily supplement.',
                'Many people prefer taking it with food for comfort.',
                'After the 7-day cycle, return to the daily baseline layers.',
                'Review the allergen note before starting.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[13px] text-[#0A1220]/45 font-sans leading-snug">{tip}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[#0A1220]/[0.06]">
              <p className="text-[12px] font-sans text-[#0A1220]/45 leading-[1.6]">
                <span className="font-semibold text-[#0A1220]/60">Allergen:</span> Contains wheat (from wheat germ derived spermidine). Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.
              </p>
            </div>
          </div>
        </div>
      </PdpSectionRow>

      {/* ─── 8. SCIENCE — SECONDARY_DARK ─── */}
      {(() => {
        const sci = data.scienceSection as any;
        return (
          <PdpSectionRow
            eyebrow="The Science"
            heading={sci.headline}
            bg={SECONDARY_DARK}
            dark
            className="cv-reveal"
          >
            <div className="space-y-5">
              {sci.paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-[14px] lg:text-[15px] text-[#F4F1EA]/50 leading-[1.65] font-sans" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              {sci.microProof && (
                <p className="text-[12px] font-mono uppercase tracking-[0.06em] text-[#F4F1EA]/25 pt-3">{sci.microProof}</p>
              )}
            </div>
          </PdpSectionRow>
        );
      })()}

      {/* ─── 9. RESULTS OVER TIME — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="Protocol Effects Over Time"
        heading="What consistent use can look like."
        intro={(data as any).timelineSubline}
        bg={LIGHT}
        className="cv-reveal"
      >
        <div>
          <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-8">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`font-mono text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.06em] transition-all min-h-[34px] px-3.5 lg:px-5 py-1.5 rounded-full whitespace-nowrap ${focusRing}`}
                style={activeTimeline === i
                  ? { background: BASE_DARK, color: LIGHT }
                  : { background: 'transparent', color: 'rgba(10,18,32,0.4)', border: '1px solid rgba(10,18,32,0.1)' }
                }
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#0A1220]/[0.06] rounded-xl p-7 lg:p-9 min-h-[180px]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] mb-5" style={{ color: BASE_DARK }}>{data.benefitsTimeline[activeTimeline].time}</h3>
            <ul className="space-y-3.5">
              {data.benefitsTimeline[activeTimeline].items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[14px] text-[#0A1220]/55 font-sans leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {(data as any).timelineConfidence && (
            <p className="text-[11px] font-sans text-[#0A1220]/25 mt-5">{(data as any).timelineConfidence}</p>
          )}
        </div>
      </PdpSectionRow>

      {/* ─── 10. COMPARISON — SECONDARY_DARK ─── */}
      <PdpComparisonShell
        eyebrow="Compare"
        heading="How CELLUNOVA differs from low-dose daily longevity blends."
        bg={SECONDARY_DARK}
        dark
      >
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#15202F' }}>
          <div className="grid grid-cols-2">
            <div className="px-5 lg:px-9 py-4 lg:py-5 border-b-2 border-ar-teal/30">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-ar-teal">CELLUNOVA</span>
            </div>
            <div className="px-5 lg:px-9 py-4 lg:py-5 border-b border-white/[0.06] border-l border-white/[0.06]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-white/25">Generic Blends</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-5 lg:px-9 py-5 lg:py-7 space-y-3 lg:space-y-4">
              {data.comparison.us.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[13px] lg:text-[14px] font-sans text-white/55 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-5 lg:px-9 py-5 lg:py-7 space-y-3 lg:space-y-4 border-l border-white/[0.06]">
              {data.comparison.them.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/15 shrink-0 mt-2" />
                  <span className="text-[13px] lg:text-[14px] font-sans text-white/25 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdpComparisonShell>

      {/* ─── 11. PAIRS WELL WITH — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="The System"
        heading="Layer it onto the daily foundation."
        intro="CELLUNOVA is designed to sit on top of daily CELLUNAD+ and CELLUBIOME, not replace them."
        bg={LIGHT}
        className="cv-reveal"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {data.stack.map((item, i) => (
            <div
              key={i}
              className="cv-reveal bg-white rounded-xl p-6 lg:p-8 space-y-3 border border-[#0A1220]/[0.06] hover:border-[#0A1220]/[0.12] transition-colors flex flex-col"
              style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
            >
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <h4 className="text-[16px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>{item.name}</h4>
                <span className="font-mono text-[9px] px-2.5 py-1 rounded uppercase shrink-0 text-[#0A1220]/30 border border-[#0A1220]/[0.08]">{item.role}</span>
              </div>
              <p className="text-[13px] text-[#0A1220]/45 font-sans leading-relaxed">{item.add}</p>
              <p className="text-[10px] font-mono text-[#0A1220]/25 uppercase tracking-[0.10em]">{item.when}</p>
              <div className="flex gap-3 pt-1 mt-auto">
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
                  {item.slug === 'cellunad' ? 'Add the foundation' : 'Add gut-mito support'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 12. FAQ — SECONDARY_DARK ─── */}
      <PdpFaqShell
        heading="Before you start"
        intro="Common questions about CELLUNOVA, the 7-day protocol format, and how it fits into a daily routine."
        bg={SECONDARY_DARK}
        dark
        links={
          <a href="/faq" className="text-[11px] font-mono uppercase tracking-[0.10em] text-white/30 hover:text-white/50 transition-colors">
            View all FAQs →
          </a>
        }
      >
        <div className="border-t border-white/[0.06]">
          {data.faq.map((item, i) => (
            <div key={i} className="border-b border-white/[0.06]">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className={`w-full flex items-center justify-between py-5 lg:py-6 text-left gap-6 min-h-[56px] ${focusRing} rounded`}
                data-testid={`faq-toggle-${i}`}
              >
                <span className="text-[14px] lg:text-[16px] font-sans font-semibold text-white/70 leading-snug">{item.q}</span>
                <ChevronDown size={16} className={`shrink-0 text-white/20 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: faqOpen === i ? '400px' : '0', opacity: faqOpen === i ? 1 : 0 }}
              >
                <p className="pb-6 text-[14px] lg:text-[15px] font-sans text-white/40 leading-[1.65] pr-8">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </PdpFaqShell>

      {/* ─── 13. FINAL CTA — BASE_DARK ─── */}
      <PdpFinalCtaBand
        heading={
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-[0.92]" style={{ fontSize: 'clamp(1.7rem, 5.5vw, 3rem)' }}>
            Add the monthly layer
            <br />
            <span className="text-white/30">when you are ready.</span>
          </h2>
        }
        sub={
          <p className="mt-5 text-[14px] font-sans text-white/35 max-w-[36ch] mx-auto leading-[1.6]">
            CELLUNOVA is a periodic 7-day protocol designed to layer onto the daily foundation.
          </p>
        }
        cta={
          <button
            onClick={handleAddToCart}
            className={`group relative px-10 min-h-[50px] inline-flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] overflow-hidden hover:scale-[1.02] active:scale-[0.97] transition-transform ${focusRing}`}
            style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.2), 0 0 24px rgba(45,212,191,0.06)' }}
            data-testid="final-add-to-cart"
          >
            <span className="relative z-10">Add CELLUNOVA to Cart</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        }
        footerNote="5 capsules daily · 7-day cycle · Monthly protocol"
        browseLink={
          <a href="/shop" className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/30 hover:text-white/50 transition-colors" data-testid="link-browse-products">
            Browse All Protocols →
          </a>
        }
      />

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

      <StickyMobileBuyBar price={data.priceOneTime} onAdd={handleAddToCart} />
    </div>
  );
}
