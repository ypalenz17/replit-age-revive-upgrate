import imgCellubiome from '@assets/cellubiome_cropped.png';
import imgCellunad from '@assets/cellunad_cropped.png';
import imgCellunova from '@assets/cellunova_cropped.png';

export const PRODUCTS = [
  {
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Gut + Mito Signaling',
    tagline: 'The Gut–Mitochondria Axis, simplified.',
    benefit: 'Daily gut-mito support for steady energy.',
    outcomes: ['Steady energy', 'Gut barrier', 'Mito renewal'],
    serving: '2 enteric-coated capsules daily',
    supply: '30-day supply',
    color: '#19B3A6',
    textColor: '#5eead4',
    image: imgCellubiome,
    ingredients: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
  },
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'NAD+ Optimization',
    tagline: 'Precision NAD+ support with co-factors, not hype.',
    benefit: 'Protocol-grade NAD+ support with key cofactors.',
    outcomes: ['NAD+ support', 'DNA maintenance', 'Cell energy'],
    serving: '2 capsules daily',
    supply: '30-day supply',
    color: '#1e3a8a',
    textColor: '#60a5fa',
    image: imgCellunad,
    ingredients: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Autophagy Pulse',
    tagline: 'Seven days on. Designed as a cycle, not forever.',
    benefit: 'Monthly 7-day pulse to support cellular renewal.',
    outcomes: ['Cell renewal', 'Autophagy support', 'Resilience'],
    serving: '5 capsules daily for 7 days',
    supply: '7-day cycle (monthly)',
    color: '#6C5CE7',
    textColor: '#a78bfa',
    image: imgCellunova,
    ingredients: ['Fisetin', 'Spermidine', 'PQQ'],
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
