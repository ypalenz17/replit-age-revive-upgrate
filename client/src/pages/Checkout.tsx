import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronDown, ChevronLeft, Check, Mail } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useCart } from '../cartStore';

type Step = 1 | 2 | 3;

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
  const [step, setStep] = useState<Step>(1);
  const [cartExpanded, setCartExpanded] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [country] = useState('United States of America');
  const [usState, setUsState] = useState('');
  const [zip, setZip] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const totalPrice = cart.totalPrice;
  const itemCount = cart.totalItems;

  if (itemCount === 0) {
    navigate('/shop');
    return null;
  }

  const handleEmailSubmit = () => {
    if (email.trim() && email.includes('@')) {
      setStep(2);
    }
  };

  const handleShippingSubmit = () => {
    if (firstName.trim() && lastName.trim() && address.trim() && city.trim() && usState && zip.trim()) {
      setStep(3);
    }
  };

  const handlePaymentSubmit = () => {
    if (cardNumber.trim() && expiry.trim() && cvc.trim() && nameOnCard.trim()) {
      navigate('/order-confirmed');
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors";
  const labelFloat = "relative";

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/[0.06]">
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

        <div className="px-5 pt-8 pb-32">
          <div className="space-y-8">
            <section data-testid="step-account">
              <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30 mb-2">1 of 3</p>
              {step === 1 ? (
                <>
                  <h2 className="text-[22px] font-sans font-semibold text-white mb-6">Create Your Account</h2>

                  <button
                    className="w-full py-3.5 rounded-lg border border-white/[0.10] bg-white/[0.03] flex items-center justify-center gap-3 hover:bg-white/[0.06] transition-colors"
                    data-testid="google-signin"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[14px] font-sans font-semibold text-white">Continue with Google</span>
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="text-[13px] font-sans text-white/30">or</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>

                  <div className="space-y-4">
                    <div className={labelFloat}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className={inputClass}
                        data-testid="input-email"
                      />
                    </div>
                    <button
                      onClick={handleEmailSubmit}
                      className="w-full py-3.5 bg-ar-teal text-[#0b1120] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors flex items-center justify-center gap-2"
                      data-testid="button-signup-email"
                    >
                      <Mail size={16} />
                      Sign Up with Email
                    </button>
                  </div>

                  <p className="mt-4 text-[13px] font-sans text-white/40">
                    Have an account?{' '}
                    <button className="text-white font-semibold underline underline-offset-2" data-testid="link-signin">Sign in</button>
                  </p>

                  <p className="mt-5 text-[11px] font-sans text-white/25 leading-relaxed">
                    I understand that by creating an account, I agree to receive updates, AGE REVIVE news, and member-only offers. I understand that I can unsubscribe from emails at any time.
                  </p>

                  <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border border-white/20 bg-white/[0.03] accent-ar-teal"
                      data-testid="checkbox-text-optin"
                    />
                    <span className="text-[11px] font-sans text-white/25 leading-relaxed group-hover:text-white/35 transition-colors">
                      I'd also like to receive text updates about orders, promotions, and exclusive offers. Message and data rates may apply. Reply STOP to unsubscribe.
                    </span>
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-sans font-medium text-white/70">Account</h2>
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
              <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30 mb-2">2 of 3</p>
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
                      <label className="absolute -top-2 left-3 px-1 bg-[#0b1120] text-[10px] font-sans text-white/40 z-10">Country</label>
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
                            <option key={s} value={s} className="bg-[#0b1120] text-white">{s}</option>
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
                      onClick={handleShippingSubmit}
                      className="w-full py-3.5 bg-ar-teal text-[#0b1120] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors mt-2"
                      data-testid="button-continue-payment"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              ) : step > 2 ? (
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-sans font-medium text-white/70">Shipping Information</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-sans text-white/40">{firstName} {lastName}, {city}</span>
                    <div className="w-5 h-5 rounded-full bg-ar-teal/20 flex items-center justify-center">
                      <Check size={12} className="text-ar-teal" />
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="text-[18px] font-sans font-light text-white/20">Shipping Information</h2>
              )}
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section data-testid="step-payment">
              <p className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30 mb-2">3 of 3</p>
              {step === 3 ? (
                <>
                  <h2 className="text-[22px] font-sans font-semibold text-white mb-6">Payment</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Name on card*"
                      className={inputClass}
                      data-testid="input-card-name"
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="Card number*"
                      className={inputClass}
                      data-testid="input-card-number"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                          setExpiry(v);
                        }}
                        placeholder="MM/YY*"
                        className={inputClass}
                        data-testid="input-expiry"
                      />
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="CVC*"
                        className={inputClass}
                        data-testid="input-cvc"
                      />
                    </div>

                    <button
                      onClick={handlePaymentSubmit}
                      className="w-full py-3.5 bg-ar-teal text-[#0b1120] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors mt-2"
                      data-testid="button-place-order"
                    >
                      Place Order &middot; ${totalPrice.toFixed(2)}
                    </button>

                    <p className="text-[11px] font-sans text-white/25 leading-relaxed text-center mt-3">
                      Your payment information is encrypted and secure. By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </>
              ) : (
                <h2 className="text-[18px] font-sans font-light text-white/20">Payment</h2>
              )}
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b1120]/95 backdrop-blur-md border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 1) window.history.back();
              else setStep((step - 1) as Step);
            }}
            className="flex items-center gap-1 text-[13px] font-sans text-white/50 hover:text-white transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/30">Step {step} of 3</span>
        </div>
      </div>
    </div>
  );
}
