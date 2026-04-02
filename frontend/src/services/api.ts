class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  }
}

const globalForApi = globalThis as unknown as {
  apiClient?: ApiClient
}

export const apiClient =
  globalForApi.apiClient ?? (globalForApi.apiClient = new ApiClient())
