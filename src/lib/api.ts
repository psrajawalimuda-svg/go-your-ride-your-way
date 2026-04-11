import { supabase } from "@/integrations/supabase/client";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  // ── Token management ────────────────────────────────────────────────────

  async getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  // ── Core request ────────────────────────────────────────────────────────

  private async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers: extraHeaders, ...rest } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((extraHeaders as Record<string, string>) || {}),
    };

    const token = await this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Dev logging
    if (import.meta.env.DEV) {
      console.log(`[API] ${method} ${url}`, body ?? "");
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorBody.code || `HTTP_${response.status}`,
          errorBody.message || response.statusText,
          errorBody
        );
      }

      // Handle 204 No Content
      if (response.status === 204) return undefined as T;

      const data = await response.json();

      if (import.meta.env.DEV) {
        console.log(`[API] ✓ ${method} ${url}`, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        this.handleError(error);
        throw error;
      }
      // Network or parsing error
      const apiError = new ApiError(0, "NETWORK_ERROR", (error as Error).message);
      this.handleError(apiError);
      throw apiError;
    }
  }

  // ── Error interceptor ──────────────────────────────────────────────────

  private handleError(error: ApiError): void {
    if (import.meta.env.DEV) {
      console.error(`[API] ✗ ${error.code}: ${error.message}`);
    }

    // Auto-logout on 401
    if (error.status === 401) {
      supabase.auth.signOut();
    }
  }

  // ── HTTP methods ───────────────────────────────────────────────────────

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}

// Singleton instance — swap baseUrl when connecting a real backend
export const api = new ApiClient();

export default api;
