import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  ArrowRight,
  Check,
  Activity,
  Zap,
  Clock,
  Microscope,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Dna,
  Layers,
  FlaskConical,
  Plus,
  Minus,
  Info,
  Shield,
  X,
  FileText,
  Menu,
  ShoppingBag,
  RotateCcw,
  Wind,
  Heart,
  Brain,
  Flame,
  Star,
  BadgeCheck,
  Timer
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from './components/Footer';
import { PRODUCT_IMAGES, PRODUCT_DETAIL_DATA } from './productData';
import { useCart } from './cartStore';
import { PRODUCTS } from './productsData';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<string, any> = { Zap, Dna, Activity, Layers, ShieldCheck, RotateCcw, Wind, Heart, Brain, Flame, Shield, Timer };

function getIcon(name: string) {
  return ICON_MAP[name] || Activity;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Science', href: '/science' },
    { label: 'Quality', href: '/quality' },
    { label: 'FAQ', href: '/faq' }
  ];

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[150] transition-all duration-500',
          scrolled
            ? 'bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10] shadow-[0_1px_12px_rgba(0,0,0,0.2)]'
            : 'bg-transparent border-b border-white/[0.04]'
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert transition-opacity duration-500" />
          </a>
          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-white/55 hover:text-teal-300 transition-colors" data-testid={`nav-link-pdp-${l.label.toLowerCase()}`}>{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={cart.openCart} className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart-pdp">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">{cart.totalItems}</span>
            </button>
            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle-pdp"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[140] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 pt-16 pb-6 px-6 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.08]">
            <div className="flex flex-col gap-0">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors border-b border-white/[0.05] last:border-0"
                  data-testid={`mobile-nav-pdp-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModalFacts({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: typeof PRODUCT_DETAIL_DATA.cellunad }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white text-[#0b1120] p-8 overflow-y-auto max-h-[90vh] shadow-2xl rounded-t-2xl sm:rounded-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full" data-testid="button-close-facts">
          <X size={20} />
        </button>
        <div className="border-b-4 border-black pb-2 mb-4">
          <h2 className="text-2xl font-head font-normal uppercase tracking-tight">Supplement Facts</h2>
          <p className="text-sm font-sans mt-1">Serving Size: {data.supplementFacts.servingSize}</p>
          <p className="text-sm font-sans">Servings Per Container: {data.supplementFacts.servingsPerContainer}</p>
        </div>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 font-bold">Amount Per Serving</th>
              <th className="py-2 text-right font-bold">%DV</th>
            </tr>
          </thead>
          <tbody>
            {data.supplementFacts.items.map((item, i) => (
              <tr key={i} className="border-b border-black/10">
                <td className="py-2">{item.name} <span className="font-bold ml-2">{item.amount}</span></td>
                <td className="py-2 text-right font-bold">{item.dv || "†"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-[10px] leading-tight space-y-2">
          <p>† Daily Value (DV) not established.</p>
          <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
          {data.supplementFacts.allergenNote && (
            <p className="pt-2"><span className="font-bold uppercase">Allergens:</span> {data.supplementFacts.allergenNote}</p>
          )}
          <p className="pt-1"><span className="font-bold uppercase">Other Ingredients:</span> {data.supplementFacts.otherIngredients}</p>
        </div>
      </div>
    </div>
  );
}

function ImageCarousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const itemWidth = el.offsetWidth * 0.82;
      const idx = Math.round(scrollLeft / itemWidth);
      setCurrent(Math.min(idx, images.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [images.length]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 pl-5 md:pl-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        data-testid="carousel-scroll"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="snap-start shrink-0 rounded-xl overflow-hidden bg-white/[0.03]"
            style={{ width: '85%', maxWidth: '560px' }}
          >
            <div className="aspect-[4/3] w-full">
              <img
                src={src}
                alt={`Product image ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover"
                data-testid={`carousel-image-${i}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 justify-center mt-1">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white/60' : 'w-1.5 bg-white/15'}`}
          />
        ))}
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="w-full divide-y divide-white/[0.06]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full py-5 md:py-6 flex justify-between items-center text-left hover:opacity-80 transition-opacity gap-4"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="text-[14px] md:text-[15px] font-sans font-medium text-white/80 leading-snug">{item.q}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 text-white/40 ${openIndex === i ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="pb-5 md:pb-6 text-white/50 text-[14px] leading-relaxed font-sans">
                {item.a}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="h-[1px] w-10 bg-ar-teal" />
      <span className="font-mono text-[11px] text-ar-teal uppercase tracking-[0.18em]">{label}</span>
      <div className="h-[1px] w-10 bg-ar-teal" />
    </div>
  );
}

