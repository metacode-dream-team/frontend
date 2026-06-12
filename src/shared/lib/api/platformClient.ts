import { API_BASE_URL } from "@/shared/config/constants";
import { buildApiUrl } from "./apiUrl";

export function getPlatformBaseUrl(): string {
  return API_BASE_URL.replace(/\/$/, "");
}

export function isPlatformApiConfigured(): boolean {
  return Boolean(API_BASE_URL?.trim());
}

export function getIntegrationBaseUrl(): string {
  return API_BASE_URL.replace(/\/$/, "");
}

export function isIntegrationApiConfigured(): boolean {
  return Boolean(API_BASE_URL?.trim());
}

function normalizePath(pathAndQuery: string): string {
  return pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
}

async function parseMutationResponse<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${label} ${res.status}: ${text.slice(0, 240)}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

async function authBackendRequest<T>(
  pathAndQuery: string,
  accessToken: string,
  init: RequestInit,
): Promise<T> {
  const url = buildApiUrl(pathAndQuery);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "omit",
    cache: "no-store",
  });

  return parseMutationResponse<T>(res, "Backend API");
}

export async function platformGet<T>(
  pathAndQuery: string,
  accessToken?: string | null,
): Promise<T> {
  const path = normalizePath(pathAndQuery);
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "omit",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Platform API ${res.status}: ${text.slice(0, 240)}`);
  }

  return res.json() as Promise<T>;
}

export async function integrationGet<T>(
  pathAndQuery: string,
  accessToken?: string | null,
): Promise<T> {
  const path = normalizePath(pathAndQuery);
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "omit",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Integration API ${res.status}: ${text.slice(0, 240)}`);
  }

  return res.json() as Promise<T>;
}

export async function authBackendPatch<T>(
  pathAndQuery: string,
  body: unknown,
  accessToken: string,
): Promise<T> {
  return authBackendRequest<T>(pathAndQuery, accessToken, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function authBackendDelete<T>(
  pathAndQuery: string,
  accessToken: string,
): Promise<T> {
  return authBackendRequest<T>(pathAndQuery, accessToken, {
    method: "DELETE",
  });
}

export async function authBackendMultipartPost<T>(
  pathAndQuery: string,
  formData: FormData,
  accessToken: string,
): Promise<T> {
  return authBackendRequest<T>(pathAndQuery, accessToken, {
    method: "POST",
    body: formData,
  });
}

export async function integrationPost<T>(
  pathAndQuery: string,
  body: unknown,
  accessToken?: string | null,
): Promise<T> {
  const path = normalizePath(pathAndQuery);
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: "omit",
    cache: "no-store",
  });

  return parseMutationResponse<T>(res, "Integration API");
}

export async function integrationPatch<T>(
  pathAndQuery: string,
  body: unknown,
  accessToken?: string | null,
): Promise<T> {
  const path = normalizePath(pathAndQuery);
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    credentials: "omit",
    cache: "no-store",
  });

  return parseMutationResponse<T>(res, "Integration API");
}

export async function integrationDelete<T>(
  pathAndQuery: string,
  accessToken?: string | null,
): Promise<T> {
  const path = normalizePath(pathAndQuery);
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "omit",
    cache: "no-store",
  });

  return parseMutationResponse<T>(res, "Integration API");
}
