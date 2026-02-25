import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import brandLogo from "@assets/AR_brand_logo_1771613250600.png";
import Footer from "../components/Footer";
import { useCart } from "../cartStore";

const LAST_UPDATED = "2026-02-24";

const PRODUCT_ROUTES = {
  cellunad: "/product/cellunad",
  cellubiome: "/product/cellubiome",
  cellunova: "/product/cellunova",
} as const;

const SCIENCE_URL = "/science";
const FAQ_URL = "/faq";

type TocItem = { href: string; label: string };
const TOC: TocItem[] = [
  { href: "#overview", label: "Quality overview" },
  { href: "#testing", label: "Testing standards" },
  { href: "#manufacturing", label: "Manufacturing and compliance" },
  { href: "#traceability", label: "Traceability and documentation" },
  { href: "#label", label: "Label transparency" },
  { href: "#product-notes", label: "Product-specific notes" },
  { href: "#quality-faq", label: "Quality FAQ" },
];

type FAQItem = { q: string; a: string };

const QUALITY_FAQS: FAQItem[] = [
  {
    q: "What does third-party tested mean here?",
    a: "It means independent testing is used to verify identity and potency and to screen for common contaminants. Exact panels can vary by ingredient and risk profile. If you want documentation, request it using the lot number on your bottle.",
  },
  {
    q: "Do you provide Certificates of Analysis (CoAs)?",
    a: "Documentation can be provided upon request. Provide product name and the lot number printed on the bottle so the correct batch records are retrieved.",
  },
  {
    q: "Do you use proprietary blends?",
    a: "No. Proprietary blends hide doses and prevent meaningful evaluation. Age Revive discloses core actives and doses so the product can be audited.",
  },
  {
    q: "What contaminants do you screen for?",
    a: "Common screening categories include identity verification, potency, heavy metals, and microbiological contaminants. Additional panels may apply based on ingredient sourcing and extraction methods.",
  },
  {
    q: "How do you handle allergens?",
    a: "Known allergens should be disclosed on-label. CELLUNOVA contains wheat (spermidine source). If you have allergies or sensitivities, review Supplement Facts and consult a clinician if needed.",
  },
  {
    q: "How do I find my lot number?",
    a: "Lot numbers are printed on the bottle (often near the label edge or on the bottom). Use that lot number when requesting documentation so the correct records are pulled.",
  },
  {
    q: "Is this page medical advice?",
    a: "No. This page explains manufacturing and quality concepts. Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.",
  },
];

const AUDIT_CHECKLIST: string[] = [
  "Is the full dose disclosed for each core active (no proprietary blend)?",
  "Is there identity verification for each lot?",
  "Is there potency verification for the finished product (not just raw materials)?",
  "Is there contaminant screening appropriate to the ingredient risk profile (heavy metals, micro, and others as needed)?",
  "Is there traceability with lot numbers and batch records?",
  "If delivery claims exist (enteric protection), is the delivery integrity validated?",
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

function useQualitySEO() {
  useEffect(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = `${siteUrl}/quality`;

    const title = "Quality Standards | Testing, Traceability, Transparency | Age Revive";
    const description =
      "How Age Revive approaches supplement quality: transparent dosing, identity and potency verification, contaminant screening concepts, lot traceability, and documentation requests.";

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
        { "@type": "ListItem", position: 2, name: "Quality", item: canonical },
      ],
    };

    const webPageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Quality Standards",
      url: canonical,
      description,
      isPartOf: { "@type": "WebSite", name: "Age Revive", url: siteUrl },
      dateModified: LAST_UPDATED,
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: QUALITY_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    injectJsonLd("quality-breadcrumb", breadcrumbJsonLd);
    injectJsonLd("quality-webpage", webPageJsonLd);
    injectJsonLd("quality-faq", faqJsonLd);
  }, []);
}

