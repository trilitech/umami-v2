type TokenBase = {
  contract: string;
  balance: string;
};

type TokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
};

type NFTMetadata = {
  name?: string;
  symbol?: string;
  displayUri: string;
};

export type FA12Token = {
  type: "fa1.2";
  metadata?: TokenMetadata;
} & TokenBase;

export type FA2Token = TokenBase & {
  type: "fa2";
  tokenId: string;
  metadata: TokenMetadata;
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
  return t.type === "fa1.2" ? "FA1.2 token" : t.metadata.name || "FA2 token";
};

export const getTokenSymbol = (t: FA2Token | FA12Token) => {
  return t.type === "fa1.2" ? DEFAULT_SYMBOL : t.metadata.symbol || "FA2";
};

export const formatTokenAmount = (
  amountStr: string,
  decimals = DEFAULT_TOKEN_DECIMALS
) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const getTokenPrettyAmmount = (
  t: FA2Token | FA12Token,
  options?: { showSymbol?: boolean }
) => {
  const symbol = getTokenSymbol(t);
  const amount = t.balance;
  const decimals = t.type === "fa2" ? t.metadata.decimals : undefined;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};
export type Asset = FA12Token | FA2Token | NFT;

// We use the defaults of FA1.2 tokens as in V1
export const DEFAULT_SYMBOL = "KLD";
export const DEFAULT_TOKEN_DECIMALS = "4";
