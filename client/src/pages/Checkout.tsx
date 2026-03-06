import { useState, useEffect } from 'react';
import { Redirect, Link } from 'wouter';
import { ChevronDown, ChevronUp, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../cartStore';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/queryClient';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
  'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

type FieldErrors = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export default function Checkout() {
  const cart = useCart();
  const { user, isAuthenticated } = useAuth();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpressProcessing, setIsExpressProcessing] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [usState, setUsState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const totalPrice = cart.totalPrice;
  const itemCount = cart.totalItems;

  if (itemCount === 0) {
    return <Redirect to="/shop" />;
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email': return (!value.trim() || !value.includes('@')) ? 'Valid email is required' : undefined;
      case 'firstName': return !value.trim() ? 'First name is required' : undefined;
      case 'lastName': return !value.trim() ? 'Last name is required' : undefined;
      case 'address': return !value.trim() ? 'Address is required' : undefined;
      case 'city': return !value.trim() ? 'City is required' : undefined;
      case 'state': return !value ? 'State is required' : undefined;
      case 'zip': return !value.trim() ? 'Zip code is required' : undefined;
      default: return undefined;
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: err }));
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {};
    errors.email = validateField('email', email);
    errors.firstName = validateField('firstName', firstName);
    errors.lastName = validateField('lastName', lastName);
    errors.address = validateField('address', address);
    errors.city = validateField('city', city);
    errors.state = validateField('state', usState);
    errors.zip = validateField('zip', zip);
    setFieldErrors(errors);
    setTouched({ email: true, firstName: true, lastName: true, address: true, city: true, state: true, zip: true });
    return !Object.values(errors).some(Boolean);
  };

  const buildCheckoutPayload = () => ({
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

  const handleCheckout = async () => {
    if (!validateAll()) return;
    setIsProcessing(true);
    setServerError('');

    try {
      const response = await apiRequest('POST', '/api/checkout/session', buildCheckoutPayload());
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setServerError('Unable to start checkout. Please try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setServerError(err?.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleExpressCheckout = async () => {
    if (!email.trim() || !email.includes('@')) {
      setFieldErrors(prev => ({ ...prev, email: 'Enter your email for express checkout' }));
      setTouched(prev => ({ ...prev, email: true }));
      return;
    }

    setIsExpressProcessing(true);
    setServerError('');

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
          firstName: firstName || 'Express',
          lastName: lastName || 'Checkout',
          address: address || 'Collected at payment',
          apt: '',
          city: city || 'N/A',
          state: usState || 'California',
          zip: zip || '00000',
          country: 'US',
        },
        expressCheckout: true,
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setServerError('Express checkout unavailable. Please fill in shipping details below.');
        setIsExpressProcessing(false);
      }
    } catch (err: any) {
      setServerError(err?.message || 'Express checkout failed. Please use the form below.');
      setIsExpressProcessing(false);
    }
  };

  const inputBase = "w-full px-3.5 py-3 border rounded-lg bg-white text-[14px] font-sans text-[#0A1220] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#19B3A6]/30 focus:border-[#19B3A6]/50 transition-all";
  const selectBase = "w-full appearance-none px-3.5 py-3 border rounded-lg bg-white text-[14px] font-sans text-[#0A1220] focus:outline-none focus:ring-2 focus:ring-[#19B3A6]/30 focus:border-[#19B3A6]/50 transition-all";

  const fieldBorder = (name: string) =>
    touched[name] && fieldErrors[name as keyof FieldErrors]
      ? 'border-red-400'
      : 'border-black/[0.10]';

  const InlineError = ({ name }: { name: keyof FieldErrors }) => {
    if (!touched[name] || !fieldErrors[name]) return null;
    return <p className="mt-1 text-[11px] text-red-500" data-testid={`error-${name}`}>{fieldErrors[name]}</p>;
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F6F3] font-sans antialiased">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-1.5 text-[13px] font-sans text-black/40 hover:text-black/60 transition-colors" data-testid="checkout-back-link">
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>
          <span className="text-[14px] font-sans font-semibold text-[#0A1220] tracking-tight" data-testid="checkout-brand">AGE REVIVE</span>
          <div className="flex items-center gap-1 text-[11px] font-sans text-black/30">
            <Lock size={11} />
            <span>Secure</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between px-5 py-3 bg-white border-b border-black/[0.06]"
          data-testid="cart-summary-toggle"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-sans font-medium text-[#0A1220]">Order summary ({itemCount})</span>
            {summaryOpen ? <ChevronUp size={14} className="text-black/30" /> : <ChevronDown size={14} className="text-black/30" />}
          </div>
          <span className="text-[15px] font-sans font-bold text-[#0A1220]" data-testid="checkout-total">${totalPrice.toFixed(2)}</span>
        </button>

        {summaryOpen && (
          <div className="px-5 py-3.5 bg-white border-b border-black/[0.06] space-y-3">
            {cart.items.map((item) => (
              <div key={`${item.slug}-${item.isSubscribe}`} className="flex items-center gap-3" data-testid={`checkout-item-${item.slug}`}>
                <div className="w-12 h-12 shrink-0 rounded-lg bg-[#F4F1EA] flex items-center justify-center p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-sans font-medium text-[#0A1220] truncate">{item.name}</p>
                  <p className="text-[11px] text-black/35">{item.frequency} · Qty {item.quantity}</p>
                </div>
                <span className="text-[13px] font-sans font-semibold text-[#0A1220]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-black/[0.04] flex justify-between items-baseline">
              <span className="text-[12px] text-black/40">Shipping</span>
              <span className="text-[12px] font-sans font-medium text-[#19B3A6]">Free</span>
            </div>
          </div>
        )}

        <div className="px-5 pt-5 pb-48" style={{ paddingBottom: 'calc(12rem + env(safe-area-inset-bottom, 0px))' }}>
          <section className="mb-6" data-testid="section-express-checkout">
            <p className="text-[12px] font-sans font-medium text-black/40 mb-3 text-center">Express checkout</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleExpressCheckout}
                disabled={isExpressProcessing}
                className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg text-[13px] font-sans font-medium hover:bg-black/90 transition-all disabled:opacity-50 min-h-[48px]"
                data-testid="button-express-apple-pay"
              >
                {isExpressProcessing ? <Loader2 size={14} className="animate-spin" /> : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> Pay</>
                )}
              </button>
              <button
                onClick={handleExpressCheckout}
                disabled={isExpressProcessing}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-black/[0.10] text-[#0A1220] rounded-lg text-[13px] font-sans font-medium hover:bg-black/[0.02] transition-all disabled:opacity-50 min-h-[48px]"
                data-testid="button-express-google-pay"
              >
                {isExpressProcessing ? <Loader2 size={14} className="animate-spin" /> : (
                  <><svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Pay</>
                )}
              </button>
            </div>
          </section>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-black/[0.08]" />
            <span className="text-[11px] font-sans text-black/25 uppercase tracking-wider">or fill in details</span>
            <div className="flex-1 h-px bg-black/[0.08]" />
          </div>

          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px]" data-testid="checkout-error">
              {serverError}
            </div>
          )}

          <div className="space-y-5">
            <section data-testid="section-contact">
              <h2 className="text-[15px] font-sans font-semibold text-[#0A1220] mb-3">Contact</h2>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (touched.email) setFieldErrors(prev => ({ ...prev, email: validateField('email', e.target.value) })); }}
                  onBlur={() => handleBlur('email', email)}
                  placeholder="Email address"
                  className={`${inputBase} ${fieldBorder('email')}`}
                  data-testid="input-email"
                  autoComplete="email"
                />
                <InlineError name="email" />
              </div>
              <p className="mt-1.5 text-[11px] text-black/30">Order confirmation and tracking sent here.</p>
            </section>

            <section data-testid="section-shipping">
              <h2 className="text-[15px] font-sans font-semibold text-[#0A1220] mb-3">Shipping address</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (touched.firstName) setFieldErrors(prev => ({ ...prev, firstName: validateField('firstName', e.target.value) })); }}
                      onBlur={() => handleBlur('firstName', firstName)}
                      placeholder="First name"
                      className={`${inputBase} ${fieldBorder('firstName')}`}
                      data-testid="input-first-name"
                      autoComplete="given-name"
                    />
                    <InlineError name="firstName" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (touched.lastName) setFieldErrors(prev => ({ ...prev, lastName: validateField('lastName', e.target.value) })); }}
                      onBlur={() => handleBlur('lastName', lastName)}
                      placeholder="Last name"
                      className={`${inputBase} ${fieldBorder('lastName')}`}
                      data-testid="input-last-name"
                      autoComplete="family-name"
                    />
                    <InlineError name="lastName" />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); if (touched.address) setFieldErrors(prev => ({ ...prev, address: validateField('address', e.target.value) })); }}
                    onBlur={() => handleBlur('address', address)}
                    placeholder="Street address"
                    className={`${inputBase} ${fieldBorder('address')}`}
                    data-testid="input-address"
                    autoComplete="address-line1"
                  />
                  <InlineError name="address" />
                </div>
                <input
                  type="text"
                  value={apt}
                  onChange={(e) => setApt(e.target.value)}
                  placeholder="Apt / Suite (optional)"
                  className={`${inputBase} border-black/[0.10]`}
                  data-testid="input-apt"
                  autoComplete="address-line2"
                />
                <div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); if (touched.city) setFieldErrors(prev => ({ ...prev, city: validateField('city', e.target.value) })); }}
                    onBlur={() => handleBlur('city', city)}
                    placeholder="City"
                    className={`${inputBase} ${fieldBorder('city')}`}
                    data-testid="input-city"
                    autoComplete="address-level2"
                  />
                  <InlineError name="city" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <select
                        value={usState}
                        onChange={(e) => { setUsState(e.target.value); setFieldErrors(prev => ({ ...prev, state: undefined })); setTouched(prev => ({ ...prev, state: true })); }}
                        onBlur={() => handleBlur('state', usState)}
                        className={`${selectBase} ${fieldBorder('state')} ${!usState ? 'text-black/30' : ''}`}
                        data-testid="select-state"
                        autoComplete="address-level1"
                      >
                        <option value="" disabled>State</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                    </div>
                    <InlineError name="state" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => { setZip(e.target.value); if (touched.zip) setFieldErrors(prev => ({ ...prev, zip: validateField('zip', e.target.value) })); }}
                      onBlur={() => handleBlur('zip', zip)}
                      placeholder="Zip code"
                      className={`${inputBase} ${fieldBorder('zip')}`}
                      data-testid="input-zip"
                      autoComplete="postal-code"
                    />
                    <InlineError name="zip" />
                  </div>
                </div>
                <div className="relative">
                  <select disabled className={`${selectBase} border-black/[0.10] text-black/50`} data-testid="select-country">
                    <option>United States</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/[0.08]" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-lg mx-auto px-5 py-3.5 space-y-2.5">
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#19B3A6] text-white rounded-lg text-[14px] font-sans font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
            data-testid="button-place-order"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={14} />
                Continue to Payment — ${totalPrice.toFixed(2)}
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-black/30" data-testid="checkout-trust-cue">Secure checkout · Free US shipping · 30-day risk-free guarantee</p>
        </div>
      </div>
    </div>
  );
}
