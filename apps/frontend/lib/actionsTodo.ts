"use server"

import { fetchApi, mutateApi } from "@/lib/api"
import { Todo, TodoSchema } from "@/models/todo.model"
import { redirect } from "next/navigation"

const apiUrl = process.env.API_URL || "http://localhost:8080"
const apiVersion = process.env.API_VERSION || "v1"
const apiItems = "todos"
const todosPath = `${apiUrl}/api/${apiVersion}/${apiItems}`
const todosRoute = "/todos"

const getTodoPath = (id?: string) => (id ? `${todosPath}/${id}` : todosPath)

export async function getTodos() {
  return fetchApi<Todo[]>(getTodoPath(), TodoSchema.array())
}

export async function getTodo(id: string) {
  return fetchApi<Todo>(getTodoPath(id), TodoSchema)
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string
  const completed = formData.get("completed") === "on"

  await mutateApi(getTodoPath(), "POST", {
    title,
    completed,
  })

  redirect(todosRoute)
}

export async function updateTodo(formData: FormData, id: string) {
  const title = formData.get("title") as string
  const completedValue = formData.get("completed")
  const completed = completedValue === "true" || completedValue === "on"

  await mutateApi(getTodoPath(id), "PUT", {
    title,
    completed,
  })

  redirect(todosRoute)
}

export async function deleteTodo(id: string) {
  await mutateApi(getTodoPath(id), "DELETE")

  redirect(todosRoute)
}
