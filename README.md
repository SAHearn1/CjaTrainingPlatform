
  # RootWork Trauma-Informed Investigation Training Platform

A CJIS-compliant, trauma-informed learning management system (LMS) for criminal justice professionals. Built with React + Vite + Supabase.

## Overview

RootWork equips child abuse investigation professionals with trauma-informed skills through role-differentiated training paths, interactive simulations, and evidence-based assessments.

**Target audience — 9 professional roles:**
- Law Enforcement Officers
- Child Protective Investigators (CPI)
- Prosecuting Attorneys
- Judicial Officers
- Medical Professionals
- School Personnel
- Victim Advocates
- Forensic Interviewers
- Mandated Reporters

**Core frameworks:**
- **5Rs** — Root, Regulate, Reflect, Restore, Reconnect (trauma-informed structure)
- **TRACE** — Trigger → Response → Appraisal → Consequence → Evaluation (cognitive cycle)

## Features

- 7 training modules with role-specific content filtering
- Pre/post assessments with citations and feedback
- Branching simulation scenarios (TRACE-based decision trees)
- Video vignette player with transcript support
- PDF certificate generation on module completion
- Stripe-powered license tiers (Individual / Agency / Enterprise)
- Role-based access control (RBAC) — learner, supervisor, admin, superadmin
- AES-256-GCM encryption on all stored user data (CJIS 5.10.1.2)
- Audit logging for all sensitive operations (CJIS 5.4.7)
- Dark mode toggle
- Accessible UI (WCAG 2.1 AA — skip navigation, focus management)
- "Rooty" AI help chatbot (Google Gemini 2.0 Flash)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + React Router 7 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui + Radix UI |
| Backend | Supabase Edge Functions (Deno + Hono.js) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (JWT) |
| Payments | Stripe |
| AI Chat | Google Gemini 2.0 Flash |
| Encryption | AES-256-GCM (CJIS 5.10.1.2) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (for payments)
- A [Google AI Studio](https://aistudio.google.com) API key (for Rooty chatbot)

### Installation

```bash
git clone https://github.com/SAHearn1/CjaTrainingPlatform.git
cd CjaTrainingPlatform
npm install
```

### Configuration

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for all required variables and where to find them.

The `utils/supabase/info.tsx` file contains the Supabase project ID and public anon key (safe to commit; Row Level Security protects all data).

### Development

```bash
npm run dev      # Start Vite dev server at http://localhost:5173
npm run build    # Production build → dist/
```

### Deployment

A `vercel.json` is included for zero-config Vercel deployment. The build command is `npm run build` and output directory is `dist/`. All routes are rewritten to `index.html` for client-side routing.

For the Supabase Edge Function backend, deploy via the Supabase CLI:

```bash
supabase functions deploy server
```

Set the required secrets in the Supabase dashboard under **Project Settings → Edge Functions → Secrets**.

## Environment Variables

See `.env.example` for the full list. Server-side secrets (Stripe, Gemini, Supabase service role key) must be set as Supabase Edge Function secrets — they are **not** stored in `.env` files.

## Project Structure

```
├── src/app/components/    # React components, pages, data, hooks
│   ├── data.ts            # All training content (~1800 lines)
│   ├── api.ts             # Client API wrapper
│   ├── security.ts        # RBAC permission helpers
│   └── AuthContext.tsx    # Auth state & session management
├── supabase/functions/    # Edge Function backend (Hono.js)
│   └── server/index.tsx   # All API endpoints
├── utils/supabase/        # Supabase client config
└── src/styles/            # Tailwind + theme CSS variables
```

## Security

This platform is designed for CJIS (Criminal Justice Information Services) compliance:

- **CJIS 5.4** — Role-Based Access Control enforced on all endpoints
- **CJIS 5.5** — Session inactivity timeout with automatic logout
- **CJIS 5.10.1.2** — AES-256-GCM encryption on all PII stored in the database
- **CJIS 5.4.7** — Audit logging for all sensitive operations

## License

Private — all rights reserved. Not for redistribution.
  