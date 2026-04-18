import { ForgotPasswordForm } from "@/features/auth/forgot-password";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-zinc-100">
      <div className="w-full max-w-[440px] rounded-2xl border border-zinc-800/90 bg-[#161618] px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_48px_rgba(0,0,0,0.45)]">
        <ForgotPasswordForm />
        <p className="mt-8 text-center text-sm text-zinc-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#c4a3f7] transition-colors hover:text-[#dcc4ff]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
