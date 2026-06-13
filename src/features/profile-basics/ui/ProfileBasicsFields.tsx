"use client";

import { Input } from "@/shared/ui/Input";
import type { CompleteProfileFormValues } from "@/shared/lib/utils/validation";

interface ProfileBasicsFieldsProps {
  values: CompleteProfileFormValues;
  setField: (field: keyof CompleteProfileFormValues, value: string) => void;
  disabled?: boolean;
  showLinks?: boolean;
  usernameLocked?: boolean;
}

export function ProfileBasicsFields({
  values,
  setField,
  disabled = false,
  showLinks = false,
  usernameLocked = false,
}: ProfileBasicsFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Username"
        variant="auth"
        value={values.username}
        onChange={(e) => setField("username", e.target.value)}
        placeholder="sayan_computer_wizard"
        autoComplete="username"
        required
        disabled={disabled || usernameLocked}
      />
      {usernameLocked ? (
        <p className="-mt-2 text-xs text-zinc-500">
          Username is set during initial profile setup and cannot be changed here.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          variant="auth"
          value={values.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
          placeholder="Sayan"
          autoComplete="given-name"
          required
          disabled={disabled}
        />
        <Input
          label="Last name"
          variant="auth"
          value={values.lastName}
          onChange={(e) => setField("lastName", e.target.value)}
          placeholder="Sixseven"
          autoComplete="family-name"
          required
          disabled={disabled}
        />
      </div>

      <Input
        label="Headline"
        variant="auth"
        value={values.headline}
        onChange={(e) => setField("headline", e.target.value)}
        placeholder="Software Engineering"
        required
        disabled={disabled}
      />

      {showLinks ? (
        <>
          <Input
            label="Position link"
            variant="auth"
            type="url"
            value={values.positionLink}
            onChange={(e) => setField("positionLink", e.target.value)}
            placeholder="https://linkedin.com/in/example"
            disabled={disabled}
          />
          <Input
            label="School link"
            variant="auth"
            type="url"
            value={values.schoolLink}
            onChange={(e) => setField("schoolLink", e.target.value)}
            placeholder="https://university.example.com"
            disabled={disabled}
          />
        </>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Country"
          variant="auth"
          value={values.country}
          onChange={(e) => setField("country", e.target.value)}
          placeholder="Kazakhstan"
          autoComplete="country-name"
          required
          disabled={disabled}
        />
        <Input
          label="City"
          variant="auth"
          value={values.city}
          onChange={(e) => setField("city", e.target.value)}
          placeholder="Almaty"
          autoComplete="address-level2"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
}
