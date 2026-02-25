import { useEffect } from "react";

export function PrerenderReadySignal() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.dispatchEvent(new Event("custom-render-trigger"));
    }, 50);

    return () => window.clearTimeout(id);
  }, []);

  return null;
}
