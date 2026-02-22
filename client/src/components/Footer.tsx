import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function Footer() {
  return (
    <footer className="py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <img src={brandLogo} alt="AGE REVIVE" className="h-6 w-auto brightness-0 invert opacity-70" />
            <div className="flex gap-4">
              <a href="/shop" className="text-[10px] font-mono text-white/50 uppercase tracking-[0.1em] hover:text-white/70 transition-colors" data-testid="footer-link-shop">Shop</a>
              <a href="/science" className="text-[10px] font-mono text-white/50 uppercase tracking-[0.1em] hover:text-white/70 transition-colors">Science</a>
              <a href="/quality" className="text-[10px] font-mono text-white/50 uppercase tracking-[0.1em] hover:text-white/70 transition-colors">Quality</a>
              <a href="/faq" className="text-[10px] font-mono text-white/50 uppercase tracking-[0.1em] hover:text-white/70 transition-colors">FAQ</a>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex gap-4">
              <a href="/product/cellunad" className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] hover:text-white/60 transition-colors">CELLUNAD+</a>
              <a href="/product/cellubiome" className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] hover:text-white/60 transition-colors">CELLUBIOME</a>
              <a href="/product/cellunova" className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] hover:text-white/60 transition-colors">CELLUNOVA</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em] hover:text-white/50 transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em] hover:text-white/50 transition-colors">Terms</a>
              <a href="#" className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em] hover:text-white/50 transition-colors">Shipping</a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.06]">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.06em] leading-relaxed">
            © 2026 Age Revive · *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
