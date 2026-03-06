import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import Footer from "../components/Footer";
import SiteNavbar from "../components/SiteNavbar";
import { FAQ_CATEGORIES, type FAQItem } from "../content/faqContent";
import "../styles/faq.css";

const LAST_UPDATED = "2026-02-24";

const QUICK_ANSWER_QUESTIONS = [
  "How do the three products fit together?",
  "Can I take all three together?",
  "If I start with one product, which one should it be?",
  "How long should I evaluate daily products?",
  "Is CELLUNOVA taken daily?",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
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

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="f-eyebrow">
      <span className="f-eyebrowLine" />
      <span>{label}</span>
      <span className="f-eyebrowLine" />
    </div>
  );
}

function enrichAnswer(answer: string): React.ReactNode {
  const replacements: Array<[RegExp, string, string]> = [
    [/\bScience page\b/i, "/science", "Science page"],
    [/\bQuality page\b/i, "/quality", "Quality page"],
    [/\bShipping page\b/i, "/shipping", "Shipping page"],
    [/\bContact page\b/i, "/faq#need-help", "Contact page"],
  ];

  let result = answer;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const allMatches: Array<{ index: number; length: number; href: string; text: string }> = [];
  for (const [regex, href, text] of replacements) {
    const match = result.match(regex);
    if (match && match.index !== undefined) {
      allMatches.push({ index: match.index, length: match[0].length, href, text });
    }
  }
  allMatches.sort((a, b) => a.index - b.index);

  if (allMatches.length === 0) return answer;

  for (const m of allMatches) {
    if (m.index > lastIndex) {
      parts.push(result.slice(lastIndex, m.index));
    }
    parts.push(
      <Link key={key++} to={m.href} className="f-inlineLink">
        {m.text}
      </Link>
    );
    lastIndex = m.index + m.length;
  }
  if (lastIndex < result.length) {
    parts.push(result.slice(lastIndex));
  }
  return <>{parts}</>;
}

type AccItemProps = {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  slug: string;
};

