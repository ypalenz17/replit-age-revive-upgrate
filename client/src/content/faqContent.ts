export type FAQItem = { q: string; a: string; tags: string[] };

export type FAQCategory = {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
};

export const FAQ_CATEGORIES: FAQCategory[] = [
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

