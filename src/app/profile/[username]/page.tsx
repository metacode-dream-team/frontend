import { getProfileById } from "@/shared/lib/api/profileApi";
import { ProfileRouteView } from "@/widgets/profile-page";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);
  const profile = await getProfileById(id);

  return <ProfileRouteView routeUsername={id} initialProfile={profile} />;
}
