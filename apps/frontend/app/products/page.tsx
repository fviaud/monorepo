import { fetchApi } from "@/lib/api"
import { Item, ItemSchema } from "@/models/item.model"
export const dynamic = "force-dynamic"

export default async function Page() {
  const apiUrl = process.env.API_URL || "http://localhost:8080"
  const apiVersion = process.env.API_VERSION || "v1"
  const apiItems = process.env.API_ITEMS || "items"

  const items = await fetchApi<Item[]>(
    `${apiUrl}/api/${apiVersion}/${apiItems}`,
    ItemSchema.array()
  )

  if (items.length === 0) {
    return <p>No items found.</p>
  }

  if (items.length === 0) {
    return <p>No items found.</p>
  }

  return (
    <ul>
      {items.map((item: Item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
