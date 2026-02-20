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
      className="group relative flex flex-col items-center bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 focus:outline-none p-6 pb-5"
      aria-label={`View ${p.name}`}
      data-testid={`card-protocol-${p.slug}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(300px 300px at 50% 80%, ${hexToRgba(p.color, 0.18)}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-[180px] h-[220px] flex items-center justify-center mb-5">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/35 mb-1">{p.category}</p>
        <h4 className="font-sans font-extrabold text-lg tracking-[-0.02em] uppercase text-white leading-tight text-center mb-3">{p.name}</h4>

        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {p.ingredients.map((ing) => (
            <span
              key={ing}
              className="text-[8px] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
              style={{ color: p.color, background: hexToRgba(p.color, 0.12) }}
            >
              {ing}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between w-full pt-2 border-t border-white/[0.06]">
          <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-white/30">{p.serving}</span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300" style={{ color: p.color }}>
            View <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
