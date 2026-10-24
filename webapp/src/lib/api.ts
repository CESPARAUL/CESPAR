export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  body: Record<string, unknown> | null;
  constructor(message: string, status: number, body: Record<string, unknown> | null = null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// A request that never resolves (server unreachable, connection stuck) would
// otherwise leave any "loading" state stuck forever with no feedback — cap
// every call so it always settles one way or another.
const REQUEST_TIMEOUT_MS = 15000;

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  // Let the browser set its own multipart boundary — don't force JSON headers.
  const isFormData = rest.body instanceof FormData;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out. Check your connection and try again.", 0);
    }
    throw new ApiError("Could not reach the server.", 0);
  } finally {
    clearTimeout(timeout);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(body?.message ?? "Something went wrong", res.status, body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "GET", token }),
  post: <T>(path: string, data?: unknown, token?: string | null) =>
    request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      token,
    }),
  patch: <T>(path: string, data?: unknown, token?: string | null) =>
    request<T>(path, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      token,
    }),
  patchForm: <T>(path: string, data: FormData, token?: string | null) =>
    request<T>(path, { method: "PATCH", body: data, token }),
};
