import {
  ProfileRouteClientLoader,
} from "@/widgets/profile-page";

// import { notFound } from "next/navigation";
// import {
//   getProfileById,
//   getProfileErrorStatus,
//   isProfileNotFoundError,
//   isProfileUnauthorizedError,
// } from "@/shared/lib/api/profileApi";
// import {
//   ProfileLoadError,
//   ProfileRouteView,
// } from "@/widgets/profile-page";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const id = decodeURIComponent(username);

  // TODO: просмотр чужого профиля — временно отключён. Вернуть SSR-загрузку через getProfileById + ProfileRouteView.
  // try {
  //   const profile = await getProfileById(id);
  //   return <ProfileRouteView routeUsername={id} initialProfile={profile} />;
  // } catch (error) {
  //   if (isProfileNotFoundError(error)) {
  //     notFound();
  //   }
  //   if (isProfileUnauthorizedError(error)) {
  //     return <ProfileRouteClientLoader routeUsername={id} />;
  //   }
  //   const status = getProfileErrorStatus(error);
  //   console.warn(`[Profile] upstream ${status ?? "error"} for @${id}`);
  //   return <ProfileLoadError username={id} status={status} />;
  // }

  return <ProfileRouteClientLoader routeUsername={id} />;
}
