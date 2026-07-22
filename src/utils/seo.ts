export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}

export function pageTitle(title: string, siteName: string): string {
  if (title === 'Home') return `${siteName} | Conservation Stewardship in Northwest Arkansas`;
  return `${title} | ${siteName}`;
}

export function canonicalUrl(path: string, siteUrl: string): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return new URL(normalized, siteUrl).href;
}
