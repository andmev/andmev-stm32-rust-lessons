import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDefaultLanguage, getAvailableLanguages } from '../languages';

// Mock Astro content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => [
    { id: 'en/lessons/getting-started.mdx' },
    { id: 'en/lessons/rust-basics.mdx' },
    { id: 'es/lessons/introduccion.mdx' },
    { id: 'uk/lessons/pochinaemo.mdx' },
  ]),
}));

describe('getAvailableLanguages', () => {
  it('should extract unique language codes from lesson IDs', async () => {
    const languages = await getAvailableLanguages();
    expect(languages).toEqual(['en', 'es', 'uk']);
  });

  it('should return sorted language codes', async () => {
    const languages = await getAvailableLanguages();
    expect(languages[0]).toBe('en');
    expect(languages[1]).toBe('es');
    expect(languages[2]).toBe('uk');
  });
});

describe('getDefaultLanguage', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  it('should return "en" for Accept-Language: en-US,en;q=0.9', async () => {
    const result = await getDefaultLanguage('en-US,en;q=0.9');
    expect(result).toBe('en');
  });

  it('should return "es" for Accept-Language: es-ES,es;q=0.9', async () => {
    const result = await getDefaultLanguage('es-ES,es;q=0.9');
    expect(result).toBe('es');
  });

  it('should return "uk" for Accept-Language: uk-UA,uk;q=0.9', async () => {
    const result = await getDefaultLanguage('uk-UA,uk;q=0.9');
    expect(result).toBe('uk');
  });

  it('should respect quality values and return highest priority available language', async () => {
    const result = await getDefaultLanguage('fr;q=0.5,es;q=0.9,en;q=0.7');
    expect(result).toBe('es');
  });

  it('should fallback to "en" when no match found', async () => {
    const result = await getDefaultLanguage('ja-JP,ja;q=0.9');
    expect(result).toBe('en');
  });

  it('should fallback to "en" when Accept-Language header is empty', async () => {
    const result = await getDefaultLanguage('');
    expect(result).toBe('en');
  });

  it('should fallback to "en" when Accept-Language header is null', async () => {
    const result = await getDefaultLanguage(null);
    expect(result).toBe('en');
  });

  it('should handle complex Accept-Language headers with multiple languages', async () => {
    const result = await getDefaultLanguage('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6');
    // fr is not in available languages, so should fall back to en
    expect(result).toBe('en');
  });

  it('should match language codes case-insensitively', async () => {
    const result = await getDefaultLanguage('EN-US,EN;q=0.9');
    expect(result).toBe('en');
  });

  it('should extract base language code from locale-specific codes', async () => {
    const result = await getDefaultLanguage('es-MX');
    expect(result).toBe('es');
  });
});
