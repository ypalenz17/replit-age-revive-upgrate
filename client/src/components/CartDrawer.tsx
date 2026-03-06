import { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '../cartStore';
import { PRODUCTS } from '../productsData';

export default function CartDrawer() {
  const cart = useCart();
  const [, navigate] = useLocation();
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    if (cart.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cart.isOpen]);

  if (!cart.isOpen) return null;

  const crossSells = PRODUCTS.filter(
    (p) => !cart.items.some((ci) => ci.slug === p.slug)
  ).slice(0, 2);

  const hasOneTimeItems = cart.items.some((i) => !i.isSubscribe);

  return (
    <div className="fixed inset-0 z-[200]" data-testid="cart-drawer-overlay">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={cart.closeCart}
      />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white text-[#0A1220] flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
          <h2 className="text-[17px] font-sans font-semibold tracking-tight" data-testid="cart-title">Your Cart ({cart.totalItems})</h2>
          <button
            onClick={cart.closeCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            data-testid="cart-close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
              <p className="text-[16px] font-sans font-medium text-black/60 mb-2">Your cart is empty</p>
              <p className="text-[13px] text-black/40 mb-6">Add a product to get started.</p>
              <a
                href="/shop"
                onClick={cart.closeCart}
                className="px-6 py-3 bg-[#19B3A6] text-white rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:brightness-110 transition-all"
                data-testid="cart-shop-link"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div>
              <div className="divide-y divide-black/[0.04]">
                {cart.items.map((item) => (
                  <div key={`${item.slug}-${item.isSubscribe}`} className="px-5 py-4" data-testid={`cart-item-${item.slug}`}>
                    <div className="flex gap-3.5">
                      <div className="w-14 h-14 shrink-0 rounded-lg bg-[#F4F1EA] flex items-center justify-center p-1.5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-sans font-semibold text-[14px] leading-tight" data-testid={`cart-item-name-${item.slug}`}>{item.name}</p>
                            <p className="text-[11px] text-black/40 mt-0.5">{item.frequency}</p>
                          </div>
                          <span className="text-[14px] font-sans font-semibold shrink-0" data-testid={`cart-item-price-${item.slug}`}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center border border-black/[0.08] rounded-full overflow-hidden">
                            <button
                              onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                              data-testid={`cart-qty-minus-${item.slug}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center font-mono font-bold text-[12px]" data-testid={`cart-qty-value-${item.slug}`}>{item.quantity}</span>
                            <button
                              onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                              data-testid={`cart-qty-plus-${item.slug}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            onClick={() => cart.removeItem(item.slug, item.isSubscribe)}
                            className="p-2 text-black/25 hover:text-red-500 transition-colors"
                            data-testid={`cart-remove-${item.slug}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasOneTimeItems && (
                <div className="mx-5 mb-3 px-4 py-3 rounded-lg flex items-center justify-between" style={{ background: '#F0FDFA', border: '1px solid rgba(25,179,166,0.15)' }} data-testid="subscription-upgrade-prompt">
                  <span className="text-[12px] font-sans text-[#0A1220]/70">Save 15% with a subscription</span>
                  <button
                    className="text-[11px] font-mono font-bold text-[#19B3A6] uppercase tracking-[0.08em] hover:underline"
                    data-testid="button-upgrade-subscribe"
                  >
                    Upgrade
                  </button>
                </div>
              )}

              <div className="px-5 pb-3">
                {!promoOpen ? (
                  <button
                    onClick={() => setPromoOpen(true)}
                    className="text-[12px] font-sans text-black/35 hover:text-black/55 transition-colors"
                    data-testid="button-promo-toggle"
                  >
                    Have a promo code?
                  </button>
                ) : (
                  <div className="flex gap-2" data-testid="promo-section">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-black/[0.08] rounded-lg text-[13px] font-sans placeholder:text-black/25 focus:outline-none focus:border-black/20 transition-colors"
                      data-testid="promo-input"
                    />
                    <button
                      onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
                      className="px-4 py-2 bg-[#0A1220] text-white rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.08em]"
                      data-testid="promo-apply"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoApplied && (
                  <p className="mt-1.5 text-[11px] text-black/35">Code will be applied at checkout.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-black/[0.06] px-5 py-4 bg-white" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[13px] font-sans font-medium text-black/50">Total</span>
              <span className="text-[20px] font-sans font-bold tracking-tight" data-testid="cart-total">${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                cart.closeCart();
                navigate('/checkout');
              }}
              className="w-full py-3.5 bg-[#19B3A6] text-white rounded-lg font-mono text-[12px] font-bold uppercase tracking-[0.10em] hover:brightness-110 transition-all flex items-center justify-center gap-2 min-h-[52px]"
              data-testid="cart-checkout"
            >
              Checkout — ${cart.totalPrice.toFixed(2)}
            </button>
            <p className="text-[11px] text-center text-black/30 mt-2.5" data-testid="cart-trust-cue">Secure checkout · Free US shipping · 30-day guarantee</p>
          </div>
        )}

        {cart.items.length > 0 && crossSells.length > 0 && (
          <div className="border-t border-black/[0.04] px-5 py-4 bg-[#FAFAF8]" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
            <p className="text-[12px] font-sans font-medium text-black/40 mb-3">Complete your protocol</p>
            <div className="flex gap-2.5">
              {crossSells.map((p) => (
                <a
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  onClick={cart.closeCart}
                  className="flex-1 flex items-center gap-2.5 px-3 py-2.5 border border-black/[0.06] rounded-lg hover:border-black/[0.12] transition-colors bg-white"
                  data-testid={`cross-sell-${p.slug}`}
                >
                  <img src={p.image} alt={p.name} className="w-8 h-8 object-contain shrink-0" />
                  <div className="min-w-0">
                    <p className="font-sans font-medium text-[11px] leading-tight truncate">{p.name}</p>
                    <p className="text-[10px] text-black/35">{p.category}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
