"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import { CertificationFormFields } from "./CertificationFormFields";
import { useAddProfileCertification } from "../model/useAddProfileCertification";

interface AddProfileCertificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfileCertificationModal({
  open,
  onOpenChange,
}: AddProfileCertificationModalProps) {
  const { values, setField, resetForm, submit, isLoading, error } =
    useAddProfileCertification({
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
      title="Add certification"
      description="Add a license or certification to your profile."
      submitLabel="Add certification"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
    >
      <CertificationFormFields
        values={values}
        setField={setField}
        disabled={isLoading}
      />
    </ProfileFormModal>
  );
}
