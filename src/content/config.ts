import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

/**
 * Custom Zod validators for content validation
 */

// YouTube video ID validator (11 characters, alphanumeric plus underscore and hyphen)
const youtubeIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]{11}$/, 'YouTube ID must be exactly 11 characters (a-zA-Z0-9_-)')
  .optional();

// URL slug validator (lowercase alphanumeric with hyphens, or empty string)
const urlSlugSchema = z
  .string()
  .regex(/^[a-z0-9-]*$/, 'URL slug must contain only lowercase letters, numbers, and hyphens')
  .optional();

// Category validator (any non-empty string)
const categorySchema = z.string().min(1, 'Category cannot be empty');

// Canonical URL validator (must be valid URL)
const canonicalUrlSchema = z.string().url('Canonical URL must be a valid URL').optional();

// Title validator (reasonable length constraints)
const titleSchema = z.string().min(1, 'Title cannot be empty').max(100, 'Title too long (max 100)');

// Description validator (reasonable length constraints)
const descriptionSchema = z
  .string()
  .min(10, 'Description too short (min 10)')
  .max(300, 'Description too long (max 300)');

// Order validator (must be positive integer)
const orderSchema = z.number().int().positive('Order must be a positive integer');

const lessonsCollection = defineCollection({
  loader: glob({ pattern: '*/lessons/*.mdx', base: './src/content' }),
  schema: z.object({
    title: titleSchema,
    description: descriptionSchema,
    order: orderSchema,
    category: categorySchema,
    url: urlSlugSchema,
    youtube_id: youtubeIdSchema,
    // SEO & Open Graph
    ogTitle: z.string().max(70, 'OG title too long (max 70 for optimal display)').optional(),
    ogDescription: z
      .string()
      .max(200, 'OG description too long (max 200 for optimal display)')
      .optional(),
    ogImage: z.string().url('OG image must be a valid URL').optional(),
    ogType: z.enum(['website', 'article']).default('article'),
    twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
    canonicalUrl: canonicalUrlSchema,
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '*/{home,about}.mdx', base: './src/content' }),
  schema: z.object({
    name: z.string().min(1, 'Page name cannot be empty'),
    title: titleSchema,
    description: descriptionSchema.optional(),
    url: urlSlugSchema,
    order: orderSchema,
    // SEO & Open Graph
    ogTitle: z.string().max(70, 'OG title too long (max 70 for optimal display)').optional(),
    ogDescription: z
      .string()
      .max(200, 'OG description too long (max 200 for optimal display)')
      .optional(),
    ogImage: z.string().url('OG image must be a valid URL').optional(),
    ogType: z.enum(['website', 'article']).default('website'),
    twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
    canonicalUrl: canonicalUrlSchema,
  }),
});

export const collections = {
  lessons: lessonsCollection,
  pages: pagesCollection,
};
