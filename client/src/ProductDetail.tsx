import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Timer,
  ZoomIn
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
  const [shopOpen, setShopOpen] = useState(false);
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
                l.label === 'Shop' ? (
                  <div key={l.label} className="border-b border-white/[0.05]">
                    <button
                      onClick={() => setShopOpen(!shopOpen)}
                      className="w-full py-3 min-h-[44px] flex items-center justify-between text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors"
                      data-testid="mobile-nav-pdp-shop-toggle"
                    >
                      {l.label}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${shopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {shopOpen && (
                      <div className="flex flex-col gap-0 pl-4 pb-2">
                        <a href="/product/cellunad" onClick={() => setMobileOpen(false)} className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors" data-testid="mobile-nav-product-cellunad">CELLUNAD+</a>
                        <a href="/product/cellubiome" onClick={() => setMobileOpen(false)} className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors" data-testid="mobile-nav-product-cellubiome">CELLUBIOME</a>
                        <a href="/product/cellunova" onClick={() => setMobileOpen(false)} className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors" data-testid="mobile-nav-product-cellunova">CELLUNOVA</a>
                        <a href="/shop" onClick={() => setMobileOpen(false)} className="min-h-[40px] flex items-center text-[12px] font-mono uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors italic" data-testid="mobile-nav-shop-viewall">View All <ArrowRight size={12} className="ml-1.5" /></a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors border-b border-white/[0.05] last:border-0"
                    data-testid={`mobile-nav-pdp-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </a>
                )
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

function ImageLightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [images.length, onClose]);

  const goTo = (newIdx: number) => setIdx(newIdx);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col" data-testid="lightbox">
      <div className="flex items-center justify-between p-4 shrink-0">
        <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.10em]">{idx + 1} / {images.length}</span>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" data-testid="lightbox-close">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {idx > 0 && (
          <button onClick={() => goTo(idx - 1)} className="fixed left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all" data-testid="lightbox-prev">
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="min-h-full flex items-center justify-center p-4">
          <img
            src={images[idx]}
            alt={`Product image ${idx + 1}`}
            className="max-w-[90vw] max-h-[75vh] object-contain select-none"
            draggable={false}
            data-testid="lightbox-image"
          />
        </div>

        {idx < images.length - 1 && (
          <button onClick={() => goTo(idx + 1)} className="fixed right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all" data-testid="lightbox-next">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <div className="flex gap-2 justify-center p-4 shrink-0">
        {images.map((src, i) => (
          <button key={i} onClick={() => goTo(i)} className={`w-14 h-10 rounded overflow-hidden border-2 transition-all ${i === idx ? 'border-white/60' : 'border-transparent opacity-40 hover:opacity-70'}`} data-testid={`lightbox-thumb-${i}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({ images, accent, lightMode }: { images: string[]; accent?: string; lightMode?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const glowColor = accent || '#2dd4bf';

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

  const isBottleImage = (src: string) => {
    const lower = src.toLowerCase();
    return lower.includes('bottle') || lower.includes('front') || lower.includes('transparent');
  };

  return (
    <>
      {lightboxIndex !== null && createPortal(
        <ImageLightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />,
        document.body
      )}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-0 pl-5 md:pl-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          data-testid="carousel-scroll"
        >
          {images.map((src, i) => {
            const isBottle = isBottleImage(src);
            const cardBg = lightMode
              ? (isBottle ? '#f0f0ec' : 'transparent')
              : (isBottle
                ? `radial-gradient(ellipse at center 60%, ${glowColor}12 0%, ${glowColor}06 40%, rgba(15,23,42,0.95) 70%)`
                : 'rgba(255,255,255,0.03)');
            return (
              <div
                key={src}
                className="snap-start shrink-0 overflow-hidden relative rounded-lg cursor-pointer group"
                style={{
                  width: lightMode ? '90%' : '85%',
                  maxWidth: '560px',
                  background: cardBg,
                }}
                onClick={() => setLightboxIndex(i)}
                data-testid={`carousel-card-${i}`}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  {isBottle && !lightMode && (
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: `radial-gradient(circle at 50% 55%, ${glowColor}15 0%, transparent 60%)`,
                    }} />
                  )}
                  <img
                    src={src}
                    alt={`Product image ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className={`w-full h-full relative z-[1] ${lightMode && isBottle ? 'object-cover scale-[1.15] mix-blend-multiply' : lightMode ? 'object-cover' : isBottle ? 'object-contain p-6' : 'object-cover'}`}
                    data-testid={`carousel-image-${i}`}
                  />
                  <div className={`absolute inset-0 z-[2] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${lightMode ? 'bg-black/10' : 'bg-black/20'}`}>
                    <ZoomIn size={24} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
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

function SectionLabel({ label, color, align = 'center' }: { label: string; color?: string; align?: 'center' | 'left' }) {
  const c = color || '#2dd4bf';
  return (
    <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <div className="h-[1px] w-8" style={{ background: c }} />
      <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: c }}>{label}</span>
      <div className="h-[1px] w-8" style={{ background: c }} />
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

      <div className={`fixed bottom-0 left-0 w-full z-[110] backdrop-blur-xl py-3 px-5 transition-transform duration-500 transform ${showSticky ? 'translate-y-0' : 'translate-y-full'}`} style={{ background: 'rgba(245,242,236,0.97)', borderTop: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <h4 className="text-sm font-head font-normal tracking-tight uppercase leading-none text-[#0b1120]">{data.name}</h4>
            <span className="text-xs text-black/30">|</span>
            <span className="text-sm font-head font-normal tracking-tighter text-[#0b1120]">${data.priceSubscribe.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:hidden text-left">
              <span className="text-lg font-head font-normal tracking-tighter text-[#0b1120]">${data.priceSubscribe.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate(`/product/${slug}/purchase`)} className="flex-1 sm:flex-none py-3 px-8 rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-all min-h-[44px] active:scale-[0.98]" style={{ background: '#1fb8ac', color: '#0b1120' }} data-testid="sticky-cta">
              Get {data.name}
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      {/* ───── HERO: Two-tone split — light carousel left, dark purchase right ───── */}
      <section className="relative pt-16 lg:pt-0 overflow-hidden">
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#f0f0ec]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0b1120]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 items-stretch">

          <div className="lg:bg-transparent">
            <div className="lg:py-24 lg:pr-10 lg:px-0">
              <div className="hidden lg:block px-5 md:px-8">
                <ImageCarousel images={images} accent={data.accent} lightMode />
              </div>
              <div className="lg:hidden">
                <div className="bg-[#f0f0ec] py-4 px-5 md:px-8">
                  <ImageCarousel images={images} accent={data.accent} lightMode />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:py-24 lg:pl-10 px-5 md:px-10 lg:px-0">
            <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-6 pt-5 lg:pt-0 pb-8 lg:pb-0">
              <div className="space-y-1.5 lg:space-y-3">
                <p className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em]" style={{ color: accentColor }}>{data.tagline}</p>
                <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.9] uppercase text-white" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                  {data.name}
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

              <div className="space-y-2.5">
                <p className="text-[13px] lg:text-[15px] text-white/45 font-sans leading-relaxed max-w-md">
                  {data.heroBullets ? data.heroBullets.lead : data.subtitle}
                </p>
                {data.heroBullets && (
                  <ul className="space-y-1.5 pl-0.5">
                    {data.heroBullets.points.map((pt: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-[5px] w-[5px] h-[5px] rounded-full shrink-0 opacity-50" style={{ backgroundColor: accentColor }} />
                        <span className="text-[13px] lg:text-[14px] text-white/50 font-sans leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-4 lg:space-y-5">
                <div className="space-y-1.5">
                  {slug === 'cellubiome' && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.06em] bg-white/[0.06] text-white/50 border border-white/[0.08]" data-testid="bestseller-badge">Bestseller</span>
                  )}
                  <div>
                    <span className="text-2xl font-sans font-semibold text-white">${data.priceOneTime.toFixed(2)}</span>
                  </div>
                  <div className="text-[13px] text-white/45 font-sans leading-snug">
                    {data.supplyLabel}<br />{data.subscribeNote}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/product/${slug}/purchase`)}
                  className="w-full py-3.5 bg-ar-teal text-ar-navy rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.08em] hover:brightness-110 hover:shadow-[0_0_24px_rgba(45,212,191,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  style={{ boxShadow: '0 0 16px rgba(45,212,191,0.12)' }}
                  data-testid="start-now"
                >
                  Get {data.name} <ArrowRight size={13} />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-white/30 font-sans">
                  <span>30-day guarantee</span>
                  <span className="text-white/15">·</span>
                  <span>Free US shipping</span>
                  <span className="text-white/15">·</span>
                  <span>Cancel anytime</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-4 text-[10px] text-white">
                    <div className="flex items-center gap-1.5 font-mono uppercase font-bold tracking-[0.10em] opacity-30">
                      <Shield size={11} /> cGMP
                    </div>
                    <div className="flex items-center gap-1.5 font-mono uppercase font-bold tracking-[0.10em] opacity-30">
                      <FlaskConical size={11} /> Tested
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFactsOpen(true)}
                    className="text-[12px] font-sans text-white/50 hover:text-white/80 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all"
                    data-testid="view-supplement-facts"
                  >
                    Supplement Facts →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── BENEFIT HIGHLIGHTS ───── */}
      {(() => {
        const override = (data as any).benefitSectionOverride;
        const hasOverride = !!override;
        const eyebrow = hasOverride ? override.eyebrow : "Key Benefits";
        const subhead = hasOverride ? override.subhead : null;
        const isCompact = data.benefitHighlights.length <= 2;
        const mineralTeal = hasOverride ? '#1fb8ac' : accentColor;

        return (
          <section className="pdp-reveal relative" style={{ background: hasOverride ? '#081422' : undefined }}>
            {hasOverride && (
              <div className="absolute top-0 left-0 right-0 h-32 z-[1]" style={{ background: 'linear-gradient(to bottom, #0b1120 0%, transparent 100%)' }} />
            )}
            {hasOverride && (
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(244,241,234,0.06)' }} />
            )}
            <div className="relative z-[2] py-24 md:py-32 px-5 md:px-10 lg:px-[60px]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-5 mb-20">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-[1px] w-6" style={{ background: `${mineralTeal}50` }} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: `${mineralTeal}90` }}>{eyebrow}</span>
                    <div className="h-[1px] w-6" style={{ background: `${mineralTeal}50` }} />
                  </div>
                  {hasOverride ? (
                    <div>
                      <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-[#F4F1EA] leading-[0.9]" style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)' }}>
                        {override.headlinePrimary}
                      </h2>
                      <p className="font-head font-normal tracking-[-0.02em] uppercase text-[#F4F1EA]/40 mt-1" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)' }}>
                        {override.headlineSecondary}
                      </p>
                    </div>
                  ) : (
                    <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>What it does</h2>
                  )}
                  {subhead && (
                    <p className="text-[13px] md:text-[15px] text-[#F4F1EA]/50 font-sans leading-relaxed max-w-[480px] mx-auto">{subhead}</p>
                  )}
                </div>

                <div className={`${isCompact ? 'flex flex-col items-center gap-0' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
                  {data.benefitHighlights.map((h, i) => {
                    const Icon = getIcon(h.icon);

                    if (isCompact) {
                      return (
                        <div key={i} className="w-full max-w-xl">
                          {i > 0 && (
                            <div className="flex justify-start pl-10 md:pl-12">
                              <div className="w-px h-10" style={{ background: `${mineralTeal}18` }} />
                            </div>
                          )}
                          <div
                            className="relative p-6 md:p-8 border rounded-[22px] overflow-hidden"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                              borderColor: 'rgba(244,241,234,0.08)',
                            }}
                            data-testid={`highlight-${i}`}
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
                      );
                    }

                    return (
                      <div key={i} className="p-6 md:p-7 border border-white/[0.06] bg-white/[0.02] space-y-4 group hover:border-white/[0.10] transition-all rounded-lg" data-testid={`highlight-${i}`}>
                        <div className="flex items-center gap-3">
                          <Icon size={16} style={{ color: `${accentColor}` }} />
                          <span className="font-mono text-[10px] font-bold uppercase text-white/40">0{i + 1}</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em] text-white">{h.title}</h4>
                          <p className="text-[13px] text-white/50 leading-relaxed font-sans font-medium">{h.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ───── SCIENCE SECTION ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <SectionLabel label="The Science" color={accentColor} align="left" />
                <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>{data.scienceSection.headline}</h2>
              </div>
              <div className="space-y-6 text-white/55 text-[16px] md:text-[18px] leading-relaxed font-sans font-medium">
                {data.scienceSection.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="relative p-8 md:p-12 bg-[#0b1120] border border-white/10 flex flex-col justify-center items-center overflow-hidden">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.14em]">{data.scienceSection.diagramLabel}</div>
              {data.scienceSection.diagramCenter ? (
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative w-full pt-6">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border flex flex-col items-center justify-center text-center p-4" style={{ borderColor: `${accentColor}40`, background: `${data.accent}10` }}>
                    {data.scienceSection.diagramCenter.icon && (() => { const Ic = getIcon(data.scienceSection.diagramCenter.icon); return <Ic size={24} style={{ color: accentColor }} className="mb-2" />; })()}
                    <p className="font-mono text-[10px] font-bold uppercase" style={{ color: accentColor }}>{data.scienceSection.diagramCenter.label}</p>
                  </div>
                  <ArrowRight size={24} className="text-white/10 hidden md:block" />
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    {data.scienceSection.diagramNodes.map((n, i) => {
                      const Ic = getIcon(n.icon);
                      return (
                        <div key={i} className="flex items-center gap-4 p-3.5 border border-white/10 bg-white/[0.03] w-full md:w-60">
                          <Ic size={16} style={{ color: `${accentColor}80` }} />
                          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.10em]">{n.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 relative w-full pt-6">
                  <div className="w-full grid grid-cols-3 gap-3">
                    {data.scienceSection.diagramNodes.map((n, i) => {
                      const Ic = getIcon(n.icon);
                      return (
                        <div key={i} className="flex flex-col items-center gap-3 p-4 md:p-6 border border-white/10 bg-white/[0.03] text-center">
                          <Ic size={22} style={{ color: `${accentColor}80` }} />
                          <span className="font-mono text-[9px] uppercase font-bold tracking-[0.10em]">{n.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {data.scienceSection.diagramFooter && (
                    <div className="p-4 border w-full text-center" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08` }}>
                      <p className="font-mono text-[11px] font-bold uppercase mb-1.5" style={{ color: accentColor }}>{data.scienceSection.diagramFooter.label}</p>
                      <p className="text-[12px] text-white/40">{data.scienceSection.diagramFooter.text}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───── DELIVERY RATIONALE (CELLUBIOME only) ───── */}
      {data.deliveryRationale && (
        <section className="pdp-reveal py-16 md:py-20 px-5 md:px-10 lg:px-[60px] text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full" style={{ background: `${data.accent}10`, border: `1px solid ${accentColor}20` }}>
              <FlaskConical size={20} style={{ color: accentColor }} />
            </div>
            <h3 className="font-head font-normal uppercase tracking-[-0.02em] text-white leading-tight" style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)' }}>{data.deliveryRationale.headline}</h3>
            <p className="text-white/50 text-[15px] leading-relaxed font-sans font-medium max-w-lg mx-auto">{data.deliveryRationale.text}</p>
          </div>
        </section>
      )}

      {/* ───── BENEFITS TIMELINE ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <SectionLabel label="Results Over Time" color={accentColor} />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
              Benefits that build
            </h2>
            <p className="text-[14px] text-white/40 font-sans font-medium">What to expect with consistent use.*</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {data.benefitsTimeline.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className="font-mono text-[10px] font-bold uppercase tracking-[0.10em] transition-all min-h-[36px] px-5 py-2"
                style={activeTimeline === i
                  ? { background: accentColor, color: '#0b1120', borderRadius: '999px' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', borderRadius: '999px' }
                }
                data-testid={`timeline-tab-${i}`}
              >
                {t.time}
              </button>
            ))}
          </div>

          <div className="border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 min-h-[180px]">
            <h3 className="font-head font-normal uppercase tracking-tight text-white text-lg mb-6" style={{ color: accentColor }}>{data.benefitsTimeline[activeTimeline].time}</h3>
            <ul className="space-y-4">
              {data.benefitsTimeline[activeTimeline].items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-[15px] text-white/60 font-sans font-medium leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── HOW TO USE ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="overflow-hidden aspect-[4/3]">
            <img src="/images/how-to-use.jpg" alt="How to use" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <SectionLabel label="How to Use" color={accentColor} align="left" />
              <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Simple routine</h2>
            </div>
            <p className="text-[17px] text-white/60 font-sans font-medium leading-relaxed">{data.howToUse.instruction}</p>
            <div className="space-y-4">
              {data.howToUse.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accentColor }} />
                  <span className="text-[15px] text-white/50 font-sans font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── INGREDIENT DEEP DIVE ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="space-y-3">
            <SectionLabel label="Key Ingredients" color={accentColor} align="left" />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>What's inside</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.ingredientGroups.map((group, i) => (
              <div key={i} className="p-7 md:p-8 border border-white/[0.06] bg-white/[0.02] space-y-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em] text-white max-w-[70%]">{group.category}</h4>
                    <span className="font-mono text-[10px] font-bold uppercase shrink-0" style={{ color: accentColor }}>{group.totalDose}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-sans font-medium">{group.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/[0.05]">
                  <p className="font-mono text-[9px] text-white/25 uppercase tracking-[0.12em] mb-3">Compounds</p>
                  <div className="space-y-2">
                    {group.ingredients.map((ing, j) => (
                      <p key={j} className="text-[13px] text-white/55 font-sans">{ing}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-20 pt-2">
                  <div className="h-[1px] flex-1 bg-white" />
                  <Microscope size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsFactsOpen(true)}
              className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase font-bold tracking-[0.12em] text-white/40 hover:text-white/70 transition-all"
              data-testid="view-full-label"
            >
              <FileText size={14} /> View Full Supplement Facts
            </button>
          </div>
        </div>
      </section>

      {/* ───── QUALITY BADGES ───── */}
      <section className="pdp-reveal py-10 md:py-14 px-5 md:px-10 lg:px-[60px] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {data.qualityBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2" data-testid={`badge-${i}`}>
                <Check size={12} style={{ color: accentColor }} />
                <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] text-white/35">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMPARISON TABLE ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <SectionLabel label="Compare" color={accentColor} />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
              How {data.name} compares
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-5">
              <div className="pb-4 border-b" style={{ borderColor: `${accentColor}30` }}>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: accentColor }}>{data.name}</span>
              </div>
              {data.comparison.us.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={15} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-[14px] text-white/60 font-sans font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div className="pb-4 border-b border-white/[0.06]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/25">Other Brands</span>
              </div>
              {data.comparison.them.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X size={15} className="shrink-0 mt-0.5 text-white/15" />
                  <span className="text-[14px] text-white/30 font-sans leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── WHO IT'S FOR ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <SectionLabel label="Suitability" color={accentColor} align="left" />
              <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Who it's for</h2>
            </div>
            <div className="space-y-4">
              {data.suitability.map((item, i) => (
                <div key={i} className="flex gap-4 items-center p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg">
                  <Check size={15} style={{ color: accentColor }} />
                  <span className="text-[14px] font-sans font-medium text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 md:p-10 border border-white/[0.08] bg-[#0b1120] space-y-5">
            <div className="flex items-center gap-3 text-white/35">
              <Info size={16} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">Important</p>
            </div>
            <p className="text-white/45 text-[15px] leading-relaxed font-sans font-medium">{data.safetyNote}</p>
            {data.allergenDisclosure && (
              <div className="p-4 border text-[11px] font-mono uppercase tracking-[0.10em]" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08`, color: accentColor }}>
                {data.allergenDisclosure}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── STACKING / PAIRS WELL WITH ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <SectionLabel label="Works Together" color={accentColor} />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Pairs well with</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.stack.map((item, i) => (
              <div key={i} className="border border-white/[0.06] bg-white/[0.02] p-7 md:p-8 space-y-5 relative overflow-hidden group hover:border-white/[0.10] transition-all rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] pointer-events-none" style={{ background: `${data.accent}06` }} />
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-lg font-head font-normal uppercase tracking-[-0.02em]">{item.name}</h4>
                    <span className="font-mono text-[9px] border px-2.5 py-1 uppercase shrink-0" style={{ color: accentColor, borderColor: `${accentColor}30` }}>{item.role}</span>
                  </div>
                  <p className="text-[14px] text-white/50 font-sans font-medium leading-relaxed">{item.add}</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/25 uppercase tracking-[0.12em] relative z-10">
                  <Clock size={11} /> {item.when}
                </div>
                <div className="flex gap-3 pt-2 relative z-10">
                  <a href={`/product/${item.slug}`} className="flex-1 py-3 border border-white/10 font-mono text-[10px] font-bold uppercase tracking-[0.08em] hover:bg-white/[0.04] transition-all text-center min-h-[40px] flex items-center justify-center" data-testid={`stack-view-${item.slug}`}>Learn More</a>
                  <button className="flex-1 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-all min-h-[40px]" style={{ background: accentColor, color: '#0b1120' }} data-testid={`stack-add-${item.slug}`}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTING & QUALITY ───── */}
      <section className="pdp-reveal py-16 md:py-20 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex gap-4 items-start p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg">
            <ShieldCheck size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-sans font-semibold text-white mb-1.5">Full label disclosure</p>
              <p className="text-[13px] text-white/40 font-sans leading-relaxed">Every ingredient and dose is listed. No proprietary blends.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg">
            <FlaskConical size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-sans font-semibold text-white mb-1.5">Third-party tested</p>
              <p className="text-[13px] text-white/40 font-sans leading-relaxed">Tested for purity, potency, and contaminants by independent labs.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-lg">
            <Microscope size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-sans font-semibold text-white mb-1.5">Clinically studied doses</p>
              <p className="text-[13px] text-white/40 font-sans leading-relaxed">Doses match or exceed amounts used in published clinical research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <SectionLabel label="FAQ" color={accentColor} />
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Common questions</h2>
          </div>
          <Accordion items={data.faq} />
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative py-10 md:py-14 px-6 text-white overflow-hidden">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}>
            {data.ctaHeadline[0]}
            <br />
            <span className="text-white/45">{data.ctaHeadline[1]}</span>
          </h2>
          <p className="mt-3 text-[13px] text-white/50 font-sans max-w-md mx-auto leading-relaxed">{data.ctaBody}</p>
          <a href={`/product/${slug}/purchase`} className="mt-5 inline-flex items-center justify-center px-8 py-3 min-h-[44px] bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] hover:bg-ar-teal/90 transition-colors" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(45,212,191,0.15)' }} data-testid="final-cta">
            {data.ctaButton}
          </a>
          <div className="mt-3">
            <a href="/shop" className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/50 hover:text-white/70 transition-colors inline-flex items-center gap-1">
              Browse all products <ArrowRight size={9} />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" /></div>

      <div className="py-8 px-6">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.10em] leading-relaxed text-center max-w-3xl mx-auto">
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
