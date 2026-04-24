"use client"

import { deleteTodo } from "@/lib/actionsTodo"

export default function ButtonDeleteTodo({ id }: { id: string }) {
  const handleDelete = async () => {
    await deleteTodo(id)
  }

  return <button onClick={handleDelete}>Delete</button>
}
