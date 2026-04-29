import Formulaire from "./formulaire"

import { getTodo } from "@/lib/actionsTodo"

export const dynamic = "force-dynamic"

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let todo = await getTodo(id)

  if (!todo) {
    return <div>Todo not found</div>
  }

  const todo2 = { ...todo, tested: !!todo.tested }
  console.log("todo2", todo2)

  return (
    <div className="container mx-auto">
      <Formulaire todo={todo2} />
    </div>
  )
}
