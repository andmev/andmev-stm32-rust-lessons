import { defineMiddleware } from 'astro:middleware';
import { getDefaultLanguage } from '@/utils/languages.ts';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // If the request is for the root URL, we need to redirect to the default language
  if (url.pathname === '/') {
    const acceptLanguage = context.request.headers.get('accept-language');
    const defaultLang = await getDefaultLanguage(acceptLanguage);

    return context.redirect(`/${defaultLang}/`);
  }

  return next();
});
