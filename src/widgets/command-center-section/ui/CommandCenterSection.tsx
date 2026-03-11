"use client";

import Link from "next/link";

const SIDEBAR_ICONS = [
  {
    id: "grid",
    active: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "chart",
    active: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: "trophy",
    active: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 9v6m12-6v6M6 15a6 6 0 0 0 12 0" />
        <path d="M6 21h12" />
      </svg>
    ),
  },
  {
    id: "person",
    active: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    id: "lightning",
    active: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const LEADERBOARD_ROWS = [
  { rank: 1, progress: 92 },
  { rank: 2, progress: 85 },
  { rank: 3, progress: 78 },
  { rank: 4, progress: 70 },
  { rank: 5, progress: 65 },
];

export function CommandCenterSection() {
  return (
    <section className="bg-black py-20 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            The Developer Command Center
          </h2>
          <p className="mt-3 text-zinc-500">
            Everything you need to showcase your talent, available in one sleek dashboard.
          </p>
        </div>

        {/* Dashboard card */}
        <div
          className="overflow-hidden rounded-2xl border border-[#222]"
          style={{ backgroundColor: "#0f0f0f" }}
        >
          {/* Mac-style top bar */}
          <div className="flex items-center gap-2 border-b border-[#222] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>

          <div className="flex min-h-[400px]">
            {/* Left sidebar */}
            <div
              className="flex w-[60px] flex-col items-center gap-4 border-r border-[#222] py-6"
              style={{ backgroundColor: "#0a0a0a" }}
            >
              {SIDEBAR_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    item.active ? "text-[#7c3aed]" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
              {/* Left column ~65% */}
              <div className="flex flex-1 flex-col gap-4" style={{ minWidth: 0 }}>
                {/* Current tier card */}
                <div
                  className="flex items-center justify-between rounded-xl p-5"
                  style={{ backgroundColor: "#1e1040" }}
                >
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#7c3aed" }}
                    >
                      Current Tier
                    </p>
                    <p className="mt-1 text-xl font-bold text-white">Elite Developer</p>
                  </div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 9v6m12-6v6M6 15a6 6 0 0 0 12 0" />
                    <path d="M6 21h12" />
                  </svg>
                </div>

                {/* Placeholder cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-[150px] rounded-xl"
                    style={{ backgroundColor: "#161616" }}
                  />
                  <div
                    className="h-[150px] rounded-xl"
                    style={{ backgroundColor: "#161616" }}
                  />
                </div>
              </div>

              {/* Right column ~35% */}
              <div className="w-full lg:w-[35%] lg:min-w-[200px]">
                <h3 className="mb-4 font-bold text-white">Leaderboard Position</h3>
                <div className="flex flex-col gap-4">
                  {LEADERBOARD_ROWS.map((row) => (
                    <div key={row.rank} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-sm text-zinc-500">#{row.rank}</span>
                      <div
                        className="h-7 w-7 shrink-0 rounded-full"
                        style={{ backgroundColor: "#2a2a2a" }}
                      />
                      <div
                        className="h-2 flex-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: "#2a2a2a" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.progress}%`,
                            backgroundColor: "#7c3aed",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3 font-medium text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "#7c3aed" }}
          >
            Launch Dashboard
            <span className="text-lg">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
