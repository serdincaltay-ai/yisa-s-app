# CLAUDE.md — YİSA-S Codebase Guide

## Project Overview

**YİSA-S** (Yönetici İşletmeci Sporcu Antrenör Sistemi) is a multi-tenant SaaS platform for sports facility management. It provides AI-powered automation, role-based dashboards, franchise management, and parent/trainer portals. The UI and documentation are primarily in Turkish.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 18 and TypeScript 5
- **Database:** Supabase (PostgreSQL) with `@supabase/ssr` for server-side auth
- **Styling:** Tailwind CSS 3.4 + Radix UI (shadcn/ui pattern) + Framer Motion
- **AI Providers:** Anthropic Claude, Google Gemini, OpenAI GPT, Together API, Vercel v0, FAL AI
- **Deployment:** Vercel (serverless) with PWA support
- **Package Manager:** npm 10.2

## Quick Commands

```bash
npm run dev          # Start dev server
npm run dev:phone    # Dev on 0.0.0.0 (mobile testing)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run db:migrate   # Run database migrations
npm run db:full-migrate  # Full migration suite
```

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  auth/                 # Login, password reset (server actions in actions.ts)
  dashboard/            # Patron/CEO control panel (main admin hub)
    celf/               # CELF AI robot center management
    directors/          # Director management
    facilities/         # Facility management
    franchise-yonetim/  # Franchise management
    kasa-defteri/       # Cash book / financial records
    messages/           # Messaging system
    onay-kuyrugu/       # Approval queue
    reports/            # Analytics and reporting
    robots/             # AI robot management
    settings/           # System settings
    users/              # User management
  patron/               # Patron-specific panel (app.yisa-s.com)
  franchise/            # Franchise operator panel
  veli/                 # Parent monitoring panel
  antrenor/             # Trainer panel
  tesis/                # Facility panel
  fiyatlar/             # Pricing page (public)
  demo/                 # Demo request page (public)
  api/                  # ~56 API route handlers
    chat/               # Chat endpoints (multi-provider)
    patron/             # Patron commands, approvals
    celf/               # CELF robot operations
    ceo/                # CEO automation
    coo/                # COO operations (includes cron: /api/coo/run-due)
    franchise/          # Franchise CRUD (~10 sub-routes)
    directors/          # Director operations
    ai/                 # AI endpoints
    system/             # Health checks, status
    webhooks/manychat/  # ManyChat lead capture webhook
    deploy/             # Deployment triggers
    sales/              # Sales operations
    kasa/               # Cash management
    approvals/          # Approval workflows

components/             # Reusable UI components
  ui/                   # Shadcn/Radix primitives (button, card, input, tabs, etc.)
  patron/               # Patron panel components (ApprovalQueue, RobotStatusGrid)
  franchise-panel/      # Franchise dashboard components

lib/                    # Core business logic and utilities
  ai/                   # AI service layer
    assistant-provider.ts   # Multi-provider AI router
    celf-execute.ts         # CELF robot execution engine
    celf-pool.ts            # AI provider pool management
    claude-service.ts       # Anthropic Claude integration
    gemini-service.ts       # Google Gemini integration
    gpt-service.ts          # OpenAI GPT integration
  api/                  # External API clients (GitHub, Cursor, v0, FAL)
  auth/                 # Authentication & role utilities
    roles.ts            # 13-level role hierarchy (ROL-0 to ROL-12)
    api-auth.ts         # API authentication helpers
    resolve-role.ts     # Role resolution logic
  db/                   # Database query modules (~18 files)
  supabase/             # Supabase client setup
    client.ts           # Browser-side Supabase client
    server.ts           # Server-side Supabase client
    middleware.ts        # Auth middleware (session + subdomain routing)
  security/             # Security utilities (patron-lock, forbidden-zones)
  robots/               # AI robot configurations (CEO, CIO, COO, security, etc.)
  context/              # React Context providers (AccentContext for theming)
  utils.ts              # cn() helper (clsx + tailwind-merge)
  subdomain.ts          # Subdomain-based panel detection
  ai-router.ts          # Main AI routing logic

