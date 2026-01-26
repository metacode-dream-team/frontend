/**
 * Форма сброса пароля
 */

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../model/useResetPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

function ResetPasswordFormContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isLoading, error, success } = useResetPassword(token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetPassword(newPassword, confirmPassword);
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
          <p>
            Reset token is missing. Please request a new password reset link.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Password Reset Successful!</h2>
          <p>Your password has been updated. Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Input
        type="password"
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password (min 8 characters)"
        required
        disabled={isLoading}
      />

      <Input
        type="password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        required
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Reset Password
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="text-center">Loading...</p>
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
