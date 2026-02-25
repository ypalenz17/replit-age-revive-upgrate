import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import brandLogo from "@assets/AR_brand_logo_1771613250600.png";
import Footer from "../components/Footer";
import { useCart } from "../cartStore";
import "../styles/luxury-pages.css";

const LAST_UPDATED = "2026-02-24";

const PRODUCT_ROUTES = {
  cellunad: "/product/cellunad",
  cellubiome: "/product/cellubiome",
  cellunova: "/product/cellunova",
} as const;

const SCIENCE_URL = "/science";
const QUALITY_URL = "/quality";

type FAQItem = { q: string; a: string; tags: string[] };

type FAQCategory = {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
};

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "protocol",
    title: "Protocol and stacking",
    description: "How the three-layer system fits together and how to use it.",
    items: [
      {
        q: "How do the three products fit together?",
        a: "Age Revive is designed as a three-layer protocol: CELLUNAD+ is the daily NAD+ foundation, CELLUBIOME supports the gut and mitochondria interface using urolithin A and tributyrin, and CELLUNOVA is a periodic 7-day protocol used as a controlled reset.",
        tags: ["protocol", "stack", "CELLUNAD+", "CELLUBIOME", "CELLUNOVA", "NAD+", "mitophagy", "autophagy"],
      },
      {
        q: "Can I take all three together?",
        a: "Yes. The intended structure is daily CELLUNAD+ plus CELLUBIOME, with CELLUNOVA layered in as a periodic 7-day cycle. Consult a clinician if you are on medication or managing a condition.",
        tags: ["stack", "daily", "cycle", "safety"],
      },
      {
        q: "If I start with one product, which one should it be?",
        a: "Most people start with CELLUNAD+ because NAD+ metabolism is an upstream pathway in cellular energy processes. If your priority is gut signaling stability, consider starting with CELLUBIOME.",
        tags: ["start", "CELLUNAD+", "CELLUBIOME", "NAD+"],
      },
      {
        q: "How long should I evaluate daily products?",
        a: "Most people assess meaningful changes after 8 to 12 weeks of consistent daily use. Consistency matters more than exact timing.",
        tags: ["timeline", "consistency"],
      },
      {
        q: "Is CELLUNOVA taken daily?",
        a: "No. CELLUNOVA is a 7-day protocol designed to be used periodically, commonly monthly, then you return to the daily baseline layers.",
        tags: ["CELLUNOVA", "cycle", "7-day protocol"],
      },
    ],
  },
  {
    id: "ingredients",
    title: "Ingredients and mechanisms",
    description: "Plain-English definitions and why ingredients exist in the system.",
    items: [
      {
        q: "What is NAD+?",
        a: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme involved in cellular energy metabolism and multiple enzyme systems tied to cellular maintenance processes.",
        tags: ["NAD+", "definition", "metabolism"],
      },
      {
        q: "What is Nicotinamide Riboside (NR)?",
        a: "Nicotinamide Riboside (NR) is a precursor used by cells to synthesize NAD+. Human trials show NR can increase NAD+ metabolites in blood, though outcomes vary by endpoint and population.",
        tags: ["NR", "NAD+", "human trials"],
      },
      {
        q: "What is mitophagy?",
        a: "Mitophagy is a cellular process involved in recycling damaged mitochondria as part of mitochondrial quality control and cellular maintenance.",
        tags: ["mitophagy", "mitochondria"],
      },
      {
        q: "What is urolithin A?",
        a: "Urolithin A is a compound studied in humans for biomarkers of mitochondrial health and performance outcomes. It is discussed in the context of mitophagy and mitochondrial quality control.",
        tags: ["urolithin A", "mitophagy", "mitochondria"],
      },
      {
        q: "What is tributyrin and why not plain butyrate?",
        a: "Butyrate is a short-chain fatty acid discussed in gut barrier and immune signaling research. Tributyrin is a butyrate precursor designed to improve stability upstream and support butyrate-related activity downstream.",
        tags: ["tributyrin", "butyrate", "gut barrier"],
      },
      {
        q: "What is autophagy?",
        a: "Autophagy is a cellular recycling process that clears damaged components via lysosomal pathways. It is strongly influenced by lifestyle factors like training and nutrition patterns.",
        tags: ["autophagy", "definition"],
      },
      {
        q: "What is cellular senescence?",
        a: "Cellular senescence is a state where cells stop dividing and alter signaling output. Senolytics are an active research area, but most strong human work involves drug combinations and short protocols.",
        tags: ["senescence", "senolytics", "SASP"],
      },
      {
        q: "Why include methylation support in CELLUNAD+ (TMG, 5-MTHF, methylcobalamin, P-5-P)?",
        a: "NAD+ metabolism intersects with methylation pathways. CELLUNAD+ includes Betaine (TMG), 5-MTHF, methylcobalamin, and P-5-P as co-factor support designed to keep NAD+ pathway support balanced with consistent daily use.",
        tags: ["methylation", "TMG", "5-MTHF", "methylcobalamin", "P-5-P", "NAD+"],
      },
      {
        q: "Why is CELLUBIOME enteric-protected?",
        a: "Enteric protection is used when targeted intestinal release is desirable. It helps protect contents from stomach acid and supports release further into the gut.",
        tags: ["enteric", "delivery", "CELLUBIOME"],
      },
      {
        q: "What are quercetin and fisetin doing in CELLUNOVA?",
        a: "Quercetin and fisetin are compounds discussed in senescence research. CELLUNOVA positions them as part of a periodic protocol, not as a drug-equivalent intervention.",
        tags: ["quercetin", "fisetin", "senescence", "CELLUNOVA"],
      },
    ],
  },
  {
    id: "safety",
    title: "Safety and suitability",
    description: "Who should be cautious and what to check before using supplements.",
    items: [
      {
        q: "Who should consult a clinician before using these products?",
        a: "If you are pregnant, nursing, managing a medical condition, or taking medication, consult a qualified clinician before use.",
        tags: ["safety", "clinician", "pregnant", "medication"],
      },
      {
        q: "Does CELLUNOVA contain allergens?",
        a: "Yes. CELLUNOVA contains wheat (spermidine source). If you have wheat allergy or celiac disease concerns, review the label and consult a clinician.",
        tags: ["CELLUNOVA", "wheat", "allergen"],
      },
      {
        q: "Are there side effects?",
        a: "Some people experience digestive sensitivity with multi-ingredient supplements. If you feel unwell, discontinue use and consult a clinician. Follow label instructions.",
        tags: ["side effects", "digestive"],
      },
    ],
  },
  {
    id: "quality",
    title: "Quality and testing",
    description: "How to verify what you are buying and what to request.",
    items: [
      {
        q: "Are your products third-party tested?",
        a: "Age Revive positions quality around identity and potency verification plus screening for common contaminants. Testing panels can vary by ingredient and risk profile. See the Quality page for the framework.",
        tags: ["third-party", "identity", "potency", "contaminants"],
      },
      {
        q: "Can I see batch documentation or a CoA?",
        a: "Documentation can be provided upon request. Share the product name and the lot number printed on the bottle so the correct records are retrieved.",
        tags: ["CoA", "lot number", "documentation"],
      },
      {
        q: "Do you use proprietary blends?",
        a: "No. Proprietary blends hide doses and prevent meaningful comparison to published research.",
        tags: ["proprietary blends", "transparency"],
      },
      {
        q: "Where can I learn the mechanisms and evidence behind ingredients?",
        a: "Start with the Science page. It explains NAD+ metabolism, mitophagy, gut barrier and butyrate biology, autophagy concepts, and senescence context with references.",
        tags: ["science", "evidence", "mitophagy", "autophagy", "senescence", "NAD+"],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders and support",
    description: "Practical questions about ordering and getting help.",
    items: [
      {
        q: "Where do I find shipping rates and delivery estimates?",
        a: "Shipping rates and delivery estimates are shown at checkout and in your order confirmation. For order help, contact support with your order number.",
        tags: ["shipping", "delivery", "orders"],
      },
      {
        q: "Where do I find return or refund details?",
        a: "Return and refund details are provided in store policy information and during checkout where applicable. For issues, contact support and include your order number.",
        tags: ["returns", "refunds"],
      },
      {
        q: "How do I contact support?",
        a: "Use the Contact page and include your order number for faster resolution.",
        tags: ["support", "contact"],
      },
    ],
  },
];

function clsx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function upsertHeadEl(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  const existing = document.head.querySelector(selector) as HTMLElement | null;
  const el = existing ?? create();
  apply(el);
  if (!existing) document.head.appendChild(el);
}

function injectJsonLd(id: string, data: unknown) {
  const scriptId = `jsonld-${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

function useFaqSEO(allFaqItems: FAQItem[]) {
  useEffect(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = `${siteUrl}/faq`;

    const title = "FAQ | Protocol, Ingredients, Safety, Quality | Age Revive";
    const description =
      "Frequently asked questions about Age Revive: protocol structure, NAD+ (NR), urolithin A, tributyrin, mitophagy, autophagy, senescence context, quality testing, and ordering help.";

    document.title = title;

    upsertHeadEl(`meta[name="description"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "description");
      el.setAttribute("content", description);
    });

    upsertHeadEl(`meta[name="robots"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "robots");
      el.setAttribute("content", "index,follow");
    });

    upsertHeadEl(`link[rel="canonical"]`, () => document.createElement("link"), (el) => {
      el.setAttribute("rel", "canonical");
      el.setAttribute("href", canonical);
    });

    upsertHeadEl(`meta[property="og:title"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:title");
      el.setAttribute("content", title);
    });

    upsertHeadEl(`meta[property="og:description"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:description");
      el.setAttribute("content", description);
    });

    upsertHeadEl(`meta[property="og:type"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:type");
      el.setAttribute("content", "website");
    });

    upsertHeadEl(`meta[property="og:url"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:url");
      el.setAttribute("content", canonical);
    });

    upsertHeadEl(`meta[name="twitter:card"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "twitter:card");
      el.setAttribute("content", "summary_large_image");
    });

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "FAQ", item: canonical },
      ],
    };

    const webPageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "FAQ",
      url: canonical,
      description,
      dateModified: LAST_UPDATED,
      isPartOf: { "@type": "WebSite", name: "Age Revive", url: siteUrl },
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    injectJsonLd("faq-breadcrumb", breadcrumbJsonLd);
    injectJsonLd("faq-webpage", webPageJsonLd);
    injectJsonLd("faq-jsonld", faqJsonLd);
  }, [allFaqItems]);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="ar-luxury-pill">
      {children}
    </span>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Science", href: "/science" },
  { label: "Quality", href: "/quality" },
  { label: "FAQ", href: "/faq" },
];

