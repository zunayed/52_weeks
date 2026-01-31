import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().or(z.string().transform((str) => new Date(str))),
    draft: z.boolean().optional().default(false),
    series: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  'posts': postsCollection,
};
