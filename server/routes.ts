import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const SITE_CONTENT = `# Age Revive — Systemic Biological Architecture

Protocol-grade cellular support. Three protocols designed as a system: daily NAD+ support, the gut–mito signaling layer, and a 7-day monthly renewal cadence.

## Products

### CELLUNAD+ — NAD+ Optimization
Precision NAD+ support with co-factors, not hype.
- NR (Nicotinamide Riboside) 500 mg
- TMG (Trimethylglycine) 250 mg
- Apigenin 100 mg
Serving: 2 capsules daily

### CELLUBIOME — Mitochondrial + Gut Signaling
The Gut–Mitochondria Axis, simplified.
- Urolithin A 500 mg
- Tributyrin 500 mg
Serving: 2 enteric-coated capsules daily

### CELLUNOVA — 7-Day Autophagy + Protocol Cycle
Seven days on. Designed as a cycle, not forever.
- Fisetin
- Spermidine
- PQQ
Serving: 5 capsules daily for 7 days

## The Age Revive Systems Axis

Three biological layers working together:
1. **Gut–Mito Axis** — Urolithin A and tributyrin support the gut–mitochondria signaling pathway, linking digestive health to cellular energy.
2. **NAD+ Backbone** — NR, TMG, and apigenin provide the daily substrate for cellular repair, energy metabolism, and sirtuin activation.
3. **Autophagy Cadence** — A 7-day monthly cycle of fisetin, spermidine, and PQQ to trigger cellular cleanup and renewal.

## Protocol Design Principles
- **Standardized Actives**: Every ingredient is dosed at clinically relevant levels with full transparency.
- **Defined Cadence**: Daily protocols (CELLUNAD+, CELLUBIOME) plus a monthly 7-day cycle (CELLUNOVA).
- **Quality Controls**: Third-party tested, GMP manufactured, no proprietary blends.

## Science & Transparency
Every ingredient is chosen for its mechanistic evidence, not marketing trends. Age Revive publishes full dosing, sourcing, and rationale for every formula.

---
Brand: Age Revive
Website: https://agerevive.com
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get('/api/site-content', (_req, res) => {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(SITE_CONTENT);
  });

  return httpServer;
}
