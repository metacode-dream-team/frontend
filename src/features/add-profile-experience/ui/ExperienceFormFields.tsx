"use client";

import { Input } from "@/shared/ui/Input";
import { AuthSelect } from "@/shared/ui/AuthSelect/AuthSelect";
import { cn } from "@/shared/lib/utils/cn";
import type { ExperienceFormValues } from "../lib/experienceForm";

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "self_employed", label: "Self-employed" },
] as const;

const LOCATION_TYPES = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
] as const;

interface ExperienceFormFieldsProps {
  values: ExperienceFormValues;
  setField: (field: keyof ExperienceFormValues, value: string) => void;
  setIsCurrent: (isCurrent: boolean) => void;
  disabled?: boolean;
}

export function ExperienceFormFields({
  values,
  setField,
  setIsCurrent,
  disabled = false,
}: ExperienceFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Title"
        variant="auth"
        value={values.title}
        onChange={(e) => setField("title", e.target.value)}
        placeholder="Backend Developer"
        required
        disabled={disabled}
      />

      <Input
        label="Company"
        variant="auth"
        value={values.company}
        onChange={(e) => setField("company", e.target.value)}
        placeholder="Tech Corp"
        required
        disabled={disabled}
      />

      <AuthSelect
        id="experience-employment-type"
        label="Employment type"
        value={values.employmentType}
        onChange={(value) => setField("employmentType", value)}
        disabled={disabled}
      >
        {EMPLOYMENT_TYPES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>

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
            placeholder="2023"
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
            placeholder="7"
            required
            disabled={disabled}
          />
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={values.isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-zinc-600 bg-[#121214] text-[#a855f7] focus:ring-[#a855f7]/35"
        />
        I currently work here
      </label>

      {!values.isCurrent ? (
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
              placeholder="2025"
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
              placeholder="12"
              disabled={disabled}
            />
          </div>
        </fieldset>
      ) : null}

      <AuthSelect
        id="experience-location-type"
        label="Work mode"
        value={values.locationType}
        onChange={(value) => setField("locationType", value)}
        disabled={disabled}
      >
        {LOCATION_TYPES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Country"
          variant="auth"
          value={values.country}
          onChange={(e) => setField("country", e.target.value)}
          placeholder="Kazakhstan"
          autoComplete="country-name"
          disabled={disabled}
        />
        <Input
          label="City"
          variant="auth"
          value={values.city}
          onChange={(e) => setField("city", e.target.value)}
          placeholder="Almaty"
          autoComplete="address-level2"
          disabled={disabled}
        />
      </div>

      <Input
        label="Profile headline"
        variant="auth"
        value={values.profileHeadline}
        onChange={(e) => setField("profileHeadline", e.target.value)}
        placeholder="Backend Engineer specializing in scalable systems"
        disabled={disabled}
      />

      <div className="w-full">
        <label
          htmlFor="experience-description"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-white"
        >
          Description <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="experience-description"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Developed backend services using Go and MongoDB"
          rows={4}
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
