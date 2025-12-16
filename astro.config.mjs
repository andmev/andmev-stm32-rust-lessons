// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';

// https://astro.build/config
export default defineConfig({
  site: 'https://stm32-rust.org', // Replace with your actual domain
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
  ],
});
