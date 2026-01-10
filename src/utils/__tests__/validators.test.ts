import { describe, it, expect } from 'vitest';
import { validateLanguage } from '../validators';

describe('validateLanguage', () => {
  it('should return true for supported languages', () => {
    expect(validateLanguage('en')).toBe(true);
    expect(validateLanguage('es')).toBe(true);
    expect(validateLanguage('uk')).toBe(true);
    expect(validateLanguage('fr')).toBe(true);
    expect(validateLanguage('de')).toBe(true);
  });

  it('should return false for unsupported languages', () => {
    expect(validateLanguage('ja')).toBe(false);
    expect(validateLanguage('zh')).toBe(false);
    expect(validateLanguage('ru')).toBe(false);
    expect(validateLanguage('pt')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateLanguage('')).toBe(false);
  });

  it('should return false for invalid input', () => {
    expect(validateLanguage('invalid')).toBe(false);
    expect(validateLanguage('123')).toBe(false);
    expect(validateLanguage('en-US')).toBe(false);
  });

  it('should be case sensitive', () => {
    expect(validateLanguage('EN')).toBe(false);
    expect(validateLanguage('En')).toBe(false);
    expect(validateLanguage('ES')).toBe(false);
  });

  it('should handle strings with special characters', () => {
    expect(validateLanguage('en!')).toBe(false);
    expect(validateLanguage('es@')).toBe(false);
    expect(validateLanguage('uk#')).toBe(false);
  });

  it('should act as type guard', () => {
    const lang: string = 'en';
    if (validateLanguage(lang)) {
      // TypeScript should narrow the type to Language here
      const typedLang: 'en' | 'es' | 'uk' | 'fr' | 'de' = lang;
      expect(typedLang).toBe('en');
    }
  });
});
