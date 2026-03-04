import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { Loader2, CheckCircle2 } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useCart } from '../cartStore';

interface OrderItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  isSubscribe: boolean;
  frequency: string;
}

interface SessionData {
  status: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  orderId?: string;
  items?: OrderItem[];
  metadata: Record<string, string>;
}

export default function OrderConfirmed() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get('session_id');
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState('');
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/checkout/session/${sessionId}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to verify order');
        return res.json();
      })
      .then((data: SessionData) => {
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  return (
    <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#131d2e]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-ar-teal" />
            <p className="text-[14px] text-white/55">Verifying your order...</p>
          </div>
        ) : error ? (
          <>
            <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/35 mb-3">Order Status</p>
            <h1 className="text-[30px] font-head font-normal uppercase tracking-[-0.03em] text-white mb-4" data-testid="order-confirmed-title">
              Something went wrong
            </h1>
            <p className="text-[14px] text-white/55 leading-relaxed mb-8" data-testid="order-error-body">
              We could not verify your order. If you were charged, please contact support@agerevive.com with your email address.
            </p>
            <Link href="/shop" className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors min-h-[48px] flex items-center justify-center" data-testid="order-confirmed-continue">
              Return to Shop
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-5">
              <CheckCircle2 size={48} className="text-ar-teal" />
            </div>
            <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/35 mb-3">Order Status</p>
            <h1 className="text-[30px] font-head font-normal uppercase tracking-[-0.03em] text-white mb-4" data-testid="order-confirmed-title">
              Order Confirmed
            </h1>
            <p className="text-[14px] text-white/55 leading-relaxed mb-6" data-testid="order-confirmed-body">
              Your order has been received and payment has been processed successfully.
            </p>

            {session && (
              <div className="mb-8 text-left">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4">
                  {session.items && session.items.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/30">Items</p>
                      {session.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between" data-testid={`order-item-${idx}`}>
                          <div>
                            <p className="text-[13px] font-head font-normal uppercase text-white">{item.name}</p>
                            <p className="text-[11px] text-white/35">{item.frequency} &middot; Qty {item.quantity}</p>
                          </div>
                          <span className="text-[13px] font-sans font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="h-px bg-white/[0.06]" />

                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-white/40">Total</span>
                    <span className="text-[15px] font-sans font-semibold text-white" data-testid="order-total">
                      ${session.amountTotal.toFixed(2)} {(session.currency || 'usd').toUpperCase()}
                    </span>
                  </div>

                  {session.customerEmail && (
                    <>
                      <div className="h-px bg-white/[0.06]" />
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-white/40">Confirmation email</span>
                        <span className="text-[13px] text-white/70">{session.customerEmail}</span>
                      </div>
                    </>
                  )}

                  {session.metadata?.shipping_first_name && (
                    <>
                      <div className="h-px bg-white/[0.06]" />
                      <div>
                        <p className="text-[12px] text-white/40 mb-1">Shipping to</p>
                        <p className="text-[13px] text-white/70">
                          {session.metadata.shipping_first_name} {session.metadata.shipping_last_name}
                        </p>
                        <p className="text-[13px] text-white/50">
                          {session.metadata.shipping_address}, {session.metadata.shipping_city}, {session.metadata.shipping_state} {session.metadata.shipping_zip}
                        </p>
                      </div>
                    </>
                  )}

                  {session.orderId && (
                    <>
                      <div className="h-px bg-white/[0.06]" />
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-white/40">Order ID</span>
                        <span className="text-[11px] font-mono text-white/35">{session.orderId.slice(0, 8)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {!session && (
              <p className="text-[14px] text-white/55 leading-relaxed mb-8">
                We will email your confirmation details shortly.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Link href="/shop" className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors min-h-[48px] flex items-center justify-center" data-testid="order-confirmed-continue">
                Continue Shopping
              </Link>
              <Link href="/" className="text-[13px] font-sans text-white/55 hover:text-white transition-colors" data-testid="order-confirmed-home">
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
