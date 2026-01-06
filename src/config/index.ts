export const config = {
  languages: {
    default: 'en',
    supported: ['en', 'es', 'uk', 'fr', 'de'],
    names: {
      en: 'English',
      es: 'Español',
      uk: 'Українська',
      fr: 'Français',
      de: 'Deutsch',
    },
  },
  site: {
    title: 'STM32 Rust Lessons',
  },
} as const;

// Types derived from config
export type Language = (typeof config.languages.supported)[number];
