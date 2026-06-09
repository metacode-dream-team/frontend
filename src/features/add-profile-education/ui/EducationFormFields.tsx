"use client";

import { Input } from "@/shared/ui/Input";
import { cn } from "@/shared/lib/utils/cn";
import type { EducationFormValues } from "../lib/educationForm";

interface EducationFormFieldsProps {
  values: EducationFormValues;
  setField: (field: keyof EducationFormValues, value: string) => void;
  disabled?: boolean;
}

export function EducationFormFields({
  values,
  setField,
  disabled = false,
}: EducationFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="School"
        variant="auth"
        value={values.school}
        onChange={(e) => setField("school", e.target.value)}
        placeholder="Satbayev University"
        required
        disabled={disabled}
      />

      <Input
        label="Degree"
        variant="auth"
        value={values.degree}
        onChange={(e) => setField("degree", e.target.value)}
        placeholder="Master's degree"
        required
        disabled={disabled}
      />

      <Input
        label="Field of study"
        variant="auth"
        value={values.fieldOfStudy}
        onChange={(e) => setField("fieldOfStudy", e.target.value)}
        placeholder="Computer Science"
        disabled={disabled}
      />

      <fieldset className="space-y-2">
        <legend className="mb-1.5 block text-xs font-semibold tracking-wide text-white">
          Start date
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Year"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={values.startYear}
            onChange={(e) => setField("startYear", e.target.value)}
            placeholder="2026"
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
            value={values.startMonth}
            onChange={(e) => setField("startMonth", e.target.value)}
            placeholder="9"
            required
            disabled={disabled}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-1.5 block text-xs font-semibold tracking-wide text-white">
          End date <span className="font-normal text-zinc-500">(optional)</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Year"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={values.endYear}
            onChange={(e) => setField("endYear", e.target.value)}
            placeholder="2028"
            disabled={disabled}
          />
          <Input
            label="Month"
            variant="auth"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={values.endMonth}
            onChange={(e) => setField("endMonth", e.target.value)}
            placeholder="6"
            disabled={disabled}
          />
        </div>
      </fieldset>

      <Input
        label="Grade"
        variant="auth"
        value={values.grade}
        onChange={(e) => setField("grade", e.target.value)}
        placeholder="3.8"
        disabled={disabled}
      />

      <div className="w-full">
        <label
          htmlFor="education-description"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-white"
        >
          Description <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="education-description"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Activities, achievements, or notes about your studies"
          rows={3}
          disabled={disabled}
          className={cn(
            "w-full resize-y rounded-lg border border-zinc-700/80 bg-[#121214] px-4 py-2.5 text-sm text-white",
            "placeholder:text-zinc-500 transition-colors",
            "focus:border-[#a855f7]/50 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/35",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
    </div>
  );
}
