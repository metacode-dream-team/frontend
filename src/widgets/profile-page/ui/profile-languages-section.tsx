"use client";

import type { ProfileSpokenLanguage } from "@/entities/profile";
import {
  formatLanguageCodeDisplay,
  formatLanguageLevelDisplay,
} from "@/features/add-profile-language";
import { canDeleteProfileItemId } from "@/shared/lib/utils/canDeleteProfileItemId";
import { ProfileTag, SectionAddButton, SectionDeleteButton } from "./profile-primitives";

export function ProfileSpokenLanguagesSection({
  items,
  canEdit = false,
  onAdd,
  onDelete,
}: {
  items: ProfileSpokenLanguage[];
  canEdit?: boolean;
  onAdd?: () => void;
  onDelete?: (id: string, label: string) => void;
}) {
  if (!canEdit && items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 pt-2 max-lg:mt-4 max-lg:pt-0">
      <div className="mb-3 flex items-center justify-between gap-3 max-lg:mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Languages
        </h3>
        {canEdit && onAdd ? (
          <SectionAddButton onClick={onAdd} label="Add language" />
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No languages yet. Add your first one.</p>
      ) : (
        <ul className="space-y-2 max-lg:space-y-1">
          {items.map((lang) => {
            const label = formatLanguageCodeDisplay(lang.code);
            return (
              <li key={lang.id} className="group flex items-center justify-between gap-2 text-sm">
                <ProfileTag>{label}</ProfileTag>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium capitalize text-zinc-400">
                    {formatLanguageLevelDisplay(lang.level)}
                  </span>
                  {canEdit && onDelete && canDeleteProfileItemId(lang.id) ? (
                    <SectionDeleteButton
                      onClick={() => onDelete(lang.id, label)}
                      label={`Delete ${label}`}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
