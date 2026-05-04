import { NextRequest, NextResponse } from "next/server"
import { Todo, TodoSchema, TodoUpdateSchema } from "@/models/todo.model"
import { getTodos, createTodo } from "@/lib/actionsTodo"
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    const parsed = TodoUpdateSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const todo = await mutateApi(getTodoPath(id), "PUT", parsed.data)
    if (todo.error) {
      return NextResponse.json({ error: todo.error.message }, { status: 500 })
    }

    return NextResponse.json(todo.data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const result = await mutateApi(getTodoPath(id), "DELETE")

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
