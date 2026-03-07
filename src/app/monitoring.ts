/**
 * Monitoring initialization — Sentry (error tracking) + PostHog (analytics).
 * Both are no-ops when the corresponding VITE_ env var is absent, so local dev
 * and preview deployments are unaffected.
 *
 * Required env vars (set in Vercel project settings):
 *   VITE_SENTRY_DSN        — Sentry DSN from sentry.io project settings
 *   VITE_POSTHOG_KEY       — PostHog project API key
 *   VITE_POSTHOG_HOST      — PostHog host (default: https://app.posthog.com)
 */

import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

export function initMonitoring() {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const posthogHost = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://app.posthog.com";

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      // Capture 10 % of transactions for performance monitoring
      tracesSampleRate: 0.1,
      // Don't send errors from localhost
      beforeSend(event) {
        if (window.location.hostname === "localhost") return null;
        return event;
      },
    });
  }

  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      // Respect user privacy — don't record session replays unless opted in
      disable_session_recording: true,
      // Autocapture page views
      capture_pageview: true,
      // Don't send data from localhost
      loaded(ph) {
        if (window.location.hostname === "localhost") ph.opt_out_capturing();
      },
    });
  }
}

/** Track a named event with optional properties. No-op if PostHog not initialised. */
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  try {
    posthog.capture(event, properties);
  } catch {
    // PostHog may not be initialised — swallow silently
  }
}
