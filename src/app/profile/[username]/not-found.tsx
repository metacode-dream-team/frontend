import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-zinc-100">
      <h1 className="text-2xl font-bold">Profile not found</h1>
      <p className="mt-2 text-sm text-zinc-400">
        This user does not exist or the profile is unavailable.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
      >
        Back to home
      </Link>
    </div>
  );
}
