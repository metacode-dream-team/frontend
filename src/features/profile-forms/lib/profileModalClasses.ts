export function profileModalOverlayClass(zIndexClassName = "z-[100]"): string {
  return `fixed inset-0 ${zIndexClassName}`;
}

export const profileModalBackdropClassName =
  "pointer-events-none absolute inset-0 bg-black/75 backdrop-blur-[2px]";

export const profileModalScrollClassName =
  "absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] touch-pan-y";

export const profileModalScrollInnerClassName =
  "flex min-h-full items-start justify-center p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-4";

export const profileModalPanelClassName =
  "relative z-[1] my-2 w-full shrink-0 rounded-2xl border border-zinc-800/90 bg-[#161618] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)] sm:my-4";
