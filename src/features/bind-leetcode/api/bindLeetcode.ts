import { bindLeetcodeAccount } from "@/shared/lib/api/platformData";
import { parseBindVerificationToken } from "@/shared/lib/integration/parseBindVerificationToken";

export interface LeetcodeBindResult {
  token: string;
}

export async function bindLeetcode(
  accessToken: string,
  username: string,
): Promise<LeetcodeBindResult> {
  const raw = await bindLeetcodeAccount(accessToken, { username });
  return { token: parseBindVerificationToken(raw) };
}
