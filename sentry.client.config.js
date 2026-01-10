import * as Sentry from '@sentry/astro';
import { createSentryBeforeSend } from './src/utils/sentry-config';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,

  // GDPR Compliance: Do not send personally identifiable information by default
  // This prevents automatic collection of IP addresses, user agents, cookies, etc.
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Performance Monitoring: Sample 10% of transactions in production
  // Adjust this value based on your traffic volume and monitoring needs
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1,

  // Environment detection
  environment: import.meta.env.PROD ? 'production' : 'development',

  // Scrub sensitive data before sending to Sentry (unified client logic)
  beforeSend: createSentryBeforeSend(true),

  // Integrations for enhanced monitoring
  integrations: [
    // Session Replay: Capture visual reproduction of user sessions
    // Records 10% of normal sessions and 100% of sessions with errors
    // https://docs.sentry.io/platforms/javascript/session-replay/
    Sentry.replayIntegration({
      // Mask all text and input content for privacy
      maskAllText: true,
      maskAllInputs: true,
      // Block media elements to reduce payload size
      blockAllMedia: true,
    }),
  ],

  // Session Replay sampling rates
  // Capture 10% of all sessions for general monitoring
  replaysSessionSampleRate: 0.1,
  // Capture 100% of sessions where an error occurs
  replaysOnErrorSampleRate: 1,
});
