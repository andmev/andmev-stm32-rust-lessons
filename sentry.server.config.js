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

  // Scrub sensitive data before sending to Sentry (unified server logic)
  beforeSend: createSentryBeforeSend(false),
});
