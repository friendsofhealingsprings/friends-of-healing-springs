import type { CollectionEntry } from 'astro:content';

/** Sort posts newest-first using calendar dates (timezone-safe). */
export function sortPostsByDateDesc(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return [...posts].sort((a, b) => {
    const dateA = a.data.pubDate.toISOString().slice(0, 10);
    const dateB = b.data.pubDate.toISOString().slice(0, 10);
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    return a.data.title.localeCompare(b.data.title);
  });
}
