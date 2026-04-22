import { fetchApi, mutateApi } from "@/lib/api"
import { Todo, TodoSchema } from "@/models/todo.model"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const apiUrl = process.env.API_URL || "http://localhost:8080"
  const apiVersion = process.env.API_VERSION || "v1"

  const todo = await fetchApi<Todo>(
    `${apiUrl}/api/${apiVersion}/todos/${id}`,
    TodoSchema
  )

  async function updateTodo(formData: FormData) {
    "use server"

    const apiUrl = process.env.API_URL || "http://localhost:8080"
    const apiVersion = process.env.API_VERSION || "v1"

    const title = formData.get("title") as string
    const completed = formData.get("completed") === "on"

    await mutateApi(`${apiUrl}/api/${apiVersion}/todos/${id}`, "PUT", {
      title,
      completed,
    })

    redirect("/todos")
  }

  return (
    <form action={updateTodo}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        defaultValue={todo.title}
        required
      />

      <label htmlFor="completed">
        <input
          id="completed"
          name="completed"
          type="checkbox"
          defaultChecked={todo.completed}
        />
        Completed
      </label>

      <button type="submit">Update Todo</button>
    </form>
  )
}
