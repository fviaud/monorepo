import { Item, ItemSchema } from "../models/item.model"
export const dynamic = "force-dynamic"

export default async function Page() {
  const apiUrl = process.env.API_URL || "http://localhost:8080"
  const apiVersion = process.env.API_VERSION || "v1"
  const apiItems = process.env.API_ITEMS || "items"

  let items: Item[] = []

  try {
    const response = await fetch(`${apiUrl}/api/${apiVersion}/${apiItems}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const data = await response.json()
    items = ItemSchema.array().parse(data)
  } catch (error) {
    throw new Error(`${(error as Error).message}`)
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
