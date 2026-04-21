import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · MetaCode",
  description:
    "Learn how MetaCode collects, uses, and protects your personal information.",
};

const PARAGRAPHS = [
  "Your privacy is important to us. This Privacy Policy explains how MetaCode collects, uses, and protects your information.",
  "When you use MetaCode, we may collect basic account information such as your name, email address, and authentication data. If you connect third-party services, we may also access publicly available data or data explicitly authorized by you, such as activity statistics or profile information.",
  "This information is used to provide and improve the platform, personalize your experience, and display relevant analytics and progress insights. We do not sell your personal data to third parties.",
  "MetaCode may use cookies and similar technologies to enhance user experience, maintain sessions, and analyze usage patterns. You can control cookie behavior through your browser settings.",
  "We implement reasonable security measures to protect your data, including secure authentication and controlled access to sensitive information. However, no system can guarantee absolute security, and users share information at their own risk.",
  "We may retain your data for as long as your account is active or as necessary to provide the service. You may request deletion of your account and associated data at any time.",
  "In certain cases, we may share limited information with trusted service providers who help us operate the platform, such as hosting or analytics services. These providers are obligated to handle your data securely.",
  "By using MetaCode, you agree to the terms outlined in this Privacy Policy. If you have any questions or requests regarding your data, you may contact us through the platform.",
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-6 flex justify-center">
          <span
            className="rounded-full border px-4 py-1.5 text-sm font-medium text-zinc-300"
            style={{ borderColor: "#7c3aed", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
          >
            Legal
          </span>
        </div>

        <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-500">
          How we collect, use, and safeguard your information.
        </p>

        <article className="space-y-6 text-[15px] leading-7 text-zinc-300">
          {PARAGRAPHS.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
