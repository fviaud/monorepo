import { NextRequest, NextResponse } from "next/server"
import { Todo, TodoSchema, TodoUpdateSchema } from "@/models/todo.model"
import { getTodos, createTodo, updateTodo } from "@/lib/actionsTodo"
import { mutateApi } from "@/lib/api"

const apiUrl = process.env.API_URL || "http://localhost:8080"
const apiVersion = process.env.API_VERSION || "v1"
const apiItems = "todos"
const todosPath = `${apiUrl}/api/${apiVersion}/${apiItems}`
const getTodoPath = (id?: string) => (id ? `${todosPath}/${id}` : todosPath)

let todos: Todo[] = []

export async function GET() {
  todos = (await getTodos()) as unknown as Todo[]
  return NextResponse.json(todos, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = TodoUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const todo = await mutateApi(getTodoPath(), "POST", parsed.data)

    // const todo = await createTodo(parsed.data.id, parsed.data)

    if (todo.error) {
      return NextResponse.json({ error: todo.error.message }, { status: 500 })
    }

    return NextResponse.json(todo.data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
