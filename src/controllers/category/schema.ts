import { z } from 'zod'

const category = z.object({
  uid: z.string().min(1),
  name: z.string(),
  sort: z.number(),
})

export const createSchema = z.object({
  categories: category.array(),
})

export const modifySchema = z.object({
  id: z.string(),
  name: z.string(),
})
