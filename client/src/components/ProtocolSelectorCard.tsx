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
    <div className="flex flex-col items-center" data-testid={`card-protocol-${p.slug}`}>

      <div className="relative mb-4 sm:mb-5">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] blur-3xl opacity-50 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${hexToRgba(accent, 0.5)}, transparent 65%)` }}
        />
        <img
          src={p.image}
          alt={p.name}
          className="relative z-10 w-[168px] sm:w-[196px] max-w-[85vw] h-auto object-contain"
          style={{ filter: `drop-shadow(0 16px 32px ${hexToRgba(accent, 0.35)}) drop-shadow(0 6px 12px rgba(0,0,0,0.5))` }}
        />
      </div>

      <div className="group relative w-full rounded-2xl border border-white/[0.10] hover:border-white/[0.20] overflow-hidden transition-all duration-500 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] group-hover:from-white/[0.12] group-hover:via-white/[0.06] group-hover:to-white/[0.03] transition-all duration-500" />
        <div className="absolute inset-0 backdrop-blur-xl" />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(300px 300px at 50% 15%, ${hexToRgba(accent, 0.10)}, transparent 70%)` }}
        />

        <div className="relative z-10 pt-5 sm:pt-6 px-5 pb-5 flex flex-col gap-3">

          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/60 mb-1.5">{p.category}</p>
            <h4 className="font-head font-normal text-2xl tracking-[-0.03em] uppercase text-white leading-none">
              <BrandName name={p.name} />
            </h4>
          </div>

          {p.benefit && (
            <p className="text-[15px] sm:text-base text-white/75 font-medium leading-snug">{p.benefit}</p>
          )}

          {p.outcomes && p.outcomes.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {p.outcomes.map((o) => (
                <span key={o} className="flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.06em] text-white/70">
                  <Check size={12} className="shrink-0" style={{ color: accent }} />
                  {o}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.08] pt-3 mt-1">
            <div className="grid grid-cols-2 gap-4 text-[12px] font-mono text-white/55 uppercase tracking-[0.08em]">
              <span>{p.serving}</span>
              {p.supply && <span className="text-right">{p.supply}</span>}
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <Link
              to={`/product/${p.slug}`}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-3.5 font-mono font-bold uppercase text-[12px] tracking-[0.12em] transition-all duration-300 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})`,
                color: '#fff',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 12px ${hexToRgba(accent, 0.25)}`,
              }}
              data-testid={`button-view-protocol-${p.slug}`}
            >
              View Protocol <ArrowRight size={13} />
            </Link>

            <button
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-white/[0.12] text-white/65 hover:bg-white/[0.06] hover:text-white/85 hover:border-white/[0.18] transition-all duration-300"
              data-testid={`button-add-stack-${p.slug}`}
              aria-label={`Add ${p.name} to stack`}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
