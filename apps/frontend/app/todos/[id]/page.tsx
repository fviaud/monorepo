import Formulaire from "./formulaire"

import { getTodo } from "@/lib/actionsTodo"

export const dynamic = "force-dynamic"

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const todo = await getTodo(id)

  return <Formulaire todo={todo} />
}
