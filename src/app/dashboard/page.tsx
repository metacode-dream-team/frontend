"use client";

import { DashboardGrid } from "@/widgets/dashboard-grid";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900 p-6">
          <h1 className="text-3xl font-bold">Personal Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Customize your widgets, drag and drop layout, and track activity from GitHub, LeetCode and Monkeytype.
          </p>
        </header>

        <DashboardGrid />
      </div>
    </div>
  );
}
