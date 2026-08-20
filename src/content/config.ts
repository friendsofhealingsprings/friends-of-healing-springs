import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Friends of Healing Springs Natural Area, Inc.'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    /** When set, this post is treated as a public event. */
    event: z
      .object({
        start: z.string(),
        end: z.string(),
        location: z.string(),
        rainDate: z.string().optional(),
      })
      .optional(),
    ogTitle: z.string().optional(),
  }),
});

export const collections = { posts };
