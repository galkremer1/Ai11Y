const HTTP_SCHEME_RE = /^https?:\/\//i;
const OTHER_SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;
const IPV4_RE = /^\d{1,3}(?:\.\d{1,3}){3}$/;

/**
 * Normalize a user-entered audit URL.
 * - Trims whitespace
 * - Keeps existing http(s) schemes
 * - Protocol-relative (`//example.com`) → `https://example.com`
 * - No scheme → `https://`, except localhost / IPv4 → `http://`
 */
export function normalizeAuditUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (HTTP_SCHEME_RE.test(trimmed) || OTHER_SCHEME_RE.test(trimmed)) {
    return trimmed;
  }

  const host = trimmed.split("/")[0]?.split(":")[0] ?? "";
  if (host === "localhost" || IPV4_RE.test(host)) {
    return `http://${trimmed}`;
  }

  return `https://${trimmed}`;
}

export function isHttpUrl(url: string): boolean {
  return HTTP_SCHEME_RE.test(url);
}
