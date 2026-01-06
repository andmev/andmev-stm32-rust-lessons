import { SUPPORTED_LANGUAGES, type Language } from '@/constants';

/**
 * Type guard to validate if a string is a supported language code
 * @param lang - The string to validate
 * @returns True if the language is supported, false otherwise
 * @example
 * if (validateLanguage('en')) {
 *   // lang is typed as Language here
 * }
 */
export function validateLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

/**
 * Asserts that a string is a valid language code, throwing an error if not
 * @param lang - The string to validate
 * @returns The validated language code
 * @throws Error if the language is not supported
 * @example
 * const lang = assertLanguage(userInput); // throws if invalid
 */
export function assertLanguage(lang: string): Language {
  if (!validateLanguage(lang)) {
    throw new Error(
      `Invalid language: ${lang}. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`
    );
  }
  return lang;
}
