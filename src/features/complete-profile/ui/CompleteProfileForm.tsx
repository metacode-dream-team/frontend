"use client";

import { ProfileBasicsFields } from "@/features/profile-basics";
import { Button } from "@/shared/ui/Button";
import { useCompleteProfile } from "../model/useCompleteProfile";

export function CompleteProfileForm() {
  const { values, setField, submit, isLoading, error } = useCompleteProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tell us a bit about yourself to unlock MetaCode.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </div>
      )}

      <ProfileBasicsFields
        values={values}
        setField={setField}
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="mt-2 w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Continue
      </Button>
    </form>
  );
}
