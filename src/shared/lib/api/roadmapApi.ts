import type { Roadmap, RoadmapNode, RoadmapTask } from "@/entities/roadmap";
import { mockRoadmaps } from "./mockRoadmaps";

export interface CreateRoadmapPayload {
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  tags?: string[];
  nodes: Array<{
    title: string;
    description: string;
    parentId: string | null;
    tasks: Array<{
      title: string;
      description: string;
      externalUrl?: string;
    }>;
  }>;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cloneRoadmaps(data: Roadmap[]): Roadmap[] {
  return JSON.parse(JSON.stringify(data)) as Roadmap[];
}

function slugId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getRoadmaps(): Promise<Roadmap[]> {
  await delay(450);
  return cloneRoadmaps(mockRoadmaps);
}

export async function saveRoadmap(payload: CreateRoadmapPayload): Promise<Roadmap> {
  await delay(900);

  const nodes: RoadmapNode[] = payload.nodes.map((node) => ({
    id: slugId("node"),
    title: node.title,
    description: node.description,
    parentId: node.parentId,
    tasks: node.tasks.map(
      (task): RoadmapTask => ({
        id: slugId("task"),
        title: task.title,
        description: task.description,
        externalUrl: task.externalUrl,
        isCompleted: false,
      }),
    ),
  }));

  const roadmap: Roadmap = {
    id: slugId("rm"),
    title: payload.title,
    description: payload.description,
    category: payload.category,
    tags: payload.tags ?? [],
    author: "you",
    createdAt: new Date().toISOString(),
    isPublic: payload.isPublic,
    upvotes: 0,
    isUpvoted: false,
    isFavorited: false,
    nodes,
  };

  return roadmap;
}

export async function toggleFavoriteRoadmap(_: string): Promise<void> {
  await delay(200);
}

export async function toggleUpvoteRoadmap(_: string): Promise<void> {
  await delay(200);
}
