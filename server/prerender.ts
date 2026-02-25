import fs from "fs";
import path from "path";

interface ProductData {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  serving: string;
  ingredients: string[];
  description: string;
}

const PRODUCTS: ProductData[] = [
  {
    slug: "cellunad",
    name: "CELLUNAD+",
    category: "NAD+ Optimization",
    tagline: "Precision NAD+ support with co-factors, not hype.",
    serving: "2 capsules daily",
    ingredients: [
      "Nicotinamide Riboside (NR) 500 mg",
      "Betaine (TMG) 250 mg",
      "R-Lipoic Acid 200 mg",
      "Apigenin 100 mg",
      "P-5-P (active B6) 10 mg",
      "5-MTHF 400 mcg DFE",
      "Methylcobalamin 1,000 mcg",
      "BioPerine 5 mg",
    ],
    description:
      "CELLUNAD+ is the daily NAD+ backbone of the Age Revive protocol. NR supports NAD+ pools, apigenin supports NAD+ pathway activity, and TMG plus methylated B vitamins support methylation pathways. Designed for daily consistency, not cycling.",
  },
  {
    slug: "cellubiome",
    name: "CELLUBIOME",
    category: "Mitochondrial + Gut Signaling",
    tagline: "The Gut–Mitochondria Axis, simplified.",
    serving: "2 enteric-coated capsules daily",
    ingredients: ["Urolithin A 500 mg", "Tributyrin 500 mg"],
    description:
      "CELLUBIOME targets the gut–mitochondria signaling pathway. Urolithin A supports mitochondrial recycling signaling (mitophagy support) while tributyrin supports short-chain fatty acid activity through butyrate delivery. Enteric-coated for precision delivery.",
  },
  {
    slug: "cellunova",
    name: "CELLUNOVA",
    category: "7-Day Autophagy + Senolytic Protocol",
    tagline: "Seven days on. Designed as a cycle, not forever.",
    serving: "5 capsules daily for 7 consecutive days",
    ingredients: [
      "NAC 600 mg",
      "Trans-Resveratrol 500 mg",
      "Quercetin 500 mg",
      "Calcium Alpha-Ketoglutarate 300 mg",
      "Green Tea Extract (50% EGCG) 300 mg",
      "Fisetin 100 mg",
      "Spermidine (wheat germ) 15 mg",
      "PQQ 10 mg",
      "Astaxanthin 4 mg",
      "BioPerine 5 mg",
    ],
    description:
      "CELLUNOVA is a 7-day monthly cycle designed to support autophagy and cellular cleanup pathways. The polyphenol stack of resveratrol, quercetin, and EGCG supports cellular maintenance, while NAC and astaxanthin support oxidative stress defense during the cycle. The off-cycle is part of the protocol.",
  },
];

const NAV_LINKS = `
<nav aria-label="Site navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/shop">Shop</a></li>
    <li><a href="/product/cellunad">CELLUNAD+</a></li>
    <li><a href="/product/cellubiome">CELLUBIOME</a></li>
    <li><a href="/product/cellunova">CELLUNOVA</a></li>
    <li><a href="/science">Science</a></li>
    <li><a href="/quality">Quality</a></li>
    <li><a href="/faq">FAQ</a></li>
    <li><a href="/privacy">Privacy</a></li>
    <li><a href="/terms">Terms</a></li>
    <li><a href="/shipping">Shipping</a></li>
  </ul>
</nav>`;

const FOOTER_HTML = `
<footer>
  <p>&copy; 2026 Age Revive</p>
  <nav aria-label="Footer navigation">
    <a href="/">Home</a> |
    <a href="/shop">Shop</a> |
    <a href="/product/cellunad">CELLUNAD+</a> |
    <a href="/product/cellubiome">CELLUBIOME</a> |
    <a href="/product/cellunova">CELLUNOVA</a> |
    <a href="/science">Science</a> |
    <a href="/quality">Quality</a> |
    <a href="/faq">FAQ</a> |
    <a href="/privacy">Privacy</a> |
    <a href="/terms">Terms</a> |
    <a href="/shipping">Shipping</a>
  </nav>
  <p>*These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.</p>
</footer>`;

function productToHtml(p: ProductData): string {
  return `
<section itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">${p.name}</h2>
  <p itemprop="category">${p.category}</p>
  <p itemprop="description">${p.tagline}</p>
  <p>${p.description}</p>
  <h3>Ingredients</h3>
  <ul>
    ${p.ingredients.map((i) => `<li>${i}</li>`).join("\n    ")}
  </ul>
  <p>Serving: ${p.serving}</p>
</section>`;
}

