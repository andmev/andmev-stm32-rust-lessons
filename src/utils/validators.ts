import { config, type Language } from '@/config';

const SUPPORTED_LANGUAGES = config.languages.supported;

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
