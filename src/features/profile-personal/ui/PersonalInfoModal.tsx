"use client";

import type { ProfilePersonal } from "@/shared/types/profile";
import { ProfileViewModal } from "@/features/profile-forms";
import {
  formatBirthDateDisplay,
  formatGenderDisplay,
  hasPersonalContent,
} from "../lib/personalMappers";

interface PersonalInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personal?: ProfilePersonal | null;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function PersonalInfoModal({
  open,
  onOpenChange,
  personal,
  canEdit = false,
  onEdit,
}: PersonalInfoModalProps) {
  const hasContent = hasPersonalContent(personal);
  const birthDate = formatBirthDateDisplay(personal?.birthDate);
  const gender = formatGenderDisplay(personal?.gender);

  return (
    <ProfileViewModal
      open={open}
      onOpenChange={onOpenChange}
      title="Personal info"
      description="Address, birth date, and gender."
      canEdit={canEdit}
      onEdit={onEdit}
    >
      {!hasContent ? (
        <p className="text-sm text-zinc-500">No personal info yet.</p>
      ) : (
        <dl className="space-y-4 text-sm">
          {personal?.address ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Address
              </dt>
              <dd className="mt-1 text-zinc-200">{personal.address}</dd>
            </div>
          ) : null}

          {birthDate ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Birth date
              </dt>
              <dd className="mt-1 text-zinc-200">{birthDate}</dd>
            </div>
          ) : null}

          {gender ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Gender
              </dt>
              <dd className="mt-1 text-zinc-200">{gender}</dd>
            </div>
          ) : null}
        </dl>
      )}
    </ProfileViewModal>
  );
}
