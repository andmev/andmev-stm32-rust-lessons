// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sentry from '@sentry/astro';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import { visualizer } from 'rollup-plugin-visualizer';
import { config } from './src/config/index.ts';

// Validate environment configuration
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// Generate sitemap locales dynamically from config
// This ensures single source of truth for supported languages
const sitemapLocales = config.languages.supported.reduce((acc, lang) => {
  acc[lang] = lang;
  return acc;
}, /** @type {Record<string, string>} */ ({}));

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

  // CSP is implemented via public/_headers for GitHub Pages deployment
  // Astro middleware-based CSP only runs during build time, not at request time for static sites
  // The _headers file ensures CSP is properly enforced by GitHub Pages at runtime
  // See: public/_headers for the full CSP configuration
  vite: {
    build: {
      // Disable sourcemap generation to suppress warnings from plugins that don't generate sourcemaps
      // (astro:transitions, @tailwindcss/vite). Sourcemaps aren't needed for production static site.
      sourcemap: false,
    },
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
        defaultLocale: config.languages.default,
        locales: sitemapLocales,
      },
    }),
    sentry({
      project: 'rust-lessons',
      org: 'medvediev',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
