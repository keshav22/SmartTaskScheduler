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
      credentials: 'include',
      cache: 'no-store',
    })

    if(res.status === 401) {
      console.log('Unauthorized, redirecting to login')
      window.location.assign('/login')
    }

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
      credentials: 'include',
      body: JSON.stringify(body),
    })

    if(res.status === 401) {
      console.log('Unauthorized, redirecting to login')
      window.location.assign('/login')
    }

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })

    if(res.status === 401) {
      window.location.href = '/login'
    }

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  }

  async delete<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })

    if(res.status === 401) {
      window.location.href = '/login'
      
    }

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
