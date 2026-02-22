import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto text-center">
        <img src={brandLogo} alt="AGE REVIVE" className="h-6 w-auto brightness-0 invert mx-auto mb-5" />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-5" aria-label="Footer navigation">
          <a href="/shop" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">Shop</a>
          <a href="/product/cellunad" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">CELLUNAD+</a>
          <a href="/product/cellubiome" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">CELLUBIOME</a>
          <a href="/product/cellunova" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">CELLUNOVA</a>
          <a href="/science" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">Science</a>
          <a href="/quality" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">Quality</a>
          <a href="/faq" className="text-[12px] font-mono font-medium text-white/40 uppercase tracking-[0.18em] hover:text-ar-teal transition-colors py-1">FAQ</a>
        </nav>
        <div className="border-t border-white/[0.06] pt-4 flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-5 text-[12px] font-mono text-white/20 uppercase tracking-[0.18em]">
            <a href="#" className="hover:text-white/40 transition-colors py-1">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors py-1">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors py-1">Shipping</a>
          </div>
          <p className="text-[12px] font-mono text-white/15 uppercase tracking-[0.14em] max-w-lg leading-relaxed">© 2026 Age Revive · *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </div>
    </footer>
  );
}
