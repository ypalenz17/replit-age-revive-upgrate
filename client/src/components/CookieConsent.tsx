import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "ar_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

function getConsentState(): ConsentState {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
  } catch {}
  return null;
}

function setConsentState(value: Exclude<ConsentState, null>): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Ignore storage failures in restricted browser modes.
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(getConsentState);
  return { consent, hasConsented: consent !== null, isAccepted: consent === "accepted" };
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsentState();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setConsentState("accepted");
    setVisible(false);
    enableAnalytics();
  };

  const handleDecline = () => {
    setConsentState("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 animate-in slide-in-from-bottom duration-500"
      data-testid="cookie-consent-banner"
    >
      <div className="max-w-2xl mx-auto bg-[#1a2a3e] border border-white/[0.10] rounded-2xl p-5 md:p-6 shadow-[0_-4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white/70 leading-relaxed">
              We use cookies to improve your experience, analyze site traffic, and measure ad performance.
              By clicking "Accept," you consent to the use of cookies. See our{" "}
              <a href="/privacy" className="text-teal-300 hover:text-teal-200 transition-colors underline underline-offset-2">
                Privacy Policy
              </a>{" "}
              for details.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-[13px] font-medium text-white/50 hover:text-white/80 border border-white/[0.10] hover:border-white/20 rounded-full transition-colors"
              data-testid="button-cookie-decline"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-[13px] font-semibold text-[#131d2e] bg-teal-400 hover:bg-teal-300 rounded-full transition-colors"
              data-testid="button-cookie-accept"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function enableAnalytics() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
    });
  }
}
