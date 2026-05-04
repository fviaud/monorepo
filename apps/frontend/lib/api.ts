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
): Promise<{ data?: unknown; error?: Error }> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.json().catch(() => null)
    return { error: new Error(`${errorText?.error || "Unknown error"}`) }
  }

  if (response.status === 204) {
    console.log("API response status:", response.status)
    return { data: { message: "Resource deleted successfully" } }
  }

  const data = await response.json()
  return { data }
}
