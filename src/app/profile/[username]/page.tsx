import { notFound } from "next/navigation";
import {
  getProfileById,
  getProfileErrorStatus,
  isProfileNotFoundError,
} from "@/shared/lib/api/profileApi";
import { ProfileLoadError, ProfileRouteView } from "@/widgets/profile-page";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);

  try {
    const profile = await getProfileById(id);
    return <ProfileRouteView routeUsername={id} initialProfile={profile} />;
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      notFound();
    }
    const status = getProfileErrorStatus(error);
    console.warn(`[Profile] upstream ${status ?? "error"} for @${id}`);
    return <ProfileLoadError username={id} status={status} />;
  }
}