function pageMetaTags(
  title: string,
  description: string,
  path: string
): string {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="https://agerevive.com${path}" />
    <link rel="canonical" href="https://agerevive.com${path}" />`;
}

const PAGE_CONTENT: Record<
  string,
  { title: string; description: string; html: string }
> = {
  "/": {
    title: "AGE REVIVE | Systemic Biological Architecture",
    description:
      "Protocol-grade cellular support. Three engineered formulas — CELLUNAD+ for NAD+ optimization, CELLUBIOME for gut-mitochondria signaling, and CELLUNOVA for 7-day autophagy cycling.",
    html: `
<article>
  <h1>Age Revive — Systemic Biological Architecture</h1>
  ${NAV_LINKS}
  <p>Protocol-grade cellular support. Three engineered formulas designed as a system. NAD+ support, gut-mitochondria signaling, and a 7-day monthly cellular cleanup cycle.</p>

  <section>
    <h2>The Age Revive Protocol</h2>
    <p>Three biological layers working together:</p>
    <ul>
      <li><strong>NAD+ Backbone:</strong> NR, TMG, and apigenin provide the daily substrate for cellular repair, energy metabolism, and sirtuin activation.</li>
      <li><strong>Gut-Mito Axis:</strong> Urolithin A and tributyrin support the gut-mitochondria signaling pathway, linking digestive health to cellular energy.</li>
      <li><strong>Autophagy Cadence:</strong> A 7-day monthly cycle of fisetin, spermidine, and PQQ to support cellular cleanup and renewal.</li>
    </ul>
  </section>

  <section>
    <h2>Products</h2>
    <ul>
      <li><a href="/product/cellunad"><strong>CELLUNAD+ — NAD+ Optimization</strong></a>: Precision NAD+ support with co-factors, not hype. NR 500 mg, TMG 250 mg, Apigenin 100 mg. 2 capsules daily. $79.99/month (subscribe: $67.99).</li>
      <li><a href="/product/cellubiome"><strong>CELLUBIOME — Gut-Mitochondria Signaling</strong></a>: The gut-mitochondria axis, simplified. Urolithin A 500 mg, Tributyrin 500 mg. 2 enteric-coated capsules daily. $110.00/month (subscribe: $93.50).</li>
      <li><a href="/product/cellunova"><strong>CELLUNOVA — 7-Day Autophagy Cycle</strong></a>: Seven days on. Designed as a cycle, not forever. Fisetin, Spermidine, PQQ, Resveratrol, Quercetin, EGCG, NAC. 5 capsules daily for 7 days. $145.00/cycle (subscribe: $123.25).</li>
    </ul>
  </section>

  <section>
    <h2>Design Principles</h2>
    <ul>
      <li>Standardized actives at clinically relevant levels with full transparency.</li>
      <li>Defined cadence: daily protocols plus a monthly 7-day cycle.</li>
      <li>Third-party tested, cGMP manufactured, no proprietary blends.</li>
      <li>Shipping is always included in the price.</li>
    </ul>
  </section>

  <p>*These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/shop": {
    title: "Shop All Products | Age Revive",
    description:
      "Browse the complete Age Revive product line: CELLUNAD+ for NAD+ optimization, CELLUBIOME for gut–mitochondria support, and CELLUNOVA for 7-day cellular cleanup.",
    html: `
<article>
  <h1>Shop — Age Revive</h1>
  ${NAV_LINKS}
  <ul>
    ${PRODUCTS.map((p) => `<li><a href="/product/${p.slug}">${p.name} — ${p.category}</a>: ${p.tagline}</li>`).join("\n    ")}
  </ul>
  ${FOOTER_HTML}
</article>`,
  },
  "/science": {
    title: "Science & Research | Age Revive",
    description:
      "The scientific rationale behind every Age Revive formula. Evidence-based ingredients at clinically studied doses.",
    html: `
<article>
  <h1>The Protocol Behind Age Revive — Science and Research</h1>
  ${NAV_LINKS}
  <p>Every ingredient is chosen for its mechanistic evidence, not marketing trends. Transparent doses, clear intent, and no proprietary blends.</p>

  <section>
    <h2>Protocol Architecture: Three Layers, One System</h2>
    <ul>
      <li><strong>CELLUNAD+ (Foundation)</strong> — Daily NAD+ backbone. 500 mg Nicotinamide Riboside (NR) plus methylation co-factors (Betaine/TMG, 5-MTHF, Methylcobalamin, P-5-P) and Apigenin for NAD+ pathway activity.</li>
      <li><strong>CELLUBIOME (Signal Stability)</strong> — Gut-mitochondria axis. Urolithin A (500 mg) supports mitophagy signaling; Tributyrin (500 mg) delivers butyrate for gut barrier support. Enteric-coated for targeted release.</li>
      <li><strong>CELLUNOVA (Controlled Reset)</strong> — 7-day monthly cycle. Polyphenol stack (Resveratrol, Quercetin, EGCG) plus NAC, Fisetin, Spermidine, PQQ, and Astaxanthin to support autophagy and cellular cleanup pathways.</li>
    </ul>
  </section>

  <section>
    <h2>Our Formulation Standards</h2>
    <ul>
      <li><strong>Dose:</strong> Every active ingredient at clinically studied levels.</li>
      <li><strong>Delivery:</strong> Format designed for bioavailability (enteric protection where needed).</li>
      <li><strong>Mechanism:</strong> Clear biological rationale for every ingredient.</li>
      <li><strong>Transparency:</strong> Full label disclosure, no proprietary blends.</li>
      <li><strong>Testing:</strong> Third-party identity and potency verification.</li>
    </ul>
  </section>

  <section>
    <h2>Evidence and Dosing: CELLUNAD+</h2>
    <ul>
      <li>Nicotinamide Riboside (NR) 500 mg — NAD+ precursor, human trials show increase in NAD+ metabolites</li>
      <li>Betaine (TMG) 250 mg — Methyl donor supporting methylation during NAD+ metabolism</li>
      <li>R-Lipoic Acid 200 mg — Supports mitochondrial function and redox balance</li>
      <li>Apigenin 100 mg — Supports NAD+ pathway activity (CD38 modulation research)</li>
      <li>P-5-P (active B6) 10 mg — Active form B6 for methylation co-factor support</li>
      <li>5-MTHF 400 mcg DFE — Active folate for methylation support</li>
      <li>Methylcobalamin 1,000 mcg — Active B12 for methylation pathways</li>
      <li>BioPerine 5 mg — Black pepper extract for absorption support</li>
    </ul>
  </section>

  <section>
    <h2>Evidence and Dosing: CELLUBIOME</h2>
    <ul>
      <li>Urolithin A 500 mg — Studied for biomarkers of mitochondrial health and mitophagy support</li>
      <li>Tributyrin 500 mg — Butyrate precursor for gut barrier and short-chain fatty acid activity</li>
    </ul>
  </section>

  <section>
    <h2>Evidence and Dosing: CELLUNOVA</h2>
    <ul>
      <li>NAC 600 mg — Glutathione precursor for oxidative stress defense</li>
      <li>Trans-Resveratrol 500 mg — Polyphenol supporting sirtuin and autophagy pathways</li>
      <li>Quercetin 500 mg — Flavonoid studied in senescence research</li>
      <li>Calcium Alpha-Ketoglutarate 300 mg — TCA cycle intermediate in longevity research</li>
      <li>Green Tea Extract (50% EGCG) 300 mg — Polyphenol supporting cellular maintenance</li>
      <li>Fisetin 100 mg — Flavonoid studied in senolytic research</li>
      <li>Spermidine (wheat germ) 15 mg — Polyamine studied in autophagy induction</li>
      <li>PQQ 10 mg — Supports mitochondrial biogenesis signaling</li>
      <li>Astaxanthin 4 mg — Carotenoid for oxidative stress support</li>
      <li>BioPerine 5 mg — Black pepper extract for absorption support</li>
    </ul>
  </section>

  <section>
    <h2>Glossary</h2>
    <dl>
      <dt>NAD+</dt><dd>Nicotinamide adenine dinucleotide. A coenzyme in cellular energy metabolism and maintenance.</dd>
      <dt>Mitophagy</dt><dd>Cellular process for recycling damaged mitochondria.</dd>
      <dt>Autophagy</dt><dd>Cellular recycling of damaged components via lysosomal pathways.</dd>
      <dt>Cellular senescence</dt><dd>A state where cells stop dividing and alter signaling output.</dd>
      <dt>Enteric protection</dt><dd>Capsule coating that resists stomach acid for targeted intestinal release.</dd>
    </dl>
  </section>

  <p>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/quality": {
    title: "Quality & Standards | Age Revive",
    description:
      "Third-party tested, cGMP manufactured, no proprietary blends. Full label disclosure on every product.",
    html: `
<article>
  <h1>Quality You Can Verify — Age Revive</h1>
  ${NAV_LINKS}
  <p>Credibility comes from discipline: transparent dosing, identity and potency verification, contaminant screening, lot traceability, and documentation that matches what is on the label.</p>

  <section>
    <h2>What Quality Should Mean in Practice</h2>
    <ul>
      <li><strong>Identity and potency:</strong> Verifying ingredients are what they claim to be and at labeled doses.</li>
      <li><strong>Contaminant screening:</strong> Reducing avoidable risk through documented heavy metal and microbiological screening.</li>
      <li><strong>Traceability:</strong> Tracing batches from raw material to finished product with lot numbers.</li>
      <li><strong>Delivery integrity:</strong> Ensuring format integrity (e.g., enteric protection for CELLUBIOME).</li>
    </ul>
    <h3>Simple Buyer Audit Checklist</h3>
    <ul>
      <li>Is the full dose disclosed for each core active?</li>
      <li>Is there identity verification for each lot?</li>
      <li>Can you request batch documentation with a lot number?</li>
      <li>Are proprietary blends avoided?</li>
    </ul>
  </section>

  <section>
    <h2>Testing Standards: What We Test and Why</h2>
    <ul>
      <li><strong>Identity:</strong> Confirming ingredient identity matches label claims.</li>
      <li><strong>Potency:</strong> Verifying active ingredient amounts meet labeled doses.</li>
      <li><strong>Heavy metals:</strong> Screening for lead, mercury, arsenic, cadmium.</li>
      <li><strong>Microbiological:</strong> Testing for bacteria, yeast, mold contamination.</li>
      <li><strong>Residual solvents:</strong> Screening for manufacturing process residues.</li>
      <li><strong>Format integrity:</strong> Verifying enteric coatings and capsule performance.</li>
    </ul>
  </section>

  <section>
    <h2>Manufacturing Discipline</h2>
    <p>cGMP manufacturing. Supplier qualification. Batch records and release criteria.</p>
  </section>

  <section>
    <h2>Lot Traceability and Documentation</h2>
    <p>You should not have to trust a vibe. You should be able to reference a lot number and request batch documentation.</p>
    <ol>
      <li>Find the lot number on your bottle.</li>
      <li>Contact support with the product name and lot number.</li>
      <li>Receive batch documentation for your specific lot.</li>
    </ol>
  </section>

  <section>
    <h2>Label Transparency</h2>
    <p>If the dose is hidden, the science cannot be evaluated. No proprietary blends. Every ingredient and dose fully disclosed.</p>
    <p>Core actives disclosed: NR 500 mg, Urolithin A 500 mg, Tributyrin 500 mg, Spermidine 15 mg, Fisetin 100 mg, PQQ 10 mg, and all supporting compounds.</p>
  </section>

  <section>
    <h2>Quality Notes by Product</h2>
    <ul>
      <li><strong>CELLUNAD+:</strong> Focus on identity and potency for daily support.</li>
      <li><strong>CELLUBIOME:</strong> Focus on delivery integrity and enteric protection.</li>
      <li><strong>CELLUNOVA:</strong> Focus on allergen disclosure (contains wheat from spermidine source) and batch controls for multi-ingredient protocols.</li>
    </ul>
  </section>

  <section>
    <h2>Quality FAQ</h2>
    <dl>
      <dt>Are your products third-party tested?</dt>
      <dd>Yes. Testing focuses on identity, potency verification, and screening for contaminants.</dd>
      <dt>Can I see a Certificate of Analysis (CoA)?</dt>
      <dd>Yes. Provided upon request with the product name and lot number.</dd>
      <dt>Do you use proprietary blends?</dt>
      <dd>No. Every ingredient and dose is fully disclosed to allow meaningful comparison to research.</dd>
    </dl>
  </section>

  ${FOOTER_HTML}
</article>`,
  },
  "/faq": {
    title: "FAQ | Protocol, Ingredients, Safety, Quality | Age Revive",
    description:
      "Common questions about Age Revive products, ingredients, dosing, safety, and the three-product system.",
    html: `
<article>
  <h1>Frequently Asked Questions — Age Revive</h1>
  ${NAV_LINKS}
  <p>Direct answers about the protocol structure, ingredients, safety, and quality.</p>

  <section>
    <h2>Protocol and Stacking</h2>
    <dl>
      <dt>How do the three products fit together?</dt>
      <dd>Age Revive is designed as a three-layer protocol: CELLUNAD+ is the daily NAD+ foundation, CELLUBIOME supports the gut and mitochondria interface using urolithin A and tributyrin, and CELLUNOVA is a periodic 7-day protocol used as a controlled reset.</dd>
      <dt>Can I take all three together?</dt>
      <dd>Yes. The intended structure is daily CELLUNAD+ plus CELLUBIOME, with CELLUNOVA layered in as a periodic 7-day cycle.</dd>
      <dt>If I start with one product, which one should it be?</dt>
      <dd>Most people start with CELLUNAD+ because NAD+ metabolism is an upstream pathway in cellular energy processes.</dd>
      <dt>How long should I evaluate daily products?</dt>
      <dd>Most people assess meaningful changes after 8 to 12 weeks of consistent daily use.</dd>
      <dt>Is CELLUNOVA taken daily?</dt>
      <dd>No. CELLUNOVA is a 7-day protocol designed to be used periodically, commonly monthly.</dd>
    </dl>
  </section>

  <section>
    <h2>Ingredients and Mechanisms</h2>
    <dl>
      <dt>What is NAD+?</dt>
      <dd>NAD+ (nicotinamide adenine dinucleotide) is a coenzyme involved in cellular energy metabolism and maintenance systems.</dd>
      <dt>What is Nicotinamide Riboside (NR)?</dt>
      <dd>A precursor used by cells to synthesize NAD+. Human trials show NR can increase NAD+ metabolites in blood.</dd>
      <dt>What is mitophagy?</dt>
      <dd>A cellular process involved in recycling damaged mitochondria.</dd>
      <dt>What is urolithin A?</dt>
      <dd>A compound studied for biomarkers of mitochondrial health, mitophagy, and quality control.</dd>
      <dt>What is tributyrin and why not plain butyrate?</dt>
      <dd>Tributyrin is a butyrate precursor designed for better stability and downstream activity in gut barrier research.</dd>
      <dt>What is autophagy?</dt>
      <dd>A cellular recycling process that clears damaged components via lysosomal pathways.</dd>
      <dt>What is cellular senescence?</dt>
      <dd>A state where cells stop dividing and alter signaling output.</dd>
      <dt>Why include methylation support in CELLUNAD+ (TMG, 5-MTHF, methylcobalamin, P-5-P)?</dt>
      <dd>NAD+ metabolism intersects with methylation; these co-factors keep the pathway balanced during daily use.</dd>
      <dt>Why is CELLUBIOME enteric-protected?</dt>
      <dd>To protect contents from stomach acid and support targeted release further into the gut.</dd>
      <dt>What are quercetin and fisetin doing in CELLUNOVA?</dt>
      <dd>Compounds discussed in senescence research, positioned here as part of a periodic protocol.</dd>
    </dl>
  </section>

  <section>
    <h2>Safety and Suitability</h2>
    <dl>
      <dt>Who should consult a clinician before using these products?</dt>
      <dd>If you are pregnant, nursing, managing a medical condition, or taking medication.</dd>
      <dt>Does CELLUNOVA contain allergens?</dt>
      <dd>Yes, it contains wheat (spermidine source).</dd>
      <dt>Are there side effects?</dt>
      <dd>Some experience digestive sensitivity. Discontinue use if you feel unwell.</dd>
    </dl>
  </section>

  <section>
    <h2>Quality and Testing</h2>
    <dl>
      <dt>Are your products third-party tested?</dt>
      <dd>Yes, focused on identity, potency verification, and screening for contaminants.</dd>
      <dt>Can I see batch documentation or a CoA?</dt>
      <dd>Provided upon request with the product name and lot number.</dd>
      <dt>Do you use proprietary blends?</dt>
      <dd>No. We avoid them to allow meaningful comparison to research.</dd>
      <dt>Where can I learn the mechanisms and evidence behind ingredients?</dt>
      <dd>Start with the <a href="/science">Science page</a>.</dd>
    </dl>
  </section>

  <section>
    <h2>Orders and Support</h2>
    <dl>
      <dt>Where do I find shipping rates and delivery estimates?</dt>
      <dd>Shipping is always included in the price. Estimates are shown at checkout.</dd>
      <dt>Where do I find return or refund details?</dt>
      <dd>Provided in store policy and during checkout.</dd>
      <dt>How do I contact support?</dt>
      <dd>Via the Contact page (include your order number).</dd>
    </dl>
  </section>

  <p>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/privacy": {
    title: "Privacy Policy | Age Revive",
    description:
      "Privacy Policy for Age Revive. Learn what data we collect, how we use it, how cookies work, and how to request access or deletion.",
    html: `
<article>
  <h1>Privacy Policy — Age Revive</h1>
  ${NAV_LINKS}
  <p>A clear summary of what we collect, why we collect it, and how you can control it.</p>
  <h2>Summary</h2><p>We collect the minimum data needed to operate the store, support customers, prevent fraud, and improve the site.</p>
  <h2>Data we collect</h2><p>Account data, order data, support data, device and usage data, payment data.</p>
  <h2>How we use data</h2><p>Fulfill orders, process payments, improve site performance, send transactional emails.</p>
  <h2>Your rights</h2><p>Depending on your location, you may have rights to access, correct, delete, or export personal information.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/terms": {
    title: "Terms of Service | Age Revive",
    description:
      "Terms of Service for Age Revive. Review eligibility, orders, billing, shipping, disclaimers, and limitations of liability.",
    html: `
<article>
  <h1>Terms of Service — Age Revive</h1>
  ${NAV_LINKS}
  <p>The rules of using our website and purchasing products.</p>
  <h2>Overview</h2><p>These Terms of Service govern your access to and use of the Age Revive website.</p>
  <h2>Orders and billing</h2><p>Prices and availability may change without notice.</p>
  <h2>Disclaimers</h2><p>Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/shipping": {
    title: "Shipping | Age Revive",
    description:
      "Shipping information for Age Revive. Shipping is always included in the price. Learn how tracking works and what to do if an order is delayed or damaged.",
    html: `
<article>
  <h1>Shipping — Age Revive</h1>
  ${NAV_LINKS}
  <p>Shipping is always included in the price. No surprise fees at checkout.</p>
  <h2>Rates and taxes</h2><p>Shipping is included in every order at no additional cost. Applicable taxes are calculated at checkout based on your location.</p>
  <h2>Tracking</h2><p>Tracking is provided when available from the carrier or fulfillment provider.</p>
  <h2>Lost, damaged, or delayed</h2><p>Contact support with your order number and tracking information.</p>
  ${FOOTER_HTML}
</article>`,
  },
};

