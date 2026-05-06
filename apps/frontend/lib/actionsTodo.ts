"use server"
import { fetchApi, mutateApi } from "@/lib/api"
import { Todo, TodoSchema } from "@/models/todo.model"

const apiUrl = process.env.API_URL || "http://localhost:8080"
const apiVersion = process.env.API_VERSION || "v1"
const apiItems = "todos"
const todosPath = `${apiUrl}/api/${apiVersion}/${apiItems}`

const getTodoPath = (id?: string) => (id ? `${todosPath}/${id}` : todosPath)

export async function getTodos() {
  return fetchApi<Todo[]>(getTodoPath(), TodoSchema.array())
}

export async function getTodo(id: string) {
  try {
    const todo = await fetchApi<Todo>(getTodoPath(id), TodoSchema)
    return todo
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string
  const completed = formData.get("completed") === "on"

  await mutateApi(getTodoPath(), "POST", {
    title,
    completed,
  })

  return true
}

export async function updateTodo(formData: FormData, id: string) {
  const title = formData.get("title") as string
  const completedValue = formData.get("completed")
  const completed = completedValue === "true" || completedValue === "on"

  await mutateApi(getTodoPath(id), "PUT", {
    title,
    completed,
  })
  return true
}

export async function deleteTodo(id: string) {
  await mutateApi(getTodoPath(id), "DELETE")
  return true
}
