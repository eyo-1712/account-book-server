import { z } from 'zod'

export const schema = z.object({
  categories: z.object({
    uid: z.string().min(1),
    name: z.string(),
    sort: z.number(),
  }),
})