function getProductPage(slug: string): { title: string; description: string; html: string } | null {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    title: `${product.name} — ${product.category} | Age Revive`,
    description: `${product.tagline} ${product.description}`,
    html: `
<article>
  <h1>${product.name} — ${product.category}</h1>
  ${NAV_LINKS}
  ${productToHtml(product)}
  <p>${product.description}</p>

  <h2>Other Products</h2>
  <ul>
    ${PRODUCTS.filter((p) => p.slug !== slug)
      .map((p) => `<li><a href="/product/${p.slug}">${p.name} — ${p.category}</a></li>`)
      .join("\n    ")}
  </ul>
  ${FOOTER_HTML}
</article>`,
  };
}

export function getPageContent(routePath: string): { title: string; description: string; html: string } | null {
  if (PAGE_CONTENT[routePath]) return PAGE_CONTENT[routePath];

  const productMatch = routePath.match(/^\/product\/([a-z]+)$/);
  if (productMatch) return getProductPage(productMatch[1]);

  const productsMatch = routePath.match(/^\/products\/([a-z]+)$/);
  if (productsMatch) return getProductPage(productsMatch[1]);

  return null;
}

export function injectContent(html: string, routePath: string): string {
  const page = getPageContent(routePath);
  if (!page) return html;

  let result = html;

  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );

  result = result.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.description}" />`
  );

  result = result.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${page.title}" />`
  );

  result = result.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${page.description}" />`
  );

  result = result.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="https://agerevive.com${routePath}" />`
  );

  result = result.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="https://agerevive.com${routePath}" />`
  );

  result = result.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n<div id="prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${page.html}</div>`
  );

  return result;
}

export const ALL_ROUTES = [
  "/",
  "/shop",
  "/product/cellunad",
  "/product/cellubiome",
  "/product/cellunova",
  "/products/cellunad",
  "/products/cellubiome",
  "/products/cellunova",
  "/science",
  "/quality",
  "/faq",
  "/privacy",
  "/terms",
  "/shipping",
];
