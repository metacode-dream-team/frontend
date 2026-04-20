"use client";

import Image from "next/image";
import type { ProfileCertification, ProfileEducation, ProfileExperience } from "@/entities/profile";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { ProfileCard, ProfileTag, SectionHeading } from "./profile-primitives";

function CompanyMark({ label }: { label: string }) {
  const letter = label.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-200">
      {letter}
    </div>
  );
}

function ProviderMark({ provider }: { provider: ProfileCertification["provider"] }) {
  if (provider === "aws") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#232f3e] text-[10px] font-bold leading-tight tracking-tight text-orange-300">
        AWS
      </div>
    );
  }
  if (provider === "huawei") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/80 text-[10px] font-bold text-red-100">
        HW
      </div>
    );
  }
  if (provider === "google") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-bold text-blue-300">
        G
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300">
      —
    </div>
  );
}

export function ProfileExperienceSection({ items }: { items: ProfileExperience[] }) {
  return (
    <ProfileCard>
      <SectionHeading title="Experience" />
      <ul className="space-y-8">
        {items.map((job) => (
          <li key={job.id} className="flex gap-3">
            <CompanyMark label={job.company} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{job.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    <span className="font-medium text-[#b84dff]">{job.company}</span>
                    <span className="text-zinc-600"> · </span>
                    <span>{job.employmentType}</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {job.workMode} · {job.location}
                  </p>
                  {job.description ? <p className="mt-2 text-sm leading-relaxed text-zinc-400">{job.description}</p> : null}
                </div>
                <p className="shrink-0 rounded-md bg-zinc-950/80 px-2 py-1 text-xs text-zinc-400">
                  {job.start} — {job.end}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}

export function ProfileEducationSection({ items }: { items: ProfileEducation[] }) {
  return (
    <ProfileCard>
      <SectionHeading title="Education" />
      <ul className="space-y-4">
        {items.map((ed) => (
          <li
            key={ed.id}
            className="flex flex-col gap-3 rounded-xl bg-black/25 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
              {ed.logoUrl ? (
                <Image
                  src={ed.logoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized={isRemoteSvgImage(ed.logoUrl)}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-400">
                  {ed.school.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{ed.degree}</p>
                  <p className="text-sm font-medium text-[#b84dff]">{ed.school}</p>
                </div>
                <p className="shrink-0 rounded-md bg-zinc-900/80 px-2 py-1 text-xs text-zinc-400">
                  {ed.start} — {ed.end}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                {ed.gpa ? <span>GPA: {ed.gpa}</span> : null}
                {ed.specialization ? <span>Track: {ed.specialization}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}

export function ProfileCertificationsSection({ items }: { items: ProfileCertification[] }) {
  return (
    <ProfileCard>
      <SectionHeading title="Licenses & Certifications" />
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="flex gap-3 rounded-xl bg-black/25 p-3 transition-colors hover:bg-black/35"
          >
            <ProviderMark provider={c.provider} />
            <div className="min-w-0">
              <p className="font-semibold text-white">{c.title}</p>
              <p className="text-xs text-zinc-500">
                {c.issuer} · Issued {c.issued}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}

export function ProfileTechSkillsSection({ skills }: { skills: string[] }) {
  return (
    <ProfileCard>
      <SectionHeading title="Skills" />
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <ProfileTag key={s}>{s}</ProfileTag>
        ))}
      </div>
    </ProfileCard>
  );
}
