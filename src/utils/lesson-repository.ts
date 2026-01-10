/**
 * Repository pattern for lesson collection queries
 * Provides domain-specific methods for accessing and filtering lessons
 */

import { getLessons } from './collections';
import type { CollectionEntry } from 'astro:content';

export interface LessonNavigation {
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}

/**
 * Get all lessons for a specific language, sorted by order
 * @param lang - The language code
 * @returns Array of lessons for the specified language
 */
export async function getLessonsByLanguage(lang: string): Promise<CollectionEntry<'lessons'>[]> {
  const lessons = await getLessons();
  return lessons
    .filter((lesson) => lesson.id.startsWith(`${lang}/lessons/`))
    .sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get a specific lesson by language and slug
 * @param lang - The language code
 * @param slug - The lesson slug (URL-friendly name)
 * @returns The lesson entry or undefined if not found
 */
export async function getLessonBySlug(
  lang: string,
  slug: string
): Promise<CollectionEntry<'lessons'> | undefined> {
  const lessons = await getLessonsByLanguage(lang);

  return lessons.find((lesson) => {
    const defaultSlug = lesson.id.replace(`${lang}/lessons/`, '').replace('.mdx', '');
    const lessonSlug = lesson.data.url || defaultSlug;
    return lessonSlug === slug;
  });
}

/**
 * Get lessons by category for a specific language
 * @param lang - The language code
 * @param category - The lesson category
 * @returns Array of lessons in the specified category
 */
export async function getLessonsByCategory(
  lang: string,
  category: string
): Promise<CollectionEntry<'lessons'>[]> {
  const lessons = await getLessonsByLanguage(lang);
  return lessons.filter((lesson) => lesson.data.category === category);
}

/**
 * Get all unique categories for a language
 * @param lang - The language code
 * @returns Array of unique category names
 */
export async function getCategoriesByLanguage(lang: string): Promise<string[]> {
  const lessons = await getLessonsByLanguage(lang);
  const categories = lessons.map((lesson) => lesson.data.category);
  return Array.from(new Set(categories));
}

/**
 * Get previous and next lessons for navigation
 * @param lang - The language code
 * @param currentSlug - The current lesson slug
 * @returns Object with prev and next lesson info, or null if not available
 */
export async function getLessonNavigation(
  lang: string,
  currentSlug: string
): Promise<LessonNavigation> {
  const lessons = await getLessonsByLanguage(lang);

  // Map lessons to include their slugs
  const lessonsWithSlugs = lessons.map((lesson) => {
    const defaultSlug = lesson.id.replace(`${lang}/lessons/`, '').replace('.mdx', '');
    const slug = lesson.data.url || defaultSlug;
    return { ...lesson, slug };
  });

  // Find current lesson index
  const currentIndex = lessonsWithSlugs.findIndex((lesson) => lesson.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // Get prev and next lessons
  const prevLesson = currentIndex > 0 ? lessonsWithSlugs[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessonsWithSlugs.length - 1 ? lessonsWithSlugs[currentIndex + 1] : null;

  return {
    prev: prevLesson ? { title: prevLesson.data.title, slug: prevLesson.slug } : null,
    next: nextLesson ? { title: nextLesson.data.title, slug: nextLesson.slug } : null,
  };
}

/**
 * Get total lesson count for a language
 * @param lang - The language code
 * @returns Number of lessons
 */
export async function getLessonCount(lang: string): Promise<number> {
  const lessons = await getLessonsByLanguage(lang);
  return lessons.length;
}

/**
 * Check if a lesson exists for a given language and slug
 * @param lang - The language code
 * @param slug - The lesson slug
 * @returns True if lesson exists, false otherwise
 */
export async function lessonExists(lang: string, slug: string): Promise<boolean> {
  const lesson = await getLessonBySlug(lang, slug);
  return lesson !== undefined;
}
