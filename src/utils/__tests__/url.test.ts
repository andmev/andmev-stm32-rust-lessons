import { describe, it, expect } from 'vitest';
import { withBase, getLessonUrl, getLanguageUrl } from '../url';

describe('withBase', () => {
  it('should prepend base path to a path', () => {
    const result = withBase('/en/lesson');
    // Result depends on BASE_URL environment variable
    expect(result).toContain('/en/lesson');
  });

  it('should not add double slashes', () => {
    const result = withBase('/test');
    expect(result).not.toContain('//');
  });
});

describe('getLessonUrl', () => {
  it('should create correct lesson URL', () => {
    const result = getLessonUrl('en', 'getting-started');
    expect(result).toContain('/en/getting-started/');
  });

  it('should handle different languages', () => {
    const resultEs = getLessonUrl('es', 'introduccion');
    expect(resultEs).toContain('/es/introduccion/');

    const resultUk = getLessonUrl('uk', 'pochinaemo');
    expect(resultUk).toContain('/uk/pochinaemo/');
  });

  it('should end with trailing slash', () => {
    const result = getLessonUrl('en', 'lesson-1');
    expect(result).toMatch(/\/$/);
  });
});

describe('getLanguageUrl', () => {
  it('should create language home URL without page parameter', () => {
    const result = getLanguageUrl('en');
    expect(result).toContain('/en/');
  });

  it('should create language page URL with page parameter', () => {
    const result = getLanguageUrl('en', 'about');
    expect(result).toContain('/en/about/');
  });

  it('should handle different languages', () => {
    const resultEs = getLanguageUrl('es');
    expect(resultEs).toContain('/es/');

    const resultUk = getLanguageUrl('uk', 'about');
    expect(resultUk).toContain('/uk/about/');
  });

  it('should end with trailing slash', () => {
    const result = getLanguageUrl('en', 'about');
    expect(result).toMatch(/\/$/);
  });
});
