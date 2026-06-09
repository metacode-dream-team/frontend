"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import { EducationFormFields } from "./EducationFormFields";
import { useAddProfileEducation } from "../model/useAddProfileEducation";

interface AddProfileEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfileEducationModal({
  open,
  onOpenChange,
}: AddProfileEducationModalProps) {
  const { values, setField, resetForm, submit, isLoading, error } =
    useAddProfileEducation({
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
      title="Add education"
      description="Add a school or university to your profile."
      submitLabel="Add education"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
    >
      <EducationFormFields values={values} setField={setField} disabled={isLoading} />
    </ProfileFormModal>
  );
}
