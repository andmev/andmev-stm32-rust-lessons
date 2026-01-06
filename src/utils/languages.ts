import { getLessons } from '@/utils/collections';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/constants';
import { validateLanguage } from '@/utils/validators';

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

  const lessons = await getLessons();

  // Extract unique language codes from lesson IDs (e.g., "en/lessons/getting-started" -> "en")
  const languages = new Set<string>();

  lessons.forEach((lesson) => {
    const lang = lesson.id.split('/')[0];
    if (lang) {
      // Validate against supported languages
      if (!validateLanguage(lang)) {
        console.warn(
          `[getAvailableLanguages] Unsupported language detected: ${lang}. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`
        );
        return;
      }
      languages.add(lang);
    }
  });

  const sortedLanguages = Array.from(languages).sort((a, b) => a.localeCompare(b));

  // Error handling: if no languages detected, log error and return fallback
  if (sortedLanguages.length === 0) {
    // Always log critical errors, even in production
    console.error(
      '[getAvailableLanguages] No languages detected in content collections, falling back to default'
    );
    cachedLanguages = [DEFAULT_LANGUAGE];
    return cachedLanguages;
  }

  // Cache the result
  cachedLanguages = sortedLanguages;
  return cachedLanguages;
}

/**
 * matches a language code against available languages.
 * handles cases like 'en-US' -> 'en'.
 */
function matchLanguage(code: string, availableLanguages: string[]): string | undefined {
  const cleanCode = code.split('-')[0].toLowerCase();
  return availableLanguages.find((lang) => lang === cleanCode);
}

/**
 * Parses and sorts Accept-Language header to find the best matching language.
 */
function getLanguageFromHeader(header: string, availableLanguages: string[]): string | undefined {
  const languages = header
    .split(',')
    .map((lang) => {
      const [code, q] = lang.split(';');
      return {
        code: code.trim(),
        quality: q ? Number.parseFloat(q.split('=')[1]) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    const match = matchLanguage(lang.code, availableLanguages);
    if (match) return match;
  }
  return undefined;
}

/**
 * Detects language from browser navigator properties.
 */
function getLanguageFromBrowser(availableLanguages: string[]): string | undefined {
  if (typeof navigator === 'undefined') return undefined;

  // Check navigator.languages
  if (navigator.languages) {
    for (const lang of navigator.languages) {
      const match = matchLanguage(lang, availableLanguages);
      if (match) return match;
    }
  }

  // Check navigator.language
  if (navigator.language) {
    return matchLanguage(navigator.language, availableLanguages);
  }

  return undefined;
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

  if (acceptLanguageHeader) {
    const serverMatch = getLanguageFromHeader(acceptLanguageHeader, availableLanguages);
    if (serverMatch) return serverMatch;
  }

  const browserMatch = getLanguageFromBrowser(availableLanguages);
  if (browserMatch) return browserMatch;

  return DEFAULT_LANGUAGE;
}
