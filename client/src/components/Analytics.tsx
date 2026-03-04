import { useEffect } from "react";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export default function Analytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        gtag("js", new Date());
        gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });
      }
    };

    const consent = localStorage.getItem("ar_cookie_consent");
    if (consent === "accepted") {
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      }
    }
  }, []);

  return null;
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
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
