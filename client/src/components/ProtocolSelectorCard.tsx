import { Link } from "wouter";
import { ArrowRight, Plus, Check } from "lucide-react";
import { BrandName } from "../productsData";

function hexToRgba(hex: string, a = 1) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length !== 6) return `rgba(0,0,0,${a})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

interface ProductCardProps {
  p: {
    slug: string;
    name: string;
    category: string;
    tagline: string;
    benefit?: string;
    outcomes?: string[];
    serving: string;
    supply?: string;
    color: string;
    image: string;
    ingredients: string[];
  };
}

export default function ProtocolSelectorCard({ p }: ProductCardProps) {
  const accent = p.color;

  return (
    <div
      className="group relative flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
      data-testid={`card-protocol-${p.slug}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(300px 300px at 50% 30%, ${hexToRgba(accent, 0.12)}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-center px-4 pt-4 pb-2">
          <img
            src={p.image}
            alt={p.name}
            className="w-[70%] h-auto max-h-[220px] object-contain group-hover:scale-105 transition-transform duration-500"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
          />
        </div>

        <div className="px-5 pb-5 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-[12px] font-mono uppercase tracking-[0.14em] text-white/35 mb-1">{p.category}</p>
            <h4 className="font-head font-normal text-lg tracking-[-0.02em] uppercase text-white leading-tight">
              <BrandName name={p.name} />
            </h4>
          </div>

          {p.benefit && (
            <p className="text-sm text-white/55 font-medium leading-snug">{p.benefit}</p>
          )}

          {p.outcomes && p.outcomes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.outcomes.map((o) => (
                <span key={o} className="flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.08em] text-white/50">
                  <Check size={12} className="text-ar-teal shrink-0" />
                  {o}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 text-[12px] font-mono text-white/35 uppercase tracking-[0.1em]">
            <span>{p.serving}</span>
            {p.supply && (
              <>
                <span className="w-px h-3 bg-white/15" />
                <span>{p.supply}</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-3">
            <Link
              to={`/product/${p.slug}`}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.14em] transition-all duration-300"
              style={{ backgroundColor: hexToRgba(accent, 0.15), color: accent }}
              data-testid={`button-view-protocol-${p.slug}`}
            >
              View Protocol <ArrowRight size={14} />
            </Link>

            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] text-white/60 font-mono font-bold uppercase text-[12px] tracking-[0.14em] hover:bg-white/[0.06] hover:text-white/80 transition-all duration-300"
              data-testid={`button-add-stack-${p.slug}`}
            >
              <Plus size={14} /> Add to Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
