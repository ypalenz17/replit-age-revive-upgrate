import imgCellubiome from '@assets/FRONT_RENDER_TRANSPARENT_1771623631843.png';
import imgCellunad from '@assets/CELLUNAD_1771623812381.png';
import imgCellunova from '@assets/CELLUNAD_CELLUNOVA_1771623812382.png';

export const PRODUCTS = [
  {
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Mitochondrial + Gut Signaling',
    tagline: 'The Gut–Mitochondria Axis, simplified.',
    benefit: 'Restores gut-mito signaling for sustained energy',
    outcomes: ['Energy output', 'Gut integrity', 'Mito renewal'],
    serving: '2 enteric-coated capsules daily',
    supply: '30-day supply',
    color: '#6C5CE7',
    image: imgCellubiome,
    ingredients: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
  },
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'NAD+ Optimization',
    tagline: 'Precision NAD+ support with co-factors, not hype.',
    benefit: 'Clinically-dosed NAD+ precursor with methylation support',
    outcomes: ['NAD+ levels', 'DNA repair', 'Cell energy'],
    serving: '2 capsules daily',
    supply: '30-day supply',
    color: '#19B3A6',
    image: imgCellunad,
    ingredients: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Autophagy + Protocol Cycle',
    tagline: 'Seven days on. Designed as a cycle, not forever.',
    benefit: 'Monthly autophagy cycle to clear senescent cells',
    outcomes: ['Cell cleanup', 'Autophagy reset', 'Tissue renewal'],
    serving: '5 capsules daily for 7 days',
    supply: '7-day cycle (monthly)',
    color: '#8B5CF6',
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
      {needsR && <sup className="text-[0.55em] opacity-60 ml-[0.05em] align-super">{'\u00AE'}</sup>}
    </span>
  );
}
