import Link from "next/link";

interface ProfileRestrictedViewProps {
  username: string;
}

export function ProfileRestrictedView({ username }: ProfileRestrictedViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-zinc-100">
      <h1 className="text-2xl font-bold">Profile is private</h1>
      <p className="mt-2 max-w-md text-center text-sm text-zinc-400">
        @{username} has restricted access to their profile.
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
