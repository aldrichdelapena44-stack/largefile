const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://largefile.onrender.com";

type RequestBody =
    | Record<string, unknown>
    | unknown[]
    | string
    | number
    | boolean
    | null
    | FormData
    | undefined;

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const url = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const text = await response.text();

    let data: unknown = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        const errorData = data as { message?: string; error?: string };
        throw new Error(errorData?.message || errorData?.error || "Request failed");
    }

    return data as T;
}

export const api = {
    get: <T>(path: string): Promise<T> => {
        return request<T>(path, {
            method: "GET",
        });
    },

    post: <T>(path: string, body?: RequestBody): Promise<T> => {
        return request<T>(path, {
            method: "POST",
            body:
                body instanceof FormData
                    ? body
                    : body !== undefined
                        ? JSON.stringify(body)
                        : undefined,
        });
    },

    put: <T>(path: string, body?: RequestBody): Promise<T> => {
        return request<T>(path, {
            method: "PUT",
            body:
                body instanceof FormData
                    ? body
                    : body !== undefined
                        ? JSON.stringify(body)
                        : undefined,
        });
    },

    delete: <T>(path: string): Promise<T> => {
        return request<T>(path, {
            method: "DELETE",
        });
    },
};