function ProductDetailPage({ data, slug }: { data: typeof PRODUCT_DETAIL_DATA.cellunad; slug: string }) {
  const [showSticky, setShowSticky] = useState(false);
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [, navigate] = useLocation();
  const cart = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data.name]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pdp-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out'
        });
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [data.name]);

  const accentColor = data.accentText;
  const images = PRODUCT_IMAGES[slug as keyof typeof PRODUCT_IMAGES] || PRODUCT_IMAGES.cellunad;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0b1120] text-white selection:bg-teal-500/30 selection:text-white font-sans antialiased">
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />

      <div className={`fixed bottom-0 left-0 w-full z-[110] bg-white text-[#0b1120] border-t border-black/10 py-3 px-5 transition-transform duration-500 transform ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <h4 className="text-sm font-head font-normal tracking-tight uppercase leading-none">{data.name}</h4>
            <span className="text-xs text-black/40">|</span>
            <span className="text-sm font-head font-normal tracking-tighter">${data.priceSubscribe.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:hidden text-left">
              <span className="text-lg font-head font-normal tracking-tighter">${data.priceSubscribe.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate(`/product/${slug}/purchase`)} className="flex-1 sm:flex-none py-3 px-8 bg-ar-teal text-ar-navy rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all min-h-[44px]" data-testid="sticky-cta">
              Start Now
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      {/* ───── HERO: Seed-style image carousel left + purchase card right ───── */}
      <section className="relative pt-16 pb-6 lg:pt-24 lg:pb-16 px-5 md:px-10 lg:px-[60px] overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] blur-[120px] pointer-events-none rounded-full" style={{ background: `${data.accent}18` }} />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-14 items-start">

          <div className="-mx-5 md:mx-0">
            <ImageCarousel images={images} />
          </div>

          <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-6">
            <div className="space-y-2 lg:space-y-3">
              <p className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em]" style={{ color: accentColor }}>{data.tagline}</p>
              <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                {data.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(data.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
                  ))}
                </div>
                <span className="text-[13px] text-white/50 font-sans">{data.rating} · {data.reviewCount.toLocaleString()} Reviews</span>
              </div>
            </div>

            <p className="text-[13px] lg:text-[15px] text-white/60 font-sans leading-relaxed max-w-md">
              {data.subtitle}
            </p>

            <div className="space-y-4 lg:space-y-5">
              <div>
                <span className="text-3xl lg:text-4xl font-head font-normal tracking-tighter text-white">${data.priceSubscribe.toFixed(2)}</span>
                <span className="ml-2 text-sm text-white/35 line-through">${data.priceOneTime.toFixed(2)}</span>
              </div>

              <div className="text-[13px] text-white/45 font-sans leading-snug">
                {data.supplyLabel}<br />{data.subscribeNote}
              </div>

              <button
                onClick={() => navigate(`/product/${slug}/purchase`)}
                className="w-full py-4 bg-ar-teal text-ar-navy rounded-xl font-mono text-[12px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all flex items-center justify-center gap-2 min-h-[52px]"
                style={{ boxShadow: '0 0 20px rgba(45,212,191,0.15)' }}
                data-testid="start-now"
              >
                Start Now <ArrowRight size={14} />
              </button>

              <p className="text-center text-[12px] text-white/30 font-sans italic">
                30-day risk-free guarantee. Free US shipping.
              </p>

              <div className="flex items-center gap-4 text-[10px] justify-center text-white">
                <button
                  onClick={() => setIsFactsOpen(true)}
                  className="flex items-center gap-1.5 font-mono uppercase font-bold tracking-[0.10em] opacity-40 hover:opacity-70 transition-all"
                  data-testid="view-supplement-facts"
                >
                  <FileText size={11} /> Supplement Facts
                </button>
                <span className="opacity-15">|</span>
                <div className="flex items-center gap-1.5 font-mono uppercase font-bold tracking-[0.10em] opacity-40">
                  <Shield size={11} /> cGMP
                </div>
                <span className="opacity-15">|</span>
                <div className="flex items-center gap-1.5 font-mono uppercase font-bold tracking-[0.10em] opacity-40">
                  <FlaskConical size={11} /> Tested
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── BENEFIT HIGHLIGHTS STRIP ───── */}
      <section className="pdp-reveal py-12 md:py-16 border-y border-white/[0.05] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.benefitHighlights.map((h, i) => {
              const Icon = getIcon(h.icon);
              return (
                <div key={i} className="flex gap-4 items-start" data-testid={`highlight-${i}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${data.accent}15`, border: `1px solid ${accentColor}25` }}>
                    <Icon size={18} style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-sans font-semibold text-white mb-1">{h.title}</p>
                    <p className="text-[12px] text-white/45 font-sans leading-snug">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── SCIENCE SECTION ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div>
              <SectionLabel label="The Science" />
              <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>{data.scienceSection.headline}</h2>
            </div>
            <div className="space-y-5 text-white/55 text-[15px] md:text-[17px] leading-relaxed font-sans">
              {data.scienceSection.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="relative p-8 md:p-12 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.14em]">{data.scienceSection.diagramLabel}</div>
            {data.scienceSection.diagramCenter ? (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 relative w-full pt-6">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border flex flex-col items-center justify-center text-center p-4" style={{ borderColor: `${accentColor}40`, background: `${data.accent}10` }}>
                  {data.scienceSection.diagramCenter.icon && (() => { const Ic = getIcon(data.scienceSection.diagramCenter.icon); return <Ic size={22} style={{ color: accentColor }} className="mb-1" />; })()}
                  <p className="font-mono text-[9px] font-bold uppercase" style={{ color: accentColor }}>{data.scienceSection.diagramCenter.label}</p>
                </div>
                <ArrowRight size={20} className="text-white/10 hidden md:block" />
                <div className="flex flex-col gap-2.5 w-full md:w-auto">
                  {data.scienceSection.diagramNodes.map((n, i) => {
                    const Ic = getIcon(n.icon);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 border border-white/[0.06] bg-white/[0.02] rounded-lg w-full md:w-56">
                        <Ic size={14} style={{ color: `${accentColor}80` }} />
                        <span className="font-mono text-[10px] uppercase font-bold tracking-[0.08em]">{n.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 relative w-full pt-6">
                <div className="w-full grid grid-cols-3 gap-3">
                  {data.scienceSection.diagramNodes.map((n, i) => {
                    const Ic = getIcon(n.icon);
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 p-4 md:p-5 border border-white/[0.06] bg-white/[0.02] text-center rounded-lg">
                        <Ic size={20} style={{ color: `${accentColor}80` }} />
                        <span className="font-mono text-[9px] uppercase font-bold tracking-[0.08em]">{n.label}</span>
                      </div>
                    );
                  })}
                </div>
                {data.scienceSection.diagramFooter && (
                  <div className="p-4 border w-full text-center rounded-lg" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08` }}>
                    <p className="font-mono text-[10px] font-bold uppercase mb-1" style={{ color: accentColor }}>{data.scienceSection.diagramFooter.label}</p>
                    <p className="text-[12px] text-white/40">{data.scienceSection.diagramFooter.text}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── DELIVERY RATIONALE (CELLUBIOME only) ───── */}
      {data.deliveryRationale && (
        <section className="pdp-reveal py-12 md:py-16 px-5 md:px-10 lg:px-[60px] text-center border-y border-white/[0.05]">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full" style={{ background: `${data.accent}10`, border: `1px solid ${accentColor}20` }}>
              <FlaskConical size={18} style={{ color: accentColor }} />
            </div>
            <h3 className="font-head font-normal uppercase tracking-[-0.02em] text-white text-xl md:text-2xl">{data.deliveryRationale.headline}</h3>
            <p className="text-white/50 text-[14px] leading-relaxed font-sans max-w-md mx-auto">{data.deliveryRationale.text}</p>
          </div>
        </section>
      )}

      {/* ───── BENEFITS TIMELINE ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.02]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <SectionLabel label="Results Over Time" />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
              Benefits that build over time
            </h2>
            <p className="text-[14px] text-white/40 font-sans mt-2">What to expect with consistent use.*</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-all min-h-[36px] ${
                  activeTimeline === i
                    ? 'bg-ar-teal text-ar-navy'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
                }`}
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 md:p-10 min-h-[180px]">
            <h3 className="font-head font-normal uppercase tracking-tight text-white text-lg mb-4">{data.benefitsTimeline[activeTimeline].time}</h3>
            <ul className="space-y-3">
              {data.benefitsTimeline[activeTimeline].items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-[14px] text-white/60 font-sans leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── HOW TO USE ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-xl overflow-hidden aspect-[4/3]">
            <img src="/images/how-to-use.jpg" alt="How to use" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <SectionLabel label="How to Use" />
              <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Simple daily routine</h2>
            </div>
            <p className="text-lg text-white/70 font-sans font-medium leading-relaxed">{data.howToUse.instruction}</p>
            <div className="space-y-3">
              {data.howToUse.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                  <span className="text-[14px] text-white/50 font-sans">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── INGREDIENT DEEP DIVE ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <SectionLabel label="Ingredients" />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
              What's inside
            </h2>
          </div>

          <div className="space-y-6">
            {data.ingredientGroups.map((group, i) => (
              <div key={i} className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="text-[15px] font-head font-normal uppercase tracking-tight text-white">{group.category}</h3>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.10em] px-3 py-1 rounded-full" style={{ color: accentColor, background: `${data.accent}15` }}>
                    {group.totalDose}
                  </span>
                </div>
                <p className="text-[13px] text-white/45 font-sans leading-relaxed">{group.desc}</p>
                <div className="border-t border-white/[0.05] pt-3">
                  <p className="font-mono text-[9px] text-white/25 uppercase tracking-[0.12em] mb-2">Ingredients</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                    {group.ingredients.map((ing, j) => (
                      <span key={j} className="text-[13px] text-white/60 font-sans">{ing}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsFactsOpen(true)}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase font-bold tracking-[0.12em] text-white/40 hover:text-white/70 transition-all"
              data-testid="view-full-label"
            >
              <FileText size={14} /> View Full Supplement Facts
            </button>
          </div>
        </div>
      </section>

      {/* ───── QUALITY BADGES ───── */}
      <section className="pdp-reveal py-12 md:py-16 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {data.qualityBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full" data-testid={`badge-${i}`}>
                <BadgeCheck size={14} style={{ color: accentColor }} />
                <span className="font-mono text-[10px] uppercase font-bold tracking-[0.08em] text-white/50">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMPARISON TABLE ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <SectionLabel label="Compare" />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
              How {data.name} compares
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-white/[0.06]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em]" style={{ color: accentColor }}>{data.name}</span>
              </div>
              {data.comparison.us.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={14} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-[13px] text-white/60 font-sans leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-white/[0.06]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-white/30">Other Brands</span>
              </div>
              {data.comparison.them.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <X size={14} className="shrink-0 mt-0.5 text-white/20" />
                  <span className="text-[13px] text-white/35 font-sans leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── WHO IT'S FOR ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <div>
              <SectionLabel label="Suitability" />
              <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Who it's for</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.suitability.map((item, i) => (
                <div key={i} className="flex gap-3 items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                  <Check size={14} style={{ color: accentColor }} />
                  <span className="text-[13px] font-sans text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8 border border-white/[0.06] bg-white/[0.02] rounded-xl space-y-4">
            <div className="flex items-center gap-3 text-white/40">
              <Info size={16} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.10em]">Important</p>
            </div>
            <p className="text-white/45 text-[14px] leading-relaxed font-sans">{data.safetyNote}</p>
            {data.allergenDisclosure && (
              <div className="p-3 border rounded-lg text-[11px] font-mono uppercase tracking-[0.10em]" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08`, color: accentColor }}>
                {data.allergenDisclosure}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── STACKING / PAIRS WELL WITH ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <SectionLabel label="Works Together" />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Pairs well with</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.stack.map((item, i) => (
              <div key={i} className="border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 blur-[50px] transition-all" style={{ background: `${data.accent}08` }} />
                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between items-center gap-3">
                    <h4 className="text-lg font-head font-normal uppercase tracking-tight">{item.name}</h4>
                    <span className="font-mono text-[9px] border px-2 py-1 rounded-full uppercase shrink-0" style={{ color: accentColor, borderColor: `${accentColor}30` }}>{item.role}</span>
                  </div>
                  <p className="text-[13px] text-white/50 font-sans leading-relaxed">{item.add}</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/30 uppercase tracking-[0.12em] relative z-10">
                  <Clock size={11} /> {item.when}
                </div>
                <div className="flex gap-3 pt-1 relative z-10">
                  <a href={`/product/${item.slug}`} className="flex-1 py-3 border border-white/10 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.08em] hover:bg-white/[0.04] transition-all text-center min-h-[40px] flex items-center justify-center" data-testid={`stack-view-${item.slug}`}>Learn More</a>
                  <button className="flex-1 py-3 bg-ar-teal text-ar-navy rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.08em] hover:bg-ar-teal/90 transition-all min-h-[40px]" data-testid={`stack-add-${item.slug}`}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTING & QUALITY ───── */}
      <section className="pdp-reveal py-12 md:py-16 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <ShieldCheck size={20} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Full label disclosure</p>
              <p className="text-[12px] text-white/40 font-sans leading-snug">Every ingredient and dose is listed. No proprietary blends.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <FlaskConical size={20} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Third-party tested</p>
              <p className="text-[12px] text-white/40 font-sans leading-snug">Tested for purity, potency, and contaminants by independent labs.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <Microscope size={20} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-sans font-semibold text-white mb-1">Clinically studied doses</p>
              <p className="text-[12px] text-white/40 font-sans leading-snug">Doses match or exceed amounts used in published clinical research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="pdp-reveal py-16 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <SectionLabel label="FAQ" />
            <h3 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight mt-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Questions? We're here to help.</h3>
          </div>
          <Accordion items={data.faq} />
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative py-16 md:py-24 px-6 text-white overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${data.accent}12 0%, transparent 70%)` }} />
        <div className="max-w-2xl mx-auto text-center relative z-10 space-y-5">
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
            {data.ctaHeadline[0]}
            <br />
            <span className="text-white/40">{data.ctaHeadline[1]}</span>
          </h2>
          <p className="text-[14px] text-white/45 font-sans max-w-md mx-auto leading-relaxed">{data.ctaBody}</p>
          <button className="inline-flex items-center justify-center px-10 py-4 min-h-[48px] bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.12em] hover:bg-ar-teal/90 transition-colors gap-2" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(45,212,191,0.15)' }} data-testid="final-cta">
            {data.ctaButton} <ArrowRight size={14} />
          </button>
          <p className="text-[11px] text-white/30 font-sans">30-day satisfaction guarantee. Free shipping on subscriptions.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" /></div>

      <div className="py-8 px-6">
        <p className="font-mono text-[10px] text-white/15 uppercase tracking-[0.08em] leading-relaxed text-center max-w-3xl mx-auto">
          * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || 'cellunad';
  const data = PRODUCT_DETAIL_DATA[slug as keyof typeof PRODUCT_DETAIL_DATA];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-head font-normal uppercase tracking-tight">Product Not Found</h1>
          <a href="/shop" className="text-teal-400 font-mono text-sm uppercase tracking-wider hover:text-teal-300 transition-colors" data-testid="link-back-shop">Back to Shop</a>
        </div>
      </div>
    );
  }

  return <ProductDetailPage key={slug} data={data} slug={slug} />;
}