function Section(props: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={props.id} className="scroll-mt-28 py-12 md:py-16 border-t border-white/10">
      <div className="flex flex-col gap-4">
        {props.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">{props.eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-semibold leading-tight md:text-4xl">{props.title}</h2>
        {props.subtitle ? (
          <p className="max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            {props.subtitle}
          </p>
        ) : null}
      </div>
      <div className="mt-8">{props.children}</div>
    </section>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Science", href: "/science" },
  { label: "Quality", href: "/quality" },
  { label: "FAQ", href: "/faq" },
];

export default function Quality() {
  useQualitySEO();
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

  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
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
                className={l.label === "Quality" ? "text-teal-300 transition-colors" : "text-white/55 hover:text-teal-300 transition-colors"}
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
                      l.label === "Quality" ? "text-teal-300" : "text-white/60 hover:text-teal-300"
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

      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#0b1120]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-20">
          <p className="text-xs uppercase tracking-[0.32em] text-white/70">Quality</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Quality you can verify
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-xl">
            Credibility comes from discipline: transparent dosing, identity and potency verification, contaminant screening concepts, lot traceability, and documentation that matches what is on the label.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#testing"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15"
              data-testid="link-see-testing"
            >
              See testing standards
            </a>
            <Link
              href={SCIENCE_URL}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
              data-testid="link-read-science"
            >
              Read Science
            </Link>
            <Link
              href={FAQ_URL}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
              data-testid="link-read-faq"
            >
              Read FAQ
            </Link>
          </div>

          <div className="mt-10 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <p className="text-sm text-white/80">
              This page is educational content, not medical advice. Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="mt-2 text-sm text-white/70">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12 overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[260px,1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-white/60">On this page</p>
              <nav className="mt-4 space-y-2" aria-label="Table of contents">
                {TOC.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/5 hover:text-white"
                    data-testid={`toc-link-${item.href.slice(1)}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main>
            <div className="lg:hidden">
              <details className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <summary className="cursor-pointer text-sm font-medium text-white" data-testid="mobile-toc-toggle">
                  Jump to section
                </summary>
                <div className="mt-4 grid gap-2">
                  {TOC.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </details>
            </div>

            <Section
              id="overview"
              eyebrow="Overview"
              title="What quality should mean in practice"
              subtitle="Most supplement quality pages stay vague because vague pages cannot be audited. This page is specific on purpose."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    t: "Identity and potency",
                    b: "You should be able to verify that the ingredient is what it claims to be, and that labeled doses are real in the finished product.",
                    bullets: ["Identity verification", "Potency confirmation", "No proprietary blend haze"],
                  },
                  {
                    t: "Contaminant screening",
                    b: "Quality means reducing avoidable risk. Panels vary, but screening categories should be explainable and documented.",
                    bullets: ["Heavy metals screening", "Microbiological screening", "Other panels when relevant"],
                  },
                  {
                    t: "Traceability",
                    b: "If you cannot trace a batch from raw material to finished product, you do not have real control.",
                    bullets: ["Lot numbers on bottles", "Batch records", "Documentation linked to lot number"],
                  },
                  {
                    t: "Delivery integrity",
                    b: "Enteric protection or other delivery choices must perform. If integrity fails, the design fails.",
                    bullets: ["Format integrity checks where applicable", "Stability alignment", "Packaging discipline"],
                  },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6" data-testid={`card-overview-${c.t.toLowerCase().replace(/\s+/g, "-")}`}>
                    <h3 className="text-lg font-semibold">{c.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{c.b}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
                      {c.bullets.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                <h3 className="text-lg font-semibold">Simple buyer audit checklist</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  If you are evaluating any longevity supplement, these checks catch most marketing games.
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
                  {AUDIT_CHECKLIST.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            <Section
              id="testing"
              eyebrow="Testing standards"
              title="What we test and why it matters"
              subtitle="Panels vary by ingredient and risk profile, but the categories should be consistent and explainable."
            >
              {(() => {
                const rows = [
                  { cat: "Identity", what: "Confirms the ingredient matches the label claim.", why: "Prevents substitution and sourcing errors." },
                  { cat: "Potency", what: "Confirms labeled actives are present at labeled doses in finished product.", why: "Dose is the bridge between research and reality." },
                  { cat: "Heavy metals", what: "Screens for metals such as lead, arsenic, cadmium, mercury (panel depends on method).", why: "Reduces avoidable exposure risk from raw material variability." },
                  { cat: "Microbiological", what: "Screens for microbial contamination and baseline microbiological standards.", why: "Protects against contamination issues in production or storage." },
                  { cat: "Residual solvents (when relevant)", what: "Screens for extraction-related residues where applicable.", why: "Some extracts can carry residues if poorly controlled." },
                  { cat: "Format integrity (where applicable)", what: "Checks delivery characteristics such as enteric protection integrity.", why: "Delivery claims are meaningless if integrity fails." },
                ];
                return (
                  <>
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 bg-black/10">
                              <th className="px-5 py-4 text-left text-xs uppercase tracking-[0.32em] text-white/60">Category</th>
                              <th className="px-5 py-4 text-left text-xs uppercase tracking-[0.32em] text-white/60">What it checks</th>
                              <th className="px-5 py-4 text-left text-xs uppercase tracking-[0.32em] text-white/60">Why it matters</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.cat} className="border-b border-white/10 last:border-b-0">
                                <td className="px-5 py-4 text-sm text-white">{row.cat}</td>
                                <td className="px-5 py-4 text-sm text-white/75">{row.what}</td>
                                <td className="px-5 py-4 text-sm text-white/60">{row.why}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="md:hidden grid gap-3">
                      {rows.map((row) => (
                        <div key={row.cat} className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <h4 className="text-sm font-semibold text-white">{row.cat}</h4>
                          <p className="mt-2 text-sm text-white/70">{row.what}</p>
                          <p className="mt-1 text-xs text-white/50">{row.why}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">Avoid the fake quality signals</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Fake signal #1: premium ingredients with no identity or potency verification. Fake signal #2: proprietary blends that hide doses. If you cannot audit it, it is not science-forward.
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">What documentation should connect</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Documentation should connect identity, potency, and screening results to the exact lot number on the bottle.
                  </p>
                </div>
              </div>
            </Section>

            <Section
              id="manufacturing"
              eyebrow="Manufacturing and compliance"
              title="Manufacturing discipline is the baseline"
              subtitle="Quality is a system: supplier qualification, batch records, and release criteria."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { t: "cGMP manufacturing", b: "Dietary supplements in the US are commonly manufactured under current Good Manufacturing Practices. This is baseline, not a flex." },
                  { t: "Supplier qualification", b: "Raw material variability is real. A serious program verifies identity and screens relevant risk categories per lot." },
                  { t: "Release criteria", b: "A product should be released only after it meets identity, potency, and contaminant standards appropriate to its ingredients." },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold">{c.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{c.b}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                <h3 className="text-lg font-semibold">Why this matters for longevity protocols</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  If people take a protocol consistently, the product must be consistent. That is why quality matters as much as mechanism selection.
                </p>
              </div>
            </Section>

            <Section
              id="traceability"
              eyebrow="Traceability and documentation"
              title="Lot traceability and how to request verification"
              subtitle="You should not have to trust a vibe. You should be able to reference a lot number and request batch documentation."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">What to look for on your bottle</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
                    {[
                      "Lot number printed on the bottle",
                      "Clear Supplement Facts panel",
                      "Allergen disclosures where relevant (CELLUNOVA contains wheat)",
                      "Storage guidance appropriate to the product format",
                    ].map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">How to request documentation</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/70">
                    <li>Find the lot number on your bottle.</li>
                    <li>Share the product name and lot number.</li>
                    <li>Request batch documentation or a test summary.</li>
                  </ol>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={FAQ_URL}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white/15"
                      data-testid="link-traceability-faq"
                    >
                      Read FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              id="label"
              eyebrow="Transparency"
              title="Label transparency is a quality standard"
              subtitle="If the dose is hidden, the science cannot be evaluated."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">No proprietary blends</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Proprietary blends prevent dose comparison to published research. They are incompatible with science-forward positioning.
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold">Core actives should be disclosed</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Across the system this includes ingredients like Nicotinamide Riboside (NR), urolithin A, tributyrin, quercetin, fisetin, trans-resveratrol, spermidine, Ca-AKG, and PQQ.
                  </p>
                </div>
              </div>
            </Section>

            <Section
              id="product-notes"
              eyebrow="Product-specific notes"
              title="Quality notes by product"
              subtitle="This ties quality expectations to real design choices: daily use, delivery integrity, allergens, and protocol structure."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    eyebrow: "Foundation layer",
                    name: "CELLUNAD+",
                    body: "Daily NAD+ pathway support using Nicotinamide Riboside (NR) plus methylation co-factor support (TMG, 5-MTHF, methylcobalamin, P-5-P).",
                    bullets: [
                      "Identity and potency consistency matter most for daily use.",
                      "Transparent dosing enables auditing against human research.",
                    ],
                    href: PRODUCT_ROUTES.cellunad,
                    cta: "View CELLUNAD+",
                  },
                  {
                    eyebrow: "Signal stability",
                    name: "CELLUBIOME",
                    body: "Gut and mitochondrial support using urolithin A and tributyrin (butyrate precursor). Enteric protection is part of the design intent.",
                    bullets: [
                      "Delivery integrity matters because enteric protection changes real behavior.",
                      "Format integrity checks should exist where delivery is a key claim.",
                    ],
                    href: PRODUCT_ROUTES.cellubiome,
                    cta: "View CELLUBIOME",
                  },
                  {
                    eyebrow: "Controlled reset",
                    name: "CELLUNOVA",
                    body: "A 7-day protocol. Includes autophagy-related compounds and senescence research compounds plus mitochondrial resilience support.",
                    bullets: [
                      "Contains wheat (spermidine source). Allergen disclosure matters.",
                      "Multi-ingredient protocols require strong batch controls.",
                    ],
                    href: PRODUCT_ROUTES.cellunova,
                    cta: "View CELLUNOVA",
                  },
                ].map((card) => (
                  <div key={card.name} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6" data-testid={`card-product-${card.name.toLowerCase().replace("+", "")}`}>
                    <p className="text-xs uppercase tracking-[0.32em] text-white/60">{card.eyebrow}</p>
                    <h3 className="mt-3 text-xl font-semibold">{card.name}</h3>
                    <p className="mt-3 text-sm text-white/75">{card.body}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link
                        href={card.href}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15"
                        data-testid={`link-view-${card.name.toLowerCase().replace("+", "")}`}
                      >
                        {card.cta}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              id="quality-faq"
              eyebrow="FAQ"
              title="Quality FAQ"
              subtitle="Direct answers about testing, documentation, and manufacturing standards."
            >
              <div className="grid gap-3">
                {QUALITY_FAQS.map((f) => (
                  <details key={f.q} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6" data-testid={`faq-quality-${f.q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}>
                    <summary className="cursor-pointer text-base font-semibold text-white">
                      {f.q}
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-10 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8">
                <h3 className="text-2xl font-semibold">Explore the full system</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  Quality is the foundation. Science explains mechanisms. Products implement the protocol.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={SCIENCE_URL}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium hover:bg-white/15"
                    data-testid="link-explore-science"
                  >
                    Read Science
                  </Link>
                  <Link
                    href={PRODUCT_ROUTES.cellunad}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-6 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
                    data-testid="link-explore-products"
                  >
                    View products
                  </Link>
                </div>
              </div>
            </Section>

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
