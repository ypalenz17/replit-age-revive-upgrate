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

      <div className="relative mb-2 sm:mb-3 flex items-center justify-center">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[80%] h-[70%] blur-[40px] opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 60%, ${hexToRgba(accent, 0.5)}, transparent 70%)` }}
        />
        <div
          className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[40%] h-[6px] rounded-[50%] blur-sm opacity-50 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        />
        <img
          src={p.image}
          alt={p.name}
          className="relative z-10 w-[168px] sm:w-[196px] max-w-[85vw] h-auto object-contain"
          style={{ filter: `drop-shadow(0 8px 16px ${hexToRgba(accent, 0.2)}) drop-shadow(0 3px 6px rgba(0,0,0,0.35))` }}
        />
      </div>

      <div className="w-full max-w-[92%] mx-auto relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-[#0d1424]/80 backdrop-blur-lg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] pointer-events-none" />

        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent 10%, ${hexToRgba(accent, 0.4)} 50%, transparent 90%)` }}
        />
        <div className="absolute inset-x-0 top-[1px] h-[40%] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10 px-5 pt-5 pb-5 flex flex-col">

          <p className="text-[10px] font-mono uppercase tracking-[0.14em] mb-1" style={{ color: hexToRgba(accent, 0.7) }}>{p.category}</p>

          <h4 className="font-head font-normal text-[22px] sm:text-2xl tracking-[-0.03em] uppercase text-white leading-none mb-3">
            <BrandName name={p.name} />
          </h4>

          {p.benefit && (
            <p className="text-[14px] sm:text-[15px] font-sans text-white/70 font-medium leading-[1.45] max-w-[28ch] mb-5">{p.benefit}</p>
          )}

          {p.outcomes && p.outcomes.length > 0 && (
            <div className="flex flex-col gap-[6px] mb-4">
              {p.outcomes.slice(0, 3).map((o) => (
                <span key={o} className="flex items-center gap-2 text-[13px] font-sans font-medium text-white/70">
                  <Check size={13} strokeWidth={2.5} className="shrink-0" style={{ color: accent }} />
                  {o}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.06] pt-3 mb-5">
            <div className="grid grid-cols-2 gap-3 text-[11px] font-sans text-white/50 tracking-normal">
              <span>{p.serving}</span>
              {p.supply && <span className="text-right">{p.supply}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to={`/product/${p.slug}`}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-3 font-mono font-bold uppercase text-[11px] tracking-[0.14em] transition-all duration-300 bg-white/[0.07] text-white hover:bg-white/[0.11]"
              style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px ${hexToRgba(accent, 0.18)}, 0 1px 3px rgba(0,0,0,0.2)` }}
              data-testid={`button-view-protocol-${p.slug}`}
            >
              View Protocol <ArrowRight size={13} />
            </Link>

            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-3 font-mono uppercase text-[11px] tracking-[0.14em] font-medium text-white/45 hover:bg-white/[0.04] hover:text-white/65 transition-all duration-300"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              data-testid={`button-add-stack-${p.slug}`}
              aria-label={`Add ${p.name} to stack`}
            >
              <Plus size={13} /> Add to Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
