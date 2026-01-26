/**
 * Форма запроса на восстановление пароля
 */

"use client";

import { useState } from "react";
import { useForgotPassword } from "../model/useForgotPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading, error, success } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email);
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
          <p>
            If an account exists with that email, a reset link has been sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <p className="text-gray-600 dark:text-gray-400">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
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
        Send Reset Link
      </Button>
    </form>
  );
}
