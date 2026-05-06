import { NextRequest, NextResponse } from "next/server"

import { Todo } from "@/models/todo.model"
import { deleteTodo, getTodo } from "@/lib/actionsTodo"
import { tr } from "zod/v4/locales"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const todo = (await getTodo(id)) as unknown as Todo
    return NextResponse.json(todo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      {
        status:
          error instanceof Error && error.message === "404 Not Found"
            ? 404
            : 500,
      }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await deleteTodo(id)

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      {
        status:
          error instanceof Error && error.message === "404 Not Found"
            ? 404
            : 500,
      }
    )
  }
}
