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

// https://astro.build/config
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  // Keep local dev at root; only prepend the repo path when building for GitHub Pages.
  site: isGitHubPages
    ? 'https://andmev.github.io/andmev-stm32-rust-lessons'
    : 'http://localhost:4321',
  base: isGitHubPages ? '/andmev-stm32-rust-lessons' : '/',
  prefetch: true,
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss()],
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
    sitemap(),
  ],
});
