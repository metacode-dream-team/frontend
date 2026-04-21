import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · MetaCode",
  description:
    "The rules and conditions under which you may use MetaCode — please review before using the service.",
};

const PARAGRAPHS = [
  "Welcome to MetaCode. By accessing or using the platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use the service.",
  "MetaCode provides tools for tracking developer activity, managing learning roadmaps, and visualizing progress across different platforms. The service is intended for personal and non-commercial use unless otherwise explicitly agreed.",
  "Users are responsible for maintaining the confidentiality of their account and for all activities that occur under it. You agree not to use the platform for any unlawful, harmful, or abusive behavior, including attempting to disrupt the system, access unauthorized data, or misuse integrations.",
  "MetaCode may integrate with third-party services such as GitHub or other developer platforms. By connecting your accounts, you authorize MetaCode to access and process relevant data in accordance with your permissions on those services. MetaCode is not responsible for the availability, accuracy, or policies of third-party platforms.",
  "We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We may also update these Terms from time to time. Continued use of the platform after changes implies acceptance of the updated Terms.",
  "The service is provided \u201Cas is\u201D without warranties of any kind. While we strive for reliability and accuracy, we do not guarantee that the platform will always be available, error-free, or fully secure.",
  "To the maximum extent permitted by law, MetaCode shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform.",
];

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-500">
          Please read these terms carefully before using MetaCode.
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
