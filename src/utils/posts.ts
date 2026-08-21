import type { CollectionEntry } from 'astro:content';

function sortByPubDateDesc<T extends { data: { pubDate: Date; title: string } }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.data.pubDate.toISOString().slice(0, 10);
    const dateB = b.data.pubDate.toISOString().slice(0, 10);
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    return a.data.title.localeCompare(b.data.title);
  });
}

/** Sort posts newest-first using calendar dates (timezone-safe). */
export function sortPostsByDateDesc(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return sortByPubDateDesc(posts);
}

/** Sort meeting summaries newest-first. */
export function sortMeetingsByDateDesc(
  meetings: CollectionEntry<'meetings'>[]
): CollectionEntry<'meetings'>[] {
  return sortByPubDateDesc(meetings);
}
