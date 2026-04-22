import { mutateApi } from "@/lib/api"
import { redirect } from "next/navigation"

export default function AddTodoPage() {
  async function createTodo(formData: FormData) {
    "use server"

    const apiUrl = process.env.API_URL || "http://localhost:8080"
    const apiVersion = process.env.API_VERSION || "v1"

    const title = formData.get("title") as string
    const completed = formData.get("completed") === "on"

    await mutateApi(`${apiUrl}/api/${apiVersion}/todos`, "POST", {
      title,
      completed,
    })

    redirect("/todos")
  }

  return (
    <form action={createTodo}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" required />

      <label htmlFor="completed">
        <input id="completed" name="completed" type="checkbox" />
        Completed
      </label>

      <button type="submit">Add Todo</button>
    </form>
  )
}
