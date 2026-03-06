import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import "../styles/science.css";
import {
  DEEP_DIVES,
  EVIDENCE_FRAMEWORK,
  EVIDENCE_TABLES,
  FAQ,
  FINAL_CTA,
  GLOSSARY,
  LAYERS,
  REFERENCES,
  REFERENCE_GROUPS,
  SCIENCE_META,
  SCIENCE_TOC,
  STANDARDS,
} from "../science/scienceContent";
import Footer from "../components/Footer";
import SiteNavbar from "../components/SiteNavbar";

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
  if (existing?.parentNode) existing.parentNode.removeChild(existing);
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
        <span aria-hidden="true" style={{ fontSize: 12, opacity: 0.5 }}>{isOpen ? "▴" : "▾"}</span>
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
  const [activeId, setActiveId] = useState<string>(SCIENCE_TOC[0]?.id || "how-to-read");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }), []);

  const pageJsonLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Science | Age Revive",
      description: SCIENCE_META.description,
      url: `${origin}${SCIENCE_META.canonicalPath}`,
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
      ["ar-science-jsonld-webpage", "ar-science-jsonld-breadcrumbs", "ar-science-jsonld-faq"].forEach((id) => {
        const el = document.getElementById(id);
        if (el?.parentNode) el.parentNode.removeChild(el);
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

  const refGroups = REFERENCE_GROUPS.map((group) => ({
    group,
    items: REFERENCES.filter((r) => r.group === group),
  }));

  return (
    <>
      <SiteNavbar />
      <main className="ar-science">

        {/* ── Hero ── */}
        <header className="ar-hero">
          <div className="ar-container">
            <Eyebrow label="SCIENCE" />
            <h1>The science behind the protocol</h1>
            <p className="ar-subhead">
              What each product does, why we chose these compounds, what the evidence says, and where confidence is stronger versus more emerging. Documentation first. No proprietary blends.
            </p>

            <div className="ar-heroCtas">
              <a className="ar-btn ar-btnPrimary" href="#evidence" onClick={(e) => { e.preventDefault(); scrollTo("evidence"); }} data-testid="link-jump-evidence">
                Jump to evidence
              </a>
              <Link className="ar-btn ar-btnGhost" to="/shop" data-testid="link-browse-products">
                Shop the system
              </Link>
            </div>

            <div className="ar-trustStrip" aria-label="Trust markers">
              {["Clinically studied compounds", "Transparent dosing", "Enteric delivery", "Third-party tested"].map((m, i) => (
                <span key={m} className="ar-trustItem">
                  {i > 0 && <span className="ar-trustDot" />}
                  {m}
                </span>
              ))}
            </div>

            <p className="ar-boundaryNote">Educational information — not medical advice</p>
          </div>

          <div className="ar-tocMobilePills" aria-label="Jump to section">
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
        </header>

        {/* ── Page body with persistent TOC ── */}
        <div className="ar-pageBody">
          <aside className="ar-toc" aria-label="Table of contents">
            <p className="ar-tocTitle">On this page</p>
            {SCIENCE_TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`ar-tocLink ${activeId === t.id ? "ar-tocLinkActive" : ""}`}
                onClick={(e) => { e.preventDefault(); scrollTo(t.id); }}
                data-testid={`toc-${t.id}`}
              >
                {t.label}
              </a>
            ))}
          </aside>

          <div className="ar-content">

            {/* ── DARK: How to Read + Protocol Architecture ── */}
            <div className="ar-dark">
              <div className="ar-contentInner">
                <section
                  id="how-to-read"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["how-to-read"] = el; }}
                >
                  <Eyebrow label="HOW TO READ THIS PAGE" />
                  <h2>Understanding the evidence</h2>
                  <p className="ar-lede">
                    Not all evidence is equal. We use these labels throughout the page to clarify what level of research supports each ingredient. References are included for transparency — not as promises.
                  </p>

                  <div className="ar-frameworkGrid">
                    {EVIDENCE_FRAMEWORK.map((f) => (
                      <div key={f.label} className="ar-frameworkItem">
                        <span className="ar-frameworkLabel">{f.label}</span>
                        <span className="ar-frameworkDesc">{f.description}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="protocol"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["protocol"] = el; }}
                >
                  <Eyebrow label="PROTOCOL ARCHITECTURE" />
                  <h2>Three layers, one system</h2>
                  <p className="ar-lede">
                    A daily foundation, signal stability layer, and periodic reset. Each product has a defined role, cadence, and formulation rationale.
                  </p>

                  <div className="ar-grid3">
                    {LAYERS.map((layer) => (
                      <div key={layer.productName} className="ar-card ar-layerCard">
                        <div className="ar-layerTag">{layer.eyebrow}</div>
                        <p className="ar-layerName">{layer.productName}</p>
                        <p className="ar-layerRole">{layer.roleBody}</p>
                        <div className="ar-layerMeta">
                          <div className="ar-layerMetaRow">
                            <span className="ar-layerMetaLabel">Cadence</span>
                            <span className="ar-layerMetaValue">{layer.cadence}</span>
                          </div>
                          <div className="ar-layerMetaRow">
                            <span className="ar-layerMetaLabel">Key</span>
                            <span className="ar-layerMetaValue">{layer.keyIngredients}</span>
                          </div>
                          <div className="ar-layerMetaRow">
                            <span className="ar-layerMetaLabel">Note</span>
                            <span className="ar-layerMetaValue">{layer.distinctionNote}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* ── LIGHT: Standards ── */}
            <div className="ar-light">
              <div className="ar-contentInner">
                <section
                  id="standards"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["standards"] = el; }}
                >
                  <Eyebrow label="HOW WE BUILD" />
                  <h2>Our standards</h2>
                  <p className="ar-lede">
                    Credibility is decisions you can audit: dose, delivery, mechanism, transparency, and testing.
                  </p>

                  <div className="ar-gridStandards">
                    {STANDARDS.map((s) => (
                      <div key={s.title} className="ar-card ar-standardCard">
                        <p className="ar-standardTitle">{s.title}</p>
                        <p className="ar-standardBody">{s.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* ── DARK: Deep Dives / Formulation Logic ── */}
            <div className="ar-dark">
              <div className="ar-contentInner">
                <section
                  id="deep-dives"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["deep-dives"] = el; }}
                >
                  <Eyebrow label="FORMULATION LOGIC" />
                  <h2>Why each formula exists</h2>
                  <p className="ar-lede">
                    What each product is designed for, what it is not, how it is used, and where confidence is stronger versus more emerging.
                  </p>

                  {DEEP_DIVES.map((dd) => (
                    <div key={dd.product} className="ar-deepDiveProduct">
                      <div className="ar-deepDiveHeader">
                        <h3 className="ar-deepDiveName">{dd.product}</h3>
                      </div>
                      <div className="ar-deepDiveGrid">
                        <div className="ar-deepDiveBlock">
                          <p className="ar-deepDiveBlockLabel">What it is for</p>
                          <p className="ar-deepDiveBlockText">{dd.whatItIsFor}</p>
                        </div>
                        <div className="ar-deepDiveBlock">
                          <p className="ar-deepDiveBlockLabel">What it is not</p>
                          <p className="ar-deepDiveBlockText">{dd.whatItIsNot}</p>
                        </div>
                        <div className="ar-deepDiveBlock">
                          <p className="ar-deepDiveBlockLabel">How it is used</p>
                          <p className="ar-deepDiveBlockText">{dd.howItIsUsed}</p>
                        </div>
                        <div className="ar-deepDiveBlock">
                          <p className="ar-deepDiveBlockLabel">Formulation rationale</p>
                          <p className="ar-deepDiveBlockText">{dd.formulationRationale}</p>
                        </div>
                        <div className="ar-deepDiveBlock" style={{ gridColumn: "1 / -1" }}>
                          <p className="ar-deepDiveBlockLabel">Confidence note</p>
                          <p className="ar-deepDiveBlockText">{dd.confidenceNote}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </div>

            {/* ── LIGHT: Evidence & Dosing ── */}
            <div className="ar-light">
              <div className="ar-contentInner">
                <section
                  id="evidence"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["evidence"] = el; }}
                >
                  <Eyebrow label="EVIDENCE AND DOSING" />
                  <h2>Ingredient-level detail</h2>
                  <p className="ar-lede">
                    Every ingredient, dose, and evidence context. Strength varies by compound and endpoint — labels clarify what level of research applies.
                  </p>

                  {EVIDENCE_TABLES.map((t) => (
                    <div key={t.product} className="ar-evidenceProductGroup">
                      <h3 className="ar-evidenceProductName">{t.product}</h3>
                      <p className="ar-evidenceCaption">{t.caption}</p>

                      <div className="ar-evidenceDesktop">
                        <div className="ar-tableWrap">
                          <table>
                            <thead>
                              <tr>
                                <th style={{ width: "22%" }}>Ingredient</th>
                                <th style={{ width: "12%" }}>Dose</th>
                                <th style={{ width: "14%" }}>Evidence</th>
                                <th>Why included</th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.rows.map((r) => (
                                <tr key={`${t.product}-${r.ingredient}`}>
                                  <td style={{ fontWeight: 600 }}>{r.ingredient}</td>
                                  <td>{r.dose}</td>
                                  <td>
                                    <span className="ar-evidenceTag" data-level={r.evidence}>{r.evidence}</span>
                                  </td>
                                  <td>
                                    {r.why}
                                    {r.notes && <div className="ar-muted" style={{ marginTop: 4 }}>{r.notes}</div>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="ar-evidenceMobile">
                        <div className="ar-ingredientCards">
                          {t.rows.map((r) => (
                            <div key={`${t.product}-${r.ingredient}-m`} className="ar-ingredientCard">
                              <div className="ar-ingredientHeader">
                                <p className="ar-ingredientName">{r.ingredient}</p>
                                <span className="ar-ingredientDose">{r.dose}</span>
                              </div>
                              <p className="ar-ingredientWhy">{r.why}</p>
                              <div className="ar-ingredientFooter">
                                <span className="ar-evidenceTag" data-level={r.evidence}>{r.evidence}</span>
                                {r.notes && <span className="ar-ingredientNote">{r.notes}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="ar-footnote">
                    References are provided for educational transparency. They do not imply that every outcome observed in a study will occur in every individual, or that different protocols will produce identical results.
                  </div>
                </section>
              </div>
            </div>

            {/* ── LIGHT: Glossary + FAQ ── */}
            <div className="ar-light">
              <div className="ar-contentInner">
                <section
                  id="glossary"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["glossary"] = el; }}
                >
                  <Eyebrow label="GLOSSARY" />
                  <h2>Key terms</h2>
                  <p className="ar-lede">Short definitions to remove ambiguity.</p>

                  <div className="ar-glossaryGrid">
                    {GLOSSARY.map((g) => (
                      <div key={g.term} className="ar-glossaryItem">
                        <p className="ar-glossaryTerm">{g.term}</p>
                        <p className="ar-glossaryDef">{g.definition}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="faq"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["faq"] = el; }}
                >
                  <Eyebrow label="FAQ" />
                  <h2>Common questions</h2>
                  <p className="ar-lede">Short answers. Clear boundaries.</p>

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
              </div>
            </div>

            {/* ── LIGHT: References ── */}
            <div className="ar-light">
              <div className="ar-contentInner">
                <section
                  id="references"
                  className="ar-section"
                  ref={(el) => { sectionRefs.current["references"] = el; }}
                >
                  <Eyebrow label="REFERENCES" />
                  <h2>Primary sources</h2>
                  <p className="ar-lede">
                    References support transparency. They are not a promise of a specific result.
                  </p>

                  {refGroups.map((g) => (
                    <div key={g.group}>
                      <h3 className="ar-refGroupTitle">{g.group}</h3>
                      {g.items.map((r) => (
                        <div key={r.url} className="ar-refItem">
                          <p className="ar-refCitation">
                            <a href={r.url} target="_blank" rel="noreferrer">{r.label}</a>
                          </p>
                          {r.note && <p className="ar-refNote">{r.note}</p>}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="ar-footnote">
                    * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
                  </div>
                </section>
              </div>
            </div>

            {/* ── DARK: Final CTA ── */}
            <div className="ar-dark">
              <div className="ar-contentInner">
                <section className="ar-section">
                  <Eyebrow label="THE PROTOCOL" />
                  <h2>{FINAL_CTA.headline}</h2>
                  <p className="ar-lede">{FINAL_CTA.body}</p>

                  <div className="ar-finalCtaCards">
                    {FINAL_CTA.cards.map((c) => (
                      <div key={c.title} className="ar-finalCtaCard">
                        <div className="ar-finalCtaTag">{c.tag}</div>
                        <p className="ar-finalCtaName">{c.title}</p>
                        <p className="ar-finalCtaBody">{c.body}</p>
                        <Link className="ar-btn ar-btnPrimary" to={c.href} data-testid={`link-shop-${c.title.toLowerCase().replace("+", "")}`}>
                          Shop {c.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

      </main>
      <div className="bg-[#060E1A]">
        <Footer />
      </div>
    </>
  );
}
