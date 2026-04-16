"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ConnectPlatformsModal } from "@/features/connect-accounts";

export default function ConnectPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        router.push("/");
      }
    },
    [router],
  );

  return (
    <>
      <div className="min-h-screen bg-black" aria-hidden />
      <ConnectPlatformsModal open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
