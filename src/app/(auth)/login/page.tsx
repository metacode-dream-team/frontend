import { LoginForm } from "@/features/auth/login";
import { SocialLoginButtons } from "@/features/auth/social-login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />
        <SocialLoginButtons />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/forgot-password"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
