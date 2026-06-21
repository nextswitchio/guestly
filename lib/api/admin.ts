import { BACKEND_URL } from "./client";

/**
 * Helper for making authenticated admin API calls from the client
 * Automatically includes credentials for cookie-based auth
 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: 'include',
  });
}

/**
 * Helper for making authenticated admin API calls to the Next.js API routes
 */
export async function adminApiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(path, {
    ...options,
    credentials: 'include',
  });
}

/**
 * Helper for making authenticated admin API calls directly to the backend
 */
export async function backendAdminFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    credentials: 'include',
  });
}
