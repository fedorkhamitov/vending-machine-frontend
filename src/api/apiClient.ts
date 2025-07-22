import { ApiResponse } from "../types/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  public getAssetUrl(relativePath: string): string {
    if (relativePath.startsWith("http")) return relativePath;
    // Возвращаем путь как есть - прокси перенаправит на бэкенд
    return relativePath;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { body, headers, ...rest } = options;

    const response = await fetch(url, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ?? undefined,
    });

    if (response.status === 423) {
      throw new Error("MACHINE_BUSY");
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<T>;
    if (!payload.success) {
      throw new Error(payload.message || "API error");
    }
    return payload.data as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data !== undefined ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      method: "POST",
      body,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data !== undefined ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
