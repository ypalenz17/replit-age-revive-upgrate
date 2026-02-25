import { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '../cartStore';
import { PRODUCTS } from '../productsData';

export default function CartDrawer() {
  const cart = useCart();
  const [, navigate] = useLocation();
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

  return (
    <div className="fixed inset-0 z-[200]" data-testid="cart-drawer-overlay">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={cart.closeCart}
      />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white text-[#0b1120] flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <h2 className="text-xl font-head font-normal tracking-tight" data-testid="cart-title">Your Cart</h2>
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
              <p className="text-lg font-head font-normal text-black/60 mb-2">Your cart is empty</p>
              <p className="text-sm text-black/40 mb-6">Add a product to get started.</p>
              <a
                href="/shop"
                onClick={cart.closeCart}
                className="px-6 py-3 bg-ar-teal text-ar-navy rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-colors"
                data-testid="cart-shop-link"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {cart.items.map((item) => (
                <div key={`${item.slug}-${item.isSubscribe}`} className="px-6 py-5" data-testid={`cart-item-${item.slug}`}>
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-black/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-head font-normal text-[15px] tracking-tight leading-tight">{item.name}</p>
                          <p className="text-[12px] text-black/40 mt-0.5">{item.frequency}</p>
                        </div>
                        <span className="text-[15px] font-head font-normal tracking-tight shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-black/10 rounded-full overflow-hidden">
                          <button
                            onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                            data-testid={`cart-qty-minus-${item.slug}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                            data-testid={`cart-qty-plus-${item.slug}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => cart.removeItem(item.slug, item.isSubscribe)}
                          className="p-2 text-black/30 hover:text-red-500 transition-colors"
                          data-testid={`cart-remove-${item.slug}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cart.items.some((i) => !i.isSubscribe) && (
                <div className="px-6 py-4 flex items-center gap-3 bg-black/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-ar-teal/10 flex items-center justify-center">
                    <Tag size={14} className="text-ar-teal" />
                  </div>
                  <span className="text-[13px] text-black/60 flex-1">Save 15% with a subscription</span>
                  <span className="text-[12px] font-mono font-bold text-ar-teal uppercase tracking-wider">Upgrade</span>
                </div>
              )}

              <div className="px-6 py-5">
                <p className="font-head font-normal text-[13px] tracking-tight mb-3">Promo Code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Promo Code"
                    className="flex-1 px-4 py-2.5 border border-black/10 rounded-lg text-sm font-sans placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
                    data-testid="promo-input"
                  />
                  <button
                    onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
                    className="px-5 py-2.5 bg-[#0b1120] text-white rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-[#0b1120]/90 transition-colors"
                    data-testid="promo-apply"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-[12px] text-black/40">Promo codes will be applied at checkout.</p>
                )}
              </div>

              {crossSells.length > 0 && (
                <div className="px-6 py-5">
                  <p className="font-head font-normal text-[14px] tracking-tight mb-4">You Might Also Like:</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {crossSells.map((p) => (
                      <a
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={cart.closeCart}
                        className="shrink-0 w-40 border border-black/5 rounded-xl overflow-hidden hover:border-black/15 transition-colors group"
                        data-testid={`cross-sell-${p.slug}`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-28 object-cover bg-black/5"
                        />
                        <div className="p-3">
                          <p className="font-head font-normal text-[12px] tracking-tight leading-tight group-hover:text-ar-teal transition-colors">{p.name}</p>
                          <p className="text-[10px] text-black/40 mt-1">{p.category}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-black/5 px-6 py-5 space-y-4 bg-white" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="flex justify-between items-baseline">
              <span className="font-head font-normal text-[14px]">Total</span>
              <span className="text-xl font-head font-normal tracking-tighter">${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                cart.closeCart();
                navigate('/checkout');
              }}
              className="w-full py-4 bg-ar-teal text-ar-navy rounded-xl font-mono text-[12px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all flex items-center justify-center gap-2 min-h-[52px]"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}
              data-testid="cart-checkout"
            >
              Checkout <ArrowRight size={14} />
            </button>
            <p className="text-[11px] text-center text-black/35">Free US shipping · 30-day risk-free guarantee</p>
          </div>
        )}
      </div>
    </div>
  );
}
