import imgCellubiome from '@assets/FRONT_RENDER_TRANSPARENT_1771623631843.png';
import imgCellunad from '@assets/CELLUNAD_1771623812381.png';
import imgCellunova from '@assets/CELLUNAD_CELLUNOVA_1771623812382.png';

export const PRODUCTS = [
  {
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Mitochondrial + Gut Signaling',
    tagline: 'The Gut–Mitochondria Axis, simplified.',
    serving: '2 enteric-coated capsules daily',
    color: '#6C5CE7',
    image: imgCellubiome,
    ingredients: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
  },
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'Daily NAD+ Optimization',
    tagline: 'Precision NAD+ support with co-factors, not hype.',
    serving: '2 capsules daily',
    color: '#19B3A6',
    image: imgCellunad,
    ingredients: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Autophagy + Protocol Cycle',
    tagline: 'Seven days on. Designed as a cycle, not forever.',
    serving: '5 capsules daily for 7 days',
    color: '#212535',
    image: imgCellunova,
    ingredients: ['Resveratrol 500 mg', 'Quercetin 500 mg', 'EGCG 300 mg', 'PQQ 10 mg'],
  }
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}
