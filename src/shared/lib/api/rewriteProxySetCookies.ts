/**
 * Rewrites upstream Set-Cookie headers for the browser BFF proxy.
 * - Strips Domain so cookies bind to the frontend origin
 * - Normalizes Path=/
 * - Drops Secure on HTTP (dev localhost)
 */

function isHttpsRequest(requestUrl: string): boolean {
  try {
    return new URL(requestUrl).protocol === "https:";
  } catch {
    return false;
  }
}

function rewriteCookiePart(part: string, secureAllowed: boolean): string {
  const trimmed = part.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("domain=")) {
    return "";
  }

  if (lower.startsWith("path=")) {
    return "Path=/";
  }

  if (!secureAllowed && lower === "secure") {
    return "";
  }

  return trimmed;
}

export function rewriteProxySetCookie(
  rawCookie: string,
  requestUrl: string,
): string {
  const secureAllowed = isHttpsRequest(requestUrl);
  const segments = rawCookie.split(";").map((s) => s.trim());
  const nameValue = segments[0];
  if (!nameValue) return rawCookie;

  const rewritten = [nameValue];
  for (let i = 1; i < segments.length; i++) {
    const part = rewriteCookiePart(segments[i] ?? "", secureAllowed);
    if (part) {
      rewritten.push(part);
    }
  }

  const hasPath = rewritten.some((p) => p.toLowerCase().startsWith("path="));
  if (!hasPath) {
    rewritten.push("Path=/");
  }

  return rewritten.join("; ");
}

const EXPIRED_COOKIE_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";

/** Clears a cookie on the frontend origin (no Domain — matches BFF login rewrite). */
export function buildClearCookieHeader(
  cookieName: string,
  requestUrl: string,
): string {
  const secureAllowed = isHttpsRequest(requestUrl);
  const parts = [
    `${cookieName}=`,
    "Path=/",
    `Expires=${EXPIRED_COOKIE_DATE}`,
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secureAllowed) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function appendClearAuthRefreshCookies(
  responseHeaders: Headers,
  requestUrl: string,
  cookieNames: readonly string[],
): void {
  for (const name of cookieNames) {
    responseHeaders.append("set-cookie", buildClearCookieHeader(name, requestUrl));
  }
}

export function collectUpstreamSetCookies(headers: Headers): string[] {
  if (typeof headers.getSetCookie === "function") {
    const cookies = headers.getSetCookie();
    if (cookies.length > 0) return cookies;
  }

  const legacy = headers.get("set-cookie");
  if (!legacy) return [];

  // Fallback: split combined header (may be imperfect for commas in dates)
  return legacy.split(/,(?=\s*[^;,]+=)/).map((c) => c.trim()).filter(Boolean);
}

export function appendRewrittenSetCookies(
  upstreamHeaders: Headers,
  responseHeaders: Headers,
  requestUrl: string,
): void {
  const cookies = collectUpstreamSetCookies(upstreamHeaders);
  for (const raw of cookies) {
    responseHeaders.append(
      "set-cookie",
      rewriteProxySetCookie(raw, requestUrl),
    );
  }
}
