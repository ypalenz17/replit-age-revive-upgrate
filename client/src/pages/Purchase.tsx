import { useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { ArrowLeft, ArrowRight, Plus, Minus, Check } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { PRODUCT_DETAIL_DATA, PRODUCT_IMAGES } from '../productData';
import { PRODUCTS } from '../productsData';
import { useCart } from '../cartStore';

export default function Purchase() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const cart = useCart();
  const [isSubscribe, setIsSubscribe] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const data = PRODUCT_DETAIL_DATA[slug as keyof typeof PRODUCT_DETAIL_DATA];
  if (!data) {
    navigate('/shop');
    return null;
  }

  const images = PRODUCT_IMAGES[slug as keyof typeof PRODUCT_IMAGES] || PRODUCT_IMAGES.cellunad;
  const productInfo = PRODUCTS.find((p) => p.slug === slug);
  const currentPrice = isSubscribe ? data.priceSubscribe : data.priceOneTime;

  const handleAddToCart = () => {
    cart.addItem({
      slug,
      name: data.name,
      image: productInfo?.image || images[0],
      price: currentPrice,
      isSubscribe,
      frequency: isSubscribe ? 'Delivered monthly' : 'One-time purchase',
    }, quantity);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/product/${slug}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            data-testid="purchase-back"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-sans">Back</span>
          </button>
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-5 py-8 space-y-8">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.03] shrink-0">
            <img
              src={images[0]}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-head font-normal text-xl tracking-tight uppercase text-white" data-testid="purchase-product-name">
              {data.name}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{data.supplyLabel}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 font-bold">Choose your plan</p>

          <button
            onClick={() => setIsSubscribe(true)}
            className={`w-full p-4 border rounded-xl text-left transition-all flex justify-between items-center gap-3 ${isSubscribe ? 'border-ar-teal bg-ar-teal/[0.08]' : 'border-white/10 hover:border-white/20'}`}
            data-testid="option-subscribe"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSubscribe ? 'border-ar-teal bg-ar-teal' : 'border-white/20'}`}>
                {isSubscribe && <Check size={12} className="text-ar-navy" />}
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white">Subscribe & Save 15%</p>
                <p className="text-xs mt-0.5 text-white/40">Ships monthly. Cancel anytime.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-head font-normal tracking-tight text-white">${data.priceSubscribe.toFixed(2)}</p>
              <p className="text-[10px] text-white/30 line-through">${data.priceOneTime.toFixed(2)}</p>
            </div>
          </button>

          <button
            onClick={() => setIsSubscribe(false)}
            className={`w-full p-4 border rounded-xl text-left transition-all flex justify-between items-center gap-3 ${!isSubscribe ? 'border-ar-teal bg-ar-teal/[0.08]' : 'border-white/10 hover:border-white/20'}`}
            data-testid="option-onetime"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${!isSubscribe ? 'border-ar-teal bg-ar-teal' : 'border-white/20'}`}>
                {!isSubscribe && <Check size={12} className="text-ar-navy" />}
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white">One-Time Purchase</p>
                <p className="text-xs mt-0.5 text-white/40">No commitment.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-head font-normal tracking-tight text-white">${data.priceOneTime.toFixed(2)}</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-white/[0.06]">
          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.10em] text-white/40">Quantity</span>
          <div className="flex items-center gap-5 bg-white/5 px-5 py-2 rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:opacity-70 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center text-white"
              data-testid="qty-minus"
            >
              <Minus size={16} />
            </button>
            <span className="font-mono font-bold text-lg w-5 text-center text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:opacity-70 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center text-white"
              data-testid="qty-plus"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Subtotal</span>
            <span className="text-white font-head tracking-tight">${(currentPrice * quantity).toFixed(2)}</span>
          </div>
          {isSubscribe && (
            <div className="flex justify-between text-sm">
              <span className="text-ar-teal/70">You save</span>
              <span className="text-ar-teal font-head tracking-tight">-${((data.priceOneTime - data.priceSubscribe) * quantity).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06]">
            <span className="text-white font-medium">Total</span>
            <span className="text-white font-head text-xl tracking-tight">${(currentPrice * quantity).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-ar-teal text-ar-navy rounded-xl font-mono text-[12px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all flex items-center justify-center gap-2 min-h-[52px]"
          style={{ boxShadow: '0 0 20px rgba(45,212,191,0.15)' }}
          data-testid="add-to-cart"
        >
          Add to Cart <ArrowRight size={14} />
        </button>

        <p className="text-center text-[12px] text-white/25 font-sans">
          Free US shipping · 30-day risk-free guarantee
        </p>
      </div>
    </div>
  );
}
