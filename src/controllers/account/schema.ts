import { z } from 'zod'

export const schema = z.object({
  uid: z.string().min(1),
  name: z.string(),
  money: z.number(),
})

export const transferSchema = z.object({
  giveId: z.number(),
  takeId: z.number(),
  money: z.number(),
})
