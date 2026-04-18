import { getProfileById } from "@/shared/lib/api/profileApi";
import { ProfilePageContent } from "@/widgets/profile-page";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <ProfilePageContent profile={profile} />
      </div>
    </div>
  );
}
