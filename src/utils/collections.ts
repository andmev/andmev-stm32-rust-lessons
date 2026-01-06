import { getCollection, type CollectionEntry } from 'astro:content';

let lessonsCache: CollectionEntry<'lessons'>[] | null = null;
let pagesCache: CollectionEntry<'pages'>[] | null = null;

export async function getLessons() {
  lessonsCache ??= await getCollection('lessons');
  return lessonsCache;
}

export async function getPages() {
  pagesCache ??= await getCollection('pages');
  return pagesCache;
}
