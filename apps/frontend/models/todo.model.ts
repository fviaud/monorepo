import { z } from "zod"

// Schéma de base pour les champs communs
export const BaseSchema = z.object({
  id: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const TodoSchema = BaseSchema.merge(
  z.object({
    title: z.string(),
    detail: z.string().optional(),
    completed: z.boolean(),
    tested: z.boolean().optional(),
  })
)

export type Todo = z.infer<typeof TodoSchema>

export const TodoUpdateSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
  tested: z.boolean().optional(),
})
