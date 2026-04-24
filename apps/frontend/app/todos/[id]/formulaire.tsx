"use client"
import { updateTodo } from "@/lib/actionsTodo"
import { Todo, TodoSchema } from "@/models/todo.model"
import type { IChangeEvent } from "@rjsf/core"
import { withTheme } from "@rjsf/core"
import { Theme as shadcnTheme } from "@rjsf/shadcn"
import validator from "@rjsf/validator-ajv8"
import { Button } from "@workspace/ui/components/button"
import { zodToJsonSchema } from "zod-to-json-schema"

const Form = withTheme(shadcnTheme)
const jsonSchema = zodToJsonSchema(
  TodoSchema.pick({ title: true, completed: true })
) as Record<string, unknown>

export default function UpdateTodo({ todo }: { todo: Todo }) {
  function handleSubmit({ formData }: IChangeEvent) {
    const fd = new FormData()

    fd.set("title", formData.title)
    fd.set("completed", formData.completed)

    updateTodo(fd, todo.id)
  }

  const { title, completed } = todo
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Form
        schema={jsonSchema}
        formData={title ? { title, completed } : undefined}
        validator={validator}
        onSubmit={handleSubmit}
        className="flex flex-col gap-10"
      >
        <Button type="submit">Update Todo</Button>
      </Form>
    </div>
  )
}
