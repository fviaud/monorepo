import { z } from "zod"

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  // detail: z.string().optional(),
  completed: z.boolean(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type Todo = z.infer<typeof TodoSchema>
