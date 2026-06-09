"use client";

import { Input } from "@/shared/ui/Input";
import type { CertificationFormValues } from "../lib/certificationForm";

interface CertificationFormFieldsProps {
  values: CertificationFormValues;
  setField: (field: keyof CertificationFormValues, value: string) => void;
  disabled?: boolean;
}

export function CertificationFormFields({
  values,
  setField,
  disabled = false,
}: CertificationFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Name"
        variant="auth"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="HCIA-Security Course"
        required
        disabled={disabled}
      />

      <Input
        label="Issuer"
        variant="auth"
        value={values.issuer}
        onChange={(e) => setField("issuer", e.target.value)}
        placeholder="Huawei"
        required
        disabled={disabled}
      />

      <fieldset className="space-y-2">
        <legend className="mb-1.5 block text-xs font-semibold tracking-wide text-white">
          Issue date
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Year"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={values.issueYear}
            onChange={(e) => setField("issueYear", e.target.value)}
            placeholder="2025"
            required
            disabled={disabled}
          />
          <Input
            label="Month"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={values.issueMonth}
            onChange={(e) => setField("issueMonth", e.target.value)}
            placeholder="12"
            required
            disabled={disabled}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-1.5 block text-xs font-semibold tracking-wide text-white">
          Expiration date <span className="font-normal text-zinc-500">(optional)</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Year"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={values.expireYear}
            onChange={(e) => setField("expireYear", e.target.value)}
            placeholder="2035"
            disabled={disabled}
          />
          <Input
            label="Month"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={values.expireMonth}
            onChange={(e) => setField("expireMonth", e.target.value)}
            placeholder="12"
            disabled={disabled}
          />
        </div>
      </fieldset>

      <Input
        label="Credential URL"
        variant="auth"
        type="url"
        value={values.credentialUrl}
        onChange={(e) => setField("credentialUrl", e.target.value)}
        placeholder="https://drive.google.com/..."
        disabled={disabled}
      />
    </div>
  );
}
