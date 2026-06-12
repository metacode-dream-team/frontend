"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-black px-6 text-center text-zinc-100">
      <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
      <p className="max-w-md text-sm text-zinc-400">
        A part of the page failed to load. You can try again or go back to the home page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="accent" onClick={reset}>
          Try again
        </Button>
        <Button type="button" variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </div>
  );
}
