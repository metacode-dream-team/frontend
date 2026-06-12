"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils/cn";

const FAQ_ITEMS = [
  {
    id: "platforms",
    question: "Which platforms are supported?",
    answer: "GitHub, LeetCode, and Monkeytype.",
  },
  {
    id: "free",
    question: "Is it free?",
    answer: "Yes — profile, integrations, streak, and leaderboard are free.",
  },
  {
    id: "streak",
    question: "How does the streak work?",
    answer:
      "One commit, one LeetCode solve, or 10 Monkeytype tests per day keeps your streak alive.",
  },
  {
    id: "security",
    question: "Is my data secure?",
    answer: "We use OAuth for connections and secure token handling.",
  },
  {
    id: "all-platforms",
    question: "Do I need all three platforms?",
    answer: "No — connect any combination. Stats and streak count activity from every linked account.",
  },
  {
    id: "connect",
    question: "How do I connect my accounts?",
    answer:
      "Sign in, open Connect in the header, and authorize GitHub, LeetCode, or Monkeytype via OAuth.",
  },
] as const;

export function FaqTrustSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">FAQ</h2>
        <p className="mt-3 text-center text-sm text-zinc-500">
          Secure OAuth · Free to use · Built for developers
        </p>

        <div className="mt-10 divide-y divide-zinc-800/80">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-zinc-200">{item.question}</span>
                  <span
                    className={cn(
                      "shrink-0 text-zinc-500 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
                {isOpen ? (
                  <p className="pb-4 text-sm leading-relaxed text-zinc-500">{item.answer}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
