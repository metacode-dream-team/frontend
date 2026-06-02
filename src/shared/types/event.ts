export type EventType =
  | "GITHUB_COMMIT"
  | "LEETCODE_SOLVE"
  | "ROADMAP_CREATE"
  | "ROADMAP_FAVORITE"
  | "MONKEYTYPE_RECORD"
  | "DISCUSSION_CREATE"
  | "ACHIEVEMENT_GRANTED"
  | "AVATAR_UPDATED"
  | "DISCUSSION_CREATED";

export interface BaseEvent {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  createdAt: string;
  type: EventType;
}

export interface GithubEvent extends BaseEvent {
  type: "GITHUB_COMMIT";
  payload: {
    commitCount: number;
    repository: string;
    repositoryUrl?: string;
  };
}

export interface LeetcodeEvent extends BaseEvent {
  type: "LEETCODE_SOLVE";
  payload: {
    problemTitle: string;
    difficulty: "Easy" | "Medium" | "Hard";
    problemSlug?: string;
  };
}

export interface RoadmapCreateEvent extends BaseEvent {
  type: "ROADMAP_CREATE";
  payload: {
    roadmapTitle: string;
    roadmapId: string;
    roadmapSlug?: string;
  };
}

export interface RoadmapFavoriteEvent extends BaseEvent {
  type: "ROADMAP_FAVORITE";
  payload: {
    roadmapTitle: string;
    roadmapId: string;
    roadmapSlug?: string;
  };
}

export interface MonkeytypeEvent extends BaseEvent {
  type: "MONKEYTYPE_RECORD";
  payload: {
    wpm: number;
    mode: string;
    accuracy?: number;
  };
}

/** Legacy mock shape */
export interface DiscussionEvent extends BaseEvent {
  type: "DISCUSSION_CREATE";
  payload: {
    discussionTitle: string;
    discussionId: string;
    discussionSlug?: string;
  };
}

export interface AchievementGrantedEvent extends BaseEvent {
  type: "ACHIEVEMENT_GRANTED";
  payload: {
    name: string;
    description: string;
    achievementId?: string;
  };
}

export interface AvatarUpdatedEvent extends BaseEvent {
  type: "AVATAR_UPDATED";
  payload: {
    avatarUrl?: string;
  };
}

export interface DiscussionCreatedEvent extends BaseEvent {
  type: "DISCUSSION_CREATED";
  payload: {
    discussionTitle: string;
    discussionId?: string;
    discussionSlug?: string;
  };
}

export type FeedEvent =
  | GithubEvent
  | LeetcodeEvent
  | RoadmapCreateEvent
  | RoadmapFavoriteEvent
  | MonkeytypeEvent
  | DiscussionEvent
  | AchievementGrantedEvent
  | AvatarUpdatedEvent
  | DiscussionCreatedEvent;

export interface GroupedEvent {
  userId: string;
  username: string;
  userAvatar: string;
  events: FeedEvent[];
  createdAt: string;
}
