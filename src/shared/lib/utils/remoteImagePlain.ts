export function shouldUseNativeImgForRemoteUrl(src: string): boolean {
  const s = (src || "").trim();
  if (!/^https?:\/\//i.test(s)) return false;
  try {
    const host = new URL(s).hostname.toLowerCase();
    if (host === "api.dicebear.com") return false;
    return true;
  } catch {
    return false;
  }
}
