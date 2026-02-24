"use client";

import { useRoadmapStore } from "@/entities/roadmap";

interface TaskProgressCheckboxProps {
  roadmapId: string;
  nodeId: string;
  taskId: string;
  isChecked: boolean;
}

export function TaskProgressCheckbox({
  roadmapId,
  nodeId,
  taskId,
  isChecked,
}: TaskProgressCheckboxProps) {
  const toggleTask = useRoadmapStore((state) => state.toggleTask);

  return (
    <button
      aria-label="toggle task"
      onClick={() => toggleTask(roadmapId, nodeId, taskId)}
      className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-600 bg-slate-900"
    >
      {isChecked ? <span className="text-sm text-emerald-300">✓</span> : null}
    </button>
  );
}
