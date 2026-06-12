"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProfileData, SkillGroup } from "@/entities/profile";
import { AddProfileCertificationModal } from "@/features/add-profile-certification";
import { AddProfileEducationModal } from "@/features/add-profile-education";
import { AddProfileExperienceModal } from "@/features/add-profile-experience";
import { AddProfileLanguageModal } from "@/features/add-profile-language";
import { AddProfileSkillModal } from "@/features/add-profile-skill";
import { EditProfileAboutModal } from "@/features/edit-profile-about";
import { EditProfileBasicsModal } from "@/features/edit-profile-basics";
import { EditProfileContactsModal } from "@/features/edit-profile-contacts";
import { EditProfilePersonalModal } from "@/features/edit-profile-personal";
import { ContactInfoModal } from "@/features/profile-contacts";
import { PersonalInfoModal } from "@/features/profile-personal";
import { ProfileConfirmDialog, useProfileDeleteItem } from "@/features/profile-forms";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";
import { ProfileAchievementsBlock } from "./profile-achievements-block";
import {
  ProfileCertificationsSection,
  ProfileEducationSection,
  ProfileExperienceSection,
  ProfileTechSkillsSection,
} from "./profile-career-blocks";
import {
  ProfileCard,
  ProfileEditButton,
  ProfileTag,
  skillLevelDotClass,
} from "./profile-primitives";
import { SolvedProgressCard } from "./solved-progress-card";
import { ProfileSpokenLanguagesSection } from "./profile-languages-section";
import { SubmissionHeatmap } from "./submission-heatmap";

interface ProfilePageContentProps {
  profile: ProfileData;
  canEdit?: boolean;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-zinc-500" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const SKILLS_PREVIEW_COUNT = 5;

function SkillGroupBlock({ group }: { group: SkillGroup }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = group.items.length > SKILLS_PREVIEW_COUNT;
  const visibleItems = expanded ? group.items : group.items.slice(0, SKILLS_PREVIEW_COUNT);
  const hiddenCount = group.items.length - SKILLS_PREVIEW_COUNT;

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        <span className={`h-1.5 w-1.5 rounded-full ${skillLevelDotClass(group.level)}`} />
        {group.level}
      </p>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <ProfileTag key={item.name}>
            {item.name}
            <span className="text-zinc-500">×{item.count}</span>
          </ProfileTag>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          {expanded ? "Show less" : `Show all (+${hiddenCount})`}
        </button>
      )}
    </div>
  );
}

