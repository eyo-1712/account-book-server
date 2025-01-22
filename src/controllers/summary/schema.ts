import { z } from 'zod'

export const schema = z.object({
  uid: z.string(),
  type: z.string(),
  account: z.string().trim().min(1),
  category: z.string().trim().min(1),
  money: z.number(),
  datetime: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d)$/,
      'Invalid datetime format. Expected format is YYYY-MM-DDTHH:mm',
    ),
})
