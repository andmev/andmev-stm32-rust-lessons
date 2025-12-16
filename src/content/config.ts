import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const lessonsCollection = defineCollection({
  loader: glob({ pattern: '*/lessons/*.mdx', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    category: z.string(),
    url: z.string().optional(),
    youtube_id: z.string().optional(),
    // SEO & Open Graph
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogType: z.enum(['website', 'article']).default('article'),
    twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
    canonicalUrl: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '*/{home,about}.mdx', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    order: z.number(),
    // SEO & Open Graph
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogType: z.enum(['website', 'article']).default('website'),
    twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
    canonicalUrl: z.string().optional(),
  }),
});

export const collections = {
  lessons: lessonsCollection,
  pages: pagesCollection,
};
