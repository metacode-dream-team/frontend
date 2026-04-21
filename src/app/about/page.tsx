import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · MetaCode",
  description:
    "MetaCode is a modern web platform for developers to track their growth, stay consistent, and follow structured learning paths.",
};

const PARAGRAPHS = [
  "MetaCode is a modern web platform designed to help developers track their growth, stay consistent, and build structured learning paths in an increasingly complex tech landscape. As the volume of information and available resources continues to grow, many developers struggle with direction, motivation, and progress visibility. MetaCode addresses these challenges by combining learning, tracking, and community features into a single, cohesive environment.",
  "At its core, MetaCode provides a personalized dashboard where users can monitor their activity across multiple platforms such as GitHub, LeetCode, and typing tools. This unified view allows developers to better understand their progress, identify gaps, and maintain consistency in their daily practice. By aggregating data from different sources, the platform transforms scattered efforts into a clear and measurable development journey.",
  "One of the key aspects of MetaCode is its roadmap system. Instead of learning randomly, users can follow structured paths tailored to specific goals, whether it's mastering frontend development, preparing for technical interviews, or improving problem-solving skills. These roadmaps are designed to be interactive and adaptable, allowing users to track progress, mark completed steps, and stay focused on long-term objectives.",
  "The platform is built with a strong emphasis on scalability, performance, and maintainability. Its frontend architecture follows modern engineering principles, separating business logic from user interface components and organizing the codebase into clearly defined layers. This approach not only improves reliability and performance but also ensures that the system can evolve as new features and integrations are introduced.",
  "Security and user experience are also fundamental priorities. MetaCode uses modern authentication mechanisms and optimized data handling to provide a seamless and safe interaction for users. At the same time, the interface is designed to be intuitive, responsive, and visually consistent across devices, making the platform accessible to both beginners and experienced developers.",
  "Ultimately, MetaCode is more than just a tracking tool — it is a growth ecosystem. It encourages discipline, clarity, and continuous improvement by giving developers the structure and insights they need to move forward with confidence. As the platform evolves, it aims to become a central hub for learning, practice, and professional development in the tech community.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-6 flex justify-center">
          <span
            className="rounded-full border px-4 py-1.5 text-sm font-medium text-zinc-300"
            style={{ borderColor: "#7c3aed", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
          >
            Our Story
          </span>
        </div>

        <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          About MetaCode
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-500">
          Your Dev Journey, Visualized — a single ecosystem for tracking, learning, and growth.
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
