import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto text-center">
        <img src={brandLogo} alt="AGE REVIVE" className="h-6 w-auto brightness-0 invert mx-auto mb-5" />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5">
          <a href="/shop" className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-[0.22em] hover:text-ar-teal transition-colors">Shop</a>
          <a href="/#pillars" className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-[0.22em] hover:text-ar-teal transition-colors">Science</a>
          <a href="/#journal" className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-[0.22em] hover:text-ar-teal transition-colors">Journal</a>
          <a href="#" className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-[0.22em] hover:text-ar-teal transition-colors">Instagram</a>
          <a href="#" className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-[0.22em] hover:text-ar-teal transition-colors">Contact</a>
        </nav>
        <div className="border-t border-white/[0.06] pt-4 flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-5 text-[8px] font-mono text-white/20 uppercase tracking-[0.22em]">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors">Shipping</a>
          </div>
          <p className="text-[7px] font-mono text-white/15 uppercase tracking-[0.18em] max-w-lg leading-relaxed">© 2026 Age Revive · *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </div>
    </footer>
  );
}
