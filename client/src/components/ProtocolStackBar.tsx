import { useEffect, useMemo, useRef, useState } from "react";
import type { ProtocolConfig, ProductKey, StackItem } from "../protocolStack/protocolStackConfig";

type Props = {
  config: ProtocolConfig;
  showAfterPx?: number;
  onAddItems?: (selected: StackItem[]) => Promise<void> | void;
};

function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function ProtocolStackBar({ config, showAfterPx = 520, onAddItems }: Props) {
  const { base, items, sections } = config;

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string>("Protocol Stack");

  const [selected, setSelected] = useState<Record<ProductKey, boolean>>(() => {
    const init = { cellunad: false, cellubiome: false, cellunova: false } as Record<ProductKey, boolean>;
    for (const it of items) init[it.key] = it.key === base;
    return init;
  });

  useEffect(() => {
    setSelected((prev) => ({
      ...prev,
      [base]: true,
    }));
  }, [base]);

  const selectedItems = useMemo(() => items.filter((it) => selected[it.key]), [items, selected]);
  const hasAddOns = useMemo(() => selectedItems.some((it) => it.key !== base), [selectedItems, base]);
  const subtotal = useMemo(() => selectedItems.reduce((sum, it) => sum + it.price, 0), [selectedItems]);
  const total = hasAddOns ? +(subtotal * 0.9).toFixed(2) : subtotal;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y >= showAfterPx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfterPx]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current?.disconnect();

    const els: HTMLElement[] = [];
    for (const s of sections) {
      const el = document.getElementById(s.id) as HTMLElement | null;
      if (el) els.push(el);
    }
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (!vis.length) return;

        const top = vis[0].target as HTMLElement;
        const match = sections.find((s) => s.id === top.id);
        if (match) setActiveLabel(match.label);
      },
      { root: null, rootMargin: "-35% 0px -55% 0px", threshold: [0.12, 0.25, 0.4, 0.6] }
    );

    for (const el of els) obs.observe(el);
    observerRef.current = obs;
    return () => obs.disconnect();
  }, [sections]);

  const toggle = (key: ProductKey) => {
    if (key === base) return;
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addStack = async () => {
    if (onAddItems) {
      await onAddItems(selectedItems);
      return;
    }
  };

  if (!visible) return null;

  return (
    <div className="ar-protocolbar fixed left-0 right-0 bottom-0 z-[60]" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} role="region" aria-label="Protocol stack quick add" data-testid="protocol-stack-bar">
      <div className="mx-auto max-w-[1100px] px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 shrink">
            <div className="text-[9px] sm:text-[10px] tracking-[0.18em] text-[rgba(244,241,234,0.35)] uppercase font-mono leading-none">
              Protocol Stack
            </div>
            <div className="truncate text-[11px] sm:text-[12px] tracking-[0.06em] text-[rgba(112,239,220,0.80)] uppercase font-mono leading-none mt-1">
              {activeLabel}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="ar-protocolbar__ghostbtn" aria-expanded={expanded} data-testid="button-toggle-details">
              {expanded ? "Hide" : "Details"}
            </button>

            <div className="text-right">
              <div className="text-[9px] sm:text-[10px] text-[rgba(244,241,234,0.35)] font-mono leading-none">Total</div>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                {hasAddOns && (
                  <span className="text-[10px] text-[rgba(244,241,234,0.25)] font-mono line-through">{formatMoney(subtotal)}</span>
                )}
                <span className="text-[14px] text-[rgba(244,241,234,0.90)] font-semibold font-mono">{formatMoney(total)}</span>
              </div>
            </div>

            <button type="button" onClick={addStack} className="ar-protocolbar__cta" data-testid="button-add-stack">
              Add stack
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 grid gap-2">
            {items.map((it) => {
              const isOn = !!selected[it.key];
              const locked = it.key === base;
              return (
                <div key={it.key} className="ar-protocolbar__row flex items-center justify-between gap-3" data-testid={`stack-row-${it.key}`}>
                  <button
                    type="button"
                    onClick={() => toggle(it.key)}
                    className={`ar-protocolbar__toggle ${isOn ? "is-on" : ""} ${locked ? "is-locked" : ""}`}
                    aria-pressed={isOn}
                    data-testid={`toggle-${it.key}`}
                  >
                    <span className="ar-protocolbar__check" aria-hidden="true">✓</span>
                    <span className="ar-protocolbar__name">
                      {it.name}
                      <span className="ar-protocolbar__badge">{it.badge}</span>
                      {locked ? <span className="ar-protocolbar__base">Base</span> : null}
                    </span>
                  </button>

                  <div className="text-[13px] text-[rgba(244,241,234,0.85)] font-mono">{formatMoney(it.price)}</div>
                </div>
              );
            })}

            <div className="mt-1 text-[11px] font-mono" style={{ color: hasAddOns ? 'rgba(112,239,220,0.85)' : 'rgba(244,241,234,0.55)' }}>
              {hasAddOns
                ? `10% stack discount applied. You save ${formatMoney(subtotal - total)}.`
                : "Add a product to unlock 10% stack discount."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
