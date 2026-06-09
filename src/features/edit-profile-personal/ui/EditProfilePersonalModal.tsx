"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import type { ProfilePersonal } from "@/shared/types/profile";
import { PersonalFormFields } from "./PersonalFormFields";
import { useEditProfilePersonal } from "../model/useEditProfilePersonal";

interface EditProfilePersonalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personal?: ProfilePersonal | null;
}

export function EditProfilePersonalModal({
  open,
  onOpenChange,
  personal,
}: EditProfilePersonalModalProps) {
  const { values, setField, resetFromPersonal, submit, isLoading, error } =
    useEditProfilePersonal({
      onSuccess: () => onOpenChange(false),
    });

  useEffect(() => {
    if (!open) return;
    resetFromPersonal(personal);
  }, [open, personal, resetFromPersonal]);

  return (
    <ProfileFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit personal info"
      description="Update your address, birth date, and gender."
      submitLabel="Save changes"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
      zIndexClassName="z-[110]"
    >
      <PersonalFormFields values={values} setField={setField} disabled={isLoading} />
    </ProfileFormModal>
  );
}
