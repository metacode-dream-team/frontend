import { getProfileById } from "@/shared/lib/api/profileApi";
import { ProfileAchievementsRouteView } from "@/widgets/profile-page";

interface AchievementsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfileAchievementsPage({ params }: AchievementsPageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);
  const profile = await getProfileById(id);

  return <ProfileAchievementsRouteView routeUsername={id} initialProfile={profile} />;
}
