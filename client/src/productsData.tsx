export const PRODUCTS = [
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'Daily NAD+ Foundation',
    tagline: 'Daily NAD+ foundation with 500 mg NR and co-factors.',
    benefit: '500 mg NR with methylation and mitochondrial co-factors.',
    outcomes: ['NAD+ support', 'DNA maintenance', 'Cell energy'],
    serving: '2 capsules daily',
    supply: '30-day supply',
    color: '#1e3a8a',
    textColor: '#60a5fa',
    image: '/images/cellunad-render.png',
    ingredients: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
    price: 79.99,
    subscribePrice: 67.99,
  },
  {
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Daily Gut-Mito Support',
    tagline: 'Daily gut-mito support with urolithin A and enteric tributyrin.',
    benefit: 'Urolithin A plus enteric tributyrin for gut-barrier and mitochondrial support.',
    outcomes: ['Steady energy', 'Gut barrier', 'Mito renewal'],
    serving: '2 enteric-coated capsules daily',
    supply: '30-day supply',
    color: '#19B3A6',
    textColor: '#5eead4',
    image: '/images/cellubiome-render.png',
    ingredients: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
    price: 110.00,
    subscribePrice: 93.50,
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Monthly Protocol',
    tagline: '7-day monthly protocol for autophagy-related support.',
    benefit: 'Periodic support for autophagy-related pathways and mitochondrial resilience.',
    outcomes: ['Cell renewal', 'Autophagy support', 'Resilience'],
    serving: '5 capsules daily · 7-day cycle',
    supply: '7-day monthly cycle',
    color: '#6C5CE7',
    textColor: '#a78bfa',
    image: '/images/cellunova_cropped.png',
    ingredients: ['Fisetin', 'Spermidine', 'PQQ'],
    price: 49.99,
    subscribePrice: 42.49,
  }
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}

export function BrandName({ name, className }: { name: string; className?: string }) {
  const needsR = name === 'CELLUNAD+' || name === 'CELLUBIOME';
  return (
    <span className={className}>
      {name}
      {needsR && <span className="text-[0.45em] opacity-50 relative -top-[0.5em] -ml-[0.05em]">{'\u00AE'}</span>}
    </span>
  );
}
