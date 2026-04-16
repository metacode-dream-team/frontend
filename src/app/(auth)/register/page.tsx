import { RegisterForm } from "@/features/auth/register";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 py-12 text-zinc-100">
      <div className="w-full max-w-[440px] rounded-2xl border border-zinc-800/90 bg-[#161618] px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_48px_rgba(0,0,0,0.45)]">
        <RegisterForm />
      </div>
    </div>
  );
}
