"use client"
import { createTodo } from "@/lib/actionsTodo"
import { TodoSchema } from "@/models/todo.model"
import type { IChangeEvent } from "@rjsf/core"
import { withTheme } from "@rjsf/core"
import { Theme as shadcnTheme } from "@rjsf/shadcn"
import validator from "@rjsf/validator-ajv8"
import { Button } from "@workspace/ui/components/button"
import { zodToJsonSchema } from "zod-to-json-schema"
import { redirect } from "next/navigation"

const todosRoute = "/todos"

const Form = withTheme(shadcnTheme)
const jsonSchema = zodToJsonSchema(TodoSchema.pick({ title: true })) as Record<
  string,
  unknown
>

export default function AddTodoPage() {
  function handleSubmit({ formData }: IChangeEvent) {
    const fd = new FormData()
    fd.set("title", formData.title)
    createTodo(fd)
    redirect(todosRoute)
  }

  return (
    <Form schema={jsonSchema} validator={validator} onSubmit={handleSubmit}>
      <Button type="submit">Create Todo</Button>
    </Form>
  )
}
