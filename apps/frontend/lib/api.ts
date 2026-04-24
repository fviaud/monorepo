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

export async function mutateApi(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return
  }
  const data = await response.json()

  return data
}