export default function FAQ() {
  const allItemsForJsonLd = useMemo(() => FAQ_CATEGORIES.flatMap((c) => c.items), []);
  useFaqSEO(allItemsForJsonLd);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    const cats =
      activeCategory === "all"
        ? FAQ_CATEGORIES
        : FAQ_CATEGORIES.filter((c) => c.id === activeCategory);

    if (!normalizedQuery) return cats;

    return cats
      .map((c) => {
        const items = c.items.filter((it) => {
          const hay = `${it.q} ${it.a} ${it.tags.join(" ")}`.toLowerCase();
          return hay.includes(normalizedQuery);
        });
        return { ...c, items };
      })
      .filter((c) => c.items.length > 0);
  }, [activeCategory, normalizedQuery]);

  const totalResults = useMemo(() => {
    return filteredCategories.reduce((sum, c) => sum + c.items.length, 0);
  }, [filteredCategories]);

  return (
    <div className="ar-luxury-page min-h-screen text-white">
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
                className={l.label === "FAQ" ? "text-teal-300 transition-colors" : "text-white/55 hover:text-teal-300 transition-colors"}
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
                      className="w-full flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white/60 hover:text-teal-300"
                      onClick={() => setShopOpen(!shopOpen)}
                      data-testid="mobile-shop-toggle"
                    >
                      Shop
                      <span className="text-[10px]">{shopOpen ? "\u25B4" : "\u25BE"}</span>
                    </button>
                    {shopOpen && (
                      <div className="pb-3 flex flex-col gap-2 pl-3">
                        <a href="/product/cellunad" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUNAD+</a>
                        <a href="/product/cellubiome" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUBIOME</a>
                        <a href="/product/cellunova" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUNOVA</a>
                        <a href="/shop" className="text-[12px] font-mono text-white/50 hover:text-teal-300">View all</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className={clsx(
                      "py-3 font-mono text-[12px] uppercase tracking-[0.14em] border-b border-white/[0.05]",
                      l.label === "FAQ" ? "text-teal-300" : "text-white/60 hover:text-teal-300"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <header className="ar-luxury-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#0b1120]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-20 text-center">
          <p className="ar-luxury-eyebrow mx-auto">FAQ</p>
          <h1 className="mt-5 max-w-4xl mx-auto text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Direct answers. No fog.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            Fast answers about protocol structure, ingredients, safety, quality verification, and practical ordering topics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={SCIENCE_URL}
              className="ar-luxury-btn-primary"
              data-testid="link-read-science"
            >
              Read Science
            </Link>
            <Link
              href={QUALITY_URL}
              className="ar-luxury-btn-ghost"
              data-testid="link-read-quality"
            >
              Read Quality
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Pill>NAD+ (NR)</Pill>
            <Pill>Urolithin A</Pill>
            <Pill>Tributyrin</Pill>
            <Pill>Mitophagy</Pill>
            <Pill>Autophagy</Pill>
            <Pill>Senescence</Pill>
          </div>

          <div className="mt-10 ar-luxury-disclaimer rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <p className="text-sm text-white/70">
              This page is educational content, not medical advice. Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="mt-2 text-xs text-white/40 font-mono tracking-wide">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12 overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[260px,1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 ar-luxury-toc-card rounded-2xl p-5">
              <p className="ar-luxury-eyebrow text-[10px]">Categories</p>

              <div className="mt-5 grid gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={clsx(
                    "rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors duration-200",
                    activeCategory === "all"
                      ? "bg-white/[0.06] text-white/90"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white/90"
                  )}
                  data-testid="filter-all"
                >
                  All
                </button>

                {FAQ_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={clsx(
                      "rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors duration-200",
                      activeCategory === c.id
                        ? "bg-white/[0.06] text-white/90"
                        : "text-white/55 hover:bg-white/[0.04] hover:text-white/90"
                    )}
                    data-testid={`filter-${c.id}`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Search matches questions, answers, and tags like "NR", "urolithin A", "tributyrin", "autophagy".
                </p>
              </div>
            </div>
          </aside>

          <main>
            <div className="ar-luxury-card p-4 sm:p-5">
              <label className="ar-luxury-eyebrow text-[10px]" htmlFor="faq-search">
                Search
              </label>
              <input
                id="faq-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: NAD+, NR, urolithin A, tributyrin, autophagy, senescence..."
                className="ar-luxury-search-input mt-3 w-full rounded-xl px-4 py-3 text-sm"
                data-testid="input-faq-search"
              />

              <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-[12px] tracking-wide transition-colors duration-200",
                    activeCategory === "all"
                      ? "border-[rgba(122,246,224,0.20)] bg-[rgba(122,246,224,0.06)] text-[rgba(122,246,224,0.85)]"
                      : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.10] hover:text-white/75"
                  )}
                  data-testid="filter-mobile-all"
                >
                  All
                </button>
                {FAQ_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={clsx(
                      "rounded-full border px-4 py-2 text-[12px] tracking-wide transition-colors duration-200",
                      activeCategory === c.id
                        ? "border-[rgba(122,246,224,0.20)] bg-[rgba(122,246,224,0.06)] text-[rgba(122,246,224,0.85)]"
                        : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.10] hover:text-white/75"
                    )}
                    data-testid={`filter-mobile-${c.id}`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-sm text-white/70" data-testid="text-result-count">
                Showing <span className="text-white">{totalResults}</span> result{totalResults === 1 ? "" : "s"}
                {normalizedQuery ? (
                  <>
                    {" "}
                    for <span className="text-white">"{query.trim()}"</span>
                  </>
                ) : null}
                .
              </div>
            </div>

            <div className="mt-10 grid gap-10">
              {filteredCategories.length === 0 ? (
                <div className="ar-luxury-card p-4 sm:p-6 md:p-8" data-testid="text-no-results">
                  <h2 className="text-xl font-semibold">No matches found</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Try "NR", "NAD+", "urolithin A", "tributyrin", "mitophagy", "autophagy", "senescence", "quercetin", or "fisetin".
                  </p>
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <section key={cat.id} className="ar-luxury-card ar-luxury-card-glow p-4 sm:p-6 md:p-8" data-testid={`section-faq-${cat.id}`}>
                    <p className="ar-luxury-eyebrow text-[10px] mb-3">{cat.id.replace(/-/g, " ")}</p>
                    <h2 className="text-2xl font-semibold tracking-tight">{cat.title}</h2>
                    <p className="mt-2 text-sm text-white/55">{cat.description}</p>

                    <hr className="ar-luxury-section-divider mt-6 mb-6" />

                    <div className="grid gap-3">
                      {cat.items.map((f) => (
                        <details key={f.q} className="ar-luxury-accordion rounded-xl sm:rounded-2xl p-4 sm:p-6" data-testid={`faq-item-${f.q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}>
                          <summary className="text-base font-semibold text-white/90">
                            {f.q}
                          </summary>
                          <p className="mt-4 text-sm leading-relaxed text-white/60">{f.a}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {f.tags.slice(0, 6).map((t) => (
                              <Pill key={t}>{t}</Pill>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>

            <div className="mt-12 ar-luxury-card ar-luxury-card-glow p-5 sm:p-7 md:p-10" data-testid="section-build-protocol">
              <p className="ar-luxury-eyebrow text-[10px]">Next step</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Build your protocol</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                Most people start with CELLUNAD+ as the daily foundation and add CELLUBIOME for gut and mitochondrial signaling stability. CELLUNOVA is designed as a periodic 7-day protocol.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={PRODUCT_ROUTES.cellunad}
                  className="ar-luxury-btn-primary"
                  data-testid="link-view-cellunad"
                >
                  View CELLUNAD+
                </Link>
                <Link
                  href={PRODUCT_ROUTES.cellubiome}
                  className="ar-luxury-btn-ghost"
                  data-testid="link-view-cellubiome"
                >
                  View CELLUBIOME
                </Link>
                <Link
                  href={PRODUCT_ROUTES.cellunova}
                  className="ar-luxury-btn-ghost"
                  data-testid="link-view-cellunova"
                >
                  View CELLUNOVA
                </Link>
              </div>
            </div>

            <div className="pb-8 pt-10">
              <p className="text-xs text-white/50">
                These statements have not been evaluated by the FDA. This content is for educational purposes only.
              </p>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
