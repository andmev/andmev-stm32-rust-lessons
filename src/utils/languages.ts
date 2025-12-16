import { getCollection } from 'astro:content';

/**
 * Language display names mapping
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  uk: 'Українська',
  fr: 'Français',
  de: 'Deutsch',
};

/**
 * Auto-detect available languages from content directory structure
 * Languages are detected from top-level directories in src/content/
 * @returns Array of available language codes
 */
export async function getAvailableLanguages(): Promise<string[]> {
  const lessons = await getCollection('lessons');

  // Extract unique language codes from lesson IDs (e.g., "en/lessons/getting-started" -> "en")
  const languages = new Set<string>();

  lessons.forEach((lesson) => {
    const lang = lesson.id.split('/')[0];
    if (lang) {
      languages.add(lang);
    }
  });

  return Array.from(languages).sort();
}

/**
 * Get the default language
 * Tries to detect browser language, checks availability, and falls back to 'en'
 * This function works in both client and server contexts (via optional Accept-Language header)
 * @param acceptLanguageHeader - Optional Accept-Language header string (for server-side)
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
