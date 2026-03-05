import { useState, useEffect } from "react";
import { User, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import brandLogo from "@assets/AR_brand_logo_1771613250600.png";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../cartStore";

export default function SiteNavbar() {
  const { isAuthenticated } = useAuth();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Science", href: "/science" },
    { label: "Quality", href: "/quality" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-[150] transition-all duration-500",
          scrolled
            ? "bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10] shadow-[0_1px_12px_rgba(0,0,0,0.2)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img
              src={brandLogo}
              alt="AGE REVIVE"
              className="h-7 md:h-8 w-auto brightness-0 invert transition-opacity duration-500"
            />
          </a>

          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white/55 hover:text-teal-300 transition-colors"
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={isAuthenticated ? "/account" : "/login"}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors"
              aria-label={isAuthenticated ? "Account" : "Sign In"}
              data-testid="nav-account"
            >
              <User size={18} />
            </a>
            <button
              onClick={cart.openCart}
              className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors"
              aria-label="Cart"
              data-testid="nav-cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">
                {cart.totalItems}
              </span>
            </button>

            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[140] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 pt-16 pb-6 px-6 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.08]">
            <div className="flex flex-col gap-0">
              {navLinks.map((l) =>
                l.label === "Shop" ? (
                  <div key={l.label} className="border-b border-white/[0.05]">
                    <button
                      onClick={() => setShopOpen(!shopOpen)}
                      className="w-full py-3 min-h-[44px] flex items-center justify-between text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors"
                      data-testid="mobile-nav-shop-toggle"
                    >
                      {l.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {shopOpen && (
                      <div className="flex flex-col gap-0 pl-4 pb-2">
                        <a
                          href="/product/cellunad"
                          onClick={() => setMobileOpen(false)}
                          className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors"
                          data-testid="mobile-nav-product-cellunad"
                        >
                          CELLUNAD+
                        </a>
                        <a
                          href="/product/cellubiome"
                          onClick={() => setMobileOpen(false)}
                          className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors"
                          data-testid="mobile-nav-product-cellubiome"
                        >
                          CELLUBIOME
                        </a>
                        <a
                          href="/product/cellunova"
                          onClick={() => setMobileOpen(false)}
                          className="min-h-[40px] flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors"
                          data-testid="mobile-nav-product-cellunova"
                        >
                          CELLUNOVA
                        </a>
                        <a
                          href="/shop"
                          onClick={() => setMobileOpen(false)}
                          className="min-h-[40px] flex items-center text-[12px] font-mono uppercase tracking-[0.10em] text-white/50 hover:text-teal-300 transition-colors italic"
                          data-testid="mobile-nav-shop-viewall"
                        >
                          View All <ArrowRight size={12} className="ml-1.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors border-b border-white/[0.05] last:border-0"
                    data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </a>
                ),
              )}
              <a
                href={isAuthenticated ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-teal-300 hover:text-teal-200 transition-colors border-t border-white/[0.05]"
                data-testid="mobile-nav-account"
              >
                {isAuthenticated ? "Account" : "Sign In"}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
