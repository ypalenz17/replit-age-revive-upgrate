import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import SiteNavbar from "../components/SiteNavbar";
import Footer from "../components/Footer";
import "../styles/quality.css";

const LAST_UPDATED = "2026-02-24";

const PRODUCT_ROUTES = {
  cellunad: "/product/cellunad",
  cellubiome: "/product/cellubiome",
  cellunova: "/product/cellunova",
} as const;

type TocItem = { id: string; label: string };
const TOC: TocItem[] = [
  { id: "overview", label: "What quality means" },
  { id: "testing", label: "Testing standards" },
  { id: "checklist", label: "Buyer checklist" },
  { id: "traceability", label: "Traceability" },
  { id: "compliance", label: "Compliance" },
  { id: "product-notes", label: "Product notes" },
  { id: "quality-faq", label: "FAQ" },
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
    a: "Known allergens are disclosed on-label. CELLUNOVA contains wheat (spermidine source). If you have allergies or sensitivities, review Supplement Facts and consult a clinician if needed.",
  },
  {
    q: "How do I find my lot number?",
    a: "Lot numbers are printed on the bottle, often near the label edge or on the bottom. Use that lot number when requesting documentation so the correct records are pulled.",
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
  "Is there contaminant screening appropriate to the ingredient risk profile?",
  "Is there traceability with lot numbers and batch records?",
  "If delivery claims exist (enteric protection), is the delivery integrity validated?",
];

const TESTING_ROWS = [
  { cat: "Identity", what: "Confirms the ingredient matches the label claim.", why: "Prevents substitution and sourcing errors." },
  { cat: "Potency", what: "Confirms labeled actives are present at labeled doses in finished product.", why: "Dose is the bridge between research and reality." },
  { cat: "Heavy metals", what: "Screens for lead, arsenic, cadmium, mercury (panel depends on method).", why: "Reduces avoidable exposure risk from raw material variability." },
  { cat: "Microbiological", what: "Screens for microbial contamination and baseline microbiological standards.", why: "Protects against contamination issues in production or storage." },
  { cat: "Residual solvents", what: "Screens for extraction-related residues where applicable.", why: "Some extracts can carry residues if poorly controlled." },
  { cat: "Format integrity", what: "Checks delivery characteristics such as enteric protection integrity.", why: "Delivery claims are meaningless if integrity fails." },
];

