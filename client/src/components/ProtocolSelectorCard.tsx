import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

function hexToRgba(hex: string, a = 1) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length !== 6) return `rgba(0,0,0,${a})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function ProtocolSelectorCard({ p }: { p: { slug: string; name: string; category: string; tagline: string; serving: string; color: string; image: string; ingredients: string[] } }) {
  return (
    <Link
      to={`/products/${p.slug}`}
      className="group relative block bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 focus:outline-none"
      aria-label={`View ${p.name}`}
      data-testid={`card-protocol-${p.slug}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(400px 200px at 80% 100%, ${hexToRgba(p.color, 0.15)}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-center gap-5 p-4 pr-5">
        <div className="shrink-0 w-[72px] h-[88px] flex items-center justify-center">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2.5">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/35 mb-1">{p.category}</p>
            <h4 className="font-sans font-extrabold text-[15px] tracking-[-0.02em] uppercase text-white leading-tight">{p.name}</h4>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {p.ingredients.map((ing) => (
              <span
                key={ing}
                className="text-[8px] font-mono uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                style={{ color: p.color, background: hexToRgba(p.color, 0.12) }}
              >
                {ing}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-white/30">{p.serving}</span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300" style={{ color: p.color }}>
              View <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
