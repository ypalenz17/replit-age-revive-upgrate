export type ProductKey = "cellunad" | "cellubiome" | "cellunova";

export type StackItem = {
  key: ProductKey;
  name: string;
  badge: string;
  price: number;
  productId?: string;
};

export type SectionMap = { id: string; label: string };

export type ProtocolConfig = {
  base: ProductKey;
  items: StackItem[];
  sections: SectionMap[];
};

const ITEMS: Record<ProductKey, StackItem> = {
  cellunad:   { key: "cellunad",   name: "CELLUNAD+",   badge: "Daily NAD+",      price: 79.99, productId: "cellunad" },
  cellubiome: { key: "cellubiome", name: "CELLUBIOME",  badge: "Signal Stability", price: 110.00, productId: "cellubiome" },
  cellunova:  { key: "cellunova",  name: "CELLUNOVA",   badge: "Monthly Reset",    price: 145.00, productId: "cellunova" },
};

const SECTIONS: Record<ProductKey, SectionMap[]> = {
  cellunad: [
    { id: "foundation-layer", label: "Foundation Layer" },
    { id: "science", label: "The Science" },
    { id: "results-over-time", label: "Results Over Time" },
    { id: "ingredients", label: "What's Inside" },
    { id: "compare", label: "Compare" },
    { id: "faq", label: "FAQ" },
  ],
  cellubiome: [
    { id: "biological-function", label: "Signal Stability Layer" },
    { id: "science", label: "Gut–Mito Axis" },
    { id: "enteric-delivery", label: "Enteric Delivery" },
    { id: "results-over-time", label: "Results Over Time" },
    { id: "ingredients", label: "What's Inside" },
    { id: "compare", label: "Compare" },
    { id: "faq", label: "FAQ" },
  ],
  cellunova: [
    { id: "controlled-reset", label: "Controlled Reset" },
    { id: "science", label: "The Science" },
    { id: "results-over-time", label: "Results Over Time" },
    { id: "ingredients", label: "What's Inside" },
    { id: "compare", label: "Compare" },
    { id: "faq", label: "FAQ" },
  ],
};

export function getProductKeyFromSlug(slug: string): ProductKey | null {
  const s = (slug || "").toLowerCase();
  if (s.includes("cellunad")) return "cellunad";
  if (s.includes("cellubiome")) return "cellubiome";
  if (s.includes("cellunova")) return "cellunova";
  return null;
}

export function getProtocolConfig(productKey: ProductKey): ProtocolConfig {
  const base = productKey;
  const items: StackItem[] = [
    ITEMS[base],
    ...(["cellunad", "cellubiome", "cellunova"] as ProductKey[]).filter((k) => k !== base).map((k) => ITEMS[k]),
  ];

  return { base, items, sections: SECTIONS[productKey] };
}
