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
- **Routing**: Wouter-based routing in `App.tsx`. Routes: `/` → Home page (`Home.tsx`), `/shop` → Product detail page (`Shop.tsx`), fallback → `not-found.tsx`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

## Backend
- **Framework**: Express 5 on Node.js, written in TypeScript and run via `tsx`
- **Architecture**: HTTP server created with `createServer()`, routes registered in `server/routes.ts`, all API routes should be prefixed with `/api`
- **Storage**: Currently uses in-memory storage (`MemStorage` class in `server/storage.ts`) implementing an `IStorage` interface. Designed to be swapped for a database-backed implementation.
- **Dev Server**: Vite dev server is attached as middleware in development mode (`server/vite.ts`), with HMR support
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

## Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with `id` (UUID), `username`, and `password` columns
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions
- **Migrations**: Drizzle Kit configured with `drizzle.config.ts`, migrations output to `./migrations/`. Use `npm run db:push` to push schema changes.
- **Connection**: Requires `DATABASE_URL` environment variable pointing to a PostgreSQL instance
- **Note**: The app currently uses in-memory storage by default. The database schema and Drizzle config are set up but the storage layer hasn't been wired to use PostgreSQL yet.

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

# External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable. Used with Drizzle ORM.
- **Google Fonts**: Loaded via CDN in `index.html` and `index.css` (Manrope, Inter, Fraunces, JetBrains Mono, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **GSAP**: Animation library with ScrollTrigger plugin for scroll-based product animations
- **Radix UI**: Headless UI primitives powering all shadcn/ui components
- **TanStack React Query**: Server state management and data fetching
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` are used in development on Replit
- **connect-pg-simple**: Available for PostgreSQL-backed session storage (not yet wired up)
- **express-session**: Session management (available in dependencies)