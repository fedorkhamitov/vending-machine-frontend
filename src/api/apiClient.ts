import { ApiResponse } from '../types/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { body, headers, ...rest } = options;

    const response = await fetch(url, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body:
        body !== undefined
          ? typeof body === 'string' || body instanceof URLSearchParams
            ? body
            : JSON.stringify(body)
          : undefined,
    });

    if (response.status === 423) {
      throw new Error('MACHINE_BUSY');
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<T>;
    if (!payload.success) {
      throw new Error(payload.message || 'API error');
    }
    return payload.data as T;
  }

  /** GET запрос */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /** POST запрос с телом типа BodyInit */
  async post<T>(endpoint: string, body?: BodyInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    });
  }

  /** PUT запрос с телом типа BodyInit */
  async put<T>(endpoint: string, body?: BodyInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
    });
  }

  /** DELETE запрос */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(
  // При необходимости указать базовый URL, например:
  // 'http://localhost:5000'
);
