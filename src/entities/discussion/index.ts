export type {
  DiscussionAuthor,
  DiscussionCategory,
  DiscussionComment,
  DiscussionData,
  DiscussionPost,
  DiscussionSort,
  ReactionCounts,
  ReactionKind,
} from "./model/types";
export {
  DISCUSSION_CATEGORIES,
  DISCUSSION_SORT_OPTIONS,
  REACTION_KINDS,
  emptyReactions,
} from "./model/types";
export {
  loadDiscussionData,
  normalizePostReactions,
  saveDiscussionData,
} from "./lib/discussionStorage";
export {
  commentCount,
  filterAndSortPosts,
  getTopPosts,
  reactionScore,
  toggleReaction,
  totalReactions,
} from "./lib/discussionUtils";
