import * as Sentry from '@sentry/astro';

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

  // Scrub sensitive data before sending to Sentry
  beforeSend(event, _hint) {
    // Remove cookies from request data
    if (event.request) {
      delete event.request.cookies;

      // Remove query parameters from URLs that might contain sensitive data
      if (event.request.url) {
        try {
          const url = new URL(event.request.url);
          // Keep only the pathname and origin, remove query params
          event.request.url = url.origin + url.pathname;
        } catch {
          // URL parsing failed - silently keep original URL in production
          // (no console logging on server in production)
        }
      }
    }

    // Scrub sensitive data from breadcrumbs
    if (event.breadcrumbs && event.breadcrumbs.length > 0) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data?.url) {
          try {
            const url = new URL(breadcrumb.data.url);
            // Remove query parameters and hash from breadcrumb URLs
            url.search = '';
            url.hash = '';
            breadcrumb.data.url = url.toString();
          } catch {
            // URL parsing failed - silently keep original in production
          }
        }
        return breadcrumb;
      });
    }

    // Remove user email if accidentally captured
    if (event.user?.email) {
      delete event.user.email;
    }

    return event;
  },
});
