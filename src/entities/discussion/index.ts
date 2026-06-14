export type {
  DiscussionAuthor,
  DiscussionCategory,
  DiscussionComment,
  DiscussionData,
  DiscussionPost,
  DiscussionSort,
  VoteKind,
} from "./model/types";
export { DISCUSSION_CATEGORIES, DISCUSSION_SORT_OPTIONS } from "./model/types";
export {
  loadDiscussionData,
  normalizePostVotes,
  saveDiscussionData,
} from "./lib/discussionStorage";
export {
  commentCount,
  filterAndSortPosts,
  getTopPosts,
  toggleVote,
  voteScore,
} from "./lib/discussionUtils";
