import { notFound } from "next/navigation";
import {
  getProfileById,
  getProfileErrorStatus,
  isProfileNotFoundError,
} from "@/shared/lib/api/profileApi";
import { ProfileAchievementsRouteView, ProfileLoadError } from "@/widgets/profile-page";

interface AchievementsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfileAchievementsPage({ params }: AchievementsPageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);

  try {
    const profile = await getProfileById(id);
    return <ProfileAchievementsRouteView routeUsername={id} initialProfile={profile} />;
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      notFound();
    }
    const status = getProfileErrorStatus(error);
    console.warn(`[Profile] achievements upstream ${status ?? "error"} for @${id}`);
    return <ProfileLoadError username={id} status={status} />;
  }
}
