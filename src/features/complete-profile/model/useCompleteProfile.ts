"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfileMeStore } from "@/entities/profile";
import { useProfileBasicsForm } from "@/features/profile-basics";

function safeInternalPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw.includes("..")) return null;
  return raw;
}

export function useCompleteProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profile = useProfileMeStore((s) => s.profile);
  const [prefilled, setPrefilled] = useState(false);

  const { values, setField, resetFromProfile, submit, isLoading, error } =
    useProfileBasicsForm({
      onSuccess: () => {
        const next = safeInternalPath(searchParams.get("redirect"));
        router.replace(next ?? "/dashboard");
      },
    });

  useEffect(() => {
    if (!profile || prefilled) return;
    resetFromProfile(profile);
    setPrefilled(true);
  }, [profile, prefilled, resetFromProfile]);

  const handleSubmit = async () => {
    const ok = await submit();
    if (!ok) return;
  };

  return {
    values,
    setField,
    submit: handleSubmit,
    isLoading,
    error,
  };
}
