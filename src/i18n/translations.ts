/**
 * Centralized translations for the application
 * All UI strings should be defined here for each supported language
 */

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    lessons: 'Lessons',

    // Lesson-related
    lesson: 'Lesson',
    lessonNavigation: 'Lesson navigation',
    previous: 'Previous',
    next: 'Next',
    previousLesson: 'Previous lesson',
    nextLesson: 'Next lesson',

    // Common UI
    loading: 'Loading...',
    error: 'Error',
    notFound: 'Not Found',
    backToHome: 'Back to Home',
    selectLanguage: 'Select language',

    // Meta/SEO
    siteTitle: 'STM32 Rust Lessons',
    siteDescription: 'Learn embedded systems programming with Rust and STM32',
  },
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Acerca de',
    lessons: 'Lecciones',

    // Lesson-related
    lesson: 'Lección',
    lessonNavigation: 'Navegación de lecciones',
    previous: 'Anterior',
    next: 'Siguiente',
    previousLesson: 'Lección anterior',
    nextLesson: 'Lección siguiente',

    // Common UI
    loading: 'Cargando...',
    error: 'Error',
    notFound: 'No encontrado',
    backToHome: 'Volver al inicio',
    selectLanguage: 'Seleccionar idioma',

    // Meta/SEO
    siteTitle: 'Lecciones de STM32 Rust',
    siteDescription: 'Aprende programación de sistemas embebidos con Rust y STM32',
  },
  uk: {
    // Navigation
    home: 'Головна',
    about: 'Про проект',
    lessons: 'Уроки',

    // Lesson-related
    lesson: 'Урок',
    lessonNavigation: 'Навігація уроків',
    previous: 'Попередній',
    next: 'Наступний',
    previousLesson: 'Попередній урок',
    nextLesson: 'Наступний урок',

    // Common UI
    loading: 'Завантаження...',
    error: 'Помилка',
    notFound: 'Не знайдено',
    backToHome: 'Повернутися на головну',
    selectLanguage: 'Вибрати мову',

    // Meta/SEO
    siteTitle: 'Уроки STM32 Rust',
    siteDescription: 'Вивчайте програмування вбудованих систем з Rust та STM32',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    lessons: 'Leçons',

    // Lesson-related
    lesson: 'Leçon',
    lessonNavigation: 'Navigation des leçons',
    previous: 'Précédent',
    next: 'Suivant',
    previousLesson: 'Leçon précédente',
    nextLesson: 'Leçon suivante',

    // Common UI
    loading: 'Chargement...',
    error: 'Erreur',
    notFound: 'Non trouvé',
    backToHome: "Retour à l'accueil",
    selectLanguage: 'Sélectionner la langue',

    // Meta/SEO
    siteTitle: 'Leçons STM32 Rust',
    siteDescription: 'Apprenez la programmation de systèmes embarqués avec Rust et STM32',
  },
  de: {
    // Navigation
    home: 'Startseite',
    about: 'Über',
    lessons: 'Lektionen',

    // Lesson-related
    lesson: 'Lektion',
    lessonNavigation: 'Lektionsnavigation',
    previous: 'Zurück',
    next: 'Weiter',
    previousLesson: 'Vorherige Lektion',
    nextLesson: 'Nächste Lektion',

    // Common UI
    loading: 'Laden...',
    error: 'Fehler',
    notFound: 'Nicht gefunden',
    backToHome: 'Zurück zur Startseite',
    selectLanguage: 'Sprache wählen',

    // Meta/SEO
    siteTitle: 'STM32 Rust Lektionen',
    siteDescription: 'Lernen Sie Embedded-Systemprogrammierung mit Rust und STM32',
  },
} as const;

// Type for supported languages
export type SupportedLanguage = keyof typeof translations;

// Type for translation keys
export type TranslationKey = keyof (typeof translations)['en'];

/**
 * Get translation for a specific key and language
 * @param lang - The language code
 * @param key - The translation key
 * @returns The translated string, or the key itself if translation not found
 */
export function t(lang: SupportedLanguage, key: TranslationKey): string {
  const translation = translations[lang]?.[key];
  if (!translation) {
    console.warn(`Translation not found for key "${key}" in language "${lang}"`);
    return key;
  }
  return translation;
}

/**
 * Create a translation function bound to a specific language
 * @param lang - The language code
 * @returns A function that takes a translation key and returns the translated string
 */
export function createTranslator(lang: SupportedLanguage) {
  return (key: TranslationKey) => t(lang, key);
}
