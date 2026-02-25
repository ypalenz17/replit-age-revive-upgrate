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
  { href: "#eligibility", label: "Eligibility" },
  { href: "#orders", label: "Orders and billing" },
  { href: "#subscriptions", label: "Subscriptions" },
  { href: "#shipping", label: "Shipping" },
  { href: "#returns", label: "Returns and refunds" },
  { href: "#disclaimer", label: "Disclaimers" },
  { href: "#limitation", label: "Limitation of liability" },
  { href: "#ip", label: "Intellectual property" },
  { href: "#governing", label: "Governing law" },
  { href: "#contact", label: "Contact" },
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

export default function TermsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    useLegalSeo({
      path: "/terms",
      title: `Terms of Service | ${LEGAL.brand}`,
      description:
        "Terms of Service for Age Revive. Review eligibility, orders, billing, shipping, disclaimers, and limitations of liability.",
      breadcrumbName: "Terms of Service",
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d30] to-[#131d2e]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-20 text-center">
          <p className="ar-luxury-eyebrow mx-auto">Legal</p>
          <h1 className="mt-5 max-w-4xl mx-auto text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            The rules of using our website and purchasing products. Clear terms reduce confusion and protect both sides.
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
                These Terms of Service govern your access to and use of the {LEGAL.brand} website and your purchase of products through the store.
                By using the site, you agree to these Terms.
              </p>
            </Section>

            <Section id="eligibility" title="Eligibility">
              <p>
                You must be able to form a binding contract in your jurisdiction to use this website and purchase products.
                You agree that any information you provide is accurate and current.
              </p>
            </Section>

            <Section id="orders" title="Orders and billing">
              <p>
                Prices and availability may change without notice. We may cancel or refuse an order for reasons including suspected fraud,
                inventory issues, or errors in product or pricing information.
              </p>
              <p>
                Payment processing is handled by third-party payment processors. We do not store full payment card numbers on our servers.
              </p>
            </Section>

            <Section id="subscriptions" title="Subscriptions">
              <p>
                If subscription options are offered, they will be described on the product page or at checkout, including how to manage, pause, or cancel.
                If subscriptions are not currently offered, this section remains informational.
              </p>
            </Section>

            <Section id="shipping" title="Shipping">
              <p>
                Shipping is included in the price of every product. Applicable taxes and delivery estimates are shown at checkout. For shipping details and common questions, see the Shipping page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/shipping"
                  className="ar-luxury-btn-ghost"
                >
                  View Shipping
                </Link>
              </div>
            </Section>

            <Section id="returns" title="Returns and refunds">
              <p>
                Return and refund terms, when applicable, are presented in store policy information and may be shown at checkout.
                For order-specific questions, contact support with your order number.
              </p>
            </Section>

            <Section id="disclaimer" title="Disclaimers">
              <p>
                Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.
                Content on this site is for informational purposes only and is not medical advice.
              </p>
              <p>
                Individual results vary. Lifestyle factors and baseline biology matter.
              </p>
            </Section>

            <Section id="limitation" title="Limitation of liability">
              <p>
                To the maximum extent permitted by law, {LEGAL.brand} will not be liable for indirect, incidental, special, consequential,
                or punitive damages arising from your use of the website or products.
              </p>
            </Section>

            <Section id="ip" title="Intellectual property">
              <p>
                The website content, trademarks, and design elements are owned by {LEGAL.brand} or its licensors and are protected by applicable laws.
                You may not copy, reproduce, or distribute site content without permission.
              </p>
            </Section>

            <Section id="governing" title="Governing law">
              <p>
                These Terms are governed by applicable laws in the jurisdiction where {LEGAL.brand} operates. If you require the exact jurisdiction text,
                add it here after confirming the correct legal entity and state.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                For questions about these Terms, email{" "}
                <a
                  href={`mailto:${LEGAL.supportEmail}`}
                  className="text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
                >
                  {LEGAL.supportEmail}
                </a>
                .
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href={LEGAL.faqUrl}
                  className="ar-luxury-btn-primary"
                >
                  Read FAQ
                </Link>
                <Link
                  href={LEGAL.scienceUrl}
                  className="ar-luxury-btn-ghost"
                >
                  Read Science
                </Link>
              </div>
            </Section>

            <div className="mt-12 ar-luxury-card ar-luxury-card-glow p-5 sm:p-7 md:p-10 text-center">
              <p className="ar-luxury-eyebrow mx-auto text-[10px]">Support</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">Need help?</h3>
              <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-white/60">
                Contact support at{" "}
                <a
                  href={`mailto:${LEGAL.supportEmail}`}
                  className="text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
                >
                  {LEGAL.supportEmail}
                </a>
                .
              </p>
            </div>

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
