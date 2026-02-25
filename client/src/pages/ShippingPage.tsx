import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import brandLogo from "@assets/AR_brand_logo_1771613250600.png";
import Footer from "../components/Footer";
import { useCart } from "../cartStore";
import { LEGAL, useLegalSeo } from "../legal/legalUtils";
import "../styles/luxury-pages.css";

const LAST_UPDATED = "2026-02-25";

const TOC = [
  { href: "#overview", label: "Overview" },
  { href: "#rates", label: "Rates and taxes" },
  { href: "#processing", label: "Processing time" },
  { href: "#tracking", label: "Tracking" },
  { href: "#address", label: "Address changes" },
  { href: "#issues", label: "Lost, damaged, or delayed" },
  { href: "#international", label: "International" },
  { href: "#shipping-faq", label: "Shipping FAQ" },
];

function Section(props: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={props.id} className="scroll-mt-28 py-12 md:py-16">
      <hr className="ar-luxury-section-divider mb-12 md:mb-16" />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-4xl">{props.title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-white/65 space-y-4">{props.children}</div>
    </section>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Science", href: "/science" },
  { label: "Quality", href: "/quality" },
  { label: "FAQ", href: "/faq" },
];

export default function ShippingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    useLegalSeo({
      path: "/shipping",
      title: `Shipping | ${LEGAL.brand}`,
      description:
        "Shipping information for Age Revive. Shipping is always included in the price. Learn how tracking works and what to do if an order is delayed or damaged.",
      breadcrumbName: "Shipping",
      lastUpdated: LAST_UPDATED,
    });
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="ar-luxury-page min-h-screen text-white">
      <nav className="fixed top-0 left-0 right-0 z-[150] bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10] shadow-[0_1px_12px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert" />
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
            <button onClick={cart.openCart} className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart">
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 pt-16 pb-6 px-6 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.08]">
            <div className="flex flex-col gap-0">
              {navLinks.map((l) =>
                l.label === "Shop" ? (
                  <div key={l.label} className="border-b border-white/[0.05]">
                    <button
                      className="w-full flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white/60 hover:text-teal-300"
                      onClick={() => setShopOpen(!shopOpen)}
                      data-testid="mobile-shop-toggle"
                    >
                      Shop
                      <span className="text-[10px]">{shopOpen ? "\u25B4" : "\u25BE"}</span>
                    </button>
                    {shopOpen && (
                      <div className="pb-3 flex flex-col gap-2 pl-3">
                        <a href="/product/cellunad" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUNAD+</a>
                        <a href="/product/cellubiome" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUBIOME</a>
                        <a href="/product/cellunova" className="text-[12px] font-mono text-white/50 hover:text-teal-300">CELLUNOVA</a>
                        <a href="/shop" className="text-[12px] font-mono text-white/50 hover:text-teal-300">View all</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="py-3 font-mono text-[12px] uppercase tracking-[0.14em] border-b border-white/[0.05] text-white/60 hover:text-teal-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <header className="ar-luxury-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#0b1120]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-20 text-center">
          <p className="ar-luxury-eyebrow mx-auto">Shipping</p>
          <h1 className="mt-5 max-w-4xl mx-auto text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Shipping
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            Shipping is always included in the price. No surprise fees at checkout.
          </p>
          <div className="mt-10 ar-luxury-disclaimer rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <p className="text-xs text-white/40 font-mono tracking-wide">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12 overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[260px,1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 ar-luxury-toc-card rounded-2xl p-5">
              <p className="ar-luxury-eyebrow text-[10px]">On this page</p>
              <nav className="mt-5 space-y-1" aria-label="Table of contents">
                {TOC.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-[13px] text-white/55 hover:bg-white/[0.04] hover:text-white/90 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main>
            <div className="lg:hidden">
              <details className="ar-luxury-accordion rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <summary className="cursor-pointer text-sm font-medium text-white">Jump to section</summary>
                <div className="mt-4 grid gap-1">
                  {TOC.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 text-[13px] text-white/55 hover:bg-white/[0.04] hover:text-white/90 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </details>
            </div>

            <Section id="overview" title="Overview">
              <p>
                Shipping is always included in the price of every Age Revive product. The price you see on the product page is the price you pay at checkout. After purchase, you receive a confirmation email and a tracking email when available.
              </p>
              <div className="ar-luxury-card ar-luxury-card-glow p-4 sm:p-6">
                <p className="text-white/75">
                  Trust note: We do not add shipping fees at checkout. The listed product price includes shipping to your door.
                </p>
              </div>
            </Section>

            <Section id="rates" title="Rates and taxes">
              <p>
                Shipping is included in every order at no additional cost. Applicable taxes are calculated at checkout based on your location. The product price you see already includes shipping.
              </p>
            </Section>

            <Section id="processing" title="Processing time">
              <p>
                Orders are processed before shipment. Processing time can vary based on inventory and order volume.
                If you need an urgent delivery date, use the shipping service options shown at checkout.
              </p>
            </Section>

            <Section id="tracking" title="Tracking">
              <p>
                Tracking is provided when available from the carrier or fulfillment provider. Tracking links are typically emailed after the order ships.
                If you did not receive tracking, check your spam folder and then contact support with your order number.
              </p>
            </Section>

            <Section id="address" title="Address changes">
              <p>
                Contact support as soon as possible if you need to change your shipping address. Address changes depend on whether the order has already been processed.
                Provide your order number and the updated address.
              </p>
            </Section>

            <Section id="issues" title="Lost, damaged, or delayed shipments">
              <ul className="space-y-3">
                <li><span className="text-white/90">Delayed:</span> check tracking first. Carriers may show transit delays.</li>
                <li><span className="text-white/90">Damaged:</span> contact support with photos of the package and product.</li>
                <li><span className="text-white/90">Lost:</span> contact support with your order number and tracking information.</li>
              </ul>
            </Section>

            <Section id="international" title="International">
              <p>
                If international shipping is offered, it will appear as an option at checkout. Import duties, taxes, or customs fees may apply
                depending on destination and are the responsibility of the recipient unless stated otherwise at checkout.
              </p>
            </Section>

            <Section id="shipping-faq" title="Shipping FAQ">
              <div className="grid gap-3">
                {[
                  {
                    q: "Is shipping really free?",
                    a: "Yes. Shipping is included in the price of every product. There are no additional shipping charges at checkout.",
                  },
                  {
                    q: "When do I get tracking?",
                    a: "When the order ships and a tracking number is available, we send a tracking email. Check spam if you do not see it.",
                  },
                  {
                    q: "Can I change my address after ordering?",
                    a: "Possibly, if the order has not been processed. Contact support immediately with your order number.",
                  },
                  {
                    q: "What if my package is damaged?",
                    a: "Contact support with photos of the package and product so we can help resolve the issue.",
                  },
                ].map((f) => (
                  <details key={f.q} className="ar-luxury-accordion rounded-xl sm:rounded-2xl p-4 sm:p-6" data-testid={`faq-shipping-${f.q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}>
                    <summary className="text-base font-semibold text-white/90">{f.q}</summary>
                    <p className="mt-4 text-sm leading-relaxed text-white/60">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-10 ar-luxury-card ar-luxury-card-glow p-5 sm:p-7 md:p-10 text-center">
                <p className="ar-luxury-eyebrow mx-auto text-[10px]">Support</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">Need help?</h3>
                <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-white/60">
                  Contact support with your order number for the fastest resolution.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`mailto:${LEGAL.supportEmail}`}
                    className="ar-luxury-btn-primary"
                  >
                    Email support
                  </a>
                  <Link
                    href={LEGAL.faqUrl}
                    className="ar-luxury-btn-ghost"
                  >
                    Read FAQ
                  </Link>
                </div>
              </div>
            </Section>

            <div className="pb-8 pt-10">
              <p className="text-xs text-white/50">
                These statements have not been evaluated by the FDA. This content is for educational purposes only.
              </p>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
