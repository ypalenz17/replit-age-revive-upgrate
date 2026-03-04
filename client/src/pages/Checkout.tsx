import { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'wouter';
import { ChevronDown, ChevronLeft, Check, Mail, Loader2 } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useCart } from '../cartStore';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/queryClient';

type Step = 1 | 2;

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
  'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const cart = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>(isAuthenticated ? 2 : 1);
  const [cartExpanded, setCartExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
      setStep(2);
    }
  }, [isAuthenticated, user]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [country] = useState('United States of America');
  const [usState, setUsState] = useState('');
  const [zip, setZip] = useState('');

  const totalPrice = cart.totalPrice;
  const itemCount = cart.totalItems;

  if (itemCount === 0) {
    return <Redirect to="/shop" />;
  }

  const handleEmailSubmit = () => {
    if (email.trim() && email.includes('@')) {
      setStep(2);
      setError('');
    }
  };

  const handleCheckout = async () => {
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !usState || !zip.trim()) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await apiRequest('POST', '/api/checkout/session', {
        items: cart.items.map((item) => ({
          slug: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isSubscribe: item.isSubscribe,
          frequency: item.frequency,
        })),
        email,
        shipping: {
          firstName,
          lastName,
          address,
          apt,
          city,
          state: usState,
          zip,
          country: 'US',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Unable to start checkout. Please try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors";
  const labelFloat = "relative";

  return (
    <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#131d2e]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setCartExpanded(!cartExpanded)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-ar-teal/[0.06] border-b border-ar-teal/[0.12]"
          data-testid="cart-summary-toggle"
        >
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-sans font-medium text-white">Cart Summary ({itemCount})</span>
            <ChevronDown size={16} className={`text-white/40 transition-transform ${cartExpanded ? 'rotate-180' : ''}`} />
          </div>
          <span className="text-[14px] font-sans font-semibold text-white" data-testid="checkout-total">${totalPrice.toFixed(2)}</span>
        </button>

        {cartExpanded && (
          <div className="px-5 py-4 border-b border-white/[0.06] space-y-3">
            {cart.items.map((item) => (
              <div key={`${item.slug}-${item.isSubscribe}`} className="flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-lg bg-white/[0.03] flex items-center justify-center p-1.5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-head font-normal uppercase text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-white/35 font-sans mt-0.5">{item.frequency} &middot; Qty {item.quantity}</p>
                </div>
                <span className="text-[13px] font-sans font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 pt-8 pb-32" style={{ paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}>
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]" data-testid="checkout-error">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <section data-testid="step-account">
              <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30 mb-2">1 of 2</p>
              {step === 1 ? (
                <>
                  <h2 className="text-[22px] font-sans font-semibold text-white mb-6">Your Email</h2>
                  <div className="space-y-4">
                    <div className={labelFloat}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                        placeholder="Email address"
                        className={inputClass}
                        data-testid="input-email"
                      />
                    </div>
                    <button
                      onClick={handleEmailSubmit}
                      className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors flex items-center justify-center gap-2"
                      data-testid="button-continue-email"
                    >
                      <Mail size={16} />
                      Continue
                    </button>
                  </div>

                  <p className="mt-5 text-[11px] font-sans text-white/25 leading-relaxed">
                    Your order confirmation and tracking details will be sent to this email.
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-sans font-medium text-white/70">Email</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-sans text-white/40">{email}</span>
                    <div className="w-5 h-5 rounded-full bg-ar-teal/20 flex items-center justify-center">
                      <Check size={12} className="text-ar-teal" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section data-testid="step-shipping">
              <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30 mb-2">2 of 2</p>
              {step === 2 ? (
                <>
                  <h2 className="text-[22px] font-sans font-semibold text-white mb-6">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name*"
                        className={inputClass}
                        data-testid="input-first-name"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name*"
                        className={inputClass}
                        data-testid="input-last-name"
                      />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address*"
                      className={inputClass}
                      data-testid="input-address"
                    />
                    <input
                      type="text"
                      value={apt}
                      onChange={(e) => setApt(e.target.value)}
                      placeholder="Apt / Suite / Unit"
                      className={inputClass}
                      data-testid="input-apt"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City*"
                      className={inputClass}
                      data-testid="input-city"
                    />

                    <div className={labelFloat}>
                      <label className="absolute -top-2 left-3 px-1 bg-[#131d2e] text-[10px] font-sans text-white/40 z-10">Country</label>
                      <div className="relative">
                        <select
                          disabled
                          className="w-full appearance-none px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white/60 focus:outline-none"
                          data-testid="select-country"
                        >
                          <option>{country}</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={usState}
                          onChange={(e) => setUsState(e.target.value)}
                          className="w-full appearance-none px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white focus:outline-none focus:border-white/20 transition-colors"
                          data-testid="select-state"
                        >
                          <option value="" disabled className="text-white/25">State*</option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s} className="bg-[#131d2e] text-white">{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="Zip code*"
                        className={inputClass}
                        data-testid="input-zip"
                      />
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      data-testid="button-place-order"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Connecting to payment...
                        </>
                      ) : (
                        <>Continue to Payment &middot; ${totalPrice.toFixed(2)}</>
                      )}
                    </button>

                    <p className="text-[11px] font-sans text-white/25 leading-relaxed text-center mt-3">
                      You will be redirected to Stripe for secure payment processing. Your card details are never stored on our servers.
                    </p>
                  </div>
                </>
              ) : (
                <h2 className="text-[18px] font-sans font-light text-white/20">Shipping Information</h2>
              )}
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#131d2e]/95 backdrop-blur-md border-t border-white/[0.06]" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 1) window.history.back();
              else setStep(1);
            }}
            disabled={isProcessing}
            className="flex items-center gap-1 text-[13px] font-sans text-white/50 hover:text-white transition-colors disabled:opacity-30"
            data-testid="button-back"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30">Step {step} of 2</span>
        </div>
      </div>
    </div>
  );
}
