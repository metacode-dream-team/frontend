export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  externalUrl?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
  parentId: string | null;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  isPublic: boolean;
  upvotes: number;
  isUpvoted: boolean;
  isFavorited: boolean;
  nodes: RoadmapNode[];
}

export type RoadmapSort = "upvotes" | "newest";

export interface RoadmapProgress {
  completed: number;
  total: number;
  percent: number;
}
