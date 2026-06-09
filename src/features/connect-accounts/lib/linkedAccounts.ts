export interface LinkedAccount {
  provider: "github" | "leetcode" | "monkeytype";
  label: string;
  username: string | null;
  connected: boolean;
}

export function resolveLinkedAccounts(
  links: { provider: string; username: string | null }[] | undefined,
): LinkedAccount[] {
  const byProvider = new Map<string, string | null>();
  for (const l of links ?? []) {
    byProvider.set(l.provider.toLowerCase(), l.username?.trim() || null);
  }

  const providers: Array<Omit<LinkedAccount, "username" | "connected">> = [
    { provider: "github", label: "GitHub" },
    { provider: "leetcode", label: "LeetCode" },
    { provider: "monkeytype", label: "Monkeytype" },
  ];

  return providers.map((p) => {
    const raw = byProvider.get(p.provider);
    return {
      ...p,
      username: raw ?? null,
      connected: Boolean(raw),
    };
  });
}
