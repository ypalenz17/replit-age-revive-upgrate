export const LEGAL = {
  brand: "Age Revive",
  supportEmail: "support@agerevive.com",
  supportUrl: "/faq",
  productsUrl: "/shop",
  faqUrl: "/faq",
  qualityUrl: "/quality",
  scienceUrl: "/science",
};

export function upsertHeadEl(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void
) {
  const existing = document.head.querySelector(selector) as HTMLElement | null;
  const el = existing ?? create();
  apply(el);
  if (!existing) document.head.appendChild(el);
}

export function injectJsonLd(id: string, data: unknown) {
  const scriptId = `jsonld-${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

export function useLegalSeo(params: {
  path: string;
  title: string;
  description: string;
  breadcrumbName: string;
  lastUpdated: string;
}) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = `${siteUrl}${params.path}`;

  document.title = params.title;

  upsertHeadEl(
    `meta[name="description"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("name", "description");
      el.setAttribute("content", params.description);
    }
  );

  upsertHeadEl(
    `meta[name="robots"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("name", "robots");
      el.setAttribute("content", "index,follow");
    }
  );

  upsertHeadEl(
    `link[rel="canonical"]`,
    () => document.createElement("link"),
    (el) => {
      el.setAttribute("rel", "canonical");
      el.setAttribute("href", canonical);
    }
  );

  upsertHeadEl(
    `meta[property="og:title"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("property", "og:title");
      el.setAttribute("content", params.title);
    }
  );

  upsertHeadEl(
    `meta[property="og:description"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("property", "og:description");
      el.setAttribute("content", params.description);
    }
  );

  upsertHeadEl(
    `meta[property="og:type"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("property", "og:type");
      el.setAttribute("content", "website");
    }
  );

  upsertHeadEl(
    `meta[property="og:url"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("property", "og:url");
      el.setAttribute("content", canonical);
    }
  );

  upsertHeadEl(
    `meta[name="twitter:card"]`,
    () => document.createElement("meta"),
    (el) => {
      el.setAttribute("name", "twitter:card");
      el.setAttribute("content", "summary_large_image");
    }
  );

  injectJsonLd(`${params.path.replace("/", "")}-breadcrumb`, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: params.breadcrumbName,
        item: canonical,
      },
    ],
  });

  injectJsonLd(`${params.path.replace("/", "")}-webpage`, {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.breadcrumbName,
    url: canonical,
    description: params.description,
    dateModified: params.lastUpdated,
    isPartOf: { "@type": "WebSite", name: LEGAL.brand, url: siteUrl },
  });
}
