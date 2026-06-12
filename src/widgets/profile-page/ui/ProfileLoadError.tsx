import Link from "next/link";

interface ProfileLoadErrorProps {
  username: string;
  status?: number | null;
}

export function ProfileLoadError({ username, status }: ProfileLoadErrorProps) {
  const isGateway = status === 502 || status === 503;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-zinc-100">
      <h1 className="text-2xl font-bold">
        {isGateway ? "Profile service unavailable" : "Failed to load profile"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {isGateway
          ? "The backend gateway could not reach the profile service. Try again in a moment."
          : "We could not load this profile right now."}
      </p>
      <p className="mt-4 font-mono text-xs text-zinc-500">
        @{username}
        {status ? ` · HTTP ${status}` : null}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/profile/${encodeURIComponent(username)}`}
          className="text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Try again
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
