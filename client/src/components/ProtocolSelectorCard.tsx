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
      className="group relative block p-6 bg-white border border-black/5 rounded-ar-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-ar-teal/40"
      aria-label={`View ${p.name}`}
      data-testid={`card-protocol-${p.slug}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: p.color }} />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(650px 240px at 15% 0%, ${hexToRgba(p.color, 0.18)}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-ar-navy/5 ring-1 ring-black/5">
            <img
              src={p.image}
              alt=""
              className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
              {p.category}
            </p>
            <h4 className="font-bold text-sm tracking-tight uppercase text-ar-navy">
              {p.name}
            </h4>
            <p className="text-[10px] font-mono font-medium text-black/55 leading-tight">
              {p.tagline}
            </p>
          </div>
        </div>

        <ArrowRight
          size={18}
          className="mt-1 text-black/25 group-hover:translate-x-1 transition-transform"
          style={{ color: p.color }}
        />
      </div>

      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {p.ingredients.map((ing) => (
          <span
            key={ing}
            className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full border border-black/10 bg-black/[0.02]"
            style={{ color: p.color }}
          >
            {ing}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">
          {p.serving}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: p.color }}>
          View Protocol
        </span>
      </div>
    </Link>
  );
}
