import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ShieldCheck,
  FlaskConical,
  Shield,
  X,
  FileText,
  Microscope,
  Clock,
  Star,
  ShoppingBag,
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
const TEAL = '#2dd4bf';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ar-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

function StickyMobileBuyBar({ data, onAdd }: { data: ProductDetailData; onAdd: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden" style={{ background: BASE_DARK, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-5 py-3 max-w-lg mx-auto gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/50 truncate">{data.name}</p>
          <p className="text-[15px] font-sans font-semibold text-white">${data.priceOneTime.toFixed(2)}</p>
        </div>
        <button
          onClick={onAdd}
          className={`shrink-0 px-6 min-h-[44px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[10px] tracking-[0.10em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 ${focusRing}`}
          data-testid="sticky-add-to-cart"
        >
          Add to Cart <ShoppingBag size={13} />
        </button>
      </div>
    </div>
  );
}

export default function CellubiomePDP({ data, slug }: { data: ProductDetailData; slug: string }) {
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const cart = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cb-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          opacity: 0, y: 20, duration: 0.8, ease: 'power3.out'
        });
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const images = PRODUCT_IMAGES.cellubiome;
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

  return (
    <div ref={containerRef} className="min-h-screen font-sans antialiased selection:bg-teal-500/30 selection:text-white" style={{ backgroundColor: BASE_DARK }}>
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />
      <SiteNavbar />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO / BUY BOX — Split layout: light carousel | dark buy box
          ═══════════════════════════════════════════════════════════════ */}
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
            <div className="lg:sticky lg:top-20 space-y-5 lg:space-y-6 pt-5 lg:pt-0 pb-8 lg:pb-0">
              <div className="space-y-2 lg:space-y-3">
                <p className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em]" style={{ color: accentColor }}>Gut--Mitochondria Axis</p>
                <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                  CELLUBIOME
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(data.rating);
                      const partial = !filled && i < data.rating;
                      return (
                        <span key={i} className="relative inline-block" style={{ width: 12, height: 12 }}>
                          <Star size={12} className="text-white/15 absolute inset-0" />
                          {(filled || partial) && (
                            <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? '100%' : `${(data.rating % 1) * 100}%` }}>
                              <Star size={12} className="text-amber-400/80 fill-amber-400/80" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-[11px] lg:text-[13px] text-white/40 font-sans">{data.rating} · {data.reviewCount.toLocaleString()} Reviews</span>
                </div>
              </div>

              <p className="text-[13px] lg:text-[15px] text-white/50 font-sans leading-relaxed max-w-md">
                Two clinically studied compounds for mitochondrial renewal and gut barrier integrity. Enteric-protected for targeted intestinal delivery.*
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-md text-white/60 bg-white/[0.06] border border-white/[0.08]">Urolithin A 500 mg</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-md text-white/60 bg-white/[0.06] border border-white/[0.08]">Tributyrin 500 mg</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-md text-white/60 bg-white/[0.06] border border-white/[0.08]">Enteric Capsules</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-sans font-semibold text-white">${data.priceOneTime.toFixed(2)}</span>
                  <span className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: accentColor }}>${data.priceSubscribe.toFixed(2)}/mo with subscription</span>
                </div>
                <p className="text-[12px] text-white/40 font-sans">30-day supply · 2 capsules daily · Free US shipping</p>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 bg-ar-teal text-[#0A1220] rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[50px] ${focusRing}`}
                style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.2)' }}
                data-testid="hero-add-to-cart"
              >
                Add to Cart <ShoppingBag size={14} />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1.5 text-[10px] text-white/35 font-mono uppercase tracking-[0.08em]">
                {['30-day guarantee', 'Free shipping', 'Cancel anytime'].map((item, i) => (
                  <span key={item} className="flex items-center">
                    <span className="whitespace-nowrap">{item}</span>
                    {i < 2 && <span className="w-px h-[10px] bg-white/12 mx-3 shrink-0" />}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-white/[0.06]">
                {[
                  { label: 'Transparent doses' },
                  { label: 'Third-party tested' },
                  { label: 'Enteric delivery' },
                  { label: 'No proprietary blends' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Check size={11} className="shrink-0" style={{ color: accentColor }} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/40">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsFactsOpen(true)}
                className="text-[12px] font-sans text-white/50 hover:text-white/80 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all"
                data-testid="view-supplement-facts"
              >
                View Supplement Facts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. EARLY TRUST STRIP — Light background
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Quality Standards</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>
              Built on transparency, not marketing claims.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {data.qualityBadges.map((badge, i) => (
              <div
                key={i}
                className="cb-reveal bg-white rounded-lg px-5 py-5 md:py-6 border border-[#0A1220]/[0.06]"
                style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
                data-testid={`trust-badge-${i}`}
              >
                <Check size={14} className="text-ar-teal mb-2.5" />
                <p className="text-[13px] md:text-[14px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. BEST FOR / WHO IT'S FOR — Secondary dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[100px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Best For</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)' }}>
              Who should start with CELLUBIOME?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {data.suitability.map((item, i) => (
              <div
                key={i}
                className="cb-reveal flex items-start gap-4 px-5 py-5 md:px-6 rounded-lg border border-white/[0.06]"
                style={{ backgroundColor: '#162235' }}
                data-testid={`best-for-${i}`}
              >
                <Check size={15} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                <span className="text-[14px] font-sans font-medium text-white/60 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. WHY IT'S DIFFERENT / DELIVERY RATIONALE — Light
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[100px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Formulation Advantage</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: BASE_DARK }}>
              Why CELLUBIOME is different.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.06]" style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}>
              <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.14em] font-bold">01</span>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>Clinically Studied Doses</h3>
              <p className="mt-3 text-[14px] font-sans text-[#0A1220]/55 leading-[1.6]">
                500 mg Urolithin A and 500 mg Tributyrin -- doses used in published research on mitochondrial function and gut barrier integrity. No diluted blends.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.06]" style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}>
              <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.14em] font-bold">02</span>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>Enteric-Protected Delivery</h3>
              <p className="mt-3 text-[14px] font-sans text-[#0A1220]/55 leading-[1.6]">
                Standard capsules can degrade in stomach acid. CELLUBIOME uses enteric delivery to protect Urolithin A and Tributyrin until they reach the intestine where absorption occurs.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.06]" style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}>
              <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.14em] font-bold">03</span>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>Two-Compound Focus</h3>
              <p className="mt-3 text-[14px] font-sans text-[#0A1220]/55 leading-[1.6]">
                Not a kitchen-sink formula. Two targeted compounds, each at a full clinically studied dose, working together on the gut--mitochondria axis.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.06]" style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}>
              <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.14em] font-bold">04</span>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-head font-normal uppercase tracking-[-0.02em]" style={{ color: BASE_DARK }}>Full Label Disclosure</h3>
              <p className="mt-3 text-[14px] font-sans text-[#0A1220]/55 leading-[1.6]">
                Every ingredient and its exact dose listed. No proprietary blends. Certificate of Analysis available by production lot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. WHAT IT DOES / BENEFITS — Secondary dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Biological Function</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)' }}>
              Signal Stability
            </h2>
            <p className="font-head font-normal tracking-[-0.02em] uppercase text-white/40 mt-1" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>
              Layer
            </p>
            <p className="mt-4 text-[13px] md:text-[15px] text-white/45 font-sans leading-relaxed max-w-[520px] mx-auto">
              Supports mitochondrial renewal and gut barrier resilience to preserve internal signaling balance.
            </p>
          </div>

          <div className="flex flex-col items-center gap-0 max-w-xl mx-auto">
            {data.benefitHighlights.map((h, i) => (
              <div key={i} className="w-full">
                {i > 0 && (
                  <div className="flex justify-start pl-10 md:pl-12">
                    <div className="w-px h-10" style={{ background: `${accentColor}18` }} />
                  </div>
                )}
                <div
                  className="relative p-6 md:p-8 border rounded-[22px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                    borderColor: 'rgba(244,241,234,0.08)',
                  }}
                  data-testid={`benefit-${i}`}
                >
                  <span
                    className="absolute top-4 left-6 md:left-8 font-head font-normal leading-none pointer-events-none select-none"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)', color: 'rgba(244,241,234,0.05)' }}
                  >
                    0{i + 1}
                  </span>
                  <div className="relative z-[1] space-y-3 pt-10 md:pt-12">
                    <h4 className="text-[15px] md:text-[17px] font-head font-normal uppercase tracking-[-0.02em] text-[#F4F1EA]/90">{h.title}</h4>
                    <p className="text-[13px] md:text-[14px] text-[#F4F1EA]/50 leading-[1.65] font-sans">{h.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. SUPPLEMENT FACTS / INGREDIENTS — Light
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Key Ingredients</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              What's inside
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.ingredientGroups.map((group, i) => (
              <div
                key={i}
                className="cb-reveal bg-white rounded-xl p-6 md:p-8 border border-[#0A1220]/[0.06] flex flex-col"
                style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em]" style={{ color: BASE_DARK }}>{group.category}</h4>
                  <span className="font-mono text-[10px] font-bold uppercase text-right shrink-0 leading-tight text-ar-teal">{group.totalDose}</span>
                </div>
                <p className="text-[13px] font-sans text-[#0A1220]/50 leading-relaxed mb-5">{group.desc}</p>
                <div className="mt-auto pt-4 border-t border-[#0A1220]/[0.06]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#0A1220]/30 mb-3">Compounds</p>
                  {group.ingredients.map((ing, j) => (
                    <p key={j} className="text-[13px] font-sans text-[#0A1220]/65 mb-1.5">{ing}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsFactsOpen(true)}
              className={`inline-flex items-center gap-2.5 font-mono text-[11px] uppercase font-bold tracking-[0.12em] text-[#0A1220]/40 hover:text-[#0A1220]/70 transition-all ${focusRing} rounded px-2`}
              data-testid="view-full-label"
            >
              <FileText size={14} /> View Full Supplement Facts
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. SCIENCE — Base dark
          ═══════════════════════════════════════════════════════════════ */}
      {(() => {
        const sci = data.scienceSection as any;
        return (
          <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: BASE_DARK }}>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-6 text-center lg:text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="h-[1px] w-6" style={{ background: `${accentColor}50` }} />
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: `${accentColor}90` }}>The Science</span>
                      <div className="h-[1px] w-6" style={{ background: `${accentColor}50` }} />
                    </div>
                    <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-[#F4F1EA] leading-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)' }}>
                      {sci.headline}
                    </h2>
                  </div>
                  <div className="space-y-4 max-w-[640px] mx-auto lg:mx-0">
                    {sci.paragraphs.map((p: string, i: number) => (
                      <p key={i} className="text-[14px] md:text-[15px] text-[#F4F1EA]/55 leading-[1.6] font-sans" dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                    {sci.microProof && (
                      <p className="text-[12px] font-mono uppercase tracking-[0.06em] text-[#F4F1EA]/30 pt-2">{sci.microProof}</p>
                    )}
                  </div>
                </div>

                <div className="relative p-10 md:p-14 border overflow-hidden rounded-lg" style={{ backgroundColor: SECONDARY_DARK, borderColor: 'rgba(244,241,234,0.08)' }}>
                  <div className="absolute top-5 left-6 font-mono text-[9px] text-white/15 uppercase tracking-[0.14em]">{sci.diagramLabel}</div>
                  <div className="flex flex-col items-center gap-6 relative w-full pt-4">
                    {sci.diagramCenter && (
                      <>
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border flex flex-col items-center justify-center text-center p-4" style={{ borderColor: `${accentColor}30`, background: `${accentColor}0A` }}>
                          <p className="font-mono text-[9px] font-bold uppercase" style={{ color: `${accentColor}90` }}>{sci.diagramCenter.label}</p>
                        </div>
                        <div className="w-px h-6" style={{ background: `${accentColor}18` }} />
                      </>
                    )}
                    <div className="flex flex-col gap-2.5 w-full">
                      {sci.diagramNodes.map((n: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 border rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(244,241,234,0.08)' }}>
                          <span className="font-mono text-[9px] uppercase font-bold tracking-[0.10em] text-[#F4F1EA]/60">{n.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════
          8. RESULTS OVER TIME — Light
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Results Over Time</span>
            <h2 className="font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              Biological Improvements Over Time
            </h2>
            <p className="text-[13px] text-[#0A1220]/40 font-sans">{(data as any).timelineSubline}</p>
          </div>

          <div className="flex justify-center gap-1.5 md:gap-2.5 mb-8">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.08em] transition-all min-h-[34px] px-3.5 md:px-5 py-1.5 rounded-full whitespace-nowrap ${focusRing}`}
                style={activeTimeline === i
                  ? { background: '#19B3A6', color: '#ffffff' }
                  : { background: 'rgba(10,18,32,0.06)', color: 'rgba(10,18,32,0.45)', border: '1px solid rgba(10,18,32,0.08)' }
                }
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#0A1220]/[0.06] rounded-xl p-8 md:p-10 min-h-[200px]" style={{ boxShadow: '0 1px 4px rgba(10,18,32,0.05)' }}>
            <h3 className="font-head font-normal uppercase tracking-tight text-lg mb-6 text-ar-teal">{data.benefitsTimeline[activeTimeline].time}</h3>
            <ul className="space-y-4">
              {data.benefitsTimeline[activeTimeline].items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={15} className="shrink-0 mt-0.5 text-ar-teal" />
                  <span className="text-[14px] text-[#0A1220]/60 font-sans leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {(data as any).timelineConfidence && (
            <p className="text-center text-[12px] font-sans text-[#0A1220]/30 mt-6">{(data as any).timelineConfidence}</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. HOW TO USE — Secondary dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[100px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="overflow-hidden aspect-[4/3] rounded-lg">
            <img src="/images/how-to-use.jpg" alt="How to use CELLUBIOME" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">How to Use</span>
              <h2 className="font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)' }}>Simple daily routine</h2>
            </div>
            <p className="text-[16px] text-white/60 font-sans font-medium leading-relaxed">{data.howToUse.instruction}</p>
            <div className="space-y-3">
              {data.howToUse.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accentColor }} />
                  <span className="text-[14px] text-white/50 font-sans">{tip}</span>
                </div>
              ))}
            </div>
            {(data.howToUse as any).microNote && (
              <p className="text-[12px] text-white/30 font-sans italic">{(data.howToUse as any).microNote}</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. COMPARISON — Light
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Compare</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              How CELLUBIOME compares
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-4">
              <div className="pb-3 border-b-2 border-ar-teal/30">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ar-teal">CELLUBIOME</span>
              </div>
              {data.comparison.us.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={14} className="shrink-0 mt-0.5 text-ar-teal" />
                  <span className="text-[13px] md:text-[14px] font-sans text-[#0A1220]/60 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#0A1220]/[0.08]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A1220]/25">Other Brands</span>
              </div>
              {data.comparison.them.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X size={14} className="shrink-0 mt-0.5 text-[#0A1220]/15" />
                  <span className="text-[13px] md:text-[14px] font-sans text-[#0A1220]/30 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11. STACKING / SYSTEM FIT — Secondary dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">The System</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)' }}>
              Pairs well with
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.stack.map((item, i) => (
              <div
                key={i}
                className="cb-reveal border border-white/[0.06] rounded-lg p-6 md:p-7 space-y-4 hover:border-white/[0.10] transition-all"
                style={{ backgroundColor: '#162235' }}
              >
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-lg font-head font-normal uppercase tracking-[-0.02em]">{item.name}</h4>
                  <span className="font-mono text-[9px] border px-2.5 py-1 rounded uppercase shrink-0" style={{ color: accentColor, borderColor: `${accentColor}30` }}>{item.role}</span>
                </div>
                <p className="text-[14px] text-white/50 font-sans leading-relaxed">{item.add}</p>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/25 uppercase tracking-[0.12em]">
                  <Clock size={11} /> {item.when}
                </div>
                <div className="flex gap-3 pt-2">
                  <a
                    href={`/product/${item.slug}`}
                    className={`flex-1 py-3 border border-white/10 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.08em] hover:bg-white/[0.04] transition-all text-center min-h-[40px] flex items-center justify-center ${focusRing}`}
                    data-testid={`stack-view-${item.slug}`}
                  >
                    Learn More
                  </a>
                  <button
                    onClick={() => addStackItem(item.slug)}
                    className={`flex-1 py-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-all min-h-[40px] bg-ar-teal text-[#0A1220] hover:brightness-110 active:scale-[0.98] ${focusRing}`}
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

      {/* ═══════════════════════════════════════════════════════════════
          12. FAQ — Light
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[72px] md:py-[110px] px-6 md:px-8" style={{ backgroundColor: LIGHT }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Common Questions</span>
            <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: BASE_DARK }}>
              Frequently asked
            </h2>
          </div>

          <div className="border-t" style={{ borderColor: 'rgba(10,18,32,0.08)' }}>
            {data.faq.map((item, i) => (
              <div key={i} className="border-b" style={{ borderColor: 'rgba(10,18,32,0.08)' }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className={`w-full flex items-center justify-between py-5 md:py-6 text-left gap-6 min-h-[56px] ${focusRing} rounded`}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="text-[14px] md:text-[15px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[#0A1220]/25 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: faqOpen === i ? '400px' : '0', opacity: faqOpen === i ? 1 : 0 }}
                >
                  <p className="pb-6 text-[14px] font-sans text-[#0A1220]/50 leading-[1.65] pr-10">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          13. TESTING & QUALITY — Secondary dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="cb-reveal py-[60px] md:py-[80px] px-6 md:px-8 text-white" style={{ backgroundColor: SECONDARY_DARK }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-4 items-start p-5 border border-white/[0.06] rounded-lg" style={{ backgroundColor: '#162235' }}>
            <ShieldCheck size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Full label disclosure</p>
              <p className="text-[12px] text-white/40 font-sans leading-relaxed">Every ingredient and dose listed. No proprietary blends.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 border border-white/[0.06] rounded-lg" style={{ backgroundColor: '#162235' }}>
            <FlaskConical size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Third-party tested</p>
              <p className="text-[12px] text-white/40 font-sans leading-relaxed">Independent lab testing for purity, potency, and contaminants.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 border border-white/[0.06] rounded-lg" style={{ backgroundColor: '#162235' }}>
            <Microscope size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Clinically studied doses</p>
              <p className="text-[12px] text-white/40 font-sans leading-relaxed">Doses match amounts used in published research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          14. FINAL CTA — Base dark
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-[88px] md:py-[120px] px-6 text-white overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,212,191,0.03) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-[0.92]" style={{ fontSize: 'clamp(1.7rem, 5.5vw, 3rem)' }}>
            Daily gut-mito support
            <br />
            <span className="text-white/35">starts here.</span>
          </h2>
          <p className="mt-5 text-[14px] md:text-[15px] font-sans text-white/40 max-w-[38ch] mx-auto leading-[1.6]">
            Two clinically studied compounds. Enteric-protected delivery. Transparent dosing. One daily protocol for gut barrier and mitochondrial renewal support.
          </p>
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              className={`group relative px-10 min-h-[50px] inline-flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform gap-2 ${focusRing}`}
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(45,212,191,0.2), 0 0 24px rgba(45,212,191,0.08)' }}
              data-testid="final-add-to-cart"
            >
              <span className="relative z-10">Add to Cart</span>
              <ShoppingBag size={14} className="relative z-10" />
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.06em] text-white/25">2 capsules daily · Enteric-protected · Fully disclosed</p>
          <div className="mt-3">
            <a href="/shop" className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors inline-flex items-center gap-1">
              Browse all products <ArrowRight size={9} />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6" style={{ backgroundColor: BASE_DARK }}>
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      <div className="py-8 px-6 text-white" style={{ backgroundColor: BASE_DARK }}>
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.10em] leading-relaxed text-center max-w-3xl mx-auto">
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
