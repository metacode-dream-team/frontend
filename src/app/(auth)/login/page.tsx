import { LoginForm } from "@/features/auth/login";
import { SocialLoginButtons } from "@/features/auth/social-login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-zinc-100">
      <div className="w-full max-w-[440px] rounded-2xl border border-zinc-800/90 bg-[#161618] px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_48px_rgba(0,0,0,0.45)]">
        <LoginForm />
        <SocialLoginButtons mode="login" />
        <p className="mt-8 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#c4a3f7] transition-colors hover:text-[#dcc4ff]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
