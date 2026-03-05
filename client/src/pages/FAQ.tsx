import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import Footer from "../components/Footer";
import SiteNavbar from "../components/SiteNavbar";
import { FAQ_CATEGORIES, type FAQItem } from "../content/faqContent";
import "../styles/luxury-pages.css";

const LAST_UPDATED = "2026-02-24";

const PRODUCT_ROUTES = {
  cellunad: "/product/cellunad",
  cellubiome: "/product/cellubiome",
  cellunova: "/product/cellunova",
} as const;

const SCIENCE_URL = "/science";
const QUALITY_URL = "/quality";

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

export default function FAQ() {
  const allItemsForJsonLd = useMemo(() => FAQ_CATEGORIES.flatMap((c) => c.items), []);
  useFaqSEO(allItemsForJsonLd);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <SiteNavbar />

      <header className="ar-luxury-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#131d2e]" />
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

          <div className="mt-10 ar-luxury-disclaimer rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
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
                    <div className="text-center mb-6">
                      <p className="ar-luxury-eyebrow mx-auto text-[10px] mb-3">{cat.id.replace(/-/g, " ")}</p>
                      <h2 className="text-2xl font-semibold tracking-tight">{cat.title}</h2>
                      <p className="mt-2 text-sm text-white/55">{cat.description}</p>
                    </div>

                    <hr className="ar-luxury-section-divider mb-6" />

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

            <div className="mt-12 ar-luxury-card ar-luxury-card-glow p-5 sm:p-7 md:p-10 text-center" data-testid="section-contact">
              <p className="ar-luxury-eyebrow mx-auto text-[10px]">Contact us</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Still have questions?</h2>
              <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-white/60">
                Our team is here to help. Reach out any time and we will get back to you as quickly as possible.
              </p>
              <a
                href="mailto:support@agerevive.com"
                className="ar-luxury-btn-primary mt-6 inline-flex"
                data-testid="link-contact-email"
              >
                support@agerevive.com
              </a>
            </div>

            <div className="mt-12 ar-luxury-card ar-luxury-card-glow p-5 sm:p-7 md:p-10 text-center" data-testid="section-build-protocol">
              <p className="ar-luxury-eyebrow mx-auto text-[10px]">Next step</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Build your protocol</h2>
              <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-white/60">
                Most people start with CELLUNAD+ as the daily foundation and add CELLUBIOME for gut and mitochondrial signaling stability. CELLUNOVA is designed as a periodic 7-day protocol.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
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
