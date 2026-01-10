import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // This site is built as `output: "static"`.
  // Avoid relying on middleware redirects for language selection; the root `/`
  // is rendered as English by default (Apple-style), and users can switch via the picker.

  const response = await next();

  // NOTE: These security headers only apply during local development (astro dev/preview)
  // For production on GitHub Pages, security headers are configured in public/_headers
  // Astro middleware runs during SSG build, not at request time for static sites
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
});
