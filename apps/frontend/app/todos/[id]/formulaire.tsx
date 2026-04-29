"use client"
import { updateTodo } from "@/lib/actionsTodo"
import { Todo, TodoUpdateSchema } from "@/models/todo.model"
import type { IChangeEvent } from "@rjsf/core"
import { withTheme } from "@rjsf/core"
import { Theme as shadcnTheme } from "@rjsf/shadcn"
import validator from "@rjsf/validator-ajv8"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { zodToJsonSchema } from "zod-to-json-schema"

const Form = withTheme(shadcnTheme)

// const fields = ["title", "completed", "tested", "detail"] as const

// type TodoPickFields = Partial<Record<keyof typeof TodoSchema.shape, true>>
// const result = Object.fromEntries(
//   fields.map((f) => [f, true])
// ) as TodoPickFields

// const jsonSchema = zodToJsonSchema(TodoSchema.pick(result)) as Record<
//   string,
//   unknown
// >

const jsonSchema = zodToJsonSchema(TodoUpdateSchema) as Record<string, unknown>

const widgets = {
  CheckboxWidget: ({ value, onChange, label }: any) => (
    <label className="flex items-center gap-2">
      <span>{label}</span>
      <Switch checked={!!value} onCheckedChange={onChange} />
    </label>
  ),
}

const uiSchema = {
  title: {
    "ui:options": {
      classNames: "capitalize",
    },
  },
}

export default function UpdateTodo({ todo }: { todo: Todo }) {
  function handleSubmit({ formData }: IChangeEvent) {
    const fd = new FormData()
    // fields.map((f) => {
    //   if (formData[f] !== undefined) {
    //     fd.set(f, formData[f])
    //   }
    // })

    for (const key in formData) {
      if (formData[key] !== undefined) {
        fd.set(key, formData[key])
      }
    }

    updateTodo(fd, todo.id)
  }

  function pick<T, K extends readonly (keyof T)[]>(
    obj: T,
    keys: K
  ): Pick<T, K[number]> {
    return Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<
      T,
      K[number]
    >
  }
  const result = pick(todo, Object.keys(TodoUpdateSchema.shape) as (keyof Todo)[])

  return (
    <Form
      schema={jsonSchema}
      // uiSchema={uiSchema}
      formData={result}
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
