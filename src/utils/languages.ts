import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANGUAGE, LANGUAGE_DISPLAY_NAMES } from '@/constants';

/**
 * Re-export language names for backward compatibility
 */
export const LANGUAGE_NAMES = LANGUAGE_DISPLAY_NAMES;

/**
 * Cache for available languages to avoid repeated collection scans
 */
let cachedLanguages: string[] | null = null;

/**
 * Auto-detect available languages from content directory structure
 * Languages are detected from top-level directories in src/content/
 * Results are cached to improve performance during build
 * @returns Array of available language codes
 */
export async function getAvailableLanguages(): Promise<string[]> {
  // Return cached result if available
  if (cachedLanguages !== null) {
    return cachedLanguages;
  }

  const lessons = await getCollection('lessons');

  // Extract unique language codes from lesson IDs (e.g., "en/lessons/getting-started" -> "en")
  const languages = new Set<string>();

  lessons.forEach((lesson: CollectionEntry<'lessons'>) => {
    const lang = lesson.id.split('/')[0];
    if (lang) {
      languages.add(lang);
    }
  });

  const sortedLanguages = Array.from(languages).sort();

  // Error handling: if no languages detected, warn and return fallback
  if (sortedLanguages.length === 0) {
    if (import.meta.env.DEV) {
      console.warn('No languages detected in content collections, falling back to default');
    }
    cachedLanguages = [DEFAULT_LANGUAGE];
    return cachedLanguages;
  }

  // Cache the result
  cachedLanguages = sortedLanguages;
  return cachedLanguages;
}

/**
 * Detects the user's preferred language from browser or Accept-Language header
 * Tries multiple detection methods in order of priority:
 * 1. Server-side: Parse Accept-Language header with quality values
 * 2. Client-side: Check navigator.languages array
 * 3. Client-side fallback: Check navigator.language
 * 4. Ultimate fallback: Return 'en'
 *
 * Only returns languages that are actually available in the content collections
 *
 * @param acceptLanguageHeader - Optional Accept-Language header for server-side detection
 *   Format: "en-US,en;q=0.9,es;q=0.8" (standard HTTP Accept-Language)
 * @returns Promise resolving to a supported language code (e.g., 'en', 'es')
 * @example
 * // Server-side with header
 * await getDefaultLanguage('es-ES,es;q=0.9,en;q=0.8') // returns 'es' if available
 *
 * // Client-side (no parameter)
 * await getDefaultLanguage() // returns language from navigator.languages or 'en'
 */
export async function getDefaultLanguage(acceptLanguageHeader?: string | null): Promise<string> {
  const availableLanguages = await getAvailableLanguages();
  const fallback = 'en';

  // Helper to match language code (e.g. 'en-US' -> 'en') against available languages
  const findMatch = (code: string) => {
    const cleanCode = code.split('-')[0].toLowerCase();
    return availableLanguages.find((lang) => lang === cleanCode);
  };

  // 1. Check Accept-Language header (Server-side)
  if (acceptLanguageHeader) {
    // Parse Accept-Language header: "en-US,en;q=0.9,es;q=0.8"
    const languages = acceptLanguageHeader
      .split(',')
      .map((lang) => {
        const [code, q] = lang.split(';');
        return {
          code: code.trim(),
          quality: q ? parseFloat(q.split('=')[1]) : 1.0,
        };
      })
      .sort((a, b) => b.quality - a.quality); // Sort by quality desc

    for (const lang of languages) {
      const match = findMatch(lang.code);
      if (match) return match;
    }
  }

  // 2. Check navigator.languages (Client-side)
  if (typeof navigator !== 'undefined' && navigator.languages) {
    for (const lang of navigator.languages) {
      const match = findMatch(lang);
      if (match) return match;
    }
  }

  // 3. Fallback to navigator.language (Client-side fallback)
  if (typeof navigator !== 'undefined' && navigator.language) {
    const match = findMatch(navigator.language);
    if (match) return match;
  }

  // 4. Ultimate fallback
  return fallback;
}
