export async function fetchApi<T>(
  url: string,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return schema.parse(data)
}
