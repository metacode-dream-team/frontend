import { Suspense } from "react";

import { DiscussionsAllPageContent } from "@/widgets/discussions-panel";

export default function DiscussionsAllPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DiscussionsAllPageContent />
    </Suspense>
  );
}
