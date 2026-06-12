import { bindMonkeytypeAccount } from "@/shared/lib/api/platformData";
import { parseBindVerificationToken } from "@/shared/lib/integration/parseBindVerificationToken";

export interface MonkeytypeBindResult {
  token: string;
}

export async function bindMonkeytype(
  accessToken: string,
  username: string,
): Promise<MonkeytypeBindResult> {
  const raw = await bindMonkeytypeAccount(accessToken, { username });
  return { token: parseBindVerificationToken(raw) };
}
