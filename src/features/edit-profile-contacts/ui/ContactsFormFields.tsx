"use client";

import { Input } from "@/shared/ui/Input";
import { AuthSelect } from "@/shared/ui/AuthSelect/AuthSelect";
import { Button } from "@/shared/ui/Button";
import type { ContactsFormValues } from "@/features/profile-contacts/lib/contactsMappers";

const PHONE_TYPES = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
] as const;

interface ContactsFormFieldsProps {
  values: ContactsFormValues;
  setField: (field: keyof Omit<ContactsFormValues, "websites">, value: string) => void;
  onWebsiteChange: (index: number, field: "type" | "url", value: string) => void;
  onAddWebsite: () => void;
  onRemoveWebsite: (index: number) => void;
  disabled?: boolean;
}

export function ContactsFormFields({
  values,
  setField,
  onWebsiteChange,
  onAddWebsite,
  onRemoveWebsite,
  disabled = false,
}: ContactsFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Email"
        variant="auth"
        type="email"
        value={values.email}
        onChange={(e) => setField("email", e.target.value)}
        placeholder="you@example.com"
        disabled={disabled}
      />

      <AuthSelect
        id="contact-phone-type"
        label="Phone type"
        value={values.phoneType}
        onChange={(value) => setField("phoneType", value)}
        disabled={disabled}
      >
        {PHONE_TYPES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>

      <Input
        label="Phone"
        variant="auth"
        type="tel"
        value={values.phoneValue}
        onChange={(e) => setField("phoneValue", e.target.value)}
        placeholder="+7 700 000 0000"
        disabled={disabled}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-white">Websites</p>
          <Button
            type="button"
            variant="outline"
            className="h-8 border-zinc-700 bg-transparent px-3 text-xs text-zinc-300 hover:bg-zinc-800/80"
            disabled={disabled}
            onClick={onAddWebsite}
          >
            Add website
          </Button>
        </div>

        {values.websites.map((site, index) => (
          <div
            key={`website-${index}`}
            className="space-y-3 rounded-xl border border-zinc-800/80 bg-black/20 p-3"
          >
            <Input
              label="Type"
              variant="auth"
              value={site.type}
              onChange={(e) => onWebsiteChange(index, "type", e.target.value)}
              placeholder="portfolio"
              disabled={disabled}
            />
            <Input
              label="URL"
              variant="auth"
              type="url"
              value={site.url}
              onChange={(e) => onWebsiteChange(index, "url", e.target.value)}
              placeholder="https://example.com"
              disabled={disabled}
            />
            {values.websites.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="h-8 border-zinc-700 bg-transparent px-3 text-xs text-zinc-300 hover:bg-zinc-800/80"
                disabled={disabled}
                onClick={() => onRemoveWebsite(index)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
