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

      <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[25%] w-[70%] h-[60%] blur-3xl opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${hexToRgba(accent, 0.35)}, transparent 65%)` }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[8px] rounded-[50%] blur-md opacity-40 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        />
        <img
          src={p.image}
          alt={p.name}
          className="relative z-10 w-[168px] sm:w-[196px] max-w-[85vw] h-auto object-contain"
          style={{ filter: `drop-shadow(0 12px 24px ${hexToRgba(accent, 0.25)}) drop-shadow(0 4px 8px rgba(0,0,0,0.4))` }}
        />
      </div>

      <div className="w-full max-w-[92%] mx-auto relative overflow-hidden rounded-t-3xl border-t border-white/[0.10] bg-gradient-to-b from-white/[0.06] to-white/[0.03]">
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-white/[0.10] to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 py-6 flex flex-col">

          <p className="text-[11px] font-mono uppercase tracking-[0.10em] text-white/55 mb-1.5">{p.category}</p>

          <h4 className="font-head font-normal text-2xl tracking-[-0.03em] uppercase text-white leading-none mb-4">
            <BrandName name={p.name} />
          </h4>

          {p.benefit && (
            <p className="text-[15px] sm:text-base text-white/75 font-medium leading-snug mb-6">{p.benefit}</p>
          )}

          {p.outcomes && p.outcomes.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-5">
              {p.outcomes.map((o) => (
                <span key={o} className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.04em] text-white/75">
                  <Check size={12} className="shrink-0 opacity-90" style={{ color: accent }} />
                  {o}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.06] pt-4 mb-7">
            <div className="grid grid-cols-2 gap-4 text-[12px] font-mono text-white/60 uppercase tracking-[0.04em]">
              <span>{p.serving}</span>
              {p.supply && <span className="text-right">{p.supply}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to={`/product/${p.slug}`}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-3.5 font-mono font-bold uppercase text-[12px] tracking-[0.12em] transition-all duration-300 bg-white/[0.06] border border-white/[0.14] text-white hover:bg-white/[0.10] hover:border-white/[0.20]"
              style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${hexToRgba(accent, 0.15)}` }}
              data-testid={`button-view-protocol-${p.slug}`}
            >
              View Protocol <ArrowRight size={13} />
            </Link>

            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-3 font-mono font-bold uppercase text-[12px] tracking-[0.12em] border border-white/[0.08] text-white/55 hover:bg-white/[0.05] hover:text-white/75 hover:border-white/[0.14] transition-all duration-300"
              data-testid={`button-add-stack-${p.slug}`}
              aria-label={`Add ${p.name} to stack`}
            >
              <Plus size={14} /> Add to Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
