import { fetchApi } from "@/lib/api"
import { Todo, TodoSchema } from "@/models/todo.model"
export const dynamic = "force-dynamic"

export default async function Page() {
  const apiUrl = process.env.API_URL || "http://localhost:8080"
  const apiVersion = process.env.API_VERSION || "v1"
  const apiItems = "todos"

  const items = await fetchApi<Todo[]>(
    `${apiUrl}/api/${apiVersion}/${apiItems}`,
    TodoSchema.array()
  )

  if (items.length === 0) {
    return <p>No items found.</p>
  }

  return (
    <ul>
      {items.map((item: Todo) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
