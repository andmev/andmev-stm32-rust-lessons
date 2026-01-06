export interface SEOMetadata {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

export interface BaseLayoutProps extends SEOMetadata {
  lang: string;
  title: string;
  description?: string;
}

export interface LessonCardProps {
  number: number;
  label?: string;
  title: string;
  description: string;
  href: string;
}
