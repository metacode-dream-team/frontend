import { getProfileById } from "@/shared/lib/api/profileApi";
import { ProfileAchievementsPageContent } from "@/widgets/profile-page/ui/profile-achievements-page-content";

interface AchievementsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfileAchievementsPage({ params }: AchievementsPageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);
  const profile = await getProfileById(id);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <ProfileAchievementsPageContent
          profileId={profile.id}
          username={profile.username}
          achievements={profile.achievements}
        />
      </div>
    </div>
  );
}
