export const translations = {
  en: { lesson: 'Lesson' },
  es: { lesson: 'Lección' },
  uk: { lesson: 'Урок' },
  fr: { lesson: 'Leçon' },
  de: { lesson: 'Lektion' },
};

export function t(lang: string, key: keyof (typeof translations)['en']): string {
  return translations[lang as keyof typeof translations]?.[key] ?? translations.en[key];
}
