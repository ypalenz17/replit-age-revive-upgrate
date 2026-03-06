import { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '../cartStore';
import { PRODUCTS } from '../productsData';
import { PRODUCT_DETAIL_DATA } from '../productData';
import { apiRequest } from '../lib/queryClient';

export default function CartDrawer() {
  const cart = useCart();
  const [, navigate] = useLocation();
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [promoMessage, setPromoMessage] = useState('');

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

  const handleUpgradeAll = () => {
    cart.items.forEach((item) => {
      if (!item.isSubscribe) {
        const detailData = PRODUCT_DETAIL_DATA[item.slug as keyof typeof PRODUCT_DETAIL_DATA];
        if (detailData && detailData.priceSubscribe) {
          const qty = item.quantity;
          cart.removeItem(item.slug, false);
          cart.addItem({
            slug: item.slug,
            name: item.name,
            image: item.image,
            price: detailData.priceSubscribe,
            isSubscribe: true,
            frequency: 'Delivered monthly',
          }, qty, true);
        }
      }
    });
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) return;
    setPromoStatus('validating');
    try {
      const res = await apiRequest('POST', '/api/discount/validate', { code, cartTotal: cart.totalPrice });
      const data = await res.json();
      if (data.valid) {
        setPromoStatus('valid');
        setPromoMessage(`${data.code} applied — ${data.description || 'discount active'}`);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ar_promo_code', code);
        }
      } else {
        setPromoStatus('invalid');
        setPromoMessage(data.reason === 'expired' ? 'This code has expired.' : data.reason === 'minimum_not_met' ? `Minimum spend not met.` : 'Invalid promo code.');
      }
    } catch {
      setPromoStatus('invalid');
      setPromoMessage('Could not validate code.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200]" data-testid="cart-drawer-overlay">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cart.closeCart} />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white text-[#0A1220] flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06]">
          <h2 className="text-[16px] font-sans font-semibold tracking-tight" data-testid="cart-title">Cart ({cart.totalItems})</h2>
          <button
            onClick={cart.closeCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            data-testid="cart-close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
              <p className="text-[15px] font-sans font-medium text-black/60 mb-1.5">Your cart is empty</p>
              <p className="text-[13px] text-black/35 mb-5">Add a product to get started.</p>
              <a
                href="/shop"
                onClick={cart.closeCart}
                className="px-6 py-3 bg-[#19B3A6] text-white rounded-lg text-[12px] font-sans font-semibold uppercase tracking-wide hover:brightness-110 transition-all"
                data-testid="cart-shop-link"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <div key={`${item.slug}-${item.isSubscribe}`} className="px-5 py-3.5 border-b border-black/[0.04]" data-testid={`cart-item-${item.slug}`}>
                  <div className="flex gap-3">
                    <div className="w-[52px] h-[52px] shrink-0 rounded-lg bg-[#F4F1EA] flex items-center justify-center p-1">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-sans font-semibold text-[13px] leading-tight" data-testid={`cart-item-name-${item.slug}`}>{item.name}</p>
                          <p className="text-[11px] text-black/40 mt-0.5">
                            {item.isSubscribe ? (
                              <span className="text-[#19B3A6]">{item.frequency}</span>
                            ) : (
                              <span>{item.frequency}</span>
                            )}
                          </p>
                        </div>
                        <span className="text-[13px] font-sans font-semibold shrink-0" data-testid={`cart-item-price-${item.slug}`}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-black/[0.08] rounded-full">
                          <button
                            onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                            data-testid={`cart-qty-minus-${item.slug}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-[11px]" data-testid={`cart-qty-value-${item.slug}`}>{item.quantity}</span>
                          <button
                            onClick={() => cart.updateQuantity(item.slug, item.isSubscribe, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                            data-testid={`cart-qty-plus-${item.slug}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => cart.removeItem(item.slug, item.isSubscribe)}
                          className="p-1.5 text-black/20 hover:text-red-500 transition-colors"
                          data-testid={`cart-remove-${item.slug}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasOneTimeItems && (
                <button
                  onClick={handleUpgradeAll}
                  className="w-full px-5 py-2.5 flex items-center justify-between border-b border-black/[0.04] hover:bg-[#F0FDFA]/50 transition-colors"
                  data-testid="subscription-upgrade-prompt"
                >
                  <span className="text-[12px] font-sans text-[#0A1220]/60">Subscribe & save 15%</span>
                  <span className="text-[11px] font-sans font-semibold text-[#19B3A6] uppercase tracking-wide">Upgrade</span>
                </button>
              )}

              <div className="px-5 py-2.5 border-b border-black/[0.04]">
                {!promoOpen ? (
                  <button
                    onClick={() => setPromoOpen(true)}
                    className="text-[11px] font-sans text-black/30 hover:text-black/50 transition-colors"
                    data-testid="button-promo-toggle"
                  >
                    Have a promo code?
                  </button>
                ) : (
                  <div data-testid="promo-section">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); if (promoStatus !== 'idle') { setPromoStatus('idle'); setPromoMessage(''); } }}
                        placeholder="Promo code"
                        className="flex-1 px-3 py-2 border border-black/[0.08] rounded-lg text-[12px] font-sans placeholder:text-black/20 focus:outline-none focus:border-black/15 transition-colors"
                        data-testid="promo-input"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoStatus === 'validating'}
                        className="px-3.5 py-2 bg-[#0A1220] text-white rounded-lg text-[10px] font-sans font-bold uppercase tracking-wide disabled:opacity-50"
                        data-testid="promo-apply"
                      >
                        {promoStatus === 'validating' ? '...' : 'Apply'}
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`mt-1.5 text-[10px] ${promoStatus === 'valid' ? 'text-[#19B3A6]' : 'text-red-500'}`} data-testid="promo-message">{promoMessage}</p>
                    )}
                  </div>
                )}
              </div>

              {crossSells.length > 0 && (
                <div className="px-5 py-3 border-b border-black/[0.04]">
                  <p className="text-[11px] font-sans text-black/30 mb-2">Complete your protocol</p>
                  <div className="flex gap-2">
                    {crossSells.map((p) => (
                      <a
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={cart.closeCart}
                        className="flex-1 flex items-center gap-2 px-2.5 py-2 border border-black/[0.05] rounded-lg hover:border-black/[0.10] transition-colors"
                        data-testid={`cross-sell-${p.slug}`}
                      >
                        <img src={p.image} alt={p.name} className="w-7 h-7 object-contain shrink-0" />
                        <div className="min-w-0">
                          <p className="font-sans font-medium text-[10px] leading-tight truncate">{p.name}</p>
                          <p className="text-[9px] text-black/30">${p.price}</p>
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
          <div className="border-t border-black/[0.08] px-5 pt-3 bg-white" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[12px] font-sans text-black/40">Total</span>
              <span className="text-[18px] font-sans font-bold tracking-tight" data-testid="cart-total">${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                cart.closeCart();
                navigate('/checkout');
              }}
              className="w-full py-3.5 bg-[#19B3A6] text-white rounded-lg text-[13px] font-sans font-bold uppercase tracking-wide hover:brightness-110 transition-all flex items-center justify-center min-h-[50px]"
              data-testid="cart-checkout"
            >
              Checkout — ${cart.totalPrice.toFixed(2)}
            </button>
            <div className="flex gap-2 mt-2" data-testid="cart-express-pay">
              <button
                onClick={() => { cart.closeCart(); navigate('/checkout'); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white rounded-lg text-[11px] font-sans font-medium min-h-[36px]"
                data-testid="cart-express-apple"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Pay
              </button>
              <button
                onClick={() => { cart.closeCart(); navigate('/checkout'); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-black/[0.08] rounded-lg text-[11px] font-sans font-medium min-h-[36px]"
                data-testid="cart-express-google"
              >
                <svg width="12" height="12" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Pay
              </button>
            </div>
            <p className="text-[10px] text-center text-black/25 mt-2" data-testid="cart-trust-cue">Secure checkout · Free shipping · 30-day guarantee</p>
          </div>
        )}
      </div>
    </div>
  );
}