export function ProfilePageContent({
  profile,
  canEdit = false,
}: ProfilePageContentProps) {
  const [editBasicsOpen, setEditBasicsOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [addCertificationOpen, setAddCertificationOpen] = useState(false);
  const [addEducationOpen, setAddEducationOpen] = useState(false);
  const [addExperienceOpen, setAddExperienceOpen] = useState(false);
  const [addLanguageOpen, setAddLanguageOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [contactViewOpen, setContactViewOpen] = useState(false);
  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [personalViewOpen, setPersonalViewOpen] = useState(false);
  const [personalEditOpen, setPersonalEditOpen] = useState(false);
  const deleteItem = useProfileDeleteItem();
  const avatarPlain = shouldUseNativeImgForRemoteUrl(profile.avatarUrl);
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <aside className="order-2 w-full shrink-0 bg-black lg:order-1 lg:w-[280px] lg:min-w-[280px]">
        <div className="lg:sticky lg:top-20">
          <div className="min-w-0">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black shadow-inner">
              {avatarPlain ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                  unoptimized={isRemoteSvgImage(profile.avatarUrl)}
                />
              )}
            </div>
            <div className="mt-4 min-w-0 sm:ml-4 sm:mt-0">
              <h1 className="text-lg font-semibold tracking-tight text-white">{profile.fullName}</h1>
              <p className="mt-0.5 text-center text-sm text-zinc-500 sm:text-left">{profile.username}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5 sm:justify-start">
                <p className="text-sm">
                  <span className="text-zinc-500">Rank </span>
                  <span className="font-semibold tabular-nums text-[#b84dff]">
                    {profile.rank.toLocaleString()}
                  </span>
                </p>
                {canEdit ? (
                  <ProfileEditButton
                    onClick={() => setEditBasicsOpen(true)}
                    aria-label="Edit profile"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-medium text-[#b84dff] sm:text-left">{profile.role}</p>
          {(profile.about || canEdit) && (
            <div className="relative mt-2 pr-9">
              {canEdit ? (
                <div className="absolute right-0 top-0">
                  <ProfileEditButton
                    onClick={() => setEditAboutOpen(true)}
                    aria-label="Edit about"
                  />
                </div>
              ) : null}
              {profile.about ? (
                <p className="text-center text-sm leading-relaxed text-zinc-400 sm:text-left">
                  {profile.about}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditAboutOpen(true)}
                  className="w-full text-center text-sm italic text-zinc-600 transition-colors hover:text-zinc-400 sm:text-left"
                >
                  Add a short bio…
                </button>
              )}
            </div>
          )}
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-zinc-500 sm:justify-start">
            <MapPinIcon />
            {profile.location}
          </p>

          <button
            type="button"
            onClick={() => setPersonalViewOpen(true)}
            className="mt-1 w-full text-center text-xs font-medium text-zinc-500 transition-colors hover:text-[#b84dff] sm:text-left"
          >
            Personal info
          </button>

          <button
            type="button"
            onClick={() => setContactViewOpen(true)}
            className="mt-1 w-full text-center text-xs font-medium text-zinc-500 transition-colors hover:text-[#b84dff] sm:text-left"
          >
            Contact info
          </button>

          <p className="mt-4 text-center text-sm text-zinc-400 sm:text-left">
            <span className="font-medium text-zinc-200">{profile.following}</span> Following
            <span className="mx-2 text-zinc-700">|</span>
            <span className="font-medium text-zinc-200">{profile.followers}</span> Followers
          </p>

          {!canEdit ? (
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800/90 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              <CheckIcon />
              Following
            </button>
          ) : null}

          <ProfileSpokenLanguagesSection
            items={profile.spokenLanguages}
            canEdit={canEdit}
            onAdd={() => setAddLanguageOpen(true)}
            onDelete={
              canEdit
                ? (id, label) => deleteItem.requestDelete("languages", id, label)
                : undefined
            }
          />

          <section className="mt-8 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">DSA Skills</h3>
            <div className="mt-4 space-y-4">
              {profile.skills.map((group) => (
                <SkillGroupBlock key={group.level} group={group} />
              ))}
            </div>
          </section>
          </div>
        </div>
      </aside>

      <main className="order-1 flex min-w-0 flex-1 flex-col gap-6 lg:order-2">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(280px,400px)_minmax(480px,1fr)] xl:items-stretch">
      <ProfileCard className="mx-auto flex h-full w-full max-w-[320px] flex-col p-3 sm:max-w-[360px] sm:p-4 xl:mx-0 xl:max-w-full xl:min-h-0">
        <div className="flex w-full flex-1 items-center gap-0.5 xl:min-h-0">
              <SolvedProgressCard
                solved={profile.solved}
                total={profile.totalProblems}
                attempting={profile.attempting}
                easySolved={profile.easySolved}
                easyTotal={profile.easyTotal}
                mediumSolved={profile.mediumSolved}
                mediumTotal={profile.mediumTotal}
                hardSolved={profile.hardSolved}
                hardTotal={profile.hardTotal}
              />
            </div>
          </ProfileCard>

          <ProfileAchievementsBlock
            profileSlug={profile.username}
            achievements={profile.achievements}
          />
        </div>

        <SubmissionHeatmap
          profileKey={profile.username}
          heatmap={profile.heatmap}
          heatmapBySource={profile.heatmapBySource}
          currentStreak={profile.currentStreak}
          maxStreak={profile.maxStreak}
        />

        <ProfileExperienceSection
          items={profile.experience}
          canEdit={canEdit}
          onAdd={() => setAddExperienceOpen(true)}
          onDelete={
            canEdit
              ? (id, label) => deleteItem.requestDelete("experiences", id, label)
              : undefined
          }
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ProfileEducationSection
            items={profile.education}
            canEdit={canEdit}
            onAdd={() => setAddEducationOpen(true)}
            onDelete={
              canEdit
                ? (id, label) => deleteItem.requestDelete("educations", id, label)
                : undefined
            }
          />
          <ProfileCertificationsSection
            items={profile.certifications}
            canEdit={canEdit}
            onAdd={() => setAddCertificationOpen(true)}
            onDelete={
              canEdit
                ? (id, label) => deleteItem.requestDelete("certifications", id, label)
                : undefined
            }
          />
        </div>

        <ProfileTechSkillsSection
          skills={profile.techSkills}
          canEdit={canEdit}
          onAdd={() => setAddSkillOpen(true)}
          onDelete={
            canEdit
              ? (id, label) => deleteItem.requestDelete("skills", id, label)
              : undefined
          }
        />

        <div className="flex justify-center pb-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-white"
          >
            Show all
            <span aria-hidden>→</span>
          </button>
        </div>
      </main>

      <ContactInfoModal
        open={contactViewOpen}
        onOpenChange={setContactViewOpen}
        contacts={profile.contacts}
        canEdit={canEdit}
        onEdit={() => {
          setContactViewOpen(false);
          setContactEditOpen(true);
        }}
      />

      <PersonalInfoModal
        open={personalViewOpen}
        onOpenChange={setPersonalViewOpen}
        personal={profile.personal}
        canEdit={canEdit}
        onEdit={() => {
          setPersonalViewOpen(false);
          setPersonalEditOpen(true);
        }}
      />

      <ProfileConfirmDialog
        open={Boolean(deleteItem.pending)}
        title={
          deleteItem.pending ? `Delete ${deleteItem.pending.label}?` : "Delete item?"
        }
        isLoading={deleteItem.isDeleting}
        error={deleteItem.error}
        onConfirm={deleteItem.confirmDelete}
        onCancel={deleteItem.cancelDelete}
      />

      {canEdit ? (
        <>
          <EditProfileBasicsModal
            open={editBasicsOpen}
            onOpenChange={setEditBasicsOpen}
          />
          <EditProfileAboutModal
            open={editAboutOpen}
            onOpenChange={setEditAboutOpen}
          />
          <AddProfileCertificationModal
            open={addCertificationOpen}
            onOpenChange={setAddCertificationOpen}
          />
          <AddProfileEducationModal
            open={addEducationOpen}
            onOpenChange={setAddEducationOpen}
          />
          <AddProfileExperienceModal
            open={addExperienceOpen}
            onOpenChange={setAddExperienceOpen}
          />
          <AddProfileLanguageModal
            open={addLanguageOpen}
            onOpenChange={setAddLanguageOpen}
          />
          <AddProfileSkillModal
            open={addSkillOpen}
            onOpenChange={setAddSkillOpen}
          />
          <EditProfileContactsModal
            open={contactEditOpen}
            onOpenChange={setContactEditOpen}
            contacts={profile.contacts}
          />
          <EditProfilePersonalModal
            open={personalEditOpen}
            onOpenChange={setPersonalEditOpen}
            personal={profile.personal}
          />
        </>
      ) : null}
    </div>
  );
}
