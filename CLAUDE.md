# CLAUDE.md — CJA Training Platform

## Project Overview

CJIS-compliant, trauma-informed training platform for criminal justice professionals (law enforcement, CPI, prosecutors, judges, medical, school staff, victim advocates, forensic interviewers, mandated reporters). Built with React + Vite + Supabase, featuring role-based training paths, interactive simulations, assessments, licensing/payments, and admin analytics.

**Origin:** Generated from Figma Make, then extended with Supabase backend, CJIS security, and Stripe payments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3.1, React Router 7.13.0 |
| Build | Vite 6.3.5, ESM modules |
| Styling | Tailwind CSS 4.1.12 (v4 with `@tailwindcss/vite` plugin) |
| UI Components | shadcn/ui + Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form |
| Animation | Motion (Framer Motion), tw-animate-css |
| State | React Context API (`AuthContext`) |
| Backend | Supabase Edge Functions (Deno + Hono.js) |
| Database | Supabase PostgreSQL (KV store pattern) |
| Auth | Supabase Auth (JWT) |
| Payments | Stripe (checkout sessions) |
| AI Chat | Google Gemini 2.0 Flash (Rooty chatbot) |
| Encryption | AES-256-GCM (CJIS 5.10.1.2 compliant) |

## Quick Start

```bash
npm install
npm run dev      # Start Vite dev server
npm run build    # Production build
```

## Directory Structure

```
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite config (React plugin, Tailwind, @ alias)
├── package.json                  # Dependencies & scripts (ESM, "type": "module")
├── postcss.config.mjs            # PostCSS (empty — Tailwind v4 handles via Vite plugin)
├── guidelines/
│   └── Guidelines.md             # AI system guidelines template
├── supabase/functions/server/
│   ├── index.tsx                 # Hono.js REST API (all endpoints)
│   ├── encryption.tsx            # AES-256-GCM encryption utilities
│   └── kv_store.tsx              # Supabase PostgreSQL KV store wrapper
├── utils/supabase/
│   └── info.tsx                  # Supabase project config (projectId, anonKey)
└── src/
    ├── main.tsx                  # React entry point (renders <App />)
    ├── styles/
    │   ├── index.css             # Main stylesheet import
    │   ├── fonts.css             # Google Fonts (Playfair Display, DM Sans, DM Mono)
    │   ├── tailwind.css          # Tailwind v4 config with @source, custom theme
    │   └── theme.css             # Design tokens, CSS variables, dark mode
    ├── assets/                   # PNG images
    ├── imports/                  # Reference documents (HTML, Markdown)
    └── app/
        ├── App.tsx               # Root component with RouterProvider & AuthProvider
        ├── routes.ts             # React Router route definitions
        └── components/
            ├── [Page components]   # Landing, Dashboard, ModuleList, etc.
            ├── [UI components]     # 40+ shadcn/ui components
            ├── [Data modules]      # data.ts, api.ts, security.ts
            ├── [Custom hooks]      # useAmbientAudio.ts, useTTS.ts
            └── figma/              # Figma plugin integration
```

## Routing

All routes defined in `src/app/routes.ts` using React Router v7:

| Path | Component | Access |
|------|-----------|--------|
| `/` | Landing | Public — onboarding, auth forms, TRACE/5Rs education |
| `/dashboard` | Dashboard | Authenticated — learner progress overview |
| `/modules` | ModuleList | Authenticated — 7 training modules grid |
| `/modules/:moduleId` | ModuleDetail | Authenticated — module content (5 sections) |
| `/modules/:moduleId/assessment/:type` | Assessment | Authenticated — pre/post quizzes |
| `/modules/:moduleId/simulation` | Simulation | Authenticated — branching scenario |
| `/certificates` | Certificate | Authenticated — completion certificates |
| `/admin` | AdminDashboard | Admin/Superadmin — analytics & charts |
| `/admin/users` | UserManagement | Admin/Superadmin — role management |
| `/admin/audit` | AuditLog | Superadmin only — security audit log |
| `/licensing` | Licensing | Authenticated — Stripe checkout |
| `/licensing/success` | LicensingSuccess | Authenticated — post-purchase |

The `Layout` component wraps all authenticated routes and provides sidebar navigation, top bar, auth status, and theme toggle.

## Architecture & Patterns

### State Management

All app state flows through `AuthContext` (`src/app/components/AuthContext.tsx`):
- User authentication state (user, profile, accessToken)
- Module progress tracking
- Watched vignettes list
- Methods: `signUp`, `signIn`, `signOut`, `updateProfile`, `updateModuleProgress`, `saveSimulationResult`, `refreshProgress`

Access via `useAuth()` hook in any component.

### API Layer

- Client-side API wrapper: `src/app/components/api.ts`
- All calls go to Supabase Edge Function server (`supabase/functions/server/index.tsx`)
- JWT token passed in Authorization header on every request
- Server validates JWT, extracts userId, enforces RBAC

### Database Pattern

