"use client";

import { Input } from "@/shared/ui/Input";
import { AuthSelect } from "@/shared/ui/AuthSelect/AuthSelect";
import type { PersonalFormValues } from "@/features/profile-personal/lib/personalMappers";

const GENDER_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

interface PersonalFormFieldsProps {
  values: PersonalFormValues;
  setField: (field: keyof PersonalFormValues, value: string) => void;
  disabled?: boolean;
}

export function PersonalFormFields({
  values,
  setField,
  disabled = false,
}: PersonalFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Address"
        variant="auth"
        value={values.address}
        onChange={(e) => setField("address", e.target.value)}
        placeholder="123 Main St, Almaty"
        disabled={disabled}
      />

      <fieldset className="space-y-2">
        <legend className="mb-1.5 block text-xs font-semibold tracking-wide text-white">
          Birth date <span className="font-normal text-zinc-500">(optional)</span>
        </legend>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Year"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={values.birthYear}
            onChange={(e) => setField("birthYear", e.target.value)}
            placeholder="1998"
            disabled={disabled}
          />
          <Input
            label="Month"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={values.birthMonth}
            onChange={(e) => setField("birthMonth", e.target.value)}
            placeholder="6"
            disabled={disabled}
          />
          <Input
            label="Day"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            value={values.birthDay}
            onChange={(e) => setField("birthDay", e.target.value)}
            placeholder="15"
            disabled={disabled}
          />
        </div>
      </fieldset>

      <AuthSelect
        id="personal-gender"
        label="Gender"
        value={values.gender}
        onChange={(value) => setField("gender", value)}
        disabled={disabled}
      >
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value || "unset"} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>
    </div>
  );
}