const OVERVIEW_ITEMS = [
  {
    title: "Identity and potency",
    body: "You should be able to verify that the ingredient is what it claims to be, and that labeled doses are real in the finished product.",
  },
  {
    title: "Contaminant screening",
    body: "Quality means reducing avoidable risk. Panels vary, but screening categories should be explainable and documented.",
  },
  {
    title: "Traceability",
    body: "If you cannot trace a batch from raw material to finished product, you do not have real control.",
  },
  {
    title: "Delivery integrity",
    body: "Enteric protection or other delivery choices must perform. If integrity fails, the design fails.",
  },
];

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
    <div className="q-eyebrow">
      <span className="q-eyebrowLine" />
      <span>{label}</span>
      <span className="q-eyebrowLine" />
    </div>
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
  const buttonId = `quality-faq-btn-${index}`;
  const panelId = `quality-faq-panel-${index}`;

  return (
    <div className="q-accItem">
      <button
        id={buttonId}
        className="q-accButton"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpenIndex(isOpen ? null : index)}
        type="button"
        data-testid={`button-quality-faq-${index}`}
      >
        <span>{question}</span>
        <span className={`q-accChevron${isOpen ? " q-accChevronOpen" : ""}`} aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="q-accPanel">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Quality() {
  const [activeId, setActiveId] = useState<string>(TOC[0]?.id || "overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUALITY_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }), []);

  const pageJsonLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Quality You Can Verify — Testing, Traceability & Transparency",
      description: "How Age Revive approaches supplement quality: transparent dosing, identity and potency verification, contaminant screening, lot traceability, and documentation requests.",
      url: `${origin}/quality`,
      isPartOf: { "@type": "WebSite", name: "Age Revive", url: origin || "https://example.com" },
      dateModified: LAST_UPDATED,
    };
  }, []);

  useEffect(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = `${siteUrl}/quality`;
    const title = "Quality You Can Verify | Testing, Traceability & Transparency | Age Revive";
    const description = "How Age Revive approaches supplement quality: transparent dosing, identity and potency verification, contaminant screening, lot traceability, and documentation requests.";

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

    injectJsonLd("quality-webpage", pageJsonLd);
    injectJsonLd("quality-faq", faqJsonLd);
  }, [pageJsonLd, faqJsonLd]);

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
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
      { root: null, threshold: [0.1, 0.2, 0.35], rootMargin: "-18% 0px -62% 0px" }
    );
    ids.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SiteNavbar />
      <main className="ar-quality">

        <header className="q-hero">
          <div className="q-container">
            <Eyebrow label="QUALITY" />
            <h1 data-testid="text-quality-h1">Quality you can verify</h1>
            <p className="q-subhead">
              Transparent dosing, identity and potency verification, contaminant screening, lot traceability, and documentation that matches what is on the label.
            </p>

            <div className="q-heroCtas">
              <a className="q-btn q-btnPrimary" href="#testing" onClick={(e) => { e.preventDefault(); scrollTo("testing"); }} data-testid="link-see-testing">
                See testing standards
              </a>
              <Link className="q-btn q-btnGhost" to="/science" data-testid="link-read-science">
                Read Science
              </Link>
            </div>

            <div className="q-trustStrip" aria-label="Quality markers">
              {["Transparent dosing", "Third-party tested", "Lot traceability", "No proprietary blends"].map((m, i) => (
                <span key={m} className="q-trustItem">
                  {i > 0 && <span className="q-trustDot" />}
                  {m}
                </span>
              ))}
            </div>

            <p className="q-boundaryNote">Educational content — not medical advice</p>
            <p className="q-updated">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="q-tocMobilePills" aria-label="Jump to section">
            {TOC.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`q-pill ${activeId === t.id ? "q-pillActive" : ""}`}
                onClick={() => scrollTo(t.id)}
                data-testid={`pill-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <div className="q-pageBody">
          <aside className="q-toc" aria-label="Table of contents">
            <p className="q-tocTitle">On this page</p>
            {TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`q-tocLink ${activeId === t.id ? "q-tocLinkActive" : ""}`}
                onClick={(e) => { e.preventDefault(); scrollTo(t.id); }}
                data-testid={`toc-${t.id}`}
              >
                {t.label}
              </a>
            ))}
          </aside>

          <div className="q-content">

            {/* ── LIGHT: Overview + Testing ── */}
            <div className="q-light">
              <div className="q-contentInner">
                <section
                  id="overview"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["overview"] = el; }}
                >
                  <Eyebrow label="OVERVIEW" />
                  <h2>What quality should mean in practice</h2>
                  <p className="q-lede">
                    Most supplement quality pages stay vague because vague pages cannot be audited. This page is specific on purpose.
                  </p>

                  <div className="q-grid2">
                    {OVERVIEW_ITEMS.map((item) => (
                      <div key={item.title} className="q-card" data-testid={`card-overview-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        <p className="q-cardTitle">{item.title}</p>
                        <p className="q-cardBody">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="q-sectionDivider" />

                <section
                  id="testing"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["testing"] = el; }}
                >
                  <Eyebrow label="TESTING STANDARDS" />
                  <h2>What we test and why it matters</h2>
                  <p className="q-lede">
                    Panels vary by ingredient and risk profile, but the categories should be consistent and explainable.
                  </p>

                  <div className="q-testingDesktop">
                    <div className="q-tableWrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>What it checks</th>
                            <th>Why it matters</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TESTING_ROWS.map((row) => (
                            <tr key={row.cat}>
                              <td className="q-tdCategory">{row.cat}</td>
                              <td>{row.what}</td>
                              <td className="q-tdWhy">{row.why}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="q-testingMobile">
                    {TESTING_ROWS.map((row) => (
                      <div key={row.cat} className="q-testingCard">
                        <p className="q-testingCardCat">{row.cat}</p>
                        <p className="q-testingCardWhat">{row.what}</p>
                        <p className="q-testingCardWhy">{row.why}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* ── DARK: Buyer audit checklist ── */}
            <div className="q-dark">
              <div className="q-contentInner">
                <section
                  id="checklist"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["checklist"] = el; }}
                >
                  <Eyebrow label="BUYER CHECKLIST" />
                  <h2>How to audit any supplement</h2>
                  <p className="q-lede">
                    If you are evaluating any longevity supplement — ours included — these checks catch most marketing games.
                  </p>

                  <div>
                    {AUDIT_CHECKLIST.map((item, idx) => (
                      <div key={item} className="q-checkItem">
                        <span className="q-checkNum">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="q-checkText">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="q-footnote">
                    This checklist applies to any supplement, not just Age Revive products. If a brand fails most of these checks, the quality claims are likely marketing.
                  </div>
                </section>
              </div>
            </div>

            {/* ── LIGHT: Traceability ── */}
            <div className="q-light">
              <div className="q-contentInner">
                <section
                  id="traceability"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["traceability"] = el; }}
                >
                  <Eyebrow label="TRACEABILITY" />
                  <h2>Lot traceability and documentation</h2>
                  <p className="q-lede">
                    You should not have to trust a vibe. You should be able to reference a lot number and request batch documentation.
                  </p>

                  <div className="q-grid2">
                    <div className="q-card">
                      <p className="q-cardTitle">What to look for on your bottle</p>
                      <ul className="q-bulletList">
                        {[
                          "Lot number printed on the bottle",
                          "Clear Supplement Facts panel",
                          "Allergen disclosures where relevant (CELLUNOVA contains wheat)",
                          "Storage guidance appropriate to the product format",
                        ].map((b) => (
                          <li key={b} className="q-bulletItem">
                            <span className="q-bulletDot" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="q-card">
                      <p className="q-cardTitle">How to request documentation</p>
                      <div>
                        {[
                          "Find the lot number on your bottle.",
                          "Share the product name and lot number with support.",
                          "Request batch documentation or a test summary.",
                        ].map((step, idx) => (
                          <div key={step} className="q-traceStep">
                            <span className="q-traceNum">{idx + 1}</span>
                            <span className="q-traceText">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="q-footnote">
                    Lot-level traceability connects raw material checks, finished product testing, and shipping records to a single batch identifier. It is one of the clearest signals of manufacturing discipline.
                  </p>
                </section>
              </div>
            </div>

            {/* ── DARK: Compliance ── */}
            <div className="q-dark">
              <div className="q-contentInner">
                <section
                  id="compliance"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["compliance"] = el; }}
                >
                  <Eyebrow label="MANUFACTURING AND TRANSPARENCY" />
                  <h2>Manufacturing discipline is the baseline</h2>
                  <p className="q-lede">
                    Quality is a system: supplier qualification, batch records, release criteria, and label transparency.
                  </p>

                  <div className="q-grid3">
                    {[
                      { t: "cGMP manufacturing", b: "Dietary supplements in the US are commonly manufactured under current Good Manufacturing Practices. This is baseline, not a flex." },
                      { t: "Supplier qualification", b: "Raw material variability is real. A serious program verifies identity and screens relevant risk categories per lot." },
                      { t: "Release criteria", b: "A product should be released only after it meets identity, potency, and contaminant standards appropriate to its ingredients." },
                      { t: "No proprietary blends", b: "Proprietary blends prevent dose comparison to published research. Age Revive discloses core actives and doses." },
                      { t: "Core actives disclosed", b: "Includes NR, urolithin A, tributyrin, quercetin, fisetin, trans-resveratrol, spermidine, Ca-AKG, PQQ, and co-factors." },
                      { t: "Allergen disclosure", b: "Known allergens are disclosed on-label. CELLUNOVA contains wheat (spermidine source)." },
                    ].map((c) => (
                      <div key={c.t} className="q-card">
                        <p className="q-cardTitle">{c.t}</p>
                        <p className="q-cardBody">{c.b}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* ── LIGHT: Product notes + FAQ ── */}
            <div className="q-light">
              <div className="q-contentInner">
                <section
                  id="product-notes"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["product-notes"] = el; }}
                >
                  <Eyebrow label="PRODUCT NOTES" />
                  <h2>Quality notes by product</h2>
                  <p className="q-lede">
                    Each product has different quality priorities based on its design, cadence, and formulation.
                  </p>

                  <div className="q-grid3">
                    {[
                      {
                        eyebrow: "Daily foundation",
                        name: "CELLUNAD+",
                        body: "Daily NAD+ pathway support using NR plus methylation co-factor support.",
                        note: "Identity and potency consistency matter most for daily use. Transparent dosing enables auditing against human research.",
                        href: PRODUCT_ROUTES.cellunad,
                      },
                      {
                        eyebrow: "Signal stability",
                        name: "CELLUBIOME",
                        body: "Gut and mitochondrial support using urolithin A and tributyrin. Enteric protection is part of the design intent.",
                        note: "Delivery integrity matters because enteric protection changes real behavior.",
                        href: PRODUCT_ROUTES.cellubiome,
                      },
                      {
                        eyebrow: "Monthly reset",
                        name: "CELLUNOVA",
                        body: "A 7-day protocol with autophagy-related compounds, senescence research compounds, and mitochondrial resilience support.",
                        note: "Contains wheat (spermidine source). Multi-ingredient protocols require strong batch controls.",
                        href: PRODUCT_ROUTES.cellunova,
                      },
                    ].map((card) => (
                      <div key={card.name} className="q-card" data-testid={`card-product-${card.name.toLowerCase().replace("+", "")}`}>
                        <p className="q-productCardEyebrow">{card.eyebrow}</p>
                        <h3>{card.name}</h3>
                        <p className="q-cardBody">{card.body}</p>
                        <p className="q-productCardNote">{card.note}</p>
                        <div className="q-productCardCta">
                          <Link className="q-btn q-btnGhost" to={card.href} data-testid={`link-view-${card.name.toLowerCase().replace("+", "")}`}>
                            View {card.name}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="q-sectionDivider" />

                <section
                  id="quality-faq"
                  className="q-section"
                  ref={(el) => { sectionRefs.current["quality-faq"] = el; }}
                >
                  <Eyebrow label="FAQ" />
                  <h2>Quality FAQ</h2>
                  <p className="q-lede">
                    Direct answers about testing, documentation, and manufacturing standards.
                  </p>

                  <div className="q-accordion">
                    {QUALITY_FAQS.map((f, idx) => (
                      <AccordionItem
                        key={f.q}
                        index={idx}
                        question={f.q}
                        answer={f.a}
                        openIndex={openFaq}
                        setOpenIndex={setOpenFaq}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* ── DARK: Final CTA ── */}
            <div className="q-dark">
              <div className="q-contentInner">
                <section className="q-section">
                  <Eyebrow label="NEXT STEP" />
                  <h2>Explore the full system</h2>
                  <p className="q-lede">
                    Quality is the foundation. <Link to="/science" className="q-inlineLink">Science</Link> explains mechanisms. Products implement the protocol.
                  </p>

                  <div className="q-finalCtaCards">
                    <div className="q-finalCtaCard">
                      <div className="q-finalCtaTag">Documentation</div>
                      <p className="q-finalCtaName">Read the science</p>
                      <p className="q-finalCtaBody">Protocol architecture, ingredient rationale, evidence summaries, and dosing detail.</p>
                      <Link className="q-btn q-btnGhost" to="/science" data-testid="link-explore-science">
                        Science page
                      </Link>
                    </div>
                    <div className="q-finalCtaCard">
                      <div className="q-finalCtaTag">Products</div>
                      <p className="q-finalCtaName">View the protocol</p>
                      <p className="q-finalCtaBody">Three products, one system. Daily foundation, signal stability, and periodic reset.</p>
                      <Link className="q-btn q-btnGhost" to="/shop" data-testid="link-explore-shop">
                        Shop products
                      </Link>
                    </div>
                    <div className="q-finalCtaCard">
                      <div className="q-finalCtaTag">Questions</div>
                      <p className="q-finalCtaName">Read the FAQ</p>
                      <p className="q-finalCtaBody">Shipping, returns, protocol guidance, and additional quality questions.</p>
                      <Link className="q-btn q-btnGhost" to="/faq" data-testid="link-explore-faq">
                        FAQ page
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        </div>

        <p className="q-fdaDisclaimer">
          These statements have not been evaluated by the FDA. This content is for educational purposes only.
        </p>
      </main>
      <div className="bg-[#060E1A]">
        <Footer />
      </div>
    </>
  );
}
