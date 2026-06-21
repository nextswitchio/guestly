const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export { BACKEND_URL };

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_count: number;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BACKEND_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw { detail: error.detail || res.statusText, status: res.status } as ApiError;
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: "GET", headers }),

  post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), headers }),

  put: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), headers }),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: "DELETE", headers }),
};

export function getAuthHeaders(token?: string): Record<string, string> {
  if (!token) {
    if (typeof document !== "undefined") {
      token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];
    }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}
