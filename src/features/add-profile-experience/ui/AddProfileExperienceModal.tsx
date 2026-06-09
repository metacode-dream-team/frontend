"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import { ExperienceFormFields } from "./ExperienceFormFields";
import { useAddProfileExperience } from "../model/useAddProfileExperience";

interface AddProfileExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfileExperienceModal({
  open,
  onOpenChange,
}: AddProfileExperienceModalProps) {
  const { values, setField, setIsCurrent, resetForm, submit, isLoading, error } =
    useAddProfileExperience({
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
      title="Add experience"
      description="Add a role or position to your work history."
      submitLabel="Add experience"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
    >
      <ExperienceFormFields
        values={values}
        setField={setField}
        setIsCurrent={setIsCurrent}
        disabled={isLoading}
      />
    </ProfileFormModal>
  );
}
