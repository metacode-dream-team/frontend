import {
  ProfileAchievementsClientLoader,
} from "@/widgets/profile-page";

// import { notFound } from "next/navigation";
// import {
//   getProfileById,
//   getProfileErrorStatus,
//   isProfileNotFoundError,
//   isProfileUnauthorizedError,
// } from "@/shared/lib/api/profileApi";
// import {
//   ProfileAchievementsRouteView,
//   ProfileLoadError,
// } from "@/widgets/profile-page";

interface AchievementsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfileAchievementsPage({ params }: AchievementsPageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);

  // TODO: просмотр чужого профиля — временно отключён. Вернуть SSR через getProfileById + ProfileAchievementsRouteView.
  // try {
  //   const profile = await getProfileById(id);
  //   return <ProfileAchievementsRouteView routeUsername={id} initialProfile={profile} />;
  // } catch (error) {
  //   if (isProfileNotFoundError(error)) {
  //     notFound();
  //   }
  //   if (isProfileUnauthorizedError(error)) {
  //     return <ProfileAchievementsClientLoader routeUsername={id} />;
  //   }
  //   const status = getProfileErrorStatus(error);
  //   console.warn(`[Profile] achievements upstream ${status ?? "error"} for @${id}`);
  //   return <ProfileLoadError username={id} status={status} />;
  // }

  return <ProfileAchievementsClientLoader routeUsername={id} />;
}
