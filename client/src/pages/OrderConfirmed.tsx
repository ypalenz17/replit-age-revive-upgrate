import { Link } from 'wouter';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function OrderConfirmed() {
  return (
    <div className="min-h-[100dvh] bg-[#0b1120] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/35 mb-3">Order Status</p>
        <h1 className="text-[30px] font-head font-normal uppercase tracking-[-0.03em] text-white mb-4" data-testid="order-confirmed-title">
          Order Confirmed
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed mb-8" data-testid="order-confirmed-body">
          Your order has been received. We will email your confirmation details shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/shop" className="w-full py-3.5 bg-ar-teal text-[#0b1120] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors min-h-[48px] flex items-center justify-center" data-testid="order-confirmed-continue">
            Continue Shopping
          </Link>
          <Link href="/" className="text-[13px] font-sans text-white/55 hover:text-white transition-colors" data-testid="order-confirmed-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
