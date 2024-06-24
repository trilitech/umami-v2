import { type RawTzktTokenBalance } from "@umami/tzkt";

import { type FA12Token, type FA2Token, type NFT, fromRawToken as fromRawToken } from "./Token";

type Balance = { balance: string; lastLevel?: number };
export type FA12TokenBalance = FA12Token & Balance;
export type FA2TokenBalance = FA2Token & Balance;
export type NFTBalance = NFT & Balance;
export type TokenBalanceWithToken = FA12TokenBalance | FA2TokenBalance | NFTBalance;
export type TokenBalance = Pick<TokenBalanceWithToken, "contract" | "tokenId" | "balance">;

export const fromRawTokenBalance = (raw: RawTzktTokenBalance): TokenBalanceWithToken | null => {
  const token = fromRawToken(raw.token);
  if (!token || !raw.balance) {
    return null;
  }

  return { balance: raw.balance, lastLevel: raw.lastLevel, ...token };
};