supabase/               # Database migrations (SQL files, date-prefixed)
scripts/                # Node.js migration and utility scripts
docs/                   # Additional documentation
public/                 # Static assets (PWA icons, sw.js, manifest)
```

## Architecture Patterns

### Multi-Tenant Subdomain Routing

Routing is subdomain-based, handled in `lib/subdomain.ts` and `lib/supabase/middleware.ts`:

| Subdomain | Panel | Path |
|---|---|---|
| `app.yisa-s.com` | Patron (CEO) | `/dashboard` |
| `www.yisa-s.com` | Public landing | `/` |
| `{franchise}.yisa-s.com` | Franchise site | `/franchise` |
| `veli.yisa-s.com` | Parent panel | `/veli` |
| `franchise.yisa-s.com` | Redirects to www | - |

Dynamic franchise subdomains are stored in the database and fetched via `lib/db/franchise-subdomains.ts`.

### Role Hierarchy

Defined in `lib/auth/roles.ts`. Lower number = higher authority:

- **ROL-0:** Patron (owner, top authority)
- **ROL-1:** Asistan (AI layer)
- **ROL-2 to ROL-9:** Staff hierarchy (Alt Admin, Tesis Müdürü, Antrenör, etc.)
- **ROL-10:** Veli (Parent)
- **ROL-11:** Sporcu (Athlete)
- **ROL-12:** Misafir Sporcu (Guest Athlete)

Dashboard access requires Patron, Süper Admin, or Sistem Admini role. Use `isPatron()`, `canAccessDashboard()`, and `canTriggerFlow()` helpers.

### AI Robot System (CELF)

CELF (Central Electronic Learning Framework) is the AI automation layer in `lib/robots/` and `lib/ai/`:

- **Multi-provider routing** — Falls back across Claude, Gemini, GPT, Together
- **Specialized robots** — CEO, CIO, COO, Security, Data, Patron Assistant
- **Command flow:** Patron command -> Approval queue -> CELF execution -> Result + audit log
- Provider configuration in `lib/ai/celf-pool.ts`, execution in `lib/ai/celf-execute.ts`

### Authentication

- Supabase Auth with email-based login
- Server-side session management via `@supabase/ssr` middleware
- Protected routes: `/patron`, `/franchise`, `/tesis`, `/antrenor`, `/veli`, `/dashboard`
- Patron is identified by email match against `NEXT_PUBLIC_PATRON_EMAIL` env var

## Key Conventions

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- Path alias: `@/*` maps to project root (e.g., `@/lib/utils`, `@/components/ui/button`)
- Target: ES2017

### Styling

- Tailwind utility-first with HSL CSS custom properties (defined in `globals.css`)
- Dark theme by default (body: `bg-[#0a0e17] text-white`)
- Shadcn/ui component pattern: Radix UI primitives in `components/ui/` styled with CVA (class-variance-authority)
- Use `cn()` from `@/lib/utils` for merging Tailwind classes
- Custom animations: `spin-slow`, `spin-slower`, accordion keyframes
- Glass card effects via `.glass-card`, `.gradient-border`, `.accent-glow` utility classes

### Component Pattern

```tsx
// Typical shadcn/ui component (components/ui/button.tsx)
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("...", { variants: { ... } })

export function Button({ className, variant, ...props }) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
```

### API Routes

- Located in `app/api/` using Next.js Route Handlers
- Use `createClient()` from `@/lib/supabase/server` for authenticated DB access
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) for admin operations
- Pattern: validate auth -> process request -> return NextResponse.json()

### Database

- All queries go through Supabase client (`@supabase/supabase-js`)
- Query helpers in `lib/db/*.ts` — one file per domain (e.g., `celf-audit.ts`, `sales-prices.ts`)
- Migrations in `supabase/` directory, date-prefixed (YYYYMMDD format)
- Run migrations: `npm run db:migrate` or `npm run db:full-migrate`
- Full schema reference: `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql`

### State Management

- Minimal — React Context for theming (`lib/context/accent-context.tsx` with `useAccent()` hook)
- No external state library (no Redux, Zustand, etc.)
- Server-side data via Supabase queries in Server Components and API routes
- Client components fetch via API routes

## Environment Variables

Required (see `.env.example` for full list):

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY      # Admin DB access
ANTHROPIC_API_KEY              # Claude AI
GOOGLE_API_KEY                 # Gemini AI
OPENAI_API_KEY                 # GPT AI
```

Optional: `TOGETHER_API_KEY`, `V0_API_KEY`, `GITHUB_TOKEN`, `VERCEL_TOKEN`, `MANYCHAT_API_KEY`, `FAL_API_KEY`, `CRON_SECRET`

## Scheduled Jobs

- **COO run-due** (`/api/coo/run-due`): Runs daily at 02:00 UTC via Vercel Cron (configured in `vercel.json`)

## Testing

No test framework is currently configured. No test files exist in the codebase.

## Linting

- ESLint 9 with `next/core-web-vitals` config
- Flat config format in `eslint.config.mjs`
- Ignores: `.next/`, `node_modules/`, `out/`, config files
- Run: `npm run lint` or `npm run lint:fix`

## Build & Deploy

- Production builds via `npm run build` (Next.js)
- Deployed to Vercel (configured in `vercel.json`)
- PWA-enabled with service worker (`public/sw.js`) and manifest
- `next.config.js`: React strict mode, manifest.json rewrite

## Important Notes for AI Assistants

1. **Language:** UI text, comments, variable names, and documentation are largely in Turkish. Preserve this convention.
2. **No middleware.ts at root:** The middleware logic lives in `lib/supabase/middleware.ts` and is imported (not a root-level Next.js middleware file).
3. **Patron is the owner:** The Patron role has ultimate authority. `isPatron()` checks email match, not role metadata.
4. **CELF execution must go through approval:** Commands follow the queue pattern. Do not bypass the approval workflow.
5. **Subdomain awareness:** Many components and API routes behave differently based on the active subdomain/panel type.
6. **Database writes use service role:** Client-side reads use anon key, but writes (chat logs, commands, audit) use `SUPABASE_SERVICE_ROLE_KEY`.
7. **Multiple AI providers:** The system is designed to fall back across providers. Changes to AI logic should maintain this multi-provider pattern.
8. **Path aliases:** Always use `@/` imports (e.g., `@/lib/utils`, `@/components/ui/button`).
