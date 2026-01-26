/**
 * Страница верификации email
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "../model/useVerifyEmail";
import { Button } from "@/shared/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isLoading, error, success } = useVerifyEmail(token);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
          <p>
            Your email has been successfully verified. Redirecting to login
            page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
        <p>{error || "Invalid or expired verification token"}</p>
      </div>
      <Button
        variant="primary"
        onClick={() => (window.location.href = "/login")}
      >
        Go to Login
      </Button>
    </div>
  );
}

export function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          <p>Loading...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
