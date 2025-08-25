import { createClient } from "./supabase"

interface FetchWithAuthOptions extends Omit<RequestInit, "method" | "body"> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
}

/**
 * Enhanced fetch function that automatically includes Supabase authentication
 * @param url - The URL to fetch
 * @param options - Fetch options including method, body, headers, etc.
 * @returns Promise with parsed JSON response
 * @throws Error if request fails or user is not authenticated
 */
export async function fetchWithAuth(url: string, options: FetchWithAuthOptions = {}): Promise<any> {
  const supabase = createClient()

  // Get current session and access token
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("[v0] Failed to get session:", sessionError)
    throw new Error("Failed to get authentication session")
  }

  if (!session?.access_token) {
    console.error("[v0] No access token found - user may not be authenticated")
    throw new Error("User not authenticated - please sign in")
  }

  const { method = "GET", body, headers = {}, ...restOptions } = options

  // Prepare headers with authentication
  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
    ...headers,
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: authHeaders,
    credentials: "include", // Include cookies as fallback
    ...restOptions,
  }

  // Add body for non-GET requests
  if (body && method !== "GET") {
    requestOptions.body = typeof body === "string" ? body : JSON.stringify(body)
  }

  console.log(`[v0] Making authenticated ${method} request to:`, url)

  try {
    const response = await fetch(url, requestOptions)

    console.log(`[v0] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Request failed with status ${response.status}:`, errorText)
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }

    // Handle empty responses (like 204 No Content)
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return null
    }

    const data = await response.json()
    console.log(`[v0] Request successful, received data:`, data)
    return data
  } catch (error) {
    console.error(`[v0] Network error during ${method} request to ${url}:`, error)
    throw error
  }
}

/**
 * Convenience methods for common HTTP operations
 */
export const authFetch = {
  get: (url: string, options?: Omit<FetchWithAuthOptions, "method">) =>
    fetchWithAuth(url, { ...options, method: "GET" }),

  post: (url: string, body?: any, options?: Omit<FetchWithAuthOptions, "method" | "body">) =>
    fetchWithAuth(url, { ...options, method: "POST", body }),

  put: (url: string, body?: any, options?: Omit<FetchWithAuthOptions, "method" | "body">) =>
    fetchWithAuth(url, { ...options, method: "PUT", body }),

  delete: (url: string, options?: Omit<FetchWithAuthOptions, "method">) =>
    fetchWithAuth(url, { ...options, method: "DELETE" }),

  patch: (url: string, body?: any, options?: Omit<FetchWithAuthOptions, "method" | "body">) =>
    fetchWithAuth(url, { ...options, method: "PATCH", body }),
}
