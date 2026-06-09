import { Suspense } from "react";
import { CompleteProfileForm } from "@/features/complete-profile";

function CompleteProfileFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-zinc-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-[#c4a3f7]" />
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 py-12 text-zinc-100">
      <div className="w-full max-w-[520px] rounded-2xl border border-zinc-800/90 bg-[#161618] px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_48px_rgba(0,0,0,0.45)]">
        <Suspense fallback={<CompleteProfileFallback />}>
          <CompleteProfileForm />
        </Suspense>
      </div>
    </div>
  );
}
