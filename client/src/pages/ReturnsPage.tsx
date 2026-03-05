import { useEffect } from "react";
import Footer from "../components/Footer";
import SiteNavbar from "../components/SiteNavbar";
import { LEGAL, useLegalSeo } from "../legal/legalUtils";
import "../styles/luxury-pages.css";

const LAST_UPDATED = "2026-03-04";

const TOC = [
  { href: "#overview", label: "Overview" },
  { href: "#eligibility", label: "Eligibility" },
  { href: "#process", label: "How to return" },
  { href: "#refunds", label: "Refund timeline" },
  { href: "#subscriptions", label: "Subscriptions" },
  { href: "#exchanges", label: "Exchanges" },
  { href: "#damaged", label: "Damaged or incorrect items" },
  { href: "#contact", label: "Contact us" },
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

export default function ReturnsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    useLegalSeo({
      path: "/returns",
      title: `Returns and Refund Policy | ${LEGAL.brand}`,
      description:
        "Returns and refund policy for Age Revive. Learn about eligibility windows, how to start a return, refund timelines, and subscription cancellations.",
      breadcrumbName: "Returns",
      lastUpdated: LAST_UPDATED,
    });
  }, []);

  return (
    <div className="ar-luxury-page min-h-screen text-white">
      <SiteNavbar />

      <header className="ar-luxury-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#152538] to-[#131d2e]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-20 text-center">
          <p className="ar-luxury-eyebrow mx-auto">Returns and Refunds</p>
          <h1 className="mt-5 max-w-4xl mx-auto text-4xl font-semibold leading-tight tracking-tight md:text-6xl" data-testid="returns-title">
            Returns and Refund Policy
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            We want you to be completely satisfied with your purchase. If something is not right, we are here to help.
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

          <div className="min-w-0">
            <details className="lg:hidden ar-luxury-card rounded-xl p-4 mb-8 group">
              <summary className="cursor-pointer list-none flex items-center justify-between ar-luxury-eyebrow text-[10px]">
                On this page
                <span className="text-white/40 text-xs group-open:rotate-180 transition-transform">&#9662;</span>
              </summary>
              <nav className="mt-3 space-y-1 border-t border-white/[0.06] pt-3">
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
            </details>

            <Section id="overview" title="Overview">
              <p>
                {LEGAL.brand} offers a 30-day satisfaction guarantee on all unopened products purchased directly from our website.
                If you are not satisfied with your purchase, you may request a return within 30 days of delivery.
              </p>
              <p>
                Shipping is always included in the price, and we cover return shipping for items that arrive damaged or incorrect.
                For all other returns, return shipping is the responsibility of the customer.
              </p>
            </Section>

            <Section id="eligibility" title="Eligibility">
              <p>To be eligible for a return, items must meet the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>The return request must be made within 30 days of delivery</li>
                <li>Products must be in their original, unopened packaging</li>
                <li>Products must be unused and in the same condition you received them</li>
                <li>You must have your order confirmation or proof of purchase</li>
              </ul>
              <p className="mt-4">
                Items that have been opened, partially used, or are outside the 30-day window are not eligible for a return.
                Promotional, clearance, or gift items may have different return conditions, which will be noted at the time of purchase.
              </p>
            </Section>

            <Section id="process" title="How to return">
              <p>To start a return, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-3 mt-3">
                <li>
                  <strong className="text-white/80">Contact us</strong> -- Email{" "}
                  <a href={`mailto:${LEGAL.supportEmail}`} className="text-teal-300 hover:text-teal-200 transition-colors">
                    {LEGAL.supportEmail}
                  </a>{" "}
                  with your order number and reason for the return. We will respond within 1-2 business days.
                </li>
                <li>
                  <strong className="text-white/80">Receive your return label</strong> -- Once approved, we will provide return shipping instructions and a return authorization number.
                </li>
                <li>
                  <strong className="text-white/80">Ship the item</strong> -- Pack the product securely in its original packaging and ship it using the method provided. We recommend using a trackable shipping method.
                </li>
                <li>
                  <strong className="text-white/80">Confirmation</strong> -- Once we receive and inspect the returned item, we will notify you by email whether your refund has been approved.
                </li>
              </ol>
            </Section>

            <Section id="refunds" title="Refund timeline">
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item
                and whether the refund has been approved.
              </p>
              <p>If approved, your refund will be processed as follows:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Refunds are issued to the original payment method used at checkout</li>
                <li>Please allow 5-10 business days for the refund to appear on your statement</li>
                <li>Depending on your bank or credit card company, it may take an additional billing cycle for the credit to appear</li>
              </ul>
              <p className="mt-4">
                If you have not received your refund after 10 business days, please check with your bank first, then contact us at{" "}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-teal-300 hover:text-teal-200 transition-colors">
                  {LEGAL.supportEmail}
                </a>.
              </p>
            </Section>

            <Section id="subscriptions" title="Subscriptions">
              <p>
                Subscription orders can be cancelled at any time before the next billing date. Once a subscription payment has been processed, it is treated as a regular order and is subject to the standard return policy.
              </p>
              <p>To cancel a subscription:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Log in to your account and manage your subscription from the account page</li>
                <li>
                  Or email{" "}
                  <a href={`mailto:${LEGAL.supportEmail}`} className="text-teal-300 hover:text-teal-200 transition-colors">
                    {LEGAL.supportEmail}
                  </a>{" "}
                  with your order number and we will cancel it for you
                </li>
              </ul>
              <p className="mt-4">
                No cancellation fees apply. You will continue to have access to any already-shipped products.
              </p>
            </Section>

            <Section id="exchanges" title="Exchanges">
              <p>
                We do not offer direct exchanges at this time. If you would like a different product, please return the original item
                for a refund and place a new order.
              </p>
            </Section>

            <Section id="damaged" title="Damaged or incorrect items">
              <p>
                If your order arrives damaged, defective, or you received the wrong item, please contact us within 7 days of delivery at{" "}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-teal-300 hover:text-teal-200 transition-colors">
                  {LEGAL.supportEmail}
                </a>.
              </p>
              <p>Please include:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your order number</li>
                <li>A description of the issue</li>
                <li>Photos of the damaged or incorrect item (if applicable)</li>
              </ul>
              <p className="mt-4">
                We will arrange a replacement or full refund at no additional cost to you, including return shipping.
              </p>
            </Section>

            <Section id="contact" title="Contact us">
              <div className="ar-luxury-card rounded-xl p-6 mt-4">
                <p className="text-white/80 mb-4">
                  Have questions about a return or refund? We are happy to help.
                </p>
                <p>
                  <strong className="text-white/70">Email:</strong>{" "}
                  <a href={`mailto:${LEGAL.supportEmail}`} className="text-teal-300 hover:text-teal-200 transition-colors">
                    {LEGAL.supportEmail}
                  </a>
                </p>
                <p className="mt-2">
                  <strong className="text-white/70">Response time:</strong>{" "}
                  <span>1-2 business days</span>
                </p>
                <p className="mt-4 text-white/40 text-xs">
                  Please include your order number in all correspondence to help us assist you faster.
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
