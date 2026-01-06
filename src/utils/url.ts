/**
 * Prepends the configured base URL to a given path
 * Handles both root deployments and subdirectory deployments (e.g., GitHub Pages)
 * @param path - The path to prepend the base URL to (should start with /)
 * @returns The complete URL with base path prepended
 * @example
 * // With BASE_URL = "/"
 * withBase("/en/lesson") // returns "/en/lesson"
 *
 * // With BASE_URL = "/my-site/"
 * withBase("/en/lesson") // returns "/my-site/en/lesson"
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

/**
 * Generates a complete URL for a lesson page with base path and language prefix
 * @param lang - The language code (e.g., 'en', 'es')
 * @param lessonIdOrUrl - The lesson identifier or custom URL slug
 * @returns Complete lesson URL with trailing slash
 * @example
 * getLessonUrl('en', 'getting-started') // returns "/en/getting-started/"
 */
export function getLessonUrl(lang: string, lessonIdOrUrl: string): string {
  return withBase(`/${lang}/${lessonIdOrUrl}/`);
}

/**
 * Generates a language-prefixed URL for a page or language home
 * @param lang - The language code (e.g., 'en', 'es')
 * @param page - Optional page slug (omit for language home page)
 * @returns Complete page URL with trailing slash
 * @example
 * getLanguageUrl('en') // returns "/en/"
 * getLanguageUrl('en', 'about') // returns "/en/about/"
 */
export function getLanguageUrl(lang: string, page?: string): string {
  return withBase(`/${lang}${page ? '/' + page : ''}/`);
}
