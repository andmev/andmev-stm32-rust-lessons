import { getCollection, type CollectionEntry } from 'astro:content';

let lessonsCache: CollectionEntry<'lessons'>[] | null = null;
let pagesCache: CollectionEntry<'pages'>[] | null = null;

/**
 * Get all lessons with caching
 * @returns Promise resolving to array of lesson entries
 * @note Non-null assertion is safe because getCollection() always returns an array
 */
export async function getLessons(): Promise<CollectionEntry<'lessons'>[]> {
  lessonsCache ??= await getCollection('lessons');
  return lessonsCache!;
}

/**
 * Get all pages with caching
 * @returns Promise resolving to array of page entries
 * @note Non-null assertion is safe because getCollection() always returns an array
 */
export async function getPages(): Promise<CollectionEntry<'pages'>[]> {
  pagesCache ??= await getCollection('pages');
  return pagesCache!;
}
