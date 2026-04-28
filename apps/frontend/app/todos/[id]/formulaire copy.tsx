"use client"
import { updateTodo } from "@/lib/actionsTodo"
import { Todo, TodoSchema } from "@/models/todo.model"
import type { IChangeEvent } from "@rjsf/core"
import { withTheme } from "@rjsf/core"
import { Theme as shadcnTheme } from "@rjsf/shadcn"
import validator from "@rjsf/validator-ajv8"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { zodToJsonSchema } from "zod-to-json-schema"

const Form = withTheme(shadcnTheme)

const fields = ["title", "completed"]
type TodoPickFields = Partial<Record<keyof typeof TodoSchema.shape, true>>

const result = Object.fromEntries(
  fields.map((f) => [f, true])
) as TodoPickFields

const jsonSchema = zodToJsonSchema(TodoSchema.pick(result)) as Record<
  string,
  unknown
>

const widgets = {
  CheckboxWidget: ({ value, onChange }: any) => (
    <Switch checked={!!value} onCheckedChange={onChange} />
  ),
}

export default function UpdateTodo({ todo }: { todo: Todo }) {
  function handleSubmit({ formData }: IChangeEvent) {
    const fd = new FormData()

    fd.set("title", formData.title)
    fd.set("completed", formData.completed)

    updateTodo(fd, todo.id)
  }

  const { title, completed } = todo
  return (
    <Form
      schema={jsonSchema}
      formData={{ title, completed }}
      validator={validator}
      onSubmit={handleSubmit}
      widgets={widgets}
      className="m-4 flex flex-col gap-10"
    >
      <Button type="submit" className="w-full sm:w-40">
        Update Todo
      </Button>
    </Form>
  )
}
