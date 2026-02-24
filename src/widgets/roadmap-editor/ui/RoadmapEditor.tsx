"use client";

import { useMemo, useState } from "react";
import type { Roadmap } from "@/entities/roadmap";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { saveRoadmap, type CreateRoadmapPayload } from "@/shared/lib/api/roadmapApi";

interface RoadmapEditorProps {
  onRoadmapCreated: (roadmap: Roadmap) => void;
}

interface NodeDraft {
  id: string;
  title: string;
  description: string;
  parentId: string | null;
  tasks: Array<{
    title: string;
    description: string;
    externalUrl?: string;
  }>;
}

function makeDraftId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

export function RoadmapEditor({ onRoadmapCreated }: RoadmapEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [isPublic, setIsPublic] = useState(true);

  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [parentNodeId, setParentNodeId] = useState<string>("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskExternalUrl, setTaskExternalUrl] = useState("");

  const [nodes, setNodes] = useState<NodeDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canAddNode = nodeTitle.trim() && taskTitle.trim();
  const canSave = title.trim() && description.trim() && nodes.length > 0;

  const parentOptions = useMemo(
    () => nodes.map((item) => ({ label: item.title, value: item.id })),
    [nodes],
  );

  const addNode = () => {
    if (!canAddNode) return;

    const id = makeDraftId("draft-node");

    setNodes((prev) => [
      ...prev,
      {
        id,
        title: nodeTitle.trim(),
        description: nodeDescription.trim() || "No description yet",
        parentId: parentNodeId || null,
        tasks: [
          {
            title: taskTitle.trim(),
            description: taskDescription.trim() || "Practice task",
            externalUrl: taskExternalUrl.trim() || undefined,
          },
        ],
      },
    ]);

    setNodeTitle("");
    setNodeDescription("");
    setParentNodeId("");
    setTaskTitle("");
    setTaskDescription("");
    setTaskExternalUrl("");
  };

  const onSave = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);

    const payload: CreateRoadmapPayload = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "Custom",
      isPublic,
      nodes: nodes.map((node) => ({
        title: node.title,
        description: node.description,
        parentId: node.parentId,
        tasks: node.tasks,
      })),
    };

    try {
      const roadmap = await saveRoadmap(payload);
      onRoadmapCreated(roadmap);
      setToast("Roadmap saved successfully");
      setTitle("");
      setDescription("");
      setCategory("Custom");
      setIsPublic(true);
      setNodes([]);
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Roadmap Editor</h2>
        <p className="text-sm text-slate-400">Create a roadmap with nodes and task checklist.</p>
      </div>

      <div className="space-y-3">
        <Input
          label="Roadmap title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Frontend Interview Sprint"
          className="bg-slate-900"
        />
        <Input
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="4-week plan for JS/React interview prep"
          className="bg-slate-900"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="bg-slate-900"
          />
          <label className="text-sm text-slate-300">
            Privacy
            <select
              value={isPublic ? "public" : "private"}
              onChange={(event) => setIsPublic(event.target.value === "public")}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Add Node</h3>
        <div className="mt-3 grid gap-3">
          <Input
            label="Node title"
            value={nodeTitle}
            onChange={(event) => setNodeTitle(event.target.value)}
            className="bg-slate-900"
          />
          <Input
            label="Node description"
            value={nodeDescription}
            onChange={(event) => setNodeDescription(event.target.value)}
            className="bg-slate-900"
          />
          <label className="text-sm text-slate-300">
            Parent node
            <select
              value={parentNodeId}
              onChange={(event) => setParentNodeId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            >
              <option value="">No parent (root)</option>
              {parentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-lg border border-slate-800 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">First task</h4>
            <div className="mt-2 grid gap-2">
              <Input
                label="Task title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                className="bg-slate-900"
              />
              <Input
                label="Task description"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                className="bg-slate-900"
              />
              <Input
                label="External URL (optional)"
                value={taskExternalUrl}
                onChange={(event) => setTaskExternalUrl(event.target.value)}
                className="bg-slate-900"
                placeholder="https://leetcode.com/problems/two-sum/"
              />
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={addNode} disabled={!canAddNode}>
            Add node
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {nodes.map((node, index) => (
            <div key={node.id} className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200">
              {index + 1}. {node.title} ({node.tasks.length} task)
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">Save is mocked with timeout and stores roadmap locally.</p>
        <Button onClick={onSave} isLoading={isSaving} disabled={!canSave}>
          Save roadmap
        </Button>
      </div>

      {toast ? (
        <div className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
