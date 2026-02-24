import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import "../styles/science.css";
import {
  FAQ,
  FINAL_CTA,
  GLOSSARY,
  LAYERS,
  REFERENCES,
  SCIENCE_META,
  SCIENCE_TOC,
  STANDARDS,
  TRUST_MARKERS,
  EVIDENCE_TABLES,
} from "../science/scienceContent";
import brandLogo from "@assets/AR_brand_logo_1771613250600.png";
import Footer from "../components/Footer";
import { useCart } from "../cartStore";

function setMetaTag(attr: "name" | "property", key: string, value: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function injectJsonLd(id: string, json: unknown) {
  const existing = document.getElementById(id);
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(json);
  document.head.appendChild(script);
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="ar-eyebrow">
      <span className="ar-eyebrowLine" />
      <span>{label}</span>
      <span className="ar-eyebrowLine" />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M10 3.2L5.1 9.2L2 6.3"
        stroke="rgba(122, 246, 224, 0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 2h4"
        stroke="rgba(122, 246, 224, 0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 2v6l-5.2 9.2A3.5 3.5 0 0 0 7.9 22h8.2a3.5 3.5 0 0 0 3.1-4.8L14 8V2"
        stroke="rgba(122, 246, 224, 0.95)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 12.2h5.4"
        stroke="rgba(122, 246, 224, 0.65)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AccordionItemProps = {
  index: number;
  question: string;
  answer: string;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
};

function AccordionItem({ index, question, answer, openIndex, setOpenIndex }: AccordionItemProps) {
  const isOpen = openIndex === index;
  const buttonId = `science-faq-btn-${index}`;
  const panelId = `science-faq-panel-${index}`;

  return (
    <div className="ar-accItem">
      <button
        id={buttonId}
        className="ar-accButton"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpenIndex(isOpen ? null : index)}
        type="button"
        data-testid={`button-faq-${index}`}
      >
        <span>{question}</span>
        <span aria-hidden="true">{isOpen ? "\u25B4" : "\u25BE"}</span>
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="ar-accPanel">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SciencePage() {
  const [activeId, setActiveId] = useState<string>(SCIENCE_TOC[0]?.id || "protocol");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cart = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Science", href: "/science" },
    { label: "Quality", href: "/quality" },
    { label: "FAQ", href: "/faq" },
  ];

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const faqJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
  }, []);

  const pageJsonLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${SCIENCE_META.canonicalPath}`;
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Science | Age Revive",
      description: SCIENCE_META.description,
      url,
      isPartOf: { "@type": "WebSite", name: "Age Revive", url: origin || "https://example.com" },
    };
  }, []);

  const breadcrumbJsonLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Science", item: `${origin}${SCIENCE_META.canonicalPath}` },
      ],
    };
  }, []);

  useEffect(() => {
    document.title = SCIENCE_META.title;

    setMetaTag("name", "description", SCIENCE_META.description);
    setMetaTag("property", "og:title", SCIENCE_META.title);
    setMetaTag("property", "og:description", SCIENCE_META.description);
    setMetaTag("property", "og:type", "website");

    if (typeof window !== "undefined") {
      setCanonical(`${window.location.origin}${SCIENCE_META.canonicalPath}`);
    }

    injectJsonLd("ar-science-jsonld-webpage", pageJsonLd);
    injectJsonLd("ar-science-jsonld-breadcrumbs", breadcrumbJsonLd);
    injectJsonLd("ar-science-jsonld-faq", faqJsonLd);

    return () => {
      const ids = ["ar-science-jsonld-webpage", "ar-science-jsonld-breadcrumbs", "ar-science-jsonld-faq"];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [pageJsonLd, breadcrumbJsonLd, faqJsonLd]);

  useEffect(() => {
    const ids = SCIENCE_TOC.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("id");
          if (id) setActiveId(id);
        }
      },
      { root: null, threshold: [0.15, 0.25, 0.35], rootMargin: "-20% 0px -60% 0px" }
    );

    ids.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10] shadow-[0_1px_12px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert" />
          </a>

          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={l.label === "Science" ? "text-teal-300 transition-colors" : "text-white/55 hover:text-teal-300 transition-colors"}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={cart.openCart} className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">
                {cart.totalItems}
              </span>
            </button>

            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle"
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
              {navLinks.map((l) =>
                l.label === "Shop" ? (
                  <div key={l.label} className="border-b border-white/[0.05]">
                    <button
                      onClick={() => setShopOpen(!shopOpen)}
                      className="w-full py-3 min-h-[44px] flex items-center justify-between text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors"
                      data-testid="mobile-nav-shop-toggle"
                    >
                      {l.label}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
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
                    className={`py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] border-b border-white/[0.05] last:border-0 transition-colors ${l.label === "Science" ? "text-teal-300" : "text-white/70 hover:text-teal-300"}`}
                    data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <main className="ar-science">
        <header className="ar-hero">
          <div className="ar-container">
            <div className="ar-heroIcon" aria-hidden="true">
              <FlaskIcon />
            </div>

            <Eyebrow label="SCIENCE" />
            <h1>The protocol behind Age Revive</h1>
            <p className="ar-subhead">
              This page explains why we chose these compounds, why delivery matters, how the three layers fit together, and
              what "clinically studied" means in practice. Transparent doses. Clear intent. No proprietary blends.
            </p>

            <div className="ar-heroCtas">
              <a className="ar-btn ar-btnPrimary" href="#protocol" data-testid="link-explore-protocol">
                Explore the protocol
              </a>
              <Link className="ar-btn ar-btnGhost" to="/shop" data-testid="link-browse-products">
                Browse products
              </Link>
            </div>

            <div className="ar-trustGrid" aria-label="Trust markers">
              {TRUST_MARKERS.map((m) => (
                <div key={m.title} className="ar-card ar-trustCard">
                  <p className="ar-trustTitle">{m.title}</p>
                  <p className="ar-trustDetail">{m.detail}</p>
                </div>
              ))}
            </div>

            <div className="ar-tocMobilePills scrollbar-hide" aria-label="Jump to section">
              {SCIENCE_TOC.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`ar-pill ${activeId === t.id ? "ar-pillActive" : ""}`}
                  onClick={() => scrollTo(t.id)}
                  data-testid={`pill-${t.id}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="ar-container">
          <div className="ar-mainGrid">
            <aside className="ar-toc" aria-label="Table of contents">
              <p className="ar-tocTitle">On this page</p>
              {SCIENCE_TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={`ar-tocLink ${activeId === t.id ? "ar-tocLinkActive" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(t.id);
                  }}
                  data-testid={`toc-${t.id}`}
                >
                  {t.label}
                </a>
              ))}
            </aside>

            <article>
              <section
                id="protocol"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["protocol"] = el;
                }}
              >
                <Eyebrow label="PROTOCOL ARCHITECTURE" />
                <h2>Three layers, one system</h2>
                <p className="ar-lede">
                  The goal is not a random stack. It is a simple structure that maps to biology: daily foundation, signal
                  stability, and periodic reset.
                </p>

                <div className="ar-grid3">
                  {LAYERS.map((layer) => (
                    <div key={layer.productName} className="ar-card ar-layerCard">
                      <div className="ar-tag">{layer.eyebrow}</div>
                      <p className="ar-layerTitle">{layer.productName}</p>
                      <p className="ar-layerBody">
                        <strong>{layer.roleTitle}.</strong> {layer.roleBody}
                      </p>

                      <ul className="ar-list" aria-label={`${layer.productName} highlights`}>
                        {layer.bullets.map((b) => (
                          <li key={b}>
                            <span className="ar-check" aria-hidden="true">
                              <CheckIcon />
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="ar-entities" aria-label={`${layer.productName} key entities`}>
                        {layer.entities.map((e) => (
                          <span key={e} className="ar-chip">
                            {e}
                          </span>
                        ))}
                      </div>

                      <div className="ar-layerCtas">
                        <Link className="ar-btn ar-btnPrimary" to={layer.primaryCtaHref} data-testid={`link-${layer.productName.toLowerCase().replace('+', '')}`}>
                          {layer.primaryCtaLabel}
                        </Link>
                        <a className="ar-btn ar-btnGhost" href={layer.secondaryCtaHref}>
                          {layer.secondaryCtaLabel}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ar-footnote">
                  * These statements have not been evaluated by the Food and Drug Administration. This product is not
                  intended to diagnose, treat, cure, or prevent any disease.
                </div>
              </section>

              <section
                id="standards"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["standards"] = el;
                }}
              >
                <Eyebrow label="HOW WE BUILD" />
                <h2>Our standards</h2>
                <p className="ar-lede">
                  Credibility is not a vibe. It is decisions you can audit: dose, delivery, mechanism, transparency, and
                  testing.
                </p>

                <div className="ar-grid2">
                  {STANDARDS.map((s) => (
                    <div key={s.title} className="ar-card ar-standardCard">
                      <p className="ar-standardTitle">{s.title}</p>
                      <p className="ar-standardBody">{s.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="nad"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["nad"] = el;
                }}
              >
                <Eyebrow label="DEEP DIVE" />
                <h2>NAD+ foundation</h2>
                <p className="ar-lede">
                  NAD+ is a coenzyme central to cellular energy metabolism and multiple enzymatic processes associated with
                  cellular maintenance. NR is a precursor used by cells to synthesize NAD+.
                </p>

                <div className="ar-card ar-richBlock">
                  <h3>What CELLUNAD+ is designed to support</h3>
                  <div className="ar-paras">
                    <p>
                      CELLUNAD+ uses <strong>500 mg Nicotinamide Riboside (NR)</strong> as a daily foundation to support
                      intracellular NAD+ availability. Human studies have evaluated NR for NAD+ elevation and tolerability.
                    </p>
                    <p>
                      Because NAD+ metabolism intersects with methylation pathways, CELLUNAD+ includes co-factor support:
                      <strong> Betaine (TMG), 5-MTHF, methylcobalamin, and P-5-P</strong>. The goal is balanced, consistent
                      daily pathway support, not transient stimulation.
                    </p>
                    <p className="ar-muted">
                      Translation note: "Supports" is used in the dietary supplement sense. Individual response varies and
                      depends on baseline biology, lifestyle, and consistency.
                    </p>
                  </div>
                </div>

                <div className="ar-grid2">
                  <div className="ar-card ar-richBlock">
                    <h3>Key entities for LLM and search</h3>
                    <div className="ar-entities">
                      {["NAD+", "Nicotinamide Riboside (NR)", "Mitochondria", "Sirtuin pathways", "DNA repair processes", "Methylation", "5-MTHF", "Methylcobalamin", "Betaine (TMG)"].map(
                        (e) => (
                          <span key={e} className="ar-chip">
                            {e}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="ar-card ar-richBlock">
                    <h3>How to use the foundation</h3>
                    <div className="ar-paras">
                      <p>
                        Daily products should be evaluated over weeks, not days. Most people use a consistent daily routine
                        and evaluate changes over <strong>8 to 12 weeks</strong>.* Consistency matters more than timing.
                      </p>
                      <p>
                        If you are stacking, start with the foundation first, then layer signal stability, then consider a
                        periodic reset protocol.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="gut-mito"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["gut-mito"] = el;
                }}
              >
                <Eyebrow label="DEEP DIVE" />
                <h2>Gut-mitochondria axis</h2>
                <p className="ar-lede">
                  Gut barrier integrity and microbial metabolites influence cellular signaling inputs. CELLUBIOME targets
                  this interface by pairing mitophagy support with butyrate delivery.
                </p>

                <div className="ar-card ar-richBlock">
                  <h3>Mitophagy support with Urolithin A</h3>
                  <div className="ar-paras">
                    <p>
                      <strong>Urolithin A</strong> is a microbiome-derived metabolite studied for its role in mitophagy
                      pathways. Human research has evaluated Urolithin A for safety and mitochondrial-related biomarker
                      signatures in healthy adults.
                    </p>
                    <p>
                      CELLUBIOME uses an evidence-aligned dose and positions it as part of a system, not a miracle
                      ingredient.
                    </p>
                  </div>
                </div>

                <div className="ar-card ar-richBlock">
                  <h3>Butyrate delivery with Tributyrin</h3>
                  <div className="ar-paras">
                    <p>
                      <strong>Butyrate</strong> is studied for roles in gut barrier function and metabolic signaling. Direct
                      oral butyrate can be unstable upstream, which is why formulations often use a precursor.
                    </p>
                    <p>
                      <strong>Tributyrin</strong> is a butyrate precursor designed to resist gastric conditions and convert
                      downstream. Mechanistic literature includes cell models linking butyrate to tight junction assembly.
                      Tributyrin research includes in vitro GI simulation models evaluating stability and downstream
                      availability.
                    </p>
                  </div>
                </div>

                <div className="ar-grid2">
                  <div className="ar-card ar-richBlock">
                    <h3>Why we pair Urolithin A and Tributyrin</h3>
                    <div className="ar-paras">
                      <p>
                        Mitochondria do not operate in isolation. Gut barrier and microbial metabolites influence immune
                        signaling, metabolic inputs, and stress signaling. Pairing mitophagy support with gut barrier support
                        is a systems decision.
                      </p>
                    </div>
                  </div>
                  <div className="ar-card ar-richBlock">
                    <h3>What this is not</h3>
                    <div className="ar-paras">
                      <p>
                        This is not a probiotic and it is not intended to treat gut disease. It is a targeted compound
                        approach designed to support gut barrier integrity and mitochondrial maintenance pathways.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="reset"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["reset"] = el;
                }}
              >
                <Eyebrow label="DEEP DIVE" />
                <h2>Controlled reset</h2>
                <p className="ar-lede">
                  CELLUNOVA is intentionally not daily. It is a 7-day protocol designed to periodically support
                  autophagy-related pathways, mitochondrial resilience, and exposure to senescence research compounds.
                </p>

                <div className="ar-card ar-richBlock">
                  <h3>Autophagy-related pathway support</h3>
                  <div className="ar-paras">
                    <p>
                      Autophagy is a cellular recycling process involved in maintaining cellular homeostasis. Compounds like
                      <strong> spermidine</strong> and <strong>trans-resveratrol</strong> are studied in autophagy and stress
                      response contexts across model systems.
                    </p>
                    <p>
                      CELLUNOVA uses a structured protocol window because periodic exposure is common in how these pathways
                      are explored in research settings.
                    </p>
                  </div>
                </div>

                <div className="ar-card ar-richBlock">
                  <h3>Senescence research compounds</h3>
                  <div className="ar-paras">
                    <p>
                      <strong>Quercetin</strong> and <strong>fisetin</strong> appear frequently in senescence research. Human
                      clinical evidence for senolytics is early and often involves combination protocols (for example,
                      dasatinib plus quercetin). This page includes references for context and transparency.
                    </p>
                    <p className="ar-muted">
                      Important: referencing research does not mean identical outcomes from different protocols, doses, or
                      combinations.
                    </p>
                  </div>
                </div>

                <div className="ar-card ar-richBlock">
                  <h3>Mitochondrial resilience during protocol windows</h3>
                  <div className="ar-paras">
                    <p>
                      CELLUNOVA includes mitochondrial resilience support: <strong>NAC, PQQ, astaxanthin, and Ca-AKG</strong>.
                      This is designed to support oxidative defense pathways during the protocol window.
                    </p>
                    <p className="ar-muted">
                      All ingredients and doses are disclosed. CELLUNOVA contains wheat (spermidine source).
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="delivery"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["delivery"] = el;
                }}
              >
                <Eyebrow label="FORMULATION" />
                <h2>Delivery matters</h2>
                <p className="ar-lede">
                  If the goal is intestinal action, the contents must survive the stomach. Enteric protection exists for a
                  reason.
                </p>

                <div className="ar-grid2">
                  <div className="ar-card ar-richBlock">
                    <h3>Why enteric protection is used</h3>
                    <div className="ar-paras">
                      <p>
                        Some compounds are degraded by stomach acid or absorbed too early. If they need to reach the
                        intestine intact, delivery determines whether the formula matches its intent.
                      </p>
                      <p>
                        In practice, enteric protection is one of the most important differences between generic blends and
                        targeted formulations.
                      </p>
                    </div>
                  </div>
                  <div className="ar-card ar-richBlock">
                    <h3>What to look for on labels</h3>
                    <div className="ar-paras">
                      <p>
                        If a product claims gut-targeted effects but does not address delivery, it is often a marketing
                        mismatch. Transparent formulas state both dosing and delivery choices.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="quality"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["quality"] = el;
                }}
              >
                <Eyebrow label="QUALITY" />
                <h2>Quality and testing</h2>
                <p className="ar-lede">
                  Supplements are judged by what is actually in the capsule. We use manufacturing and testing as the floor,
                  not a marketing line.
                </p>

                <div className="ar-grid2">
                  <div className="ar-card ar-richBlock">
                    <h3>Manufacturing baseline</h3>
                    <ul className="ar-list">
                      {[
                        "cGMP manufactured",
                        "Full label disclosure (no proprietary blends)",
                        "No artificial fillers (per product positioning)",
                      ].map((b) => (
                        <li key={b}>
                          <span className="ar-check" aria-hidden="true">
                            <CheckIcon />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ar-card ar-richBlock">
                    <h3>Third-party testing</h3>
                    <ul className="ar-list">
                      {[
                        "Identity and potency verification",
                        "Contaminant screening (common panels vary by product)",
                        "COA availability policy via support (lot dependent)",
                      ].map((b) => (
                        <li key={b}>
                          <span className="ar-check" aria-hidden="true">
                            <CheckIcon />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="ar-footnote">
                  We do not claim that supplements replace medical care. If you are on medication or managing a condition,
                  consult your clinician before use.
                </div>
              </section>

              <section
                id="evidence"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["evidence"] = el;
                }}
              >
                <Eyebrow label="EVIDENCE AND DOSING" />
                <h2>Evidence and dosing tables</h2>
                <p className="ar-lede">
                  These tables summarize our intent and dosing choices. References are included for transparency. Evidence
                  strength varies by ingredient and endpoint.
                </p>

                {EVIDENCE_TABLES.map((t) => (
                  <div key={t.product} className="ar-tableWrap" style={{ marginTop: 18 }}>
                    <table>
                      <caption>
                        <strong>{t.product}:</strong> {t.caption}
                      </caption>
                      <thead>
                        <tr>
                          <th style={{ width: "28%" }}>Ingredient</th>
                          <th style={{ width: "16%" }}>Dose</th>
                          <th>Why it is included</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map((r) => (
                          <tr key={`${t.product}-${r.ingredient}`}>
                            <td>{r.ingredient}</td>
                            <td>{r.dose}</td>
                            <td>
                              {r.why}
                              {r.notes ? <div className="ar-muted" style={{ marginTop: 6 }}>{r.notes}</div> : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                <div className="ar-footnote">
                  References are provided for educational transparency. They do not imply that every outcome observed in a
                  study will occur in every individual, or that different protocols will produce identical results.
                </div>
              </section>

              <section
                id="glossary"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["glossary"] = el;
                }}
              >
                <Eyebrow label="GLOSSARY" />
                <h2>Key terms, defined</h2>
                <p className="ar-lede">Short definitions to remove ambiguity and make the science readable.</p>

                <dl className="ar-dl ar-card ar-richBlock">
                  {GLOSSARY.map((g) => (
                    <div key={g.term}>
                      <dt>{g.term}</dt>
                      <dd>{g.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section
                id="faq"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["faq"] = el;
                }}
              >
                <Eyebrow label="FAQ" />
                <h2>Common questions</h2>
                <p className="ar-lede">Short answers. Clear boundaries. No hype.</p>

                <div className="ar-accordion">
                  {FAQ.map((item, idx) => (
                    <AccordionItem
                      key={item.q}
                      index={idx}
                      question={item.q}
                      answer={item.a}
                      openIndex={openFaq}
                      setOpenIndex={setOpenFaq}
                    />
                  ))}
                </div>
              </section>

              <section
                id="references"
                className="ar-section"
                ref={(el) => {
                  sectionRefs.current["references"] = el;
                }}
              >
                <Eyebrow label="REFERENCES" />
                <h2>Primary sources</h2>
                <p className="ar-lede">
                  References support transparency. They are not a promise of a specific result and they are not medical
                  advice.
                </p>

                <ol className="ar-refList">
                  {REFERENCES.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.label}
                      </a>
                      {r.note ? <div className="ar-muted">{r.note}</div> : null}
                    </li>
                  ))}
                </ol>

                <div className="ar-footnote">
                  * These statements have not been evaluated by the Food and Drug Administration. This product is not
                  intended to diagnose, treat, cure, or prevent any disease.
                </div>
              </section>

              <section className="ar-section">
                <Eyebrow label={FINAL_CTA.eyebrow} />
                <h2>{FINAL_CTA.headline}</h2>
                <p className="ar-lede">{FINAL_CTA.body}</p>

                <div className="ar-grid3">
                  {FINAL_CTA.cards.map((c) => (
                    <div key={c.title} className="ar-card ar-layerCard">
                      <div className="ar-tag">{c.tag}</div>
                      <p className="ar-layerTitle">{c.title}</p>
                      <p className="ar-layerBody">{c.body}</p>
                      <div className="ar-layerCtas">
                        <Link className="ar-btn ar-btnPrimary" to={c.href} data-testid={`link-shop-${c.title.toLowerCase().replace('+', '')}`}>
                          {c.cta}
                        </Link>
                        <Link className="ar-btn ar-btnGhost" to="/shop">
                          Browse all
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <div className="bg-[#060E1A]">
        <Footer />
      </div>
    </>
  );
}
