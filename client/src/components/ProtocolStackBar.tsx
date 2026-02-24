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
  const total = useMemo(() => selectedItems.reduce((sum, it) => sum + it.price, 0), [selectedItems]);

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
    <div className="ar-protocolbar fixed left-0 right-0 bottom-0 z-[60]" role="region" aria-label="Protocol stack quick add" data-testid="protocol-stack-bar">
      <div className="mx-auto max-w-[1100px] px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.26em] text-[rgba(244,241,234,0.70)] uppercase font-mono">
              Protocol Stack
            </div>
            <div className="truncate text-[13px] tracking-[0.12em] text-[rgba(112,239,220,0.95)] uppercase font-mono">
              {activeLabel}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="ar-protocolbar__ghostbtn" aria-expanded={expanded} data-testid="button-toggle-details">
              {expanded ? "Hide" : "View"} details
            </button>

            <div className="text-right">
              <div className="text-[11px] text-[rgba(244,241,234,0.65)] font-mono">Total</div>
              <div className="text-[16px] text-[rgba(244,241,234,0.95)] font-semibold font-mono">{formatMoney(total)}</div>
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

            <div className="mt-1 text-[11px] text-[rgba(244,241,234,0.55)] font-mono">
              Base includes {items.find((i) => i.key === base)?.name}. Add-ons optional.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
