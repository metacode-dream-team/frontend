export function profileHref(username: string): string {
  const slug = username.trim();
  return slug ? `/profile/${encodeURIComponent(slug)}` : "/profile";
}
