import { bindLeetcodeAccount } from "@/shared/lib/api/platformData";

export async function bindLeetcode(accessToken: string, username: string) {
  return bindLeetcodeAccount(accessToken, { username });
}
