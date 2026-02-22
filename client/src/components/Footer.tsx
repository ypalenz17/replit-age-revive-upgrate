import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function Footer() {
  return (
    <footer className="py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-[0.12em] mb-1">System</span>
            <a href="/shop" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors" data-testid="footer-link-shop">Shop</a>
            <a href="/product/cellunad" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">Cellunad+</a>
            <a href="/product/cellubiome" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">Cellubiome</a>
            <a href="/product/cellunova" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">Cellunova</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-[0.12em] mb-1">Science</span>
            <a href="/science" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">Research</a>
            <a href="/quality" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">Quality</a>
            <a href="/faq" className="text-[11px] font-mono text-white/50 uppercase tracking-[0.06em] hover:text-white/70 transition-colors">FAQ</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-[0.12em] mb-1">Legal</span>
            <a href="#" className="text-[11px] font-mono text-white/40 uppercase tracking-[0.06em] hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="text-[11px] font-mono text-white/40 uppercase tracking-[0.06em] hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-[11px] font-mono text-white/40 uppercase tracking-[0.06em] hover:text-white/60 transition-colors">Shipping</a>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <img src={brandLogo} alt="AGE REVIVE" className="h-4 w-auto brightness-0 invert opacity-40 shrink-0" />
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-[0.04em] leading-relaxed text-right">
            © 2026 Age Revive · *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
