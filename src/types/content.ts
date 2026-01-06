import type { CollectionEntry } from 'astro:content';

/**
 * Lesson content type from the 'lessons' collection
 */
export type Lesson = CollectionEntry<'lessons'>;

/**
 * Page content type from the 'pages' collection
 */
export type Page = CollectionEntry<'pages'>;

/**
 * Lesson with computed slug property
 * The slug is either the custom URL from frontmatter or derived from the file ID
 */
export interface LessonWithSlug extends Lesson {
  slug: string;
}

/**
 * Lesson metadata for SEO and Open Graph
 */
export interface LessonMetadata {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

/**
 * Page metadata for SEO and Open Graph
 */
export interface PageMetadata {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}
