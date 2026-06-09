"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import { SkillFormFields } from "./SkillFormFields";
import { useAddProfileSkill } from "../model/useAddProfileSkill";

interface AddProfileSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfileSkillModal({
  open,
  onOpenChange,
}: AddProfileSkillModalProps) {
  const { values, setField, resetForm, submit, isLoading, error } =
    useAddProfileSkill({
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
      title="Add skill"
      description="Add a technology or tool to your skills."
      submitLabel="Add skill"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
      maxWidthClassName="max-w-[420px]"
    >
      <SkillFormFields values={values} setField={setField} disabled={isLoading} />
    </ProfileFormModal>
  );
}
