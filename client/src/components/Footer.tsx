import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.10]">
      <div className="max-w-4xl mx-auto text-center">
        <img src={brandLogo} alt="AGE REVIVE" className="h-7 w-auto brightness-0 invert mx-auto mb-6 opacity-80" />
        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3 mb-8" aria-label="Footer navigation">
          <a href="/shop" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1" data-testid="footer-link-shop">Shop</a>
          <a href="/product/cellunad" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">CELLUNAD+</a>
          <a href="/product/cellubiome" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">CELLUBIOME</a>
          <a href="/product/cellunova" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">CELLUNOVA</a>
          <a href="/science" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">Science</a>
          <a href="/quality" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">Quality</a>
          <a href="/faq" className="text-[13px] font-mono font-medium text-white/65 uppercase tracking-[0.14em] hover:text-ar-teal transition-colors py-1">FAQ</a>
        </nav>
        <div className="border-t border-white/[0.10] pt-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 text-[13px] font-mono text-white/50 uppercase tracking-[0.14em]">
            <a href="#" className="hover:text-white/70 transition-colors py-1">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors py-1">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors py-1">Shipping</a>
          </div>
          <div className="max-w-lg mx-auto bg-white/[0.04] border border-white/[0.08] rounded-lg px-5 py-3">
            <p className="text-[12px] font-mono text-white/45 uppercase tracking-[0.1em] leading-relaxed">
              © 2026 Age Revive · *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