function AccItem({ faq, isOpen, onToggle, slug }: AccItemProps) {
  const buttonId = `faq-btn-${slug}`;
  const panelId = `faq-panel-${slug}`;

  return (
    <div id={slug} className={`f-accItem${isOpen ? " f-accItemHighlight" : ""}`}>
      <button
        id={buttonId}
        className="f-accButton"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        type="button"
        data-testid={`button-faq-${slug}`}
        data-analytics="faq_question_opened"
        data-question={faq.q}
      >
        <span>{faq.q}</span>
        <span className={`f-accChevron${isOpen ? " f-accChevronOpen" : ""}`} aria-hidden="true">▾</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="f-accPanel"
        hidden={!isOpen}
      >
        <div className="f-accAnswer">{enrichAnswer(faq.a)}</div>
        {faq.tags.length > 0 && (
          <div className="f-accTags">
            {faq.tags.slice(0, 5).map((t) => (
              <span key={t} className="f-tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FAQ() {
  const allItems = useMemo(() => FAQ_CATEGORIES.flatMap((c) => c.items), []);

  const quickAnswers = useMemo(() => {
    return QUICK_ANSWER_QUESTIONS
      .map((q) => allItems.find((it) => it.q === q))
      .filter((it): it is FAQItem => !!it);
  }, [allItems]);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

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

  const totalResults = useMemo(
    () => filteredCategories.reduce((sum, c) => sum + c.items.length, 0),
    [filteredCategories]
  );

  const toggleSlug = useCallback((slug: string) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      const willOpen = !next.has(slug);
      if (willOpen) next.add(slug);
      else next.delete(slug);

      if (willOpen) {
        history.replaceState(null, "", `#${slug}`);
      } else if (window.location.hash === `#${slug}`) {
        history.replaceState(null, "", window.location.pathname);
      }
      return next;
    });
  }, []);

  const openFromHash = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return false;
    const target = document.getElementById(hash);
    if (target) {
      setOpenSlugs((prev) => new Set([...prev, hash]));
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!openFromHash()) {
      window.scrollTo(0, 0);
    }
  }, [openFromHash]);

  useEffect(() => {
    const onHashChange = () => openFromHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [openFromHash]);

  useEffect(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = `${siteUrl}/faq`;
    const title = "FAQ | Protocol, Ingredients, Safety, Quality & Orders | Age Revive";
    const description = "Direct answers about Age Revive protocol structure, ingredients, safety, quality testing, batch documentation, shipping, returns, and support.";

    document.title = title;

    upsertHeadEl(`meta[name="description"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "description"); el.setAttribute("content", description);
    });
    upsertHeadEl(`meta[name="robots"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "robots"); el.setAttribute("content", "index,follow");
    });
    upsertHeadEl(`link[rel="canonical"]`, () => document.createElement("link"), (el) => {
      el.setAttribute("rel", "canonical"); el.setAttribute("href", canonical);
    });
    upsertHeadEl(`meta[property="og:title"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:title"); el.setAttribute("content", title);
    });
    upsertHeadEl(`meta[property="og:description"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:description"); el.setAttribute("content", description);
    });
    upsertHeadEl(`meta[property="og:type"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:type"); el.setAttribute("content", "website");
    });
    upsertHeadEl(`meta[property="og:url"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("property", "og:url"); el.setAttribute("content", canonical);
    });
    upsertHeadEl(`meta[name="twitter:card"]`, () => document.createElement("meta"), (el) => {
      el.setAttribute("name", "twitter:card"); el.setAttribute("content", "summary_large_image");
    });

    const webPageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "FAQ — Protocol, Ingredients, Safety, Quality & Orders",
      url: canonical,
      description,
      dateModified: LAST_UPDATED,
      isPartOf: { "@type": "WebSite", name: "Age Revive", url: siteUrl },
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    injectJsonLd("faq-webpage", webPageJsonLd);
    injectJsonLd("faq-jsonld", faqJsonLd);
  }, [allItems]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId !== "all") {
      const el = document.getElementById(`cat-${catId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }
    }
  };

  const showQuickAnswers = !normalizedQuery && activeCategory === "all";

  return (
    <>
      <SiteNavbar />
      <main className="ar-faq">

        <header className="f-hero">
          <div className="f-container">
            <Eyebrow label="FAQ" />
            <h1 data-testid="text-faq-h1">Direct answers</h1>
            <p className="f-subhead">
              Protocol structure, ingredients, safety, quality verification, and ordering help.
            </p>
            <div className="f-heroLinks">
              <Link to="/science" className="f-heroLink" data-testid="link-hero-science">Read Science</Link>
            </div>
            <p className="f-boundaryNote">Educational content — not medical advice</p>
          </div>
        </header>

        <div className="f-light">
          <div className="f-searchBar">
            <div className="f-searchInner">
              <input
                ref={searchRef}
                type="search"
                className="f-searchInput"
                placeholder="Search questions and answers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="input-faq-search"
                data-analytics="faq_search"
                aria-label="Search frequently asked questions"
              />
              <div className="f-searchMeta">
                <span className="f-resultCount" data-testid="text-result-count">
                  <span className="f-resultCountBold">{totalResults}</span> result{totalResults === 1 ? "" : "s"}
                  {normalizedQuery ? <> for &ldquo;{query.trim()}&rdquo;</> : null}
                </span>
                {(normalizedQuery || activeCategory !== "all") && (
                  <button
                    type="button"
                    className="f-clearBtn"
                    onClick={() => { setQuery(""); setActiveCategory("all"); }}
                    data-testid="button-clear-search"
                    data-analytics="faq_search_clear"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="f-catPills" aria-label="Filter by category" data-analytics="faq_category_selected">
                <button
                  type="button"
                  className={`f-catPill${activeCategory === "all" ? " f-catPillActive" : ""}`}
                  onClick={() => handleCategoryClick("all")}
                  data-testid="filter-all"
                >
                  All
                </button>
                {FAQ_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`f-catPill${activeCategory === c.id ? " f-catPillActive" : ""}`}
                    onClick={() => handleCategoryClick(c.id)}
                    data-testid={`filter-${c.id}`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="f-body">
            <div className="f-container">

              {showQuickAnswers && (
                <section className="f-section" id="quick-answers">
                  <Eyebrow label="MOST ASKED" />
                  <h2>Quick answers</h2>
                  <div className="f-quickGrid">
                    {quickAnswers.map((faq) => (
                      <div key={faq.q} className="f-quickCard" data-testid={`quick-${slugify(faq.q)}`}>
                        <p className="f-quickQ">{faq.q}</p>
                        <p className="f-quickA">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {filteredCategories.length === 0 ? (
                <div className="f-noResults" data-testid="text-no-results" data-analytics="faq_zero_results">
                  <p className="f-noResultsTitle">No matches found</p>
                  <p className="f-noResultsBody">
                    Try searching for NR, NAD+, urolithin A, tributyrin, mitophagy, autophagy, senescence, quercetin, or fisetin.
                  </p>
                </div>
              ) : (
                filteredCategories.map((cat, catIdx) => (
                  <div key={cat.id}>
                    {catIdx > 0 || showQuickAnswers ? <div className="f-sectionDivider" /> : null}
                    <section
                      id={`cat-${cat.id}`}
                      className="f-section"
                      data-testid={`section-faq-${cat.id}`}
                    >
                      <Eyebrow label={cat.id.replace(/-/g, " ").toUpperCase()} />
                      <h2>{cat.title}</h2>
                      <p className="f-sectionLede">{cat.description}</p>

                      <div className="f-accordion">
                        {cat.items.map((faq) => {
                          const slug = slugify(faq.q);
                          return (
                            <AccItem
                              key={faq.q}
                              faq={faq}
                              slug={slug}
                              isOpen={openSlugs.has(slug)}
                              onToggle={() => toggleSlug(slug)}
                            />
                          );
                        })}
                      </div>
                    </section>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="f-dark">
          <div className="f-container">
            <section className="f-section" id="need-help">
              <Eyebrow label="NEED HELP?" />
              <h2>Get support</h2>
              <p className="f-sectionLede">
                Shipping, returns, order issues, or general questions — reach out and we will respond promptly.
              </p>

              <p className="f-sectionLede f-helpCopy">
                For <Link to="/shipping" className="f-inlineLink" data-testid="link-help-shipping" data-analytics="faq_support_click">shipping details</Link> and <Link to="/shop" className="f-inlineLink" data-testid="link-help-shop">product information</Link>, visit the relevant pages.
              </p>
              <div className="f-helpAction">
                <a href="mailto:support@agerevive.com" className="f-btn" data-testid="link-help-email" data-analytics="faq_support_click">
                  Contact support
                </a>
              </div>
            </section>
          </div>
        </div>

        <p className="f-fdaDisclaimer">
          These statements have not been evaluated by the FDA. This content is for educational purposes only.
        </p>
      </main>
      <div className="bg-[#060E1A]">
        <Footer />
      </div>
    </>
  );
}
