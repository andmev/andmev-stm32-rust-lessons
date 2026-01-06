/**
 * Navigation link for lessons and pages
 */
export interface NavigationLink {
  title: string;
  slug: string;
}

/**
 * Previous/Next lesson navigation
 */
export interface LessonNavigation {
  prevLesson: NavigationLink | null;
  nextLesson: NavigationLink | null;
}

/**
 * Footer navigation item
 */
export interface FooterNavItem {
  title: string;
  url: string;
  order: number;
}

/**
 * Language selector item
 */
export interface LanguageItem {
  code: string;
  name: string;
  url: string;
}
