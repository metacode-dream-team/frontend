import type { DiscussionCategory, DiscussionSort } from "@/entities/discussion";

export function buildDiscussionsAllHref(options: {
  sort?: DiscussionSort;
  category?: DiscussionCategory | "all";
  query?: string;
}): string {
  const params = new URLSearchParams();
  if (options.sort) params.set("sort", options.sort);
  if (options.category) params.set("category", options.category);
  const q = options.query?.trim();
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/feed/discussions?${qs}` : "/feed/discussions";
}

export function parseDiscussionsSearchParams(searchParams: URLSearchParams): {
  sort: DiscussionSort;
  category: DiscussionCategory | "all";
  query: string;
} {
  const sortRaw = searchParams.get("sort");
  const categoryRaw = searchParams.get("category");
  const sort: DiscussionSort =
    sortRaw === "new" || sortRaw === "comments" || sortRaw === "top" ? sortRaw : "top";
  const category: DiscussionCategory | "all" =
    categoryRaw === "general" ||
    categoryRaw === "help" ||
    categoryRaw === "showcase" ||
    categoryRaw === "feedback"
      ? categoryRaw
      : "all";
  return {
    sort,
    category,
    query: searchParams.get("q")?.trim() ?? "",
  };
}
