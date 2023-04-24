type TokenBase = {
  contract: string;
  balance: string;
};

type FA2TokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
};

type NFTMetadata = {
  name?: string;
  symbol?: string;
  displayUri: string;
};

export type FA12Token = { type: "fa1.2" } & TokenBase;

export type FA2Token = TokenBase & {
  type: "fa2";
  tokenId: string;
  metadata: FA2TokenMetadata;
};
export type NFT = TokenBase & {
  type: "nft";
  tokenId: string;
  metadata: NFTMetadata;
  owner: string;
};

export const keepNFTs = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "nft") as NFT[]; // This sucks
};
export const keepFA1s = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "fa1.2") as FA12Token[]; // This sucks
};

export const keepFA2s = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "fa2") as FA2Token[]; // This sucks
};

export const getTokenName = (t: FA2Token | FA12Token) => {
  return t.type === "fa1.2" ? "FA1" : t.metadata.name || "Unknown Token)";
};

export const getTokenSymbol = (t: FA2Token | FA12Token) => {
  return t.type === "fa1.2"
    ? "KLD"
    : t.metadata.symbol || "Unknown Token Symbol";
};

export const getTokenDecimal = (t: FA2Token | FA12Token) => {
  return t.type === "fa1.2"
    ? 4
    : t.metadata.decimals !== undefined
    ? Number(t.metadata.decimals)
    : 4;
};

export const getTokenPrettyAmmount = (
  t: FA2Token | FA12Token,
  options?: { showSymbol?: boolean }
) => {
  const symbol = getTokenSymbol(t);
  const amount = Number(t.balance);
  const decimals = getTokenDecimal(t);
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  return `${amount / Math.pow(10, decimals)}${trailingSymbol}`;
};
export type Asset = FA12Token | FA2Token | NFT;
