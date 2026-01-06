// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import { visualizer } from 'rollup-plugin-visualizer';

// Validate environment configuration
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// Log configuration for visibility during builds
if (process.env.NODE_ENV !== 'test') {
  console.log('[Astro Config] Build mode:', isGitHubPages ? 'GitHub Pages' : 'Local/Other');
}

export default defineConfig({
  // Keep local dev at root; only prepend the repo path when building for GitHub Pages.
  site: isGitHubPages
    ? 'https://andmev.github.io/andmev-stm32-rust-lessons'
    : 'http://localhost:4321',
  base: isGitHubPages ? '/andmev-stm32-rust-lessons' : '/',
  prefetch: true,

  // Enable Content Security Policy with hash-based approach (no unsafe-inline)
  experimental: {
    csp: {
      algorithm: 'SHA-256',
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
      scriptDirective: {
        resources: [],
      },
    },
  },
  vite: {
    plugins: [
      // @ts-expect-error - Vite plugin type mismatch between Astro's bundled Vite and external plugins
      tailwindcss(),
      // Bundle analyzer - run with: ANALYZE=true npm run build
      ...(process.env.ANALYZE
        ? [
            visualizer({
              open: true,
              gzipSize: true,
              brotliSize: true,
              filename: 'dist/stats.html',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  integrations: [
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            keepBackground: false,
          },
        ],
        rehypeSlug,
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
      ],
      remarkPlugins: [remarkGithubBlockquoteAlert],
      gfm: true,
    }),
    preact(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
          uk: 'uk',
          fr: 'fr',
          de: 'de',
        },
      },
    }),
  ],
});
