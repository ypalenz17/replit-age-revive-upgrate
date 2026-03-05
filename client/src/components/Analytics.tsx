import { useEffect } from "react";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getGtag(): ((...args: unknown[]) => void) | null {
  return typeof window !== "undefined" && typeof window.gtag === "function" ? window.gtag : null;
}

export default function Analytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    window.dataLayer = window.dataLayer ?? [];
    if (typeof window.gtag !== "function") {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
    }

    const gtag = getGtag();
    if (!gtag) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-analytics-id="${GA_MEASUREMENT_ID}"]`,
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      script.dataset.analyticsId = GA_MEASUREMENT_ID;
      document.head.appendChild(script);
    }

    gtag("js", new Date());
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
    gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });

    try {
      const consent = localStorage.getItem("ar_cookie_consent");
      if (consent === "accepted") {
        gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      }
    } catch {
      // Ignore storage access failures in privacy-restricted environments.
    }
  }, []);

  return null;
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  const gtag = getGtag();
  if (gtag) {
    gtag("event", eventName, params);
  }
}

export function trackConversion(transactionId: string, value: number, currency = "USD") {
  trackEvent("purchase", {
    transaction_id: transactionId,
    value,
    currency,
  });
}
