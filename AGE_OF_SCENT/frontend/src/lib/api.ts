import { getToken } from "@/lib/auth";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

type RequestBody = BodyInit | Record<string, unknown> | null | undefined;

type RequestOptions = Omit<RequestInit, "body"> & {
    body?: RequestBody;
};

export function mediaUrl(path?: string) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
    return `${API_ORIGIN}/${path}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    if (options.body && !isFormData) headers.set("Content-Type", "application/json");
    const token = typeof window !== "undefined" ? getToken() : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let requestBody: BodyInit | undefined;
    if (isFormData) requestBody = options.body as FormData;
    else if (options.body != null) requestBody = JSON.stringify(options.body);
    else requestBody = undefined;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        body: requestBody,
        cache: "no-store"
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || "Request failed.");
    return data as T;
}

export const api = {
    get: <T>(path: string): Promise<T> => request<T>(path),
    post: <T>(path: string, body?: RequestBody): Promise<T> => request<T>(path, { method: "POST", body }),
    put: <T>(path: string, body?: RequestBody): Promise<T> => request<T>(path, { method: "PUT", body }),
    delete: <T>(path: string): Promise<T> => request<T>(path, { method: "DELETE" })
};
