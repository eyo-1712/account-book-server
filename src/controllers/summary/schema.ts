import { z } from 'zod'

export const schema = z.object({
  uid: z.string(),
  type: z.string(),
  account: z.string().trim().min(1),
  category: z.string().trim().min(1),
  money: z.number(),
  datetime: z.string().datetime({ local: true }),
})
