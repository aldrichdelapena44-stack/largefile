import { getToken } from "@/lib/auth";

const RENDER_BACKEND_ORIGIN = "https://largefile.onrender.com";

function normalizeBaseUrl(value?: string) {
    const raw = (value || "").trim();

    if (!raw || raw.includes("api.example.com") || raw.includes("localhost")) {
        return `${RENDER_BACKEND_ORIGIN}/api`;
    }

    const withoutTrailingSlash = raw.replace(/\/+$/, "");

    if (withoutTrailingSlash.endsWith("/api")) {
        return withoutTrailingSlash;
    }

    return `${withoutTrailingSlash}/api`;
}

export const API_BASE_URL = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL
);

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

type JsonBody = Record<string, unknown> | unknown[] | string | number | boolean | null;

type RequestBody = BodyInit | JsonBody | undefined;

type RequestOptions = Omit<RequestInit, "body"> & {
    body?: RequestBody;
};

export function mediaUrl(path?: string) {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/")) {
        return `${API_ORIGIN}${path}`;
    }

    return `${API_ORIGIN}/${path}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const requestUrl = `${API_BASE_URL}${cleanPath}`;

    const headers = new Headers(options.headers);
    const isFormData =
        typeof FormData !== "undefined" && options.body instanceof FormData;

    let body: BodyInit | undefined;

    if (isFormData) {
        body = options.body as FormData;
    } else if (options.body !== undefined && options.body !== null) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(options.body);
    }

    const token = typeof window !== "undefined" ? getToken() : null;

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        console.log("[AGE OF SCENT API]", options.method || "GET", requestUrl);

        const response = await fetch(requestUrl, {
            ...options,
            method: options.method || "GET",
            headers,
            body,
            mode: "cors",
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                data?.message ||
                data?.error ||
                `Request failed with status ${response.status}.`
            );
        }

        return data as T;
    } catch (error) {
        console.error("[AGE OF SCENT API ERROR]", {
            url: requestUrl,
            error,
        });

        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error(
            `Failed to connect to backend at ${requestUrl}. Check Render CORS_ORIGIN and Vercel NEXT_PUBLIC_API_URL.`
        );
    }
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
            body,
        });
    },

    put: <T>(path: string, body?: RequestBody): Promise<T> => {
        return request<T>(path, {
            method: "PUT",
            body,
        });
    },

    patch: <T>(path: string, body?: RequestBody): Promise<T> => {
        return request<T>(path, {
            method: "PATCH",
            body,
        });
    },

    delete: <T>(path: string): Promise<T> => {
        return request<T>(path, {
            method: "DELETE",
        });
    },
};