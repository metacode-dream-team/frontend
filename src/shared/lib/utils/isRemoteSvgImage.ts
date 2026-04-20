/** Dicebear и др. отдают SVG; next/image без unoptimized/dangerouslyAllowSVG ругается. */
export function isRemoteSvgImage(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  const u = src.toLowerCase();
  return u.includes(".svg") || u.includes("/svg?");
}
