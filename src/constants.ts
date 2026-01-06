export const DEFAULT_LANGUAGE = 'en' as const;
export const SUPPORTED_LANGUAGES = ['en', 'es', 'uk', 'fr', 'de'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  uk: 'Українська',
  fr: 'Français',
  de: 'Deutsch',
} as const;
