import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLessons, getPages } from '../collections';
import type { CollectionEntry } from 'astro:content';

// Mock Astro content collections
const mockLessons: CollectionEntry<'lessons'>[] = [
  {
    id: 'en/lessons/getting-started.mdx',
    collection: 'lessons',
    data: {
      title: 'Getting Started',
      description: 'Introduction to STM32',
      order: 1,
      category: 'basics',
    },
  } as CollectionEntry<'lessons'>,
  {
    id: 'en/lessons/rust-basics.mdx',
    collection: 'lessons',
    data: {
      title: 'Rust Basics',
      description: 'Learn Rust fundamentals',
      order: 2,
      category: 'basics',
    },
  } as CollectionEntry<'lessons'>,
  {
    id: 'es/lessons/introduccion.mdx',
    collection: 'lessons',
    data: {
      title: 'Introducción',
      description: 'Introducción a STM32',
      order: 1,
      category: 'basics',
    },
  } as CollectionEntry<'lessons'>,
];

const mockPages: CollectionEntry<'pages'>[] = [
  {
    id: 'en/home.mdx',
    collection: 'pages',
    data: {
      name: 'home',
      title: 'Home',
      description: 'Welcome to STM32 Rust Lessons',
      url: 'home',
      order: 1,
    },
  } as CollectionEntry<'pages'>,
  {
    id: 'en/about.mdx',
    collection: 'pages',
    data: {
      name: 'about',
      title: 'About',
      description: 'About STM32 Rust Lessons',
      url: 'about',
      order: 2,
    },
  } as CollectionEntry<'pages'>,
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (collection: string) => {
    if (collection === 'lessons') return mockLessons;
    if (collection === 'pages') return mockPages;
    return [];
  }),
}));

describe('getLessons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all lessons', async () => {
    const lessons = await getLessons();
    expect(lessons).toHaveLength(3);
    expect(lessons[0].id).toBe('en/lessons/getting-started.mdx');
  });

  it('should cache lessons after first call', async () => {
    // This test verifies caching behavior by checking that subsequent calls
    // return the same array reference (indicating cache is being used)
    const firstCall = await getLessons();
    const secondCall = await getLessons();

    expect(firstCall).toBe(secondCall);
  });

  it('should return lessons with correct structure', async () => {
    const lessons = await getLessons();
    const firstLesson = lessons[0];

    expect(firstLesson).toHaveProperty('id');
    expect(firstLesson).toHaveProperty('collection');
    expect(firstLesson).toHaveProperty('data');
    expect(firstLesson.data).toHaveProperty('title');
    expect(firstLesson.data).toHaveProperty('description');
    expect(firstLesson.data).toHaveProperty('order');
  });
});

describe('getPages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all pages', async () => {
    const pages = await getPages();
    expect(pages).toHaveLength(2);
    expect(pages[0].id).toBe('en/home.mdx');
  });

  it('should cache pages after first call', async () => {
    // This test verifies caching behavior by checking that subsequent calls
    // return the same array reference (indicating cache is being used)
    const firstCall = await getPages();
    const secondCall = await getPages();

    expect(firstCall).toBe(secondCall);
  });

  it('should return pages with correct structure', async () => {
    const pages = await getPages();
    const firstPage = pages[0];

    expect(firstPage).toHaveProperty('id');
    expect(firstPage).toHaveProperty('collection');
    expect(firstPage).toHaveProperty('data');
    expect(firstPage.data).toHaveProperty('name');
    expect(firstPage.data).toHaveProperty('title');
    expect(firstPage.data).toHaveProperty('url');
  });
});
