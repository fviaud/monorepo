import { fetchApi } from "@/lib/api"
import { Todo, TodoSchema } from "@/models/todo.model"
import Link from "next/link"
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
        <li key={item.id}>
          {item.title}
          {item.completed ? " (Completed)" : " (Pending)"}
          <Link
            href={`/todos/${item.id}`}
            prefetch={false}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </Link>
        </li>
      ))}
    </ul>
  )
}
