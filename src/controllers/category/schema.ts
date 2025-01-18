import { z } from 'zod'

const category = z.object({
  uid: z.string().min(1),
  name: z.string(),
  sort: z.number(),
})

export const schema = z.object({
  categories: category.array(),
})
