import { z } from 'zod'

export const createSchema = z.object({
  uid: z.string().min(1),
  number: z.string().regex(/^[\d-]+$/),
  name: z.string(),
  money: z.number(),
})

export const updateSchema = z.object({
  id: z.string(),
  number: z.string().regex(/^[\d-]+$/),
  name: z.string(),
  money: z.number(),
})

export const transferSchema = z.object({
  giveId: z.string(),
  takeId: z.string(),
  money: z.number(),
})