Single KV table (`kv_store_39a35780`) with key prefixes:
- `user:{userId}:profile` — UserProfile (encrypted)
- `user:{userId}:progress:{moduleId}` — ModuleProgress (encrypted)
- `user:{userId}:simulation:{moduleId}:{timestamp}` — SimulationResult
- `user:{userId}:vignettes` — VignetteWatchList
- `audit:{userId}:{timestamp}` — AuditLog (encrypted)
- `audit_idx:{timestamp}` — AuditLog index (lightweight)
- `license:{sessionId}` — License record (encrypted)

### Security (CJIS Compliance)

- **Encryption:** AES-256-GCM with PBKDF2 key derivation (100k iterations, SHA-256)
- **Auth:** Supabase JWT tokens, email/password
- **RBAC:** Four roles — `learner`, `supervisor`, `admin`, `superadmin`
- **Audit logging:** All sensitive operations logged with user, IP, user agent, outcome
- **Security headers:** HSTS, X-Frame-Options, CSP, etc. (set in server)
- **Session management:** Token refresh, automatic logout on expiry

### UI Components

shadcn/ui pattern: components live in `src/app/components/` alongside page components. They use Radix UI primitives + Tailwind classes + `class-variance-authority` for variants. Key utility: `cn()` function from `clsx` + `tailwind-merge`.

### Styling

- **Tailwind CSS v4** configured via `@tailwindcss/vite` plugin (not PostCSS)
- Custom theme in `src/styles/theme.css` with CSS custom properties
- **Brand colors:** Evergreen `#082A19`, Gold Leaf `#C9A84C`, Canvas `#F2F4CA`
- **5Rs phase colors:** Root (deep green), Regulate (mid-green), Reflect (navy), Restore (tan), Reconnect (purple)
- **Fonts:** Playfair Display (headings), DM Sans (body), DM Mono (code)
- **Dark mode:** CSS `.dark` class toggle with inverted color scheme
- Path alias: `@` maps to `./src`

### Training Content

All training data defined in `src/app/components/data.ts` (~1800 lines):
- 7 modules, each with 5 sections following the 5Rs framework (Root, Regulate, Reflect, Restore, Reconnect)
- Pre/post assessment questions with citations and feedback
- Branching simulation scenarios with TRACE-based decision trees
- Video vignette metadata (actors, mood, dialogue)
- 9 professional roles with role-specific content filtering

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/App.tsx` | Root app, router setup, auth provider |
| `src/app/routes.ts` | All route definitions |
| `src/app/components/AuthContext.tsx` | Auth state, user session, progress tracking |
| `src/app/components/data.ts` | All training content (modules, assessments, scenarios) |
| `src/app/components/api.ts` | Client API wrapper for server calls |
| `src/app/components/security.ts` | RBAC, permission checks |
| `src/app/components/Landing.tsx` | Public landing page (~61KB, largest component) |
| `src/app/components/OnboardingGuide.tsx` | Onboarding tour + Rooty chatbot (~30KB) |
| `supabase/functions/server/index.tsx` | All backend API endpoints (Hono.js) |
| `supabase/functions/server/encryption.tsx` | AES-256-GCM encryption |
| `src/styles/theme.css` | Design tokens and CSS variables |
| `src/styles/tailwind.css` | Tailwind v4 configuration |

## Development Conventions

- **No lock file committed** — install fresh with `npm install`
- **ESM only** — `"type": "module"` in package.json
- **Path alias** — use `@/` to reference `src/` directory (e.g., `@/app/components/button`)
- **Component colocation** — pages, UI components, data, hooks all live in `src/app/components/`
- **No test framework configured** — no test scripts or test files present
- **No linter/formatter configured** — no ESLint, Prettier, or similar
- **Figma Make origin** — components may have Figma-generated patterns; preserve unless refactoring

## Environment Variables

**Client-side** (committed in `utils/supabase/info.tsx`):
- `projectId` — Supabase project identifier
- `publicAnonKey` — Supabase public anon key (safe to expose; RLS protects data)

**Server-side** (Supabase Edge Function secrets, NOT in repo):
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Admin API key (also used as encryption master key)
- `STRIPE_SECRET_KEY` — Stripe payment processing
- `GEMINI_API_KEY` — Google Gemini API for Rooty chatbot

## Common Tasks

### Adding a new route
1. Create component in `src/app/components/`
2. Add route entry in `src/app/routes.ts` under the appropriate parent
3. Add navigation link in `Layout.tsx` sidebar if needed

### Adding a new module
1. Add module definition in `src/app/components/data.ts` (sections, key terms, scenarios)
2. Add pre/post assessment questions in `preAssessmentExpansion.ts` / `postAssessmentExpansion.ts`
3. Module will auto-appear in ModuleList and be accessible via `/modules/:moduleId`

### Adding a new API endpoint
1. Add route handler in `supabase/functions/server/index.tsx` using Hono.js patterns
2. Add client-side fetch call in `src/app/components/api.ts`
3. Encrypt sensitive data using `encrypt()`/`decrypt()` from `encryption.tsx`
4. Add audit logging for sensitive operations

### Adding a new UI component
Follow shadcn/ui pattern: create in `src/app/components/`, use Radix primitives, style with Tailwind + `cn()` utility, use `cva()` for variants.
