"use client";

import type { ProfileSpokenLanguage } from "@/entities/profile";
import {
  formatLanguageCodeDisplay,
  formatLanguageLevelDisplay,
} from "@/features/add-profile-language";
import { ProfileTag, SectionAddButton } from "./profile-primitives";

export function ProfileSpokenLanguagesSection({
  items,
  canEdit = false,
  onAdd,
}: {
  items: ProfileSpokenLanguage[];
  canEdit?: boolean;
  onAdd?: () => void;
}) {
  if (!canEdit && items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 pt-2">
      <div className="mb-3 flex items-center justify-between gap-3">
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
        <ul className="space-y-2">
          {items.map((lang) => (
            <li key={lang.id} className="flex items-center justify-between gap-2 text-sm">
              <ProfileTag>{formatLanguageCodeDisplay(lang.code)}</ProfileTag>
              <span className="text-xs font-medium capitalize text-zinc-400">
                {formatLanguageLevelDisplay(lang.level)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
