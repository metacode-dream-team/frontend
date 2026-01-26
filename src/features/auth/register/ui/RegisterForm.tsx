/**
 * Форма регистрации
 */

"use client";

import { useState } from "react";
import { useRegister } from "../model/useRegister";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isLoading, error, success } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password, confirmPassword);
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Registration successful! Please check your email to verify your
          account.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={isLoading}
      />

      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password (min 8 characters)"
        required
        disabled={isLoading}
      />

      <Input
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
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
        Sign Up
      </Button>
    </form>
  );
}
