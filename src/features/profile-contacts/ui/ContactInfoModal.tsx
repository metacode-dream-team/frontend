"use client";

import type { ProfileContacts } from "@/shared/types/profile";
import { ProfileViewModal } from "@/features/profile-forms";
import { normalizeUrl } from "@/shared/lib/utils/normalizeUrl";
import { hasContactsContent } from "../lib/contactsMappers";

interface ContactInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts?: ProfileContacts | null;
  canEdit?: boolean;
  onEdit?: () => void;
}

function formatPhoneType(type?: string): string {
  if (!type?.trim()) return "";
  return type.trim().charAt(0).toUpperCase() + type.trim().slice(1);
}

export function ContactInfoModal({
  open,
  onOpenChange,
  contacts,
  canEdit = false,
  onEdit,
}: ContactInfoModalProps) {
  const hasContent = hasContactsContent(contacts);

  return (
    <ProfileViewModal
      open={open}
      onOpenChange={onOpenChange}
      title="Contact info"
      description="Email, phone, and links."
      canEdit={canEdit}
      onEdit={onEdit}
    >
      {!hasContent ? (
        <p className="text-sm text-zinc-500">No contact info yet.</p>
      ) : (
        <dl className="space-y-4 text-sm">
          {contacts?.email ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-violet-300 transition-colors hover:text-violet-200"
                >
                  {contacts.email}
                </a>
              </dd>
            </div>
          ) : null}

          {contacts?.phone?.value ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${contacts.phone.value}`}
                  className="text-zinc-200 transition-colors hover:text-violet-200"
                >
                  {formatPhoneType(contacts.phone.type)}
                  {contacts.phone.type ? ": " : ""}
                  {contacts.phone.value}
                </a>
              </dd>
            </div>
          ) : null}

          {contacts?.websites && contacts.websites.length > 0 ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Websites
              </dt>
              <dd className="mt-2 space-y-2">
                {contacts.websites.map((site) => (
                  <a
                    key={`${site.type}-${site.url}`}
                    href={normalizeUrl(site.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-violet-300 transition-colors hover:text-violet-200"
                  >
                    <span className="text-zinc-500">{site.type}: </span>
                    {site.url}
                  </a>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      )}
    </ProfileViewModal>
  );
}
