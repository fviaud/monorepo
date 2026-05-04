import { NextRequest, NextResponse } from "next/server"

import { Todo } from "@/models/todo.model"
import { getTodo } from "@/lib/actionsTodo"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const todo = (await getTodo(id)) as unknown as Todo

  return NextResponse.json(todo, { status: 200 })
}
