import { useState, useEffect, useCallback } from 'react';
import { Redirect, Link } from 'wouter';
import { ChevronDown, ChevronUp, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../cartStore';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/queryClient';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
  MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'
};

const STORAGE_KEY = 'ar_checkout_form';

type FieldErrors = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
};

function loadSaved(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveDraft(data: Record<string, string>) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export default function Checkout() {
  const cart = useCart();
  const { user, isAuthenticated } = useAuth();
  const saved = loadSaved();

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpressProcessing, setIsExpressProcessing] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [email, setEmail] = useState(user?.email || saved.email || '');
  const [firstName, setFirstName] = useState(saved.firstName || '');
  const [lastName, setLastName] = useState(saved.lastName || '');
  const [address, setAddress] = useState(saved.address || '');
  const [apt, setApt] = useState(saved.apt || '');
  const [city, setCity] = useState(saved.city || '');
  const [usState, setUsState] = useState(saved.state || '');
  const [zip, setZip] = useState(saved.zip || '');

  useEffect(() => {
    if (isAuthenticated && user?.email) setEmail(user.email);
  }, [isAuthenticated, user]);

  const persistForm = useCallback(() => {
    saveDraft({ email, firstName, lastName, address, apt, city, state: usState, zip });
  }, [email, firstName, lastName, address, apt, city, usState, zip]);

  useEffect(() => {
    const t = setTimeout(persistForm, 500);
    return () => clearTimeout(t);
  }, [persistForm]);

  const totalPrice = cart.totalPrice;
  const itemCount = cart.totalItems;

  if (itemCount === 0) return <Redirect to="/shop" />;

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email': return (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) ? 'Enter a valid email' : undefined;
      case 'firstName': return !value.trim() ? 'Required' : undefined;
      case 'lastName': return !value.trim() ? 'Required' : undefined;
      case 'address': return !value.trim() ? 'Required' : undefined;
      case 'city': return !value.trim() ? 'Required' : undefined;
      case 'state': return !value ? 'Required' : undefined;
      case 'zip': return (!value.trim() || !/^\d{5}(-\d{4})?$/.test(value.trim())) ? 'Valid zip required' : undefined;
      default: return undefined;
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const liveValidate = (name: string, value: string) => {
    if (touched[name]) setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {
      email: validateField('email', email),
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      address: validateField('address', address),
      city: validateField('city', city),
      state: validateField('state', usState),
      zip: validateField('zip', zip),
    };
    setFieldErrors(errors);
    setTouched({ email: true, firstName: true, lastName: true, address: true, city: true, state: true, zip: true });

    const firstError = Object.entries(errors).find(([, v]) => v);
    if (firstError) {
      const el = document.querySelector(`[data-testid="input-${firstError[0]}"], [data-testid="select-${firstError[0]}"]`);
      if (el) (el as HTMLElement).focus();
    }
    return !Object.values(errors).some(Boolean);
  };

  const getDiscountCode = (): string => {
    try { return sessionStorage.getItem('ar_promo_code') || ''; } catch { return ''; }
  };

  const buildPayload = (express = false) => ({
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
      firstName: express ? '' : firstName,
      lastName: express ? '' : lastName,
      address: express ? '' : address,
      apt: express ? '' : apt,
      city: express ? '' : city,
      state: express ? '' : (STATE_NAMES[usState] || usState),
      zip: express ? '' : zip,
      country: 'US',
    },
    ...(getDiscountCode() ? { discountCode: getDiscountCode() } : {}),
    ...(express ? { expressCheckout: true } : {}),
  });

  const submitCheckout = async (express: boolean) => {
    if (!express && !validateAll()) return;
    if (express && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
      setFieldErrors(prev => ({ ...prev, email: 'Enter your email first' }));
      setTouched(prev => ({ ...prev, email: true }));
      const el = document.querySelector('[data-testid="input-email"]');
      if (el) (el as HTMLElement).focus();
      return;
    }

    express ? setIsExpressProcessing(true) : setIsProcessing(true);
    setServerError('');

    try {
      const response = await apiRequest('POST', '/api/checkout/session', buildPayload(express));
      const data = await response.json();
      if (data.url) {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = data.url;
      } else {
        setServerError(express ? 'Express checkout unavailable. Use the form below.' : 'Unable to start checkout. Please try again.');
        express ? setIsExpressProcessing(false) : setIsProcessing(false);
      }
    } catch (err: any) {
      setServerError(err?.message || 'Something went wrong. Please try again.');
      express ? setIsExpressProcessing(false) : setIsProcessing(false);
    }
  };

  const inputCls = (name: string) => {
    const hasError = touched[name] && fieldErrors[name as keyof FieldErrors];
    return `w-full px-3 py-2.5 border ${hasError ? 'border-red-400' : 'border-black/[0.10]'} rounded-lg bg-white text-[14px] font-sans text-[#0A1220] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#19B3A6]/25 focus:border-[#19B3A6]/40 transition-all`;
  };

  const InlineErr = ({ name }: { name: keyof FieldErrors }) => {
    if (!touched[name] || !fieldErrors[name]) return null;
    return <p className="mt-0.5 text-[10px] text-red-500 leading-tight" data-testid={`error-${name}`}>{fieldErrors[name]}</p>;
  };

  const hasSubscription = cart.items.some(i => i.isSubscribe);

  return (
    <div className="min-h-[100dvh] bg-[#F7F6F3] font-sans antialiased text-[#0A1220]">
      <header className="border-b border-black/[0.06] bg-white sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-1 text-[12px] text-black/35 hover:text-black/55 transition-colors" data-testid="checkout-back-link">
            <ArrowLeft size={14} />
            Back
          </Link>
          <span className="text-[13px] font-sans font-semibold tracking-tight" data-testid="checkout-brand">AGE REVIVE</span>
          <span className="flex items-center gap-1 text-[10px] text-black/25"><Lock size={10} /> Secure</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white/80 border-b border-black/[0.05]"
          data-testid="cart-summary-toggle"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[12px] font-sans font-medium">Order ({itemCount})</span>
            {summaryOpen ? <ChevronUp size={12} className="text-black/25" /> : <ChevronDown size={12} className="text-black/25" />}
          </span>
          <span className="text-[14px] font-sans font-bold" data-testid="checkout-total">${totalPrice.toFixed(2)}</span>
        </button>

        {summaryOpen && (
          <div className="px-4 py-3 bg-white border-b border-black/[0.05] space-y-2.5">
            {cart.items.map((item) => (
              <div key={`${item.slug}-${item.isSubscribe}`} className="flex items-center gap-2.5" data-testid={`checkout-item-${item.slug}`}>
                <div className="w-10 h-10 shrink-0 rounded bg-[#F4F1EA] flex items-center justify-center p-0.5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-sans font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-black/35">{item.frequency} · Qty {item.quantity}</p>
                </div>
                <span className="text-[12px] font-sans font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-1.5 border-t border-black/[0.04] flex justify-between">
              <span className="text-[11px] text-black/35">Shipping</span>
              <span className="text-[11px] font-sans font-medium text-[#19B3A6]">Free</span>
            </div>
          </div>
        )}

        <div className="px-4 pt-4 pb-40" style={{ paddingBottom: 'calc(10rem + env(safe-area-inset-bottom, 0px))' }}>
          <section className="mb-5" data-testid="section-express-checkout">
            <p className="text-[11px] font-sans text-black/35 mb-2.5 text-center">Express checkout</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => submitCheckout(true)}
                disabled={isExpressProcessing}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-black text-white rounded-lg text-[12px] font-sans font-medium hover:bg-black/90 transition-all disabled:opacity-40 min-h-[44px]"
                data-testid="button-express-apple-pay"
              >
                {isExpressProcessing ? <Loader2 size={13} className="animate-spin" /> : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> Pay</>
                )}
              </button>
              <button
                onClick={() => submitCheckout(true)}
                disabled={isExpressProcessing}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-black/[0.10] rounded-lg text-[12px] font-sans font-medium hover:bg-black/[0.02] transition-all disabled:opacity-40 min-h-[44px]"
                data-testid="button-express-google-pay"
              >
                {isExpressProcessing ? <Loader2 size={13} className="animate-spin" /> : (
                  <><svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Pay</>
                )}
              </button>
            </div>
          </section>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-black/[0.06]" />
            <span className="text-[10px] font-sans text-black/20 uppercase tracking-wider">or enter details</span>
            <div className="flex-1 h-px bg-black/[0.06]" />
          </div>

          {serverError && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px]" data-testid="checkout-error">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <section data-testid="section-contact">
              <label className="text-[12px] font-sans font-semibold mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); liveValidate('email', e.target.value); }}
                onBlur={() => handleBlur('email', email)}
                placeholder="you@email.com"
                className={inputCls('email')}
                data-testid="input-email"
                autoComplete="email"
                inputMode="email"
              />
              <InlineErr name="email" />
            </section>

            <section data-testid="section-shipping">
              <label className="text-[12px] font-sans font-semibold mb-1.5 block">Shipping</label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); liveValidate('firstName', e.target.value); }} onBlur={() => handleBlur('firstName', firstName)} placeholder="First name" className={inputCls('firstName')} data-testid="input-first-name" autoComplete="given-name" />
                    <InlineErr name="firstName" />
                  </div>
                  <div>
                    <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); liveValidate('lastName', e.target.value); }} onBlur={() => handleBlur('lastName', lastName)} placeholder="Last name" className={inputCls('lastName')} data-testid="input-last-name" autoComplete="family-name" />
                    <InlineErr name="lastName" />
                  </div>
                </div>
                <div>
                  <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); liveValidate('address', e.target.value); }} onBlur={() => handleBlur('address', address)} placeholder="Street address" className={inputCls('address')} data-testid="input-address" autoComplete="address-line1" />
                  <InlineErr name="address" />
                </div>
                <input type="text" value={apt} onChange={(e) => setApt(e.target.value)} placeholder="Apt / Suite (optional)" className={inputCls('_')} data-testid="input-apt" autoComplete="address-line2" />
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <input type="text" value={city} onChange={(e) => { setCity(e.target.value); liveValidate('city', e.target.value); }} onBlur={() => handleBlur('city', city)} placeholder="City" className={inputCls('city')} data-testid="input-city" autoComplete="address-level2" />
                    <InlineErr name="city" />
                  </div>
                  <div className="col-span-1">
                    <div className="relative">
                      <select
                        value={usState}
                        onChange={(e) => { setUsState(e.target.value); setFieldErrors(prev => ({ ...prev, state: undefined })); setTouched(prev => ({ ...prev, state: true })); }}
                        onBlur={() => handleBlur('state', usState)}
                        className={`${inputCls('state')} appearance-none pr-6 ${!usState ? 'text-black/30' : ''}`}
                        data-testid="select-state"
                        autoComplete="address-level1"
                      >
                        <option value="" disabled>State</option>
                        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" />
                    </div>
                    <InlineErr name="state" />
                  </div>
                  <div className="col-span-2">
                    <input type="text" value={zip} onChange={(e) => { setZip(e.target.value); liveValidate('zip', e.target.value); }} onBlur={() => handleBlur('zip', zip)} placeholder="Zip" className={inputCls('zip')} data-testid="input-zip" autoComplete="postal-code" inputMode="numeric" />
                    <InlineErr name="zip" />
                  </div>
                </div>
              </div>
            </section>

            {hasSubscription && (
              <div className="rounded-lg px-3.5 py-2.5" style={{ background: '#F0FDFA', border: '1px solid rgba(25,179,166,0.12)' }} data-testid="subscription-notice">
                <p className="text-[11px] font-sans text-[#0A1220]/60 leading-relaxed">
                  Your subscription renews automatically. Cancel or skip anytime from your account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-black/[0.06]" style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-lg mx-auto px-4 py-3 space-y-1.5">
          <button
            onClick={() => submitCheckout(false)}
            disabled={isProcessing}
            className="w-full py-3 bg-[#19B3A6] text-white rounded-lg text-[13px] font-sans font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 min-h-[48px]"
            data-testid="button-place-order"
          >
            {isProcessing ? (
              <><Loader2 size={14} className="animate-spin" /> Processing...</>
            ) : (
              <>Continue to Payment — ${totalPrice.toFixed(2)}</>
            )}
          </button>
          <p className="text-[9px] text-center text-black/25" data-testid="checkout-trust-cue">Secure checkout · Free shipping · 30-day guarantee</p>
        </div>
      </div>
    </div>
  );
}
