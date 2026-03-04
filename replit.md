# Overview

This is a product landing page / marketing site for what appears to be a health/supplement brand. It's built as a full-stack TypeScript application with a React frontend and Express backend. The frontend is a single-page application featuring animated product showcases with GSAP scroll-triggered animations, custom brand theming (navy, teal, violet color palette), and a rich component library via shadcn/ui. The backend is minimal — primarily serving the frontend with placeholder user CRUD operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Styling**: Tailwind CSS with custom brand colors (`ar-navy`, `ar-paper`, `ar-teal`, `ar-violet`, `ar-ink`) and custom fonts (Manrope, Inter, Fraunces, JetBrains Mono)
- **Component Library**: shadcn/ui (new-york style) — extensive set of Radix UI primitives in `client/src/components/ui/`
- **Animations**: GSAP with ScrollTrigger plugin for scroll-based animations
- **State Management**: TanStack React Query for server state; local React state otherwise
- **Routing**: Wouter-based routing in `App.tsx`. Routes: `/` → Home (`Home.tsx`), `/shop` → Shop (`Shop.tsx`), `/product/:slug` → Product detail (`Shop.tsx`), `/science` → Science (`pages/Science.tsx`), `/quality` → Quality (`pages/Quality.tsx`), `/faq` → FAQ (`pages/FAQ.tsx`), `/privacy` → Privacy (`pages/PrivacyPage.tsx`), `/terms` → Terms (`pages/TermsPage.tsx`), `/shipping` → Shipping (`pages/ShippingPage.tsx`), fallback → redirect to `/`
- **Legal Utilities**: Shared SEO helpers in `client/src/legal/legalUtils.ts` — provides `useLegalSeo()` for meta tags, canonical, OG tags, JSON-LD (WebPage + BreadcrumbList), plus `LEGAL` constants (brand name, support email, internal URLs)
- **Pre-rendering**: Server-side HTML injection via `server/prerender.ts` — every route returns real HTML content (not just a React shell) for bot/LLM scannability. Route handlers in `server/routes.ts` intercept page requests before Vite/static catch-all and inject per-route content, meta tags, and navigation.
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

## Backend
- **Framework**: Express 5 on Node.js, written in TypeScript and run via `tsx`
- **Architecture**: HTTP server created with `createServer()`, routes registered in `server/routes.ts`, all API routes should be prefixed with `/api`
- **Storage**: Uses `DatabaseStorage` (backed by PostgreSQL) when `DATABASE_URL` is set, falling back to `MemStorage` for basic user ops. Order operations require the database. Both implement the `IStorage` interface in `server/storage.ts`.
- **Dev Server**: Vite dev server is attached as middleware in development mode (`server/vite.ts`), with HMR support
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

## Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` — has `users` table (id UUID, username, password) and `orders` table (id UUID, stripe_session_id, stripe_payment_intent_id, stripe_subscription_id, email, status, order_type, total_amount, currency, shipping fields, items JSONB, fulfillment_status, tracking fields, timestamps)
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions
- **Migrations**: Drizzle Kit configured with `drizzle.config.ts`, migrations output to `./migrations/`. Use `npm run db:push` to push schema changes.
- **Connection**: Requires `DATABASE_URL` environment variable pointing to a PostgreSQL instance
- **Stripe Integration**: Uses `stripe-replit-sync` for webhook processing and data sync. Stripe API keys stored as env secrets (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`). Webhook registered at `/api/stripe/webhook`. Orders are created as "pending" at checkout session creation, then updated to "paid"/"active" when Stripe webhook confirms payment.
- **Subscription Support**: Backend creates Stripe Checkout Sessions with `mode: "subscription"` when cart contains subscription items. Line items include `recurring` with interval/interval_count derived from frequency string. Webhook handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted` events. Orders store `order_type` ("subscription" or "one_time") and `stripe_subscription_id`. Subscription pricing: CELLUNAD+ $67.99/mo, CELLUBIOME $93.50/mo, CELLUNOVA $42.49/mo (15% discount from one-time $49.99).
- **Order Flow**: Cart (client) -> POST /api/checkout/session (creates pending order + Stripe session with mode based on isSubscribe) -> Stripe hosted checkout -> webhook confirms payment -> order status updated to "paid" (one-time) or "active" (subscription) -> /order-confirmed page shows order details with subscription badge
- **API Routes**: `GET /api/stripe/publishable-key`, `POST /api/checkout/session`, `GET /api/checkout/session/:sessionId`, `GET /api/orders/:orderId`

## Build System
- **Dev**: `npm run dev` — runs Express + Vite dev server with HMR via `tsx`
- **Build**: `npm run build` — Vite builds the client, esbuild bundles the server. Certain dependencies are bundled (allowlisted) to reduce cold start syscalls.
- **Start**: `npm run start` — runs the production bundle from `dist/index.cjs`
- **Type Check**: `npm run check` — runs TypeScript compiler in noEmit mode

## Key Design Decisions
1. **Monorepo-style structure** with `client/`, `server/`, and `shared/` directories. The `shared/` directory contains schema definitions used by both frontend and backend.
2. **Storage interface pattern** — the `IStorage` interface in `server/storage.ts` abstracts data access, making it easy to swap `MemStorage` for a `DatabaseStorage` implementation backed by Drizzle/PostgreSQL.
3. **Single-page marketing site** — the app is currently structured as a single `App.tsx` component rather than using a router, since it's a product landing page. A router can be added when multi-page navigation is needed.
4. **shadcn/ui components are copied into the project** (not imported from a package), following the shadcn pattern. They live in `client/src/components/ui/` and can be modified directly.
5. **Luxury design system** — shared CSS in `client/src/styles/luxury-pages.css` provides premium visual treatment (film grain overlay, glass-morphism cards, teal accent glows, gradient section dividers, multi-layer box shadows, backdrop blur) used by Quality, FAQ, and Science pages. Key CSS classes: `ar-luxury-page`, `ar-luxury-hero`, `ar-luxury-card`, `ar-luxury-card-glow`, `ar-luxury-accordion`, `ar-luxury-btn-primary`, `ar-luxury-btn-ghost`, `ar-luxury-eyebrow`, `ar-luxury-section-divider`, `ar-luxury-toc-card`, `ar-luxury-search-input`, `ar-luxury-pill`, `ar-luxury-table-wrap`, `ar-luxury-disclaimer`, `ar-luxury-product-card`.

# External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable. Used with Drizzle ORM.
- **Google Fonts**: Loaded via CDN in `index.html` and `index.css` (Manrope, Inter, Fraunces, JetBrains Mono, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **GSAP**: Animation library with ScrollTrigger plugin for scroll-based product animations
- **Radix UI**: Headless UI primitives powering all shadcn/ui components
- **TanStack React Query**: Server state management and data fetching
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` are used in development on Replit
- **connect-pg-simple**: Available for PostgreSQL-backed session storage (not yet wired up)
- **express-session**: Session management (available in dependencies)

# Bot / LLM Crawler Support

- **Bot detection middleware** in `server/routes.ts`: Detects crawler User-Agents (GPTBot, ChatGPT-User, ClaudeBot, Googlebot, Bingbot, etc.) and serves them full prerendered HTML pages instead of the React SPA shell. This runs before the Vite dev middleware, so it works in both dev and production modes.
- **Prerendered content** in `server/prerender.ts`: Every route has comprehensive static HTML content including full product details, ingredient lists, dosing info, FAQ Q&A pairs, quality standards, and science content. Bot responses include proper `<title>`, `<meta>`, OG tags, canonical URLs, nav links, and footer.
- **SEO files**: `sitemap.xml`, `robots.txt`, and `llms.txt` are generated by `scripts/generate-seo-files.mjs` and served from `client/public/`.
- **API endpoint**: `GET /api/site-content` returns a markdown summary of the entire site for programmatic access.