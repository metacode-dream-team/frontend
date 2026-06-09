"use client";

import Image from "next/image";
import type {
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
  ProfileTechSkill,
} from "@/entities/profile";
import { canDeleteProfileItemId } from "@/shared/lib/utils/canDeleteProfileItemId";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";
import {
  ProfileCard,
  ProfileTag,
  SectionAddButton,
  SectionDeleteButton,
  SectionHeading,
} from "./profile-primitives";

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

type ProfileItemDeleteHandler = (id: string, label: string) => void;

export function ProfileExperienceSection({
  items,
  canEdit = false,
  onAdd,
  onDelete,
}: {
  items: ProfileExperience[];
  canEdit?: boolean;
  onAdd?: () => void;
  onDelete?: ProfileItemDeleteHandler;
}) {
  return (
    <ProfileCard>
      <SectionHeading
        title="Experience"
        right={
          canEdit && onAdd ? (
            <SectionAddButton onClick={onAdd} label="Add experience" />
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {canEdit ? "No experience yet. Add your first role." : "No experience yet."}
        </p>
      ) : null}
      <ul className="space-y-8">
        {items.map((job) => (
          <li key={job.id} className="group flex gap-3">
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
                  {job.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{job.description}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-start gap-1">
                  <p className="rounded-md bg-zinc-950/80 px-2 py-1 text-xs text-zinc-400">
                    {job.start} — {job.end}
                  </p>
                  {canEdit && onDelete && canDeleteProfileItemId(job.id) ? (
                    <SectionDeleteButton
                      onClick={() => onDelete(job.id, job.title)}
                      label={`Delete ${job.title}`}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}

export function ProfileEducationSection({
  items,
  canEdit = false,
  onAdd,
  onDelete,
}: {
  items: ProfileEducation[];
  canEdit?: boolean;
  onAdd?: () => void;
  onDelete?: ProfileItemDeleteHandler;
}) {
  return (
    <ProfileCard>
      <SectionHeading
        title="Education"
        right={
          canEdit && onAdd ? (
            <SectionAddButton onClick={onAdd} label="Add education" />
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {canEdit ? "No education yet. Add your first one." : "No education yet."}
        </p>
      ) : null}
      <ul className="space-y-4">
        {items.map((ed) => (
          <li
            key={ed.id}
            className="group flex flex-col gap-3 rounded-xl bg-black/25 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
              {ed.logoUrl ? (
                shouldUseNativeImgForRemoteUrl(ed.logoUrl) ? (
                  <img
                    src={ed.logoUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Image
                    src={ed.logoUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized={isRemoteSvgImage(ed.logoUrl)}
                  />
                )
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
                <div className="flex shrink-0 items-center gap-1">
                  <p className="rounded-md bg-zinc-900/80 px-2 py-1 text-xs text-zinc-400">
                    {ed.start} — {ed.end}
                  </p>
                  {canEdit && onDelete && canDeleteProfileItemId(ed.id) ? (
                    <SectionDeleteButton
                      onClick={() => onDelete(ed.id, ed.degree || ed.school)}
                      label={`Delete ${ed.degree || ed.school}`}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    />
                  ) : null}
                </div>
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

export function ProfileCertificationsSection({
  items,
  canEdit = false,
  onAdd,
  onDelete,
}: {
  items: ProfileCertification[];
  canEdit?: boolean;
  onAdd?: () => void;
  onDelete?: ProfileItemDeleteHandler;
}) {
  return (
    <ProfileCard>
      <SectionHeading
        title="Licenses & Certifications"
        right={
          canEdit && onAdd ? (
            <SectionAddButton onClick={onAdd} label="Add certification" />
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {canEdit ? "No certifications yet. Add your first one." : "No certifications yet."}
        </p>
      ) : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="group flex gap-3 rounded-xl bg-black/25 p-3 transition-colors hover:bg-black/35"
          >
            <ProviderMark provider={c.provider} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{c.title}</p>
              <p className="text-xs text-zinc-500">
                {c.issuer} · Issued {c.issued}
                {c.expires ? ` · Expires ${c.expires}` : null}
              </p>
              {c.credentialUrl ? (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block text-xs font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
                >
                  View credential
                </a>
              ) : null}
            </div>
            {canEdit && onDelete && canDeleteProfileItemId(c.id) ? (
              <SectionDeleteButton
                onClick={() => onDelete(c.id, c.title)}
                label={`Delete ${c.title}`}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}

export function ProfileTechSkillsSection({
  skills,
  canEdit = false,
  onAdd,
  onDelete,
}: {
  skills: ProfileTechSkill[];
  canEdit?: boolean;
  onAdd?: () => void;
  onDelete?: ProfileItemDeleteHandler;
}) {
  return (
    <ProfileCard>
      <SectionHeading
        title="Skills"
        right={
          canEdit && onAdd ? (
            <SectionAddButton onClick={onAdd} label="Add skill" />
          ) : undefined
        }
      />
      {skills.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {canEdit ? "No skills yet. Add your first one." : "No skills yet."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div key={skill.id} className="group relative inline-flex items-center">
              <ProfileTag>{skill.name}</ProfileTag>
              {canEdit && onDelete && canDeleteProfileItemId(skill.id) ? (
                <SectionDeleteButton
                  onClick={() => onDelete(skill.id, skill.name)}
                  label={`Delete ${skill.name}`}
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-zinc-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </ProfileCard>
  );
}
