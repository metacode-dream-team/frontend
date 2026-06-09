import { INTEGRATION_API_URL, PLATFORM_API_URL } from "@/shared/config/constants";
import {
  resolveIntegrationUrlForFetch,
  resolvePlatformUrlForFetch,
} from "./browserProxyUrl";

export function getPlatformBaseUrl(): string {
  return PLATFORM_API_URL.replace(/\/$/, "");
}

export function isPlatformApiConfigured(): boolean {
  return Boolean(PLATFORM_API_URL?.trim());
}

export function getIntegrationBaseUrl(): string {
  return INTEGRATION_API_URL.replace(/\/$/, "");
}

export function isIntegrationApiConfigured(): boolean {
  return Boolean(INTEGRATION_API_URL?.trim());
}

export async function platformGet<T>(
  pathAndQuery: string,
  accessToken?: string | null,
): Promise<T> {
  const path = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  const url = resolvePlatformUrlForFetch(path);
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
  const path = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  const url = resolveIntegrationUrlForFetch(path);
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

export async function integrationPost<T>(
  pathAndQuery: string,
  body: unknown,
  accessToken?: string | null,
): Promise<T> {
  const path = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  const url = resolveIntegrationUrlForFetch(path);
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Integration API ${res.status}: ${text.slice(0, 240)}`);
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

export async function integrationPatch<T>(
  pathAndQuery: string,
  body: unknown,
  accessToken?: string | null,
): Promise<T> {
  const path = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  const url = resolveIntegrationUrlForFetch(path);
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Integration API ${res.status}: ${text.slice(0, 240)}`);
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
