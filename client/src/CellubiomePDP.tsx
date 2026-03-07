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
      style={{ background: 'rgba(10,18,32,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-3 gap-4 safe-bottom">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/45 truncate">CELLUBIOME</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[16px] font-sans font-semibold text-white">${data.priceOneTime.toFixed(2)}</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/30">2 enteric caps daily</span>
          </div>
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

export default function CellubiomePDP({ data, slug }: { data: ProductDetailData; slug: string }) {
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const cart = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  const heroMedia = <ImageCarousel images={images} accent={data.accent} lightMode />;

  const heroBuyBox = (
    <div className="space-y-4 lg:space-y-5">
      <div className="space-y-2 lg:space-y-3">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] lg:text-[11px] xl:text-[12px] uppercase tracking-[0.14em] text-ar-teal">Daily Gut-Mitochondria Support</p>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[0.06em] bg-ar-teal/10 text-ar-teal border border-ar-teal/20" data-testid="bestseller-badge">Bestseller</span>
        </div>
        <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
          CELLUBIOME
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
        Daily gut-barrier and mitochondrial support with urolithin A plus enteric tributyrin. Fully disclosed formula.*
      </p>
      <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/30">Not a probiotic blend.</p>

      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">Enteric-Protected</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">2 Compounds</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2.5 py-1.5 rounded-md text-white/55 bg-white/[0.05] border border-white/[0.07]">Fully Disclosed</span>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-baseline gap-3">
          <span className="text-[26px] font-sans font-semibold text-white tracking-tight">${data.priceOneTime.toFixed(2)}</span>
          <span className="text-[12px] text-white/30 font-sans">/ 30-day supply</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-sans font-medium text-ar-teal">Subscribe: ${data.priceSubscribe.toFixed(2)}/mo</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.06em] px-2 py-0.5 rounded bg-ar-teal/10 text-ar-teal">Save ${savings.toFixed(2)}</span>
        </div>
        <p className="text-[12px] text-white/35 font-sans">30-day supply · 2 enteric capsules daily · Free US shipping</p>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-3.5 bg-ar-teal text-[#0A1220] rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center min-h-[50px] ${focusRing}`}
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
          {['Transparent doses', 'Third-party tested', 'Enteric-protected', 'No proprietary blends'].map((label) => (
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
  );

  return (
    <div ref={containerRef} className="min-h-screen font-sans antialiased selection:bg-teal-400/20 selection:text-white" style={{ backgroundColor: BASE_DARK }}>
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />
      <SiteNavbar />

      {/* ─── 1. HERO / BUY BOX ─── */}
      <PdpHeroShell
        mediaPanel={heroMedia}
        buyBox={heroBuyBox}
        splitRatio="6.5/5.5"
      />

      {/* ─── 2. WHAT MAKES IT DIFFERENT — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="What makes it different"
        heading="Why this is not another gut blend."
        intro="CELLUBIOME is a targeted daily formula built around gut-barrier support and mitochondrial renewal, not a generic probiotic stack."
        bg={LIGHT}
        className="cb-reveal"
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          {[
            { title: 'Not a probiotic blend', desc: 'This is a targeted compound formula, not a repackaged probiotic.' },
            { title: '500 mg urolithin A', desc: 'Human-studied dose used for mitochondrial-related biomarkers.' },
            { title: 'Enteric tributyrin', desc: 'Designed for downstream butyrate delivery, not a basic butyrate salt.' },
            { title: 'Gut-barrier support', desc: 'Built around intestinal barrier and butyrate-related biology.' },
            { title: 'Mitochondrial support', desc: 'Pairs gut support with a mitochondrial renewal compound.' },
            { title: 'Fully disclosed label', desc: 'Every ingredient and dose is listed directly on the label.' },
          ].map((item, i) => (
            <div
              key={i}
              className="cb-reveal bg-white rounded-lg lg:rounded-xl px-5 py-5 md:py-6 lg:px-6 lg:py-7 border border-[#0A1220]/[0.06]"
              style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
              data-testid={`trust-badge-${i}`}
            >
              <p className="text-[13px] md:text-[14px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{item.title}</p>
              <p className="mt-1.5 text-[12px] lg:text-[13px] font-sans text-[#0A1220]/50 leading-[1.5]">{item.desc}</p>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 3. BEST FOR — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="Best For"
        heading="Who CELLUBIOME is built for."
        intro="Targeted gut-barrier and mitochondrial support for adults who want more than a generic gut supplement."
        bg={SECONDARY_DARK}
        dark
        className="cb-reveal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {[
            'People prioritizing gut-barrier support',
            'People interested in mitochondrial renewal support',
            'People wanting a daily non-probiotic gut formula',
            'People who value enteric delivery',
            'People pairing a gut layer with CELLUNAD+',
            'People looking for a targeted gut-mito formula',
          ].map((item, i) => (
            <div
              key={i}
              className="cb-reveal flex items-start gap-4 px-5 py-4 md:px-6 md:py-5 lg:px-7 lg:py-6 rounded-lg lg:rounded-xl border border-white/[0.06]"
              style={{ backgroundColor: '#15202F' }}
              data-testid={`best-for-${i}`}
            >
              <span className="font-mono text-[10px] font-bold text-ar-teal/50 tracking-[0.10em] mt-0.5 shrink-0">0{i + 1}</span>
              <span className="text-[14px] font-sans text-white/55 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 4. FORMULA LOGIC — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="Formula Logic"
        heading={<>Two compounds.<br className="hidden lg:inline" /> One targeted daily formula.</>}
        intro="CELLUBIOME pairs urolithin A and enteric tributyrin because gut-barrier support and mitochondrial renewal are connected, but not identical."
        bg={LIGHT}
        className="cb-reveal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          {[
            { title: 'Research-Informed Doses', body: '500 mg Urolithin A aligns with published human studies. 500 mg Tributyrin provides stable butyrate delivery. No diluted blends.' },
            { title: 'Enteric-Protected Delivery', body: 'Standard capsules degrade in stomach acid. CELLUBIOME uses enteric coating to protect both compounds until they reach the intestine, where absorption and barrier support occur.' },
            { title: 'Two-Compound Focus', body: 'Two targeted compounds at research-aligned doses, each addressing one side of the gut-mitochondria axis. Nothing extra.' },
            { title: 'Full Transparency', body: 'Every ingredient, every dose, printed on the label. No proprietary blends. Certificate of Analysis available by production lot.' },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 md:p-7 lg:p-8 border border-[#0A1220]/[0.06]"
              style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}
              data-testid={`different-${i}`}
            >
              <h3 className="text-[15px] md:text-[16px] font-head font-normal uppercase tracking-[-0.01em]" style={{ color: BASE_DARK }}>{card.title}</h3>
              <p className="mt-3 text-[13px] font-sans text-[#0A1220]/50 leading-[1.6]">{card.body}</p>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 5. WHAT EACH COMPOUND DOES — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="Biological Function"
        heading={<>What each compound<br className="hidden lg:inline" /> is designed to do.</>}
        intro="Each side of the formula has a distinct biological role. Together, they address the gut-mitochondria connection."
        bg={SECONDARY_DARK}
        dark
        className="cb-reveal"
      >
        <div className="space-y-3 lg:space-y-4">
          {data.benefitHighlights.map((h, i) => (
            <div
              key={i}
              className="p-6 md:p-7 lg:p-8 border rounded-xl border-white/[0.06]"
              style={{ backgroundColor: '#15202F' }}
              data-testid={`benefit-${i}`}
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-[11px] font-bold text-ar-teal/50 tracking-[0.10em] mt-0.5 shrink-0">0{i + 1}</span>
                <div className="space-y-2">
                  <h4 className="text-[15px] md:text-[17px] font-head font-normal uppercase tracking-[-0.02em] text-[#F4F1EA]/90">{h.title}</h4>
                  <p className="text-[13px] md:text-[14px] text-[#F4F1EA]/45 leading-[1.65] font-sans">{h.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 6. SUPPLEMENT FACTS — LIGHT ─── */}
      <PdpSupplementFactsShell
        eyebrow="Supplement Facts"
        heading="Two compounds. Nothing else."
        intro="Enteric-protected. Research-aligned doses. No fillers, no blends."
        onViewFacts={() => setIsFactsOpen(true)}
        bg={LIGHT}
        dark={false}
        factsTable={
          <>
            <div className="bg-white rounded-xl border border-[#0A1220]/[0.06] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
              <div className="px-6 md:px-8 pt-6 md:pt-7 pb-3 border-b border-[#0A1220]/[0.06]">
                <p className="text-[12px] font-sans text-[#0A1220]/40">Serving Size: {data.supplementFacts.servingSize} · Servings Per Container: {data.supplementFacts.servingsPerContainer}</p>
              </div>
              {data.ingredientGroups.map((group, i) => (
                <div key={i} className={`px-6 md:px-8 py-5 md:py-6 ${i > 0 ? 'border-t border-[#0A1220]/[0.06]' : ''}`}>
                  <div className="flex justify-between items-baseline gap-4 mb-2">
                    <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em]" style={{ color: BASE_DARK }}>{group.category}</h4>
                    <span className="font-mono text-[11px] font-bold uppercase text-right shrink-0 text-ar-teal tracking-[0.04em]">{group.totalDose}</span>
                  </div>
                  <p className="text-[13px] font-sans text-[#0A1220]/45 leading-relaxed mb-4">{group.desc}</p>
                  {group.ingredients.map((ing, j) => (
                    <p key={j} className="text-[13px] font-sans text-[#0A1220]/60 py-1">{ing}</p>
                  ))}
                </div>
              ))}
              <div className="px-6 md:px-8 py-4 border-t border-[#0A1220]/[0.06] bg-[#0A1220]/[0.015]">
                <p className="text-[11px] font-sans text-[#0A1220]/35 leading-[1.5]">
                  Other Ingredients: {data.supplementFacts.otherIngredients}
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-[14px] font-sans text-[#0A1220]/45 leading-relaxed mb-5">
                Research-aligned doses. Enteric-protected delivery. No proprietary blends.
              </p>
              <button
                onClick={handleAddToCart}
                className={`px-10 min-h-[48px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] hover:brightness-110 active:scale-[0.97] transition-all ${focusRing}`}
                style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.18)' }}
                data-testid="mid-add-to-cart"
              >
                Add to Cart -- ${data.priceOneTime.toFixed(2)}
              </button>
              <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.06em] text-[#0A1220]/25">or ${data.priceSubscribe.toFixed(2)}/mo with subscription</p>
            </div>
          </>
        }
      />

      {/* ─── 7. SCIENCE — BASE_DARK ─── */}
      {(() => {
        const sci = data.scienceSection as any;
        return (
          <PdpSectionRow
            eyebrow="The Science"
            heading={sci.headline}
            bg={BASE_DARK}
            dark
            className="cb-reveal"
          >
            <div className="space-y-5">
              {sci.paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-[14px] md:text-[15px] text-[#F4F1EA]/50 leading-[1.65] font-sans" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              {sci.microProof && (
                <p className="text-[12px] font-mono uppercase tracking-[0.06em] text-[#F4F1EA]/25 pt-3">{sci.microProof}</p>
              )}
            </div>
          </PdpSectionRow>
        );
      })()}

      {/* ─── 7b. DELIVERY RATIONALE ─── */}
      {(() => {
        const dr = (data as any).deliveryRationale;
        if (!dr) return null;
        return (
          <PdpSectionRow
            eyebrow="Delivery System"
            heading={dr.headline}
            bg={SECONDARY_DARK}
            dark
            className="cb-reveal"
          >
            <div className="space-y-5">
              {dr.paragraphs ? (
                dr.paragraphs.map((p: string, i: number) => (
                  <p key={i} className="text-[14px] md:text-[15px] text-[#F4F1EA]/50 leading-[1.65] font-sans" dangerouslySetInnerHTML={{ __html: p }} />
                ))
              ) : (
                <p className="text-[14px] md:text-[15px] text-[#F4F1EA]/50 leading-[1.65] font-sans">{dr.text}</p>
              )}
              {dr.microProof && (
                <p className="text-[12px] font-mono uppercase tracking-[0.06em] text-[#F4F1EA]/25 pt-3">{dr.microProof}</p>
              )}
            </div>
          </PdpSectionRow>
        );
      })()}

      {/* ─── 8. RESULTS OVER TIME — LIGHT ─── */}
      <PdpSectionRow
        eyebrow="Results Over Time"
        heading="What consistent gut-mito support can look like."
        intro="Gut-barrier and mitochondrial adaptation is assessed over weeks, not days."
        bg={LIGHT}
        className="cb-reveal"
      >
        <div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-8 lg:justify-start justify-center">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.06em] transition-all min-h-[34px] px-3.5 md:px-5 py-1.5 rounded-full whitespace-nowrap ${focusRing}`}
                style={activeTimeline === i
                  ? { background: BASE_DARK, color: '#F4F1EA' }
                  : { background: 'transparent', color: 'rgba(10,18,32,0.4)', border: '1px solid rgba(10,18,32,0.1)' }
                }
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#0A1220]/[0.06] rounded-xl p-7 md:p-9 min-h-[180px]" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
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
            <p className="text-[11px] font-sans text-[#0A1220]/25 mt-5 lg:text-left text-center">{(data as any).timelineConfidence}</p>
          )}
        </div>
      </PdpSectionRow>

      {/* ─── 9. HOW TO USE — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="How to Use"
        heading="How to take CELLUBIOME."
        bg={SECONDARY_DARK}
        dark
        className="cb-reveal"
      >
        <div className="max-w-md lg:max-w-none">
          <div className="rounded-xl p-6 md:p-8 lg:p-9 border border-white/[0.06]" style={{ backgroundColor: '#15202F' }}>
            <p className="text-[17px] text-white/60 font-sans font-medium leading-relaxed text-center lg:text-left mb-6">Take 2 enteric capsules daily. With or without food.</p>
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              {[
                'Consistency matters more than exact timing.',
                'This is a daily formula, not a one-off gut reset.',
                'Most people assess results over 8\u201312 weeks of daily use.',
                'Pairs cleanly with CELLUNAD+ as a broader daily foundation.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[13px] text-white/40 font-sans leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdpSectionRow>

      {/* ─── 10. COMPARISON — LIGHT ─── */}
      <PdpComparisonShell
        eyebrow="Compare"
        heading="How CELLUBIOME differs from generic gut formulas."
        bg={LIGHT}
      >
        <div className="bg-white rounded-xl border border-[#0A1220]/[0.06] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(10,18,32,0.04)' }}>
          <div className="grid grid-cols-2">
            <div className="px-5 md:px-7 lg:px-9 py-4 lg:py-5 border-b-2 border-ar-teal/30">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-ar-teal">CELLUBIOME</span>
            </div>
            <div className="px-5 md:px-7 lg:px-9 py-4 lg:py-5 border-b border-[#0A1220]/[0.06] border-l border-[#0A1220]/[0.06]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-[#0A1220]/25">Other Brands</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-5 md:px-7 lg:px-9 py-5 lg:py-7 space-y-3 lg:space-y-4">
              {data.comparison.us.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-ar-teal shrink-0 mt-2" />
                  <span className="text-[13px] lg:text-[14px] font-sans text-[#0A1220]/60 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-5 md:px-7 lg:px-9 py-5 lg:py-7 space-y-3 lg:space-y-4 border-l border-[#0A1220]/[0.06]">
              {data.comparison.them.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-[#0A1220]/15 shrink-0 mt-2" />
                  <span className="text-[13px] lg:text-[14px] font-sans text-[#0A1220]/30 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdpComparisonShell>

      {/* ─── 11. STACKING — SECONDARY_DARK ─── */}
      <PdpSectionRow
        eyebrow="Where It Fits"
        heading="Where CELLUBIOME sits in the system."
        intro="CELLUBIOME adds a gut-mito layer to your daily routine. Most people pair it with CELLUNAD+ first."
        bg={SECONDARY_DARK}
        dark
        className="cb-reveal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {data.stack.map((item, i) => (
            <div
              key={i}
              className="cb-reveal border border-white/[0.06] rounded-xl p-6 md:p-7 lg:p-8 space-y-3 hover:border-white/[0.10] transition-colors flex flex-col"
              style={{ backgroundColor: '#15202F' }}
            >
              <div className="flex justify-between items-start gap-3">
                <h4 className="text-[16px] lg:text-[18px] font-head font-normal uppercase tracking-[-0.02em] text-white/90">{item.name}</h4>
                <span className="font-mono text-[9px] px-2.5 py-1 rounded uppercase shrink-0 text-white/30 border border-white/[0.08]">{item.role}</span>
              </div>
              <p className="text-[13px] text-white/40 font-sans leading-relaxed flex-1">{item.add}</p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.10em]">{item.when}</p>
              <div className="flex gap-3 pt-1">
                <a
                  href={`/product/${item.slug}`}
                  className={`flex-1 py-2.5 border border-white/[0.08] rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.06em] hover:bg-white/[0.03] transition-colors text-center min-h-[38px] flex items-center justify-center text-white/40 hover:text-white/60 ${focusRing}`}
                  data-testid={`stack-view-${item.slug}`}
                >
                  Learn More
                </a>
                <button
                  onClick={() => addStackItem(item.slug)}
                  className={`flex-1 py-2.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition-all min-h-[38px] bg-ar-teal text-[#0A1220] hover:brightness-110 active:scale-[0.97] ${focusRing}`}
                  data-testid={`stack-add-${item.slug}`}
                >
                  {item.slug === 'cellunad' ? 'Add the daily foundation' : 'Add the monthly layer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </PdpSectionRow>

      {/* ─── 12. FAQ — LIGHT ─── */}
      <PdpFaqShell
        heading="Before you start"
        intro="Everything you need to know about CELLUBIOME before adding it to your routine."
        bg={LIGHT}
        links={
          <a href="/faq" className={`text-[11px] font-mono uppercase tracking-[0.10em] text-[#0A1220]/35 hover:text-[#0A1220]/60 transition-colors ${focusRing} rounded`} data-testid="link-all-faqs">
            View all FAQs →
          </a>
        }
      >
        <div className="border-t" style={{ borderColor: 'rgba(10,18,32,0.08)' }}>
          {data.faq.map((item, i) => (
            <div key={i} className="border-b" style={{ borderColor: 'rgba(10,18,32,0.08)' }}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className={`w-full flex items-center justify-between py-5 md:py-6 text-left gap-6 min-h-[56px] ${focusRing} rounded`}
                data-testid={`faq-toggle-${i}`}
              >
                <span className="text-[14px] md:text-[15px] lg:text-[16px] font-sans font-semibold text-[#0A1220]/75 leading-snug">{item.q}</span>
                <ChevronDown size={16} className={`shrink-0 text-[#0A1220]/20 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: faqOpen === i ? '400px' : '0', opacity: faqOpen === i ? 1 : 0 }}
              >
                <p className="pb-6 text-[14px] lg:text-[15px] font-sans text-[#0A1220]/45 leading-[1.65] pr-8">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </PdpFaqShell>

      {/* ─── 13. FINAL CTA — BASE_DARK ─── */}
      <PdpFinalCtaBand
        heading={
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-[0.92]" style={{ fontSize: 'clamp(1.7rem, 5.5vw, 3rem)' }}>
            Add targeted
            <br />
            <span className="text-white/30">gut-mito support.</span>
          </h2>
        }
        sub={
          <p className="mt-5 text-[14px] font-sans text-white/35 max-w-[36ch] mx-auto leading-[1.6]">
            Best if gut support is the priority or if you want a stronger daily base.
          </p>
        }
        cta={
          <button
            onClick={handleAddToCart}
            className={`group relative px-10 min-h-[50px] inline-flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] overflow-hidden hover:scale-[1.02] active:scale-[0.97] transition-transform ${focusRing}`}
            style={{ boxShadow: '0 2px 12px rgba(45,212,191,0.2), 0 0 24px rgba(45,212,191,0.06)' }}
            data-testid="final-add-to-cart"
          >
            <span className="relative z-10">Add CELLUBIOME to Cart</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        }
        footerNote="2 capsules daily · Enteric-protected · Fully disclosed"
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

      <StickyMobileBuyBar data={data} onAdd={handleAddToCart} />
    </div>
  );
}
