import type * as Sentry from '@sentry/astro';

/**
 * Creates a beforeSend hook for Sentry that scrubs sensitive data
 * This unified function is used by both client and server Sentry configurations
 * to ensure consistent GDPR-compliant data handling
 *
 * @param isClient - Whether this is running in the client or server context
 * @returns A beforeSend hook that removes cookies, query params, and emails
 */
export function createSentryBeforeSend(
  isClient: boolean
): NonNullable<Sentry.BrowserOptions['beforeSend']> {
  return (event, _hint) => {
    // Remove cookies from request data
    if (event.request) {
      delete event.request.cookies;

      // Remove query parameters from URLs that might contain sensitive data
      if (event.request.url) {
        try {
          const url = new URL(event.request.url);
          // Keep only the pathname and origin, remove query params
          event.request.url = url.origin + url.pathname;
        } catch (error) {
          // URL parsing failed - log in development (client only), keep original URL in production
          if (isClient && !import.meta.env.PROD) {
            console.warn('Failed to parse request URL for sanitization:', error);
          }
          // Server errors are silently kept as-is in production
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
          } catch (error) {
            // URL parsing failed - log in development (client only), keep original in production
            if (isClient && !import.meta.env.PROD) {
              console.warn('Failed to parse breadcrumb URL for sanitization:', error);
            }
            // Server errors are silently kept as-is in production
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
  };
}
