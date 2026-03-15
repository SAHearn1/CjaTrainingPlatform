# Lint Hygiene Plan

## Scope

This document tracks the current ESLint backlog in `src/` without changing application code. It exists so cleanup can proceed in bounded batches while CI keeps the issues visible.

Current verification state:

- `pnpm typecheck`: passing
- `pnpm test`: passing
- `pnpm lint`: failing

## First Failing Boundaries

The first meaningful boundary is not TypeScript or tests. It is ESLint on `src/`.

The first concrete failures observed are:

1. `no-empty`
   File: `src/app/components/AdminDashboard.tsx`
   Boundary: empty catch/guard blocks are now rejected and need explicit handling.

2. `jsx-a11y/no-static-element-interactions` and `jsx-a11y/click-events-have-key-events`
   File: `src/app/components/AdminVideos.tsx`
   Boundary: clickable `div`-style UI needs keyboard support or native interactive elements.

3. `react-hooks/set-state-in-effect`
   File: `src/app/components/CertificateVerify.tsx`
   Boundary: synchronous state updates inside effects need to be refactored into derived state, guarded render paths, or async callbacks.

4. `jsx-a11y/label-has-associated-control`
   Files: `Landing.tsx`, `Licensing.tsx`, `Settings.tsx`, `TTSControls.tsx`
   Boundary: several forms are missing explicit `htmlFor`/control wiring.

5. `react-hooks/purity`
   Files: `Licensing.tsx`, `TTSControls.tsx`, `VideoVignette.tsx`, `ui/sidebar.tsx`
   Boundary: render-time `Date.now()` and `Math.random()` calls violate React purity rules.

6. `jsx-a11y/media-has-caption`
   File: `src/app/components/VideoEmbed.tsx`
   Boundary: video output needs track/caption handling.

## Backlog Shape

The current lint backlog is concentrated in a few categories:

- Accessibility: labels, interactive non-semantic elements, invalid anchors, missing media captions, empty heading/anchor content
- React hooks and purity: set-state-in-effect, missing effect dependencies, render-time impure calls
- General correctness: empty blocks, `@ts-ignore`, unnecessary escapes
- Type hygiene: `any` and unused variables

This means the cleanup should not be done as a single broad sweep. It should be done by rule family, starting with errors that affect runtime semantics or accessibility.

## Recommended Remediation Order

1. Fix all ESLint `error` entries before touching warnings.
2. Start with shared patterns that unlock multiple files:
   - replace non-semantic clickable containers with buttons
   - connect labels to inputs
   - remove render-time `Math.random()` / `Date.now()`
   - replace empty blocks with explicit comments or error handling
3. Then resolve isolated file-level errors:
   - `CertificateVerify.tsx`
   - `VideoEmbed.tsx`
   - `security.ts`
   - `ui/card.tsx`
   - `ui/pagination.tsx`
4. Burn down warnings in batches after `pnpm lint` is error-free.

## Batch Plan

Suggested cleanup batches:

1. Accessibility batch
   Files: `AdminVideos.tsx`, `Landing.tsx`, `Layout.tsx`, `Licensing.tsx`, `Settings.tsx`, `TTSControls.tsx`, `VideoEmbed.tsx`, `ui/card.tsx`, `ui/pagination.tsx`

2. React purity and hook semantics batch
   Files: `CertificateVerify.tsx`, `Licensing.tsx`, `LicensingSuccess.tsx`, `TTSControls.tsx`, `VideoVignette.tsx`, `ui/sidebar.tsx`

3. General correctness batch
   Files: `AdminDashboard.tsx`, `useAmbientAudio.ts`, `security.ts`

4. Warning cleanup batch
   Files with `any`, unused symbols, and missing hook dependencies across `src/app/components`

## Exit Criteria

The hygiene backlog is resolved when all of the following are true:

- `pnpm lint` exits `0`
- `pnpm typecheck` exits `0`
- `pnpm test` exits `0`
- CI can remove `continue-on-error: true` from the lint step

## Notes

- The CI workflow currently keeps lint non-blocking because the backlog is pre-existing.
- Once the backlog is cleared, the lint step should be made required again immediately.
