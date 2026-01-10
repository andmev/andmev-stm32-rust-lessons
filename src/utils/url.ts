import type { Language } from '@/config';

/**
 * Options for building URLs with language and path
 */
export interface UrlOptions {
  /** Language code for the URL */
  lang: Language;
  /** Optional path segment (e.g., 'about', 'lessons/intro') */
  path?: string;
  /** Whether to include trailing slash (default: true) */
  trailing?: boolean;
}

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
 * Unified URL builder with options pattern
 * Constructs URLs with language prefix, optional path, and configurable trailing slash
 * @param options - URL building options
 * @returns Complete URL with base path, language, and optional path segment
 * @example
 * // Language home page
 * buildUrl({ lang: 'en' }) // returns "/en/"
 *
 * // Lesson page
 * buildUrl({ lang: 'en', path: 'getting-started' }) // returns "/en/getting-started/"
 *
 * // Without trailing slash
 * buildUrl({ lang: 'es', path: 'about', trailing: false }) // returns "/es/about"
 */
export function buildUrl({ lang, path = '', trailing = true }: UrlOptions): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const pathSegment = path ? `/${path}` : '';
  const url = `${base}/${lang}${pathSegment}`;
  return trailing ? `${url}/` : url;
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
