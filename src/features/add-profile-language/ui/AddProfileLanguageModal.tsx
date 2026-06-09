"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import { LanguageFormFields } from "./LanguageFormFields";
import { useAddProfileLanguage } from "../model/useAddProfileLanguage";

interface AddProfileLanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfileLanguageModal({
  open,
  onOpenChange,
}: AddProfileLanguageModalProps) {
  const { values, setField, resetForm, submit, isLoading, error } =
    useAddProfileLanguage({
      onSuccess: () => onOpenChange(false),
    });

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  return (
    <ProfileFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add language"
      description="Add a language and your proficiency level."
      submitLabel="Add language"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
      maxWidthClassName="max-w-[420px]"
    >
      <LanguageFormFields values={values} setField={setField} disabled={isLoading} />
    </ProfileFormModal>
  );
}
