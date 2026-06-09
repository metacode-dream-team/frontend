"use client";

import { useEffect } from "react";
import { ProfileFormModal } from "@/features/profile-forms";
import type { ProfileContacts } from "@/shared/types/profile";
import { ContactsFormFields } from "./ContactsFormFields";
import { useEditProfileContacts } from "../model/useEditProfileContacts";

interface EditProfileContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts?: ProfileContacts | null;
}

export function EditProfileContactsModal({
  open,
  onOpenChange,
  contacts,
}: EditProfileContactsModalProps) {
  const {
    values,
    setField,
    addWebsite,
    removeWebsite,
    updateWebsite,
    resetFromContacts,
    submit,
    isLoading,
    error,
  } = useEditProfileContacts({
    onSuccess: () => onOpenChange(false),
  });

  useEffect(() => {
    if (!open) return;
    resetFromContacts(contacts);
  }, [open, contacts, resetFromContacts]);

  return (
    <ProfileFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit contact info"
      description="Update your email, phone, and website links."
      submitLabel="Save changes"
      isLoading={isLoading}
      error={error}
      onSubmit={submit}
      zIndexClassName="z-[110]"
    >
      <ContactsFormFields
        values={values}
        setField={setField}
        onWebsiteChange={updateWebsite}
        onAddWebsite={addWebsite}
        onRemoveWebsite={removeWebsite}
        disabled={isLoading}
      />
    </ProfileFormModal>
  );
}
