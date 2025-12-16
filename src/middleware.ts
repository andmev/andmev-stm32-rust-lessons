import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // This site is built as `output: "static"`.
  // Avoid relying on middleware redirects for language selection; the root `/`
  // is rendered as English by default (Apple-style), and users can switch via the picker.
  return next();
});
