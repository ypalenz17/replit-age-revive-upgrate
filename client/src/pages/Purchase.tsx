import { useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Plus, Minus, RotateCcw, ShoppingBag, ChevronDown, Diamond } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { PRODUCT_DETAIL_DATA, PRODUCT_IMAGES } from '../productData';
import { PRODUCTS } from '../productsData';
import { useCart } from '../cartStore';

export default function Purchase() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const data = PRODUCT_DETAIL_DATA[slug as keyof typeof PRODUCT_DETAIL_DATA];
  if (!data) {
    navigate('/shop');
    return null;
  }

  const images = PRODUCT_IMAGES[slug as keyof typeof PRODUCT_IMAGES] || PRODUCT_IMAGES.cellunad;
  const productInfo = PRODUCTS.find((p) => p.slug === slug);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== slug);

  const monthlyPrice = data.priceOneTime;
  const threeMonthFull = Math.round(monthlyPrice * 3 * 100) / 100;
  const threeMonthDiscounted = Math.round(threeMonthFull * 0.9 * 100) / 100;
  const savings = Math.round((threeMonthFull - threeMonthDiscounted) * 100) / 100;
  const yearlySavings = Math.round(savings * 4 * 100) / 100;

  const displayPrice = upgraded ? threeMonthDiscounted : monthlyPrice;
  const total = Math.round(displayPrice * quantity * 100) / 100;
  const discountAmount = upgraded ? Math.round(savings * quantity * 100) / 100 : 0;

  const handleAddToCart = () => {
    cart.addItem({
      slug: slug!,
      name: data.name,
      image: productInfo?.image || images[0],
      price: displayPrice,
      isSubscribe: true,
      frequency: upgraded ? 'Every 3 months' : 'Delivered monthly',
    }, quantity);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/product/${slug}`)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.10] text-white/60 hover:text-white transition-colors"
              data-testid="purchase-cart-icon"
            >
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-ar-teal text-[#0b1120] text-[10px] font-bold rounded-full flex items-center justify-center">{quantity}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-5 pb-52">
        <h1 className="font-sans font-light tracking-[-0.02em] text-white/90 pt-6 pb-6" style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)' }} data-testid="cart-title">Your Cart</h1>

        <div className="pb-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <img
                src={productInfo?.image || images[0]}
                alt={data.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[15px] font-head font-normal uppercase tracking-[-0.02em] text-white" data-testid="purchase-product-name">{data.name}</h2>
                  <p className="text-[12px] text-white/40 mt-1 font-sans">
                    {upgraded ? '90-day supply' : '30-day supply'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[15px] font-sans font-semibold text-white" data-testid="display-price">${displayPrice.toFixed(2)}</span>
                  {upgraded && (
                    <span className="block text-[12px] text-white/30 line-through font-sans" data-testid="original-price">${threeMonthFull.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {upgraded && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 border border-ar-teal/30 rounded-full">
                  <Diamond size={12} className="text-ar-teal" />
                  <span className="text-[11px] font-sans font-semibold text-ar-teal" data-testid="savings-badge">${savings.toFixed(2)} savings</span>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center border border-white/[0.10] rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    data-testid="qty-minus"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-[13px] font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    data-testid="qty-plus"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!upgraded ? (
          <div className="-mx-5 px-5 py-4 bg-ar-teal/[0.06] border-y border-ar-teal/[0.12]">
            <div className="flex items-center gap-3">
              <RotateCcw size={18} className="text-ar-teal shrink-0" />
              <span className="text-[14px] font-sans font-semibold text-white flex-1">Save 10% on 3 Month Delivery</span>
              <button
                onClick={() => setUpgraded(true)}
                className="text-[14px] font-sans font-bold text-white underline underline-offset-4 decoration-2 hover:text-ar-teal hover:decoration-ar-teal transition-colors"
                data-testid="upgrade-plan"
              >
                Upgrade
              </button>
            </div>
          </div>
        ) : (
          <div className="-mx-5 px-5 py-5 border-y border-white/[0.06]">
            <button
              onClick={() => setUpgraded(false)}
              className="w-full flex items-center justify-between"
              data-testid="downgrade-plan"
            >
              <span className="text-[15px] font-sans font-light text-white/90 tracking-[-0.01em]">3 Month Delivery</span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-white/[0.04] border-white/[0.10]">
                  <RotateCcw size={13} className="text-white/40" />
                  <span className="text-[12px] font-sans font-medium text-white/40">10% off</span>
                </span>
                <ChevronDown size={16} className="text-white/30" />
              </div>
            </button>

            <div className="mt-4 py-2.5 rounded-lg bg-ar-teal/[0.07] text-center">
              <span className="text-[13px] font-sans font-semibold text-ar-teal" data-testid="yearly-savings">${yearlySavings.toFixed(2)} savings per year</span>
            </div>
          </div>
        )}

        <div className="py-6 border-b border-white/[0.06]">
          <p className="text-[14px] font-sans font-medium text-white mb-3">Promo Code</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Promo Code"
              className="flex-1 px-4 py-3 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[13px] font-sans text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
              data-testid="promo-input"
            />
            <button
              onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
              className="px-5 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg text-[13px] font-sans font-semibold transition-colors border border-white/[0.10]"
              data-testid="promo-apply"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className="text-[11px] text-ar-teal font-mono uppercase tracking-[0.08em] mt-2">Promo code applied</p>
          )}
        </div>

        <div className="py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 font-bold mb-4">You Might Also Like</p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {otherProducts.map((p) => {
              const pData = PRODUCT_DETAIL_DATA[p.slug as keyof typeof PRODUCT_DETAIL_DATA];
              const pImages = PRODUCT_IMAGES[p.slug as keyof typeof PRODUCT_IMAGES];
              return (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="shrink-0 w-36 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-colors"
                  data-testid={`suggest-${p.slug}`}
                >
                  <div className="aspect-square bg-white/[0.03] flex items-center justify-center p-3">
                    <img src={pImages ? pImages[0] : p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-head font-normal uppercase tracking-[-0.01em] text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-white/35 font-sans mt-0.5">{pData ? `$${pData.priceOneTime.toFixed(2)}` : ''}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b1120]/95 backdrop-blur-md border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-4 space-y-3">
          {upgraded && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-sans text-white/50">Discounts</span>
              <span className="text-[13px] font-sans font-medium text-ar-teal" data-testid="discount-amount">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-sans font-semibold text-white">Total</span>
            <span className="text-[20px] font-sans font-semibold text-white" data-testid="total-price">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 py-3.5 bg-white text-[#0b1120] rounded-full text-[13px] font-sans font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors min-h-[48px]"
              data-testid="apple-pay"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0b1120]"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Pay
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-ar-teal text-[#0b1120] rounded-full text-[13px] font-sans font-semibold flex items-center justify-center gap-2 hover:bg-ar-teal/90 transition-colors min-h-[48px]"
              data-testid="checkout"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
